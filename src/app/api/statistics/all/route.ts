import { getServerSession } from "next-auth";
import { NextRequest, NextResponse } from "next/server";
import { authOptions } from "@/auth/authOptions";
import prisma from "@/app/api/_db/db";
import { SingleEventStaistics } from "@/models/statistics";
import moment from "moment";
import { CalendarEvents } from "@/models/calendarEvents";
import axios from "axios";

export async function GET(req: NextRequest) {
  const session = await getServerSession(authOptions);
  if (!session || session.user.role !== "admin") {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }
  try {
    const user = await prisma.user.findFirst({
      where: { id: session.user.userId },
      include: {
        accounts: {
          orderBy: {
            expires_at: "desc",
          },
        },
      },
    });

    const latestAccount = user?.accounts?.[0];
    if (!latestAccount) {
      return NextResponse.json({ error: "No account found" }, { status: 404 });
    }

    const startDate = moment().startOf("week").toISOString();
    const endDate = moment().endOf("week").toISOString();

    const url = `https://www.googleapis.com/calendar/v3/calendars/primary/events?timeMin=${startDate}&timeMax=${endDate}&orderBy=startTime&singleEvents=true`;
    const response = await axios.get<CalendarEvents>(url, {
      headers: {
        Authorization: `Bearer ${latestAccount.access_token}`,
      },
    });

    const organizerEmail = session.user.email;
    const allOrganizerEvents = response.data.items
      .filter(event => event.organizer.email === organizerEmail)
      .filter(event => event.attendees?.length > 1);

    const eventsUserResponses = await prisma.userResponse.findMany({
      include: {
        user: true,
        responseEvent: {
          select: {
            eventId: true,
            start: true,
            end: true,
            summary: true,
          },
        },
      },
      where: {
        rating: {
          not: null,
        },
        responseEvent: {
          eventId: {
            in: allOrganizerEvents.map(event => event.id),
          },
        },
      },
    });

    const statistics: SingleEventStaistics[] = [];

    for (const event of allOrganizerEvents) {
      const eventUserResponses = eventsUserResponses.filter(
        userResponse => userResponse.responseEvent.eventId === event.id,
      );

      const good = eventUserResponses.filter(
        userResponse => userResponse.rating! >= 3,
      ).length;
      const bad = eventUserResponses.filter(
        userResponse => userResponse.rating! < 3,
      ).length;

      const comments = eventUserResponses.map(userResponse => ({
        comentatorName:
          userResponse.user?.name || userResponse.user?.email || "Unknown",
          response: userResponse.response,
        rating: userResponse.rating || 0,
      }));

      statistics.push({
        event,
        responseStatistics: { good, bad },
        comments,
      });
    }
    return NextResponse.json(statistics, { status: 200 });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
