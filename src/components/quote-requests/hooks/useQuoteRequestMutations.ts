import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "../../../lib/supabaseClient";
import { 
  QuoteRequest,
  QuoteRequestInsert,
  QuoteRequestUpdate,
  QuoteRequestWithDetails,
  QuoteRequestFilters,
  QuoteRequestStats,
  QuoteRequestStatus
} from "../../../types/quoteRequests";

// Query Keys pour les quote requests
export const QUOTE_REQUESTS_QUERY_KEYS = {
  all: ["quote-requests"] as const,
  lists: () => [...QUOTE_REQUESTS_QUERY_KEYS.all, "list"] as const,
  list: (filters: QuoteRequestFilters) =>
    [...QUOTE_REQUESTS_QUERY_KEYS.lists(), { filters }] as const,
  details: () => [...QUOTE_REQUESTS_QUERY_KEYS.all, "detail"] as const,
  detail: (id: string) =>
    [...QUOTE_REQUESTS_QUERY_KEYS.details(), id] as const,
  stats: () => [...QUOTE_REQUESTS_QUERY_KEYS.all, "stats"] as const,
  byStatus: (status: QuoteRequestStatus) =>
    [...QUOTE_REQUESTS_QUERY_KEYS.all, "byStatus", status] as const,
  byRequester: (requesterId: string) =>
    [...QUOTE_REQUESTS_QUERY_KEYS.all, "byRequester", requesterId] as const,
  byProvider: (providerId: string) =>
    [...QUOTE_REQUESTS_QUERY_KEYS.all, "byProvider", providerId] as const,
} as const;

/**
 * Hook pour récupérer les demandes de devis avec toutes les relations
 */
export const useQuoteRequests = (options?: {
  filters?: QuoteRequestFilters;
  limit?: number;
  orderBy?: keyof QuoteRequest;
  orderDirection?: "asc" | "desc";
  enabled?: boolean;
  refetchOnWindowFocus?: boolean;
}) => {
  return useQuery({
    queryKey: QUOTE_REQUESTS_QUERY_KEYS.list(options?.filters || {} as QuoteRequestFilters),
    queryFn: async (): Promise<QuoteRequestWithDetails[]> => {
      console.log("🔍 Fetching quote requests with relations...");

      let query = supabase.from("service_requests").select(`
        *,
        requester:profiles!service_requests_requester_id_fkey (
          id,
          first_name,
          last_name,
          email,
          full_name,
          phone,
          role,
          avatar_url
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
        service:services!service_requests_service_id_fkey (
          id,
          name,
          description,
          category,
          base_price,
          is_active,
          provider_id
        ),
        property:properties!service_requests_property_id_fkey (
          id,
          title,
          address,
          city,
          type
        )
      `);

      // Application des filtres
      if (options?.filters) {
        const filters = options.filters;
        
        // Filtre par statut
        if (filters.status && filters.status !== "all") {
          query = query.eq("status", filters.status);
        }
        
        // Filtre par service
        if (filters.service) {
          query = query.eq("service_id", filters.service);
        }
        
        // Filtre par prestataire
        if (filters.provider) {
          query = query.eq("provider_id", filters.provider);
        }
        
        // Filtre par client
        if (filters.requester) {
          query = query.eq("requester_id", filters.requester);
        }
        
        // Filtres de date
        if (filters.dateFrom) {
          query = query.gte("requested_date", filters.dateFrom);
        }
        if (filters.dateTo) {
          query = query.lte("requested_date", filters.dateTo);
        }
        
        // Filtres de montant
        if (filters.minAmount) {
          query = query.gte("total_amount", parseFloat(filters.minAmount));
        }
        if (filters.maxAmount) {
          query = query.lte("total_amount", parseFloat(filters.maxAmount));
        }
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
        throw new Error(`Erreur chargement quote requests: ${error.message}`);
      }

      const quoteRequests: QuoteRequestWithDetails[] = (data || []).map((item: any) => ({
        ...item,
        requester: Array.isArray(item.requester) ? item.requester[0] : item.requester,
        provider: Array.isArray(item.provider) ? item.provider[0] : item.provider,
        service: Array.isArray(item.service) ? item.service[0] : item.service,
        property: Array.isArray(item.property) ? item.property[0] : item.property,
      }));

      console.log(`✅ Quote requests loaded: ${quoteRequests.length} items`);
      return quoteRequests;
    },
    enabled: options?.enabled !== false,
    staleTime: 3 * 60 * 1000, // 3 minutes
    refetchOnWindowFocus: options?.refetchOnWindowFocus !== false,
  });
};

