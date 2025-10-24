import { useMutation, useQueryClient } from "@tanstack/react-query";
import { dataProvider } from "../../../providers/dataProvider";
import { supabase } from "@/core/config/supabase";
import { PaymentWithDetails } from "../../../types/payments";
import { Database } from "../../../types";

// Import des nouveaux hooks de queries
import {
  usePayments as usePaymentsQuery,
  usePayment,
  usePaymentStats as usePaymentStatsQuery,
  PAYMENT_QUERY_KEYS,
} from "./usePaymentQueries";

type PaymentRow = Database["public"]["Tables"]["payments"]["Row"];
type PaymentInsert = Database["public"]["Tables"]["payments"]["Insert"];
type PaymentUpdate = Database["public"]["Tables"]["payments"]["Update"];

/**
 * Hook principal pour les paiements - style UserManagement
 * Combine les queries et mutations
 */
export const usePayments = (options?: {
  filters?: Partial<PaymentRow>;
  limit?: number;
  orderBy?: keyof PaymentRow;
  enabled?: boolean;
  refetchOnWindowFocus?: boolean;
  refetchInterval?: number;
}) => {
  const queryClient = useQueryClient();

  // Utiliser le hook de query dédié (comme dans UserManagement)
  const {
    data: payments = [],
    isLoading,
    isFetching,
    error,
    refetch,
  } = usePaymentsQuery({
    filters: options?.filters,
    limit: options?.limit,
    orderBy: options?.orderBy as string,
    enabled: options?.enabled,
    refetchOnWindowFocus: options?.refetchOnWindowFocus,
  });

  // Utiliser le hook de stats dédié
  const { data: stats } = usePaymentStatsQuery({
    enabled: options?.enabled,
  });

  // Update payment status mutation
  const updatePaymentMutation = useMutation({
    mutationFn: async ({
      id,
      updates,
    }: {
      id: string;
      updates: PaymentUpdate;
    }) => {
      console.log("🔄 Updating payment:", id, updates);
      const { data, error } = await supabase
        .from("payments")
        .update(updates)
        .eq("id", id)
        .select()
        .single();

      if (error) {
        throw new Error(`Error updating payment: ${error.message}`);
      }

      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: PAYMENT_QUERY_KEYS.all });
    },
  });

  // Create payment mutation
  const createPaymentMutation = useMutation({
    mutationFn: async (payment: PaymentInsert) => {
      console.log("➕ Creating payment:", payment);
      const { data, error } = await supabase
        .from("payments")
        .insert(payment)
        .select()
        .single();

      if (error) {
        throw new Error(`Error creating payment: ${error.message}`);
      }

      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: PAYMENT_QUERY_KEYS.all });
    },
  });

  // Delete payments mutation
  const deletePaymentsMutation = useMutation({
    mutationFn: async (paymentIds: string[]) => {
      console.log("🗑️ Deleting payments:", paymentIds);
      const { error } = await supabase
        .from("payments")
        .delete()
        .in("id", paymentIds);

      if (error) {
        throw new Error(`Error deleting payments: ${error.message}`);
      }

      return paymentIds;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: PAYMENT_QUERY_KEYS.all });
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
    stats: stats || {
      totalPayments: 0,
      paidPayments: 0,
      pendingPayments: 0,
      refundedPayments: 0,
      failedPayments: 0,
      monthlyRevenue: 0,
      averageAmount: 0,
      totalAmount: 0,
    },
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

// Export also individual hooks for flexibility (like UserManagement does)
export { usePayment, usePaymentStatsQuery as usePaymentStats };
