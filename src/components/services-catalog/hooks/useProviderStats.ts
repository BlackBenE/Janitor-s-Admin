import { useQuery } from "@tanstack/react-query";
import { supabase } from "../../../lib/supabaseClient";

// Interface pour les statistiques réelles d'un prestataire
export interface ProviderStats {
  totalServices: number;
  activeServices: number;
  totalRequests: number;
  pendingRequests: number;
  completedRequests: number;
  totalRevenue: number;
  averageRating: number;
}

// Interface pour les services du prestataire
export interface ProviderService {
  id: string;
  name: string;
  category: string;
  base_price: number;
  is_active: boolean | null;
  description: string | null;
}

/**
 * Hook pour récupérer les statistiques réelles d'un prestataire
 */
export const useProviderStats = (providerId: string) => {
  return useQuery({
    queryKey: ["provider-stats", providerId],
    queryFn: async (): Promise<ProviderStats> => {
      if (!providerId) throw new Error("Provider ID is required");

      // 1. Récupérer les services du prestataire
      const { data: services, error: servicesError } = await supabase
        .from("services")
        .select("id, name, category, base_price, is_active, description")
        .eq("provider_id", providerId);

      if (servicesError) {
        throw new Error(`Erreur services: ${servicesError.message}`);
      }

      // 2. Récupérer les demandes de service liées à ce prestataire
      const { data: requests, error: requestsError } = await supabase
        .from("service_requests")
        .select("id, status, total_amount")
        .eq("provider_id", providerId);

      if (requestsError) {
        throw new Error(`Erreur demandes: ${requestsError.message}`);
      }

      // 3. Calculer les statistiques
      const totalServices = services?.length || 0;
      const activeServices =
        services?.filter((s) => s.is_active === true).length || 0;

      const totalRequests = requests?.length || 0;
      const pendingRequests =
        requests?.filter((r) => r.status === "pending").length || 0;
      const completedRequests =
        requests?.filter((r) => r.status === "completed").length || 0;

      const totalRevenue =
        requests
          ?.filter((r) => r.status === "completed")
          .reduce((sum, r) => sum + (r.total_amount || 0), 0) || 0;

      // Note moyenne simulée basée sur les performances (à remplacer si table ratings existe)
      const averageRating =
        completedRequests > 0
          ? Math.min(
              5,
              Math.max(3, 4 + completedRequests / 10 - pendingRequests / 20)
            )
          : 0;

      return {
        totalServices,
        activeServices,
        totalRequests,
        pendingRequests,
        completedRequests,
        totalRevenue,
        averageRating: Math.round(averageRating * 10) / 10,
      };
    },
    enabled: !!providerId,
    staleTime: 5 * 60 * 1000, // 5 minutes
  });
};

/**
 * Hook pour récupérer les autres services d'un prestataire
 */
export const useProviderServices = (
  providerId: string,
  excludeServiceId?: string
) => {
  return useQuery({
    queryKey: ["provider-services", providerId, excludeServiceId],
    queryFn: async (): Promise<ProviderService[]> => {
      if (!providerId) return [];

      let query = supabase
        .from("services")
        .select("id, name, category, base_price, is_active, description")
        .eq("provider_id", providerId);

      if (excludeServiceId) {
        query = query.neq("id", excludeServiceId);
      }

      const { data, error } = await query;

      if (error) {
        throw new Error(`Erreur services: ${error.message}`);
      }

      return data || [];
    },
    enabled: !!providerId,
    staleTime: 5 * 60 * 1000,
  });
};
