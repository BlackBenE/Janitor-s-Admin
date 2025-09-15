import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { dataProvider } from "../providers/dataProvider";
import type { Database } from "../types/database.types";

type Payment = Database["public"]["Tables"]["payments"]["Row"];
type PaymentInsert = Database["public"]["Tables"]["payments"]["Insert"];
type PaymentUpdate = Database["public"]["Tables"]["payments"]["Update"];

// Enhanced payment/invoice type with related info for admin views
export type PaymentWithDetails = Payment & {
  payer?: {
    id: string;
    full_name: string | null;
    email: string;
    phone: string | null;
  };
  payee?: {
    id: string;
    full_name: string | null;
    email: string;
    phone: string | null;
  };
  booking?: {
    id: string;
    check_in: string;
    check_out: string;
    property_id: string;
  };
  serviceRequest?: {
    id: string;
    service_id: string;
    requested_date: string;
    status: string | null;
  };
};

// Payment/Invoice status types
export type PaymentStatus =
  | "pending"
  | "processing"
  | "completed"
  | "failed"
  | "refunded"
  | "cancelled";

// Payment types for categorization
export type PaymentType =
  | "booking_payment"
  | "service_payment"
  | "commission"
  | "refund"
  | "subscription";

// Query keys for cache management
const INVOICES_QUERY_KEYS = {
  all: ["invoices"] as const,
  lists: () => [...INVOICES_QUERY_KEYS.all, "list"] as const,
  list: (filters?: Record<string, any>) =>
    [...INVOICES_QUERY_KEYS.lists(), { filters }] as const,
  details: () => [...INVOICES_QUERY_KEYS.all, "detail"] as const,
  detail: (id: string) => [...INVOICES_QUERY_KEYS.details(), id] as const,
  stats: () => [...INVOICES_QUERY_KEYS.all, "stats"] as const,
  pending: () => [...INVOICES_QUERY_KEYS.all, "pending"] as const,
  recent: () => [...INVOICES_QUERY_KEYS.all, "recent"] as const,
  revenue: () => [...INVOICES_QUERY_KEYS.all, "revenue"] as const,
  byUser: (userId: string) =>
    [...INVOICES_QUERY_KEYS.all, "user", userId] as const,
};

