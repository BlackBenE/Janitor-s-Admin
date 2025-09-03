import * as React from "react";
import { BarChart } from "@mui/x-charts/BarChart";

/**
 * Reusable BarChart component for admin dashboard.
 * Props:
 * - dataset: array of data objects
 * - xDataKey: string (key for x axis)
 * - yDataKey: string (key for y axis)
 * - yLabel: string (label for y axis)
 * - seriesLabel: string (label for series)
 * - valueFormatter: function (optional)
 * - height: number (optional, default 300)
 * - margin: object (optional)
 */
function SimpleBarChart({
  dataset,
  xDataKey,
  yDataKey,
  yLabel,
  seriesLabel,
  valueFormatter,
  height = 300,
  margin = { left: 0 },
}) {
  return (
    <BarChart
      dataset={dataset}
      xAxis={[{ dataKey: xDataKey }]}
      yAxis={[{ label: yLabel, width: 60 }]}
      series={[
        {
          dataKey: yDataKey,
          label: seriesLabel,
          valueFormatter,
        },
      ]}
      height={height}
      margin={margin}
    />
  );
}

export default SimpleBarChart;
