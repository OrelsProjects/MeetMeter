import React from "react";
import { Skeleton } from "../../../components/ui/skeleton";

export default function StatisticsCard({
  title,
  value,
  units,
  change,
  loading,
}: {
  title: string;
  value: number | string;
  units?: string;
  change?: number;
  loading?: boolean;
}) {
  return (
    <div className="h-32 w-52 overflow-hidden rounded-lg bg-card">
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
