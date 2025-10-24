import React from "react";
import { Box } from "@mui/material";
import MetricsSummarySimplified from "../../MetricsSummarySimplified";

interface AnalyticsStatsSectionProps {
  data: any;
  userMetrics: any;
  revenueMetrics: any;
  activityMetrics: {
    totalBookings: number;
    completedBookings: number;
    cancelledBookings: number;
    activeServices: number;
    activeUsersGrowthRate?: number;
    bookingsGrowthRate?: number;
    cancellationRateChange?: number;
    currentCancellationRate?: number;
  };
  loading: boolean;
}

export const AnalyticsStatsSection: React.FC<AnalyticsStatsSectionProps> = ({
  data,
  userMetrics,
  revenueMetrics,
  activityMetrics,
  loading,
}) => {
  if (!data) return null;

  return (
    <MetricsSummarySimplified
      userMetrics={{
        totalUsers: userMetrics.totalUsers,
        activeUsers: userMetrics.activeUsers,
        newUsers: userMetrics.newUsers,
        growthRate: userMetrics.userGrowthRate,
      }}
      revenueMetrics={{
        totalRevenue: revenueMetrics.totalRevenue,
        monthlyRevenue: revenueMetrics.monthlyRevenue,
        averageOrderValue: revenueMetrics.averageOrderValue,
        revenueGrowthRate: revenueMetrics.revenueGrowthRate,
      }}
      activityMetrics={{
        totalBookings: activityMetrics.totalBookings,
        completedBookings: activityMetrics.completedBookings,
        cancelledBookings: activityMetrics.cancelledBookings,
        activeServices: activityMetrics.activeServices,
        activeUsersGrowthRate: activityMetrics.activeUsersGrowthRate,
        bookingsGrowthRate: activityMetrics.bookingsGrowthRate,
        cancellationRateChange: activityMetrics.cancellationRateChange,
        currentCancellationRate: activityMetrics.currentCancellationRate,
      }}
      loading={loading}
    />
  );
};
