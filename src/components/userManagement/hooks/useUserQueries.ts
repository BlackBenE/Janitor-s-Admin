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
 * Compatible avec BookingsSection.tsx dans UserDetailsModal : useUserStats(userId)
 */
export const useUserStatsIndividual = (
  userId?: string,
  options?: { enabled?: boolean }
) => {
  return useQuery({
    queryKey: [...USER_QUERY_KEYS.all, "individual-stats", userId],
    queryFn: async () => {
      if (!userId) return null;

      // Récupérer les données selon le rôle de l'utilisateur
      // On récupère le profil pour connaître le rôle
      const { data: userProfile } = await supabase
        .from("profiles")
        .select("role")
        .eq("id", userId)
        .single();

      if (!userProfile) return null;

      if (userProfile.role === "property_owner") {
        // Pour property owner : récupérer les paiements reçus et les bookings via ses propriétés
        const [bookingsResponse, paymentsReceivedResponse] = await Promise.all([
          // Bookings de ses propriétés
          supabase
            .from("bookings")
            .select(
              `
              *,
              properties!inner (
                id,
                title,
                owner_id
              )
            `
            )
            .eq("properties.owner_id", userId),
          // Paiements reçus (comme payee) - SEULEMENT bookings pour cette section
          supabase
            .from("payments")
            .select("*")
            .eq("payee_id", userId)
            .eq("payment_type", "booking"), // 🎯 Seulement les bookings
        ]);

        const bookings = bookingsResponse.data || [];
        const paymentsReceived = paymentsReceivedResponse.data || [];

        // 🔍 Debug pour property owner - bookings seulement
        console.group(
          "🔍 Debug useUserStatsIndividual - Property Owner (Bookings only)"
        );
        console.log(
          "Bookings via properties:",
          bookings.map((b) => ({
            id: b.id,
            total_amount: b.total_amount,
            status: b.status,
            property_title: b.properties?.title,
          }))
        );
        console.log(
          "Payments BOOKING reçus (payee_id):",
          paymentsReceived.map((p) => ({
            id: p.id,
            amount: p.amount,
            booking_id: p.booking_id,
            payment_type: p.payment_type,
            status: p.status,
          }))
        );
        console.groupEnd();

        return {
          totalBookings: bookings.length,
          totalSpent: paymentsReceived.reduce(
            (sum, p) => sum + (p.amount || 0),
            0
          ), // Total reçu
          completedBookings: bookings.filter((b) => b.status === "completed")
            .length,
          pendingBookings: bookings.filter((b) => b.status === "pending")
            .length,
          cancelledBookings: bookings.filter((b) => b.status === "cancelled")
            .length,
          lastBookingDate: bookings[0]?.created_at || null,
          averageBookingValue:
            bookings.length > 0
              ? paymentsReceived.reduce((sum, p) => sum + (p.amount || 0), 0) /
                bookings.length
              : 0,
        };
      } else {
        // Pour traveler/tenant : logique bookings uniquement
        const [bookingsResponse, paymentsResponse] = await Promise.all([
          supabase.from("bookings").select("*").eq("traveler_id", userId),
          // ⚠️ CORRECTION : Filtrer uniquement les paiements de type 'booking'
          supabase
            .from("payments")
            .select("*")
            .eq("payer_id", userId)
            .eq("payment_type", "booking"), // 🎯 Seulement les bookings
        ]);

        const bookings = bookingsResponse.data || [];
        const payments = paymentsResponse.data || [];

        // 🔍 Debug pour traveler - bookings seulement
        console.group(
          "🔍 Debug useUserStatsIndividual - Traveler (Bookings only)"
        );
        console.log(
          "Bookings du traveler:",
          bookings.map((b) => ({
            id: b.id,
            total_amount: b.total_amount,
            status: b.status,
            traveler_id: b.traveler_id,
          }))
        );
        console.log(
          "Payments BOOKING du traveler (payer_id):",
          payments.map((p) => ({
            id: p.id,
            amount: p.amount,
            booking_id: p.booking_id,
            payment_type: p.payment_type,
            status: p.status,
          }))
        );
        console.groupEnd(); // ✅ FIX: Ne compter que les paiements liés aux bookings affichés
        const bookingIds = bookings.map((b) => b.id);
        const paymentsForBookings = payments.filter(
          (p) => p.booking_id && bookingIds.includes(p.booking_id)
        );
        const paymentsForServices = payments.filter(
          (p) => p.service_request_id && !p.booking_id
        );
        const orphanPayments = payments.filter(
          (p) => !p.booking_id && !p.service_request_id
        );
        const correctTotal = paymentsForBookings.reduce(
          (sum, p) => sum + (p.amount || 0),
          0
        );

        console.log("🔍 ANALYSE DES PAIEMENTS:");
        console.log(
          "- Paiements pour bookings affichés:",
          paymentsForBookings.map((p) => ({
            amount: p.amount,
            booking_id: p.booking_id,
          }))
        );
        console.log(
          "- Paiements pour services:",
          paymentsForServices.map((p) => ({
            amount: p.amount,
            service_request_id: p.service_request_id,
          }))
        );
        console.log(
          "- Paiements orphelins:",
          orphanPayments.map((p) => ({
            amount: p.amount,
            payment_type: p.payment_type,
          }))
        );
        console.log("- Total CORRECT (bookings uniquement):", correctTotal);
        console.log(
          "- Total INCORRECT (tous paiements):",
          payments.reduce((sum, p) => sum + (p.amount || 0), 0)
        );

        return {
          totalBookings: bookings.length,
          totalSpent: correctTotal, // ✅ Seulement les paiements des bookings affichés
          completedBookings: bookings.filter((b) => b.status === "completed")
            .length,
          pendingBookings: bookings.filter((b) => b.status === "pending")
            .length,
          cancelledBookings: bookings.filter((b) => b.status === "cancelled")
            .length,
          lastBookingDate: bookings[0]?.created_at || null,
          averageBookingValue:
            bookings.length > 0 ? correctTotal / bookings.length : 0, // ✅ Moyenne corrigée
        };
      }
    },
    enabled: options?.enabled !== false && !!userId,
    staleTime: 2 * 60 * 1000, // 2 minutes
    gcTime: 5 * 60 * 1000,
  });
};

