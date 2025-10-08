import { useQuery } from "@tanstack/react-query";
import { dataProvider } from "../../../providers/dataProvider";

// Query keys for cache management
export const PROPERTIES_QUERY_KEYS = {
  all: ["properties"] as const,
  lists: () => [...PROPERTIES_QUERY_KEYS.all, "list"] as const,
  list: (filters?: Record<string, unknown>) =>
    [...PROPERTIES_QUERY_KEYS.lists(), { filters }] as const,
  details: () => [...PROPERTIES_QUERY_KEYS.all, "detail"] as const,
  detail: (id: string) => [...PROPERTIES_QUERY_KEYS.details(), id] as const,
  stats: () => [...PROPERTIES_QUERY_KEYS.all, "stats"] as const,
  pending: () => [...PROPERTIES_QUERY_KEYS.all, "pending"] as const,
};

/**
 * Hook pour récupérer une propriété spécifique
 */
export const useProperty = (id: string) => {
  return useQuery({
    queryKey: PROPERTIES_QUERY_KEYS.detail(id),
    queryFn: async () => {
      const response = await dataProvider.getOne("properties", id);

      if (!response.success) {
        throw response.error;
      }

      return response.data;
    },
    enabled: !!id,
    staleTime: 5 * 60 * 1000,
  });
};

/**
 * Hook pour récupérer les propriétés en attente d'approbation
 */
export const usePendingProperties = () => {
  return useQuery({
    queryKey: PROPERTIES_QUERY_KEYS.pending(),
    queryFn: async () => {
      const response = await dataProvider.getList(
        "properties",
        {
          orderBy: "created_at",
        },
        { validation_status: "pending" }
      );

      if (!response.success) {
        throw response.error;
      }

      return response.data;
    },
    staleTime: 2 * 60 * 1000, // 2 minutes for pending items
    refetchInterval: 30 * 1000, // Check every 30 seconds for new pending properties
  });
};

/**
 * Hook pour récupérer les statistiques des propriétés
 */
export const usePropertyStats = () => {
  return useQuery({
    queryKey: PROPERTIES_QUERY_KEYS.stats(),
    queryFn: async () => {
      // Get counts for different statuses
      const [pending, approved, rejected, total] = await Promise.all([
        dataProvider.getList(
          "properties",
          {},
          { validation_status: "pending" }
        ),
        dataProvider.getList(
          "properties",
          {},
          { validation_status: "approved" }
        ),
        dataProvider.getList(
          "properties",
          {},
          { validation_status: "rejected" }
        ),
        dataProvider.getList("properties", {}),
      ]);

      return {
        pending: pending.success && pending.data ? pending.data.length : 0,
        approved: approved.success && approved.data ? approved.data.length : 0,
        rejected: rejected.success && rejected.data ? rejected.data.length : 0,
        total: total.success && total.data ? total.data.length : 0,
      };
    },
    staleTime: 10 * 60 * 1000, // 10 minutes for stats
  });
};
