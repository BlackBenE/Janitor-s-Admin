import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { dataProvider } from "../providers/dataProvider";
import type { Database } from "../types/database.types";

type ServiceRequest = Database["public"]["Tables"]["service_requests"]["Row"];
type ServiceRequestInsert =
  Database["public"]["Tables"]["service_requests"]["Insert"];
type ServiceRequestUpdate =
  Database["public"]["Tables"]["service_requests"]["Update"];

// Enhanced service request type with related info for admin views
export type ServiceRequestWithDetails = ServiceRequest & {
  requester?: {
    id: string;
    full_name: string | null;
    email: string;
    phone: string | null;
  };
  property?: {
    id: string;
    title: string;
    address: string;
    city: string;
  };
  service?: {
    id: string;
    name: string;
    category: string;
    base_price: number;
    provider_id: string;
  };
  provider?: {
    id: string;
    full_name: string | null;
    email: string;
  };
};

// Service request status types for admin management
export type ServiceRequestStatus =
  | "pending"
  | "accepted"
  | "in_progress"
  | "completed"
  | "cancelled"
  | "rejected";

// Query keys for cache management
const SERVICE_REQUESTS_QUERY_KEYS = {
  all: ["service-requests"] as const,
  lists: () => [...SERVICE_REQUESTS_QUERY_KEYS.all, "list"] as const,
  list: (filters?: Record<string, unknown>) =>
    [...SERVICE_REQUESTS_QUERY_KEYS.lists(), { filters }] as const,
  details: () => [...SERVICE_REQUESTS_QUERY_KEYS.all, "detail"] as const,
  detail: (id: string) =>
    [...SERVICE_REQUESTS_QUERY_KEYS.details(), id] as const,
  stats: () => [...SERVICE_REQUESTS_QUERY_KEYS.all, "stats"] as const,
  pending: () => [...SERVICE_REQUESTS_QUERY_KEYS.all, "pending"] as const,
  recent: () => [...SERVICE_REQUESTS_QUERY_KEYS.all, "recent"] as const,
};

