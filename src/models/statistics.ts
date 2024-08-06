export type Value = StatisticsBase & { units: string };

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
}
