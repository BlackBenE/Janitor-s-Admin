/**
 * 📊 Quote Request Statistics Hook
 *
 * Centralise toutes les statistiques des demandes de devis
 * Inspiré du pattern useProviderStats.ts et usePaymentStats.ts
 */

import { useQuery } from "@tanstack/react-query";
import { useMemo } from "react";
import { supabase } from "../../../lib/supabaseClient";
import type {
  QuoteRequestWithDetails,
  QuoteRequestStats,
  QuoteRequestStatus,
} from "../../../types/quoteRequests";

// Query keys pour les statistiques
export const QUOTE_REQUEST_STATS_QUERY_KEYS = {
  all: ["quote-request-stats"] as const,
  global: () => [...QUOTE_REQUEST_STATS_QUERY_KEYS.all, "global"] as const,
  byStatus: () => [...QUOTE_REQUEST_STATS_QUERY_KEYS.all, "byStatus"] as const,
  byProvider: (providerId: string) =>
    [...QUOTE_REQUEST_STATS_QUERY_KEYS.all, "byProvider", providerId] as const,
  byRequester: (requesterId: string) =>
    [
      ...QUOTE_REQUEST_STATS_QUERY_KEYS.all,
      "byRequester",
      requesterId,
    ] as const,
  revenue: () => [...QUOTE_REQUEST_STATS_QUERY_KEYS.all, "revenue"] as const,
} as const;

/**
 * Hook pour récupérer les statistiques globales des demandes de devis
 */
export const useQuoteRequestStats = (options?: { enabled?: boolean }) => {
  return useQuery({
    queryKey: QUOTE_REQUEST_STATS_QUERY_KEYS.global(),
    queryFn: async (): Promise<QuoteRequestStats> => {
      console.log("📊 Fetching quote request statistics...");

      // Récupérer toutes les demandes pour calculer les stats
      const { data: requests, error } = await supabase
        .from("service_requests")
        .select(
          "id, status, total_amount, created_at, completed_at, requested_date"
        );

      if (error) {
        throw new Error(`Erreur calcul statistiques: ${error.message}`);
      }

      const requestsArray = requests || [];
      const totalRequests = requestsArray.length;

      // Stats par statut
      const pendingRequests = requestsArray.filter(
        (r) => r.status === "pending"
      ).length;
      const acceptedRequests = requestsArray.filter(
        (r) => r.status === "accepted"
      ).length;
      const inProgressRequests = requestsArray.filter(
        (r) => r.status === "in_progress"
      ).length;
      const completedRequests = requestsArray.filter(
        (r) => r.status === "completed"
      ).length;
      const cancelledRequests = requestsArray.filter(
        (r) => r.status === "cancelled"
      ).length;
      const rejectedRequests = requestsArray.filter(
        (r) => r.status === "rejected"
      ).length;

      // Calculs financiers
      const totalRevenue = requestsArray
        .filter((r) => r.status === "completed")
        .reduce((sum, r) => sum + (r.total_amount || 0), 0);

      const averageAmount =
        totalRequests > 0
          ? requestsArray.reduce((sum, r) => sum + (r.total_amount || 0), 0) /
            totalRequests
          : 0;

      // Temps moyen de completion (en jours)
      const completedWithDates = requestsArray.filter(
        (r) => r.status === "completed" && r.created_at && r.completed_at
      );

      const averageCompletionTime =
        completedWithDates.length > 0
          ? completedWithDates.reduce((sum, r) => {
              const created = new Date(r.created_at!);
              const completed = new Date(r.completed_at!);
              const diffDays =
                (completed.getTime() - created.getTime()) /
                (1000 * 60 * 60 * 24);
              return sum + diffDays;
            }, 0) / completedWithDates.length
          : 0;

      const stats: QuoteRequestStats = {
        totalRequests,
        pendingRequests,
        acceptedRequests,
        inProgressRequests,
        completedRequests,
        cancelledRequests,
        rejectedRequests,
        totalRevenue,
        averageAmount,
        averageCompletionTime: Math.round(averageCompletionTime * 10) / 10,
      };

      console.log("📊 Quote request stats calculated:", stats);
      return stats;
    },
    enabled: options?.enabled !== false,
    staleTime: 5 * 60 * 1000, // 5 minutes
    refetchInterval: 2 * 60 * 1000, // Rafraîchit toutes les 2 minutes
  });
};

/**
 * Hook pour calculer les statistiques des demandes de devis (version optimisée avec données existantes)
 */
