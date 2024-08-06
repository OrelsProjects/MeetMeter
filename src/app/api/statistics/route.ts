import { getServerSession } from "next-auth";
import { NextRequest, NextResponse } from "next/server";
import { authOptions } from "@/auth/authOptions";
import prisma from "@/app/api/_db/db";
import { Statistics, UserResponseStatistics } from "@/models/statistics";
import { UserResponse } from "@prisma/client";
import { UserResponseWithEvent } from "../../../models/userResponse";

const setOneDecimal = (num: number) => Math.round(num * 10) / 10;

export async function GET(req: NextRequest) {
  const session = await getServerSession(authOptions);
  if (!session || session.user.role !== "admin") {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }
  try {
    const now = new Date();
    const userResponses = await prisma.userResponse.findMany({
      include: {
        responseEvent: true,
      },
      where: {
        responseEvent: {
          organizer: session.user.userId,
          end: {
            lte: now,
          },
        },
      },
    });

    const responsesGroupedByEventId = userResponses.reduce(
      (acc, response) => {
        if (acc[response.responseEventId]) {
          acc[response.responseEventId].push(response);
        } else {
          acc[response.responseEventId] = [response];
        }
        return acc;
      },
      {} as Record<string, UserResponse[]>,
    );

    const totalMeetings = Object.keys(responsesGroupedByEventId).length;
    let averageMeetingsTime =
      userResponses.reduce(
        (acc, response) =>
          acc +
          response.responseEvent.end.getTime() -
          response.responseEvent.start.getTime(),
        0,
      ) / totalMeetings;

    // Total meeting time - Each meeting's time times the number of attendees. Each response is an attendee.
    let eventIdToUserResponses: Record<string, UserResponseWithEvent[]> = {};
    userResponses.forEach(userResponse => {
      if (!eventIdToUserResponses[userResponse.responseEventId]) {
        eventIdToUserResponses[userResponse.responseEventId] = [];
      }
      eventIdToUserResponses[userResponse.responseEventId].push(userResponse);
    });

    // Calculate the total time for all meetings
    let totalMeetingsTime = 0;
    let totalAttendees = 0;
    for (const [_, responses] of Object.entries(eventIdToUserResponses)) {
      const meetingTime =
        responses[0].responseEvent.end.getTime() -
        responses[0].responseEvent.start.getTime();
      totalMeetingsTime += meetingTime * responses.length;
      totalAttendees += responses.length;
    }

    // Convert milliseconds to hours
    totalMeetingsTime = totalMeetingsTime / 1000 / 60 / 60;

    const totalMeetingsCount =
      Object.keys(responsesGroupedByEventId).length + totalAttendees;
    averageMeetingsTime = (totalMeetingsTime / totalMeetingsCount) * 60;

    const responseStatistics: UserResponseStatistics = {
      good: 0,
      bad: 0,
    };

    userResponses.forEach(userResponse => {
      const rating = userResponse.rating || 0;
      if (rating >= 3) {
        responseStatistics.good++;
      } else {
        responseStatistics.bad++;
      }
    });

    const statistics: Statistics = {
      totalMeetings: { value: setOneDecimal(totalMeetings) },
      totalMeetingsTime: {
        value: setOneDecimal(totalMeetingsTime),
        units: "hours",
      },
      averageMeetingsTime: {
        value: setOneDecimal(averageMeetingsTime),
        units: "minutes",
      },
      estimatedLoss: { value: "$0" },
      responseStatistics,
    };

    return NextResponse.json(statistics, { status: 200 });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
