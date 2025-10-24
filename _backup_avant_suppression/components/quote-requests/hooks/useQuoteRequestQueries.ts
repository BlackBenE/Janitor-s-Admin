/**
 * 🔍 Quote Request Queries Hook
 *
 * Centralise toutes les queries de récupération de données de demandes de devis
 * Inspiré du pattern useServiceQueries.ts et usePaymentQueries.ts
 */

import { useQuery } from "@tanstack/react-query";
import { supabase } from "../../../lib/supabaseClient";
import type {
  QuoteRequestWithDetails,
  QuoteRequestFilters,
  QuoteRequestStatus,
} from "../../../types/quoteRequests";

// Query Keys pour les quote requests (séparés des mutations)
export const QUOTE_REQUEST_QUERY_KEYS = {
  all: ["quote-requests"] as const,
  lists: () => [...QUOTE_REQUEST_QUERY_KEYS.all, "list"] as const,
  list: (filters?: QuoteRequestFilters) =>
    [...QUOTE_REQUEST_QUERY_KEYS.lists(), { filters }] as const,
  details: () => [...QUOTE_REQUEST_QUERY_KEYS.all, "detail"] as const,
  detail: (id: string) => [...QUOTE_REQUEST_QUERY_KEYS.details(), id] as const,
  stats: () => [...QUOTE_REQUEST_QUERY_KEYS.all, "stats"] as const,
  byStatus: (status: QuoteRequestStatus) =>
    [...QUOTE_REQUEST_QUERY_KEYS.all, "byStatus", status] as const,
  byRequester: (requesterId: string) =>
    [...QUOTE_REQUEST_QUERY_KEYS.all, "byRequester", requesterId] as const,
  byProvider: (providerId: string) =>
    [...QUOTE_REQUEST_QUERY_KEYS.all, "byProvider", providerId] as const,
  pending: () => [...QUOTE_REQUEST_QUERY_KEYS.all, "pending"] as const,
  recent: (limit?: number) =>
    [...QUOTE_REQUEST_QUERY_KEYS.all, "recent", limit] as const,
} as const;

/**
 * Hook pour récupérer la liste des demandes de devis avec filtres
 */
