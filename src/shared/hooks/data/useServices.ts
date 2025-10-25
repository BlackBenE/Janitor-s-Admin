/**
 * 🔍 Shared Hook - useServices
 *
 * Hook partagé pour récupérer les données des services.
 * Utilisé dans plusieurs pages : Services Catalog, Analytics, Service Requests.
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
 * const { data: services, isLoading } = useServices();
 *
 * // Avec filtres
 * const { data: activeServices } = useServices({ is_active: true });
 * const { data: vipServices } = useServices({ is_vip_only: true });
 * ```
 */

import { useQuery, UseQueryOptions } from '@tanstack/react-query';
import { supabase } from '@/core/config/supabase';
import type { Database } from '@/types/database.types';

// Types
type Service = Database['public']['Tables']['services']['Row'];

export interface ServiceFilters {
  is_active?: boolean;
  is_vip_only?: boolean;
  category?: string;
  search?: string;
}

// ========================================
// QUERY KEYS - CENTRALISÉES
// ========================================

/**
 * Query keys pour le cache des services
 * Utilisez ces clés dans TOUTES les features pour garantir la cohérence du cache
 */
export const SERVICES_QUERY_KEYS = {
  all: ['services'] as const,
  lists: () => [...SERVICES_QUERY_KEYS.all, 'list'] as const,
  list: (filters?: ServiceFilters) => [...SERVICES_QUERY_KEYS.lists(), { filters }] as const,
  details: () => [...SERVICES_QUERY_KEYS.all, 'detail'] as const,
  detail: (id: string) => [...SERVICES_QUERY_KEYS.details(), id] as const,
  stats: () => [...SERVICES_QUERY_KEYS.all, 'stats'] as const,
};

// ========================================
// HOOKS
// ========================================

/**
 * Hook pour récupérer la liste des services avec filtres optionnels
 *
 * @param filters - Filtres optionnels (is_active, is_vip_only, category, etc.)
 * @param options - Options React Query (enabled, staleTime, etc.)
 */
export const useServices = (
  filters?: ServiceFilters,
  options?: Omit<UseQueryOptions<Service[], Error>, 'queryKey' | 'queryFn'>
) => {
  return useQuery<Service[], Error>({
    queryKey: SERVICES_QUERY_KEYS.list(filters),
    queryFn: async () => {
      let query = supabase.from('services').select('*');

      // Appliquer les filtres
      if (filters?.is_active !== undefined) {
        query = query.eq('is_active', filters.is_active);
      }
      if (filters?.is_vip_only !== undefined) {
        query = query.eq('is_vip_only', filters.is_vip_only);
      }
      if (filters?.category) {
        query = query.eq('category', filters.category);
      }
      if (filters?.search) {
        query = query.or(`name.ilike.%${filters.search}%,description.ilike.%${filters.search}%`);
      }

      const { data, error } = await query.order('name', { ascending: true });

      if (error) {
        throw new Error(`Erreur lors de la récupération des services: ${error.message}`);
      }

      return data || [];
    },
    staleTime: 10 * 60 * 1000, // 10 minutes - services sont stables
    gcTime: 30 * 60 * 1000, // 30 minutes
    refetchOnWindowFocus: false,
    ...options,
  });
};

/**
 * Hook pour récupérer un service spécifique par ID
 *
 * @param id - ID du service
 * @param options - Options React Query
 */
export const useService = (
  id: string | undefined,
  options?: Omit<UseQueryOptions<Service | null, Error>, 'queryKey' | 'queryFn'>
) => {
  return useQuery<Service | null, Error>({
    queryKey: SERVICES_QUERY_KEYS.detail(id || ''),
    queryFn: async () => {
      if (!id) return null;

      const { data, error } = await supabase.from('services').select('*').eq('id', id).single();

      if (error && error.code !== 'PGRST116') {
        throw new Error(`Erreur lors de la récupération du service: ${error.message}`);
      }

      return data;
    },
    enabled: !!id && options?.enabled !== false,
    staleTime: 10 * 60 * 1000,
    gcTime: 30 * 60 * 1000,
    ...options,
  });
};

/**
 * Hook pour récupérer les statistiques des services
 */
export const useServiceStats = (
  options?: Omit<UseQueryOptions<ServiceStats, Error>, 'queryKey' | 'queryFn'>
) => {
  return useQuery<ServiceStats, Error>({
    queryKey: SERVICES_QUERY_KEYS.stats(),
    queryFn: async () => {
      const [totalResult, activeResult, vipResult, inactiveResult] = await Promise.all([
        supabase.from('services').select('id', { count: 'exact', head: true }),
        supabase
          .from('services')
          .select('id', { count: 'exact', head: true })
          .eq('is_active', true),
        supabase
          .from('services')
          .select('id', { count: 'exact', head: true })
          .eq('is_vip_only', true),
        supabase
          .from('services')
          .select('id', { count: 'exact', head: true })
          .eq('is_active', false),
      ]);

      return {
        total: totalResult.count || 0,
        active: activeResult.count || 0,
        vip: vipResult.count || 0,
        inactive: inactiveResult.count || 0,
      };
    },
    staleTime: 5 * 60 * 1000, // 5 minutes pour les stats
    gcTime: 10 * 60 * 1000,
    ...options,
  });
};

// ========================================
// TYPES
// ========================================

export interface ServiceStats {
  total: number;
  active: number;
  vip: number;
  inactive: number;
}

// ========================================
// EXPORTS
// ========================================

export type { Service };
