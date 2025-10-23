import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "../../../lib/supabaseClient";
import { Database } from "../../../types";

// Types de base depuis la database
type ServiceRequestRow = Database["public"]["Tables"]["service_requests"]["Row"];
type ServiceRequestInsert = Database["public"]["Tables"]["service_requests"]["Insert"];
type ServiceRequestUpdate = Database["public"]["Tables"]["service_requests"]["Update"];

// Types étendus avec les relations
export interface ServiceRequestWithDetails extends ServiceRequestRow {
  // Relation avec le service
  service?: {
    id: string;
    name: string;
    description: string | null;
    category: string;
    base_price: number;
    is_active: boolean | null;
    provider_id: string;
  };
  
  // Relation avec le client (requester)
  requester?: {
    id: string;
    first_name: string | null;
    last_name: string | null;
    email: string;
    full_name: string | null;
    phone: string | null;
    role: string;
    avatar_url: string | null;
    vip_subscription: boolean | null;
  };
  
  // Relation avec le prestataire (provider)
  provider?: {
    id: string;
    first_name: string | null;
    last_name: string | null;
    email: string;
    full_name: string | null;
    phone: string | null;
    role: string;
    avatar_url: string | null;
  };
  
  // Relation avec la propriété (optionnelle)
  property?: {
    id: string;
    title: string | null;
    address: string | null;
    city: string | null;
    postal_code: string | null;
  };
}

// Filtres pour les service requests
export interface ServiceRequestFilters {
  status?: string;
  service_id?: string;
  provider_id?: string;
  requester_id?: string;
  date_from?: string;
  date_to?: string;
  search?: string;
}

// Statistiques des demandes de service
export interface ServiceRequestStats {
  total: number;
  pending: number;
  accepted: number;
  rejected: number;
  completed: number;
  cancelled: number;
  totalRevenue: number;
  averageAmount: number;
}

// Query Keys
export const SERVICE_REQUESTS_QUERY_KEYS = {
  all: ["service-requests"] as const,
  lists: () => [...SERVICE_REQUESTS_QUERY_KEYS.all, "list"] as const,
  list: (filters: ServiceRequestFilters) =>
    [...SERVICE_REQUESTS_QUERY_KEYS.lists(), { filters }] as const,
  details: () => [...SERVICE_REQUESTS_QUERY_KEYS.all, "detail"] as const,
  detail: (id: string) => [...SERVICE_REQUESTS_QUERY_KEYS.details(), id] as const,
  stats: () => [...SERVICE_REQUESTS_QUERY_KEYS.all, "stats"] as const,
  byService: (serviceId: string) =>
    [...SERVICE_REQUESTS_QUERY_KEYS.all, "byService", serviceId] as const,
  byProvider: (providerId: string) =>
    [...SERVICE_REQUESTS_QUERY_KEYS.all, "byProvider", providerId] as const,
  byRequester: (requesterId: string) =>
    [...SERVICE_REQUESTS_QUERY_KEYS.all, "byRequester", requesterId] as const,
} as const;

/**
 * Hook pour récupérer les demandes de service avec toutes les relations
 */
