import { useQuery, useQueryClient } from "@tanstack/react-query";
import { dataProvider } from "../providers/dataProvider";
import type { Database } from "../types/database.types";

type Payment = Database["public"]["Tables"]["payments"]["Row"];

// Financial metrics interface
export interface FinancialMetrics {
  // Revenue metrics
  totalRevenue: number;
  monthlyRevenue: number;
  weeklyRevenue: number;
  dailyRevenue: number;

  // Growth metrics
  monthlyGrowth: number;
  weeklyGrowth: number;

  // Revenue by source
  bookingRevenue: number;
  serviceRevenue: number;
  subscriptionRevenue: number;
  commissionRevenue: number;

  // Payment metrics
  totalPayments: number;
  pendingPayments: number;
  completedPayments: number;
  failedPayments: number;

  // Average metrics
  averageBookingValue: number;
  averageServiceValue: number;
  averageOrderValue: number;

  // Commission metrics
  totalCommissions: number;
  monthlyCommissions: number;
  commissionRate: number;
}

// Time-series data for charts
export interface RevenueTimeSeries {
  date: string;
  revenue: number;
  bookings: number;
  services: number;
  commissions: number;
}

// Top performers data
export interface TopPerformers {
  topProperties: Array<{
    id: string;
    title: string;
    revenue: number;
    bookings: number;
  }>;
  topProviders: Array<{
    id: string;
    name: string;
    revenue: number;
    services: number;
  }>;
  topUsers: Array<{
    id: string;
    name: string;
    spent: number;
    transactions: number;
  }>;
}

// Financial summary for dashboard cards
export interface FinancialSummary {
  revenue: {
    total: number;
    monthly: number;
    growth: number;
    trend: "up" | "down" | "stable";
  };
  payments: {
    total: number;
    pending: number;
    completed: number;
    trend: "up" | "down" | "stable";
  };
  commissions: {
    total: number;
    monthly: number;
    rate: number;
    trend: "up" | "down" | "stable";
  };
  users: {
    paying: number;
    subscribers: number;
    averageSpend: number;
    trend: "up" | "down" | "stable";
  };
}

// Query keys for cache management
const FINANCIAL_DATA_QUERY_KEYS = {
  all: ["financial-data"] as const,
  metrics: () => [...FINANCIAL_DATA_QUERY_KEYS.all, "metrics"] as const,
  timeSeries: (period: string) =>
    [...FINANCIAL_DATA_QUERY_KEYS.all, "time-series", period] as const,
  summary: () => [...FINANCIAL_DATA_QUERY_KEYS.all, "summary"] as const,
  topPerformers: () =>
    [...FINANCIAL_DATA_QUERY_KEYS.all, "top-performers"] as const,
  commissions: () => [...FINANCIAL_DATA_QUERY_KEYS.all, "commissions"] as const,
  reports: (type: string) =>
    [...FINANCIAL_DATA_QUERY_KEYS.all, "reports", type] as const,
};

