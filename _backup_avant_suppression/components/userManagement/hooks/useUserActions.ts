/**
 * 🔄 User Actions Hook - ÉTAPE 3 : FUSION COMPLÈTE
 *
 * Hook unifié pour toutes les actions business utilisateurs:
 * - useUserMutations.ts (360 lignes) ✅
 * - useBulkActions.ts (176 lignes) ✅
 * - useSmartDeletion.ts (193 lignes) ✅
 * - Partie actions useAnonymization.ts (~24 lignes) ✅
 *
 * PHASE 4B - FUSION ÉTAPE 3/4 - FUSION 1 TERMINÉE
 */

import { useCallback } from "react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "../../../lib/supabaseClient";
import { USER_QUERY_KEYS } from "./useUserQueries";
import { dataProvider } from "../../../providers/dataProvider";
import { anonymizationService } from "../../../services/anonymizationService";
import type { UserProfile } from "../../../types/userManagement";
import {
  DeletionReason,
  AnonymizationLevel,
  AnonymizationResult,
  UserDeletionData,
} from "../../../types/dataRetention";

// ========================================
// INTERFACES
// ========================================
interface UseBulkActionsProps {
  users: UserProfile[];
  selectedUsers: string[];
  clearUserSelection: () => void;
  showNotification: (message: string, severity: "success" | "error") => void;
  updateUser: any; // Référence vers updateUser mutation
  softDeleteUser: any; // Référence vers softDeleteUser mutation
}

/**
 * Hook unifié pour mutations CRUD + actions en lot
 */
