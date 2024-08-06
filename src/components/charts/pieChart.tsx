import { useTheme } from "next-themes";
import React from "react";
import {
  VictoryLabel,
  VictoryLegend,
  VictoryPie,
  VictoryThemeDefinition,
} from "victory";
import { Skeleton } from "../ui/skeleton";

export interface PieChartData {
  label: string;
  value: number;
}

export default function CustomPieChart({
  data,
  colorScale,
  loading,
}: {
  data: PieChartData[];
  colorScale?: string[];
  loading?: boolean;
}) {
  const { resolvedTheme } = useTheme();

  const chartTheme: VictoryThemeDefinition = {
    pie: {
      style: {
        labels: {
          fill: resolvedTheme === "dark" ? "white" : "black",
          fontSize: 30,
        },
      },
    },
  };

  const formattedData = data.map(d => ({
    x: d.label,
    y: d.value,
  }));

  const Label = (value: number) => {
    // Calculate the percentage of the total
    const percentage = (
      (value / formattedData.reduce((a, b) => a + b.y, 0)) *
      100
    ).toFixed(0);
    return `${percentage}%`;
  };

  return loading ? (
    <Skeleton className="h-full rounded-full aspect-square" />
  ) : (
    <VictoryPie
      data={formattedData}
      theme={chartTheme}
      colorScale={colorScale}
      labels={({ datum }) => Label(datum.y)}
      labelRadius={({ innerRadius }) => (parseInt(`${innerRadius}`) || 0) + 20}
      innerRadius={100}
    />
  );
}