export const useQuoteRequests = (options?: {
  filters?: QuoteRequestFilters;
  limit?: number;
  orderBy?: string;
  orderDirection?: "asc" | "desc";
  enabled?: boolean;
  refetchOnWindowFocus?: boolean;
}) => {
  return useQuery({
    queryKey: QUOTE_REQUEST_QUERY_KEYS.list(options?.filters),
    queryFn: async (): Promise<QuoteRequestWithDetails[]> => {
      console.log("🔍 Fetching quote requests list...");

      let query = supabase.from("service_requests").select("*");

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

        // Filtre de recherche textuelle
        if (filters.search) {
          query = query.or(`
            requester.full_name.ilike.%${filters.search}%,
            service.name.ilike.%${filters.search}%,
            property.address.ilike.%${filters.search}%
          `);
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

      const quoteRequests: QuoteRequestWithDetails[] = (data || []).map(
        (item: any) => ({
          ...item,
          // Relations simples pour le moment
          requester: null,
          provider: null,
          service: null,
          property: null,
        })
      );

      console.log(`✅ Quote requests loaded: ${quoteRequests.length} items`);
      return quoteRequests;
    },
    enabled: options?.enabled !== false,
    staleTime: 3 * 60 * 1000, // 3 minutes
    refetchOnWindowFocus: options?.refetchOnWindowFocus !== false,
  });
};

/**
 * Hook pour récupérer une demande de devis spécifique par ID
 */
export const useQuoteRequest = (
  quoteRequestId?: string,
  options?: { enabled?: boolean }
) => {
  return useQuery({
    queryKey: QUOTE_REQUEST_QUERY_KEYS.detail(quoteRequestId || ""),
    queryFn: async (): Promise<QuoteRequestWithDetails | null> => {
      if (!quoteRequestId) return null;

      const { data, error } = await supabase
        .from("service_requests")
        .select("*")
        .eq("id", quoteRequestId)
        .single();

      if (error) {
        throw new Error(`Erreur chargement quote request: ${error.message}`);
      }

      const quoteRequest: QuoteRequestWithDetails = {
        ...data,
        // Relations simples pour le moment
        requester: null,
        provider: null,
        service: null,
        property: null,
      };

      return quoteRequest;
    },
    enabled: !!quoteRequestId && options?.enabled !== false,
    staleTime: 2 * 60 * 1000, // 2 minutes
  });
};

/**
 * Hook pour récupérer les demandes de devis par statut
 */
export const useQuoteRequestsByStatus = (
  status: QuoteRequestStatus,
  options?: { limit?: number; enabled?: boolean }
) => {
  return useQuery({
    queryKey: QUOTE_REQUEST_QUERY_KEYS.byStatus(status),
    queryFn: async (): Promise<QuoteRequestWithDetails[]> => {
      const { data, error } = await supabase
        .from("service_requests")
        .select(
          `
          *,
          requester:profiles!service_requests_requester_id_fkey (
            id, first_name, last_name, email, full_name
          ),
          provider:profiles!service_requests_provider_id_fkey (
            id, first_name, last_name, email, full_name
          ),
          service:services!service_requests_service_id_fkey (
            id, name, category
          )
        `
        )
        .eq("status", status)
        .order("created_at", { ascending: false })
        .limit(options?.limit || 50);

      if (error) {
        throw new Error(
          `Erreur chargement quote requests par statut: ${error.message}`
        );
      }

      return (data || []).map((item: any) => ({
        ...item,
        requester: Array.isArray(item.requester)
          ? item.requester[0]
          : item.requester,
        provider: Array.isArray(item.provider)
          ? item.provider[0]
          : item.provider,
        service: Array.isArray(item.service) ? item.service[0] : item.service,
      }));
    },
    enabled: options?.enabled !== false,
    staleTime: 2 * 60 * 1000,
  });
};

/**
 * Hook pour récupérer les demandes de devis en attente (priorité admin)
 */
export const usePendingQuoteRequests = (options?: {
  limit?: number;
  enabled?: boolean;
  refetchInterval?: number;
}) => {
  return useQuery({
    queryKey: QUOTE_REQUEST_QUERY_KEYS.pending(),
    queryFn: async (): Promise<QuoteRequestWithDetails[]> => {
      const { data, error } = await supabase
        .from("service_requests")
        .select(
          `
          *,
          requester:profiles!service_requests_requester_id_fkey (
            id, first_name, last_name, email, full_name, phone
          ),
          service:services!service_requests_service_id_fkey (
            id, name, category, base_price
          ),
          property:properties!service_requests_property_id_fkey (
            id, title, address, city
          )
        `
        )
        .eq("status", "pending")
        .order("created_at", { ascending: false })
        .limit(options?.limit || 20);

      if (error) {
        throw new Error(
          `Erreur chargement demandes en attente: ${error.message}`
        );
      }

      return (data || []).map((item: any) => ({
        ...item,
        requester: Array.isArray(item.requester)
          ? item.requester[0]
          : item.requester,
        service: Array.isArray(item.service) ? item.service[0] : item.service,
        property: Array.isArray(item.property)
          ? item.property[0]
          : item.property,
      }));
    },
    enabled: options?.enabled !== false,
    staleTime: 1 * 60 * 1000, // 1 minute pour les demandes urgentes
    refetchInterval: options?.refetchInterval || 30 * 1000, // Refresh toutes les 30s
  });
};

/**
 * Hook pour récupérer les demandes récentes (dashboard)
 */
export const useRecentQuoteRequests = (limit = 10) => {
  return useQuery({
    queryKey: QUOTE_REQUEST_QUERY_KEYS.recent(limit),
    queryFn: async (): Promise<QuoteRequestWithDetails[]> => {
      const { data, error } = await supabase
        .from("service_requests")
        .select(
          `
          *,
          requester:profiles!service_requests_requester_id_fkey (
            id, first_name, last_name, full_name
          ),
          service:services!service_requests_service_id_fkey (
            id, name, category
          )
        `
        )
        .order("created_at", { ascending: false })
        .limit(limit);

      if (error) {
        throw new Error(
          `Erreur chargement demandes récentes: ${error.message}`
        );
      }

      return (data || []).map((item: any) => ({
        ...item,
        requester: Array.isArray(item.requester)
          ? item.requester[0]
          : item.requester,
        service: Array.isArray(item.service) ? item.service[0] : item.service,
      }));
    },
    staleTime: 5 * 60 * 1000, // 5 minutes
  });
};
