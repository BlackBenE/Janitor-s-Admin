/**
 * 🔍 User Queries Hook
 *
 * Centralise toutes les queries de récupération de données utilisateurs
 * Inspiré du pattern usePropertyQueries.ts
 */

import { useQuery } from "@tanstack/react-query";
import { supabase } from "../../../lib/supabaseClient";
import type { UserProfile } from "../../../types/userManagement";

// Query keys pour la gestion du cache
export const USER_QUERY_KEYS = {
  all: ["users"] as const,
  lists: () => [...USER_QUERY_KEYS.all, "list"] as const,
  list: (filters?: Partial<UserProfile>) =>
    [...USER_QUERY_KEYS.lists(), filters] as const,
  details: () => [...USER_QUERY_KEYS.all, "detail"] as const,
  detail: (id: string) => [...USER_QUERY_KEYS.details(), id] as const,
  stats: () => [...USER_QUERY_KEYS.all, "stats"] as const,
  individualStats: (userId: string) =>
    [...USER_QUERY_KEYS.all, "individual-stats", userId] as const,
  activities: () => [...USER_QUERY_KEYS.all, "activities"] as const,
  activity: (userId: string) =>
    [...USER_QUERY_KEYS.activities(), userId] as const,
  bookings: (userId: string) =>
    [...USER_QUERY_KEYS.all, "bookings", userId] as const,
  audit: (userId: string) => [...USER_QUERY_KEYS.all, "audit", userId] as const,
  clientServices: (userId: string) =>
    [...USER_QUERY_KEYS.all, "client-services", userId] as const,
  providerServices: (userId: string) =>
    [...USER_QUERY_KEYS.all, "provider-services", userId] as const,
  serviceRequests: (userId: string) =>
    [...USER_QUERY_KEYS.all, "service-requests", userId] as const,
  interventions: (userId: string) =>
    [...USER_QUERY_KEYS.all, "interventions", userId] as const,
  search: (term: string) =>
    [...USER_QUERY_KEYS.lists(), "search", term] as const,
} as const;

/**
 * Hook pour récupérer un utilisateur par ID
 */
export const useUser = (userId?: string, options?: { enabled?: boolean }) => {
  return useQuery({
    queryKey: USER_QUERY_KEYS.detail(userId || ""),
    queryFn: async () => {
      if (!userId) return null;

      const { data, error } = await supabase
        .from("profiles")
        .select("*")
        .eq("id", userId)
        .single();

      if (error && error.code !== "PGRST116") {
        throw new Error(
          `Erreur lors de la récupération de l'utilisateur: ${error.message}`
        );
      }

      return data;
    },
    enabled: options?.enabled !== false && !!userId,
    staleTime: 2 * 60 * 1000, // 2 minutes
    gcTime: 5 * 60 * 1000, // 5 minutes
  });
};

/**
 * Hook pour récupérer tous les utilisateurs avec filtres
 */
export const useUsers = (options?: {
  filters?: Partial<UserProfile>;
  limit?: number;
  orderBy?: keyof UserProfile;
  includeStats?: boolean;
  enabled?: boolean;
  refetchOnWindowFocus?: boolean;
}) => {
  return useQuery({
    queryKey: USER_QUERY_KEYS.list(options?.filters),
    queryFn: async () => {
      let query = supabase.from("profiles").select("*");

      // Appliquer les filtres
      if (options?.filters) {
        Object.entries(options.filters).forEach(([key, value]) => {
          if (value !== undefined && value !== null) {
            query = query.eq(key, value);
          }
        });
      }

      // Appliquer l'ordre et la limite
      if (options?.orderBy) {
        query = query.order(options.orderBy as string, { ascending: false });
      } else {
        query = query.order("created_at", { ascending: false });
      }

      if (options?.limit) {
        query = query.limit(options.limit);
      }

      const { data, error } = await query;

      if (error) {
        throw new Error(
          `Erreur lors de la récupération des utilisateurs: ${error.message}`
        );
      }

      return data || [];
    },
    enabled: options?.enabled !== false,
    staleTime: 3 * 60 * 1000, // 3 minutes
    gcTime: 10 * 60 * 1000, // 10 minutes
    refetchOnWindowFocus: options?.refetchOnWindowFocus ?? false,
    retry: 2,
  });
};

