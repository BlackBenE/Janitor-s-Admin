import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { dataProvider } from "../providers/dataProvider";
import type { Database } from "../types/database.types";

type Property = Database["public"]["Tables"]["properties"]["Row"];
type PropertyInsert = Database["public"]["Tables"]["properties"]["Insert"];
type PropertyUpdate = Database["public"]["Tables"]["properties"]["Update"];

// Enhanced property type with owner info for admin views
export type PropertyWithOwner = Property & {
  owner?: {
    id: string;
    full_name: string | null;
    email: string;
    phone: string | null;
  };
  validator?: {
    id: string;
    full_name: string | null;
    email: string;
  };
};

// Property status types for admin management
export type PropertyStatus =
  | "pending"
  | "approved"
  | "rejected"
  | "under_review";

// Query keys for cache management
const PROPERTIES_QUERY_KEYS = {
  all: ["properties"] as const,
  lists: () => [...PROPERTIES_QUERY_KEYS.all, "list"] as const,
  list: (filters?: Record<string, any>) =>
    [...PROPERTIES_QUERY_KEYS.lists(), { filters }] as const,
  details: () => [...PROPERTIES_QUERY_KEYS.all, "detail"] as const,
  detail: (id: string) => [...PROPERTIES_QUERY_KEYS.details(), id] as const,
  stats: () => [...PROPERTIES_QUERY_KEYS.all, "stats"] as const,
  pending: () => [...PROPERTIES_QUERY_KEYS.all, "pending"] as const,
};

