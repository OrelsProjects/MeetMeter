import { NextRequest, NextResponse } from "next/server";
import Logger from "../../../loggerServer";
import { getServerSession } from "next-auth";
import { authOptions } from "../../../auth/authOptions";
import prisma from "../_db/db";
import { messaging } from "../../../../firebase.config.admin";
import { NotificationData } from "../../../models/notification";
import { sendNotification } from "./utils";

export async function POST(req: NextRequest): Promise<NextResponse<any>> {
  const session = await getServerSession(authOptions);
  if (!session) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }
  let token = "";
  try {
    const {
      title,
      body,
      image,
      userId,
      type,
    }: NotificationData & { userId: string } = await req.json();
    const user = await prisma.user.findUnique({
      where: { id: userId },
      include: {
        meta: {
          select: {
            pushToken: true,
            pushTokenMobile: true,
          },
        },
        settings: {
          select: {
            showNotifications: true,
          },
        },
      },
    });

    if (!user) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    if (!user.settings?.showNotifications) {
      return NextResponse.json(
        { error: "User has disabled notifications" },
        { status: 400 },
      );
    }

    token = user.meta?.pushToken || "";

    if (!token) {
      return NextResponse.json(
        { error: "User not subscribed to notifications" },
        { status: 400 },
      );
    }

   await sendNotification({
      token: user.meta?.pushTokenMobile || user.meta?.pushToken || "",
      userId: user.id,
      title,
      type,
      body,
      image,
    });

    return NextResponse.json({}, { status: 201 });
  } catch (error: any) {
    Logger.error("Error sending notification", session.user.userId, {
      data: { error, token },
    });
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