/**
 * Hook pour récupérer les statistiques globales des utilisateurs
 */
export const useUserStats = (options?: { enabled?: boolean }) => {
  return useQuery({
    queryKey: USER_QUERY_KEYS.stats(),
    queryFn: async () => {
      // Utiliser les vraies tables qui existent
      const [
        totalUsersResult,
        activeUsersResult,
        vipUsersResult,
        lockedUsersResult,
      ] = await Promise.all([
        supabase.from("profiles").select("id", { count: "exact", head: true }),
        supabase
          .from("profiles")
          .select("id", { count: "exact", head: true })
          .is("deleted_at", null),
        supabase
          .from("profiles")
          .select("id", { count: "exact", head: true })
          .eq("vip_subscription", true),
        supabase
          .from("profiles")
          .select("id", { count: "exact", head: true })
          .eq("account_locked", true),
      ]);

      return {
        totalUsers: totalUsersResult.count || 0,
        activeUsers: activeUsersResult.count || 0,
        vipUsers: vipUsersResult.count || 0,
        lockedUsers: lockedUsersResult.count || 0,
      };
    },
    enabled: options?.enabled !== false,
    staleTime: 5 * 60 * 1000, // 5 minutes
    gcTime: 10 * 60 * 1000,
    refetchOnWindowFocus: false,
  });
};

/**
 * Hook pour récupérer les statistiques d'un utilisateur spécifique
 * Compatible avec BookingsModal.tsx : useUserStats(userId)
 */
export const useUserStatsIndividual = (
  userId?: string,
  options?: { enabled?: boolean }
) => {
  return useQuery({
    queryKey: [...USER_QUERY_KEYS.all, "individual-stats", userId],
    queryFn: async () => {
      if (!userId) return null;

      // Calculer stats depuis bookings/payments pour cet utilisateur
      const [bookingsResponse, paymentsResponse] = await Promise.all([
        supabase.from("bookings").select("*").eq("traveler_id", userId),
        supabase.from("payments").select("*").eq("payer_id", userId),
      ]);

      const bookings = bookingsResponse.data || [];
      const payments = paymentsResponse.data || [];

      return {
        totalBookings: bookings.length,
        totalSpent: payments.reduce((sum, p) => sum + (p.amount || 0), 0),
        completedBookings: bookings.filter((b) => b.status === "completed")
          .length,
        pendingBookings: bookings.filter((b) => b.status === "pending").length,
        cancelledBookings: bookings.filter((b) => b.status === "cancelled")
          .length,
        lastBookingDate: bookings[0]?.created_at || null,
        averageBookingValue:
          bookings.length > 0
            ? payments.reduce((sum, p) => sum + (p.amount || 0), 0) /
              bookings.length
            : 0,
      };
    },
    enabled: options?.enabled !== false && !!userId,
    staleTime: 2 * 60 * 1000, // 2 minutes
    gcTime: 5 * 60 * 1000,
  });
};

/**
 * Hook pour récupérer l'activité d'un utilisateur (bookings + données)
 */
export const useUserActivity = (
  userIds: string[],
  options?: { enabled?: boolean }
) => {
  return useQuery({
    queryKey: [...USER_QUERY_KEYS.activities(), "bulk", userIds],
    queryFn: async () => {
      if (userIds.length === 0) return {};

      // Récupérer bookings et payments pour calculer l'activité
      const [bookingsResponse, paymentsResponse] = await Promise.all([
        supabase.from("bookings").select("*").in("traveler_id", userIds),
        supabase.from("payments").select("*").in("payer_id", userIds),
      ]);

      const bookings = bookingsResponse.data || [];
      const payments = paymentsResponse.data || [];

      // Calculer les données d'activité par utilisateur
      const activityData: Record<string, any> = {};

      userIds.forEach((userId) => {
        const userBookings = bookings.filter((b) => b.traveler_id === userId);
        const userPayments = payments.filter((p) => p.payer_id === userId);

        activityData[userId] = {
          userId,
          totalBookings: userBookings.length,
          lastBookingDate: userBookings[0]?.created_at || null,
          totalSpent: userPayments.reduce((sum, p) => sum + (p.amount || 0), 0),
          completedBookings: userBookings.filter(
            (b) => b.status === "completed"
          ).length,
          pendingBookings: userBookings.filter((b) => b.status === "pending")
            .length,
        };
      });

      return activityData;
    },
    enabled: options?.enabled !== false && userIds.length > 0,
    staleTime: 2 * 60 * 1000, // 2 minutes
    gcTime: 5 * 60 * 1000,
  });
};