export const useServiceRequests = (options?: {
  filters?: ServiceRequestFilters;
  limit?: number;
  orderBy?: keyof ServiceRequestRow;
  orderDirection?: "asc" | "desc";
  enabled?: boolean;
  refetchOnWindowFocus?: boolean;
}) => {
  return useQuery({
    queryKey: SERVICE_REQUESTS_QUERY_KEYS.list(options?.filters || {}),
    queryFn: async (): Promise<ServiceRequestWithDetails[]> => {
      console.log("🔍 Fetching service requests with relations...");

      let query = supabase.from("service_requests").select(`
        *,
        service:services!service_requests_service_id_fkey (
          id,
          name,
          description,
          category,
          base_price,
          is_active,
          provider_id
        ),
        requester:profiles!service_requests_requester_id_fkey (
          id,
          first_name,
          last_name,
          email,
          full_name,
          phone,
          role,
          avatar_url,
          vip_subscription
        ),
        provider:profiles!service_requests_provider_id_fkey (
          id,
          first_name,
          last_name,
          email,
          full_name,
          phone,
          role,
          avatar_url
        ),
        property:properties!service_requests_property_id_fkey (
          id,
          title,
          address,
          city,
          postal_code
        )
      `);

      // Application des filtres
      const filters = options?.filters;
      if (filters?.status) {
        query = query.eq("status", filters.status);
      }

      if (filters?.service_id) {
        query = query.eq("service_id", filters.service_id);
      }

      if (filters?.provider_id) {
        query = query.eq("provider_id", filters.provider_id);
      }

      if (filters?.requester_id) {
        query = query.eq("requester_id", filters.requester_id);
      }

      if (filters?.date_from) {
        query = query.gte("requested_date", filters.date_from);
      }

      if (filters?.date_to) {
        query = query.lte("requested_date", filters.date_to);
      }

      // Recherche textuelle dans les notes et adresses
      if (filters?.search) {
        query = query.or(`notes.ilike.%${filters.search}%,address.ilike.%${filters.search}%`);
      }

      // Tri
      const orderBy = options?.orderBy || "created_at";
      const orderDirection = options?.orderDirection || "desc";
      query = query.order(orderBy, { ascending: orderDirection === "asc" });

      // Limite
      if (options?.limit) {
        query = query.limit(options.limit);
      }

      const { data, error } = await query;

      if (error) {
        console.error("❌ Error fetching service requests:", error);
        throw new Error(`Erreur lors de la récupération des demandes: ${error.message}`);
      }

      console.log(`✅ Fetched ${data?.length || 0} service requests`);
      return data || [];
    },
    staleTime: 5 * 60 * 1000, // 5 minutes
    enabled: options?.enabled !== false,
    refetchOnWindowFocus: options?.refetchOnWindowFocus ?? false,
  });
};

/**
 * Hook pour récupérer une demande de service spécifique
 */
export const useServiceRequest = (id: string) => {
  return useQuery({
    queryKey: SERVICE_REQUESTS_QUERY_KEYS.detail(id),
    queryFn: async (): Promise<ServiceRequestWithDetails | null> => {
      console.log("🔍 Fetching service request:", id);

      const { data, error } = await supabase
        .from("service_requests")
        .select(`
          *,
          service:services!service_requests_service_id_fkey (
            id,
            name,
            description,
            category,
            base_price,
            is_active,
            provider_id
          ),
          requester:profiles!service_requests_requester_id_fkey (
            id,
            first_name,
            last_name,
            email,
            full_name,
            phone,
            role,
            avatar_url,
            vip_subscription
          ),
          provider:profiles!service_requests_provider_id_fkey (
            id,
            first_name,
            last_name,
            email,
            full_name,
            phone,
            role,
            avatar_url
          ),
          property:properties!service_requests_property_id_fkey (
            id,
            name,
            address,
            city,
            postal_code
          )
        `)
        .eq("id", id)
        .single();

      if (error) {
        console.error("❌ Error fetching service request:", error);
        throw new Error(`Erreur lors de la récupération de la demande: ${error.message}`);
      }

      return data;
    },
    enabled: !!id,
    staleTime: 5 * 60 * 1000,
  });
};

/**
 * Hook pour récupérer les statistiques des demandes de service
 */
export const useServiceRequestStats = () => {
  return useQuery({
    queryKey: SERVICE_REQUESTS_QUERY_KEYS.stats(),
    queryFn: async (): Promise<ServiceRequestStats> => {
      console.log("📊 Fetching service request stats...");

      const { data, error } = await supabase
        .from("service_requests")
        .select("status, total_amount");

      if (error) {
        console.error("❌ Error fetching stats:", error);
        throw new Error(`Erreur lors de la récupération des statistiques: ${error.message}`);
      }

      const stats: ServiceRequestStats = {
        total: data.length,
        pending: 0,
        accepted: 0,
        rejected: 0,
        completed: 0,
        cancelled: 0,
        totalRevenue: 0,
        averageAmount: 0,
      };

      data.forEach((request) => {
        const status = request.status?.toLowerCase();
        
        switch (status) {
          case "pending":
            stats.pending++;
            break;
          case "accepted":
            stats.accepted++;
            break;
          case "rejected":
            stats.rejected++;
            break;
          case "completed":
            stats.completed++;
            stats.totalRevenue += request.total_amount || 0;
            break;
          case "cancelled":
            stats.cancelled++;
            break;
        }
      });

      stats.averageAmount = stats.completed > 0 ? stats.totalRevenue / stats.completed : 0;

      console.log("📊 Stats calculated:", stats);
      return stats;
    },
    staleTime: 10 * 60 * 1000, // 10 minutes
  });
};

/**
 * Hook pour récupérer les demandes par service
 */
