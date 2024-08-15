import { getServerSession } from "next-auth";
import { NextRequest, NextResponse } from "next/server";
import { authOptions } from "@/auth/authOptions";
import prisma from "@/app/api/_db/db";
import {
  Statistics,
  StatisticsWithEvent,
  UserResponseStatistics,
} from "@/models/statistics";
import { UserResponse } from "@prisma/client";
import { UserResponseWithEvent } from "../../../models/userResponse";
import moment from "moment";

const setOneDecimal = (num: number) => Math.round(num * 10) / 10;

export async function GET(req: NextRequest) {
  const session = await getServerSession(authOptions);
  if (!session || session.user.role !== "admin") {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }
  try {
    const startDate = moment().utc().startOf("week").toISOString();
    const endDate = moment().utc().endOf("week").toISOString();

    const userResponses = await prisma.userResponse.findMany({
      include: {
        responseEvent: true,
      },
      where: {
        respondAt: {
          not: null,
        },
        responseEvent: {
          AND: [
            {
              start: {
                gte: startDate,
              },

              end: {
                lte: endDate,
              },
            },
            {
              OR: [
                {
                  organizer: session.user.userId,
                },
                {
                  organizerEmail: session.user.email,
                },
              ],
            },
          ],
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

    const worstMeetings: StatisticsWithEvent[] = Object.entries(
      eventIdToUserResponses,
    )
      .map(([eventId, responses]) => {
        const positiveResponses = responses.filter(
          response => (response.rating || 0) >= 3,
        ).length;
        const totalResponses = responses.length;
        const percentage = (positiveResponses / totalResponses) * 100;
        return {
          value: setOneDecimal(percentage),
          infoText: `${positiveResponses}/${totalResponses} found it productive`,
          event: responses[0].responseEvent,
        };
      })
      .sort((a, b) => a.value - b.value)
      .map(meeting => ({
        ...meeting,
        value: `${meeting.value}%`,
      }))
      .slice(0, 2);

    const bestMeetings: StatisticsWithEvent[] = Object.entries(
      eventIdToUserResponses,
    )
      .map(([eventId, responses]) => {
        const positiveResponses = responses.filter(
          response => (response.rating || 0) >= 3,
        ).length;
        const totalResponses = responses.length;
        const percentage = (positiveResponses / totalResponses) * 100;

        return {
          value: percentage,
          infoText: `${positiveResponses}/${totalResponses} found it productive`,
          event: responses[0].responseEvent,
        };
      })
      .sort((a, b) => b.value - a.value)
      .map(meeting => ({
        ...meeting,
        value: `${meeting.value}%`,
      }))
      .slice(0, 2);

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
      bestMeetings,
      worstMeetings,
    };

    return NextResponse.json(statistics, { status: 200 });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
