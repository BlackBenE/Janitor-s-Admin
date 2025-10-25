/**
 * 🔍 Shared Hook - useSubscriptions
 *
 * Hook partagé pour récupérer les données des abonnements.
 */

import { useQuery, UseQueryOptions } from '@tanstack/react-query';
import { supabase } from '@/core/config/supabase';
import type { Database } from '@/types/database.types';

// Types
type Subscription = Database['public']['Tables']['subscriptions']['Row'];

export interface SubscriptionFilters {
  status?: string;
  userId?: string;
}

// Query Keys
export const SUBSCRIPTIONS_QUERY_KEYS = {
  all: ['subscriptions'] as const,
  lists: () => [...SUBSCRIPTIONS_QUERY_KEYS.all, 'list'] as const,
  list: (filters?: SubscriptionFilters) =>
    [...SUBSCRIPTIONS_QUERY_KEYS.lists(), { filters }] as const,
  details: () => [...SUBSCRIPTIONS_QUERY_KEYS.all, 'detail'] as const,
  detail: (id: string) => [...SUBSCRIPTIONS_QUERY_KEYS.details(), id] as const,
};

/**
 * Hook pour récupérer la liste des abonnements
 */
export const useSubscriptions = (
  filters?: SubscriptionFilters,
  options?: Omit<UseQueryOptions<Subscription[], Error>, 'queryKey' | 'queryFn'>
) => {
  return useQuery<Subscription[], Error>({
    queryKey: SUBSCRIPTIONS_QUERY_KEYS.list(filters),
    queryFn: async () => {
      let query = supabase.from('subscriptions').select('*');

      // Appliquer les filtres
      if (filters?.status) {
        query = query.eq('status', filters.status);
      }
      if (filters?.userId) {
        query = query.eq('user_id', filters.userId);
      }

      const { data, error } = await query.order('created_at', { ascending: false });

      if (error) {
        throw new Error(`Erreur lors de la récupération des abonnements: ${error.message}`);
      }

      return data || [];
    },
    staleTime: 5 * 60 * 1000, // 5 minutes
    gcTime: 10 * 60 * 1000,
    refetchOnWindowFocus: false,
    ...options,
  });
};

/**
 * Hook pour récupérer un abonnement par ID
 */
export const useSubscription = (
  id: string,
  options?: Omit<UseQueryOptions<Subscription | null, Error>, 'queryKey' | 'queryFn'>
) => {
  return useQuery<Subscription | null, Error>({
    queryKey: SUBSCRIPTIONS_QUERY_KEYS.detail(id),
    queryFn: async () => {
      const { data, error } = await supabase
        .from('subscriptions')
        .select('*')
        .eq('id', id)
        .single();

      if (error) {
        throw new Error(`Erreur lors de la récupération de l'abonnement: ${error.message}`);
      }

      return data;
    },
    enabled: !!id,
    staleTime: 5 * 60 * 1000,
    gcTime: 10 * 60 * 1000,
    ...options,
  });
};
