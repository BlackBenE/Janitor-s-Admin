import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/core/config/supabase';

// Interface pour un prestataire avec ses métriques
export interface ProviderWithMetrics {
  id: string;
  first_name: string | null;
  last_name: string | null;
  email: string;
  full_name: string | null;
  phone: string | null;
  avatar_url: string | null;
  created_at: string | null;

  // Métriques calculées
  servicesCount: number;
  activeServicesCount: number;
  totalRequests: number;
  pendingRequests: number;
  completedRequests: number;
  averageRating: number;
  totalRevenue: number;

  // Services du prestataire
  services?: {
    id: string;
    name: string;
    category: string;
    base_price: number;
    is_active: boolean | null;
    description: string | null;
  }[];
}

export interface ProvidersFilters {
  search?: string;
  minServices?: number;
  minRating?: number;
  hasActiveServices?: boolean;
}

// Query Keys pour les providers
export const PROVIDERS_QUERY_KEYS = {
  all: ['providers'] as const,
  lists: () => [...PROVIDERS_QUERY_KEYS.all, 'list'] as const,
  list: (filters: ProvidersFilters) => [...PROVIDERS_QUERY_KEYS.lists(), { filters }] as const,
  details: () => [...PROVIDERS_QUERY_KEYS.all, 'detail'] as const,
  detail: (id: string) => [...PROVIDERS_QUERY_KEYS.details(), id] as const,
  metrics: () => [...PROVIDERS_QUERY_KEYS.all, 'metrics'] as const,
} as const;

/**
 * Hook pour récupérer les prestataires avec leurs métriques
 */
export const useProviders = (options?: {
  filters?: ProvidersFilters;
  limit?: number;
  orderBy?: 'name' | 'servicesCount' | 'totalRequests' | 'averageRating' | 'totalRevenue';
  orderDirection?: 'asc' | 'desc';
  enabled?: boolean;
}) => {
  return useQuery({
    queryKey: PROVIDERS_QUERY_KEYS.list(options?.filters || {}),
    queryFn: async (): Promise<ProviderWithMetrics[]> => {
      // Récupérer les prestataires avec leurs services
      let providersQuery = supabase
        .from('profiles')
        .select(
          `
          id,
          first_name,
          last_name,
          email,
          full_name,
          phone,
          avatar_url,
          created_at,
          services:services!services_provider_id_fkey (
            id,
            name,
            category,
            base_price,
            is_active,
            description
          )
        `
        )
        .eq('role', 'service_provider'); // Filtrer seulement les prestataires de services

      // Application des filtres de base
      if (options?.filters?.search) {
        const search = options.filters.search;
        providersQuery = providersQuery.or(
          `full_name.ilike.%${search}%,email.ilike.%${search}%,first_name.ilike.%${search}%,last_name.ilike.%${search}%`
        );
      }

      const { data: providersData, error: providersError } = await providersQuery;

      if (providersError) {
        console.error('❌ Error fetching providers:', providersError);
        throw new Error(
          `Erreur lors de la récupération des prestataires: ${providersError.message}`
        );
      }

      // Récupérer les statistiques de demandes pour tous les prestataires
      const { data: requestsData, error: requestsError } = await supabase
        .from('service_requests')
        .select('provider_id, status, total_amount');

      if (requestsError) {
        console.error('❌ Error fetching requests data:', requestsError);
        throw new Error(`Erreur lors de la récupération des demandes: ${requestsError.message}`);
      }

      // Calculer les métriques pour chaque prestataire
      const providersWithMetrics: ProviderWithMetrics[] = (providersData || []).map((provider) => {
        const services = provider.services || [];
        const providerRequests =
          requestsData?.filter((req) => req.provider_id === provider.id) || [];

        // Métriques des services
        const servicesCount = services.length;
        const activeServicesCount = services.filter((s) => s.is_active === true).length;

        // Métriques des demandes
        const totalRequests = providerRequests.length;
        const pendingRequests = providerRequests.filter((req) => req.status === 'pending').length;
        const completedRequests = providerRequests.filter(
          (req) => req.status === 'completed'
        ).length;

        // Revenus
        const totalRevenue = providerRequests
          .filter((req) => req.status === 'completed')
          .reduce((sum, req) => sum + (req.total_amount || 0), 0);

        // Note moyenne (simulée pour l'instant - à intégrer avec une vraie table de ratings)
        const averageRating =
          completedRequests > 0
            ? Math.min(5, Math.max(3, 4 + completedRequests / 10 - pendingRequests / 20))
            : 0;

        return {
          ...provider,
          servicesCount,
          activeServicesCount,
          totalRequests,
          pendingRequests,
          completedRequests,
          averageRating: Math.round(averageRating * 10) / 10, // Arrondir à 1 décimale
          totalRevenue,
          services: services.map((s) => ({
            id: s.id,
            name: s.name,
            category: s.category,
            base_price: s.base_price,
            is_active: s.is_active,
            description: s.description,
          })),
        };
      });

      // Application des filtres avancés sur les métriques
      let filteredProviders = providersWithMetrics;

      if (options?.filters?.minServices) {
        filteredProviders = filteredProviders.filter(
          (p) => p.servicesCount >= (options?.filters?.minServices || 0)
        );
      }

      if (options?.filters?.minRating) {
        filteredProviders = filteredProviders.filter(
          (p) => p.averageRating >= (options?.filters?.minRating || 0)
        );
      }

      if (options?.filters?.hasActiveServices === true) {
        filteredProviders = filteredProviders.filter((p) => p.activeServicesCount > 0);
      }

      // Tri
      if (options?.orderBy) {
        const orderBy = options.orderBy;
        const direction = options.orderDirection || 'desc';

        filteredProviders.sort((a: ProviderWithMetrics, b: ProviderWithMetrics) => {
          let valueA: string | number, valueB: string | number;

          switch (orderBy) {
            case 'name':
              valueA = a.full_name || a.email;
              valueB = b.full_name || b.email;
              break;
            case 'servicesCount':
              valueA = a.servicesCount;
              valueB = b.servicesCount;
              break;
            case 'totalRequests':
              valueA = a.totalRequests;
              valueB = b.totalRequests;
              break;
            case 'averageRating':
              valueA = a.averageRating;
              valueB = b.averageRating;
              break;
            case 'totalRevenue':
              valueA = a.totalRevenue;
              valueB = b.totalRevenue;
              break;
            default:
              valueA = a.full_name || a.email;
              valueB = b.full_name || b.email;
          }

          if (typeof valueA === 'string' && typeof valueB === 'string') {
            const comparison = valueA.localeCompare(valueB);
            return direction === 'asc' ? comparison : -comparison;
          }

          if (typeof valueA === 'number' && typeof valueB === 'number') {
            const comparison = valueA - valueB;
            return direction === 'asc' ? comparison : -comparison;
          }

          return 0;
        });
      }

      // Limite
      if (options?.limit) {
        filteredProviders = filteredProviders.slice(0, options.limit);
      }

      return filteredProviders;
    },
    staleTime: 5 * 60 * 1000, // 5 minutes
    enabled: options?.enabled !== false,
  });
};

