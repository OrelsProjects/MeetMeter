"use client";

import axios from "axios";
import React, { useMemo } from "react";
import CustomPieChart, {
  PieChartData,
} from "../../../components/charts/pieChart";
import { Statistics } from "../../../models/statistics";
import StatisticsCard from "./statisticsCard";
import { Skeleton } from "@/components/ui/skeleton";
import { cn } from "../../../lib/utils";
import EventStatisticsCard from "./eventStatisticsCard";

const SectionContainer = ({
  children,
  className,
}: {
  children: React.ReactNode;
  className?: string;
}) => (
  <div
    className={cn(
      "w-full bg-foreground/5 flex flex-col gap-16 p-4 rounded-lg",
      className,
    )}
  >
    {children}
  </div>
);

export default function DashboardPage() {
  const [loading, setLoading] = React.useState(false);
  const [data, setData] = React.useState<Statistics>();

  const getStatistics = async () => {
    if (loading) return;
    setLoading(true);
    try {
      const response = await axios.get<Statistics>("api/statistics");
      setData(response.data);
    } catch (error: any) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  React.useEffect(() => {
    getStatistics();
  }, []);

  const formattedData: PieChartData[] = useMemo(() => {
    if (loading) {
      return Array.from({ length: 2 }).map(() => ({
        label: "",
        value: 0,
      }));
    }
    const responseStatistics = data?.responseStatistics;
    if (!responseStatistics) return [];
    return [
      {
        label: "Productive",
        value: responseStatistics.good,
      },
      {
        label: "Unproductive",
        value: responseStatistics.bad,
      },
    ];
  }, [data, loading]);

  const UpperSection = () => (
    <div className="w-full flex flex-col-reverse items-center md:items-start md:flex-row gap-10 justify-between">
      <div className="w-full rounded-lg grid grid-cols-[repeat(var(--responses-in-row-mobile),minmax(0,1fr))] md:grid-cols-[repeat(var(--responses-in-row),minmax(0,1fr))] gap-4">
        <StatisticsCard
          title="Total Meetings"
          value={data?.totalMeetings.value || -1}
          change={data?.totalMeetings.change}
          loading={loading}
        />
        <StatisticsCard
          loading={loading}
          title="Total meeting hours"
          value={data?.totalMeetingsTime.value || -1}
          units={data?.totalMeetingsTime.units}
          change={data?.totalMeetingsTime.change}
        />
        <StatisticsCard
          loading={loading}
          title="Average meeting time"
          value={data?.averageMeetingsTime.value || -1}
          units={data?.averageMeetingsTime.units}
          change={data?.averageMeetingsTime.change}
        />
        <StatisticsCard
          loading={loading}
          title="Estimated loss"
          value={data?.estimatedLoss.value || -1}
        />
      </div>
      <div className="h-56 w-fit flex flex-col">
        <div className="w-full h-full flex flex-col gap-0 items-center justify-center">
          <div className="w-fit h-fit flex flex-row gap-4 mt-5">
            {formattedData
              .map((it, index) => (
                <div
                  key={`pie-chart-legend-${index}`}
                  className="flex flex-row gap-1 items-center"
                >
                  <div className="w-2 h-2 rounded-full">
                    {loading ? (
                      <Skeleton className="w-full h-full rounded-full" />
                    ) : (
                      <div
                        className="w-full h-full rounded-full"
                        style={{
                          backgroundColor: index === 0 ? "#3b82f6" : "#f7146a",
                        }}
                      />
                    )}
                  </div>
                  {loading ? (
                    <Skeleton className="w-24 h-4" />
                  ) : (
                    <span className="text-foreground/70">{it.label}</span>
                  )}
                </div>
              ))
              .reverse()}
          </div>
          <CustomPieChart
            data={formattedData}
            colorScale={["#3b82f6", "#f7146a"]}
            loading={loading}
          />
        </div>
      </div>
    </div>
  );

  const LowerSection = () => (
    <div className="w-full rounded-lg flex flex-col md:flex-row gap-4">
      <div className="w-full flex flex-col gap-4">
        <span className="font-semibold text-2xl">Best Meetings</span>
        {loading
          ? Array.from({ length: 2 }).map((_, index) => (
              <EventStatisticsCard key={index} loading={loading} />
            ))
          : data?.bestMeetings?.map((meeting, index) => (
              <EventStatisticsCard
                key={index}
                statistic={meeting}
                loading={loading}
              />
            ))}
      </div>
      <div className="w-full flex flex-col gap-4">
        <span className="font-semibold text-2xl">Worst Meetings</span>
        {loading
          ? Array.from({ length: 2 }).map((_, index) => (
              <EventStatisticsCard key={index} loading={loading} />
            ))
          : data?.worstMeetings?.map((meeting, index) => (
              <EventStatisticsCard
                key={index}
                statistic={meeting}
                loading={loading}
              />
            ))}
      </div>
    </div>
  );

  return (
    <div className="h-full w-full flex flex-col justify-center items-center gap-6 overflow-clip">
      <h1 className="self-center text-3xl font-semibold">
        Your team&apos;s weekly meetings summary
      </h1>
      <div className="w-full h-full flex flex-col gap-4 overflow-auto">
        <SectionContainer>
          <UpperSection />
        </SectionContainer>
        <SectionContainer className="flex-row">
          <LowerSection />
        </SectionContainer>
      </div>
    </div>
  );
}
