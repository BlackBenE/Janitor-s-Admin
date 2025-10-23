import { useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "../../../lib/supabaseClient";
import { ServiceWithDetails } from "../../../types/services";
import { Database } from "../../../types";

// Import des hooks de queries
import {
  useServices as useServicesQuery,
  useService,
  useServiceStats as useServiceStatsQuery,
  SERVICE_QUERY_KEYS,
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

  // Delete services mutation (hard delete)
  const deleteServicesMutation = useMutation({
    mutationFn: async (serviceIds: string[]) => {
      console.log("🗑️ Hard deleting services:", serviceIds);

      // Hard delete: suppression définitive
      const { data, error } = await supabase
        .from("services")
        .delete()
        .in("id", serviceIds)
        .select();

      if (error) {
        throw new Error(`Error deleting services: ${error.message}`);
      }

      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: SERVICE_QUERY_KEYS.all });
    },
  });

  // Bulk update services mutation
  const bulkUpdateServicesMutation = useMutation({
    mutationFn: async ({
      serviceIds,
      updates,
    }: {
      serviceIds: string[];
      updates: Partial<ServiceUpdate>;
    }) => {
      console.log("🔄 Bulk updating services:", serviceIds, updates);

      const { data, error } = await supabase
        .from("services")
        .update({
          ...updates,
          updated_at: new Date().toISOString(),
        })
        .in("id", serviceIds)
        .select();

      if (error) {
        throw new Error(`Error bulk updating services: ${error.message}`);
      }

      return data;
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

  // Bulk actions
  const bulkUpdateServices = (
    serviceIds: string[],
    updates: Partial<ServiceUpdate>
  ) => {
    return bulkUpdateServicesMutation.mutateAsync({ serviceIds, updates });
  };

  const bulkActivateServices = (serviceIds: string[]) => {
    return bulkUpdateServices(serviceIds, { is_active: true });
  };

  const bulkDeactivateServices = (serviceIds: string[]) => {
    return bulkUpdateServices(serviceIds, { is_active: false });
  };

  const bulkChangeCategory = (serviceIds: string[], category: string) => {
    return bulkUpdateServices(serviceIds, { category });
  };

  const bulkUpdatePrice = (serviceIds: string[], basePrice: number) => {
    return bulkUpdateServices(serviceIds, { base_price: basePrice });
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
    // CRUD Mutations
    updateService,
    createService,
    deleteManyServices,
    // Bulk Actions
    bulkUpdateServices,
    bulkActivateServices,
    bulkDeactivateServices,
    bulkChangeCategory,
    bulkUpdatePrice,
    // Mutation states
    isUpdating: updateServiceMutation.isPending,
    isCreating: createServiceMutation.isPending,
    isDeleting: deleteServicesMutation.isPending,
    isBulkUpdating: bulkUpdateServicesMutation.isPending,
  };
};

// Export also individual hooks for flexibility (like UserManagement does)
export { useService, useServiceStatsQuery as useServiceStats };
