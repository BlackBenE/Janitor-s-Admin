import { useQuery, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/core/config/supabase";
import {
  ChartDataPoint,
  DashboardStats,
  RecentActivity,
} from "@/types/dashboard";
import { useUINotifications } from "@/shared/hooks";
import { useEffect, useCallback } from "react";
import {
  fetchStats,
  fetchRecentActivities,
  fetchChartData,
  ChartData,
} from "./dashboardQueries";

// Query keys for cache management
const DASHBOARD_QUERY_KEYS = {
  all: ["dashboard"] as const,
  stats: () => [...DASHBOARD_QUERY_KEYS.all, "stats"] as const,
  activities: () => [...DASHBOARD_QUERY_KEYS.all, "activities"] as const,
  charts: () => [...DASHBOARD_QUERY_KEYS.all, "charts"] as const,
};

export const useDashboard = () => {
  const queryClient = useQueryClient();
  const { showNotification } = useUINotifications();

  // Set up real-time subscriptions
  useEffect(() => {
    const setupSubscriptions = () => {
      const channels = [
        supabase
          .channel("properties_changes")
          .on(
            "postgres_changes",
            { event: "*", schema: "public", table: "properties" },
            () =>
              queryClient.invalidateQueries({
                queryKey: DASHBOARD_QUERY_KEYS.stats(),
              })
          ),
        supabase
          .channel("profiles_changes")
          .on(
            "postgres_changes",
            { event: "*", schema: "public", table: "profiles" },
            () =>
              queryClient.invalidateQueries({
                queryKey: DASHBOARD_QUERY_KEYS.stats(),
              })
          ),
        supabase
          .channel("payments_changes")
          .on(
            "postgres_changes",
            { event: "*", schema: "public", table: "payments" },
            () => {
              queryClient.invalidateQueries({
                queryKey: DASHBOARD_QUERY_KEYS.stats(),
              });
              queryClient.invalidateQueries({
                queryKey: DASHBOARD_QUERY_KEYS.charts(),
              });
            }
          ),
        supabase
          .channel("service_requests_changes")
          .on(
            "postgres_changes",
            { event: "*", schema: "public", table: "service_requests" },
            () =>
              queryClient.invalidateQueries({
                queryKey: DASHBOARD_QUERY_KEYS.activities(),
              })
          ),
      ];

      channels.forEach((channel) => channel.subscribe());

      return () => {
        channels.forEach((channel) => channel.unsubscribe());
      };
    };

    return setupSubscriptions();
  }, [queryClient]);

  // Queries with react-query (configuration similaire à userManagement)
  const {
    data: stats,
    isLoading: statsLoading,
    isFetching: statsIsFetching,
    error: statsError,
  } = useQuery({
    queryKey: DASHBOARD_QUERY_KEYS.stats(),
    queryFn: fetchStats,
    staleTime: 2 * 60 * 1000, // 2 minutes
    retry: 2,
    // Utilise les paramètres par défaut définis dans App.tsx
  });

  const {
    data: activities,
    isLoading: activitiesLoading,
    isFetching: activitiesIsFetching,
    error: activitiesError,
  } = useQuery({
    queryKey: DASHBOARD_QUERY_KEYS.activities(),
    queryFn: fetchRecentActivities,
    staleTime: 1 * 60 * 1000, // 1 minute - activités changent plus souvent
    retry: 2,
  });

  const {
    data: chartData,
    isLoading: chartsLoading,
    isFetching: chartsIsFetching,
    error: chartsError,
  } = useQuery({
    queryKey: DASHBOARD_QUERY_KEYS.charts(),
    queryFn: fetchChartData,
    staleTime: 5 * 60 * 1000, // 5 minutes - données de graphiques moins critiques
    retry: 2,
  });

  // Manual refresh function
  const refreshDashboard = useCallback(async () => {
    try {
      await Promise.all([
        queryClient.invalidateQueries({
          queryKey: DASHBOARD_QUERY_KEYS.stats(),
        }),
        queryClient.invalidateQueries({
          queryKey: DASHBOARD_QUERY_KEYS.activities(),
        }),
        queryClient.invalidateQueries({
          queryKey: DASHBOARD_QUERY_KEYS.charts(),
        }),
      ]);
      showNotification("Dashboard mis à jour", "success");
    } catch (error) {
      showNotification("Erreur lors de la mise à jour", "error");
    }
  }, [queryClient, showNotification]);

  // Détermine si on doit afficher le loading state (comme userManagement)
  const isLoading = statsLoading || activitiesLoading || chartsLoading;

  // Gestion des erreurs
  const hasError = statsError || activitiesError || chartsError;
  const errorMessage = hasError
    ? "Erreur lors du chargement des données du dashboard"
    : null;

  return {
    stats: stats || {
      pendingValidations: 0,
      pendingDiff: "",
      moderationCases: 0,
      moderationDiff: "",
      activeUsers: 0,
      monthlyRevenue: 0,
    },
    recentActivities: activities || [],
    recentActivityData: chartData?.recentActivityData || [],
    userGrowthData: chartData?.userGrowthData || [],
    // Simple loading state comme userManagement
    loading: isLoading,
    // isFetching pour indiquer le rafraîchissement en cours
    isFetching: {
      stats: statsIsFetching,
      activities: activitiesIsFetching,
      charts: chartsIsFetching,
    },
    error: errorMessage,
    chartSeries: [{ dataKey: "sales", label: "Actions" }],
    refreshDashboard,
  };
};
