import { getServerSession } from "next-auth";
import { NextRequest, NextResponse } from "next/server";
import { authOptions } from "../../../../../../../auth/authOptions";
import prisma from "../../../../../_db/db";

export async function POST(
  req: NextRequest,
  { params }: { params: { calendarId: string; eventId: string } },
) {
  const session = await getServerSession(authOptions);
  if (!session) {
    return {
      status: 401,
      json: { error: "Unauthorized" },
    };
  }
  try {
    const { calendarId, eventId } = params;
    const { response } = await req.json();
    await prisma.userResponse.create({
      data: {
        calendarId,
        eventId,
        userId: session.user.userId,
        response,
      },
    });
    return NextResponse.json({ success: true }, { status: 200 });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
