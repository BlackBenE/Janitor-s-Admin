/**
 * 🔍 Shared Hook - useServiceRequests
 *
 * Hook partagé pour récupérer les demandes de service.
 */

import { useQuery, UseQueryOptions } from '@tanstack/react-query';
import { supabase } from '@/core/config/supabase';
import type { Database } from '@/types/database.types';

// Types
type ServiceRequest = Database['public']['Tables']['service_requests']['Row'];

export interface ServiceRequestFilters {
  status?: string;
  userId?: string;
  serviceId?: string;
}

// Query Keys
export const SERVICE_REQUESTS_QUERY_KEYS = {
  all: ['service_requests'] as const,
  lists: () => [...SERVICE_REQUESTS_QUERY_KEYS.all, 'list'] as const,
  list: (filters?: ServiceRequestFilters) =>
    [...SERVICE_REQUESTS_QUERY_KEYS.lists(), { filters }] as const,
  details: () => [...SERVICE_REQUESTS_QUERY_KEYS.all, 'detail'] as const,
  detail: (id: string) => [...SERVICE_REQUESTS_QUERY_KEYS.details(), id] as const,
};

/**
 * Hook pour récupérer la liste des demandes de service
 */
export const useServiceRequests = (
  filters?: ServiceRequestFilters,
  options?: Omit<UseQueryOptions<ServiceRequest[], Error>, 'queryKey' | 'queryFn'>
) => {
  return useQuery<ServiceRequest[], Error>({
    queryKey: SERVICE_REQUESTS_QUERY_KEYS.list(filters),
    queryFn: async () => {
      let query = supabase.from('service_requests').select(`
        *,
        service:services!service_id(id, name, is_vip_only)
      `);

      // Appliquer les filtres
      if (filters?.status) {
        query = query.eq('status', filters.status);
      }
      if (filters?.userId) {
        query = query.eq('user_id', filters.userId);
      }
      if (filters?.serviceId) {
        query = query.eq('service_id', filters.serviceId);
      }

      const { data, error } = await query.order('created_at', { ascending: false });

      if (error) {
        throw new Error(`Erreur lors de la récupération des demandes de service: ${error.message}`);
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
 * Hook pour récupérer une demande de service par ID
 */
export const useServiceRequest = (
  id: string,
  options?: Omit<UseQueryOptions<ServiceRequest | null, Error>, 'queryKey' | 'queryFn'>
) => {
  return useQuery<ServiceRequest | null, Error>({
    queryKey: SERVICE_REQUESTS_QUERY_KEYS.detail(id),
    queryFn: async () => {
      const { data, error } = await supabase
        .from('service_requests')
        .select(
          `
          *,
          service:services!service_id(id, name, is_vip_only)
        `
        )
        .eq('id', id)
        .single();

      if (error) {
        throw new Error(
          `Erreur lors de la récupération de la demande de service: ${error.message}`
        );
      }

      return data;
    },
    enabled: !!id,
    staleTime: 3 * 60 * 1000,
    gcTime: 10 * 60 * 1000,
    ...options,
  });
};
