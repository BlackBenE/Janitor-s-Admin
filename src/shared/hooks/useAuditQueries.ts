/**
 * 🔍 Audit Queries Hook - Partagé
 *
 * Centralise toutes les queries d'audit pour consultation
 */

import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/core/config/supabase";
import { AUDIT_QUERY_KEYS } from "./useAuditMutations";

/**
 * Hook pour récupérer les logs d'audit d'un utilisateur spécifique
 */
export const useUserAuditLogs = (
  userId?: string,
  options?: {
    enabled?: boolean;
    limit?: number;
  }
) => {
  return useQuery({
    queryKey: AUDIT_QUERY_KEYS.userLogs(userId || ""),
    queryFn: async () => {
      if (!userId) return [];

      try {
        const { data, error } = await supabase
          .from("audit_logs")
          .select("*")
          .eq("user_id", userId)
          .order("created_at", { ascending: false })
          .limit(options?.limit || 50);

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
    gcTime: 5 * 60 * 1000, // 5 minutes
  });
};

/**
 * Hook pour récupérer tous les logs d'audit avec filtres
 */
export const useAuditLogs = (options?: {
  actionType?: string;
  userId?: string;
  actorType?: "user" | "admin" | "system";
  limit?: number;
  enabled?: boolean;
}) => {
  return useQuery({
    queryKey: [
      ...AUDIT_QUERY_KEYS.logs(),
      "filtered",
      options?.actionType,
      options?.userId,
      options?.actorType,
      options?.limit,
    ],
    queryFn: async () => {
      try {
        let query = supabase
          .from("audit_logs")
          .select("*")
          .order("created_at", { ascending: false });

        // Appliquer les filtres
        if (options?.actionType) {
          query = query.eq("action_type", options.actionType);
        }
        if (options?.userId) {
          query = query.eq("user_id", options.userId);
        }
        if (options?.actorType) {
          query = query.eq("actor_type", options.actorType);
        }

        // Limite
        query = query.limit(options?.limit || 100);

        const { data, error } = await query;

        if (error && error.code !== "42P01") {
          throw error;
        }

        return data || [];
      } catch (err: any) {
        console.warn("Audit logs table not found, returning empty array");
        return [];
      }
    },
    enabled: options?.enabled !== false,
    staleTime: 2 * 60 * 1000, // 2 minutes
    gcTime: 10 * 60 * 1000, // 10 minutes
  });
};

/**
 * Hook pour récupérer les logs d'audit par type d'action
 */
export const useActionAuditLogs = (
  actionType: string,
  options?: {
    enabled?: boolean;
    limit?: number;
  }
) => {
  return useQuery({
    queryKey: AUDIT_QUERY_KEYS.actionLogs(actionType),
    queryFn: async () => {
      try {
        const { data, error } = await supabase
          .from("audit_logs")
          .select("*")
          .eq("action_type", actionType)
          .order("created_at", { ascending: false })
          .limit(options?.limit || 50);

        if (error && error.code !== "42P01") {
          throw error;
        }

        return data || [];
      } catch (err: any) {
        console.warn("Audit logs table not found, returning empty array");
        return [];
      }
    },
    enabled: options?.enabled !== false && !!actionType,
    staleTime: 3 * 60 * 1000, // 3 minutes
    gcTime: 10 * 60 * 1000, // 10 minutes
  });
};

/**
 * Hook pour récupérer les statistiques d'audit
 */
export const useAuditStats = (options?: { enabled?: boolean }) => {
  return useQuery({
    queryKey: [...AUDIT_QUERY_KEYS.all, "stats"],
    queryFn: async () => {
      try {
        // Statistiques par type d'action (dernières 24h)
        const { data: recentActions, error: actionsError } = await supabase
          .from("audit_logs")
          .select("action_type")
          .gte(
            "created_at",
            new Date(Date.now() - 24 * 60 * 60 * 1000).toISOString()
          );

        if (actionsError && actionsError.code !== "42P01") {
          throw actionsError;
        }

        // Compter par type d'action
        const actionCounts: Record<string, number> = {};
        (recentActions || []).forEach((log) => {
          actionCounts[log.action_type] =
            (actionCounts[log.action_type] || 0) + 1;
        });

        return {
          totalActionsLast24h: recentActions?.length || 0,
          actionsByType: actionCounts,
        };
      } catch (err: any) {
        console.warn("Audit logs table not found, returning empty stats");
        return {
          totalActionsLast24h: 0,
          actionsByType: {},
        };
      }
    },
    enabled: options?.enabled !== false,
    staleTime: 5 * 60 * 1000, // 5 minutes
    gcTime: 15 * 60 * 1000, // 15 minutes
  });
};

// Export des query keys pour usage externe
export { AUDIT_QUERY_KEYS };