export const useFinancialData = () => {
  const queryClient = useQueryClient();

  // Helper function to calculate date ranges
  const getDateRanges = () => {
    const now = new Date();
    const today = new Date(now.getFullYear(), now.getMonth(), now.getDate());
    const weekAgo = new Date(today.getTime() - 7 * 24 * 60 * 60 * 1000);
    const monthAgo = new Date(today.getTime() - 30 * 24 * 60 * 60 * 1000);
    const twoMonthsAgo = new Date(today.getTime() - 60 * 24 * 60 * 60 * 1000);

    return { today, weekAgo, monthAgo, twoMonthsAgo };
  };

  // Helper function to calculate growth percentage
  const calculateGrowth = (current: number, previous: number): number => {
    if (previous === 0) return current > 0 ? 100 : 0;
    return Math.round(((current - previous) / previous) * 100 * 100) / 100;
  };

  // Helper function to determine trend
  const getTrend = (growth: number): "up" | "down" | "stable" => {
    if (growth > 5) return "up";
    if (growth < -5) return "down";
    return "stable";
  };

  // Get comprehensive financial metrics
  const useFinancialMetrics = () => {
    return useQuery({
      queryKey: FINANCIAL_DATA_QUERY_KEYS.metrics(),
      queryFn: async (): Promise<FinancialMetrics> => {
        const { today, weekAgo, monthAgo, twoMonthsAgo } = getDateRanges();

        // Fetch all financial data
        const [
          allPayments,
          monthlyPayments,
          weeklyPayments,
          dailyPayments,
          previousMonthPayments,
          previousWeekPayments,
          bookings,
          serviceRequests,
          // subscriptions,
        ] = await Promise.all([
          dataProvider.getList("payments", {}),
          dataProvider.getList(
            "payments",
            {},
            {
              created_at: `gte.${monthAgo.toISOString()}`,
            }
          ),
          dataProvider.getList(
            "payments",
            {},
            {
              created_at: `gte.${weekAgo.toISOString()}`,
            }
          ),
          dataProvider.getList(
            "payments",
            {},
            {
              created_at: `gte.${today.toISOString()}`,
            }
          ),
          dataProvider.getList(
            "payments",
            {},
            {
              created_at: `gte.${twoMonthsAgo.toISOString()}&lt.${monthAgo.toISOString()}`,
            }
          ),
          dataProvider.getList(
            "payments",
            {},
            {
              created_at: `gte.${new Date(
                weekAgo.getTime() - 7 * 24 * 60 * 60 * 1000
              ).toISOString()}&lt.${weekAgo.toISOString()}`,
            }
          ),
          dataProvider.getList("bookings", {}),
          dataProvider.getList("service_requests", {}),
          dataProvider.getList("subscriptions", {}),
        ]);

        // Process payments data
        const payments =
          allPayments.success && allPayments.data ? allPayments.data : [];
        const completedPayments = payments.filter(
          (p) => p.status === "completed"
        );
        const pendingPayments = payments.filter((p) => p.status === "pending");
        const failedPayments = payments.filter((p) => p.status === "failed");

        // Calculate revenue metrics
        const totalRevenue = completedPayments.reduce(
          (sum, p) => sum + p.amount,
          0
        );

        const monthlyCompletedPayments =
          monthlyPayments.success && monthlyPayments.data
            ? monthlyPayments.data.filter((p) => p.status === "completed")
            : [];
        const monthlyRevenue = monthlyCompletedPayments.reduce(
          (sum, p) => sum + p.amount,
          0
        );

        const weeklyCompletedPayments =
          weeklyPayments.success && weeklyPayments.data
            ? weeklyPayments.data.filter((p) => p.status === "completed")
            : [];
        const weeklyRevenue = weeklyCompletedPayments.reduce(
          (sum, p) => sum + p.amount,
          0
        );

        const dailyCompletedPayments =
          dailyPayments.success && dailyPayments.data
            ? dailyPayments.data.filter((p) => p.status === "completed")
            : [];
        const dailyRevenue = dailyCompletedPayments.reduce(
          (sum, p) => sum + p.amount,
          0
        );

        // Calculate growth metrics
        const previousMonthCompletedPayments =
          previousMonthPayments.success && previousMonthPayments.data
            ? previousMonthPayments.data.filter((p) => p.status === "completed")
            : [];
        const previousMonthRevenue = previousMonthCompletedPayments.reduce(
          (sum, p) => sum + p.amount,
          0
        );

        const previousWeekCompletedPayments =
          previousWeekPayments.success && previousWeekPayments.data
            ? previousWeekPayments.data.filter((p) => p.status === "completed")
            : [];
        const previousWeekRevenue = previousWeekCompletedPayments.reduce(
          (sum, p) => sum + p.amount,
          0
        );

        const monthlyGrowth = calculateGrowth(
          monthlyRevenue,
          previousMonthRevenue
        );
        const weeklyGrowth = calculateGrowth(
          weeklyRevenue,
          previousWeekRevenue
        );

        // Calculate revenue by source
        const bookingRevenue = completedPayments
          .filter((p) => p.payment_type === "booking_payment")
          .reduce((sum, p) => sum + p.amount, 0);

        const serviceRevenue = completedPayments
          .filter((p) => p.payment_type === "service_payment")
          .reduce((sum, p) => sum + p.amount, 0);

        const subscriptionRevenue = completedPayments
          .filter((p) => p.payment_type === "subscription")
          .reduce((sum, p) => sum + p.amount, 0);

        const commissionRevenue = completedPayments
          .filter((p) => p.payment_type === "commission")
          .reduce((sum, p) => sum + p.amount, 0);

        // Calculate averages
        const bookingData =
          bookings.success && bookings.data ? bookings.data : [];
        const serviceData =
          serviceRequests.success && serviceRequests.data
            ? serviceRequests.data
            : [];

        const averageBookingValue =
          bookingData.length > 0
            ? bookingData.reduce((sum, b) => sum + b.total_amount, 0) /
              bookingData.length
            : 0;

        const averageServiceValue =
          serviceData.length > 0
            ? serviceData.reduce((sum, s) => sum + s.total_amount, 0) /
              serviceData.length
            : 0;

        const averageOrderValue =
          completedPayments.length > 0
            ? totalRevenue / completedPayments.length
            : 0;

        // Calculate commission metrics
        const totalCommissions = commissionRevenue;
        const monthlyCommissions = monthlyCompletedPayments
          .filter((p) => p.payment_type === "commission")
          .reduce((sum, p) => sum + p.amount, 0);

        const commissionRate =
          totalRevenue > 0 ? (totalCommissions / totalRevenue) * 100 : 0;

        return {
          // Revenue metrics
          totalRevenue: Math.round(totalRevenue * 100) / 100,
          monthlyRevenue: Math.round(monthlyRevenue * 100) / 100,
          weeklyRevenue: Math.round(weeklyRevenue * 100) / 100,
          dailyRevenue: Math.round(dailyRevenue * 100) / 100,

          // Growth metrics
          monthlyGrowth,
          weeklyGrowth,

          // Revenue by source
          bookingRevenue: Math.round(bookingRevenue * 100) / 100,
          serviceRevenue: Math.round(serviceRevenue * 100) / 100,
          subscriptionRevenue: Math.round(subscriptionRevenue * 100) / 100,
          commissionRevenue: Math.round(commissionRevenue * 100) / 100,

          // Payment metrics
          totalPayments: payments.length,
          pendingPayments: pendingPayments.length,
          completedPayments: completedPayments.length,
          failedPayments: failedPayments.length,

          // Average metrics
          averageBookingValue: Math.round(averageBookingValue * 100) / 100,
          averageServiceValue: Math.round(averageServiceValue * 100) / 100,
          averageOrderValue: Math.round(averageOrderValue * 100) / 100,

          // Commission metrics
          totalCommissions: Math.round(totalCommissions * 100) / 100,
          monthlyCommissions: Math.round(monthlyCommissions * 100) / 100,
          commissionRate: Math.round(commissionRate * 100) / 100,
        };
      },
      staleTime: 5 * 60 * 1000, // 5 minutes
      refetchInterval: 10 * 60 * 1000, // Refresh every 10 minutes
    });
  };

  // Get revenue time series data for charts
  const useRevenueTimeSeries = (period: "7d" | "30d" | "90d" = "30d") => {
    return useQuery({
      queryKey: FINANCIAL_DATA_QUERY_KEYS.timeSeries(period),
      queryFn: async (): Promise<RevenueTimeSeries[]> => {
        const days = period === "7d" ? 7 : period === "30d" ? 30 : 90;
        const startDate = new Date();
        startDate.setDate(startDate.getDate() - days);

        const response = await dataProvider.getList(
          "payments",
          {},
          {
            created_at: `gte.${startDate.toISOString()}`,
            status: "completed",
          }
        );

        if (!response.success || !response.data) {
          return [];
        }

        // Group payments by date
        const paymentsByDate = new Map<string, Payment[]>();

        response.data.forEach((payment) => {
          const date = payment.created_at?.split("T")[0] || "";
          if (!paymentsByDate.has(date)) {
            paymentsByDate.set(date, []);
          }
          paymentsByDate.get(date)?.push(payment);
        });

        // Generate time series data
        const timeSeries: RevenueTimeSeries[] = [];

        for (let i = 0; i < days; i++) {
          const date = new Date();
          date.setDate(date.getDate() - (days - 1 - i));
          const dateStr = date.toISOString().split("T")[0];

          const dayPayments = paymentsByDate.get(dateStr) || [];

          const revenue = dayPayments.reduce((sum, p) => sum + p.amount, 0);
          const bookings = dayPayments.filter(
            (p) => p.payment_type === "booking_payment"
          ).length;
          const services = dayPayments.filter(
            (p) => p.payment_type === "service_payment"
          ).length;
          const commissions = dayPayments
            .filter((p) => p.payment_type === "commission")
            .reduce((sum, p) => sum + p.amount, 0);

          timeSeries.push({
            date: dateStr,
            revenue: Math.round(revenue * 100) / 100,
            bookings,
            services,
            commissions: Math.round(commissions * 100) / 100,
          });
        }

        return timeSeries;
      },
      staleTime: 10 * 60 * 1000, // 10 minutes
    });
  };

  // Get financial summary for dashboard cards
  const useFinancialSummary = () => {
    return useQuery({
      queryKey: FINANCIAL_DATA_QUERY_KEYS.summary(),
      queryFn: async (): Promise<FinancialSummary> => {
        // Get financial metrics data
        const { weekAgo, monthAgo, twoMonthsAgo } = getDateRanges();

        const [
          allPayments,
          monthlyPayments,
          weeklyPayments,
          previousMonthPayments,
          users,
          // subscriptions,
        ] = await Promise.all([
          dataProvider.getList("payments", {}),
          dataProvider.getList(
            "payments",
            {},
            {
              created_at: `gte.${monthAgo.toISOString()}`,
            }
          ),
          dataProvider.getList(
            "payments",
            {},
            {
              created_at: `gte.${weekAgo.toISOString()}`,
            }
          ),
          dataProvider.getList(
            "payments",
            {},
            {
              created_at: `gte.${twoMonthsAgo.toISOString()}&lt.${monthAgo.toISOString()}`,
            }
          ),
          dataProvider.getList("profiles", {}),
          dataProvider.getList("subscriptions", {}, { status: "active" }),
        ]);

        // Process payments data
        const payments =
          allPayments.success && allPayments.data ? allPayments.data : [];
        const completedPayments = payments.filter(
          (p) => p.status === "completed"
        );
        const pendingPayments = payments.filter((p) => p.status === "pending");

        // Calculate revenue metrics
        const totalRevenue = completedPayments.reduce(
          (sum, p) => sum + p.amount,
          0
        );

        const monthlyCompletedPayments =
          monthlyPayments.success && monthlyPayments.data
            ? monthlyPayments.data.filter((p) => p.status === "completed")
            : [];
        const monthlyRevenue = monthlyCompletedPayments.reduce(
          (sum, p) => sum + p.amount,
          0
        );

        const weeklyCompletedPayments =
          weeklyPayments.success && weeklyPayments.data
            ? weeklyPayments.data.filter((p) => p.status === "completed")
            : [];
        const weeklyRevenue = weeklyCompletedPayments.reduce(
          (sum, p) => sum + p.amount,
          0
        );

        // Calculate growth metrics
        const previousMonthCompletedPayments =
          previousMonthPayments.success && previousMonthPayments.data
            ? previousMonthPayments.data.filter((p) => p.status === "completed")
            : [];
        const previousMonthRevenue = previousMonthCompletedPayments.reduce(
          (sum, p) => sum + p.amount,
          0
        );

        const monthlyGrowth = calculateGrowth(
          monthlyRevenue,
          previousMonthRevenue
        );
        const weeklyGrowth = calculateGrowth(weeklyRevenue, 0); // Simplified for summary

        // Calculate commission metrics
        const totalCommissions = completedPayments
          .filter((p) => p.payment_type === "commission")
          .reduce((sum, p) => sum + p.amount, 0);

        const monthlyCommissions = monthlyCompletedPayments
          .filter((p) => p.payment_type === "commission")
          .reduce((sum, p) => sum + p.amount, 0);

        const commissionRate =
          totalRevenue > 0 ? (totalCommissions / totalRevenue) * 100 : 0;
        const averageOrderValue =
          completedPayments.length > 0
            ? totalRevenue / completedPayments.length
            : 0;

        // Get user data for subscriber metrics
        const totalUsers = users.success && users.data ? users.data.length : 0;
        const activeSubscribers = 0; // TODO: Implement subscription counting
        // _subscriptions.success && _subscriptions.data
        //   ? _subscriptions.data.length
        //   : 0;
        const payingUsers =
          completedPayments.length > 0
            ? Math.min(totalUsers, completedPayments.length)
            : 0;

        return {
          revenue: {
            total: totalRevenue,
            monthly: monthlyRevenue,
            growth: monthlyGrowth,
            trend: getTrend(monthlyGrowth),
          },
          payments: {
            total: payments.length,
            pending: pendingPayments.length,
            completed: completedPayments.length,
            trend: getTrend(weeklyGrowth),
          },
          commissions: {
            total: totalCommissions,
            monthly: monthlyCommissions,
            rate: commissionRate,
            trend: getTrend(monthlyGrowth * 0.1), // Assume commissions grow with revenue
          },
          users: {
            paying: payingUsers,
            subscribers: activeSubscribers,
            averageSpend: averageOrderValue,
            trend: getTrend(monthlyGrowth * 0.5), // User growth typically slower than revenue
          },
        };
      },
      staleTime: 5 * 60 * 1000, // 5 minutes
    });
  };

  // Utility functions
  const invalidateFinancialData = () => {
    queryClient.invalidateQueries({ queryKey: FINANCIAL_DATA_QUERY_KEYS.all });
  };

  const refreshFinancialData = () => {
    return Promise.all([
      queryClient.refetchQueries({
        queryKey: FINANCIAL_DATA_QUERY_KEYS.metrics(),
      }),
      queryClient.refetchQueries({
        queryKey: FINANCIAL_DATA_QUERY_KEYS.summary(),
      }),
    ]);
  };

  return {
    // Query hooks
    useFinancialMetrics,
    useRevenueTimeSeries,
    useFinancialSummary,

    // Utilities
    invalidateFinancialData,
    refreshFinancialData,

    // Query keys for external use
    queryKeys: FINANCIAL_DATA_QUERY_KEYS,
  };
};
