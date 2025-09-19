import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { dataProvider } from "../../providers/dataProvider";
import { Database } from "../../types/database.types";

type Service = Database["public"]["Tables"]["services"]["Row"];
type ServiceInsert = Database["public"]["Tables"]["services"]["Insert"];
type ServiceUpdate = Database["public"]["Tables"]["services"]["Update"];

// Enhanced service type with provider info for admin views
export type ServiceWithProvider = Service & {
  provider?: {
    id: string;
    full_name: string | null;
    email: string;
    phone: string | null;
    profile_validated: boolean | null;
  };
  requestCount?: number;
  totalRevenue?: number;
  averageRating?: number;
};

// Service status types
export type ServiceStatus =
  | "active"
  | "inactive"
  | "pending_approval"
  | "suspended";

// Service categories for filtering and organization
export type ServiceCategory = string; // Dynamic based on your categories

// Query keys for cache management
const SERVICES_QUERY_KEYS = {
  all: ["services"] as const,
  lists: () => [...SERVICES_QUERY_KEYS.all, "list"] as const,
  list: (filters?: Record<string, unknown>) =>
    [...SERVICES_QUERY_KEYS.lists(), { filters }] as const,
  details: () => [...SERVICES_QUERY_KEYS.all, "detail"] as const,
  detail: (id: string) => [...SERVICES_QUERY_KEYS.details(), id] as const,
  stats: () => [...SERVICES_QUERY_KEYS.all, "stats"] as const,
  categories: () => [...SERVICES_QUERY_KEYS.all, "categories"] as const,
  active: () => [...SERVICES_QUERY_KEYS.all, "active"] as const,
  byProvider: (providerId: string) =>
    [...SERVICES_QUERY_KEYS.all, "provider", providerId] as const,
};

