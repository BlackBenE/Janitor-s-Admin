import React from 'react';
import { Box, Paper, Tabs, Tab } from '@mui/material';
import { TrendingUp, Assessment, PieChart } from '@mui/icons-material';
import { AnalyticsChart, ChartGridSection, ChartConfig } from '@/shared/components/data-display';
import { ANALYTICS_LABELS } from '../constants';

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
  // Configuration des graphiques pour chaque onglet
  const trendsCharts: ChartConfig[] = [
    {
      title: ANALYTICS_LABELS.charts.userGrowth.title,
      subtitle: ANALYTICS_LABELS.charts.userGrowth.subtitle,
      usePaper: false, // Déjà dans un Paper parent
      content: (
        <AnalyticsChart
          title=""
          data={chartData.userGrowth || []}
          type="area"
          dataKey="users"
          xAxisKey="month"
          height={350}
          loading={loading}
        />
      ),
    },
    {
      title: ANALYTICS_LABELS.charts.bookingTrends.title,
      subtitle: ANALYTICS_LABELS.charts.bookingTrends.subtitle,
      usePaper: false, // Déjà dans un Paper parent
      content: (
        <AnalyticsChart
          title=""
          data={chartData.bookingTrends || []}
          type="line"
          dataKey="bookings"
          xAxisKey="date"
          height={350}
          loading={loading}
        />
      ),
    },
  ];

  const performanceCharts: ChartConfig[] = [
    {
      title: ANALYTICS_LABELS.charts.topServices.title,
      subtitle: ANALYTICS_LABELS.charts.topServices.subtitle,
      usePaper: false, // Déjà dans un Paper parent
      content: (
        <AnalyticsChart
          title=""
          data={chartData.topServices || []}
          type="bar"
          dataKey="bookings"
          xAxisKey="name"
          height={350}
          loading={loading}
        />
      ),
    },
    {
      title: ANALYTICS_LABELS.charts.monthlyRevenue.title,
      subtitle: ANALYTICS_LABELS.charts.monthlyRevenue.subtitle,
      usePaper: false, // Déjà dans un Paper parent
      content: (
        <AnalyticsChart
          title=""
          data={chartData.userGrowth || []}
          type="bar"
          dataKey="revenue"
          xAxisKey="month"
          height={350}
          loading={loading}
        />
      ),
    },
  ];

  const distributionCharts: ChartConfig[] = [
    {
      title: ANALYTICS_LABELS.charts.bookingsByStatus.title,
      subtitle: ANALYTICS_LABELS.charts.bookingsByStatus.subtitle,
      usePaper: false, // Déjà dans un Paper parent
      content: (
        <AnalyticsChart
          title=""
          data={chartData.bookingsByStatus || []}
          type="pie"
          dataKey="count"
          xAxisKey="status"
          height={350}
          loading={loading}
        />
      ),
    },
    {
      title: ANALYTICS_LABELS.charts.revenueByService.title,
      subtitle: ANALYTICS_LABELS.charts.revenueByService.subtitle,
      usePaper: false, // Déjà dans un Paper parent
      content: (
        <AnalyticsChart
          title=""
          data={chartData.topServices || []}
          type="pie"
          dataKey="revenue"
          xAxisKey="name"
          height={350}
          loading={loading}
        />
      ),
    },
  ];

  return (
    <Paper elevation={1}>
      <Tabs value={tabValue} onChange={onTabChange} variant="scrollable" scrollButtons="auto">
        <Tab icon={<TrendingUp />} label={ANALYTICS_LABELS.tabs.trends} iconPosition="start" />
        <Tab icon={<Assessment />} label={ANALYTICS_LABELS.tabs.performance} iconPosition="start" />
        <Tab icon={<PieChart />} label={ANALYTICS_LABELS.tabs.distribution} iconPosition="start" />
      </Tabs>

      <TabPanel value={tabValue} index={0}>
        <ChartGridSection charts={trendsCharts} marginBottom={0} />
      </TabPanel>

      <TabPanel value={tabValue} index={1}>
        <ChartGridSection charts={performanceCharts} marginBottom={0} />
      </TabPanel>

      <TabPanel value={tabValue} index={2}>
        <ChartGridSection charts={distributionCharts} marginBottom={0} />
      </TabPanel>
    </Paper>
  );
};
