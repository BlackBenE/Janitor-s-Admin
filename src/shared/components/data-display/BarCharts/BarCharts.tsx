import * as React from "react";
import { BarChart } from "@mui/x-charts/BarChart";

interface DataItem {
  [key: string]: string | number;
}

interface BarChartsProps {
  dataset: DataItem[];
  xAxisKey: string;
  series: Array<{
    dataKey: string;
    label: string;
    valueFormatter?: (value: number | null) => string;
  }>;
  height?: number;
  yAxisLabel?: string;
}

export default function BarCharts({
  dataset,
  xAxisKey,
  series,
  height = 300,
  yAxisLabel,
}: BarChartsProps) {
  const chartSetting = {
    yAxis: [
      {
        label: yAxisLabel,
        width: 60,
      },
    ],
    height,
  };

  return (
    <BarChart
      dataset={dataset}
      xAxis={[{ dataKey: xAxisKey }]}
      series={series}
      {...chartSetting}
    />
  );
}