/**
 * Hook pour rechercher des utilisateurs
 */
export const useUserSearch = (
  searchTerm: string,
  options?: { enabled?: boolean }
) => {
  return useQuery({
    queryKey: USER_QUERY_KEYS.search(searchTerm),
    queryFn: async () => {
      if (!searchTerm.trim()) return [];

      const { data, error } = await supabase
        .from("profiles")
        .select("*")
        .or(
          `full_name.ilike.%${searchTerm}%,email.ilike.%${searchTerm}%,phone.ilike.%${searchTerm}%`
        )
        .limit(20);

      if (error) {
        throw new Error(`Erreur lors de la recherche: ${error.message}`);
      }

      return data || [];
    },
    enabled: options?.enabled !== false && searchTerm.trim().length > 0,
    staleTime: 30 * 1000, // 30 secondes
    gcTime: 2 * 60 * 1000,
  });
};

/**
 * Hook pour récupérer les bookings d'un utilisateur
 */
export const useUserBookings = (
  userId?: string,
  options?: { enabled?: boolean }
) => {
  return useQuery({
    queryKey: USER_QUERY_KEYS.bookings(userId || ""),
    queryFn: async () => {
      if (!userId) return [];

      const { data, error } = await supabase
        .from("bookings")
        .select(
          `
          *,
          properties (
            id,
            title,
            city,
            address
          )
        `
        )
        .eq("traveler_id", userId)
        .order("created_at", { ascending: false });

      if (error) {
        throw new Error(
          `Erreur lors de la récupération des bookings: ${error.message}`
        );
      }

      return data || [];
    },
    enabled: options?.enabled !== false && !!userId,
    staleTime: 2 * 60 * 1000, // 2 minutes
    gcTime: 5 * 60 * 1000,
  });
};

/**
 * Hook pour récupérer les logs d'audit d'un utilisateur
 */
export const useUserAuditLog = (
  userId?: string,
  options?: { enabled?: boolean }
) => {
  return useQuery({
    queryKey: USER_QUERY_KEYS.audit(userId || ""),
    queryFn: async () => {
      if (!userId) return [];

      // Tenter de récupérer depuis audit_logs, sinon retourner vide
      try {
        const { data, error } = await supabase
          .from("audit_logs")
          .select("*")
          .eq("user_id", userId)
          .order("created_at", { ascending: false })
          .limit(50);

        if (error && error.code !== "42P01") {
          // 42P01 = relation does not exist
          throw error;
        }

        return data || [];
      } catch (err: any) {
        // Si la table n'existe pas, retourner un tableau vide
        console.warn("Audit logs table not found, returning empty array");
        return [];
      }
    },
    enabled: options?.enabled !== false && !!userId,
    staleTime: 1 * 60 * 1000, // 1 minute
    gcTime: 5 * 60 * 1000,
  });
};

/**
 * Hook pour récupérer les services utilisés par un utilisateur (en tant que client)
 * Renommé pour éviter confusion avec les hooks prestataire
 */
export const useUserClientServices = (
  userId?: string,
  options?: { enabled?: boolean }
) => {
  return useQuery({
    queryKey: USER_QUERY_KEYS.clientServices(userId || ""),
    queryFn: async () => {
      if (!userId) return [];

      try {
        // Récupérer les services via les réservations de l'utilisateur (en tant que client)
        const { data: bookingsData, error: bookingsError } = await supabase
          .from("bookings")
          .select(
            `
            *,
            properties (
              id,
              title,
              services (
                id,
                name,
                category,
                base_price,
                description,
                is_active,
                provider_id,
                profiles (
                  full_name,
                  email
                )
              )
            )
          `
          )
          .eq("traveler_id", userId);

        if (bookingsError && bookingsError.code !== "42P01") {
          throw bookingsError;
        }

        // Extraire les services uniques
        const uniqueServices = new Map();
        bookingsData?.forEach((booking) => {
          booking.properties?.services?.forEach((service: any) => {
            uniqueServices.set(service.id, service);
          });
        });

        return Array.from(uniqueServices.values());
      } catch (err: any) {
        console.warn("Services data not accessible, returning empty array");
        return [];
      }
    },
    enabled: options?.enabled !== false && !!userId,
    staleTime: 5 * 60 * 1000, // 5 minutes
    gcTime: 10 * 60 * 1000,
  });
};

