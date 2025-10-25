/**
 * 🔍 Shared Hook - usePayments
 *
 * Hook partagé pour récupérer les données des paiements.
 * Utilisé dans plusieurs pages : Payments, Financial Overview, Analytics, User Details.
 *
 * ✅ Avantages :
 * - Cache global React Query partagé entre toutes les pages
 * - Synchronisation automatique des données
 * - Réduction des requêtes réseau
 * - Invalidation centralisée après mutations
 *
 * @example
 * ```typescript
 * // Dans n'importe quelle page
 * const { data: payments, isLoading } = usePayments();
 *
 * // Avec filtres
 * const { data: completedPayments } = usePayments({ status: 'completed' });
 * const { data: userPayments } = usePayments({ userId: '123' });
 * ```
 */

import { useQuery, UseQueryOptions } from '@tanstack/react-query';
import { supabase } from '@/core/config/supabase';
import type { Database } from '@/types/database.types';

// Types
type Payment = Database['public']['Tables']['payments']['Row'];

export interface PaymentFilters {
  status?: string;
  payment_method?: string;
  userId?: string;
  bookingId?: string;
  startDate?: string;
  endDate?: string;
}

// ========================================
// QUERY KEYS - CENTRALISÉES
// ========================================

/**
 * Query keys pour le cache des payments
 * Utilisez ces clés dans TOUTES les features pour garantir la cohérence du cache
 */
export const PAYMENTS_QUERY_KEYS = {
  all: ['payments'] as const,
  lists: () => [...PAYMENTS_QUERY_KEYS.all, 'list'] as const,
  list: (filters?: PaymentFilters) => [...PAYMENTS_QUERY_KEYS.lists(), { filters }] as const,
  details: () => [...PAYMENTS_QUERY_KEYS.all, 'detail'] as const,
  detail: (id: string) => [...PAYMENTS_QUERY_KEYS.details(), id] as const,
  stats: () => [...PAYMENTS_QUERY_KEYS.all, 'stats'] as const,
  byUser: (userId: string) => [...PAYMENTS_QUERY_KEYS.all, 'by-user', userId] as const,
  byBooking: (bookingId: string) => [...PAYMENTS_QUERY_KEYS.all, 'by-booking', bookingId] as const,
};

// ========================================
// HOOKS
// ========================================

/**
 * Hook pour récupérer la liste des paiements avec filtres optionnels
 *
 * @param filters - Filtres optionnels (status, userId, dates, etc.)
 * @param options - Options React Query (enabled, staleTime, etc.)
 */
export const usePayments = (
  filters?: PaymentFilters,
  options?: Omit<UseQueryOptions<Payment[], Error>, 'queryKey' | 'queryFn'>
) => {
  return useQuery<Payment[], Error>({
    queryKey: PAYMENTS_QUERY_KEYS.list(filters),
    queryFn: async () => {
      let query = supabase.from('payments').select(`
        *,
        payer:profiles!payer_id(id, full_name, email),
        payee:profiles!payee_id(id, full_name, email),
        booking:bookings(id, property_id, check_in, check_out)
      `);

      // Appliquer les filtres
      if (filters?.status) {
        query = query.eq('status', filters.status);
      }
      if (filters?.payment_method) {
        query = query.eq('payment_method', filters.payment_method);
      }
      if (filters?.userId) {
        query = query.eq('user_id', filters.userId);
      }
      if (filters?.bookingId) {
        query = query.eq('booking_id', filters.bookingId);
      }
      if (filters?.startDate) {
        query = query.gte('created_at', filters.startDate);
      }
      if (filters?.endDate) {
        query = query.lte('created_at', filters.endDate);
      }

      const { data, error } = await query.order('created_at', { ascending: false });

      if (error) {
        throw new Error(`Erreur lors de la récupération des paiements: ${error.message}`);
      }

      return data || [];
    },
    staleTime: 3 * 60 * 1000, // 3 minutes - données financières modérément stables
    gcTime: 10 * 60 * 1000,
    refetchOnWindowFocus: false,
    ...options,
  });
};

/**
 * Hook pour récupérer un paiement spécifique par ID
 *
 * @param id - ID du paiement
 * @param options - Options React Query
 */
export const usePayment = (
  id: string | undefined,
  options?: Omit<UseQueryOptions<Payment | null, Error>, 'queryKey' | 'queryFn'>
) => {
  return useQuery<Payment | null, Error>({
    queryKey: PAYMENTS_QUERY_KEYS.detail(id || ''),
    queryFn: async () => {
      if (!id) return null;

      const { data, error } = await supabase.from('payments').select('*').eq('id', id).single();

      if (error && error.code !== 'PGRST116') {
        throw new Error(`Erreur lors de la récupération du paiement: ${error.message}`);
      }

      return data;
    },
    enabled: !!id && options?.enabled !== false,
    staleTime: 3 * 60 * 1000,
    gcTime: 10 * 60 * 1000,
    ...options,
  });
};

/**
 * Hook pour récupérer les paiements d'un utilisateur spécifique
 *
 * @param userId - ID de l'utilisateur
 * @param options - Options React Query
 */
export const useUserPayments = (
  userId: string | undefined,
  options?: Omit<UseQueryOptions<Payment[], Error>, 'queryKey' | 'queryFn'>
) => {
  return useQuery<Payment[], Error>({
    queryKey: PAYMENTS_QUERY_KEYS.byUser(userId || ''),
    queryFn: async () => {
      if (!userId) return [];

      const { data, error } = await supabase
        .from('payments')
        .select('*')
        .eq('user_id', userId)
        .order('created_at', { ascending: false });

      if (error) {
        throw new Error(
          `Erreur lors de la récupération des paiements de l'utilisateur: ${error.message}`
        );
      }

      return data || [];
    },
    enabled: !!userId && options?.enabled !== false,
    staleTime: 3 * 60 * 1000,
    gcTime: 10 * 60 * 1000,
    ...options,
  });
};

/**
 * Hook pour récupérer les statistiques des paiements
 */
export const usePaymentStats = (
  options?: Omit<UseQueryOptions<PaymentStats, Error>, 'queryKey' | 'queryFn'>
) => {
  return useQuery<PaymentStats, Error>({
    queryKey: PAYMENTS_QUERY_KEYS.stats(),
    queryFn: async () => {
      const [totalResult, completedResult, pendingResult, failedResult] = await Promise.all([
        supabase.from('payments').select('amount', { count: 'exact' }),
        supabase.from('payments').select('amount', { count: 'exact' }).eq('status', 'completed'),
        supabase
          .from('payments')
          .select('id', { count: 'exact', head: true })
          .eq('status', 'pending'),
        supabase
          .from('payments')
          .select('id', { count: 'exact', head: true })
          .eq('status', 'failed'),
      ]);

      const totalAmount = totalResult.data?.reduce((sum, p) => sum + (p.amount || 0), 0) || 0;
      const completedAmount =
        completedResult.data?.reduce((sum, p) => sum + (p.amount || 0), 0) || 0;

      return {
        total: totalResult.count || 0,
        completed: completedResult.count || 0,
        pending: pendingResult.count || 0,
        failed: failedResult.count || 0,
        totalAmount,
        completedAmount,
      };
    },
    staleTime: 2 * 60 * 1000, // 2 minutes pour les stats
    gcTime: 5 * 60 * 1000,
    ...options,
  });
};

// ========================================
// TYPES
// ========================================

export interface PaymentStats {
  total: number;
  completed: number;
  pending: number;
  failed: number;
  totalAmount: number;
  completedAmount: number;
}

// ========================================
// EXPORTS
// ========================================

export type { Payment };
