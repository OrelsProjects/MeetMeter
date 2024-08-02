import { getServerSession } from "next-auth";
import { NextRequest, NextResponse } from "next/server";
import { authOptions } from "@/auth/authOptions";
import axios from "axios";
import { CalendarEvent } from "@/models/calendarEvents";
import prisma from "../../_db/db";

export async function GET(
  req: NextRequest,
  {
    params,
  }: {
    params: {
      id: string;
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
    const { id } = params;

    const userResponse = await prisma.userResponse.findFirst({
      where: {
        userId: session.user.userId,
        responseEventId: id,
      },
    });

    // if doesn't exist, the user is not authorized to view this response
    if (!userResponse) {
      return NextResponse.json(
        { error: "You are not authorized to view this response" },
        {
          status: 403,
        },
      );
    }

    const responseEvent = await prisma.responseEvent.findUnique({
      where: {
        id,
      },
    });

    return NextResponse.json({ responseEvent, userResponse }, { status: 200 });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
