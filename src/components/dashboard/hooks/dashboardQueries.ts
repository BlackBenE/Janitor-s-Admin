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
        .eq("profile_validated", false)
        .is("deleted_at", null), // Exclure les utilisateurs supprimés
      supabase
        .from("profiles")
        .select("*", { count: "exact" })
        .eq("profile_validated", true)
        .is("deleted_at", null), // Exclure les utilisateurs supprimés
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
 * Récupère les activités récentes nécessitant une intervention admin
 */
export const fetchRecentActivities = async (): Promise<RecentActivity[]> => {
  try {
    // Fetch all activities in parallel with error handling
    const [
      recentProperties,
      recentProviders,
      disputedServices,
      recentPayments,
      chatReports,
      failedPayments,
      overduePayments,
      pendingRefunds,
      pendingUsers,
      lockedAccounts,
    ] = await Promise.all([
      // Propriétés soumises (nouvelles + en attente de validation)
      supabase
        .from("properties")
        .select("*")
        .is("validated_at", null)
        .order("created_at", { ascending: false })
        .limit(5)
        .then((result) => {
          if (result.error) {
            console.warn("Error fetching properties:", result.error);
            return { data: [], error: null };
          }
          return result;
        }),
      // Prestataires en attente de validation
      supabase
        .from("profiles")
        .select("*")
        .eq("role", "service_provider")
        .eq("profile_validated", false)
        .is("deleted_at", null)
        .order("created_at", { ascending: false })
        .limit(5)
        .then((result) => {
          if (result.error) {
            console.warn("Error fetching profiles:", result.error);
            return { data: [], error: null };
          }
          return result;
        }),
      // Services en dispute ou problématiques (pas "completed" mais "cancelled", "disputed")
      supabase
        .from("service_requests")
        .select("*")
        .in("status", ["cancelled", "disputed", "pending"])
        .not("cancellation_reason", "is", null)
        .order("updated_at", { ascending: false })
        .limit(3)
        .then((result) => {
          if (result.error) {
            console.warn("Error fetching disputed services:", result.error);
            return { data: [], error: null };
          }
          return result;
        }),
      // Paiements récents nécessitant une vérification
      supabase
        .from("payments")
        .select("*")
        .in("status", ["pending", "processing"])
        .order("created_at", { ascending: false })
        .limit(3)
        .then((result) => {
          if (result.error) {
            console.warn("Error fetching payments:", result.error);
            return { data: [], error: null };
          }
          return result;
        }),
      // Signalements de chat non résolus
      supabase
        .from("chat_reports")
        .select("*")
        .eq("status", "pending")
        .order("created_at", { ascending: false })
        .limit(3)
        .then((result) => {
          if (result.error) {
            console.warn("Error fetching chat reports:", result.error);
            return { data: [], error: null };
          }
          return result;
        }),
      // Paiements échoués récents
      supabase
        .from("payments")
        .select("*")
        .eq("status", "failed")
        .not("failure_reason", "is", null)
        .order("created_at", { ascending: false })
        .limit(2)
        .then((result) => {
          if (result.error) {
            console.warn("Error fetching failed payments:", result.error);
            return { data: [], error: null };
          }
          return result;
        }),
      // Paiements en retard (pending depuis plus de 24h)
      supabase
        .from("payments")
        .select("*")
        .eq("status", "pending")
        .is("processed_at", null)
        .lt(
          "created_at",
          new Date(Date.now() - 24 * 60 * 60 * 1000).toISOString()
        )
        .order("created_at", { ascending: false })
        .limit(3)
        .then((result) => {
          if (result.error) {
            console.warn("Error fetching overdue payments:", result.error);
            return { data: [], error: null };
          }
          return result;
        }),
      // Remboursements en attente
      supabase
        .from("payments")
        .select("*")
        .in("refund_status", ["pending", "processing"])
        .not("refund_amount", "is", null)
        .order("created_at", { ascending: false })
        .limit(3)
        .then((result) => {
          if (result.error) {
            console.warn("Error fetching pending refunds:", result.error);
            return { data: [], error: null };
          }
          return result;
        }),
      // Utilisateurs en attente de validation (tous rôles sauf service_provider déjà traité)
      supabase
        .from("profiles")
        .select("*")
        .eq("profile_validated", false)
        .neq("role", "service_provider")
        .is("deleted_at", null)
        .order("created_at", { ascending: false })
        .limit(5)
        .then((result) => {
          if (result.error) {
            console.warn("Error fetching pending users:", result.error);
            return { data: [], error: null };
          }
          return result;
        }),
      // Comptes verrouillés récents nécessitant une révision
      supabase
        .from("profiles")
        .select("*")
        .eq("account_locked", true)
        .not("lock_reason", "is", null)
        .is("deleted_at", null)
        .order("updated_at", { ascending: false })
        .limit(3)
        .then((result) => {
          if (result.error) {
            console.warn("Error fetching locked accounts:", result.error);
            return { data: [], error: null };
          }
          return result;
        }),
    ]);

    if (recentProperties.error) throw recentProperties.error;
    if (recentProviders.error) throw recentProviders.error;
    if (disputedServices.error) throw disputedServices.error;
    if (recentPayments.error) throw recentPayments.error;
    if (chatReports.error) throw chatReports.error;
    if (failedPayments.error) throw failedPayments.error;
    if (overduePayments.error) throw overduePayments.error;
    if (pendingRefunds.error) throw pendingRefunds.error;
    if (pendingUsers.error) throw pendingUsers.error;
    if (lockedAccounts.error) throw lockedAccounts.error;

    // Combine and transform the data
    const activities: RecentActivity[] = [
      // Propriétés en attente de validation
      ...(recentProperties.data?.map((property) => ({
        id: property.id,
        status: "pending" as const,
        title: "New Property Submission",
        description: `Property "${property.title}" in ${property.city} awaiting validation`,
        actionLabel: "Review Property",
        timestamp: property.created_at,
        type: "property" as const,
      })) || []),

      // Prestataires en attente de validation
      ...(recentProviders.data?.map((provider) => ({
        id: provider.id,
        status: "pending" as const,
        title: "Service Provider Registration",
        description: `${
          provider.full_name || provider.email
        } awaiting profile verification`,
        actionLabel: "Verify Provider",
        timestamp: provider.created_at,
        type: "provider" as const,
      })) || []),

      // Services problématiques
      ...(disputedServices.data?.map((service: any) => ({
        id: service.id,
        status:
          service.status === "cancelled"
            ? ("cancelled" as const)
            : ("pending" as const),
        title:
          service.status === "cancelled"
            ? "Service Cancelled"
            : "Service Issue",
        description:
          service.cancellation_reason ||
          "Service request requires admin attention",
        actionLabel: "Review Service",
        timestamp: service.updated_at || service.created_at,
        type: "service" as const,
      })) || []),

      // Paiements en attente
      ...(recentPayments.data?.map((payment: any) => ({
        id: payment.id,
        status: "pending" as const,
        title: "Payment Verification",
        description: `Payment of €${payment.amount} requires verification`,
        actionLabel: "Review Payment",
        timestamp: payment.created_at,
        type: "payment" as const,
      })) || []),

      // Signalements de chat
      ...(chatReports.data?.map((report: any) => ({
        id: report.id,
        status: "review_required" as const,
        title: "Chat Report",
        description: `User reported for: ${report.reason}`,
        actionLabel: "Review Report",
        timestamp: report.created_at,
        type: "chat_report" as const,
      })) || []),

      // Paiements échoués
      ...(failedPayments.data?.map((payment: any) => ({
        id: payment.id,
        status: "failed" as const,
        title: "Payment Failed",
        description: `Payment failed: ${payment.failure_reason}`,
        actionLabel: "Investigate",
        timestamp: payment.created_at,
        type: "failed_payment" as const,
      })) || []),

      // Paiements en retard (plus de 24h)
      ...(overduePayments.data?.map((payment: any) => {
        const daysSinceCreation = Math.floor(
          (Date.now() - new Date(payment.created_at).getTime()) /
            (1000 * 60 * 60 * 24)
        );
        return {
          id: payment.id,
          status: "review_required" as const,
          title: "Payment Overdue",
          description: `Payment of €${payment.amount} pending for ${daysSinceCreation} day(s)`,
          actionLabel: "Review Payment",
          timestamp: payment.created_at,
          type: "overdue_payment" as const,
        };
      }) || []),

      // Remboursements en attente
      ...(pendingRefunds.data?.map((payment: any) => ({
        id: payment.id,
        status: "pending" as const,
        title: "Refund Processing",
        description: `Refund of €${payment.refund_amount} requires processing`,
        actionLabel: "Process Refund",
        timestamp: payment.created_at,
        type: "pending_refund" as const,
      })) || []),

      // Utilisateurs en attente de validation (Property Owners, Travelers, etc.)
      ...(pendingUsers.data?.map((user: any) => {
        const roleDisplay =
          user.role === "property_owner"
            ? "Property Owner"
            : user.role === "traveler"
            ? "Traveler"
            : user.role === "admin"
            ? "Admin"
            : "User";
        return {
          id: user.id,
          status: "pending" as const,
          title: `${roleDisplay} Registration`,
          description: `${
            user.full_name || user.email
          } (${roleDisplay}) awaiting account validation`,
          actionLabel: "Validate Account",
          timestamp: user.created_at,
          type: "pending_user" as const,
        };
      }) || []),

      // Comptes verrouillés nécessitant une révision
      ...(lockedAccounts.data?.map((account: any) => ({
        id: account.id,
        status: "review_required" as const,
        title: "Account Locked",
        description: `Account ${account.full_name || account.email} locked: ${
          account.lock_reason
        }`,
        actionLabel: "Review Lock",
        timestamp: account.updated_at || account.created_at,
        type: "locked_account" as const,
      })) || []),
    ]
      .sort(
        (a, b) =>
          new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime()
      )
      .slice(0, 10); // Augmenté à 10 pour tester le scroll

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
