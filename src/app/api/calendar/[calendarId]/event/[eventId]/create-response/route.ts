import { getServerSession } from "next-auth";
import { NextRequest, NextResponse } from "next/server";
import axios from "axios";
import { authOptions } from "@/auth/authOptions";
import { CalendarEvent } from "@/models/calendarEvents";
import prisma from "@/app/api/_db/db";

/**
 * Create a response for a single person.
 */

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

    const existingUserResponse = await prisma.userResponse.findFirst({
      where: {
        userId: session.user.userId,
        responseEvent: {
          eventId,
        },
      },
    });

    if (existingUserResponse) {
      return NextResponse.json(
        {
          ...existingUserResponse,
        },
        { status: 200 },
      );
    }

    const url = `https://www.googleapis.com/calendar/v3/calendars/${calendarId}/events/${eventId}`;
    const response = await axios.get<CalendarEvent>(url, {
      headers: {
        Authorization: `Bearer ${session.user.accessToken}`,
      },
    });
    const event = response.data;

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
      organizerEmail: event.creator.email,
      summary: event.summary,
      description: event.description,
      start: eventStartDate,
      end: eventEndDate,
    };

    const responseEvent = await prisma.responseEvent.upsert({
      create: {
        ...eventData,
        calendarId: event.creator.email,
        eventId,
      },
      update: eventData,
      where: { eventId },
    });

    const userResponse = await prisma.userResponse.create({
      data: {
        responseEventId: responseEvent.id,
        userId: session.user.userId,
      },
    });

    return NextResponse.json(
      {
        ...userResponse,
      },
      { status: 200 },
    );
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
