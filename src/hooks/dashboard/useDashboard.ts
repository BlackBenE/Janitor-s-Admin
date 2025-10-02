import { useQuery, useQueryClient } from "@tanstack/react-query";
import { supabase } from "../../lib/supabaseClient";
import {
  ChartDataPoint,
  DashboardStats,
  RecentActivity,
  Profile,
} from "../../types/dashboard";
import { useUINotifications } from "../shared/useUINotifications";
import { useEffect, useCallback } from "react";

// Query keys for cache management
const DASHBOARD_QUERY_KEYS = {
  all: ["dashboard"] as const,
  stats: () => [...DASHBOARD_QUERY_KEYS.all, "stats"] as const,
  activities: () => [...DASHBOARD_QUERY_KEYS.all, "activities"] as const,
  charts: () => [...DASHBOARD_QUERY_KEYS.all, "charts"] as const,
};

// Types for the query results
interface ChartData {
  recentActivityData: ChartDataPoint[];
  userGrowthData: ChartDataPoint[];
}

export const useDashboard = () => {
  const queryClient = useQueryClient();
  const { showNotification } = useUINotifications();

  // Query function for stats
  const fetchStats = async (): Promise<DashboardStats> => {
    try {
      // Calculate start of current and previous month
      const startOfCurrentMonth = new Date();
      startOfCurrentMonth.setDate(1);
      startOfCurrentMonth.setHours(0, 0, 0, 0);

      const startOfLastMonth = new Date(startOfCurrentMonth);
      startOfLastMonth.setMonth(startOfLastMonth.getMonth() - 1);

      // Fetch all stats in parallel
      const [
        currentPendingProps,
        currentModerationCases,
        currentActiveUsers,
        currentRevenues,
      ] = await Promise.all([
        supabase
          .from("properties")
          .select("*", { count: "exact" })
          .is("validated_at", null),
        supabase
          .from("profiles")
          .select("*", { count: "exact" })
          .eq("role", "service_provider")
          .eq("profile_validated", false),
        supabase
          .from("profiles")
          .select("*", { count: "exact" })
          .eq("profile_validated", true),
        supabase
          .from("payments")
          .select("amount")
          .gte("created_at", startOfCurrentMonth.toISOString()),
      ]);

      if (currentPendingProps.error) throw currentPendingProps.error;
      if (currentModerationCases.error) throw currentModerationCases.error;
      if (currentActiveUsers.error) throw currentActiveUsers.error;
      if (currentRevenues.error) throw currentRevenues.error;

      // Calculate monthly revenue
      const currentMonthlyRevenue =
        currentRevenues.data?.reduce(
          (sum: number, payment: { amount: number }) =>
            sum + (Number(payment.amount) || 0),
          0
        ) || 0;

      return {
        pendingValidations: currentPendingProps.count || 0,
        pendingDiff: "",
        moderationCases: currentModerationCases.count || 0,
        moderationDiff: "",
        activeUsers: currentActiveUsers.count || 0,
        monthlyRevenue: currentMonthlyRevenue,
      };
    } catch (error) {
      console.error("Error fetching dashboard stats:", error);
      throw new Error("Failed to fetch dashboard statistics");
    }
  };

  // Query function for activities
  const fetchRecentActivities = async (): Promise<RecentActivity[]> => {
    try {
      // Fetch all activities in parallel with error handling
      const [recentProperties, recentProviders, recentServices] =
        await Promise.all([
          supabase
            .from("properties")
            .select("*")
            .is("validated_at", null)
            .order("created_at", { ascending: false })
            .limit(3)
            .then((result) => {
              if (result.error) {
                console.warn("Error fetching properties:", result.error);
                return { data: [], error: null };
              }
              return result;
            }),
          supabase
            .from("profiles")
            .select("*")
            .eq("role", "service_provider")
            .eq("profile_validated", false)
            .order("created_at", { ascending: false })
            .limit(3)
            .then((result) => {
              if (result.error) {
                console.warn("Error fetching profiles:", result.error);
                return { data: [], error: null };
              }
              return result;
            }),
          supabase
            .from("service_requests")
            .select("*")
            .eq("status", "completed")
            .order("created_at", { ascending: false })
            .limit(3)
            .then((result) => {
              if (result.error) {
                console.warn("Error fetching service_requests:", result.error);
                return { data: [], error: null };
              }
              return result;
            }),
        ]);

      if (recentProperties.error) throw recentProperties.error;
      if (recentProviders.error) throw recentProviders.error;
      if (recentServices.error) throw recentServices.error;

      // Combine and transform the data
      const activities: RecentActivity[] = [
        ...(recentProperties.data?.map((property) => ({
          id: property.id,
          status: "pending" as const,
          title: "New Property Submission",
          description: `A new property has been submitted for validation: ${property.title}`,
          actionLabel: "Review",
          timestamp: property.created_at,
          type: "property" as const,
        })) || []),
        ...(recentProviders.data?.map((provider) => ({
          id: provider.id,
          status: "pending" as const,
          title: "Service Provider Registration",
          description: `New service provider ${provider.full_name} awaiting profile verification`,
          actionLabel: "Verify",
          timestamp: provider.created_at,
          type: "provider" as const,
        })) || []),
        ...(recentServices.data?.map((service: any) => ({
          id: service.id,
          status: "completed" as const,
          title: "Service Request Completed",
          description: "A service request has been completed",
          timestamp: service.created_at,
          type: "service" as const,
        })) || []),
      ]
        .sort(
          (a, b) =>
            new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime()
        )
        .slice(0, 5);

      return activities;
    } catch (error) {
      console.error("Error fetching recent activities:", error);
      throw new Error("Failed to fetch recent activities");
    }
  };

  // Query function for chart data
  const fetchChartData = async (): Promise<ChartData> => {
    try {
      const endDate = new Date();
      const startDate = new Date();
      startDate.setMonth(startDate.getMonth() - 6);

      // Fetch revenue and user data in parallel
      const [revenueData, userData] = await Promise.all([
        supabase
          .from("payments")
          .select("amount, created_at")
          .gte("created_at", startDate.toISOString())
          .lte("created_at", endDate.toISOString()),
        supabase
          .from("profiles")
          .select("created_at")
          .eq("profile_validated", true)
          .gte("created_at", startDate.toISOString())
          .lte("created_at", endDate.toISOString()),
      ]);

      if (revenueData.error) throw revenueData.error;
      if (userData.error) throw userData.error;

      // Process data by month
      const revenueByMonth = new Map<string, number>();
      const usersByMonth = new Map<string, number>();

      revenueData.data?.forEach(
        (item: { amount: number; created_at: string }) => {
          const date = new Date(item.created_at);
          const monthKey = date.toLocaleString("default", { month: "short" });
          revenueByMonth.set(
            monthKey,
            (revenueByMonth.get(monthKey) || 0) + (Number(item.amount) || 0)
          );
        }
      );

      userData.data?.forEach((item: { created_at: string }) => {
        const date = new Date(item.created_at);
        const monthKey = date.toLocaleString("default", { month: "short" });
        usersByMonth.set(monthKey, (usersByMonth.get(monthKey) || 0) + 1);
      });

      // Get last 6 months
      const months = Array.from({ length: 6 }, (_, i) => {
        const d = new Date();
        d.setMonth(d.getMonth() - i);
        return d.toLocaleString("default", { month: "short" });
      }).reverse();

      return {
        recentActivityData: months.map((month) => ({
          month,
          sales: revenueByMonth.get(month) || 0,
        })),
        userGrowthData: months.map((month) => ({
          month,
          sales: usersByMonth.get(month) || 0,
        })),
      };
    } catch (error) {
      console.error("Error fetching chart data:", error);
      throw new Error("Failed to fetch chart data");
    }
  };

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
