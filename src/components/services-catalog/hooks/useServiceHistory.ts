import { useQuery } from "@tanstack/react-query";
import { supabase } from "../../../lib/supabaseClient";

export interface ServiceRequestHistory {
  id: string;
  status: string;
  total_amount: number | null;
  requested_date: string;
  created_at: string | null;
  requester: {
    id: string;
    full_name: string | null;
    email: string;
  } | null;
}

/**
 * Hook pour récupérer l'historique réel des demandes d'un service
 */
export const useServiceHistory = (serviceId: string) => {
  return useQuery({
    queryKey: ["service-history", serviceId],
    queryFn: async (): Promise<ServiceRequestHistory[]> => {
      if (!serviceId) return [];

      const { data, error } = await supabase
        .from("service_requests")
        .select(
          `
          id,
          status,
          total_amount,
          requested_date,
          created_at,
          requester:profiles!service_requests_requester_id_fkey (
            id,
            full_name,
            email
          )
        `
        )
        .eq("service_id", serviceId)
        .order("created_at", { ascending: false })
        .limit(10); // Limiter aux 10 dernières demandes

      if (error) {
        throw new Error(`Erreur historique: ${error.message}`);
      }

      return (data || []).map((item) => ({
        ...item,
        requester: Array.isArray(item.requester)
          ? item.requester[0]
          : item.requester,
      }));
    },
    enabled: !!serviceId,
    staleTime: 2 * 60 * 1000, // 2 minutes
  });
};

/**
 * Hook pour récupérer les statistiques de performance d'un service
 */
export const useServicePerformance = (serviceId: string) => {
  return useQuery({
    queryKey: ["service-performance", serviceId],
    queryFn: async () => {
      if (!serviceId) return null;

      // Récupérer toutes les demandes pour ce service
      const { data: requests, error } = await supabase
        .from("service_requests")
        .select("status, total_amount, created_at")
        .eq("service_id", serviceId);

      if (error) {
        throw new Error(`Erreur performance: ${error.message}`);
      }

      const totalRequests = requests?.length || 0;
      const completedRequests =
        requests?.filter((r) => r.status === "completed").length || 0;
      const thisMonth = new Date();
      thisMonth.setDate(1);

      const thisMonthRequests =
        requests?.filter(
          (r) => r.created_at && new Date(r.created_at) >= thisMonth
        ).length || 0;

      const satisfactionRate =
        totalRequests > 0
          ? Math.round((completedRequests / totalRequests) * 100)
          : 0;

      return {
        totalRequests,
        thisMonthRequests,
        satisfactionRate,
      };
    },
    enabled: !!serviceId,
    staleTime: 5 * 60 * 1000,
  });
};
