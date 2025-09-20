import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabaseAdmin } from "../../lib/supabaseClient";
import { Database, type Json } from "../../types/database.types";

type AuditLog = Database["public"]["Tables"]["audit_logs"]["Row"];
type AuditLogInsert = Database["public"]["Tables"]["audit_logs"]["Insert"];
type UserSession = Database["public"]["Tables"]["user_sessions"]["Row"];
type Booking = Database["public"]["Tables"]["bookings"]["Row"];

/**
 * Hook complet pour la gestion des logs d'audit (lecture et écriture)
 * Responsabilités:
 * - Enregistrer les actions administratives (écriture)
 * - Récupérer les logs d'audit (lecture)
 * - Récupérer les sessions utilisateur
 * - Récupérer l'activité utilisateur (bookings)
 * - Gestion du cache avec React Query
 * - États de chargement et d'erreur unifiés
 */

// Query keys pour la gestion du cache
const AUDIT_QUERY_KEYS = {
  all: ["audit"] as const,
  logs: (userId?: string) => [...AUDIT_QUERY_KEYS.all, "logs", userId] as const,
  sessions: (userId?: string) =>
    [...AUDIT_QUERY_KEYS.all, "sessions", userId] as const,
  activity: (userId?: string) =>
    [...AUDIT_QUERY_KEYS.all, "activity", userId] as const,
};