export const useProperties = (options?: {
  filters?: Partial<Property>;
  limit?: number;
  orderBy?: keyof Property;
  includePending?: boolean;
  includeOwnerInfo?: boolean;
  // Optimization options
  enabled?: boolean;
  refetchOnWindowFocus?: boolean;
  refetchInterval?: number;
}) => {
  const queryClient = useQueryClient();

  // Get all properties with optional filtering
  const {
    data: properties,
    isLoading,
    error,
    refetch,
    isStale,
    isFetching,
  } = useQuery({
    queryKey: PROPERTIES_QUERY_KEYS.list(options?.filters),
    queryFn: async () => {
      const response = await dataProvider.getList(
        "properties",
        {
          limit: options?.limit,
          orderBy: options?.orderBy,
        },
        options?.filters
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

  // Get single property with detailed info
  const useProperty = (id: string) => {
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

  // Get properties pending approval (admin only)
  const usePendingProperties = () => {
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

  // Get property statistics for dashboard
  const usePropertyStats = () => {
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
          approved:
            approved.success && approved.data ? approved.data.length : 0,
          rejected:
            rejected.success && rejected.data ? rejected.data.length : 0,
          total: total.success && total.data ? total.data.length : 0,
        };
      },
      staleTime: 10 * 60 * 1000, // 10 minutes for stats
    });
  };

  // Create property mutation
  const createProperty = useMutation({
    mutationFn: async (payload: PropertyInsert) => {
      const response = await dataProvider.create("properties", payload);

      if (!response.success) {
        throw response.error;
      }

      return response.data;
    },
    onMutate: async (newProperty) => {
      await queryClient.cancelQueries({
        queryKey: PROPERTIES_QUERY_KEYS.lists(),
      });

      const previousProperties = queryClient.getQueryData(
        PROPERTIES_QUERY_KEYS.list(options?.filters)
      );

      if (previousProperties) {
        const optimisticProperty = {
          ...newProperty,
          id: `temp-${Date.now()}`,
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString(),
          validation_status: "pending",
        } as Property;

        queryClient.setQueryData(
          PROPERTIES_QUERY_KEYS.list(options?.filters),
          (old: Property[] | undefined) =>
            old ? [optimisticProperty, ...old] : [optimisticProperty]
        );
      }

      return { previousProperties };
    },
    onError: (err, newProperty, context) => {
      if (context?.previousProperties) {
        queryClient.setQueryData(
          PROPERTIES_QUERY_KEYS.list(options?.filters),
          context.previousProperties
        );
      }
    },
    onSettled: (newProperty) => {
      queryClient.invalidateQueries({
        queryKey: PROPERTIES_QUERY_KEYS.lists(),
        refetchType: "none",
      });
      queryClient.invalidateQueries({
        queryKey: PROPERTIES_QUERY_KEYS.stats(),
      });

      if (newProperty) {
        queryClient.setQueryData(
          PROPERTIES_QUERY_KEYS.detail(newProperty.id),
          newProperty
        );
      }
    },
  });

  // Update property mutation
  const updateProperty = useMutation({
    mutationFn: async ({
      id,
      payload,
    }: {
      id: string;
      payload: PropertyUpdate;
    }) => {
      const response = await dataProvider.update("properties", id, {
        ...payload,
        updated_at: new Date().toISOString(),
      });

      if (!response.success) {
        throw response.error;
      }

      return response.data;
    },
    onSuccess: (updatedProperty, { id }) => {
      queryClient.setQueryData(
        PROPERTIES_QUERY_KEYS.detail(id),
        updatedProperty
      );
      queryClient.invalidateQueries({
        queryKey: PROPERTIES_QUERY_KEYS.lists(),
      });
      queryClient.invalidateQueries({
        queryKey: PROPERTIES_QUERY_KEYS.stats(),
      });
    },
  });

  // Delete property mutation
  const deleteProperty = useMutation({
    mutationFn: async (id: string) => {
      const response = await dataProvider.delete("properties", id);

      if (!response.success) {
        throw response.error;
      }

      return response.data;
    },
    onSuccess: (_, deletedId) => {
      queryClient.removeQueries({
        queryKey: PROPERTIES_QUERY_KEYS.detail(deletedId),
      });
      queryClient.invalidateQueries({
        queryKey: PROPERTIES_QUERY_KEYS.lists(),
      });
      queryClient.invalidateQueries({
        queryKey: PROPERTIES_QUERY_KEYS.stats(),
      });
    },
  });

  // Approve property mutation (admin only)
  const approveProperty = useMutation({
    mutationFn: async ({
      id,
      validatedBy,
    }: {
      id: string;
      validatedBy: string;
    }) => {
      const response = await dataProvider.update("properties", id, {
        validation_status: "approved",
        validated_at: new Date().toISOString(),
        validated_by: validatedBy,
        updated_at: new Date().toISOString(),
      });

      if (!response.success) {
        throw response.error;
      }

      return response.data;
    },
    onSuccess: (updatedProperty, { id }) => {
      queryClient.setQueryData(
        PROPERTIES_QUERY_KEYS.detail(id),
        updatedProperty
      );
      queryClient.invalidateQueries({
        queryKey: PROPERTIES_QUERY_KEYS.lists(),
      });
      queryClient.invalidateQueries({
        queryKey: PROPERTIES_QUERY_KEYS.pending(),
      });
      queryClient.invalidateQueries({
        queryKey: PROPERTIES_QUERY_KEYS.stats(),
      });
    },
  });

  // Reject property mutation (admin only)
  const rejectProperty = useMutation({
    mutationFn: async ({
      id,
      validatedBy,
    }: {
      id: string;
      validatedBy: string;
    }) => {
      const response = await dataProvider.update("properties", id, {
        validation_status: "rejected",
        validated_at: new Date().toISOString(),
        validated_by: validatedBy,
        updated_at: new Date().toISOString(),
      });

      if (!response.success) {
        throw response.error;
      }

      return response.data;
    },
    onSuccess: (updatedProperty, { id }) => {
      queryClient.setQueryData(
        PROPERTIES_QUERY_KEYS.detail(id),
        updatedProperty
      );
      queryClient.invalidateQueries({
        queryKey: PROPERTIES_QUERY_KEYS.lists(),
      });
      queryClient.invalidateQueries({
        queryKey: PROPERTIES_QUERY_KEYS.pending(),
      });
      queryClient.invalidateQueries({
        queryKey: PROPERTIES_QUERY_KEYS.stats(),
      });
    },
  });

  // Bulk operations
  const approveManyProperties = useMutation({
    mutationFn: async ({
      ids,
      validatedBy,
    }: {
      ids: string[];
      validatedBy: string;
    }) => {
      const updates = ids.map((id) =>
        dataProvider.update("properties", id, {
          validation_status: "approved",
          validated_at: new Date().toISOString(),
          validated_by: validatedBy,
          updated_at: new Date().toISOString(),
        })
      );

      const responses = await Promise.all(updates);
      const failed = responses.filter((r) => !r.success);

      if (failed.length > 0) {
        throw new Error(`Failed to approve ${failed.length} properties`);
      }

      return responses.map((r) => r.data);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: PROPERTIES_QUERY_KEYS.lists(),
      });
      queryClient.invalidateQueries({
        queryKey: PROPERTIES_QUERY_KEYS.pending(),
      });
      queryClient.invalidateQueries({
        queryKey: PROPERTIES_QUERY_KEYS.stats(),
      });
    },
  });

  const deleteManyProperties = useMutation({
    mutationFn: async (ids: string[]) => {
      const response = await dataProvider.deleteMany("properties", ids);

      if (!response.success) {
        throw response.error;
      }

      return response.data;
    },
    onSuccess: (_, deletedIds) => {
      deletedIds.forEach((id) => {
        queryClient.removeQueries({
          queryKey: PROPERTIES_QUERY_KEYS.detail(id),
        });
      });
      queryClient.invalidateQueries({
        queryKey: PROPERTIES_QUERY_KEYS.lists(),
      });
      queryClient.invalidateQueries({
        queryKey: PROPERTIES_QUERY_KEYS.stats(),
      });
    },
  });

  return {
    // Query data
    properties: properties || [],
    isLoading,
    isFetching,
    isStale,
    error,
    refetch,

    // Specialized hooks
    useProperty,
    usePendingProperties,
    usePropertyStats,

    // Basic mutations
    createProperty: {
      mutate: createProperty.mutate,
      mutateAsync: createProperty.mutateAsync,
      isPending: createProperty.isPending,
      error: createProperty.error,
      isSuccess: createProperty.isSuccess,
    },

    updateProperty: {
      mutate: updateProperty.mutate,
      mutateAsync: updateProperty.mutateAsync,
      isPending: updateProperty.isPending,
      error: updateProperty.error,
      isSuccess: updateProperty.isSuccess,
    },

    deleteProperty: {
      mutate: deleteProperty.mutate,
      mutateAsync: deleteProperty.mutateAsync,
      isPending: deleteProperty.isPending,
      error: deleteProperty.error,
      isSuccess: deleteProperty.isSuccess,
    },

    // Admin-specific mutations
    approveProperty: {
      mutate: approveProperty.mutate,
      mutateAsync: approveProperty.mutateAsync,
      isPending: approveProperty.isPending,
      error: approveProperty.error,
      isSuccess: approveProperty.isSuccess,
    },

    rejectProperty: {
      mutate: rejectProperty.mutate,
      mutateAsync: rejectProperty.mutateAsync,
      isPending: rejectProperty.isPending,
      error: rejectProperty.error,
      isSuccess: rejectProperty.isSuccess,
    },

    // Bulk operations
    approveManyProperties: {
      mutate: approveManyProperties.mutate,
      mutateAsync: approveManyProperties.mutateAsync,
      isPending: approveManyProperties.isPending,
      error: approveManyProperties.error,
      isSuccess: approveManyProperties.isSuccess,
    },

    deleteManyProperties: {
      mutate: deleteManyProperties.mutate,
      mutateAsync: deleteManyProperties.mutateAsync,
      isPending: deleteManyProperties.isPending,
      error: deleteManyProperties.error,
      isSuccess: deleteManyProperties.isSuccess,
    },

    // Utilities
    invalidateProperties: (forceRefetch = false) =>
      queryClient.invalidateQueries({
        queryKey: PROPERTIES_QUERY_KEYS.lists(),
        refetchType: forceRefetch ? "active" : "none",
      }),

    refreshProperties: () => refetch(),

    // Query keys for external use
    queryKeys: PROPERTIES_QUERY_KEYS,
  };
};
