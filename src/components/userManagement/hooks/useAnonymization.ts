import { useMutation, useQueryClient } from "@tanstack/react-query";
import {
  AnonymizationLevel,
  AnonymizationResult,
  DeletionReason,
} from "../../../types/dataRetention";
import { anonymizationService } from "../../../services/anonymizationService";

/**
 * Hook pour la gestion de l'anonymisation des utilisateurs
 * Intègre l'anonymisation automatique dans le workflow de suppression
 */
export const useAnonymization = () => {
  const queryClient = useQueryClient();

  // Mutation pour l'anonymisation d'un utilisateur
  const anonymizeUser = useMutation({
    mutationFn: async ({
      userId,
      reason,
      level = AnonymizationLevel.PARTIAL,
    }: {
      userId: string;
      reason: DeletionReason;
      level?: AnonymizationLevel;
    }): Promise<AnonymizationResult> => {
      return await anonymizationService.anonymizeUser(userId, reason, level);
    },
    onSuccess: (result) => {
      if (result.success) {
        // Invalider toutes les requêtes liées aux utilisateurs
        queryClient.invalidateQueries({ queryKey: ["users"] });

        console.log(`✅ Utilisateur ${result.user_id} anonymisé avec succès`, {
          level: result.anonymization_level,
          fields: result.anonymized_fields,
          preservedUntil: result.preserved_data_until,
          scheduledPurge: result.scheduled_purge_at,
        });
      } else {
        console.error(
          `❌ Erreur lors de l'anonymisation de ${result.user_id}:`,
          result.error
        );
      }
    },
    onError: (error) => {
      console.error("Erreur lors de l'anonymisation:", error);
    },
  });

  // Mutation pour l'anonymisation en lot
  const anonymizeUsers = useMutation({
    mutationFn: async ({
      userIds,
      reason,
      level = AnonymizationLevel.PARTIAL,
    }: {
      userIds: string[];
      reason: DeletionReason;
      level?: AnonymizationLevel;
    }): Promise<AnonymizationResult[]> => {
      const results: AnonymizationResult[] = [];

      // Traitement séquentiel pour éviter la surcharge
      for (const userId of userIds) {
        const result = await anonymizationService.anonymizeUser(
          userId,
          reason,
          level
        );
        results.push(result);

        // Petite pause entre chaque traitement
        await new Promise((resolve) => setTimeout(resolve, 100));
      }

      return results;
    },
    onSuccess: (results) => {
      const successful = results.filter((r) => r.success).length;
      const failed = results.filter((r) => !r.success).length;

      queryClient.invalidateQueries({ queryKey: ["users"] });

      console.log(
        `✅ Anonymisation en lot terminée: ${successful} succès, ${failed} échecs`
      );
    },
  });

  return {
    // Actions principales
    anonymizeUser: anonymizeUser.mutateAsync,
    anonymizeUsers: anonymizeUsers.mutateAsync,

    // États des mutations
    isAnonymizing: anonymizeUser.isPending,
    isBulkAnonymizing: anonymizeUsers.isPending,

    // Erreurs
    anonymizationError: anonymizeUser.error,
    bulkAnonymizationError: anonymizeUsers.error,

    // Fonction utilitaire pour l'anonymisation avec suppression douce
    anonymizeAndSoftDelete: async (
      userId: string,
      reason: DeletionReason,
      level: AnonymizationLevel = AnonymizationLevel.PARTIAL
    ) => {
      try {
        // 1. Anonymisation des données
        const anonymizationResult = await anonymizeUser.mutateAsync({
          userId,
          reason,
          level,
        });

        if (!anonymizationResult.success) {
          throw new Error(
            `Anonymisation échouée: ${anonymizationResult.error}`
          );
        }

        return {
          success: true,
          anonymizationResult,
          message: `Utilisateur anonymisé avec succès (niveau: ${level})`,
        };
      } catch (error) {
        console.error(
          "Erreur lors de l'anonymisation avec soft delete:",
          error
        );
        return {
          success: false,
          error: error instanceof Error ? error.message : "Erreur inconnue",
          message: "Échec de l'anonymisation",
        };
      }
    },
  };
};

/**
 * Hook utilitaire pour les stratégies d'anonymisation prédéfinies
 */
export const useAnonymizationStrategies = () => {
  const { anonymizeAndSoftDelete } = useAnonymization();

  return {
    // Suppression RGPD complète (anonymisation immédiate)
    gdprCompliantDeletion: (userId: string) =>
      anonymizeAndSoftDelete(
        userId,
        DeletionReason.GDPR_COMPLIANCE,
        AnonymizationLevel.PARTIAL
      ),

    // Suppression utilisateur standard (conservation temporaire)
    userRequestedDeletion: (userId: string) =>
      anonymizeAndSoftDelete(
        userId,
        DeletionReason.USER_REQUEST,
        AnonymizationLevel.PARTIAL
      ),

    // Suppression administrative (conservation pour audit)
    adminDeletion: (userId: string) =>
      anonymizeAndSoftDelete(
        userId,
        DeletionReason.ADMIN_ACTION,
        AnonymizationLevel.PARTIAL
      ),

    // Purge complète (violation de politique)
    policyViolationPurge: (userId: string) =>
      anonymizeAndSoftDelete(
        userId,
        DeletionReason.POLICY_VIOLATION,
        AnonymizationLevel.FULL
      ),
  };
};