export const useServiceRequestsByService = (serviceId: string) => {
  return useServiceRequests({
    filters: { service_id: serviceId },
    orderBy: "created_at",
    orderDirection: "desc",
    enabled: !!serviceId,
  });
};

/**
 * Hook pour récupérer les demandes par prestataire
 */
export const useServiceRequestsByProvider = (providerId: string) => {
  return useServiceRequests({
    filters: { provider_id: providerId },
    orderBy: "created_at", 
    orderDirection: "desc",
    enabled: !!providerId,
  });
};

/**
 * Hook pour récupérer les demandes par client
 */
export const useServiceRequestsByRequester = (requesterId: string) => {
  return useServiceRequests({
    filters: { requester_id: requesterId },
    orderBy: "created_at",
    orderDirection: "desc", 
    enabled: !!requesterId,
  });
};

/**
 * Hook avec mutations pour les demandes de service
 */
export const useServiceRequestMutations = () => {
  const queryClient = useQueryClient();

  // Mutation pour accepter une demande
  const acceptServiceRequest = useMutation({
    mutationFn: async ({ id, providerId }: { id: string; providerId?: string }) => {
      const updates: ServiceRequestUpdate = {
        status: "accepted",
        updated_at: new Date().toISOString(),
      };
      
      if (providerId) {
        updates.provider_id = providerId;
      }

      const { data, error } = await supabase
        .from("service_requests")
        .update(updates)
        .eq("id", id)
        .select()
        .single();

      if (error) {
        throw new Error(`Erreur lors de l'acceptation: ${error.message}`);
      }

      return data;
    },
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: SERVICE_REQUESTS_QUERY_KEYS.lists() });
      queryClient.invalidateQueries({ queryKey: SERVICE_REQUESTS_QUERY_KEYS.stats() });
      queryClient.setQueryData(SERVICE_REQUESTS_QUERY_KEYS.detail(data.id), data);
    },
  });

  // Mutation pour rejeter une demande
  const rejectServiceRequest = useMutation({
    mutationFn: async (id: string) => {
      const { data, error } = await supabase
        .from("service_requests")
        .update({
          status: "rejected",
          updated_at: new Date().toISOString(),
        })
        .eq("id", id)
        .select()
        .single();

      if (error) {
        throw new Error(`Erreur lors du rejet: ${error.message}`);
      }

      return data;
    },
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: SERVICE_REQUESTS_QUERY_KEYS.lists() });
      queryClient.invalidateQueries({ queryKey: SERVICE_REQUESTS_QUERY_KEYS.stats() });
      queryClient.setQueryData(SERVICE_REQUESTS_QUERY_KEYS.detail(data.id), data);
    },
  });

  // Mutation pour compléter une demande
  const completeServiceRequest = useMutation({
    mutationFn: async (id: string) => {
      const { data, error } = await supabase
        .from("service_requests")
        .update({
          status: "completed",
          completed_at: new Date().toISOString(),
          updated_at: new Date().toISOString(),
        })
        .eq("id", id)
        .select()
        .single();

      if (error) {
        throw new Error(`Erreur lors de la finalisation: ${error.message}`);
      }

      return data;
    },
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: SERVICE_REQUESTS_QUERY_KEYS.lists() });
      queryClient.invalidateQueries({ queryKey: SERVICE_REQUESTS_QUERY_KEYS.stats() });
      queryClient.setQueryData(SERVICE_REQUESTS_QUERY_KEYS.detail(data.id), data);
    },
  });

  // Mutation pour annuler une demande
  const cancelServiceRequest = useMutation({
    mutationFn: async ({ id, reason }: { id: string; reason?: string }) => {
      const { data, error } = await supabase
        .from("service_requests")
        .update({
          status: "cancelled",
          cancellation_reason: reason,
          cancelled_at: new Date().toISOString(),
          updated_at: new Date().toISOString(),
        })
        .eq("id", id)
        .select()
        .single();

      if (error) {
        throw new Error(`Erreur lors de l'annulation: ${error.message}`);
      }

      return data;
    },
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: SERVICE_REQUESTS_QUERY_KEYS.lists() });
      queryClient.invalidateQueries({ queryKey: SERVICE_REQUESTS_QUERY_KEYS.stats() });
      queryClient.setQueryData(SERVICE_REQUESTS_QUERY_KEYS.detail(data.id), data);
    },
  });

  return {
    acceptServiceRequest,
    rejectServiceRequest,
    completeServiceRequest,
    cancelServiceRequest,
  };
};