import { useState, useEffect } from "react";
import { useNotifications } from "../shared/useNotifications";

export interface DashboardStats {
  pendingValidations: number;
  moderationCases: number;
  activeUsers: number;
  monthlyRevenue: number;
}

export interface ChartDataPoint extends Record<string, string | number> {
  month: string;
  sales: number;
}

export interface ChartSeries {
  dataKey: string;
  label: string;
}

export const useDashboard = () => {
  const [loading, setLoading] = useState(false);

  // Use existing notification hooks
  const { useNotificationStats } = useNotifications();
  const { data: notificationStats } = useNotificationStats();

  // Mock dashboard data - replace with real API calls
  const stats: DashboardStats = {
    pendingValidations: 1200,
    moderationCases: 1200,
    activeUsers: 1200,
    monthlyRevenue: 1200,
  };

  // Chart data for Recent Activity
  const recentActivityData: ChartDataPoint[] = [
    { month: "Jan", sales: 4000 },
    { month: "Feb", sales: 3000 },
    { month: "Mar", sales: 5000 },
    { month: "Apr", sales: 4000 },
    { month: "May", sales: 3000 },
    { month: "Jun", sales: 5000 },
  ];

  // Chart data for User Growth
  const userGrowthData: ChartDataPoint[] = [
    { month: "Jan", sales: 4000 },
    { month: "Feb", sales: 3000 },
    { month: "Mar", sales: 5000 },
    { month: "Apr", sales: 4000 },
    { month: "May", sales: 3000 },
    { month: "Jun", sales: 5000 },
  ];

  // Chart series configuration
  const chartSeries: ChartSeries[] = [
    {
      dataKey: "sales",
      label: "Monthly Sales",
    },
  ];

  // Simulate loading
  useEffect(() => {
    setLoading(true);
    const timer = setTimeout(() => {
      setLoading(false);
    }, 500);

    return () => clearTimeout(timer);
  }, []);

  const refreshDashboard = () => {
    console.log("Refreshing dashboard data...");
    setLoading(true);
    setTimeout(() => {
      setLoading(false);
    }, 1000);
  };

  return {
    // Data
    stats,
    recentActivityData,
    userGrowthData,
    chartSeries,
    notificationStats,

    // State
    loading,

    // Actions
    refreshDashboard,
  };
};
