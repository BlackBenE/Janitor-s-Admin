/**
 * 🔍 Audit Hook Unifié - Partagé
 *
 * Interface simple pour l'audit dans toute l'application
 * Compatible avec l'ancienne interface useAuditLog
 */

import { useAuditMutations } from "./useAuditMutations";
import {
  useUserAuditLogs,
  useAuditLogs,
  useActionAuditLogs,
  useAuditStats,
} from "./useAuditQueries";

/**
 * Hook unifié pour l'audit - Remplace useAuditLog
 */
export const useAudit = (userId?: string) => {
  // Mutations
  const mutations = useAuditMutations();

  // Queries pour cet utilisateur (si fourni)
  const userLogs = useUserAuditLogs(userId, {
    enabled: !!userId,
  });

  return {
    // 🔍 QUERIES (lecture)

    // Logs de l'utilisateur spécifique
    userAuditLogs: userLogs.data || [],
    isLoadingUserLogs: userLogs.isLoading,
    userLogsError: userLogs.error,
    refetchUserLogs: userLogs.refetch,

    // 📝 MUTATIONS (écriture)

    // Fonction principale - Compatible avec ancienne interface
    logAction: mutations.logAction,

    // Fonctions avancées
    createAuditLog: mutations.createAuditLog.mutateAsync,
    createBulkAuditLogs: mutations.createBulkAuditLogs.mutateAsync,

    // États des mutations
    isCreatingAuditLog: mutations.isCreatingAuditLog,
    isBulkCreatingAuditLogs: mutations.isBulkCreatingAuditLogs,

    // Erreurs des mutations
    createAuditLogError: mutations.createAuditLogError,
    bulkCreateAuditLogsError: mutations.bulkCreateAuditLogsError,

    // 🔧 UTILITAIRES
    resetErrors: mutations.resetErrors,

    // Hooks individuels pour usage avancé
    hooks: {
      mutations,
      useUserAuditLogs,
      useAuditLogs,
      useActionAuditLogs,
      useAuditStats,
    },
  };
};

// Exports individuels pour usage direct
export {
  useUserAuditLogs,
  useAuditLogs,
  useActionAuditLogs,
  useAuditStats,
} from "./useAuditQueries";

export { useAuditMutations } from "./useAuditMutations";
export type { AuditLogEntry, CreateAuditLogParams } from "./useAuditMutations";
