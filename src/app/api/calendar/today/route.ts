import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "../../../../auth/authOptions";
import axios from "axios";
import prisma from "../../_db/db";
import moment from "moment";

export async function GET(req: NextRequest) {
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
    const getAllCalendarsUrl =
      "https://www.googleapis.com/calendar/v3/users/me/calendarList";

    // const responseCal = await axios.get<Calendar[]>(getAllCalendarsUrl, {
    //   headers: {
    //     Authorization: `Bearer ${latestAccount.access_token}`,
    //   },
    // });

    // get primary calendar
    const colors = `https://www.googleapis.com/calendar/v3/colors`;
    const primaryCalendarUrl = `https://www.googleapis.com/calendar/v3/users/me/calendarList/primary`;
    const responsePrimary = await axios.get(primaryCalendarUrl, {
      headers: {
        Authorization: `Bearer ${latestAccount.access_token}`,
      },
    });

    const calendarBackgroundColor = responsePrimary.data.backgroundColor;
    const calendarForegroundColor = responsePrimary.data.foregroundColor;

    const now = moment.now();
    const startOfDay = moment(now).startOf("day").toISOString();
    const endOfDay = moment(now).endOf("day").toISOString();
    const url = `https://www.googleapis.com/calendar/v3/calendars/primary/events?timeMin=${startOfDay}&timeMax=${endOfDay}&orderBy=startTime&singleEvents=true`;
    const response = await axios.get(url, {
      headers: {
        Authorization: `Bearer ${latestAccount.access_token}`,
      },
    });

    return NextResponse.json(
      { ...response.data, calendarBackgroundColor, calendarForegroundColor },
      { status: 200 },
    );
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

export function POST(req: NextRequest) {
  return NextResponse.json({ message: "Hello" });
}
