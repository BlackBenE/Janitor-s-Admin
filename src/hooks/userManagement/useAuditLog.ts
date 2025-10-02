import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "../../lib/supabaseClient";
import { Database, type Json } from "../../types/database.types";

type AuditLog = Database["public"]["Tables"]["audit_logs"]["Row"];
type AuditLogInsert = Database["public"]["Tables"]["audit_logs"]["Insert"];
type Booking = Database["public"]["Tables"]["bookings"]["Row"];
type Property = Database["public"]["Tables"]["properties"]["Row"];

/**
 * Hook simplifié pour la gestion de l'audit - SESSIONS SUPPRIMÉES
 * Responsabilités:
 * - Enregistrer les actions administratives (écriture)
 * - Récupérer l'historique d'audit (lecture)
 * - Calculer l'activité utilisateur depuis les vraies données métier
 */

// Constantes d'actions d'audit
export const AUDIT_ACTIONS = {
  LOGIN_SUCCESS: "LOGIN_SUCCESS",
  LOGIN_FAILED: "LOGIN_FAILED",
  LOGOUT: "LOGOUT",
  PASSWORD_RESET: "PASSWORD_RESET",
  USER_CREATED: "USER_CREATED",
  USER_UPDATED: "USER_UPDATED",
  USER_DELETED: "USER_DELETED",
  USER_SUSPENDED: "USER_SUSPENDED",
  USER_REACTIVATED: "USER_REACTIVATED",
  ROLE_CHANGED: "ROLE_CHANGED",
  BULK_ACTION: "BULK_ACTION",
  EXPORT_DATA: "EXPORT_DATA",
  ACCOUNT_LOCKED: "ACCOUNT_LOCKED",
  ACCOUNT_UNLOCKED: "ACCOUNT_UNLOCKED",
} as const;

// Query keys
const AUDIT_QUERY_KEYS = {
  all: ["audit"] as const,
  logs: (userId?: string) => [...AUDIT_QUERY_KEYS.all, "logs", userId] as const,
  activity: (userId?: string) =>
    [...AUDIT_QUERY_KEYS.all, "activity", userId] as const,
};

