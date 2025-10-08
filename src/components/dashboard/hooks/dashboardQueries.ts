import { supabase } from "../../../lib/supabaseClient";
import {
  ChartDataPoint,
  DashboardStats,
  RecentActivity,
} from "../../../types/dashboard";

// Types for the query results
export interface ChartData {
  recentActivityData: ChartDataPoint[];
  userGrowthData: ChartDataPoint[];
}

/**
 * Récupère les statistiques du dashboard
 */
export const fetchStats = async (): Promise<DashboardStats> => {
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

/**
 * Récupère les activités récentes
 */
export const fetchRecentActivities = async (): Promise<RecentActivity[]> => {
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

/**
 * Récupère les données des graphiques
 */
export const fetchChartData = async (): Promise<ChartData> => {
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