export const useAuditLog = (userId?: string) => {
  const [error, setError] = useState<string | null>(null);
  const queryClient = useQueryClient();

  // ===== QUERIES (LECTURE) =====

  // Query pour les logs d'audit
  const auditLogsQuery = useQuery({
    queryKey: AUDIT_QUERY_KEYS.logs(userId),
    queryFn: async (): Promise<AuditLog[]> => {
      if (!userId || !supabaseAdmin) return [];

      const { data, error } = await supabaseAdmin
        .from("audit_logs")
        .select("*")
        .eq("user_id", userId)
        .order("created_at", { ascending: false })
        .limit(50);

      if (error) {
        console.error("Error fetching audit logs:", error);
        throw error;
      }

      return data || [];
    },
    enabled: !!userId && !!supabaseAdmin,
    staleTime: 30 * 1000, // 30 secondes
    refetchOnWindowFocus: false,
  });

  // Query pour les événements de sécurité (sessions)
  const securityEventsQuery = useQuery({
    queryKey: AUDIT_QUERY_KEYS.sessions(userId),
    queryFn: async (): Promise<UserSession[]> => {
      if (!userId || !supabaseAdmin) return [];

      const { data, error } = await supabaseAdmin
        .from("user_sessions")
        .select("*")
        .eq("user_id", userId)
        .order("created_at", { ascending: false })
        .limit(50);

      if (error) {
        console.error("Error fetching user sessions:", error);
        throw error;
      }

      return data || [];
    },
    enabled: !!userId && !!supabaseAdmin,
    staleTime: 1 * 60 * 1000, // 1 minute
    refetchOnWindowFocus: false,
  });

  // Query pour l'activité utilisateur (bookings récents)
  const userActivityQuery = useQuery({
    queryKey: AUDIT_QUERY_KEYS.activity(userId),
    queryFn: async (): Promise<Booking[]> => {
      if (!userId || !supabaseAdmin) return [];

      const { data, error } = await supabaseAdmin
        .from("bookings")
        .select("*")
        .eq("traveler_id", userId)
        .order("created_at", { ascending: false })
        .limit(20);

      if (error) {
        console.error("Error fetching user activity:", error);
        throw error;
      }

      return data || [];
    },
    enabled: !!userId && !!supabaseAdmin,
    staleTime: 2 * 60 * 1000, // 2 minutes
    refetchOnWindowFocus: false,
  });

  // ===== MUTATIONS (ÉCRITURE) =====

  // Mutation pour enregistrer une action d'audit
  const logActionMutation = useMutation({
    mutationFn: async ({
      action,
      userId: targetUserId,
      details,
      adminUser,
      metadata,
    }: {
      action: string;
      userId: string;
      details: string;
      adminUser: string;
      metadata?: Record<string, unknown>;
    }) => {
      if (!supabaseAdmin) {
        throw new Error("Supabase admin client not available");
      }

      const auditEntry: AuditLogInsert = {
        action,
        user_id: targetUserId,
        details,
        performed_by_email: adminUser,
        metadata: (metadata as Json) || {},
      };

      const { data, error } = await supabaseAdmin
        .from("audit_logs")
        .insert(auditEntry)
        .select()
        .single();

      if (error) throw error;

      console.log("Audit log created:", data);
      return data;
    },
    onSuccess: (data, variables) => {
      // Invalider le cache pour mettre à jour les logs affichés
      queryClient.invalidateQueries({
        queryKey: AUDIT_QUERY_KEYS.logs(variables.userId),
      });

      setError(null);
    },
    onError: (err) => {
      const errorMessage = err instanceof Error ? err.message : "Unknown error";
      setError(errorMessage);
    },
  });

  // Fonction helper pour logAction (compatibilité)
  const logAction = async (
    action: string,
    userId: string,
    details: string,
    adminUser: string,
    metadata?: Record<string, unknown>
  ) => {
    return logActionMutation.mutateAsync({
      action,
      userId,
      details,
      adminUser,
      metadata,
    });
  };

  // Actions courantes d'audit
  const auditActions = {
    USER_CREATED: "Utilisateur Créé",
    USER_UPDATED: "Utilisateur Modifié",
    USER_SUSPENDED: "Utilisateur Suspendu",
    USER_REACTIVATED: "Utilisateur Réactivé",
    PASSWORD_RESET: "Mot de Passe Réinitialisé",
    FORCE_LOGOUT: "Déconnexion Forcée",
    ROLE_CHANGED: "Rôle Modifié",
    VIP_STATUS_CHANGED: "Statut VIP Modifié",
    PROFILE_VALIDATED: "Profil Validé",
    BULK_ACTION: "Action en Masse",
    EXPORT_DATA: "Données Exportées",
  };

  return {
    // ===== DONNÉES DE LECTURE =====
    auditLogs: auditLogsQuery.data || [],
    securityEvents: securityEventsQuery.data || [],
    userActivity: userActivityQuery.data || [],

    // ===== ÉTATS =====
    isLoading:
      auditLogsQuery.isLoading ||
      securityEventsQuery.isLoading ||
      userActivityQuery.isLoading ||
      logActionMutation.isPending,

    isLoadingData:
      auditLogsQuery.isLoading ||
      securityEventsQuery.isLoading ||
      userActivityQuery.isLoading,

    isWriting: logActionMutation.isPending,

    error:
      error ||
      auditLogsQuery.error ||
      securityEventsQuery.error ||
      userActivityQuery.error ||
      logActionMutation.error,

    // ===== ACTIONS D'ÉCRITURE =====
    logAction,
    logActionMutation: {
      mutate: logActionMutation.mutate,
      mutateAsync: logActionMutation.mutateAsync,
      isPending: logActionMutation.isPending,
      error: logActionMutation.error,
      isSuccess: logActionMutation.isSuccess,
    },

    // ===== CONSTANTES ET UTILITAIRES =====
    auditActions,

    // ===== CONTRÔLES DE CACHE =====
    refetch: () => {
      auditLogsQuery.refetch();
      securityEventsQuery.refetch();
      userActivityQuery.refetch();
    },

    invalidateAuditData: (targetUserId?: string) => {
      const userIdToInvalidate = targetUserId || userId;
      if (userIdToInvalidate) {
        queryClient.invalidateQueries({
          queryKey: AUDIT_QUERY_KEYS.logs(userIdToInvalidate),
        });
        queryClient.invalidateQueries({
          queryKey: AUDIT_QUERY_KEYS.sessions(userIdToInvalidate),
        });
        queryClient.invalidateQueries({
          queryKey: AUDIT_QUERY_KEYS.activity(userIdToInvalidate),
        });
      }
    },

    // Query keys pour usage externe
    queryKeys: AUDIT_QUERY_KEYS,
  };
};
