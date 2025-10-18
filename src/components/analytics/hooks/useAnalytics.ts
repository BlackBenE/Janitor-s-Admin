import { useState, useCallback } from "react";
import { useQueryClient } from "@tanstack/react-query";
import {
  AnalyticsData,
  DateRange,
  ExportFormat,
} from "../../../types/analytics";
import { useUINotifications } from "../../../hooks/shared";
import { useAnalyticsExport } from "./useAnalyticsExport";
import { useAnalyticsData } from "./analyticsDataGenerator";

/**
 * Hook principal pour gérer les analytics
 */
export const useAnalytics = () => {
  const { showNotification } = useUINotifications();
  const { exportData: exportDataUtil } = useAnalyticsExport();
  const queryClient = useQueryClient();

  // État de base
  const [state, setState] = useState({
    tabValue: 0,
    dateRange: {
      from: new Date(new Date().setMonth(new Date().getMonth() - 3)),
      to: new Date(),
    },
  });

  // Récupérer les données analytics depuis Supabase
  const {
    data: analyticsData,
    isLoading,
    refetch,
  } = useAnalyticsData(state.dateRange);

  // Handlers pour l'état
  const handleTabChange = useCallback((newValue: number) => {
    setState((prev) => ({ ...prev, tabValue: newValue }));
  }, []);

  const handleDateRangeChange = useCallback(
    (dateRange: DateRange) => {
      setState((prev) => ({ ...prev, dateRange }));
      // Forcer le rechargement des données analytics avec les nouvelles dates
      queryClient.invalidateQueries({ queryKey: ["analytics"] });
    },
    [queryClient]
  );

  // Export des données
  const exportData = useCallback(
    async (format: ExportFormat) => {
      try {
        if (!analyticsData) {
          showNotification("Aucune donnée à exporter", "warning");
          return;
        }
        await exportDataUtil(format, analyticsData, state.dateRange);
      } catch (err) {
        console.error("Export error:", err);
        showNotification("Erreur lors de l'export", "error");
      }
    },
    [exportDataUtil, analyticsData, state.dateRange, showNotification]
  );

  // Refresh des données
  const refreshData = useCallback(() => {
    refetch();
  }, [refetch]);

  return {
    // État
    state,
    data: analyticsData,
    loading: isLoading,
    error: null,

    // Actions
    handleTabChange,
    handleDateRangeChange,
    exportData,
    refreshData,

    // Données spécifiques pour faciliter l'accès
    userMetrics: analyticsData?.userMetrics || {
      totalUsers: 0,
      activeUsers: 0,
      newUsers: 0,
      userGrowthRate: 0,
    },
    revenueMetrics: analyticsData?.revenueMetrics || {
      totalRevenue: 0,
      monthlyRevenue: 0,
      averageOrderValue: 0,
      revenueGrowthRate: 0,
    },
    activityMetrics: analyticsData?.activityMetrics || {
      totalBookings: 0,
      completedBookings: 0,
      cancelledBookings: 0,
      activeServices: 0,
    },
    chartData: {
      userGrowth: analyticsData?.userGrowthData || [],
      bookingTrends: analyticsData?.bookingTrends || [],
      topServices: analyticsData?.topServices || [],
      bookingsByStatus: analyticsData?.usersByStatus || [],
    },
  };
};

export default useAnalytics;