/**
 * Hook pour récupérer les services fournis par un utilisateur (en tant que prestataire)
 * Compatible avec ServicesModal.tsx : getProviderServices(userId)
 */
export const useUserProviderServices = (
  userId?: string,
  options?: { enabled?: boolean }
) => {
  return useQuery({
    queryKey: [...USER_QUERY_KEYS.all, "provider-services", userId],
    queryFn: async () => {
      if (!userId) return [];

      try {
        const { data, error } = await supabase
          .from("services")
          .select(
            `
            *,
            profiles (
              full_name,
              email
            )
          `
          )
          .eq("provider_id", userId)
          .order("created_at", { ascending: false });

        if (error && error.code !== "42P01") {
          throw error;
        }

        return data || [];
      } catch (err: any) {
        console.warn("Provider services not accessible, returning empty array");
        return [];
      }
    },
    enabled: options?.enabled !== false && !!userId,
    staleTime: 5 * 60 * 1000,
    gcTime: 10 * 60 * 1000,
  });
};

/**
 * Hook pour récupérer les demandes de service d'un utilisateur
 * Compatible avec ServicesModal.tsx : getProviderServiceRequests(userId)
 */
export const useUserServiceRequests = (
  userId?: string,
  options?: { enabled?: boolean }
) => {
  return useQuery({
    queryKey: [...USER_QUERY_KEYS.all, "service-requests", userId],
    queryFn: async () => {
      if (!userId) return [];

      try {
        const { data, error } = await supabase
          .from("service_requests")
          .select("*")
          .eq("user_id", userId)
          .order("created_at", { ascending: false });

        if (error && error.code !== "42P01") {
          throw error;
        }

        return data || [];
      } catch (err: any) {
        console.warn("Service requests not accessible, returning empty array");
        return [];
      }
    },
    enabled: options?.enabled !== false && !!userId,
    staleTime: 3 * 60 * 1000,
    gcTime: 10 * 60 * 1000,
  });
};

/**
 * Hook pour récupérer les interventions d'un utilisateur
 * Compatible avec ServicesModal.tsx : getProviderInterventions(userId)
 */
export const useUserInterventions = (
  userId?: string,
  options?: { enabled?: boolean }
) => {
  return useQuery({
    queryKey: [...USER_QUERY_KEYS.all, "interventions", userId],
    queryFn: async () => {
      if (!userId) return [];

      try {
        const { data, error } = await supabase
          .from("interventions")
          .select("*")
          .eq("provider_id", userId)
          .order("created_at", { ascending: false });

        if (error && error.code !== "42P01") {
          throw error;
        }

        return data || [];
      } catch (err: any) {
        console.warn("Interventions not accessible, returning empty array");
        return [];
      }
    },
    enabled: options?.enabled !== false && !!userId,
    staleTime: 3 * 60 * 1000,
    gcTime: 10 * 60 * 1000,
  });
};

/**
 * Hook pour récupérer les abonnements d'un utilisateur
 * Compatible avec SubscriptionModal.tsx : getUserSubscriptions(userId)
 */
export const useUserSubscriptions = (
  userId?: string,
  options?: { enabled?: boolean }
) => {
  return useQuery({
    queryKey: [...USER_QUERY_KEYS.all, "subscriptions", userId],
    queryFn: async () => {
      if (!userId) return [];

      try {
        const { data, error } = await supabase
          .from("subscriptions")
          .select("*")
          .eq("user_id", userId)
          .order("created_at", { ascending: false });

        if (error && error.code !== "42P01") {
          throw error;
        }

        return data || [];
      } catch (err: any) {
        console.warn("Subscriptions not accessible, returning empty array");
        return [];
      }
    },
    enabled: options?.enabled !== false && !!userId,
    staleTime: 2 * 60 * 1000,
    gcTime: 5 * 60 * 1000,
  });
};
