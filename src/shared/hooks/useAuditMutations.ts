/**
 * 🔍 Audit Mutations Hook - Partagé
 *
 * Centralise toutes les mutations d'audit pour traçabilité
 * Utilisé par userManagement, security, financial, etc.
 */

import { useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "../../lib/supabaseClient";

// Types pour l'audit
export interface AuditLogEntry {
  action_type: string;
  user_id: string;
  description: string;
  actor_type: "user" | "admin" | "system";
  metadata?: Record<string, any>;
  ip_address?: string;
  user_agent?: string;
}

export interface CreateAuditLogParams {
  actionType: string;
  userId: string;
  description: string;
  actorType?: "user" | "admin" | "system";
  metadata?: Record<string, any>;
  ipAddress?: string;
  userAgent?: string;
}

export const AUDIT_QUERY_KEYS = {
  all: ["audit"] as const,
  logs: () => [...AUDIT_QUERY_KEYS.all, "logs"] as const,
  userLogs: (userId: string) =>
    [...AUDIT_QUERY_KEYS.all, "user", userId] as const,
  actionLogs: (actionType: string) =>
    [...AUDIT_QUERY_KEYS.all, "action", actionType] as const,
};

/**
 * Hook pour les mutations d'audit (logs)
 */
export const useAuditMutations = () => {
  const queryClient = useQueryClient();

  // Créer un log d'audit
  const createAuditLog = useMutation({
    mutationFn: async (params: CreateAuditLogParams) => {
      const auditEntry: AuditLogEntry = {
        action_type: params.actionType,
        user_id: params.userId,
        description: params.description,
        actor_type: params.actorType || "admin",
        metadata: params.metadata || {},
        ip_address: params.ipAddress,
        user_agent: params.userAgent,
      };

      const { data, error } = await supabase
        .from("audit_logs")
        .insert(auditEntry)
        .select()
        .single();

      if (error) {
        // Si la table n'existe pas encore, on peut continuer sans erreur
        if (error.code === "42P01") {
          console.warn(
            "Audit logs table not found, skipping audit log creation"
          );
          return null;
        }
        throw new Error(
          `Erreur lors de la création du log d'audit: ${error.message}`
        );
      }

      return data;
    },
    onSuccess: (data, variables) => {
      // Invalider les caches d'audit
      queryClient.invalidateQueries({ queryKey: AUDIT_QUERY_KEYS.all });
      queryClient.invalidateQueries({
        queryKey: AUDIT_QUERY_KEYS.userLogs(variables.userId),
      });
      queryClient.invalidateQueries({
        queryKey: AUDIT_QUERY_KEYS.actionLogs(variables.actionType),
      });
    },
  });

  // Créer plusieurs logs d'audit en batch
  const createBulkAuditLogs = useMutation({
    mutationFn: async (entries: CreateAuditLogParams[]) => {
      const auditEntries: AuditLogEntry[] = entries.map((params) => ({
        action_type: params.actionType,
        user_id: params.userId,
        description: params.description,
        actor_type: params.actorType || "admin",
        metadata: params.metadata || {},
        ip_address: params.ipAddress,
        user_agent: params.userAgent,
      }));

      const { data, error } = await supabase
        .from("audit_logs")
        .insert(auditEntries)
        .select();

      if (error) {
        if (error.code === "42P01") {
          console.warn(
            "Audit logs table not found, skipping bulk audit log creation"
          );
          return [];
        }
        throw new Error(
          `Erreur lors de la création des logs d'audit en batch: ${error.message}`
        );
      }

      return data || [];
    },
    onSuccess: (data, variables) => {
      // Invalider les caches d'audit
      queryClient.invalidateQueries({ queryKey: AUDIT_QUERY_KEYS.all });

      // Invalider par utilisateur
      const userIds = Array.from(new Set(variables.map((v) => v.userId)));
      userIds.forEach((userId) => {
        queryClient.invalidateQueries({
          queryKey: AUDIT_QUERY_KEYS.userLogs(userId),
        });
      });
    },
  });

  return {
    // Mutations
    createAuditLog,
    createBulkAuditLogs,

    // États
    isCreatingAuditLog: createAuditLog.isPending,
    isBulkCreatingAuditLogs: createBulkAuditLogs.isPending,

    // Erreurs
    createAuditLogError: createAuditLog.error,
    bulkCreateAuditLogsError: createBulkAuditLogs.error,

    // Helper function - Compatible avec l'ancienne interface logAction
    logAction: async (
      actionType: string,
      userId: string,
      description: string,
      actorType: "user" | "admin" | "system" = "admin",
      metadata?: Record<string, any>
    ) => {
      try {
        await createAuditLog.mutateAsync({
          actionType,
          userId,
          description,
          actorType,
          metadata,
        });
      } catch (error) {
        // Log silencieusement l'erreur mais ne pas bloquer l'action principale
        console.error("Failed to create audit log:", error);
      }
    },

    // Reset des erreurs
    resetErrors: () => {
      createAuditLog.reset();
      createBulkAuditLogs.reset();
    },
  };
};
