/**
 * 🔍 Shared Hook - useBookings
 *
 * Hook partagé pour récupérer les données des réservations.
 * Utilisé dans plusieurs pages : Financial Overview, Analytics, User Details, Properties.
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
 * const { data: bookings, isLoading } = useBookings();
 *
 * // Avec filtres
 * const { data: activeBookings } = useBookings({ status: 'confirmed' });
 * const { data: userBookings } = useBookings({ userId: '123' });
 * ```
 */

import { useQuery, UseQueryOptions } from '@tanstack/react-query';
import { supabase } from '@/core/config/supabase';
import type { Database } from '@/types/database.types';

// Types
type Booking = Database['public']['Tables']['bookings']['Row'];

export interface BookingFilters {
  status?: string;
  userId?: string;
  propertyId?: string;
  startDate?: string;
  endDate?: string;
}

// ========================================
// QUERY KEYS - CENTRALISÉES
// ========================================

/**
 * Query keys pour le cache des bookings
 * Utilisez ces clés dans TOUTES les features pour garantir la cohérence du cache
 */
export const BOOKINGS_QUERY_KEYS = {
  all: ['bookings'] as const,
  lists: () => [...BOOKINGS_QUERY_KEYS.all, 'list'] as const,
  list: (filters?: BookingFilters) => [...BOOKINGS_QUERY_KEYS.lists(), { filters }] as const,
  details: () => [...BOOKINGS_QUERY_KEYS.all, 'detail'] as const,
  detail: (id: string) => [...BOOKINGS_QUERY_KEYS.details(), id] as const,
  stats: () => [...BOOKINGS_QUERY_KEYS.all, 'stats'] as const,
  byUser: (userId: string) => [...BOOKINGS_QUERY_KEYS.all, 'by-user', userId] as const,
  byProperty: (propertyId: string) =>
    [...BOOKINGS_QUERY_KEYS.all, 'by-property', propertyId] as const,
};

// ========================================
// HOOKS
// ========================================

/**
 * Hook pour récupérer la liste des réservations avec filtres optionnels
 *
 * @param filters - Filtres optionnels (status, userId, propertyId, dates, etc.)
 * @param options - Options React Query (enabled, staleTime, etc.)
 */
export const useBookings = (
  filters?: BookingFilters,
  options?: Omit<UseQueryOptions<Booking[], Error>, 'queryKey' | 'queryFn'>
) => {
  return useQuery<Booking[], Error>({
    queryKey: BOOKINGS_QUERY_KEYS.list(filters),
    queryFn: async () => {
      let query = supabase.from('bookings').select(`
        *,
        traveler:profiles!traveler_id(id, full_name, email),
        property:properties!property_id(id, title, owner_id)
      `);

      // Appliquer les filtres
      if (filters?.status) {
        query = query.eq('status', filters.status);
      }
      if (filters?.userId) {
        query = query.eq('user_id', filters.userId);
      }
      if (filters?.propertyId) {
        query = query.eq('property_id', filters.propertyId);
      }
      if (filters?.startDate) {
        query = query.gte('check_in', filters.startDate);
      }
      if (filters?.endDate) {
        query = query.lte('check_out', filters.endDate);
      }

      const { data, error } = await query.order('created_at', { ascending: false });

      if (error) {
        throw new Error(`Erreur lors de la récupération des réservations: ${error.message}`);
      }

      return data || [];
    },
    staleTime: 3 * 60 * 1000, // 3 minutes
    gcTime: 10 * 60 * 1000,
    refetchOnWindowFocus: false,
    ...options,
  });
};

/**
 * Hook pour récupérer une réservation spécifique par ID
 *
 * @param id - ID de la réservation
 * @param options - Options React Query
 */
export const useBooking = (
  id: string | undefined,
  options?: Omit<UseQueryOptions<Booking | null, Error>, 'queryKey' | 'queryFn'>
) => {
  return useQuery<Booking | null, Error>({
    queryKey: BOOKINGS_QUERY_KEYS.detail(id || ''),
    queryFn: async () => {
      if (!id) return null;

      const { data, error } = await supabase.from('bookings').select('*').eq('id', id).single();

      if (error && error.code !== 'PGRST116') {
        throw new Error(`Erreur lors de la récupération de la réservation: ${error.message}`);
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
 * Hook pour récupérer les réservations d'un utilisateur spécifique
 *
 * @param userId - ID de l'utilisateur
 * @param options - Options React Query
 */
export const useUserBookings = (
  userId: string | undefined,
  options?: Omit<UseQueryOptions<Booking[], Error>, 'queryKey' | 'queryFn'>
) => {
  return useQuery<Booking[], Error>({
    queryKey: BOOKINGS_QUERY_KEYS.byUser(userId || ''),
    queryFn: async () => {
      if (!userId) return [];

      const { data, error } = await supabase
        .from('bookings')
        .select('*')
        .eq('user_id', userId)
        .order('created_at', { ascending: false });

      if (error) {
        throw new Error(
          `Erreur lors de la récupération des réservations de l'utilisateur: ${error.message}`
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
 * Hook pour récupérer les réservations d'une propriété spécifique
 *
 * @param propertyId - ID de la propriété
 * @param options - Options React Query
 */
export const usePropertyBookings = (
  propertyId: string | undefined,
  options?: Omit<UseQueryOptions<Booking[], Error>, 'queryKey' | 'queryFn'>
) => {
  return useQuery<Booking[], Error>({
    queryKey: BOOKINGS_QUERY_KEYS.byProperty(propertyId || ''),
    queryFn: async () => {
      if (!propertyId) return [];

      const { data, error } = await supabase
        .from('bookings')
        .select('*')
        .eq('property_id', propertyId)
        .order('created_at', { ascending: false });

      if (error) {
        throw new Error(
          `Erreur lors de la récupération des réservations de la propriété: ${error.message}`
        );
      }

      return data || [];
    },
    enabled: !!propertyId && options?.enabled !== false,
    staleTime: 3 * 60 * 1000,
    gcTime: 10 * 60 * 1000,
    ...options,
  });
};

/**
 * Hook pour récupérer les statistiques des réservations
 */
export const useBookingStats = (
  options?: Omit<UseQueryOptions<BookingStats, Error>, 'queryKey' | 'queryFn'>
) => {
  return useQuery<BookingStats, Error>({
    queryKey: BOOKINGS_QUERY_KEYS.stats(),
    queryFn: async () => {
      const [totalResult, confirmedResult, pendingResult, cancelledResult] = await Promise.all([
        supabase.from('bookings').select('total_amount', { count: 'exact' }),
        supabase
          .from('bookings')
          .select('total_amount', { count: 'exact' })
          .eq('status', 'confirmed'),
        supabase
          .from('bookings')
          .select('id', { count: 'exact', head: true })
          .eq('status', 'pending'),
        supabase
          .from('bookings')
          .select('id', { count: 'exact', head: true })
          .eq('status', 'cancelled'),
      ]);

      const totalAmount = totalResult.data?.reduce((sum, b) => sum + (b.total_amount || 0), 0) || 0;
      const confirmedAmount =
        confirmedResult.data?.reduce((sum, b) => sum + (b.total_amount || 0), 0) || 0;

      return {
        total: totalResult.count || 0,
        confirmed: confirmedResult.count || 0,
        pending: pendingResult.count || 0,
        cancelled: cancelledResult.count || 0,
        totalAmount,
        confirmedAmount,
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

export interface BookingStats {
  total: number;
  confirmed: number;
  pending: number;
  cancelled: number;
  totalAmount: number;
  confirmedAmount: number;
}

// ========================================
// EXPORTS
// ========================================

export type { Booking };