export const useUserActions = (bulkActionsProps?: UseBulkActionsProps) => {
  const queryClient = useQueryClient();

  // ========================================
  // SECTION 1: MUTATIONS CRUD DE BASE (ex-useUserMutations)
  // ========================================

  // Créer un utilisateur (via Edge Function)
  const createUser = useMutation({
    mutationFn: async (userData: {
      email: string;
      full_name?: string;
      phone?: string;
      role?: string;
      profile_validated?: boolean;
      vip_subscription?: boolean;
    }) => {
      const { data, error } = await supabase.functions.invoke("create-user", {
        body: {
          email: userData.email,
          role: userData.role || "traveler",
          full_name: userData.full_name || null,
          phone: userData.phone || null,
          profile_validated: userData.profile_validated || false,
          vip_subscription: userData.vip_subscription || false,
        },
      });

      if (error) {
        throw new Error(
          `Erreur lors de la création de l'utilisateur: ${error.message}`
        );
      }

      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: USER_QUERY_KEYS.lists() });
      queryClient.invalidateQueries({ queryKey: USER_QUERY_KEYS.stats() });
    },
  });

  // Mettre à jour un utilisateur
  const updateUser = useMutation({
    mutationFn: async ({
      userId,
      updates,
    }: {
      userId: string;
      updates: Partial<UserProfile>;
    }) => {
      const { data, error } = await supabase
        .from("profiles")
        .update(updates)
        .eq("id", userId)
        .select()
        .single();

      if (error) {
        throw new Error(`Erreur lors de la mise à jour: ${error.message}`);
      }

      return data;
    },
    onSuccess: (data, variables) => {
      queryClient.setQueryData(USER_QUERY_KEYS.detail(variables.userId), data);
      queryClient.invalidateQueries({ queryKey: USER_QUERY_KEYS.lists() });
    },
  });

  // Supprimer un utilisateur (soft delete)
  const deleteUser = useMutation({
    mutationFn: async (userId: string) => {
      const { data, error } = await supabase
        .from("profiles")
        .update({
          is_deleted: true,
          deleted_at: new Date().toISOString(),
        })
        .eq("id", userId)
        .select()
        .single();

      if (error) {
        throw new Error(`Erreur lors de la suppression: ${error.message}`);
      }

      return data;
    },
    onSuccess: (data, userId) => {
      queryClient.removeQueries({ queryKey: USER_QUERY_KEYS.detail(userId) });
      queryClient.invalidateQueries({ queryKey: USER_QUERY_KEYS.lists() });
      queryClient.invalidateQueries({ queryKey: USER_QUERY_KEYS.stats() });
    },
  });

  // Supprimer plusieurs utilisateurs
  const deleteManyUsers = useMutation({
    mutationFn: async (userIds: string[]) => {
      const { data, error } = await supabase
        .from("profiles")
        .update({
          is_deleted: true,
          deleted_at: new Date().toISOString(),
        })
        .in("id", userIds)
        .select();

      if (error) {
        throw new Error(
          `Erreur lors de la suppression multiple: ${error.message}`
        );
      }

      return data;
    },
    onSuccess: (data, userIds) => {
      userIds.forEach((userId) => {
        queryClient.removeQueries({ queryKey: USER_QUERY_KEYS.detail(userId) });
      });
      queryClient.invalidateQueries({ queryKey: USER_QUERY_KEYS.lists() });
      queryClient.invalidateQueries({ queryKey: USER_QUERY_KEYS.stats() });
    },
  });

  // Restaurer un utilisateur supprimé
  const restoreUser = useMutation({
    mutationFn: async (userId: string) => {
      const { data, error } = await supabase
        .from("profiles")
        .update({
          is_deleted: false,
          deleted_at: null,
        })
        .eq("id", userId)
        .select()
        .single();

      if (error) {
        throw new Error(`Erreur lors de la restauration: ${error.message}`);
      }

      return data;
    },
    onSuccess: (data, userId) => {
      queryClient.setQueryData(USER_QUERY_KEYS.detail(userId), data);
      queryClient.invalidateQueries({ queryKey: USER_QUERY_KEYS.lists() });
      queryClient.invalidateQueries({ queryKey: USER_QUERY_KEYS.stats() });
    },
  });

  // Verrouiller un compte
  const lockUser = useMutation({
    mutationFn: async ({
      userId,
      duration = 60,
      reason,
    }: {
      userId: string;
      duration?: number;
      reason?: string;
    }) => {
      const lockedUntil = new Date(Date.now() + duration * 60000);

      const { data, error } = await supabase
        .from("profiles")
        .update({
          account_locked: true,
          locked_until: lockedUntil.toISOString(),
          lock_reason: reason || "Verrouillage par un administrateur",
        })
        .eq("id", userId)
        .select()
        .single();

      if (error) {
        throw new Error(`Erreur lors du verrouillage: ${error.message}`);
      }

      return data;
    },
    onSuccess: (data, variables) => {
      queryClient.setQueryData(USER_QUERY_KEYS.detail(variables.userId), data);
      queryClient.invalidateQueries({ queryKey: USER_QUERY_KEYS.lists() });
    },
  });

  // Déverrouiller un compte
  const unlockUser = useMutation({
    mutationFn: async (userId: string) => {
      const { data, error } = await supabase
        .from("profiles")
        .update({
          account_locked: false,
          locked_until: null,
          lock_reason: null,
        })
        .eq("id", userId)
        .select()
        .single();

      if (error) {
        throw new Error(`Erreur lors du déverrouillage: ${error.message}`);
      }

      return data;
    },
    onSuccess: (data, userId) => {
      queryClient.setQueryData(USER_QUERY_KEYS.detail(userId), data);
      queryClient.invalidateQueries({ queryKey: USER_QUERY_KEYS.lists() });
    },
  });

  // Renouveler un abonnement
  const renewSubscription = useMutation({
    mutationFn: async ({
      subscriptionId,
      newPeriodEnd,
      amount,
    }: {
      subscriptionId: string;
      newPeriodEnd: string;
      amount: number;
    }) => {
      const { data, error } = await supabase
        .from("subscriptions")
        .update({
          period_end: newPeriodEnd,
          updated_at: new Date().toISOString(),
        })
        .eq("id", subscriptionId)
        .select()
        .single();

      if (error) {
        throw new Error(`Erreur lors du renouvellement: ${error.message}`);
      }

      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: [...USER_QUERY_KEYS.all, "subscriptions"],
      });
    },
  });

  // ========================================
  // SECTION 2: ANONYMIZATION ACTIONS (ex-useAnonymization partie actions)
  // ========================================

  // Anonymiser un utilisateur
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
        queryClient.invalidateQueries({ queryKey: ["users"] });
        console.log(`Utilisateur ${result.user_id} anonymisé avec succès`, {
          level: result.anonymization_level,
          fields: result.anonymized_fields,
          preservedUntil: result.preserved_data_until,
          scheduledPurge: result.scheduled_purge_at,
        });
      } else {
        console.error(
          `Erreur lors de l'anonymisation de ${result.user_id}:`,
          result.error
        );
      }
    },
  });

  // Anonymisation en lot
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

      for (const userId of userIds) {
        try {
          const result = await anonymizationService.anonymizeUser(
            userId,
            reason,
            level
          );
          results.push(result);
          // Pause entre chaque traitement
          await new Promise((resolve) => setTimeout(resolve, 100));
        } catch (error) {
          console.error(`Erreur anonymisation pour ${userId}:`, error);
          results.push({
            success: false,
            user_id: userId,
            error: error instanceof Error ? error.message : "Erreur inconnue",
          } as AnonymizationResult);
        }
      }

      return results;
    },
    onSuccess: (results) => {
      const successful = results.filter((r) => r.success).length;
      const failed = results.filter((r) => !r.success).length;
      queryClient.invalidateQueries({ queryKey: ["users"] });
      console.log(
        `Anonymisation en lot terminée: ${successful} succès, ${failed} échecs`
      );
    },
  });

  // Helper pour anonymisation + soft delete combiné
  const anonymizeAndSoftDelete = async (
    userId: string,
    reason: DeletionReason,
    level: AnonymizationLevel = AnonymizationLevel.PARTIAL
  ): Promise<AnonymizationResult> => {
    return await anonymizationService.anonymizeUser(userId, reason, level);
  };

  // ========================================
  // SECTION 3: SMART DELETION (ex-useSmartDeletion)
  // ========================================

  // Suppression intelligente avec anonymisation
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
        scheduled_purge_at: anonymizationResult.scheduled_purge_at,
      };
    },
    onSuccess: (result) => {
      queryClient.invalidateQueries({ queryKey: USER_QUERY_KEYS.all });
      console.log(
        `✅ Suppression intelligente réussie pour ${result.user_id}`,
        {
          deletedAt: result.deleted_at,
          anonymizationLevel: result.anonymization_level,
          scheduledPurge: result.scheduled_purge_at,
        }
      );
    },
  });

  // Suppression intelligente en lot
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
        }

        // Pause entre chaque traitement
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

  // Stratégies prédéfinies de suppression intelligente
  const smartDeletionStrategies = {
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
        customReason: customReason || "Violation des conditions d'utilisation",
      }),
  };

  // ========================================
  // SECTION 3: BULK ACTIONS (ex-useBulkActions)
  // ========================================

  const getSelectedUsersList = useCallback(() => {
    if (!bulkActionsProps) return [];
    return bulkActionsProps.users.filter((u) =>
      bulkActionsProps.selectedUsers.includes(u.id)
    );
  }, [bulkActionsProps]);

  const handleBulkValidate = useCallback(async () => {
    if (!bulkActionsProps) return;

    try {
      const selectedUsersList = getSelectedUsersList();

      for (const user of selectedUsersList) {
        await updateUser.mutateAsync({
          userId: user.id,
          updates: { profile_validated: true },
        });
      }

      bulkActionsProps.showNotification(
        "Utilisateurs validés en masse",
        "success"
      );
      bulkActionsProps.clearUserSelection();
    } catch (error) {
      bulkActionsProps.showNotification(
        "Erreur lors de la validation en masse",
        "error"
      );
    }
  }, [getSelectedUsersList, updateUser, bulkActionsProps]);

  const handleBulkSetPending = useCallback(async () => {
    if (!bulkActionsProps) return;

    try {
      const selectedUsersList = getSelectedUsersList();

      for (const user of selectedUsersList) {
        await updateUser.mutateAsync({
          userId: user.id,
          updates: { profile_validated: false },
        });
      }

      bulkActionsProps.showNotification(
        "Utilisateurs mis en attente en masse",
        "success"
      );
      bulkActionsProps.clearUserSelection();
    } catch (error) {
      bulkActionsProps.showNotification(
        "Erreur lors de la mise en attente en masse",
        "error"
      );
    }
  }, [getSelectedUsersList, updateUser, bulkActionsProps]);

  const handleBulkSuspend = useCallback(async () => {
    if (!bulkActionsProps) return;

    try {
      const selectedUsersList = getSelectedUsersList();

      for (const user of selectedUsersList) {
        await updateUser.mutateAsync({
          userId: user.id,
          updates: { account_locked: true },
        });
      }

      bulkActionsProps.showNotification(
        "Utilisateurs suspendus en masse",
        "success"
      );
      bulkActionsProps.clearUserSelection();
    } catch (error) {
      bulkActionsProps.showNotification(
        "Erreur lors de la suspension en masse",
        "error"
      );
    }
  }, [getSelectedUsersList, updateUser, bulkActionsProps]);

  const handleBulkUnsuspend = useCallback(async () => {
    if (!bulkActionsProps) return;

    try {
      const selectedUsersList = getSelectedUsersList();

      for (const user of selectedUsersList) {
        await updateUser.mutateAsync({
          userId: user.id,
          updates: {
            account_locked: false,
            locked_until: null,
            lock_reason: null,
          },
        });
      }

      bulkActionsProps.showNotification(
        "Utilisateurs débloqués en masse",
        "success"
      );
      bulkActionsProps.clearUserSelection();
    } catch (error) {
      bulkActionsProps.showNotification(
        "Erreur lors du déblocage en masse",
        "error"
      );
    }
  }, [getSelectedUsersList, updateUser, bulkActionsProps]);

  // Note: handleBulkAddVip, handleBulkRemoveVip et handleBulkActionConfirm
  // ont été déplacés vers useUserInterface car ils gèrent l'état des modales

  // ========================================
  // RETURN - INTERFACE PUBLIQUE
  // ========================================

  return {
    // *** MUTATIONS CRUD DE BASE ***
    createUser,
    updateUser,
    deleteUser,
    deleteManyUsers,
    restoreUser,
    lockUser,
    unlockUser,
    renewSubscription,

    // *** ANONYMIZATION ACTIONS ***
    anonymizeUser: anonymizeUser.mutateAsync,
    anonymizeUsers: anonymizeUsers.mutateAsync,
    anonymizeAndSoftDelete,

    // *** SMART DELETION ***
    softDeleteWithAnonymization: softDeleteWithAnonymization.mutateAsync,
    bulkSmartDeletion: bulkSmartDeletion.mutateAsync,
    smartDeletionStrategies,

    // *** BULK ACTIONS ***
    handleBulkValidate,
    handleBulkSetPending,
    handleBulkSuspend,
    handleBulkUnsuspend,
    // Note: handleBulkAddVip, handleBulkRemoveVip et handleBulkActionConfirm
    // sont maintenant dans useUserInterface car ils gèrent les modales

    // *** ÉTATS DE CHARGEMENT ***
    isCreating: createUser.isPending,
    isUpdating: updateUser.isPending,
    isDeleting: deleteUser.isPending || deleteManyUsers.isPending,
    isRestoring: restoreUser.isPending,
    isLocking: lockUser.isPending,
    isUnlocking: unlockUser.isPending,
    isRenewingSubscription: renewSubscription.isPending,
    isAnonymizing: anonymizeUser.isPending,
    isBulkAnonymizing: anonymizeUsers.isPending,
    isSmartDeleting: softDeleteWithAnonymization.isPending,
    isBulkSmartDeleting: bulkSmartDeletion.isPending,

    // *** ERREURS ***
    createError: createUser.error,
    updateError: updateUser.error,
    deleteError: deleteUser.error || deleteManyUsers.error,
    restoreError: restoreUser.error,
    lockError: lockUser.error,
    unlockError: unlockUser.error,
    renewSubscriptionError: renewSubscription.error,
    anonymizationError: anonymizeUser.error,
    bulkAnonymizationError: anonymizeUsers.error,
    smartDeleteError: softDeleteWithAnonymization.error,
    bulkSmartDeleteError: bulkSmartDeletion.error,

    // *** RESET DES ERREURS ***
    resetErrors: () => {
      createUser.reset();
      updateUser.reset();
      deleteUser.reset();
      deleteManyUsers.reset();
      restoreUser.reset();
      lockUser.reset();
      unlockUser.reset();
      renewSubscription.reset();
      anonymizeUser.reset();
      anonymizeUsers.reset();
      softDeleteWithAnonymization.reset();
      bulkSmartDeletion.reset();
    },
  };
};

/**
 * Type pour l'interface publique du hook - ÉTAPE 1
 */
export type UseUserActionsReturn = ReturnType<typeof useUserActions>;
