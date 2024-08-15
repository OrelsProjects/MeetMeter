import React from "react";
import { Skeleton } from "@/components/ui/skeleton";
import { cn } from "../../../lib/utils";
import { StatisticsWithEvent } from "../../../models/statistics";
import moment from "moment";

export default function EventStatisticsCard({
  statistic,
  loading,
  className,
}: {
  statistic?: StatisticsWithEvent;
  loading?: boolean;
  className?: string;
}) {
  const TimeRange = () => {
    if (!statistic?.event) return null;
    const { start, end } = statistic.event;
    const startDate = new Date(start);
    const endDate = new Date(end);
    // format to HH:mm 24-hour time use moment
    const formatTime = (date: Date) => moment(date).format("HH:mm");

    return (
      <div className="text-sm text-card-foreground font-thin">
        {formatTime(startDate)} - {formatTime(endDate)}
      </div>
    );
  };

return (
    <div
      className={cn(
        "h-[7.5rem] w-full  overflow-hidden rounded-lg bg-card",
        className, 
      )}
    >
      {loading ? (
        <Skeleton className="w-full h-full" />
      ) : (
        <div className="h-full p-5 sm:p-4">
          <dl className="h-full flex flex-col justify-between">
            <dt className="w-full text-lg text-card-foreground line-clamp-2 flex flex-row justify-between gap-4">
              <span className="font-semibold text-lg">
                {statistic?.event.summary}
              </span>
              <span className="font-medium text-xl">{statistic?.value}</span>
            </dt>
            <dd className="w-full mt-1 font-medium text-card-foreground flex flex-row justify-between gap-4">
              <TimeRange />
              <span className="text-sm font-light">{statistic?.infoText}</span>
            </dd>
          </dl>
        </div>
      )}
    </div>
  );
}