export const useInvoices = (options?: {
  filters?: Partial<Payment>;
  limit?: number;
  orderBy?: keyof Payment;
  includeDetails?: boolean;
  paymentType?: PaymentType;
  status?: PaymentStatus;
  userId?: string;
  dateRange?: { from: string; to: string };
  // Optimization options
  enabled?: boolean;
  refetchOnWindowFocus?: boolean;
  refetchInterval?: number;
}) => {
  const queryClient = useQueryClient();

  // Build filters
  const invoiceFilters = {
    ...options?.filters,
    ...(options?.paymentType ? { payment_type: options.paymentType } : {}),
    ...(options?.status ? { status: options.status } : {}),
    ...(options?.userId ? { payer_id: options.userId } : {}),
  };

  // Get all payments/invoices with optional filtering
  const {
    data: invoices,
    isLoading,
    error,
    refetch,
    isStale,
    isFetching,
  } = useQuery({
    queryKey: INVOICES_QUERY_KEYS.list(invoiceFilters),
    queryFn: async () => {
      const response = await dataProvider.getList(
        "payments",
        {
          limit: options?.limit,
          orderBy: options?.orderBy || "created_at",
        },
        invoiceFilters
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

  // Get single payment/invoice with detailed info
  const useInvoice = (id: string) => {
    return useQuery({
      queryKey: INVOICES_QUERY_KEYS.detail(id),
      queryFn: async () => {
        const response = await dataProvider.getOne("payments", id);

        if (!response.success) {
          throw response.error;
        }

        return response.data;
      },
      enabled: !!id,
      staleTime: 5 * 60 * 1000,
    });
  };

  // Get pending payments for admin monitoring
  const usePendingInvoices = () => {
    return useQuery({
      queryKey: INVOICES_QUERY_KEYS.pending(),
      queryFn: async () => {
        const response = await dataProvider.getList(
          "payments",
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
      refetchInterval: 30 * 1000, // Check every 30 seconds for pending payments
    });
  };

  // Get recent invoices for dashboard
  const useRecentInvoices = (limit = 10) => {
    return useQuery({
      queryKey: INVOICES_QUERY_KEYS.recent(),
      queryFn: async () => {
        const response = await dataProvider.getList("payments", {
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

  // Get invoices by user
  const useInvoicesByUser = (userId: string) => {
    return useQuery({
      queryKey: INVOICES_QUERY_KEYS.byUser(userId),
      queryFn: async () => {
        const response = await dataProvider.getList(
          "payments",
          {
            orderBy: "created_at",
          },
          { payer_id: userId }
        );

        if (!response.success) {
          throw response.error;
        }

        return response.data;
      },
      enabled: !!userId,
      staleTime: 5 * 60 * 1000,
    });
  };

  // Get revenue analytics
  const useRevenueStats = () => {
    return useQuery({
      queryKey: INVOICES_QUERY_KEYS.revenue(),
      queryFn: async () => {
        const [completed, pending, failed, total] = await Promise.all([
          dataProvider.getList("payments", {}, { status: "completed" }),
          dataProvider.getList("payments", {}, { status: "pending" }),
          dataProvider.getList("payments", {}, { status: "failed" }),
          dataProvider.getList("payments", {}),
        ]);

        // Calculate revenue from completed payments
        const completedPayments =
          completed.success && completed.data ? completed.data : [];
        const totalRevenue = completedPayments.reduce(
          (sum, payment) => sum + payment.amount,
          0
        );

        // Calculate pending revenue
        const pendingPayments =
          pending.success && pending.data ? pending.data : [];
        const pendingRevenue = pendingPayments.reduce(
          (sum, payment) => sum + payment.amount,
          0
        );

        // Calculate monthly revenue (last 30 days)
        const thirtyDaysAgo = new Date();
        thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);

        const monthlyRevenue = completedPayments
          .filter(
            (payment) => new Date(payment.created_at || "") >= thirtyDaysAgo
          )
          .reduce((sum, payment) => sum + payment.amount, 0);

        return {
          totalRevenue: Math.round(totalRevenue * 100) / 100,
          pendingRevenue: Math.round(pendingRevenue * 100) / 100,
          monthlyRevenue: Math.round(monthlyRevenue * 100) / 100,
          completedCount: completedPayments.length,
          pendingCount: pendingPayments.length,
          failedCount: failed.success && failed.data ? failed.data.length : 0,
          totalCount: total.success && total.data ? total.data.length : 0,
        };
      },
      staleTime: 10 * 60 * 1000, // 10 minutes for revenue stats
    });
  };

  // Get invoice statistics for dashboard
  const useInvoiceStats = () => {
    return useQuery({
      queryKey: INVOICES_QUERY_KEYS.stats(),
      queryFn: async () => {
        // Get counts for different payment statuses and types
        const [
          pending,
          completed,
          failed,
          bookingPayments,
          servicePayments,
          total,
        ] = await Promise.all([
          dataProvider.getList("payments", {}, { status: "pending" }),
          dataProvider.getList("payments", {}, { status: "completed" }),
          dataProvider.getList("payments", {}, { status: "failed" }),
          dataProvider.getList(
            "payments",
            {},
            { payment_type: "booking_payment" }
          ),
          dataProvider.getList(
            "payments",
            {},
            { payment_type: "service_payment" }
          ),
          dataProvider.getList("payments", {}),
        ]);

        return {
          pending: pending.success && pending.data ? pending.data.length : 0,
          completed:
            completed.success && completed.data ? completed.data.length : 0,
          failed: failed.success && failed.data ? failed.data.length : 0,
          bookingPayments:
            bookingPayments.success && bookingPayments.data
              ? bookingPayments.data.length
              : 0,
          servicePayments:
            servicePayments.success && servicePayments.data
              ? servicePayments.data.length
              : 0,
          total: total.success && total.data ? total.data.length : 0,
        };
      },
      staleTime: 10 * 60 * 1000, // 10 minutes for stats
    });
  };

  // Create invoice/payment mutation
  const createInvoice = useMutation({
    mutationFn: async (payload: PaymentInsert) => {
      const invoicePayload = {
        ...payload,
        status: payload.status || "pending",
      };

      const response = await dataProvider.create("payments", invoicePayload);

      if (!response.success) {
        throw response.error;
      }

      return response.data;
    },
    onMutate: async (newInvoice) => {
      await queryClient.cancelQueries({
        queryKey: INVOICES_QUERY_KEYS.lists(),
      });

      const previousInvoices = queryClient.getQueryData(
        INVOICES_QUERY_KEYS.list(invoiceFilters)
      );

      if (previousInvoices) {
        const optimisticInvoice = {
          ...newInvoice,
          id: `temp-${Date.now()}`,
          created_at: new Date().toISOString(),
          status: newInvoice.status || "pending",
        } as Payment;

        queryClient.setQueryData(
          INVOICES_QUERY_KEYS.list(invoiceFilters),
          (old: Payment[] | undefined) =>
            old ? [optimisticInvoice, ...old] : [optimisticInvoice]
        );
      }

      return { previousInvoices };
    },
    onError: (err, newInvoice, context) => {
      if (context?.previousInvoices) {
        queryClient.setQueryData(
          INVOICES_QUERY_KEYS.list(invoiceFilters),
          context.previousInvoices
        );
      }
    },
    onSettled: (newInvoice) => {
      queryClient.invalidateQueries({
        queryKey: INVOICES_QUERY_KEYS.lists(),
        refetchType: "none",
      });
      queryClient.invalidateQueries({
        queryKey: INVOICES_QUERY_KEYS.stats(),
      });
      queryClient.invalidateQueries({
        queryKey: INVOICES_QUERY_KEYS.revenue(),
      });

      if (newInvoice) {
        queryClient.setQueryData(
          INVOICES_QUERY_KEYS.detail(newInvoice.id),
          newInvoice
        );
      }
    },
  });

  // Update invoice/payment mutation
  const updateInvoice = useMutation({
    mutationFn: async ({
      id,
      payload,
    }: {
      id: string;
      payload: PaymentUpdate;
    }) => {
      const response = await dataProvider.update("payments", id, payload);

      if (!response.success) {
        throw response.error;
      }

      return response.data;
    },
    onSuccess: (updatedInvoice, { id }) => {
      queryClient.setQueryData(INVOICES_QUERY_KEYS.detail(id), updatedInvoice);
      queryClient.invalidateQueries({ queryKey: INVOICES_QUERY_KEYS.lists() });
      queryClient.invalidateQueries({ queryKey: INVOICES_QUERY_KEYS.stats() });
      queryClient.invalidateQueries({
        queryKey: INVOICES_QUERY_KEYS.revenue(),
      });
    },
  });

  // Delete invoice/payment mutation
  const deleteInvoice = useMutation({
    mutationFn: async (id: string) => {
      const response = await dataProvider.delete("payments", id);

      if (!response.success) {
        throw response.error;
      }

      return response.data;
    },
    onSuccess: (_, deletedId) => {
      queryClient.removeQueries({
        queryKey: INVOICES_QUERY_KEYS.detail(deletedId),
      });
      queryClient.invalidateQueries({ queryKey: INVOICES_QUERY_KEYS.lists() });
      queryClient.invalidateQueries({ queryKey: INVOICES_QUERY_KEYS.stats() });
      queryClient.invalidateQueries({
        queryKey: INVOICES_QUERY_KEYS.revenue(),
      });
    },
  });

  // Mark invoice as paid mutation
  const markAsPaid = useMutation({
    mutationFn: async (id: string) => {
      const response = await dataProvider.update("payments", id, {
        status: "completed",
        processed_at: new Date().toISOString(),
      });

      if (!response.success) {
        throw response.error;
      }

      return response.data;
    },
    onSuccess: (updatedInvoice, id) => {
      queryClient.setQueryData(INVOICES_QUERY_KEYS.detail(id), updatedInvoice);
      queryClient.invalidateQueries({ queryKey: INVOICES_QUERY_KEYS.lists() });
      queryClient.invalidateQueries({
        queryKey: INVOICES_QUERY_KEYS.pending(),
      });
      queryClient.invalidateQueries({ queryKey: INVOICES_QUERY_KEYS.stats() });
      queryClient.invalidateQueries({
        queryKey: INVOICES_QUERY_KEYS.revenue(),
      });
    },
  });

  // Mark invoice as failed mutation
  const markAsFailed = useMutation({
    mutationFn: async (id: string) => {
      const response = await dataProvider.update("payments", id, {
        status: "failed",
        processed_at: new Date().toISOString(),
      });

      if (!response.success) {
        throw response.error;
      }

      return response.data;
    },
    onSuccess: (updatedInvoice, id) => {
      queryClient.setQueryData(INVOICES_QUERY_KEYS.detail(id), updatedInvoice);
      queryClient.invalidateQueries({ queryKey: INVOICES_QUERY_KEYS.lists() });
      queryClient.invalidateQueries({
        queryKey: INVOICES_QUERY_KEYS.pending(),
      });
      queryClient.invalidateQueries({ queryKey: INVOICES_QUERY_KEYS.stats() });
    },
  });

  // Process refund mutation
  const processRefund = useMutation({
    mutationFn: async (id: string) => {
      const response = await dataProvider.update("payments", id, {
        status: "refunded",
        processed_at: new Date().toISOString(),
      });

      if (!response.success) {
        throw response.error;
      }

      return response.data;
    },
    onSuccess: (updatedInvoice, id) => {
      queryClient.setQueryData(INVOICES_QUERY_KEYS.detail(id), updatedInvoice);
      queryClient.invalidateQueries({ queryKey: INVOICES_QUERY_KEYS.lists() });
      queryClient.invalidateQueries({ queryKey: INVOICES_QUERY_KEYS.stats() });
      queryClient.invalidateQueries({
        queryKey: INVOICES_QUERY_KEYS.revenue(),
      });
    },
  });

  // Bulk operations
  const markManyAsPaid = useMutation({
    mutationFn: async (ids: string[]) => {
      const updates = ids.map((id) =>
        dataProvider.update("payments", id, {
          status: "completed",
          processed_at: new Date().toISOString(),
        })
      );

      const responses = await Promise.all(updates);
      const failed = responses.filter((r) => !r.success);

      if (failed.length > 0) {
        throw new Error(`Failed to mark ${failed.length} invoices as paid`);
      }

      return responses.map((r) => r.data);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: INVOICES_QUERY_KEYS.lists() });
      queryClient.invalidateQueries({
        queryKey: INVOICES_QUERY_KEYS.pending(),
      });
      queryClient.invalidateQueries({ queryKey: INVOICES_QUERY_KEYS.stats() });
      queryClient.invalidateQueries({
        queryKey: INVOICES_QUERY_KEYS.revenue(),
      });
    },
  });

  const deleteManyInvoices = useMutation({
    mutationFn: async (ids: string[]) => {
      const response = await dataProvider.deleteMany("payments", ids);

      if (!response.success) {
        throw response.error;
      }

      return response.data;
    },
    onSuccess: (_, deletedIds) => {
      deletedIds.forEach((id) => {
        queryClient.removeQueries({ queryKey: INVOICES_QUERY_KEYS.detail(id) });
      });
      queryClient.invalidateQueries({ queryKey: INVOICES_QUERY_KEYS.lists() });
      queryClient.invalidateQueries({ queryKey: INVOICES_QUERY_KEYS.stats() });
      queryClient.invalidateQueries({
        queryKey: INVOICES_QUERY_KEYS.revenue(),
      });
    },
  });

  return {
    // Query data
    invoices: invoices || [],
    isLoading,
    isFetching,
    isStale,
    error,
    refetch,

    // Specialized hooks
    useInvoice,
    usePendingInvoices,
    useRecentInvoices,
    useInvoicesByUser,
    useRevenueStats,
    useInvoiceStats,

    // Basic mutations
    createInvoice: {
      mutate: createInvoice.mutate,
      mutateAsync: createInvoice.mutateAsync,
      isPending: createInvoice.isPending,
      error: createInvoice.error,
      isSuccess: createInvoice.isSuccess,
    },

    updateInvoice: {
      mutate: updateInvoice.mutate,
      mutateAsync: updateInvoice.mutateAsync,
      isPending: updateInvoice.isPending,
      error: updateInvoice.error,
      isSuccess: updateInvoice.isSuccess,
    },

    deleteInvoice: {
      mutate: deleteInvoice.mutate,
      mutateAsync: deleteInvoice.mutateAsync,
      isPending: deleteInvoice.isPending,
      error: deleteInvoice.error,
      isSuccess: deleteInvoice.isSuccess,
    },

    // Status change mutations
    markAsPaid: {
      mutate: markAsPaid.mutate,
      mutateAsync: markAsPaid.mutateAsync,
      isPending: markAsPaid.isPending,
      error: markAsPaid.error,
      isSuccess: markAsPaid.isSuccess,
    },

    markAsFailed: {
      mutate: markAsFailed.mutate,
      mutateAsync: markAsFailed.mutateAsync,
      isPending: markAsFailed.isPending,
      error: markAsFailed.error,
      isSuccess: markAsFailed.isSuccess,
    },

    processRefund: {
      mutate: processRefund.mutate,
      mutateAsync: processRefund.mutateAsync,
      isPending: processRefund.isPending,
      error: processRefund.error,
      isSuccess: processRefund.isSuccess,
    },

    // Bulk operations
    markManyAsPaid: {
      mutate: markManyAsPaid.mutate,
      mutateAsync: markManyAsPaid.mutateAsync,
      isPending: markManyAsPaid.isPending,
      error: markManyAsPaid.error,
      isSuccess: markManyAsPaid.isSuccess,
    },

    deleteManyInvoices: {
      mutate: deleteManyInvoices.mutate,
      mutateAsync: deleteManyInvoices.mutateAsync,
      isPending: deleteManyInvoices.isPending,
      error: deleteManyInvoices.error,
      isSuccess: deleteManyInvoices.isSuccess,
    },

    // Utilities
    invalidateInvoices: (forceRefetch = false) =>
      queryClient.invalidateQueries({
        queryKey: INVOICES_QUERY_KEYS.lists(),
        refetchType: forceRefetch ? "active" : "none",
      }),

    refreshInvoices: () => refetch(),

    // Query keys for external use
    queryKeys: INVOICES_QUERY_KEYS,
  };
};
