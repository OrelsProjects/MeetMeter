import { getServerSession } from "next-auth";
import { NextRequest, NextResponse } from "next/server";
import AppUser from "@/models/appUser";
import Logger from "@/loggerServer";
import prisma from "../../_db/db";
import { authOptions } from "../../../../auth/authOptions";

export async function POST(req: NextRequest): Promise<any> {}

export async function PATCH(req: NextRequest): Promise<any> {
  const session = await getServerSession(authOptions);
  if (!session) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }
  let user = session.user;
  try {
    if (!session.user?.userId) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }
    const { showNotifications } = await req.json();
    await prisma.appUserSettings.upsert({
      where: { userId: session.user?.userId },
      update: { showNotifications },
      create: { userId: session.user?.userId, showNotifications },
    });
    return NextResponse.json({}, { status: 200 });
  } catch (error: any) {
    Logger.error("Error updating user", user?.userId, {
      error,
    });
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
