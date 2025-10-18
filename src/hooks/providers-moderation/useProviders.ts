import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { dataProvider } from "../../providers/dataProvider";
import { Database } from "../../types/database.types";

type UserProfile = Database["public"]["Tables"]["profiles"]["Row"];
type UserInsert = Database["public"]["Tables"]["profiles"]["Insert"];
type UserUpdate = Database["public"]["Tables"]["profiles"]["Update"];

// Enhanced provider type with services info for admin views
export type ProviderWithServices = UserProfile & {
  services?: {
    id: string;
    name: string;
    category: string;
    base_price: number;
    is_active: boolean | null;
  }[];
  serviceCount?: number;
  totalRevenue?: number;
  averageRating?: number;
};

// Provider verification status types
export type ProviderVerificationStatus =
  | "pending"
  | "verified"
  | "rejected"
  | "suspended";

// Query keys for cache management
const PROVIDERS_QUERY_KEYS = {
  all: ["providers"] as const,
  lists: () => [...PROVIDERS_QUERY_KEYS.all, "list"] as const,
  list: (filters?: Record<string, unknown>) =>
    [...PROVIDERS_QUERY_KEYS.lists(), { filters }] as const,
  details: () => [...PROVIDERS_QUERY_KEYS.all, "detail"] as const,
  detail: (id: string) => [...PROVIDERS_QUERY_KEYS.details(), id] as const,
  stats: () => [...PROVIDERS_QUERY_KEYS.all, "stats"] as const,
  pending: () => [...PROVIDERS_QUERY_KEYS.all, "pending"] as const,
  verified: () => [...PROVIDERS_QUERY_KEYS.all, "verified"] as const,
};

