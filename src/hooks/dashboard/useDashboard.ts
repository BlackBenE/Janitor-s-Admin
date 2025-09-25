import { useState, useEffect, useCallback } from "react";
import { useUINotifications } from "../shared/useUINotifications";
import { supabase } from "../../lib/supabaseClient";
import {
  ChartDataPoint,
  DashboardData,
  Profile,
  DashboardStats,
} from "../../types/dashboard";

/**
 * Hook principal pour la gestion du tableau de bord
 */
export const useDashboard = () => {
  const { showNotification } = useUINotifications();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [data, setData] = useState<DashboardData>({
    stats: {
      pendingValidations: 0,
      pendingDiff: "0",
      moderationCases: 0,
      moderationDiff: "0",
      activeUsers: 0,
      monthlyRevenue: 0,
    },
    recentActivityData: [],
    userGrowthData: [],
  });

  // Charger les stats depuis Supabase
  const loadStats = useCallback(async () => {
    try {
      // Calculate start of current and previous month
      const startOfCurrentMonth = new Date();
      startOfCurrentMonth.setDate(1);
      startOfCurrentMonth.setHours(0, 0, 0, 0);

      const startOfLastMonth = new Date(startOfCurrentMonth);
      startOfLastMonth.setMonth(startOfLastMonth.getMonth() - 1);

      // Current pending properties
      const { count: currentPendingProps, error } = await supabase
        .from("properties")
        .select("*", { count: "exact" })
        .is("validated_at", null);

      if (error) {
        console.error("Error fetching properties:", error);
        return null;
      }

      // Last month's pending properties
      const { count: lastMonthPendingProps } = await supabase
        .from("properties")
        .select("*", { count: "exact" })
        .is("validated_at", null)
        .lt("created_at", startOfCurrentMonth.toISOString());

      // Current moderation cases
      const { count: currentModerationCount } = await supabase
        .from("profiles")
        .select("*", { count: "exact" })
        .eq("role", "service_provider")
        .eq("profile_validated", false);

      // Last month's moderation cases
      const { count: lastMonthModerationCount } = await supabase
        .from("profiles")
        .select("*", { count: "exact" })
        .eq("role", "service_provider")
        .eq("profile_validated", false)
        .lt("created_at", startOfCurrentMonth.toISOString());

      // Current active users
      const { count: currentActiveCount } = await supabase
        .from("profiles")
        .select("*", { count: "exact" })
        .eq("profile_validated", true);

      // Last month's active users
      const { count: lastMonthActiveCount } = await supabase
        .from("profiles")
        .select("*", { count: "exact" })
        .eq("profile_validated", true)
        .lt("created_at", startOfCurrentMonth.toISOString());

      // Yesterday's active users
      const startOfYesterday = new Date();
      startOfYesterday.setDate(startOfYesterday.getDate() - 1);
      startOfYesterday.setHours(0, 0, 0, 0);
      const { count: yesterdayActiveCount } = await supabase
        .from("profiles")
        .select("*", { count: "exact" })
        .eq("profile_validated", true)
        .lt("created_at", startOfYesterday.toISOString());

      // Current month revenue
      const { data: currentRevenues } = await supabase
        .from("payments")
        .select("amount")
        .gte("created_at", startOfCurrentMonth.toISOString());

      // Last month revenue
      const { data: lastMonthRevenues } = await supabase
        .from("payments")
        .select("amount")
        .gte("created_at", startOfLastMonth.toISOString())
        .lt("created_at", startOfCurrentMonth.toISOString());

      // Calculate revenues
      const currentMonthlyRevenue =
        currentRevenues?.reduce(
          (sum: number, payment: { amount: number }) =>
            sum + (Number(payment.amount) || 0),
          0
        ) || 0;

      const lastMonthlyRevenue =
        lastMonthRevenues?.reduce(
          (sum: number, payment: { amount: number }) =>
            sum + (Number(payment.amount) || 0),
          0
        ) || 0;

      // Return the simplified stats
      return {
        pendingValidations: currentPendingProps || 0,
        pendingDiff: "",
        moderationCases: currentModerationCount || 0,
        moderationDiff: "",
        activeUsers: currentActiveCount || 0,
        monthlyRevenue: currentMonthlyRevenue,
      };
    } catch (error) {
      console.error("Error loading dashboard stats:", error);
      showNotification("Erreur lors du chargement des statistiques", "error");
      return null;
    }
  }, [showNotification]);

  // Charger les données des graphiques
  const loadChartData = useCallback(async () => {
    try {
      const endDate = new Date();
      const startDate = new Date();
      startDate.setMonth(startDate.getMonth() - 6);

      const { data: activityData } = await supabase
        .from("profiles")
        .select("created_at")
        .gte("created_at", startDate.toISOString())
        .lte("created_at", endDate.toISOString());

      const { data: userData } = await supabase
        .from("profiles")
        .select("created_at")
        .gte("created_at", startDate.toISOString())
        .lte("created_at", endDate.toISOString());

      // Traitement des données
      const activityByMonth = new Map<string, number>();
      const usersByMonth = new Map<string, number>();

      (activityData as Profile[])?.forEach((item) => {
        if (item.created_at) {
          const date = new Date(item.created_at);
          const monthKey = date.toLocaleString("default", { month: "short" });
          activityByMonth.set(
            monthKey,
            (activityByMonth.get(monthKey) || 0) + 1
          );
        }
      });

      (userData as Profile[])?.forEach((item) => {
        if (item.created_at) {
          const date = new Date(item.created_at);
          const monthKey = date.toLocaleString("default", { month: "short" });
          usersByMonth.set(monthKey, (usersByMonth.get(monthKey) || 0) + 1);
        }
      });

      const months = Array.from({ length: 6 }, (_, i) => {
        const d = new Date();
        d.setMonth(d.getMonth() - i);
        return d.toLocaleString("default", { month: "short" });
      }).reverse();

      return {
        recentActivityData: months.map((month) => ({
          month,
          sales: activityByMonth.get(month) || 0,
        })),
        userGrowthData: months.map((month) => ({
          month,
          sales: usersByMonth.get(month) || 0,
        })),
      };
    } catch (error) {
      console.error("Error loading chart data:", error);
      showNotification("Erreur lors du chargement des graphiques", "error");
      return null;
    }
  }, [showNotification]);

  // Chargement initial des données
  useEffect(() => {
    const initializeDashboard = async () => {
      setLoading(true);
      setError(null);

      try {
        const [stats, chartData] = await Promise.all([
          loadStats(),
          loadChartData(),
        ]);

        if (stats && chartData) {
          setData({
            stats,
            recentActivityData: chartData.recentActivityData,
            userGrowthData: chartData.userGrowthData,
          });
        } else {
          setError("Failed to load dashboard data");
        }
      } catch (err) {
        setError(err instanceof Error ? err.message : "An error occurred");
      } finally {
        setLoading(false);
      }
    };

    initializeDashboard();
  }, [loadStats, loadChartData]);

  // Rafraîchissement manuel du dashboard
  const refreshDashboard = useCallback(async () => {
    setLoading(true);
    setError(null);

    try {
      const [stats, chartData] = await Promise.all([
        loadStats(),
        loadChartData(),
      ]);

      if (stats && chartData) {
        setData({
          stats,
          recentActivityData: chartData.recentActivityData,
          userGrowthData: chartData.userGrowthData,
        });
        showNotification("Dashboard mis à jour", "success");
      } else {
        setError("Failed to refresh dashboard data");
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : "An error occurred");
      showNotification("Erreur lors de la mise à jour", "error");
    } finally {
      setLoading(false);
    }
  }, [loadStats, loadChartData, showNotification]);

  return {
    ...data,
    loading,
    error,
    chartSeries: [
      {
        dataKey: "sales",
        label: "Actions",
      },
    ],
    refreshDashboard,
  };
};
