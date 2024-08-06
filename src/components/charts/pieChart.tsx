import { useTheme } from "next-themes";
import React from "react";
import {
  VictoryLabel,
  VictoryLegend,
  VictoryPie,
  VictoryThemeDefinition,
} from "victory";

export interface PieChartData {
  label: string;
  value: number;
}

export default function CustomPieChart({
  data,
  colorScale,
}: {
  data: PieChartData[];
  colorScale?: string[];
}) {
  const { resolvedTheme } = useTheme();

  const chartTheme: VictoryThemeDefinition = {
    pie: {
      style: {
        labels: {
          fill: resolvedTheme === "dark" ? "white" : "black",
          fontSize: 42,
        },
      },
    },
  };

  const formattedData = data.map(d => ({
    x: d.label,
    y: d.value,
  }));

  return (
    <VictoryPie
      data={formattedData}
      // color of title
      theme={chartTheme}
      colorScale={colorScale}
      animate={{
        duration: 2000,
      }}
      labelComponent={<></>}
      innerRadius={50}
    />
  );
}
