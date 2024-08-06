import { getServerSession } from "next-auth";
import { NextRequest, NextResponse } from "next/server";
import { authOptions } from "../../../../../../../auth/authOptions";
import axios from "axios";
import { CalendarEvent } from "../../../../../../../models/calendarEvents";
import prisma from "../../../../../_db/db";
import { sendNotification } from "../../../../../notifications/utils";
import loggerServer from "../../../../../../../loggerServer";

const MIN_TIME_BETWEEN_NOTIFICATIONS = 4 * 60 * 60 * 1000;

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

    const organizer = event.organizer?.email;

    if (!organizer || organizer !== session.user.email) {
      return NextResponse.json(
        { error: "Only the organizer can notify attendees" },
        { status: 401 },
      );
    }

    const lastNotification = await prisma.responseEventNotifications.findFirst({
      where: {
        responseEvent: {
          eventId,
          calendarId,
        },
        sentBy: session.user.userId,
      },
      orderBy: {
        sentAt: "desc",
      },
    });

    const now = new Date();
    const timeSinceLastNotification =
      lastNotification && lastNotification.sentAt
        ? now.getTime() - lastNotification.sentAt.getTime()
        : Infinity;

    if (timeSinceLastNotification < MIN_TIME_BETWEEN_NOTIFICATIONS) {
      return NextResponse.json(
        { error: "You can only notify attendees every 4 hours" },
        { status: 429 },
      );
    }

    const attendees = event.attendees?.map(attendee => attendee.email);

    if (!attendees) {
      return NextResponse.json(
        { error: "No attendees found" },
        { status: 404 },
      );
    }

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

    const eventStartDate = event.start.dateTime
      ? new Date(event.start.dateTime)
      : event.start.date
        ? new Date(event.start.date)
        : new Date();

    const eventEndDate = event.end.dateTime
      ? new Date(event.end.dateTime)
      : event.end.date
        ? new Date(event.end.date)
        : new Date();

    const eventData = {
      organizer: session.user.userId,
      summary: event.summary,
      description: event.description,
      start: eventStartDate,
      end: eventEndDate,
    };

    const responseEvent = await prisma.responseEvent.upsert({
      create: {
        ...eventData,
        calendarId,
        eventId,
      },
      update: eventData,
      where: {
        calendarId_eventId: {
          calendarId,
          eventId,
        },
      },
    });

    await prisma.userResponse.createMany({
      data: users.map(user => ({
        responseEventId: responseEvent.id,
        userId: user.id,
      })),
      skipDuplicates: true,
    });

    // create a response for the user who sent the notification
    await prisma.userResponse.create({
      data: {
        responseEventId: responseEvent.id,
        userId: session.user.userId,
      },
    });

    const tokens: { userId: string; token?: string }[] = users?.map(user => ({
      userId: user.id,
      token: user.meta?.pushToken || user.meta?.pushTokenMobile || undefined,
    }));

    const notificationPromises = [];

    for (const { token, userId } of tokens) {
      if (!token) {
        loggerServer.info("User not subscribed to notifications", userId);
        continue;
      }

      const onClickNavigateTo = `${process.env.APP_BASE_URL}/home/responses/${responseEvent.id}`;

      notificationPromises.push(
        sendNotification({
          token,
          userId,
          title: "Rate an event",
          type: "event-" + event.id,
          body:
            session.user.name ||
            "Someone" + "asks you to rate" + event.summary.slice(0, 20),
          onClickNavigateTo,
          data: {
            eventResponseId: responseEvent.id,
            tag: "event-" + event.id,
          },
        }),
      );
    }

    await Promise.allSettled(notificationPromises);

    await prisma.responseEventNotifications.create({
      data: {
        responseEventId: responseEvent.id,
        sentBy: session.user.userId,
        notificationType: "push",
      },
    });

    return NextResponse.json(response.data, { status: 200 });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