/**
 * Hook pour récupérer une demande de devis spécifique
 */
export const useQuoteRequest = (quoteRequestId: string) => {
  return useQuery({
    queryKey: QUOTE_REQUESTS_QUERY_KEYS.detail(quoteRequestId),
    queryFn: async (): Promise<QuoteRequestWithDetails | null> => {
      if (!quoteRequestId) return null;

      const { data, error } = await supabase
        .from("service_requests")
        .select(`
          *,
          requester:profiles!service_requests_requester_id_fkey (
            id,
            first_name,
            last_name,
            email,
            full_name,
            phone,
            role,
            avatar_url
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
          service:services!service_requests_service_id_fkey (
            id,
            name,
            description,
            category,
            base_price,
            is_active,
            provider_id
          ),
          property:properties!service_requests_property_id_fkey (
            id,
            title,
            address,
            city,
            type
          )
        `)
        .eq("id", quoteRequestId)
        .single();

      if (error) {
        throw new Error(`Erreur chargement quote request: ${error.message}`);
      }

      const quoteRequest: QuoteRequestWithDetails = {
        ...data,
        requester: Array.isArray(data.requester) ? data.requester[0] : data.requester,
        provider: Array.isArray(data.provider) ? data.provider[0] : data.provider,
        service: Array.isArray(data.service) ? data.service[0] : data.service,
        property: Array.isArray(data.property) ? data.property[0] : data.property,
      };

      return quoteRequest;
    },
    enabled: !!quoteRequestId,
    staleTime: 2 * 60 * 1000, // 2 minutes
  });
};

/**
 * Hook pour récupérer les statistiques des demandes de devis
 */
export const useQuoteRequestStats = (options?: { enabled?: boolean }) => {
  return useQuery({
    queryKey: QUOTE_REQUESTS_QUERY_KEYS.stats(),
    queryFn: async (): Promise<QuoteRequestStats> => {
      console.log("📊 Fetching quote request statistics...");

      // Récupérer toutes les demandes pour calculer les stats
      const { data: requests, error } = await supabase
        .from("service_requests")
        .select("id, status, total_amount, created_at, completed_at");

      if (error) {
        throw new Error(`Erreur calcul statistiques: ${error.message}`);
      }

      const requestsArray = requests || [];
      const totalRequests = requestsArray.length;

      // Stats par statut
      const pendingRequests = requestsArray.filter(r => r.status === "pending").length;
      const acceptedRequests = requestsArray.filter(r => r.status === "accepted").length;
      const inProgressRequests = requestsArray.filter(r => r.status === "in_progress").length;
      const completedRequests = requestsArray.filter(r => r.status === "completed").length;
      const cancelledRequests = requestsArray.filter(r => r.status === "cancelled").length;
      const rejectedRequests = requestsArray.filter(r => r.status === "rejected").length;

      // Calculs financiers
      const totalRevenue = requestsArray
        .filter(r => r.status === "completed")
        .reduce((sum, r) => sum + (r.total_amount || 0), 0);

      const averageAmount = totalRequests > 0 
        ? requestsArray.reduce((sum, r) => sum + (r.total_amount || 0), 0) / totalRequests
        : 0;

      // Temps moyen de completion (en jours)
      const completedWithDates = requestsArray.filter(r => 
        r.status === "completed" && r.created_at && r.completed_at
      );
      
      const averageCompletionTime = completedWithDates.length > 0
        ? completedWithDates.reduce((sum, r) => {
            const created = new Date(r.created_at!);
            const completed = new Date(r.completed_at!);
            const diffDays = (completed.getTime() - created.getTime()) / (1000 * 60 * 60 * 24);
            return sum + diffDays;
          }, 0) / completedWithDates.length
        : 0;

      const stats: QuoteRequestStats = {
        totalRequests,
        pendingRequests,
        acceptedRequests,
        inProgressRequests,
        completedRequests,
        cancelledRequests,
        rejectedRequests,
        totalRevenue,
        averageAmount,
        averageCompletionTime: Math.round(averageCompletionTime * 10) / 10,
      };

      console.log("📊 Quote request stats calculated:", stats);
      return stats;
    },
    enabled: options?.enabled !== false,
    staleTime: 5 * 60 * 1000, // 5 minutes
  });
};

