import { getServerSession } from "next-auth";
import { NextRequest, NextResponse } from "next/server";
import { authOptions } from "../../../auth/authOptions";
import prisma from "../_db/db";
import { UserResponseWithEvent } from "../../../models/userResponse";

export async function GET(_: NextRequest) {
  const session = await getServerSession(authOptions);
  if (!session) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }
  try {
    const response: UserResponseWithEvent[] =
      await prisma.userResponse.findMany({
        where: {
          OR: [{ userId: session.user.userId }, { email: session.user.email }],
        },
        include: {
          responseEvent: true,
        },
        orderBy: {
          responseEvent: {
            start: "asc",
          },
        },
      });
    return NextResponse.json(response, { status: 200 });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
