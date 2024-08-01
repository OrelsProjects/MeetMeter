import { getServerSession } from "next-auth";
import { NextRequest, NextResponse } from "next/server";
import { authOptions } from "../../../../../../../auth/authOptions";
import axios from "axios";
import { CalendarEvent } from "../../../../../../../models/calendarEvents";
import prisma from "../../../../../_db/db";
import { sendNotification } from "../../../../../notifications/utils";
import loggerServer from "../../../../../../../loggerServer";

export async function POST(
  req: NextRequest,
  { params }: { params: { calendarId: string; eventId: string } },
) {
  const session = await getServerSession(authOptions);
  if (!session) {
    return NextResponse.json(
      { error: "Unauthorized" },
      {
        status: 401,
      },
    );
  }
  try {
    const { calendarId, eventId } = params;
    const url = `https://www.googleapis.com/calendar/v3/calendars/${calendarId}/events/${eventId}`;
    const response = await axios.get<CalendarEvent>(url, {
      headers: {
        Authorization: `Bearer ${session.user.accessToken}`,
      },
    });
    const event = response.data;
    const attendees = event.attendees?.map(attendee => attendee.email);
    const users = await prisma.user.findMany({
      where: {
        AND: [
          {
            email: {
              in: attendees,
            },
          },
          {
            NOT: {
              id: session.user.userId,
            },
          },
        ],
      },
      include: {
        meta: {
          select: {
            pushToken: true,
            pushTokenMobile: true,
          },
        },
      },
    });

    const tokens: { userId: string; token?: string }[] = users?.map(user => ({
      userId: user.id,
      token: user.meta?.pushTokenMobile || user.meta?.pushToken || undefined,
    }));

    const notificationPromises = [];

    for (const { token, userId } of tokens) {
      if (!token) {
        loggerServer.info("User not subscribed to notifications", userId);
        continue;
      }
      notificationPromises.push(
        sendNotification({
          token,
          userId,
          title: "Rate an event",
          type: "event-" + event.id,
          body:
            session.user.name ||
            "Someone" + "asks you to rate" + event.summary.slice(0, 20),
          onClickNavigateTo: `https://www.meetsmeter.com/response/${calendarId}/${eventId}`,
          data: {
            eventId: event.id,
            calendarId: calendarId,
            tag: "event-" + event.id,
          },
        }),
      );
    }

    await Promise.allSettled(notificationPromises);

    return NextResponse.json(response.data, { status: 200 });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
