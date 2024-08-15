import { ResponseEvent } from "@prisma/client";
import { CalendarEventWithMeta } from "./calendarEvents";

export type Value = StatisticsBase & { units: string };
export type StatisticsWithEvent = StatisticsBase & {
  infoText: string;
} & { event: ResponseEvent };

export interface StatisticsBase {
  value: number | string;
  change?: number;
}

export interface Comment {
  comentatorName: string;
  response?: string | null;
  rating: number;
}

export interface UserResponseStatistics {
  good: number; // How many users rated the meeting as good (3+)
  bad: number; // How many users rated the meeting as bad (0-2)
}

export interface Statistics {
  totalMeetings: StatisticsBase;
  totalMeetingsTime: Value;
  averageMeetingsTime: Value;
  estimatedLoss: StatisticsBase;
  responseStatistics: UserResponseStatistics;
  bestMeetings?: StatisticsWithEvent[];
  worstMeetings?: StatisticsWithEvent[];
}

export interface SingleEventStaistics {
  event: CalendarEventWithMeta;
  responseStatistics: UserResponseStatistics;
  comments: Comment[];
}