/**
 * Hook pour récupérer l'activité d'un utilisateur (role-aware)
 * Utilise les mêmes patterns que BookingsSection/ServicesSection
 */
export const useUserActivity = (
  userIds: string[],
  options?: { enabled?: boolean }
) => {
  return useQuery({
    queryKey: [...USER_QUERY_KEYS.activities(), "bulk", userIds],
    queryFn: async () => {
      if (userIds.length === 0) return {};

      // Récupérer d'abord les profils pour connaître les rôles
      const { data: profiles } = await supabase
        .from("profiles")
        .select("id, role")
        .in("id", userIds);

      const profilesMap = new Map(profiles?.map((p) => [p.id, p.role]) || []);

      // Récupérer toutes les données nécessaires en parallèle
      const [
        bookingsResponse,
        paymentsResponse,
        propertiesResponse,
        serviceRequestsResponse,
        interventionsResponse,
        subscriptionsResponse,
      ] = await Promise.all([
        supabase.from("bookings").select("*").in("traveler_id", userIds),
        supabase.from("payments").select("*").in("payer_id", userIds),
        supabase.from("properties").select("*").in("owner_id", userIds),
        supabase.from("service_requests").select("*").in("client_id", userIds),
        supabase.from("interventions").select("*").in("provider_id", userIds),
        supabase.from("subscriptions").select("*").in("user_id", userIds),
      ]);

      const bookings = bookingsResponse.data || [];
      const payments = paymentsResponse.data || [];
      const properties = propertiesResponse.data || [];
      const serviceRequests = serviceRequestsResponse.data || [];
      const interventions = interventionsResponse.data || [];
      const subscriptions = subscriptionsResponse.data || [];

      // Calculer les données d'activité par utilisateur de manière role-aware
      const activityData: Record<string, any> = {};

      userIds.forEach((userId) => {
        const userRole = profilesMap.get(userId);
        const userBookings = bookings.filter((b) => b.traveler_id === userId);
        const userPayments = payments.filter((p) => p.payer_id === userId);
        const userProperties = properties.filter((p) => p.owner_id === userId);
        const userServiceRequests = serviceRequests.filter(
          (sr) => sr.client_id === userId
        );
        const userInterventions = interventions.filter(
          (i) => i.provider_id === userId
        );
        const userSubscriptions = subscriptions.filter(
          (s) => s.user_id === userId
        );

        // Calculs de base (pour tous les rôles)
        let totalSpent = userPayments.reduce(
          (sum, p) => sum + (p.amount || 0),
          0
        );
        let totalEarned = 0;

        // Calculs role-aware pour totalSpent et totalEarned
        switch (userRole) {
          case "traveler":
            // Les voyageurs dépensent via bookings et service requests
            totalSpent = userPayments.reduce(
              (sum, p) => sum + (p.amount || 0),
              0
            );
            break;

          case "property_owner":
            // Les propriétaires gagnent via les bookings de leurs propriétés
            const ownerBookings = bookings.filter((booking) =>
              userProperties.some(
                (property) => property.id === booking.property_id
              )
            );
            totalEarned = ownerBookings.reduce(
              (sum, b) => sum + (b.total_amount || 0),
              0
            );
            break;

          case "service_provider":
          case "provider":
            // Les prestataires gagnent via leurs interventions
            totalEarned = userInterventions.reduce(
              (sum, i) => sum + (i.amount || 0),
              0
            );
            break;

          default:
            // Rôles admin ou autres : combinaison des deux
            totalSpent = userPayments.reduce(
              (sum, p) => sum + (p.amount || 0),
              0
            );
            totalEarned = userInterventions.reduce(
              (sum, i) => sum + (i.amount || 0),
              0
            );
        }

        // Calcul des abonnements
        const totalSubscriptionSpent = userSubscriptions.reduce(
          (sum, s) => sum + (s.amount || 0),
          0
        );
        totalSpent += totalSubscriptionSpent;

        activityData[userId] = {
          userId,
          // Données de base
          totalBookings: userBookings.length,
          lastBookingDate: userBookings[0]?.created_at || null,
          totalSpent,
          totalEarned,
          completedBookings: userBookings.filter(
            (b) => b.status === "completed"
          ).length,
          pendingBookings: userBookings.filter((b) => b.status === "pending")
            .length,

          // Données role-aware
          totalProperties: userProperties.length,
          totalServices: userServiceRequests.length,
          totalInterventions: userInterventions.length,

          // Données de rating (à implémenter si nécessaire)
          averageRating: undefined,
          totalReviews: 0,
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

      // Récupérer le rôle de l'utilisateur
      const { data: userProfile } = await supabase
        .from("profiles")
        .select("role")
        .eq("id", userId)
        .single();

      if (!userProfile) return [];

      let query;

      if (userProfile.role === "property_owner") {
        // Pour property owner : bookings de ses propriétés
        query = supabase
          .from("bookings")
          .select(
            `
            *,
            properties!inner (
              id,
              title,
              city,
              address,
              owner_id
            ),
            profiles!bookings_traveler_id_fkey (
              id,
              full_name,
              email
            )
          `
          )
          .eq("properties.owner_id", userId);
      } else {
        // Pour traveler : ses propres bookings
        query = supabase
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
          .eq("traveler_id", userId);
      }

      const { data, error } = await query.order("created_at", {
        ascending: false,
      });

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
 * Compatible avec ServicesSection.tsx dans UserDetailsModal : getProviderServices(userId)
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
 * Compatible avec ServicesSection.tsx dans UserDetailsModal : getProviderServiceRequests(userId)
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
          .eq("requester_id", userId)
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
 * Hook pour récupérer les demandes de service où l'utilisateur est le PROVIDER
 */
export const useUserProviderServiceRequests = (
  userId?: string,
  options?: { enabled?: boolean }
) => {
  return useQuery({
    queryKey: [...USER_QUERY_KEYS.all, "provider-service-requests", userId],
    queryFn: async () => {
      if (!userId) return [];

      try {
        const { data, error } = await supabase
          .from("service_requests")
          .select(
            `
            *,
            services (
              id,
              name,
              category
            ),
            profiles!service_requests_requester_id_fkey (
              id,
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
        console.warn(
          "Provider service requests not accessible, returning empty array"
        );
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
 * Compatible avec ServicesSection.tsx dans UserDetailsModal : getProviderInterventions(userId)
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

/**
 * Hook pour récupérer les statistiques de services d'un utilisateur
 * Pour une future ServicesSection
 */
export const useUserServicesStats = (
  userId?: string,
  options?: { enabled?: boolean }
) => {
  return useQuery({
    queryKey: [...USER_QUERY_KEYS.all, "services-stats", userId],
    queryFn: async () => {
      if (!userId) return null;

      const [serviceRequestsResponse, paymentsResponse] = await Promise.all([
        supabase
          .from("service_requests")
          .select("*")
          .eq("requester_id", userId),
        supabase
          .from("payments")
          .select("*")
          .eq("payer_id", userId)
          .eq("payment_type", "service"), // 🎯 Seulement les services
      ]);

      const serviceRequests = serviceRequestsResponse.data || [];
      const payments = paymentsResponse.data || [];

      return {
        totalServices: serviceRequests.length,
        totalSpentOnServices: payments.reduce(
          (sum, p) => sum + (p.amount || 0),
          0
        ),
        completedServices: serviceRequests.filter(
          (s) => s.status === "completed"
        ).length,
        pendingServices: serviceRequests.filter((s) => s.status === "pending")
          .length,
        averageServiceValue:
          serviceRequests.length > 0
            ? payments.reduce((sum, p) => sum + (p.amount || 0), 0) /
              serviceRequests.length
            : 0,
      };
    },
    enabled: options?.enabled !== false && !!userId,
    staleTime: 2 * 60 * 1000,
    gcTime: 5 * 60 * 1000,
  });
};

/**
 * Hook pour récupérer les statistiques globales d'un utilisateur (tous paiements)
 * Pour PaymentsPage
 */
export const useUserFinancialStats = (
  userId?: string,
  options?: { enabled?: boolean }
) => {
  return useQuery({
    queryKey: [...USER_QUERY_KEYS.all, "financial-stats", userId],
    queryFn: async () => {
      if (!userId) return null;

      const { data: payments } = await supabase
        .from("payments")
        .select("*")
        .eq("payer_id", userId);

      const paymentsData = payments || [];

      // Grouper par type de paiement
      const groupedByType = paymentsData.reduce((acc, payment) => {
        const type = payment.payment_type || "unknown";
        if (!acc[type]) acc[type] = { count: 0, total: 0 };
        acc[type].count++;
        acc[type].total += payment.amount || 0;
        return acc;
      }, {} as Record<string, { count: number; total: number }>);

      return {
        totalSpent: paymentsData.reduce((sum, p) => sum + (p.amount || 0), 0),
        paymentsByType: groupedByType,
        totalTransactions: paymentsData.length,
      };
    },
    enabled: options?.enabled !== false && !!userId,
    staleTime: 2 * 60 * 1000,
    gcTime: 5 * 60 * 1000,
  });
};
