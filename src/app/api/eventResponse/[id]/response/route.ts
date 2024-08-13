import { getServerSession } from "next-auth";
import { NextRequest, NextResponse } from "next/server";
import { authOptions } from "@/auth/authOptions";
import prisma from "@/app/api/_db/db";
import { SendUserResponse } from "@/models/userResponse";

export async function POST(
  req: NextRequest,
  { params }: { params: { id: string } },
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
    const { response }: { response?: SendUserResponse } = await req.json();
    if (!response) {
      return NextResponse.json({ error: "Invalid response" }, { status: 400 });
    }
    const respondAt = new Date();

    const userResponse = await prisma.userResponse.upsert({
      where: {
        userId_responseEventId: {
          userId: session.user.userId,
          responseEventId: id,
        },
      },
      update: { ...response, respondAt },
      create: {
        userId: session.user.userId,
        responseEventId: id,
        ...response,
        respondAt,
      },
    });
    return NextResponse.json(userResponse, { status: 201 });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
