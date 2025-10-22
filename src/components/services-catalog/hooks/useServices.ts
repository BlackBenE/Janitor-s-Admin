import { useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "../../../lib/supabaseClient";
import { ServiceWithDetails } from "../../../types/services";
import { Database } from "../../../types";

// Import des hooks de queries
import { 
  useServices as useServicesQuery,
  useService,
  useServiceStats as useServiceStatsQuery,
  SERVICE_QUERY_KEYS 
} from "./useServiceQueries";

type ServiceRow = Database["public"]["Tables"]["services"]["Row"];
type ServiceInsert = Database["public"]["Tables"]["services"]["Insert"];
type ServiceUpdate = Database["public"]["Tables"]["services"]["Update"];

/**
 * Hook principal pour les services - style UserManagement/Payments
 * Combine les queries et mutations
 */
export const useServices = (options?: {
  filters?: Partial<ServiceRow>;
  limit?: number;
  orderBy?: keyof ServiceRow;
  enabled?: boolean;
  refetchOnWindowFocus?: boolean;
}) => {
  const queryClient = useQueryClient();

  // Utiliser le hook de query dédié
  const {
    data: services = [],
    isLoading,
    isFetching,
    error,
    refetch,
  } = useServicesQuery({
    filters: options?.filters,
    limit: options?.limit,
    orderBy: options?.orderBy as string,
    enabled: options?.enabled,
    refetchOnWindowFocus: options?.refetchOnWindowFocus,
  });

  // Utiliser le hook de stats dédié
  const { data: stats } = useServiceStatsQuery({
    enabled: options?.enabled,
  });

  // Update service mutation
  const updateServiceMutation = useMutation({
    mutationFn: async ({
      id,
      updates,
    }: {
      id: string;
      updates: ServiceUpdate;
    }) => {
      console.log("🔄 Updating service:", id, updates);
      const { data, error } = await supabase
        .from("services")
        .update(updates)
        .eq("id", id)
        .select()
        .single();

      if (error) {
        throw new Error(`Error updating service: ${error.message}`);
      }

      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: SERVICE_QUERY_KEYS.all });
    },
  });

  // Create service mutation  
  const createServiceMutation = useMutation({
    mutationFn: async (service: ServiceInsert) => {
      console.log("➕ Creating service:", service);
      const { data, error } = await supabase
        .from("services")
        .insert(service)
        .select()
        .single();

      if (error) {
        throw new Error(`Error creating service: ${error.message}`);
      }

      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: SERVICE_QUERY_KEYS.all });
    },
  });

  // Delete services mutation
  const deleteServicesMutation = useMutation({
    mutationFn: async (serviceIds: string[]) => {
      console.log("🗑️ Deleting services:", serviceIds);
      const { error } = await supabase
        .from("services")
        .delete()
        .in("id", serviceIds);

      if (error) {
        throw new Error(`Error deleting services: ${error.message}`);
      }

      return serviceIds;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: SERVICE_QUERY_KEYS.all });
    },
  });

  // Helper functions
  const updateService = (id: string, updates: ServiceUpdate) => {
    return updateServiceMutation.mutateAsync({ id, updates });
  };

  const createService = (service: ServiceInsert) => {
    return createServiceMutation.mutateAsync(service);
  };

  const deleteManyServices = (serviceIds: string[]) => {
    return deleteServicesMutation.mutateAsync(serviceIds);
  };

  // Actions métier spécifiques
  const activateService = (id: string) => {
    return updateService(id, { is_active: true });
  };

  const deactivateService = (id: string) => {
    return updateService(id, { is_active: false });
  };

  return {
    services,
    stats: stats || {
      totalServices: 0,
      activeServices: 0,
      inactiveServices: 0,
      pendingServices: 0,
      archivedServices: 0,
      totalProviders: 0,
      totalCategories: 0,
      averagePrice: 0,
      totalRevenue: 0,
    },
    isLoading,
    isFetching,
    error,
    refetch,
    // Mutations
    updateService,
    createService,
    deleteManyServices,
    activateService,
    deactivateService,
    // Mutation states
    isUpdating: updateServiceMutation.isPending,
    isCreating: createServiceMutation.isPending,
    isDeleting: deleteServicesMutation.isPending,
  };
};

// Export also individual hooks for flexibility (like UserManagement does)
export { useService, useServiceStatsQuery as useServiceStats };