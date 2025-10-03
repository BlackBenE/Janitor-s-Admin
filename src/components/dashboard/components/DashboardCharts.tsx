import React from "react";
import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
import DashboardItem from "../../DashboardItem";
import BarCharts from "../../BarCharts";
import { ChartDataPoint } from "../../../types/dashboard";

interface ChartConfig {
  title: string;
  subtitle: string;
  data: ChartDataPoint[];
  label: string;
}

interface DashboardChartsProps {
  recentActivityData: ChartDataPoint[];
  userGrowthData: ChartDataPoint[];
}

export const DashboardCharts: React.FC<DashboardChartsProps> = ({
  recentActivityData,
  userGrowthData,
}) => {
  const charts: ChartConfig[] = [
    {
      title: "Monthly Revenue",
      subtitle: "Revenue trends over the last 6 months",
      data: recentActivityData,
      label: "Revenue (€)",
    },
    {
      title: "User Growth",
      subtitle: "Active user growth over time",
      data: userGrowthData,
      label: "Active Users",
    },
  ];

  return (
    <Box
      sx={{
        mb: 8,
        width: "100%",
        display: "flex",
        flexWrap: "wrap",
        gap: 2,
      }}
    >
      {charts.map((chart, index) => (
        <Box
          key={index}
          sx={{
            flex: {
              xs: "1 1 100%",
              sm: "1 1 calc(50% - 8px)",
            },
            display: "flex",
          }}
        >
          <DashboardItem>
            <Box
              sx={{
                mt: 2,
                border: "1px solid #ddd",
                borderRadius: 4,
                p: 2,
                flex: 1,
                minWidth: 0,
                height: "100%",
                alignItems: "stretch",
              }}
            >
              <Box sx={{ mb: 2, width: "100%" }}>
                <Typography variant="h6">{chart.title}</Typography>
                <Typography variant="body2" color="text.secondary">
                  {chart.subtitle}
                </Typography>
              </Box>
              <Box sx={{ width: "100%" }}>
                <BarCharts
                  dataset={chart.data}
                  xAxisKey="month"
                  series={[{ dataKey: "sales", label: chart.label }]}
                />
              </Box>
            </Box>
          </DashboardItem>
        </Box>
      ))}
    </Box>
  );
};
