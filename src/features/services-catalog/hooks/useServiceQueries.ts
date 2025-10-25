import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/core/config/supabase";
import { ServiceWithDetails, ServiceStats } from "@/types/services";

// Query Keys pour les services (comme dans UserManagement/Payments)
export const SERVICE_QUERY_KEYS = {
  all: ["services"] as const,
  lists: () => [...SERVICE_QUERY_KEYS.all, "list"] as const,
  list: (filters: Record<string, unknown>) =>
    [...SERVICE_QUERY_KEYS.lists(), { filters }] as const,
  details: () => [...SERVICE_QUERY_KEYS.all, "detail"] as const,
  detail: (id: string) => [...SERVICE_QUERY_KEYS.details(), id] as const,
  stats: () => [...SERVICE_QUERY_KEYS.all, "stats"] as const,
} as const;

/**
 * Hook pour récupérer la liste des services avec détails
 */
export const useServices = (options?: {
  filters?: Partial<ServiceWithDetails>;
  limit?: number;
  orderBy?: string;
  enabled?: boolean;
  refetchOnWindowFocus?: boolean;
}) => {
  return useQuery({
    queryKey: SERVICE_QUERY_KEYS.list(options?.filters || {}),
    queryFn: async (): Promise<ServiceWithDetails[]> => {

      let query = supabase.from("services").select(`
          *,
          provider:profiles!services_provider_id_fkey (
            id,
            first_name,
            last_name,
            email,
            full_name,
            phone,
            role,
            avatar_url
          )
        `);

      // Filtres de base
      if (options?.filters?.category) {
        query = query.eq("category", options.filters.category);
      }

      if (options?.filters?.is_active !== undefined) {
        query = query.eq("is_active", options.filters.is_active);
      }

      if (options?.filters?.provider_id) {
        query = query.eq("provider_id", options.filters.provider_id);
      }

      // Tri
      if (options?.orderBy) {
        query = query.order(options.orderBy as keyof ServiceWithDetails);
      } else {
        query = query.order("created_at", { ascending: false });
      }

      // Limite
      if (options?.limit) {
        query = query.limit(options.limit);
      }

      const { data, error } = await query;

      if (error) {
        throw new Error(
          `Erreur lors du chargement des services: ${error.message}`
        );
      }

      const services: ServiceWithDetails[] = (data || []).map(
        (service: any) => ({
          ...service,
          provider: service.provider || undefined,
          // TODO: Ajouter les calculs de stats (total_requests, avg_rating, etc.)
          total_requests: 0,
          avg_rating: 0,
          active_providers: 1,
        })
      );

      return services;
    },
    enabled: options?.enabled !== false,
    refetchOnWindowFocus: options?.refetchOnWindowFocus !== false,
  });
};

/**
 * Hook pour récupérer un service spécifique
 */
export const useService = (serviceId?: string) => {
  return useQuery({
    queryKey: SERVICE_QUERY_KEYS.detail(serviceId || ""),
    queryFn: async (): Promise<ServiceWithDetails | null> => {
      if (!serviceId) return null;


      const { data, error } = await supabase
        .from("services")
        .select(
          `
          *,
          provider:profiles!services_provider_id_fkey (
            id,
            first_name,
            last_name,
            email,
            full_name,
            phone,
            role,
            avatar_url
          )
        `
        )
        .eq("id", serviceId)
        .single();

      if (error) {
        throw new Error(
          `Erreur lors du chargement du service: ${error.message}`
        );
      }

      if (!data) return null;

      const service: ServiceWithDetails = {
        ...data,
        provider: data.provider || undefined,
        total_requests: 0, // TODO: Calculer depuis service_requests
        avg_rating: 0, // TODO: Calculer depuis reviews
        active_providers: 1,
      };

      return service;
    },
    enabled: !!serviceId,
  });
};

/**
 * Hook pour récupérer les statistiques des services
 */
export const useServiceStats = (options?: { enabled?: boolean }) => {
  return useQuery({
    queryKey: SERVICE_QUERY_KEYS.stats(),
    queryFn: async (): Promise<ServiceStats> => {

      // Récupérer tous les services pour calculer les stats
      const { data: services, error } = await supabase
        .from("services")
        .select("id, category, base_price, is_active, provider_id");

      if (error) {
        throw new Error(
          `Erreur lors du calcul des statistiques: ${error.message}`
        );
      }

      const servicesArray = services || [];
      const totalServices = servicesArray.length;

      // Stats par status
      const activeServices = servicesArray.filter(
        (s) => s.is_active === true
      ).length;
      const inactiveServices = servicesArray.filter(
        (s) => s.is_active === false
      ).length;

      // Catégories uniques
      const categories = new Set(servicesArray.map((s) => s.category));
      const totalCategories = categories.size;

      // Providers uniques
      const providers = new Set(servicesArray.map((s) => s.provider_id));
      const totalProviders = providers.size;

      // Prix moyen
      const totalPrice = servicesArray.reduce(
        (sum, s) => sum + (s.base_price || 0),
        0
      );
      const averagePrice = totalServices > 0 ? totalPrice / totalServices : 0;

      // TODO: Calculer totalRevenue depuis les paiements de services
      const totalRevenue = 0;

      const stats: ServiceStats = {
        totalServices,
        activeServices,
        inactiveServices,
        pendingServices: 0, // TODO: Calculer les services en attente de validation
        archivedServices: 0, // TODO: Implémenter le status archived
        totalProviders,
        totalCategories,
        averagePrice,
        totalRevenue,
      };

      return stats;
    },
    enabled: options?.enabled !== false,
    staleTime: 5 * 60 * 1000, // 5 minutes
  });
};
