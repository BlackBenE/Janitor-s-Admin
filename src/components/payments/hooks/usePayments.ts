import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { dataProvider } from "../../../providers/dataProvider";
import { Database } from "../../../types/database.types";
import { PaymentWithDetails, PaymentStats } from "../../../types/payments";

type PaymentRow = Database["public"]["Tables"]["payments"]["Row"];
type PaymentInsert = Database["public"]["Tables"]["payments"]["Insert"];
type PaymentUpdate = Database["public"]["Tables"]["payments"]["Update"];

// Query keys for cache management
const PAYMENTS_QUERY_KEYS = {
  all: ["payments"] as const,
  lists: () => [...PAYMENTS_QUERY_KEYS.all, "list"] as const,
  list: (filters?: Partial<PaymentRow>) =>
    [...PAYMENTS_QUERY_KEYS.lists(), { filters }] as const,
  details: () => [...PAYMENTS_QUERY_KEYS.all, "detail"] as const,
  detail: (id: string) => [...PAYMENTS_QUERY_KEYS.details(), id] as const,
  stats: () => [...PAYMENTS_QUERY_KEYS.all, "stats"] as const,
};

export const usePayments = (options?: {
  filters?: Partial<PaymentRow>;
  limit?: number;
  orderBy?: keyof PaymentRow;
  enabled?: boolean;
  refetchOnWindowFocus?: boolean;
  refetchInterval?: number;
}) => {
  const queryClient = useQueryClient();

  // Get all payments with optional filtering
  const {
    data: payments = [],
    isLoading,
    isFetching,
    error,
    refetch,
  } = useQuery({
    queryKey: PAYMENTS_QUERY_KEYS.list(options?.filters),
    queryFn: async () => {
      // Fetch real payments data from Supabase
      console.log("🔍 Fetching payments data from Supabase...");

      const mockPayments: PaymentWithDetails[] = [
        {
          id: "pay_001",
          amount: 1200,
          booking_id: "booking_001",
          created_at: "2024-10-01T10:00:00Z",
          payee_id: "user_002",
          payer_id: "user_001",
          payment_type: "booking",
          processed_at: "2024-10-01T10:05:00Z",
          service_request_id: null,
          status: "paid",
          stripe_charge_id: "ch_123456789",
          stripe_payment_intent_id: "pi_123456789",
          payer: {
            first_name: "Jean",
            last_name: "Dupont",
            email: "jean.dupont@email.com",
          },
          payee: {
            first_name: "Marie",
            last_name: "Martin",
            email: "marie.martin@email.com",
          },
          booking: {
            id: "booking_001",
            property: {
              title: "Luxury Apartment Paris",
              address: "123 Rue de la Paix",
              city: "Paris",
            },
          },
        },
        {
          id: "pay_002",
          amount: 850,
          booking_id: "booking_002",
          created_at: "2024-10-02T14:30:00Z",
          payee_id: "user_003",
          payer_id: "user_004",
          payment_type: "service",
          processed_at: null,
          service_request_id: "service_001",
          status: "pending",
          stripe_charge_id: null,
          stripe_payment_intent_id: "pi_987654321",
          payer: {
            first_name: "Pierre",
            last_name: "Moreau",
            email: "pierre.moreau@email.com",
          },
          payee: {
            first_name: "Sophie",
            last_name: "Leroux",
            email: "sophie.leroux@email.com",
          },
          service_request: {
            id: "service_001",
          },
        },
        {
          id: "pay_003",
          amount: 2100,
          booking_id: null,
          created_at: "2024-09-28T09:15:00Z",
          payee_id: "user_005",
          payer_id: "user_006",
          payment_type: "refund",
          processed_at: "2024-09-28T09:20:00Z",
          service_request_id: "service_002",
          status: "refunded",
          stripe_charge_id: "ch_refund_123",
          stripe_payment_intent_id: "pi_refund_456",
          payer: {
            first_name: "Alice",
            last_name: "Dubois",
            email: "alice.dubois@email.com",
          },
          payee: {
            first_name: "Bob",
            last_name: "Martin",
            email: "bob.martin@email.com",
          },
        },
      ];

      // Use real Supabase data instead of mock data
      const response = await dataProvider.getList(
        "payments",
        {
          limit: options?.limit,
          orderBy: options?.orderBy as keyof PaymentRow,
        },
        options?.filters
      );

      if (!response.success) {
        throw response.error;
      }

      console.log("🎯 Real payments loaded:", response.data?.length || 0);
      return response.data as PaymentWithDetails[];

      // Mock data kept for reference (now disabled):
      /*
      console.log("🎯 Mock payments loaded:", mockPayments.length);
      return mockPayments;
      */
    },
    enabled: options?.enabled ?? true,
    refetchOnWindowFocus: options?.refetchOnWindowFocus ?? false,
    refetchInterval: options?.refetchInterval,
    staleTime: 5 * 60 * 1000, // 5 minutes
  });

  // Calculate statistics
  const stats: PaymentStats = {
    totalPayments: payments.length,
    paidPayments: payments.filter((p) => p.status === "paid").length,
    pendingPayments: payments.filter((p) => p.status === "pending").length,
    refundedPayments: payments.filter((p) => p.status === "refunded").length,
    monthlyRevenue: payments
      .filter((p) => p.status === "paid" && p.processed_at)
      .filter((p) => {
        const processedDate = new Date(p.processed_at!);
        const now = new Date();
        return (
          processedDate.getMonth() === now.getMonth() &&
          processedDate.getFullYear() === now.getFullYear()
        );
      })
      .reduce((sum, p) => sum + p.amount, 0),
    averageAmount:
      payments.length > 0
        ? payments.reduce((sum, p) => sum + p.amount, 0) / payments.length
        : 0,
  };

  // Update payment status mutation
  const updatePaymentMutation = useMutation({
    mutationFn: async ({
      id,
      updates,
    }: {
      id: string;
      updates: PaymentUpdate;
    }) => {
      const response = await dataProvider.update("payments", id, updates);
      if (!response.success) {
        throw response.error;
      }
      return response.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: PAYMENTS_QUERY_KEYS.all });
    },
  });

  // Create payment mutation
  const createPaymentMutation = useMutation({
    mutationFn: async (payment: PaymentInsert) => {
      const response = await dataProvider.create("payments", payment);
      if (!response.success) {
        throw response.error;
      }
      return response.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: PAYMENTS_QUERY_KEYS.all });
    },
  });

  // Delete payments mutation
  const deletePaymentsMutation = useMutation({
    mutationFn: async (paymentIds: string[]) => {
      const response = await dataProvider.deleteMany("payments", paymentIds);
      if (!response.success) {
        throw response.error;
      }
      return paymentIds;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: PAYMENTS_QUERY_KEYS.all });
    },
  });

  // Helper functions
  const updatePayment = (id: string, updates: PaymentUpdate) => {
    return updatePaymentMutation.mutateAsync({ id, updates });
  };

  const createPayment = (payment: PaymentInsert) => {
    return createPaymentMutation.mutateAsync(payment);
  };

  const deleteManyPayments = (paymentIds: string[]) => {
    return deletePaymentsMutation.mutateAsync(paymentIds);
  };

  return {
    payments,
    stats,
    isLoading,
    isFetching,
    error,
    refetch,
    // Mutations
    updatePayment,
    createPayment,
    deleteManyPayments,
    // Mutation states
    isUpdating: updatePaymentMutation.isPending,
    isCreating: createPaymentMutation.isPending,
    isDeleting: deletePaymentsMutation.isPending,
  };
};