export const useAuditLog = (userId?: string) => {
  const [error, setError] = useState<string | null>(null);
  const queryClient = useQueryClient();

  // Query pour l'historique des actions d'audit
  const auditLogsQuery = useQuery({
    queryKey: AUDIT_QUERY_KEYS.logs(userId),
    queryFn: async (): Promise<AuditLog[]> => {
      let query = supabase
        .from("audit_logs")
        .select("*")
        .order("created_at", { ascending: false })
        .limit(100);

      if (userId) {
        query = query.eq("user_id", userId);
      }

      const { data, error } = await query;

      if (error) {
        console.error("Error fetching audit logs:", error);
        throw error;
      }

      return data || [];
    },
    enabled: true,
    staleTime: 1000 * 60 * 5, // 5 minutes
    refetchOnWindowFocus: false,
  });

  // Query pour l'activité utilisateur réelle (actions de l'utilisateur)
  const userActivityQuery = useQuery({
    queryKey: AUDIT_QUERY_KEYS.activity(userId),
    queryFn: async () => {
      if (!userId) return [];

      try {
        const userActions: Array<{
          id: string;
          type: "booking" | "property" | "intervention" | "notification";
          action: string;
          description: string;
          created_at: string;
          status?: string;
          metadata?: Record<string, any>;
        }> = [];

        // Récupérer les réservations (l'utilisateur en tant que voyageur)
        const { data: bookings, error: bookingsError } = await supabase
          .from("bookings")
          .select("*")
          .eq("traveler_id", userId)
          .order("created_at", { ascending: false });

        if (bookingsError) {
          throw bookingsError;
        }

        bookings?.forEach((booking) => {
          userActions.push({
            id: booking.id,
            type: "booking",
            action: "BOOKING_CREATED",
            description: `Réservation créée - Propriété ${booking.property_id}`,
            created_at: booking.created_at || "",
            status: booking.status || "unknown",
            metadata: {
              total_amount: booking.total_amount,
              check_in: booking.check_in,
              check_out: booking.check_out,
              payment_status: booking.payment_status,
            },
          });
        });

        // Récupérer les propriétés (l'utilisateur en tant que propriétaire)
        const { data: properties, error: propertiesError } = await supabase
          .from("properties")
          .select("*")
          .eq("owner_id", userId)
          .order("created_at", { ascending: false });

        if (propertiesError) {
          throw propertiesError;
        }

        properties?.forEach((property) => {
          userActions.push({
            id: property.id,
            type: "property",
            action: "PROPERTY_CREATED",
            description: `Propriété créée - ${property.title || "Sans titre"}`,
            created_at: property.created_at || "",
            status: property.validation_status || "unknown",
            metadata: {
              price: property.nightly_rate,
              location: `${property.city}, ${property.address}`,
              capacity: property.capacity,
              bedrooms: property.bedrooms,
              bathrooms: property.bathrooms,
            },
          });
        });

        // Récupérer les interventions (l'utilisateur en tant que prestataire)
        const { data: interventions, error: interventionsError } =
          await supabase
            .from("interventions")
            .select("*")
            .eq("provider_id", userId)
            .order("created_at", { ascending: false });

        if (interventionsError) {
          throw interventionsError;
        }

        interventions?.forEach((intervention) => {
          userActions.push({
            id: intervention.id,
            type: "intervention",
            action: "INTERVENTION_CREATED",
            description: `Intervention créée - ${
              intervention.work_description || "Sans description"
            }`,
            created_at: intervention.created_at || "",
            status: intervention.status || "unknown",
            metadata: {
              service_request_id: intervention.service_request_id,
              materials_used: intervention.materials_used,
            },
          });
        });

        // Trier toutes les actions par date (plus récente en premier)
        userActions.sort(
          (a, b) =>
            new Date(b.created_at).getTime() - new Date(a.created_at).getTime()
        );

        return userActions;
      } catch (error) {
        console.error("Error fetching user actions:", error);
        throw error;
      }
    },
    enabled: !!userId,
    staleTime: 1000 * 60 * 5, // 5 minutes
    refetchOnWindowFocus: false,
  });

  // Mutation pour créer un log d'audit
  const createAuditLogMutation = useMutation({
    mutationFn: async (logData: AuditLogInsert) => {
      const { data, error } = await supabase
        .from("audit_logs")
        .insert([logData])
        .select()
        .single();

      if (error) throw error;
      return data;
    },
    onSuccess: (data) => {
      // Invalider les queries pour rafraîchir les données
      queryClient.invalidateQueries({
        queryKey: AUDIT_QUERY_KEYS.logs(),
      });
    },
    onError: (error) => {
      setError("Failed to create audit log");
    },
  });

  // Fonction principale pour enregistrer une action
  const logAction = async (
    action: string,
    targetUserId: string,
    details: string,
    performedByEmail: string,
    metadata: Record<string, any> = {}
  ): Promise<void> => {
    try {
      setError(null);

      const logData: AuditLogInsert = {
        user_id: targetUserId,
        action,
        details,
        performed_by_email: performedByEmail,
        metadata: metadata as Json,
        created_at: new Date().toISOString(),
      };

      await createAuditLogMutation.mutateAsync(logData);
    } catch (error) {
      setError(error instanceof Error ? error.message : "Unknown error");
    }
  };

  return {
    // Données
    auditLogs: auditLogsQuery.data || [],
    userActions: userActivityQuery.data || [],

    // États de chargement
    isLoadingLogs: auditLogsQuery.isLoading,
    isLoadingActivity: userActivityQuery.isLoading,

    // Erreurs
    error,
    auditError: auditLogsQuery.error,
    activityError: userActivityQuery.error,

    // Actions
    logAction,

    // Constantes d'audit
    auditActions: AUDIT_ACTIONS,

    // Utilitaires
    refetchLogs: auditLogsQuery.refetch,
    refetchActivity: userActivityQuery.refetch,

    // Invalidation manuelle des données
    invalidateAuditData: (targetUserId?: string) => {
      const userIdToInvalidate = targetUserId || userId;
      if (userIdToInvalidate) {
        queryClient.invalidateQueries({
          queryKey: AUDIT_QUERY_KEYS.logs(userIdToInvalidate),
        });
        queryClient.invalidateQueries({
          queryKey: AUDIT_QUERY_KEYS.activity(userIdToInvalidate),
        });
      }
    },

    queryKeys: AUDIT_QUERY_KEYS,
  };
};