export const useProviders = (options?: {
  filters?: Partial<UserProfile>;
  limit?: number;
  orderBy?: keyof UserProfile;
  includeServices?: boolean;
  onlyProviders?: boolean;
  // Optimization options
  enabled?: boolean;
  refetchOnWindowFocus?: boolean;
  refetchInterval?: number;
}) => {
  const queryClient = useQueryClient();

  // Build filters to only get providers
  const providerFilters = {
    ...options?.filters,
    ...(options?.onlyProviders !== false ? { role: "provider" } : {}),
  };

  // Get all providers with optional filtering
  const {
    data: providers,
    isLoading,
    error,
    refetch,
    isStale,
    isFetching,
  } = useQuery({
    queryKey: PROVIDERS_QUERY_KEYS.list(providerFilters),
    queryFn: async () => {
      const response = await dataProvider.getList(
        "profiles",
        {
          limit: options?.limit,
          orderBy: options?.orderBy || "created_at",
        },
        providerFilters
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

  // Get single provider with detailed info
  const useProvider = (id: string) => {
    return useQuery({
      queryKey: PROVIDERS_QUERY_KEYS.detail(id),
      queryFn: async () => {
        const response = await dataProvider.getOne("profiles", id);

        if (!response.success) {
          throw response.error;
        }

        return response.data;
      },
      enabled: !!id,
      staleTime: 5 * 60 * 1000,
    });
  };

  // Get providers pending verification (admin only)
  const usePendingProviders = () => {
    return useQuery({
      queryKey: PROVIDERS_QUERY_KEYS.pending(),
      queryFn: async () => {
        const response = await dataProvider.getList(
          "profiles",
          {
            orderBy: "created_at",
          },
          {
            role: "provider",
            profile_validated: false,
          }
        );

        if (!response.success) {
          throw response.error;
        }

        return response.data;
      },
      staleTime: 2 * 60 * 1000, // 2 minutes for pending items
      refetchInterval: 60 * 1000, // Check every minute for new pending providers
    });
  };

  // Get verified providers
  const useVerifiedProviders = () => {
    return useQuery({
      queryKey: PROVIDERS_QUERY_KEYS.verified(),
      queryFn: async () => {
        const response = await dataProvider.getList(
          "profiles",
          {
            orderBy: "created_at",
          },
          {
            role: "provider",
            profile_validated: true,
          }
        );

        if (!response.success) {
          throw response.error;
        }

        return response.data;
      },
      staleTime: 10 * 60 * 1000,
    });
  };

  // Get provider statistics for dashboard
  const useProviderStats = () => {
    return useQuery({
      queryKey: PROVIDERS_QUERY_KEYS.stats(),
      queryFn: async () => {
        // Get counts for different provider statuses
        const [pending, verified, total, services] = await Promise.all([
          dataProvider.getList(
            "profiles",
            {},
            {
              role: "provider",
              profile_validated: false,
            }
          ),
          dataProvider.getList(
            "profiles",
            {},
            {
              role: "provider",
              profile_validated: true,
            }
          ),
          dataProvider.getList("profiles", {}, { role: "provider" }),
          dataProvider.getList("services", {}, { is_active: true }),
        ]);

        return {
          pending: pending.success && pending.data ? pending.data.length : 0,
          verified:
            verified.success && verified.data ? verified.data.length : 0,
          total: total.success && total.data ? total.data.length : 0,
          activeServices:
            services.success && services.data ? services.data.length : 0,
        };
      },
      staleTime: 10 * 60 * 1000, // 10 minutes for stats
    });
  };

  // Create provider mutation
  const createProvider = useMutation({
    mutationFn: async (payload: UserInsert) => {
      const providerPayload = {
        ...payload,
        role: "provider",
        profile_validated: false,
      };

      const response = await dataProvider.create("profiles", providerPayload);

      if (!response.success) {
        throw response.error;
      }

      return response.data;
    },
    onMutate: async (newProvider) => {
      await queryClient.cancelQueries({
        queryKey: PROVIDERS_QUERY_KEYS.lists(),
      });

      const previousProviders = queryClient.getQueryData(
        PROVIDERS_QUERY_KEYS.list(providerFilters)
      );

      if (previousProviders) {
        const optimisticProvider = {
          ...newProvider,
          id: `temp-${Date.now()}`,
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString(),
          role: "provider",
          profile_validated: false,
        } as UserProfile;

        queryClient.setQueryData(
          PROVIDERS_QUERY_KEYS.list(providerFilters),
          (old: UserProfile[] | undefined) =>
            old ? [optimisticProvider, ...old] : [optimisticProvider]
        );
      }

      return { previousProviders };
    },
    onError: (err, newProvider, context) => {
      if (context?.previousProviders) {
        queryClient.setQueryData(
          PROVIDERS_QUERY_KEYS.list(providerFilters),
          context.previousProviders
        );
      }
    },
    onSettled: (newProvider) => {
      queryClient.invalidateQueries({
        queryKey: PROVIDERS_QUERY_KEYS.lists(),
        refetchType: "none",
      });
      queryClient.invalidateQueries({
        queryKey: PROVIDERS_QUERY_KEYS.stats(),
      });

      if (newProvider) {
        queryClient.setQueryData(
          PROVIDERS_QUERY_KEYS.detail(newProvider.id),
          newProvider
        );
      }
    },
  });

  // Update provider mutation
  const updateProvider = useMutation({
    mutationFn: async ({
      id,
      payload,
    }: {
      id: string;
      payload: UserUpdate;
    }) => {
      const response = await dataProvider.update("profiles", id, {
        ...payload,
        updated_at: new Date().toISOString(),
      });

      if (!response.success) {
        throw response.error;
      }

      return response.data;
    },
    onSuccess: (updatedProvider, { id }) => {
      queryClient.setQueryData(
        PROVIDERS_QUERY_KEYS.detail(id),
        updatedProvider
      );
      queryClient.invalidateQueries({ queryKey: PROVIDERS_QUERY_KEYS.lists() });
      queryClient.invalidateQueries({ queryKey: PROVIDERS_QUERY_KEYS.stats() });
    },
  });

  // Delete provider mutation
  const deleteProvider = useMutation({
    mutationFn: async (id: string) => {
      const response = await dataProvider.delete("profiles", id);

      if (!response.success) {
        throw response.error;
      }

      return response.data;
    },
    onSuccess: (_, deletedId) => {
      queryClient.removeQueries({
        queryKey: PROVIDERS_QUERY_KEYS.detail(deletedId),
      });
      queryClient.invalidateQueries({ queryKey: PROVIDERS_QUERY_KEYS.lists() });
      queryClient.invalidateQueries({ queryKey: PROVIDERS_QUERY_KEYS.stats() });
    },
  });

  // Verify provider mutation (admin only)
  const verifyProvider = useMutation({
    mutationFn: async (id: string) => {
      const response = await dataProvider.update("profiles", id, {
        profile_validated: true,
        updated_at: new Date().toISOString(),
      });

      if (!response.success) {
        throw response.error;
      }

      return response.data;
    },
    onSuccess: (updatedProvider, id) => {
      queryClient.setQueryData(
        PROVIDERS_QUERY_KEYS.detail(id),
        updatedProvider
      );
      queryClient.invalidateQueries({ queryKey: PROVIDERS_QUERY_KEYS.lists() });
      queryClient.invalidateQueries({
        queryKey: PROVIDERS_QUERY_KEYS.pending(),
      });
      queryClient.invalidateQueries({
        queryKey: PROVIDERS_QUERY_KEYS.verified(),
      });
      queryClient.invalidateQueries({ queryKey: PROVIDERS_QUERY_KEYS.stats() });
    },
  });

  // Reject provider verification mutation (admin only)
  const rejectProvider = useMutation({
    mutationFn: async (id: string) => {
      const response = await dataProvider.update("profiles", id, {
        profile_validated: false,
        updated_at: new Date().toISOString(),
      });

      if (!response.success) {
        throw response.error;
      }

      return response.data;
    },
    onSuccess: (updatedProvider, id) => {
      queryClient.setQueryData(
        PROVIDERS_QUERY_KEYS.detail(id),
        updatedProvider
      );
      queryClient.invalidateQueries({ queryKey: PROVIDERS_QUERY_KEYS.lists() });
      queryClient.invalidateQueries({
        queryKey: PROVIDERS_QUERY_KEYS.pending(),
      });
      queryClient.invalidateQueries({ queryKey: PROVIDERS_QUERY_KEYS.stats() });
    },
  });

  // Suspend provider mutation (admin only)
  const suspendProvider = useMutation({
    mutationFn: async (id: string) => {
      const response = await dataProvider.update("profiles", id, {
        profile_validated: false,
        updated_at: new Date().toISOString(),
      });

      if (!response.success) {
        throw response.error;
      }

      return response.data;
    },
    onSuccess: (updatedProvider, id) => {
      queryClient.setQueryData(
        PROVIDERS_QUERY_KEYS.detail(id),
        updatedProvider
      );
      queryClient.invalidateQueries({ queryKey: PROVIDERS_QUERY_KEYS.lists() });
      queryClient.invalidateQueries({
        queryKey: PROVIDERS_QUERY_KEYS.verified(),
      });
      queryClient.invalidateQueries({ queryKey: PROVIDERS_QUERY_KEYS.stats() });
    },
  });

  // Bulk operations
  const verifyManyProviders = useMutation({
    mutationFn: async (ids: string[]) => {
      const updates = ids.map((id) =>
        dataProvider.update("profiles", id, {
          profile_validated: true,
          updated_at: new Date().toISOString(),
        })
      );

      const responses = await Promise.all(updates);
      const failed = responses.filter((r) => !r.success);

      if (failed.length > 0) {
        throw new Error(`Failed to verify ${failed.length} providers`);
      }

      return responses.map((r) => r.data);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: PROVIDERS_QUERY_KEYS.lists() });
      queryClient.invalidateQueries({
        queryKey: PROVIDERS_QUERY_KEYS.pending(),
      });
      queryClient.invalidateQueries({
        queryKey: PROVIDERS_QUERY_KEYS.verified(),
      });
      queryClient.invalidateQueries({ queryKey: PROVIDERS_QUERY_KEYS.stats() });
    },
  });

  const deleteManyProviders = useMutation({
    mutationFn: async (ids: string[]) => {
      const response = await dataProvider.deleteMany("profiles", ids);

      if (!response.success) {
        throw response.error;
      }

      return response.data;
    },
    onSuccess: (_, deletedIds) => {
      deletedIds.forEach((id) => {
        queryClient.removeQueries({
          queryKey: PROVIDERS_QUERY_KEYS.detail(id),
        });
      });
      queryClient.invalidateQueries({ queryKey: PROVIDERS_QUERY_KEYS.lists() });
      queryClient.invalidateQueries({ queryKey: PROVIDERS_QUERY_KEYS.stats() });
    },
  });

  return {
    // Query data
    providers: providers || [],
    isLoading,
    isFetching,
    isStale,
    error,
    refetch,

    // Specialized hooks
    useProvider,
    usePendingProviders,
    useVerifiedProviders,
    useProviderStats,

    // Basic mutations
    createProvider: {
      mutate: createProvider.mutate,
      mutateAsync: createProvider.mutateAsync,
      isPending: createProvider.isPending,
      error: createProvider.error,
      isSuccess: createProvider.isSuccess,
    },

    updateProvider: {
      mutate: updateProvider.mutate,
      mutateAsync: updateProvider.mutateAsync,
      isPending: updateProvider.isPending,
      error: updateProvider.error,
      isSuccess: updateProvider.isSuccess,
    },

    deleteProvider: {
      mutate: deleteProvider.mutate,
      mutateAsync: deleteProvider.mutateAsync,
      isPending: deleteProvider.isPending,
      error: deleteProvider.error,
      isSuccess: deleteProvider.isSuccess,
    },

    // Admin-specific mutations
    verifyProvider: {
      mutate: verifyProvider.mutate,
      mutateAsync: verifyProvider.mutateAsync,
      isPending: verifyProvider.isPending,
      error: verifyProvider.error,
      isSuccess: verifyProvider.isSuccess,
    },

    rejectProvider: {
      mutate: rejectProvider.mutate,
      mutateAsync: rejectProvider.mutateAsync,
      isPending: rejectProvider.isPending,
      error: rejectProvider.error,
      isSuccess: rejectProvider.isSuccess,
    },

    suspendProvider: {
      mutate: suspendProvider.mutate,
      mutateAsync: suspendProvider.mutateAsync,
      isPending: suspendProvider.isPending,
      error: suspendProvider.error,
      isSuccess: suspendProvider.isSuccess,
    },

    // Bulk operations
    verifyManyProviders: {
      mutate: verifyManyProviders.mutate,
      mutateAsync: verifyManyProviders.mutateAsync,
      isPending: verifyManyProviders.isPending,
      error: verifyManyProviders.error,
      isSuccess: verifyManyProviders.isSuccess,
    },

    deleteManyProviders: {
      mutate: deleteManyProviders.mutate,
      mutateAsync: deleteManyProviders.mutateAsync,
      isPending: deleteManyProviders.isPending,
      error: deleteManyProviders.error,
      isSuccess: deleteManyProviders.isSuccess,
    },

    // Utilities
    invalidateProviders: (forceRefetch = false) =>
      queryClient.invalidateQueries({
        queryKey: PROVIDERS_QUERY_KEYS.lists(),
        refetchType: forceRefetch ? "active" : "none",
      }),

    refreshProviders: () => refetch(),

    // Query keys for external use
    queryKeys: PROVIDERS_QUERY_KEYS,
  };
};