/**
 * Hook pour les mutations (CRUD operations)
 */
export const useQuoteRequestMutations = () => {
  const queryClient = useQueryClient();

  const updateQuoteRequest = useMutation({
    mutationFn: async ({
      id,
      updates,
    }: {
      id: string;
      updates: QuoteRequestUpdate;
    }) => {
      console.log("🔄 Updating quote request:", id, updates);
      const { data, error } = await supabase
        .from("service_requests")
        .update({
          ...updates,
          updated_at: new Date().toISOString(),
        })
        .eq("id", id)
        .select()
        .single();

      if (error) {
        throw new Error(`Erreur mise à jour: ${error.message}`);
      }

      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: QUOTE_REQUESTS_QUERY_KEYS.all });
    },
  });

  const createQuoteRequest = useMutation({
    mutationFn: async (quoteRequest: QuoteRequestInsert) => {
      console.log("➕ Creating quote request:", quoteRequest);
      const { data, error } = await supabase
        .from("service_requests")
        .insert(quoteRequest)
        .select()
        .single();

      if (error) {
        throw new Error(`Erreur création: ${error.message}`);
      }

      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: QUOTE_REQUESTS_QUERY_KEYS.all });
    },
  });

  const deleteQuoteRequest = useMutation({
    mutationFn: async (id: string) => {
      console.log("🗑️ Deleting quote request:", id);
      const { data, error } = await supabase
        .from("service_requests")
        .delete()
        .eq("id", id)
        .select();

      if (error) {
        throw new Error(`Erreur suppression: ${error.message}`);
      }

      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: QUOTE_REQUESTS_QUERY_KEYS.all });
    },
  });

  // Actions spécifiques pour les statuts
  const approveQuoteRequest = useMutation({
    mutationFn: async (id: string) => {
      return updateQuoteRequest.mutateAsync({
        id,
        updates: { status: "accepted" },
      });
    },
  });

  const rejectQuoteRequest = useMutation({
    mutationFn: async ({
      id,
      reason,
    }: {
      id: string;
      reason?: string;
    }) => {
      return updateQuoteRequest.mutateAsync({
        id,
        updates: { 
          status: "rejected",
          cancellation_reason: reason,
          cancelled_at: new Date().toISOString(),
        },
      });
    },
  });

  const assignProvider = useMutation({
    mutationFn: async ({
      id,
      providerId,
    }: {
      id: string;
      providerId: string;
    }) => {
      return updateQuoteRequest.mutateAsync({
        id,
        updates: { 
          provider_id: providerId,
          status: "accepted",
        },
      });
    },
  });

  return {
    // CRUD mutations
    updateQuoteRequest,
    createQuoteRequest,
    deleteQuoteRequest,
    
    // Status mutations
    approveQuoteRequest,
    rejectQuoteRequest,
    assignProvider,
  };
};