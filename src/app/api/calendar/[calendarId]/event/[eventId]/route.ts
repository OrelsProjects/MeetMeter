import { getServerSession } from "next-auth";
import { NextRequest, NextResponse } from "next/server";
import { authOptions } from "../../../../../../auth/authOptions";
import axios from "axios";
import { CalendarEvent } from "../../../../../../models/calendarEvents";

export async function GET(
  req: NextRequest,
  {
    params,
  }: {
    params: {
      calendarId: string;
      eventId: string;
    };
  },
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
    const { accessToken } = session.user;
    const url = `https://www.googleapis.com/calendar/v3/calendars/${calendarId}/events/${eventId}`;
    const event = await axios.get<CalendarEvent>(url, {
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
    });
    const status = event.data.status;

    if (status === "cancelled") {
      return NextResponse.json(
        { error: "Event has been cancelled" },
        { status: 404 },
      );
    }

    return NextResponse.json({ ...event.data }, { status: 200 });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
