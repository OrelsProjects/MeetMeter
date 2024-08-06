import { ResponseEvent } from "@prisma/client";

export type Value = StatisticsBase & { units: string };
export type StatisticsWithEvent = StatisticsBase & {
  infoText: string;
} & { event: ResponseEvent };

export interface StatisticsBase {
  value: number | string;
  change?: number;
}

export interface UserResponseStatistics {
  good: number;
  bad: number;
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