/**
 * Hook pour récupérer un prestataire spécifique avec ses métriques
 */
export const useProvider = (id: string) => {
  return useQuery({
    queryKey: PROVIDERS_QUERY_KEYS.detail(id),
    queryFn: async (): Promise<ProviderWithMetrics | null> => {
      // Requête directe pour un seul provider
      const { data: providerData, error } = await supabase
        .from('profiles')
        .select(
          `
          id,
          first_name,
          last_name,
          email,
          full_name,
          phone,
          avatar_url,
          created_at,
          services:services!services_provider_id_fkey (
            id,
            name,
            category,
            base_price,
            is_active,
            description
          )
        `
        )
        .eq('role', 'provider')
        .eq('id', id)
        .single();

      if (error || !providerData) {
        console.warn('Provider not found:', id);
        return null;
      }

      // Calculer les métriques pour ce provider
      const services = providerData.services || [];
      const activeServices = services.filter((s) => s.is_active);

      // Récupérer les demandes de service pour calculer les métriques
      const { data: requests } = await supabase
        .from('service_requests')
        .select('status, total_amount')
        .eq('provider_id', id);

      const totalRequests = requests?.length || 0;
      const pendingRequests = requests?.filter((r) => r.status === 'pending').length || 0;
      const completedRequests = requests?.filter((r) => r.status === 'completed').length || 0;
      const totalRevenue =
        requests
          ?.filter((r) => r.status === 'completed')
          .reduce((sum, r) => sum + (r.total_amount || 0), 0) || 0;

      const averageRating =
        completedRequests > 0
          ? Math.min(5, Math.max(3, 4 + completedRequests / 10 - pendingRequests / 20))
          : 0;

      const provider: ProviderWithMetrics = {
        ...providerData,
        servicesCount: services.length,
        activeServicesCount: activeServices.length,
        totalRequests,
        pendingRequests,
        completedRequests,
        averageRating: Math.round(averageRating * 10) / 10,
        totalRevenue,
        services: services,
      };

      return provider;
    },
    enabled: !!id,
    staleTime: 5 * 60 * 1000,
  });
};