export const useQuoteRequests = (options?: {
  filters?: Partial<ServiceRequest>;
  limit?: number;
  orderBy?: keyof ServiceRequest;
  includeDetails?: boolean;
  // Optimization options
  enabled?: boolean;
  refetchOnWindowFocus?: boolean;
  refetchInterval?: number;
}) => {
  const queryClient = useQueryClient();

  // Get all service requests with optional filtering
  const {
    data: serviceRequests,
    isLoading,
    error,
    refetch,
    isStale,
    isFetching,
  } = useQuery({
    queryKey: SERVICE_REQUESTS_QUERY_KEYS.list(options?.filters),
    queryFn: async () => {
      const response = await dataProvider.getList(
        "service_requests",
        {
          limit: options?.limit,
          orderBy: options?.orderBy || "created_at",
        },
        options?.filters
      );

      if (!response.success) {
        throw response.error;
      }

      return response.data;
    },
    staleTime: 3 * 60 * 1000, // 3 minutes
    gcTime: 10 * 60 * 1000, // 10 minutes garbage collection
    enabled: options?.enabled !== false,
    refetchOnWindowFocus: options?.refetchOnWindowFocus ?? false,
    refetchInterval: options?.refetchInterval,
    retry: 2,
  });

  // Get single service request with detailed info
  const useServiceRequest = (id: string) => {
    return useQuery({
      queryKey: SERVICE_REQUESTS_QUERY_KEYS.detail(id),
      queryFn: async () => {
        const response = await dataProvider.getOne("service_requests", id);

        if (!response.success) {
          throw response.error;
        }

        return response.data;
      },
      enabled: !!id,
      staleTime: 5 * 60 * 1000,
    });
  };

  // Get pending service requests (admin priority view)
  const usePendingServiceRequests = () => {
    return useQuery({
      queryKey: SERVICE_REQUESTS_QUERY_KEYS.pending(),
      queryFn: async () => {
        const response = await dataProvider.getList(
          "service_requests",
          {
            orderBy: "created_at",
          },
          { status: "pending" }
        );

        if (!response.success) {
          throw response.error;
        }

        return response.data;
      },
      staleTime: 2 * 60 * 1000, // 2 minutes for pending items
      refetchInterval: 60 * 1000, // Check every minute for new pending requests
    });
  };

  // Get recent service requests for dashboard
  const useRecentServiceRequests = (limit = 10) => {
    return useQuery({
      queryKey: SERVICE_REQUESTS_QUERY_KEYS.recent(),
      queryFn: async () => {
        const response = await dataProvider.getList("service_requests", {
          limit,
          orderBy: "created_at",
        });

        if (!response.success) {
          throw response.error;
        }

        return response.data;
      },
      staleTime: 5 * 60 * 1000,
    });
  };

  // Get service request statistics for dashboard
  const useServiceRequestStats = () => {
    return useQuery({
      queryKey: SERVICE_REQUESTS_QUERY_KEYS.stats(),
      queryFn: async () => {
        // Get counts for different statuses
        const [pending, accepted, inProgress, completed, cancelled, total] =
          await Promise.all([
            dataProvider.getList("service_requests", {}, { status: "pending" }),
            dataProvider.getList(
              "service_requests",
              {},
              { status: "accepted" }
            ),
            dataProvider.getList(
              "service_requests",
              {},
              { status: "in_progress" }
            ),
            dataProvider.getList(
              "service_requests",
              {},
              { status: "completed" }
            ),
            dataProvider.getList(
              "service_requests",
              {},
              { status: "cancelled" }
            ),
            dataProvider.getList("service_requests", {}),
          ]);

        // Calculate total revenue from completed requests
        const completedRequests =
          completed.success && completed.data ? completed.data : [];
        const totalRevenue = completedRequests.reduce(
          (sum, request) => sum + request.total_amount,
          0
        );

        return {
          pending: pending.success && pending.data ? pending.data.length : 0,
          accepted:
            accepted.success && accepted.data ? accepted.data.length : 0,
          inProgress:
            inProgress.success && inProgress.data ? inProgress.data.length : 0,
          completed:
            completed.success && completed.data ? completed.data.length : 0,
          cancelled:
            cancelled.success && cancelled.data ? cancelled.data.length : 0,
          total: total.success && total.data ? total.data.length : 0,
          totalRevenue,
        };
      },
      staleTime: 10 * 60 * 1000, // 10 minutes for stats
    });
  };

  // Create service request mutation
  const createServiceRequest = useMutation({
    mutationFn: async (payload: ServiceRequestInsert) => {
      const response = await dataProvider.create("service_requests", payload);

      if (!response.success) {
        throw response.error;
      }

      return response.data;
    },
    onMutate: async (newRequest) => {
      await queryClient.cancelQueries({
        queryKey: SERVICE_REQUESTS_QUERY_KEYS.lists(),
      });

      const previousRequests = queryClient.getQueryData(
        SERVICE_REQUESTS_QUERY_KEYS.list(options?.filters)
      );

      if (previousRequests) {
        const optimisticRequest = {
          ...newRequest,
          id: `temp-${Date.now()}`,
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString(),
          status: "pending",
        } as ServiceRequest;

        queryClient.setQueryData(
          SERVICE_REQUESTS_QUERY_KEYS.list(options?.filters),
          (old: ServiceRequest[] | undefined) =>
            old ? [optimisticRequest, ...old] : [optimisticRequest]
        );
      }

      return { previousRequests };
    },
    onError: (err, newRequest, context) => {
      if (context?.previousRequests) {
        queryClient.setQueryData(
          SERVICE_REQUESTS_QUERY_KEYS.list(options?.filters),
          context.previousRequests
        );
      }
    },
    onSettled: (newRequest) => {
      queryClient.invalidateQueries({
        queryKey: SERVICE_REQUESTS_QUERY_KEYS.lists(),
        refetchType: "none",
      });
      queryClient.invalidateQueries({
        queryKey: SERVICE_REQUESTS_QUERY_KEYS.stats(),
      });

      if (newRequest) {
        queryClient.setQueryData(
          SERVICE_REQUESTS_QUERY_KEYS.detail(newRequest.id),
          newRequest
        );
      }
    },
  });

  // Update service request mutation
  const updateServiceRequest = useMutation({
    mutationFn: async ({
      id,
      payload,
    }: {
      id: string;
      payload: ServiceRequestUpdate;
    }) => {
      const response = await dataProvider.update("service_requests", id, {
        ...payload,
        updated_at: new Date().toISOString(),
      });

      if (!response.success) {
        throw response.error;
      }

      return response.data;
    },
    onSuccess: (updatedRequest, { id }) => {
      queryClient.setQueryData(
        SERVICE_REQUESTS_QUERY_KEYS.detail(id),
        updatedRequest
      );
      queryClient.invalidateQueries({
        queryKey: SERVICE_REQUESTS_QUERY_KEYS.lists(),
      });
      queryClient.invalidateQueries({
        queryKey: SERVICE_REQUESTS_QUERY_KEYS.stats(),
      });
    },
  });

  // Delete service request mutation
  const deleteServiceRequest = useMutation({
    mutationFn: async (id: string) => {
      const response = await dataProvider.delete("service_requests", id);

      if (!response.success) {
        throw response.error;
      }

      return response.data;
    },
    onSuccess: (_, deletedId) => {
      queryClient.removeQueries({
        queryKey: SERVICE_REQUESTS_QUERY_KEYS.detail(deletedId),
      });
      queryClient.invalidateQueries({
        queryKey: SERVICE_REQUESTS_QUERY_KEYS.lists(),
      });
      queryClient.invalidateQueries({
        queryKey: SERVICE_REQUESTS_QUERY_KEYS.stats(),
      });
    },
  });

  // Accept/Approve service request mutation (admin/provider action)
  const acceptServiceRequest = useMutation({
    mutationFn: async (id: string) => {
      const response = await dataProvider.update("service_requests", id, {
        status: "accepted",
        updated_at: new Date().toISOString(),
      });

      if (!response.success) {
        throw response.error;
      }

      return response.data;
    },
    onSuccess: (updatedRequest, id) => {
      queryClient.setQueryData(
        SERVICE_REQUESTS_QUERY_KEYS.detail(id),
        updatedRequest
      );
      queryClient.invalidateQueries({
        queryKey: SERVICE_REQUESTS_QUERY_KEYS.lists(),
      });
      queryClient.invalidateQueries({
        queryKey: SERVICE_REQUESTS_QUERY_KEYS.pending(),
      });
      queryClient.invalidateQueries({
        queryKey: SERVICE_REQUESTS_QUERY_KEYS.stats(),
      });
    },
  });

  // Reject service request mutation
  const rejectServiceRequest = useMutation({
    mutationFn: async (id: string) => {
      const response = await dataProvider.update("service_requests", id, {
        status: "rejected",
        updated_at: new Date().toISOString(),
      });

      if (!response.success) {
        throw response.error;
      }

      return response.data;
    },
    onSuccess: (updatedRequest, id) => {
      queryClient.setQueryData(
        SERVICE_REQUESTS_QUERY_KEYS.detail(id),
        updatedRequest
      );
      queryClient.invalidateQueries({
        queryKey: SERVICE_REQUESTS_QUERY_KEYS.lists(),
      });
      queryClient.invalidateQueries({
        queryKey: SERVICE_REQUESTS_QUERY_KEYS.pending(),
      });
      queryClient.invalidateQueries({
        queryKey: SERVICE_REQUESTS_QUERY_KEYS.stats(),
      });
    },
  });

  // Mark service request as completed
  const completeServiceRequest = useMutation({
    mutationFn: async (id: string) => {
      const response = await dataProvider.update("service_requests", id, {
        status: "completed",
        updated_at: new Date().toISOString(),
      });

      if (!response.success) {
        throw response.error;
      }

      return response.data;
    },
    onSuccess: (updatedRequest, id) => {
      queryClient.setQueryData(
        SERVICE_REQUESTS_QUERY_KEYS.detail(id),
        updatedRequest
      );
      queryClient.invalidateQueries({
        queryKey: SERVICE_REQUESTS_QUERY_KEYS.lists(),
      });
      queryClient.invalidateQueries({
        queryKey: SERVICE_REQUESTS_QUERY_KEYS.stats(),
      });
    },
  });

  // Cancel service request
  const cancelServiceRequest = useMutation({
    mutationFn: async (id: string) => {
      const response = await dataProvider.update("service_requests", id, {
        status: "cancelled",
        updated_at: new Date().toISOString(),
      });

      if (!response.success) {
        throw response.error;
      }

      return response.data;
    },
    onSuccess: (updatedRequest, id) => {
      queryClient.setQueryData(
        SERVICE_REQUESTS_QUERY_KEYS.detail(id),
        updatedRequest
      );
      queryClient.invalidateQueries({
        queryKey: SERVICE_REQUESTS_QUERY_KEYS.lists(),
      });
      queryClient.invalidateQueries({
        queryKey: SERVICE_REQUESTS_QUERY_KEYS.stats(),
      });
    },
  });

  // Bulk operations
  const acceptManyServiceRequests = useMutation({
    mutationFn: async (ids: string[]) => {
      const updates = ids.map((id) =>
        dataProvider.update("service_requests", id, {
          status: "accepted",
          updated_at: new Date().toISOString(),
        })
      );

      const responses = await Promise.all(updates);
      const failed = responses.filter((r) => !r.success);

      if (failed.length > 0) {
        throw new Error(`Failed to accept ${failed.length} service requests`);
      }

      return responses.map((r) => r.data);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: SERVICE_REQUESTS_QUERY_KEYS.lists(),
      });
      queryClient.invalidateQueries({
        queryKey: SERVICE_REQUESTS_QUERY_KEYS.pending(),
      });
      queryClient.invalidateQueries({
        queryKey: SERVICE_REQUESTS_QUERY_KEYS.stats(),
      });
    },
  });

  const deleteManyServiceRequests = useMutation({
    mutationFn: async (ids: string[]) => {
      const response = await dataProvider.deleteMany("service_requests", ids);

      if (!response.success) {
        throw response.error;
      }

      return response.data;
    },
    onSuccess: (_, deletedIds) => {
      deletedIds.forEach((id) => {
        queryClient.removeQueries({
          queryKey: SERVICE_REQUESTS_QUERY_KEYS.detail(id),
        });
      });
      queryClient.invalidateQueries({
        queryKey: SERVICE_REQUESTS_QUERY_KEYS.lists(),
      });
      queryClient.invalidateQueries({
        queryKey: SERVICE_REQUESTS_QUERY_KEYS.stats(),
      });
    },
  });

  return {
    // Query data
    serviceRequests: serviceRequests || [],
    isLoading,
    isFetching,
    isStale,
    error,
    refetch,

    // Specialized hooks
    useServiceRequest,
    usePendingServiceRequests,
    useRecentServiceRequests,
    useServiceRequestStats,

    // Basic mutations
    createServiceRequest: {
      mutate: createServiceRequest.mutate,
      mutateAsync: createServiceRequest.mutateAsync,
      isPending: createServiceRequest.isPending,
      error: createServiceRequest.error,
      isSuccess: createServiceRequest.isSuccess,
    },

    updateServiceRequest: {
      mutate: updateServiceRequest.mutate,
      mutateAsync: updateServiceRequest.mutateAsync,
      isPending: updateServiceRequest.isPending,
      error: updateServiceRequest.error,
      isSuccess: updateServiceRequest.isSuccess,
    },

    deleteServiceRequest: {
      mutate: deleteServiceRequest.mutate,
      mutateAsync: deleteServiceRequest.mutateAsync,
      isPending: deleteServiceRequest.isPending,
      error: deleteServiceRequest.error,
      isSuccess: deleteServiceRequest.isSuccess,
    },

    // Status change mutations
    acceptServiceRequest: {
      mutate: acceptServiceRequest.mutate,
      mutateAsync: acceptServiceRequest.mutateAsync,
      isPending: acceptServiceRequest.isPending,
      error: acceptServiceRequest.error,
      isSuccess: acceptServiceRequest.isSuccess,
    },

    rejectServiceRequest: {
      mutate: rejectServiceRequest.mutate,
      mutateAsync: rejectServiceRequest.mutateAsync,
      isPending: rejectServiceRequest.isPending,
      error: rejectServiceRequest.error,
      isSuccess: rejectServiceRequest.isSuccess,
    },

    completeServiceRequest: {
      mutate: completeServiceRequest.mutate,
      mutateAsync: completeServiceRequest.mutateAsync,
      isPending: completeServiceRequest.isPending,
      error: completeServiceRequest.error,
      isSuccess: completeServiceRequest.isSuccess,
    },

    cancelServiceRequest: {
      mutate: cancelServiceRequest.mutate,
      mutateAsync: cancelServiceRequest.mutateAsync,
      isPending: cancelServiceRequest.isPending,
      error: cancelServiceRequest.error,
      isSuccess: cancelServiceRequest.isSuccess,
    },

    // Bulk operations
    acceptManyServiceRequests: {
      mutate: acceptManyServiceRequests.mutate,
      mutateAsync: acceptManyServiceRequests.mutateAsync,
      isPending: acceptManyServiceRequests.isPending,
      error: acceptManyServiceRequests.error,
      isSuccess: acceptManyServiceRequests.isSuccess,
    },

    deleteManyServiceRequests: {
      mutate: deleteManyServiceRequests.mutate,
      mutateAsync: deleteManyServiceRequests.mutateAsync,
      isPending: deleteManyServiceRequests.isPending,
      error: deleteManyServiceRequests.error,
      isSuccess: deleteManyServiceRequests.isSuccess,
    },

    // Utilities
    invalidateServiceRequests: (forceRefetch = false) =>
      queryClient.invalidateQueries({
        queryKey: SERVICE_REQUESTS_QUERY_KEYS.lists(),
        refetchType: forceRefetch ? "active" : "none",
      }),

    refreshServiceRequests: () => refetch(),

    // Query keys for external use
    queryKeys: SERVICE_REQUESTS_QUERY_KEYS,
  };
};
