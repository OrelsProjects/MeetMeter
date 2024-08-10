import React from "react";
import { Skeleton } from "@/components/ui/skeleton";
import { cn } from "../../../lib/utils";

export default function StatisticsCard({
  title,
  value,
  units,
  change,
  loading,
  className,
}: {
  title: string;
  value: number | string;
  units?: string;
  change?: number;
  loading?: boolean;
  className?: string;
}) {
  return (
    <div
      className={cn(
        "h-32 w-full  overflow-hidden rounded-lg bg-card dark:bg-card",
        className,
      )}
    >
      {loading ? (
        <Skeleton className="w-full h-full" />
      ) : (
        <div className="h-full p-5 sm:p-4">
          <dl className="h-full flex flex-col justify-between">
            <dt className="text-sm font-medium text-card-foreground truncate">
              {title}
            </dt>
            <dd className="mt-1 text-3xl font-medium text-card-foreground">
              <span>{value}</span>
              {units && (
                <span className="text-sm font-light ml-1">{units}</span>
              )}
            </dd>
          </dl>
        </div>
      )}
    </div>
  );
}
