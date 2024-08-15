"use client";

import axios from "axios";
import React, { useMemo } from "react";
import { SingleEventStaistics as SingleEventStatstics } from "@/models/statistics";
import { cn } from "@/lib/utils";
import CustomTooltip from "../../../../components/ui/customTooltip";
import EventComponent, {
  EventContainerComponent,
  getTimeRange,
} from "../../../../components/eventComponent";
import CustomPieChart, {
  PieChartData,
} from "../../../../components/charts/pieChart";
import { Skeleton } from "../../../../components/ui/skeleton";
import { Button } from "../../../../components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogTitle,
} from "../../../../components/ui/dialog";
import { DialogTrigger } from "@radix-ui/react-dialog";

type EventId = string;

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

export default function DashboardAllPage() {
  const [loading, setLoading] = React.useState(false);
  const [data, setData] = React.useState<SingleEventStatstics[]>();

  const getStatistics = async () => {
    if (loading) return;
    setLoading(true);
    try {
      const response = await axios.get<SingleEventStatstics[]>(
        "/api/statistics/all",
      );
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

  const formattedData: Record<EventId, PieChartData[]> | null = useMemo(() => {
    if (loading) {
      return null;
    }

    const pieData: Record<EventId, PieChartData[]> = {};

    if (!data) return pieData;
    for (const event of data) {
      const { responseStatistics } = event;
      const eventChartData = [
        {
          label: "Productive",
          value: responseStatistics.good,
        },
        {
          label: "Unproductive",
          value: responseStatistics.bad,
        },
      ];
      pieData[event.event.id] = eventChartData;
    }

    return pieData;
  }, [data, loading]);

  const dateToDay = (date?: Date) => {
    if (!date) return "";
    return date.toLocaleDateString("en-US", { weekday: "long" });
  };

  const dayToFormattedData = useMemo(() => {
    if (!data) return {};
    const map: Record<string, SingleEventStatstics[]> = {};

    data.forEach(event => {
      const start = new Date(
        event.event.start.dateTime || event.event.start.date || new Date(),
      );
      const day = start.toLocaleDateString("en-US", { weekday: "long" });
      if (!map[day]) {
        map[day] = [];
      }
      map[day].push(event);
    });
    return map;
  }, [data]);

  const CommentsDialog = ({
    comments,
  }: {
    comments: SingleEventStatstics["comments"];
  }) => {
    return (
      comments.filter(it => it.response).length > 0 && (
        <Dialog>
          <DialogContent>
            <DialogTitle>Comments</DialogTitle>
            <div className="flex flex-col gap-6">
            {comments.map((comment, index) => (
              <div key={`comment-${index}`} className="flex flex-col">
                <span className="text-base font-normal">
                  {comment.comentatorName} ({comment.rating})
                </span>
                <span className="text-sm">{comment.response}</span>
              </div>
            ))}
            </div>
          </DialogContent>
          <DialogTrigger asChild>
            <Button variant="link">See Comments</Button>
          </DialogTrigger>
        </Dialog>
      )
    );
  };

  const MainSection = () => (
    <div className="w-full h-fit flex flex-col gap-6">
      {Object.keys(dayToFormattedData).map((day, index) => {
        const statistics = dayToFormattedData[day];
        return (
          <div key={"event-statistics-day-" + index} className="flex flex-col">
            <span className="text-2xl font-semibold">{day}</span>
            <div className="flex flex-col gap-2">
              {statistics.map((statistic, index) => (
                <div
                  key={"event-statistics-" + index}
                  className="flex flex-row gap-4 bg-background rounded-lg p-2"
                >
                  <div className="flex flex-col w-full">
                    <h1 className="text-2xl line-clamp-1">
                      {statistic.event.summary}
                    </h1>
                    <p className="font-light text-sm">
                      {getTimeRange(
                        statistic.event.start.dateTime,
                        statistic.event.end.dateTime,
                      )}
                    </p>
                    <CommentsDialog comments={statistic.comments} />
                  </div>
                  <div
                    key={`pie-chart-legend-${index}`}
                    className="flex flex-row gap-1 items-center"
                  >
                    {formattedData?.[statistic.event.id] && (
                      <div className="w-16 h-16">
                        <CustomPieChart
                          data={formattedData[statistic.event.id]}
                          colorScale={["#3b82f6", "#f7146a"]}
                          loading={loading}
                        />
                      </div>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>
        );
      })}
    </div>
  );

  const InfoText = () => (
    <span className="text-foreground/60">
      Reflects only events that:
      <br />• have 2 or more attendees.
      <br />• were organized by you.
    </span>
  );

  return (
    <div className="h-full w-full flex flex-col justify-center items-center gap-6 overflow-clip relative">
      <div className="self-center relative">
        <h1 className="self-center text-3xl font-semibold">
          Your team&apos;s weekly meetings summary
        </h1>
        <CustomTooltip>
          <InfoText />
        </CustomTooltip>
      </div>
      <div className="w-full h-full flex flex-col gap-4 overflow-auto">
        <SectionContainer>
          <MainSection />
        </SectionContainer>
      </div>
    </div>
  );
}
