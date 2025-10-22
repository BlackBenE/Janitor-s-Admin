import { useMutation, useQueryClient } from "@tanstack/react-query";
import { dataProvider } from "../../../providers/dataProvider";
import { useAnonymization } from "./useAnonymization";
import {
  DeletionReason,
  AnonymizationLevel,
  UserDeletionData,
} from "../../../types/dataRetention";

const USERS_QUERY_KEYS = {
  all: ["users"] as const,
  active: () => [...USERS_QUERY_KEYS.all, "active"] as const,
  deleted: () => [...USERS_QUERY_KEYS.all, "deleted"] as const,
  admins: () => [...USERS_QUERY_KEYS.all, "admins"] as const,
};

/**
 * Hook pour la suppression intelligente avec anonymisation
 * Combine soft delete et anonymisation selon la stratégie RGPD
 */
export const useSmartDeletion = () => {
  const queryClient = useQueryClient();
  const { anonymizeAndSoftDelete } = useAnonymization();

  // Suppression douce avec anonymisation immédiate
  const softDeleteWithAnonymization = useMutation({
    mutationFn: async ({
      userId,
      reason,
      anonymizationLevel = AnonymizationLevel.PARTIAL,
      customReason,
    }: {
      userId: string;
      reason: DeletionReason;
      anonymizationLevel?: AnonymizationLevel;
      customReason?: string;
    }): Promise<UserDeletionData> => {
      // Étape 1: Soft delete classique
      const deletionResponse = await dataProvider.update("profiles", userId, {
        deleted_at: new Date().toISOString(),
        deletion_reason: customReason || reason,
      });

      if (!deletionResponse.success) {
        throw new Error(
          deletionResponse.error?.message || "Failed to soft delete user"
        );
      }

      // Étape 2: Anonymisation selon la stratégie
      const anonymizationResult = await anonymizeAndSoftDelete(
        userId,
        reason,
        anonymizationLevel
      );

      if (!anonymizationResult.success) {
        // Rollback du soft delete si l'anonymisation échoue
        await dataProvider.update("profiles", userId, {
          deleted_at: null,
          deletion_reason: null,
        });
        throw new Error(`Anonymisation échouée: ${anonymizationResult.error}`);
      }

      return {
        user_id: userId,
        deleted_at: new Date().toISOString(),
        deletion_reason: reason,
        anonymization_level: anonymizationLevel,
        anonymized_at: new Date().toISOString(),
        scheduled_purge_at:
          anonymizationResult.anonymizationResult?.scheduled_purge_at,
      };
    },
    onSuccess: (result) => {
      // Invalidate toutes les requêtes utilisateur
      queryClient.invalidateQueries({ queryKey: USERS_QUERY_KEYS.all });

      console.log(
        `✅ Suppression intelligente réussie pour ${result.user_id}`,
        {
          deletedAt: result.deleted_at,
          anonymizationLevel: result.anonymization_level,
          scheduledPurge: result.scheduled_purge_at,
        }
      );
    },
    onError: (error) => {
      console.error("❌ Erreur lors de la suppression intelligente:", error);
    },
  });

  // Suppression en lot avec anonymisation
  const bulkSmartDeletion = useMutation({
    mutationFn: async ({
      userIds,
      reason,
      anonymizationLevel = AnonymizationLevel.PARTIAL,
      customReason,
    }: {
      userIds: string[];
      reason: DeletionReason;
      anonymizationLevel?: AnonymizationLevel;
      customReason?: string;
    }): Promise<UserDeletionData[]> => {
      const results: UserDeletionData[] = [];
      const errors: string[] = [];

      for (const userId of userIds) {
        try {
          const result = await softDeleteWithAnonymization.mutateAsync({
            userId,
            reason,
            anonymizationLevel,
            customReason,
          });
          results.push(result);
        } catch (error) {
          const errorMessage =
            error instanceof Error ? error.message : "Erreur inconnue";
          errors.push(`${userId}: ${errorMessage}`);
          console.error(`Erreur pour l'utilisateur ${userId}:`, error);
        }

        // Pause entre chaque traitement pour éviter la surcharge
        await new Promise((resolve) => setTimeout(resolve, 200));
      }

      if (errors.length > 0) {
        throw new Error(
          `Erreurs lors de la suppression en lot: ${errors.join(", ")}`
        );
      }

      return results;
    },
  });

  return {
    // Actions principales
    softDeleteWithAnonymization: softDeleteWithAnonymization.mutateAsync,
    bulkSmartDeletion: bulkSmartDeletion.mutateAsync,

    // États
    isDeleting: softDeleteWithAnonymization.isPending,
    isBulkDeleting: bulkSmartDeletion.isPending,

    // Erreurs
    deletionError: softDeleteWithAnonymization.error,
    bulkDeletionError: bulkSmartDeletion.error,

    // Stratégies prédéfinies
    strategies: {
      // Suppression RGPD (anonymisation immédiate)
      gdprDeletion: (userId: string, customReason?: string) =>
        softDeleteWithAnonymization.mutateAsync({
          userId,
          reason: DeletionReason.GDPR_COMPLIANCE,
          anonymizationLevel: AnonymizationLevel.PARTIAL,
          customReason: customReason || "Demande RGPD - Droit à l'effacement",
        }),

      // Suppression utilisateur (conservation temporaire)
      userDeletion: (userId: string, customReason?: string) =>
        softDeleteWithAnonymization.mutateAsync({
          userId,
          reason: DeletionReason.USER_REQUEST,
          anonymizationLevel: AnonymizationLevel.PARTIAL,
          customReason: customReason || "Demande de suppression utilisateur",
        }),

      // Suppression admin (conservation pour audit)
      adminDeletion: (userId: string, customReason?: string) =>
        softDeleteWithAnonymization.mutateAsync({
          userId,
          reason: DeletionReason.ADMIN_ACTION,
          anonymizationLevel: AnonymizationLevel.PARTIAL,
          customReason: customReason || "Suppression administrative",
        }),

      // Suppression pour violation (purge complète)
      violationPurge: (userId: string, customReason?: string) =>
        softDeleteWithAnonymization.mutateAsync({
          userId,
          reason: DeletionReason.POLICY_VIOLATION,
          anonymizationLevel: AnonymizationLevel.FULL,
          customReason:
            customReason || "Violation des conditions d'utilisation",
        }),
    },
  };
};
