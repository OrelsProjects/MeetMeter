import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/auth/authOptions";
import axios from "axios";
import prisma from "@/app/api/_db/db";
import moment from "moment";
import { CalendarEvents, CalendarEventWithMeta } from "@/models/calendarEvents";
import { canNotifyAt } from "@/app/api/utils";
import loggerServer from "../../../../../loggerServer";
import { UserResponse } from "@prisma/client";

type DateType = "day" | "week" | "month";

export async function GET(
  req: NextRequest,
  { params }: { params: { type: DateType } },
) {
  const session = await getServerSession(authOptions);
  if (!session) {
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

    const primaryCalendarUrl = `https://www.googleapis.com/calendar/v3/users/me/calendarList/primary`;
    const responsePrimary = await axios.get(primaryCalendarUrl, {
      headers: {
        Authorization: `Bearer ${latestAccount.access_token}`,
      },
    });

    const calendarBackgroundColor = responsePrimary.data.backgroundColor;
    const calendarForegroundColor = responsePrimary.data.foregroundColor;

    const now = moment.now();
    const startOfDay = moment(now)
      .startOf(params.type as DateType)
      .toISOString();
    const endOfDay = moment(now)
      .endOf(params.type as DateType)
      .toISOString();
    const url = `https://www.googleapis.com/calendar/v3/calendars/primary/events?timeMin=${startOfDay}&timeMax=${endOfDay}&orderBy=startTime&singleEvents=true`;
    const response = await axios.get<CalendarEvents>(url, {
      headers: {
        Authorization: `Bearer ${latestAccount.access_token}`,
      },
    });

    let eventsWithAttendees = response.data.items.filter(
      event => event.attendees?.length,
    );

    // check  for each event if canNotify
    for (const event of eventsWithAttendees) {
      const canNotifyAttendeesAt = await canNotifyAt(
        event.id,
        session.user.userId,
      );
      event.canNotifyAt = canNotifyAttendeesAt;
    }

    const calendarEvents: CalendarEvents = {
      ...response.data,
      items: eventsWithAttendees,
    };

    const responseEvents = await prisma.responseEvent.findMany({
      where: {
        eventId: {
          in: calendarEvents.items.map(event => event.id),
        },
      },
      include: {
        userResponse: {
          where: {
            userId: session.user.userId,
          },
        },
      },
    });

    const calendarEventItems: CalendarEventWithMeta[] = calendarEvents.items.map(
      item => {
        const responseEvent = responseEvents.find(
          response => response.eventId === item.id,
        );

        const userResponse: UserResponse | null =
          responseEvent?.userResponse?.[0] || null;

        return {
          ...item,
          response: userResponse,
        };
      },
    );

    const calendarEventsWithResponse = {
      ...calendarEvents,
      items: calendarEventItems,
    };

    const responseBody: CalendarEvents = {
      ...calendarEventsWithResponse,
      calendarBackgroundColor,
      calendarForegroundColor,
    };

    return NextResponse.json(responseBody, { status: 200 });
  } catch (error: any) {
    loggerServer.error("Error getting events", session.user.userId, error);
    console.log("Error getting events", JSON.stringify(error));
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

export function POST(req: NextRequest) {
  return NextResponse.json({ message: "Hello" });
}
