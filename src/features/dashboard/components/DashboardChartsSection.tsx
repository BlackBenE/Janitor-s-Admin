import React from 'react';
import {
  BarCharts,
  ChartGridSection,
  ChartConfig as SharedChartConfig,
} from '@/shared/components/data-display';
import { ChartDataPoint } from '@/types/dashboard';
import { DASHBOARD_LABELS } from '../constants';

interface DashboardChartsSectionProps {
  recentActivityData: ChartDataPoint[];
  userGrowthData: ChartDataPoint[];
}

export const DashboardChartsSection: React.FC<DashboardChartsSectionProps> = ({
  recentActivityData,
  userGrowthData,
}) => {
  const charts: SharedChartConfig[] = [
    {
      title: DASHBOARD_LABELS.charts.monthlyRevenue,
      subtitle: DASHBOARD_LABELS.charts.revenueSubtitle,
      content: (
        <BarCharts
          dataset={recentActivityData}
          xAxisKey="month"
          series={[{ dataKey: 'sales', label: DASHBOARD_LABELS.charts.revenueLabel }]}
        />
      ),
    },
    {
      title: DASHBOARD_LABELS.charts.userGrowth,
      subtitle: DASHBOARD_LABELS.charts.userGrowthSubtitle,
      content: (
        <BarCharts
          dataset={userGrowthData}
          xAxisKey="month"
          series={[{ dataKey: 'sales', label: DASHBOARD_LABELS.charts.activeUsersLabel }]}
        />
      ),
    },
  ];

  return <ChartGridSection charts={charts} marginBottom={8} />;
};
