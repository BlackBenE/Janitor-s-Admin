import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/core/config/supabase";

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
