/**
 * 🔄 User Mutations Hook
 *
 * Centralise toutes les mutations CRUD de base pour les utilisateurs
 * Mutations complexes (sécurité, anonymisation) sont dans business/
 */

import { useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "../../../lib/supabaseClient";
import { USER_QUERY_KEYS } from "./useUserQueries";
import type { UserProfile } from "../../../types/userManagement";

/**
 * Hook pour les mutations CRUD de base des utilisateurs
 */
export const useUserMutations = () => {
  const queryClient = useQueryClient();

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
      // Utiliser Supabase Edge Function pour créer l'utilisateur avec authentification
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
      // Invalider les caches des listes d'utilisateurs
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
      // Mettre à jour le cache de l'utilisateur spécifique
      queryClient.setQueryData(USER_QUERY_KEYS.detail(variables.userId), data);

      // Invalider les listes pour refléter les changements
      queryClient.invalidateQueries({ queryKey: USER_QUERY_KEYS.lists() });
    },
  });

  // Supprimer un utilisateur (soft delete recommandé)
  const deleteUser = useMutation({
    mutationFn: async (userId: string) => {
      // Soft delete - marquer comme supprimé plutôt que supprimer
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
      // Retirer l'utilisateur des caches
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
      // Nettoyer les caches
      userIds.forEach((userId) => {
        queryClient.removeQueries({ queryKey: USER_QUERY_KEYS.detail(userId) });
      });
      queryClient.invalidateQueries({ queryKey: USER_QUERY_KEYS.lists() });
      queryClient.invalidateQueries({ queryKey: USER_QUERY_KEYS.stats() });
    },
  });

  // Mettre à jour les données calculées d'activité (dans profiles)
  const updateUserActivityData = useMutation({
    mutationFn: async ({
      userId,
      activityData,
    }: {
      userId: string;
      activityData: {
        total_bookings?: number;
        total_spent?: number;
        last_activity_date?: string;
      };
    }) => {
      // Les données d'activité sont maintenant calculées dynamiquement
      // Cette mutation met à jour les champs pertinents dans profiles
      const { data, error } = await supabase
        .from("profiles")
        .update({
          last_activity_date:
            activityData.last_activity_date || new Date().toISOString(),
          updated_at: new Date().toISOString(),
        })
        .eq("id", userId)
        .select()
        .single();

      if (error) {
        throw new Error(
          `Erreur lors de la mise à jour des données d'activité: ${error.message}`
        );
      }

      return data;
    },
    onSuccess: (data, variables) => {
      // Invalider les données de l'utilisateur
      queryClient.invalidateQueries({
        queryKey: USER_QUERY_KEYS.detail(variables.userId),
      });
      queryClient.invalidateQueries({ queryKey: USER_QUERY_KEYS.lists() });
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
      // Mettre à jour les caches
      queryClient.setQueryData(USER_QUERY_KEYS.detail(userId), data);
      queryClient.invalidateQueries({ queryKey: USER_QUERY_KEYS.lists() });
      queryClient.invalidateQueries({ queryKey: USER_QUERY_KEYS.stats() });
    },
  });

  // Mutation pour verrouiller un compte (simple, sans Edge Function)
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

  // Mutation pour déverrouiller un compte (simple)
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
    onSuccess: (data, variables) => {
      // Invalider les caches des subscriptions pour cet utilisateur
      queryClient.invalidateQueries({
        queryKey: [...USER_QUERY_KEYS.all, "subscriptions"],
      });
    },
  });

  return {
    // Mutations CRUD de base
    createUser,
    updateUser,
    deleteUser,
    deleteManyUsers,
    restoreUser,

    // Mutations de sécurité simples
    lockUser,
    unlockUser,

    // Mutations des données d'activité
    updateUserActivityData,

    // Mutations de subscriptions
    renewSubscription,

    // États de chargement groupés
    isCreating: createUser.isPending,
    isUpdating: updateUser.isPending,
    isDeleting: deleteUser.isPending || deleteManyUsers.isPending,
    isRestoring: restoreUser.isPending,
    isLocking: lockUser.isPending,
    isUnlocking: unlockUser.isPending,
    isRenewingSubscription: renewSubscription.isPending,

    // Erreurs groupées
    createError: createUser.error,
    updateError: updateUser.error,
    deleteError: deleteUser.error || deleteManyUsers.error,
    restoreError: restoreUser.error,
    lockError: lockUser.error,
    unlockError: unlockUser.error,
    renewSubscriptionError: renewSubscription.error,

    // Reset des erreurs
    resetErrors: () => {
      createUser.reset();
      updateUser.reset();
      deleteUser.reset();
      deleteManyUsers.reset();
      restoreUser.reset();
      lockUser.reset();
      unlockUser.reset();
      renewSubscription.reset();
    },
  };
};
