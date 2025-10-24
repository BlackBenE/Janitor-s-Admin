import React from "react";
import { Box, Paper, Tabs, Tab } from "@mui/material";
import { TrendingUp, Assessment, PieChart } from "@mui/icons-material";
import { AnalyticsChart } from "@/shared/components/data-display";
import { LABELS } from "@/core/config/labels";

interface TabPanelProps {
  children?: React.ReactNode;
  index: number;
  value: number;
}

function TabPanel({ children, value, index }: TabPanelProps) {
  return (
    <div
      role="tabpanel"
      hidden={value !== index}
      id={`analytics-tabpanel-${index}`}
      aria-labelledby={`analytics-tab-${index}`}
    >
      {value === index && <Box sx={{ py: 3 }}>{children}</Box>}
    </div>
  );
}

interface ChartData {
  userGrowth: any[];
  bookingTrends: any[];
  topServices: any[];
  bookingsByStatus: any[];
}

interface AnalyticsTabsSectionProps {
  tabValue: number;
  onTabChange: (event: React.SyntheticEvent, newValue: number) => void;
  chartData: ChartData;
  loading: boolean;
}

export const AnalyticsTabsSection: React.FC<AnalyticsTabsSectionProps> = ({
  tabValue,
  onTabChange,
  chartData,
  loading,
}) => {
  return (
    <Paper elevation={1}>
      <Tabs
        value={tabValue}
        onChange={onTabChange}
        variant="scrollable"
        scrollButtons="auto"
      >
        <Tab
          icon={<TrendingUp />}
          label={LABELS.analytics.tabs.trends}
          iconPosition="start"
        />
        <Tab
          icon={<Assessment />}
          label={LABELS.analytics.tabs.performance}
          iconPosition="start"
        />
        <Tab
          icon={<PieChart />}
          label={LABELS.analytics.tabs.distribution}
          iconPosition="start"
        />
      </Tabs>

      <TabPanel value={tabValue} index={0}>
        <Box
          sx={{
            display: "grid",
            gridTemplateColumns: { xs: "1fr", lg: "1fr 1fr" },
            gap: 3,
          }}
        >
          <AnalyticsChart
            title={LABELS.analytics.charts.userGrowth.title}
            subtitle={LABELS.analytics.charts.userGrowth.subtitle}
            data={chartData.userGrowth || []}
            type="area"
            dataKey="users"
            xAxisKey="month"
            height={350}
            loading={loading}
          />

          <AnalyticsChart
            title={LABELS.analytics.charts.bookingTrends.title}
            subtitle={LABELS.analytics.charts.bookingTrends.subtitle}
            data={chartData.bookingTrends || []}
            type="line"
            dataKey="bookings"
            xAxisKey="date"
            height={350}
            loading={loading}
          />
        </Box>
      </TabPanel>

      <TabPanel value={tabValue} index={1}>
        <Box
          sx={{
            display: "grid",
            gridTemplateColumns: { xs: "1fr", lg: "1fr 1fr" },
            gap: 3,
          }}
        >
          <AnalyticsChart
            title={LABELS.analytics.charts.topServices.title}
            subtitle={LABELS.analytics.charts.topServices.subtitle}
            data={chartData.topServices || []}
            type="bar"
            dataKey="bookings"
            xAxisKey="name"
            height={350}
            loading={loading}
          />

          <AnalyticsChart
            title={LABELS.analytics.charts.monthlyRevenue.title}
            subtitle={LABELS.analytics.charts.monthlyRevenue.subtitle}
            data={chartData.userGrowth || []}
            type="bar"
            dataKey="revenue"
            xAxisKey="month"
            height={350}
            loading={loading}
          />
        </Box>
      </TabPanel>

      <TabPanel value={tabValue} index={2}>
        <Box
          sx={{
            display: "grid",
            gridTemplateColumns: { xs: "1fr", lg: "1fr 1fr" },
            gap: 3,
          }}
        >
          <AnalyticsChart
            title={LABELS.analytics.charts.bookingsByStatus.title}
            subtitle={LABELS.analytics.charts.bookingsByStatus.subtitle}
            data={chartData.bookingsByStatus || []}
            type="pie"
            dataKey="count"
            xAxisKey="status"
            height={350}
            loading={loading}
          />

          <AnalyticsChart
            title={LABELS.analytics.charts.revenueByService.title}
            subtitle={LABELS.analytics.charts.revenueByService.subtitle}
            data={chartData.topServices || []}
            type="pie"
            dataKey="revenue"
            xAxisKey="name"
            height={350}
            loading={loading}
          />
        </Box>
      </TabPanel>
    </Paper>
  );
};
