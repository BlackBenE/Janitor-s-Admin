/**
 * 🔍 Payment Queries Hook
 *
 * Centralise toutes les queries de récupération de données de paiements
 * Inspiré du pattern useUserQueries.ts de UserManagement
 */

import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/core/config/supabase';
import type { PaymentWithDetails } from '../../../types/payments';
import { calculateRevenue } from '@/core/services/financialCalculations.service';

// Query keys pour la gestion du cache
export const PAYMENT_QUERY_KEYS = {
  all: ['payments'] as const,
  lists: () => [...PAYMENT_QUERY_KEYS.all, 'list'] as const,
  list: (filters?: any) => [...PAYMENT_QUERY_KEYS.lists(), filters] as const,
  details: () => [...PAYMENT_QUERY_KEYS.all, 'detail'] as const,
  detail: (id: string) => [...PAYMENT_QUERY_KEYS.details(), id] as const,
  stats: () => [...PAYMENT_QUERY_KEYS.all, 'stats'] as const,
};

/**
 * Hook pour récupérer un paiement par ID avec toutes ses relations
 */
export const usePayment = (paymentId?: string, options?: { enabled?: boolean }) => {
  return useQuery({
    queryKey: PAYMENT_QUERY_KEYS.detail(paymentId || ''),
    queryFn: async () => {
      if (!paymentId) return null;

      const { data, error } = await supabase
        .from('payments')
        .select(
          `
          *,
          payer:profiles!payments_payer_id_fkey (
            id,
            first_name,
            last_name,
            email,
            avatar_url,
            deleted_at,
            account_locked
          ),
          payee:profiles!payments_payee_id_fkey (
            id,
            first_name,
            last_name,
            email,
            avatar_url,
            deleted_at,
            account_locked
          ),
          booking:bookings (
            id,
            check_in,
            check_out,
            total_amount,
            status,
            property:properties (
              id,
              title,
              address,
              city
            )
          ),
          service_request:service_requests (
            id,
            requested_date,
            scheduled_date,
            status,
            total_amount,
            address,
            service:services (
              id,
              name,
              category,
              base_price
            )
          )
        `
        )
        .eq('id', paymentId)
        .single();

      if (error && error.code !== 'PGRST116') {
        throw new Error(`Erreur lors de la récupération du paiement: ${error.message}`);
      }

      return data;
    },
    enabled: options?.enabled !== false && !!paymentId,
    staleTime: 2 * 60 * 1000, // 2 minutes
    gcTime: 5 * 60 * 1000, // 5 minutes
  });
};

/**
 * Hook pour récupérer tous les paiements avec leurs relations
 */
export const usePayments = (options?: {
  filters?: any;
  limit?: number;
  orderBy?: string;
  enabled?: boolean;
  refetchOnWindowFocus?: boolean;
}) => {
  return useQuery({
    queryKey: PAYMENT_QUERY_KEYS.list(options?.filters),
    queryFn: async () => {

      let query = supabase.from('payments').select(`
          *,
          payer:profiles!payments_payer_id_fkey (
            id,
            first_name,
            last_name,
            email,
            avatar_url,
            deleted_at,
            account_locked
          ),
          payee:profiles!payments_payee_id_fkey (
            id,
            first_name,
            last_name,
            email,
            avatar_url,
            deleted_at,
            account_locked
          ),
          booking:bookings (
            id,
            check_in,
            check_out,
            total_amount,
            status,
            property:properties (
              id,
              title,
              address,
              city
            )
          ),
          service_request:service_requests (
            id,
            requested_date,
            scheduled_date,
            status,
            total_amount,
            address,
            service:services (
              id,
              name,
              category,
              base_price
            )
          )
        `);

      // Appliquer les filtres si fournis
      if (options?.filters) {
        Object.entries(options.filters).forEach(([key, value]) => {
          if (value !== undefined && value !== null && value !== '') {
            query = query.eq(key, value);
          }
        });
      }

      // Appliquer l'ordre
      if (options?.orderBy) {
        query = query.order(options.orderBy, { ascending: false });
      } else {
        query = query.order('created_at', { ascending: false });
      }

      // Appliquer la limite
      if (options?.limit) {
        query = query.limit(options.limit);
      }

      const { data, error } = await query;

      if (error) {
        console.error('❌ Error fetching payments:', error);
        throw new Error(`Erreur lors de la récupération des paiements: ${error.message}`);
      }

      if (data && data.length > 0) {
      }

      return (data || []) as PaymentWithDetails[];
    },
    enabled: options?.enabled !== false,
    staleTime: 3 * 60 * 1000, // 3 minutes
    gcTime: 10 * 60 * 1000, // 10 minutes
    refetchOnWindowFocus: options?.refetchOnWindowFocus ?? false,
    retry: 2,
  });
};

/**
 * Hook pour récupérer les statistiques des paiements
 */
export const usePaymentStats = (options?: { enabled?: boolean }) => {
  return useQuery({
    queryKey: PAYMENT_QUERY_KEYS.stats(),
    queryFn: async () => {

      // Récupérer les statistiques avec payment_type pour le calcul des revenus
      const { data: payments, error } = await supabase
        .from('payments')
        .select('id, amount, status, created_at, processed_at, payment_type');

      if (error) {
        throw new Error(`Erreur lors du calcul des statistiques: ${error.message}`);
      }

      const paymentsArray = payments || [];

      // Calculer les stats avec la bonne logique
      const totalPayments = paymentsArray.length;

      // Paiements payés : "paid" ET "succeeded"
      const paidPayments = paymentsArray.filter(
        (p) => p.status === 'paid' || p.status === 'succeeded'
      ).length;

      // En attente : tous sauf payés, remboursés, échoués
      const pendingPayments = paymentsArray.filter(
        (p) => !['paid', 'succeeded', 'refunded', 'failed'].includes(p.status || '')
      ).length;

      const refundedPayments = paymentsArray.filter((p) => p.status === 'refunded').length;

      const failedPayments = paymentsArray.filter((p) => p.status === 'failed').length;

      // Revenue du mois en cours avec logique métier
      const now = new Date();
      const paidThisMonth = paymentsArray
        .filter((p) => p.status === 'paid' || p.status === 'succeeded')
        .filter((p) => {
          const createdDate = new Date(p.created_at || '');
          return (
            createdDate.getMonth() === now.getMonth() &&
            createdDate.getFullYear() === now.getFullYear()
          );
        });

      const monthlyRevenue = paidThisMonth.reduce((sum, p) => {
        const amount = p.amount || 0;

        // Utilise le service centralisé pour les règles de calcul
        // 20% pour les bookings, 100% pour les subscriptions
        const paymentType = p.payment_type || 'other';
        const revenue = calculateRevenue(amount, paymentType as any);

        return sum + revenue;
      }, 0);


      // Montant moyen
      const totalAmount = paymentsArray.reduce((sum, p) => sum + (p.amount || 0), 0);
      const averageAmount = totalPayments > 0 ? totalAmount / totalPayments : 0;

      const stats = {
        totalPayments,
        paidPayments,
        pendingPayments,
        refundedPayments,
        failedPayments,
        monthlyRevenue,
        averageAmount,
        totalAmount,
      };


      return stats;
    },
    enabled: options?.enabled !== false,
    staleTime: 5 * 60 * 1000, // 5 minutes
    gcTime: 15 * 60 * 1000, // 15 minutes
  });
};