export const useServices = (options?: {
  filters?: Partial<Service>;
  limit?: number;
  orderBy?: keyof Service;
  includeProvider?: boolean;
  onlyActive?: boolean;
  category?: string;
  providerId?: string;
  // Optimization options
  enabled?: boolean;
  refetchOnWindowFocus?: boolean;
  refetchInterval?: number;
}) => {
  const queryClient = useQueryClient();

  // Build filters
  const serviceFilters = {
    ...options?.filters,
    ...(options?.onlyActive ? { is_active: true } : {}),
    ...(options?.category ? { category: options.category } : {}),
    ...(options?.providerId ? { provider_id: options.providerId } : {}),
  };

  // Get all services with optional filtering
  const {
    data: services,
    isLoading,
    error,
    refetch,
    isStale,
    isFetching,
  } = useQuery({
    queryKey: SERVICES_QUERY_KEYS.list(serviceFilters),
    queryFn: async () => {
      const response = await dataProvider.getList(
        "services",
        {
          limit: options?.limit,
          orderBy: options?.orderBy || "created_at",
        },
        serviceFilters
      );

      if (!response.success) {
        throw response.error;
      }

      return response.data;
    },
    staleTime: 5 * 60 * 1000, // 5 minutes
    gcTime: 10 * 60 * 1000, // 10 minutes garbage collection
    enabled: options?.enabled !== false,
    refetchOnWindowFocus: options?.refetchOnWindowFocus ?? false,
    refetchInterval: options?.refetchInterval,
    retry: 2,
  });

  // Get single service with detailed info
  const useService = (id: string) => {
    return useQuery({
      queryKey: SERVICES_QUERY_KEYS.detail(id),
      queryFn: async () => {
        const response = await dataProvider.getOne("services", id);

        if (!response.success) {
          throw response.error;
        }

        return response.data;
      },
      enabled: !!id,
      staleTime: 5 * 60 * 1000,
    });
  };

  // Get active services only
  const useActiveServices = () => {
    return useQuery({
      queryKey: SERVICES_QUERY_KEYS.active(),
      queryFn: async () => {
        const response = await dataProvider.getList(
          "services",
          {
            orderBy: "name",
          },
          { is_active: true }
        );

        if (!response.success) {
          throw response.error;
        }

        return response.data;
      },
      staleTime: 10 * 60 * 1000,
    });
  };

  // Get services by provider
  const useServicesByProvider = (providerId: string) => {
    return useQuery({
      queryKey: SERVICES_QUERY_KEYS.byProvider(providerId),
      queryFn: async () => {
        const response = await dataProvider.getList(
          "services",
          {
            orderBy: "created_at",
          },
          { provider_id: providerId }
        );

        if (!response.success) {
          throw response.error;
        }

        return response.data;
      },
      enabled: !!providerId,
      staleTime: 5 * 60 * 1000,
    });
  };

  // Get service categories for dropdowns and filtering
  const useServiceCategories = () => {
    return useQuery({
      queryKey: SERVICES_QUERY_KEYS.categories(),
      queryFn: async () => {
        const response = await dataProvider.getList("services", {});

        if (!response.success) {
          throw response.error;
        }

        // Extract unique categories
        const categoriesSet = new Set(
          response.data?.map((service) => service.category).filter(Boolean)
        );
        const categories = Array.from(categoriesSet);

        return categories;
      },
      staleTime: 30 * 60 * 1000, // 30 minutes for categories
    });
  };

  // Get service statistics for dashboard
  const useServiceStats = () => {
    return useQuery({
      queryKey: SERVICES_QUERY_KEYS.stats(),
      queryFn: async () => {
        // Get counts for different service statuses
        const [active, inactive, total] = await Promise.all([
          dataProvider.getList("services", {}, { is_active: true }),
          dataProvider.getList("services", {}, { is_active: false }),
          dataProvider.getList("services", {}),
          // dataProvider.getList("services", {}), // TODO: Categories implementation
        ]);

        // Calculate average price
        const allServices = total.success && total.data ? total.data : [];
        const averagePrice =
          allServices.length > 0
            ? allServices.reduce(
                (sum, service) => sum + service.base_price,
                0
              ) / allServices.length
            : 0;

        // Get unique categories count
        const categoriesSet = new Set(
          allServices.map((service) => service.category).filter(Boolean)
        );
        const uniqueCategories = Array.from(categoriesSet);

        return {
          active: active.success && active.data ? active.data.length : 0,
          inactive:
            inactive.success && inactive.data ? inactive.data.length : 0,
          total: total.success && total.data ? total.data.length : 0,
          categoriesCount: uniqueCategories.length,
          averagePrice: Math.round(averagePrice * 100) / 100, // Round to 2 decimals
        };
      },
      staleTime: 10 * 60 * 1000, // 10 minutes for stats
    });
  };

  // Create service mutation
  const createService = useMutation({
    mutationFn: async (payload: ServiceInsert) => {
      const servicePayload = {
        ...payload,
        is_active: payload.is_active ?? true, // Default to active
      };

      const response = await dataProvider.create("services", servicePayload);

      if (!response.success) {
        throw response.error;
      }

      return response.data;
    },
    onMutate: async (newService) => {
      await queryClient.cancelQueries({
        queryKey: SERVICES_QUERY_KEYS.lists(),
      });

      const previousServices = queryClient.getQueryData(
        SERVICES_QUERY_KEYS.list(serviceFilters)
      );

      if (previousServices) {
        const optimisticService = {
          ...newService,
          id: `temp-${Date.now()}`,
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString(),
          is_active: newService.is_active ?? true,
        } as Service;

        queryClient.setQueryData(
          SERVICES_QUERY_KEYS.list(serviceFilters),
          (old: Service[] | undefined) =>
            old ? [optimisticService, ...old] : [optimisticService]
        );
      }

      return { previousServices };
    },
    onError: (err, newService, context) => {
      if (context?.previousServices) {
        queryClient.setQueryData(
          SERVICES_QUERY_KEYS.list(serviceFilters),
          context.previousServices
        );
      }
    },
    onSettled: (newService) => {
      queryClient.invalidateQueries({
        queryKey: SERVICES_QUERY_KEYS.lists(),
        refetchType: "none",
      });
      queryClient.invalidateQueries({
        queryKey: SERVICES_QUERY_KEYS.stats(),
      });
      queryClient.invalidateQueries({
        queryKey: SERVICES_QUERY_KEYS.categories(),
      });

      if (newService) {
        queryClient.setQueryData(
          SERVICES_QUERY_KEYS.detail(newService.id),
          newService
        );
      }
    },
  });

  // Update service mutation
  const updateService = useMutation({
    mutationFn: async ({
      id,
      payload,
    }: {
      id: string;
      payload: ServiceUpdate;
    }) => {
      const response = await dataProvider.update("services", id, {
        ...payload,
        updated_at: new Date().toISOString(),
      });

      if (!response.success) {
        throw response.error;
      }

      return response.data;
    },
    onSuccess: (updatedService, { id }) => {
      queryClient.setQueryData(SERVICES_QUERY_KEYS.detail(id), updatedService);
      queryClient.invalidateQueries({ queryKey: SERVICES_QUERY_KEYS.lists() });
      queryClient.invalidateQueries({ queryKey: SERVICES_QUERY_KEYS.stats() });
      queryClient.invalidateQueries({
        queryKey: SERVICES_QUERY_KEYS.categories(),
      });

      // Invalidate provider's services if provider changed
      if (updatedService && updatedService.provider_id) {
        queryClient.invalidateQueries({
          queryKey: SERVICES_QUERY_KEYS.byProvider(updatedService.provider_id),
        });
      }
    },
  });

  // Delete service mutation
  const deleteService = useMutation({
    mutationFn: async (id: string) => {
      const response = await dataProvider.delete("services", id);

      if (!response.success) {
        throw response.error;
      }

      return response.data;
    },
    onSuccess: (_, deletedId) => {
      queryClient.removeQueries({
        queryKey: SERVICES_QUERY_KEYS.detail(deletedId),
      });
      queryClient.invalidateQueries({ queryKey: SERVICES_QUERY_KEYS.lists() });
      queryClient.invalidateQueries({ queryKey: SERVICES_QUERY_KEYS.stats() });
    },
  });

  // Activate service mutation
  const activateService = useMutation({
    mutationFn: async (id: string) => {
      const response = await dataProvider.update("services", id, {
        is_active: true,
        updated_at: new Date().toISOString(),
      });

      if (!response.success) {
        throw response.error;
      }

      return response.data;
    },
    onSuccess: (updatedService, id) => {
      queryClient.setQueryData(SERVICES_QUERY_KEYS.detail(id), updatedService);
      queryClient.invalidateQueries({ queryKey: SERVICES_QUERY_KEYS.lists() });
      queryClient.invalidateQueries({ queryKey: SERVICES_QUERY_KEYS.active() });
      queryClient.invalidateQueries({ queryKey: SERVICES_QUERY_KEYS.stats() });
    },
  });

  // Deactivate service mutation
  const deactivateService = useMutation({
    mutationFn: async (id: string) => {
      const response = await dataProvider.update("services", id, {
        is_active: false,
        updated_at: new Date().toISOString(),
      });

      if (!response.success) {
        throw response.error;
      }

      return response.data;
    },
    onSuccess: (updatedService, id) => {
      queryClient.setQueryData(SERVICES_QUERY_KEYS.detail(id), updatedService);
      queryClient.invalidateQueries({ queryKey: SERVICES_QUERY_KEYS.lists() });
      queryClient.invalidateQueries({ queryKey: SERVICES_QUERY_KEYS.active() });
      queryClient.invalidateQueries({ queryKey: SERVICES_QUERY_KEYS.stats() });
    },
  });

  // Bulk operations
  const activateManyServices = useMutation({
    mutationFn: async (ids: string[]) => {
      const updates = ids.map((id) =>
        dataProvider.update("services", id, {
          is_active: true,
          updated_at: new Date().toISOString(),
        })
      );

      const responses = await Promise.all(updates);
      const failed = responses.filter((r) => !r.success);

      if (failed.length > 0) {
        throw new Error(`Failed to activate ${failed.length} services`);
      }

      return responses.map((r) => r.data);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: SERVICES_QUERY_KEYS.lists() });
      queryClient.invalidateQueries({ queryKey: SERVICES_QUERY_KEYS.active() });
      queryClient.invalidateQueries({ queryKey: SERVICES_QUERY_KEYS.stats() });
    },
  });

  const deactivateManyServices = useMutation({
    mutationFn: async (ids: string[]) => {
      const updates = ids.map((id) =>
        dataProvider.update("services", id, {
          is_active: false,
          updated_at: new Date().toISOString(),
        })
      );

      const responses = await Promise.all(updates);
      const failed = responses.filter((r) => !r.success);

      if (failed.length > 0) {
        throw new Error(`Failed to deactivate ${failed.length} services`);
      }

      return responses.map((r) => r.data);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: SERVICES_QUERY_KEYS.lists() });
      queryClient.invalidateQueries({ queryKey: SERVICES_QUERY_KEYS.active() });
      queryClient.invalidateQueries({ queryKey: SERVICES_QUERY_KEYS.stats() });
    },
  });

  const deleteManyServices = useMutation({
    mutationFn: async (ids: string[]) => {
      const response = await dataProvider.deleteMany("services", ids);

      if (!response.success) {
        throw response.error;
      }

      return response.data;
    },
    onSuccess: (_, deletedIds) => {
      deletedIds.forEach((id) => {
        queryClient.removeQueries({ queryKey: SERVICES_QUERY_KEYS.detail(id) });
      });
      queryClient.invalidateQueries({ queryKey: SERVICES_QUERY_KEYS.lists() });
      queryClient.invalidateQueries({ queryKey: SERVICES_QUERY_KEYS.stats() });
    },
  });

  return {
    // Query data
    services: services || [],
    isLoading,
    isFetching,
    isStale,
    error,
    refetch,

    // Specialized hooks
    useService,
    useActiveServices,
    useServicesByProvider,
    useServiceCategories,
    useServiceStats,

    // Basic mutations
    createService: {
      mutate: createService.mutate,
      mutateAsync: createService.mutateAsync,
      isPending: createService.isPending,
      error: createService.error,
      isSuccess: createService.isSuccess,
    },

    updateService: {
      mutate: updateService.mutate,
      mutateAsync: updateService.mutateAsync,
      isPending: updateService.isPending,
      error: updateService.error,
      isSuccess: updateService.isSuccess,
    },

    deleteService: {
      mutate: deleteService.mutate,
      mutateAsync: deleteService.mutateAsync,
      isPending: deleteService.isPending,
      error: deleteService.error,
      isSuccess: deleteService.isSuccess,
    },

    // Status change mutations
    activateService: {
      mutate: activateService.mutate,
      mutateAsync: activateService.mutateAsync,
      isPending: activateService.isPending,
      error: activateService.error,
      isSuccess: activateService.isSuccess,
    },

    deactivateService: {
      mutate: deactivateService.mutate,
      mutateAsync: deactivateService.mutateAsync,
      isPending: deactivateService.isPending,
      error: deactivateService.error,
      isSuccess: deactivateService.isSuccess,
    },

    // Bulk operations
    activateManyServices: {
      mutate: activateManyServices.mutate,
      mutateAsync: activateManyServices.mutateAsync,
      isPending: activateManyServices.isPending,
      error: activateManyServices.error,
      isSuccess: activateManyServices.isSuccess,
    },

    deactivateManyServices: {
      mutate: deactivateManyServices.mutate,
      mutateAsync: deactivateManyServices.mutateAsync,
      isPending: deactivateManyServices.isPending,
      error: deactivateManyServices.error,
      isSuccess: deactivateManyServices.isSuccess,
    },

    deleteManyServices: {
      mutate: deleteManyServices.mutate,
      mutateAsync: deleteManyServices.mutateAsync,
      isPending: deleteManyServices.isPending,
      error: deleteManyServices.error,
      isSuccess: deleteManyServices.isSuccess,
    },

    // Utilities
    invalidateServices: (forceRefetch = false) =>
      queryClient.invalidateQueries({
        queryKey: SERVICES_QUERY_KEYS.lists(),
        refetchType: forceRefetch ? "active" : "none",
      }),

    refreshServices: () => refetch(),

    // Query keys for external use
    queryKeys: SERVICES_QUERY_KEYS,
  };
};
