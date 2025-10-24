import React from "react";
import { Box, Typography } from "@mui/material";
import BarCharts from "../../BarCharts";
import DashboardItem from "../../DashboardItem";
import { ChartDataPoint } from "../../../types/dashboard";
import { LABELS } from "../../../constants";

interface DashboardChartsSectionProps {
  recentActivityData: ChartDataPoint[];
  userGrowthData: ChartDataPoint[];
}

interface ChartConfig {
  title: string;
  subtitle: string;
  data: ChartDataPoint[];
  label: string;
}

export const DashboardChartsSection: React.FC<DashboardChartsSectionProps> = ({
  recentActivityData,
  userGrowthData,
}) => {
  const charts: ChartConfig[] = [
    {
      title: LABELS.dashboard.charts.monthlyRevenue,
      subtitle: LABELS.dashboard.charts.revenueSubtitle,
      data: recentActivityData,
      label: LABELS.dashboard.charts.revenueLabel,
    },
    {
      title: LABELS.dashboard.charts.userGrowth,
      subtitle: LABELS.dashboard.charts.userGrowthSubtitle,
      data: userGrowthData,
      label: LABELS.dashboard.charts.activeUsersLabel,
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