export const useCalculatedQuoteRequestStats = (
  quoteRequests: QuoteRequestWithDetails[]
): QuoteRequestStats => {
  return useMemo(() => {
    if (!quoteRequests || quoteRequests.length === 0) {
      return {
        totalRequests: 0,
        pendingRequests: 0,
        acceptedRequests: 0,
        inProgressRequests: 0,
        completedRequests: 0,
        cancelledRequests: 0,
        rejectedRequests: 0,
        totalRevenue: 0,
        averageAmount: 0,
        averageCompletionTime: 0,
      };
    }

    const totalRequests = quoteRequests.length;

    // Stats par statut
    const pendingRequests = quoteRequests.filter(
      (r) => r.status === "pending"
    ).length;
    const acceptedRequests = quoteRequests.filter(
      (r) => r.status === "accepted"
    ).length;
    const inProgressRequests = quoteRequests.filter(
      (r) => r.status === "in_progress"
    ).length;
    const completedRequests = quoteRequests.filter(
      (r) => r.status === "completed"
    ).length;
    const cancelledRequests = quoteRequests.filter(
      (r) => r.status === "cancelled"
    ).length;
    const rejectedRequests = quoteRequests.filter(
      (r) => r.status === "rejected"
    ).length;

    // Calculs financiers
    const totalRevenue = quoteRequests
      .filter((r) => r.status === "completed")
      .reduce((sum, r) => sum + (r.total_amount || 0), 0);

    const averageAmount =
      totalRequests > 0
        ? quoteRequests.reduce((sum, r) => sum + (r.total_amount || 0), 0) /
          totalRequests
        : 0;

    // Temps moyen de completion (en jours)
    const completedWithDates = quoteRequests.filter(
      (r) => r.status === "completed" && r.created_at && r.completed_at
    );

    const averageCompletionTime =
      completedWithDates.length > 0
        ? completedWithDates.reduce((sum, r) => {
            const created = new Date(r.created_at!);
            const completed = new Date(r.completed_at!);
            const diffDays =
              (completed.getTime() - created.getTime()) / (1000 * 60 * 60 * 24);
            return sum + diffDays;
          }, 0) / completedWithDates.length
        : 0;

    return {
      totalRequests,
      pendingRequests,
      acceptedRequests,
      inProgressRequests,
      completedRequests,
      cancelledRequests,
      rejectedRequests,
      totalRevenue,
      averageAmount,
      averageCompletionTime: Math.round(averageCompletionTime * 10) / 10,
    };
  }, [quoteRequests]);
};

/**
 * Hook pour récupérer les statistiques par statut
 */
export const useQuoteRequestStatsByStatus = (options?: {
  enabled?: boolean;
}) => {
  return useQuery({
    queryKey: QUOTE_REQUEST_STATS_QUERY_KEYS.byStatus(),
    queryFn: async () => {
      console.log("📊 Fetching quote request stats by status...");

      const { data, error } = await supabase
        .from("service_requests")
        .select("status")
        .order("status");

      if (error) {
        throw new Error(`Erreur stats par statut: ${error.message}`);
      }

      // Compter par statut
      const statusCounts = (data || []).reduce(
        (acc: Record<string, number>, item) => {
          acc[item.status] = (acc[item.status] || 0) + 1;
          return acc;
        },
        {}
      );

      return statusCounts;
    },
    enabled: options?.enabled !== false,
    staleTime: 3 * 60 * 1000,
  });
};

/**
 * Hook pour récupérer les statistiques de revenus par période
 */
export const useQuoteRequestRevenueStats = (options?: {
  period?: "week" | "month" | "year";
  enabled?: boolean;
}) => {
  return useQuery({
    queryKey: QUOTE_REQUEST_STATS_QUERY_KEYS.revenue(),
    queryFn: async () => {
      console.log("💰 Fetching revenue statistics...");

      const { data, error } = await supabase
        .from("service_requests")
        .select("total_amount, completed_at, status")
        .eq("status", "completed")
        .not("completed_at", "is", null)
        .order("completed_at", { ascending: false });

      if (error) {
        throw new Error(`Erreur stats revenus: ${error.message}`);
      }

      const requests = data || [];
      const now = new Date();
      const period = options?.period || "month";

      let startDate: Date;
      switch (period) {
        case "week":
          startDate = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);
          break;
        case "year":
          startDate = new Date(now.getFullYear(), 0, 1);
          break;
        case "month":
        default:
          startDate = new Date(now.getFullYear(), now.getMonth(), 1);
          break;
      }

      const periodRevenue = requests
        .filter((r) => new Date(r.completed_at!) >= startDate)
        .reduce((sum, r) => sum + (r.total_amount || 0), 0);

      const totalRevenue = requests.reduce(
        (sum, r) => sum + (r.total_amount || 0),
        0
      );
      const averageRevenue =
        requests.length > 0 ? totalRevenue / requests.length : 0;

      return {
        periodRevenue,
        totalRevenue,
        averageRevenue,
        period,
        startDate: startDate.toISOString(),
        endDate: now.toISOString(),
      };
    },
    enabled: options?.enabled !== false,
    staleTime: 10 * 60 * 1000, // 10 minutes
  });
};
