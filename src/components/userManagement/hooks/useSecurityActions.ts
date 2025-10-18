import { useState, useEffect } from "react";
import { supabase } from "../../../lib/supabaseClient";
import { useAuditLog } from "./useAuditLog";
import { Tables } from "../../../types";

export interface SecurityAction {
  type: "password_reset" | "force_logout" | "account_lock" | "account_unlock";
  userId: string;
  reason?: string;
  duration?: number; // en minutes pour les blocages temporaires
}

// Utilise les types de la base de données - SUPPRESSION DE UserSession
export type UserProfile = Tables<"profiles">;

export const useSecurityActions = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const { logAction } = useAuditLog();

  // Fonction de diagnostic (désactivée côté client, pas de Service Role ici)
  const testSupabaseAdminConfig = async () => false;

  // Récupère les informations utilisateur pour les actions de sécurité
  const getUserProfile = async (
    userId: string
  ): Promise<UserProfile | null> => {
    const { data, error } = await supabase
      .from("profiles")
      .select("*")
      .eq("id", userId)
      .single();

    if (error) {
      console.error("Error fetching user profile:", error);
      return null;
    }

    return data;
  };

  // Réinitialise le mot de passe d'un utilisateur
  const resetPassword = async (userId: string, reason?: string) => {
    try {
      setLoading(true);
      setError(null);

      // Récupère les informations utilisateur
      const userProfile = await getUserProfile(userId);
      if (!userProfile) {
        throw new Error("Utilisateur non trouvé");
      }

      if (!userProfile.email) {
        throw new Error("Aucune adresse email trouvée pour cet utilisateur");
      }

      // Pas de vérification via auth admin côté client

      if (import.meta.env.DEV) {
        console.log(
          `Tentative d'envoi d'email de réinitialisation à: ${userProfile.email}`
        );
      }

      // Déterminer l'URL de redirection basée sur le rôle de l'utilisateur
      const getRedirectUrl = (userRole: string) => {
        // URL de l'application client (à configurer selon votre setup)
        const CLIENT_APP_URL =
          import.meta.env.VITE_CLIENT_APP_URL || "https://your-client-app.com";

        switch (userRole.toLowerCase()) {
          case "admin":
            // Les admins utilisent le back-office
            return `${window.location.origin}/reset-password`;
          case "traveler":
          case "property_owner":
          case "service_provider":
            // Les utilisateurs finaux utilisent l'app client
            return `${CLIENT_APP_URL}/reset-password`;
          default:
            // Par défaut, utiliser l'app client
            return `${CLIENT_APP_URL}/reset-password`;
        }
      };

      const redirectUrl = getRedirectUrl(userProfile.role);

      if (import.meta.env.DEV) {
        console.log(
          `URL de redirection pour ${userProfile.role}:`,
          redirectUrl
        );
      }

      // Méthode 1: Utiliser resetPasswordForEmail (recommandé)
      const { error: resetError } = await supabase.auth.resetPasswordForEmail(
        userProfile.email,
        {
          redirectTo: redirectUrl,
        }
      );

      if (resetError) {
        if (import.meta.env.DEV) {
          console.error("Erreur avec resetPasswordForEmail:", resetError);
        }

        throw new Error(
          `Erreur lors de l'envoi de l'email: ${resetError.message}`
        );
      }

      if (import.meta.env.DEV) {
        console.log("Email de réinitialisation envoyé avec succès");
      }

      // Log l'action dans l'audit
      await logAction(
        "password_reset",
        userId,
        `Réinitialisation de mot de passe envoyée à ${userProfile.email}`,
        "system",
        { reason, email: userProfile.email }
      );

      return {
        success: true,
        message: "Email de réinitialisation envoyé avec succès",
        userId,
        email: userProfile.email,
        timestamp: new Date().toISOString(),
      };
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : "Unknown error";
      setError(errorMessage);
      throw err;
    } finally {
      setLoading(false);
    }
  };

  // Force logout supprimé

  // Verrouille temporairement un compte avec invalidation de session
  const lockAccount = async (
    userId: string,
    duration: number = 60,
    reason?: string
  ) => {
    try {
      setLoading(true);
      setError(null);

      const lockedUntil = new Date(Date.now() + duration * 60000);

      // 1. D'abord verrouiller en base de données (comme avant)
      const { data: lockData, error: lockError } = await supabase
        .from("profiles")
        .update({
          account_locked: true,
          locked_until: lockedUntil.toISOString(),
          lock_reason: reason || "Verrouillage par un administrateur",
        })
        .eq("id", userId)
        .select();

      if (lockError) {
        throw new Error(`Failed to lock user account: ${lockError.message}`);
      }

      // 2. Ensuite invalider les sessions via Edge Function
      let sessionInvalidated = false;
      try {
        const { data: sessionData, error: sessionError } =
          await supabase.functions.invoke("invalidate-user-session", {
            body: { userId },
          });

        if (sessionError) {
          console.error("Session invalidation failed:", sessionError);
        } else if (sessionData?.success) {
          sessionInvalidated = true;
          console.log("Sessions invalidated successfully");
        }
      } catch (sessionErr) {
        console.error("Session invalidation error:", sessionErr);
        // On continue même si l'invalidation échoue, car l'utilisateur est déjà verrouillé
      }

      // Récupère les informations utilisateur pour les logs
      const userProfile = await getUserProfile(userId);

      // Log l'action dans l'audit
      await logAction(
        "account_lock",
        userId,
        `Compte verrouillé jusqu'à ${lockedUntil.toLocaleString()}${
          userProfile ? ` pour ${userProfile.email}` : ""
        } - Session invalidée: ${sessionInvalidated ? "Oui" : "Non"}`,
        "system",
        {
          reason,
          duration,
          lockedUntil: lockedUntil.toISOString(),
          sessionInvalidated,
        }
      );

      return {
        success: true,
        message: `Compte verrouillé pendant ${duration} minutes${
          sessionInvalidated
            ? " et sessions invalidées"
            : " (échec invalidation session)"
        }`,
        userId,
        lockedUntil: lockedUntil.toISOString(),
        reason,
        sessionInvalidated,
        timestamp: new Date().toISOString(),
      };
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : "Unknown error";
      setError(errorMessage);
      throw err;
    } finally {
      setLoading(false);
    }
  };

  // Déverrouille un compte via Edge Function
  const unlockAccount = async (userId: string, reason?: string) => {
    try {
      setLoading(true);
      setError(null);

      // Appeler la Edge Function pour déverrouiller
      const { data, error } = await supabase.functions.invoke("unlock-user", {
        body: {
          userId,
        },
      });

      if (error) throw error;

      if (!data.success) {
        throw new Error(data.error || "Failed to unlock user account");
      }

      // Récupère les informations utilisateur pour les logs
      const userProfile = await getUserProfile(userId);

      // Log l'action dans l'audit (déjà fait côté Edge Function)
      await logAction(
        "account_unlock",
        userId,
        `Compte déverrouillé${userProfile ? ` pour ${userProfile.email}` : ""}`,
        "system",
        { reason }
      );

      return {
        success: true,
        message: "Compte déverrouillé avec succès",
        userId,
        reason,
        timestamp: new Date().toISOString(),
      };
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : "Unknown error";
      setError(errorMessage);
      throw err;
    } finally {
      setLoading(false);
    }
  };

  // SESSIONS PERSONNALISÉES SUPPRIMÉES - Plus de dépendance à user_sessions

  // Fonction pour créer un utilisateur via l'Edge Function
  const createUserWithAuth = async (userData: {
    email: string;
    role: string;
    full_name?: string | null;
    phone?: string | null;
    profile_validated?: boolean;
    vip_subscription?: boolean;
  }) => {
    try {
      setLoading(true);
      setError(null);

      // Récupérer le token de session actuel
      const {
        data: { session },
        error: sessionError,
      } = await supabase.auth.getSession();
      if (sessionError) throw sessionError;
      if (!session) throw new Error("No active session");

      // Appeler l'Edge Function avec le token JWT
      const { data, error } = await supabase.functions.invoke("create-user", {
        body: {
          email: userData.email,
          role: userData.role,
          full_name: userData.full_name ?? null,
          phone: userData.phone ?? null,
          profile_validated: userData.profile_validated ?? false,
          vip_subscription: userData.vip_subscription ?? false,
        },
      });

      if (error) throw error;

      // Log l'action dans l'audit
      await logAction(
        "user_creation",
        data.user.id,
        `Nouvel utilisateur créé : ${userData.email}`,
        "system",
        {
          email: userData.email,
          role: userData.role,
          created_by: "admin_interface",
        }
      );

      return {
        success: true,
        profile: data.profile,
        message: "Utilisateur créé avec succès",
      };
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : "Unknown error";
      setError(errorMessage);
      throw err;
    } finally {
      setLoading(false);
    }
  };

  // ===== LOGIQUE AUTO-UNLOCK =====

  // Fonction pour vérifier et débloquer les comptes expirés en base de données
  const checkAndUnlockExpiredAccountsInDB = async () => {
    // Non supporté côté client sans Service Role
    return;
  };

  // Fonction pour vérifier si un compte spécifique est expiré (côté client)
  const isAccountLockExpired = (user: UserProfile): boolean => {
    if (!user.account_locked || !user.locked_until) {
      return false;
    }

    const now = new Date();
    const unlockDate = new Date(user.locked_until);
    return now > unlockDate;
  };

  // Fonction pour traiter une liste d'utilisateurs et marquer les comptes expirés
  const processUsersWithExpiredLocks = (
    users: UserProfile[]
  ): UserProfile[] => {
    return users.map((user) => {
      if (isAccountLockExpired(user)) {
        return {
          ...user,
          account_locked: false,
          locked_until: null,
          lock_reason: null,
        };
      }
      return user;
    });
  };

  // Vérification périodique automatique (toutes les 5 minutes)
  useEffect(() => {
    // Vérification immédiate
    checkAndUnlockExpiredAccountsInDB();

    // Puis vérification toutes les 5 minutes
    const interval = setInterval(
      checkAndUnlockExpiredAccountsInDB,
      5 * 60 * 1000
    );

    return () => clearInterval(interval);
  }, []);

  return {
    // Actions manuelles
    resetPassword,
    lockAccount,
    unlockAccount,
    createUserWithAuth,

    // Auto-unlock utilities
    checkAndUnlockExpiredAccountsInDB,
    isAccountLockExpired,
    processUsersWithExpiredLocks,

    // Diagnostic
    testSupabaseAdminConfig,

    // State
    loading,
    error,
  };
};
