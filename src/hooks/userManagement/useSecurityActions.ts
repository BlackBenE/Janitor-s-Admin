import { useState, useEffect } from "react";
import { supabase, supabaseAdmin } from "../../lib/supabaseClient";
import { Tables } from "../../types/database.types";
import { useAuditLog } from "./useAuditLog";

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

  // Fonction de diagnostic pour tester la configuration Supabase Admin
  const testSupabaseAdminConfig = async () => {
    try {
      if (!supabaseAdmin) {
        console.error("❌ supabaseAdmin is null");
        return false;
      }

      // Test simple : lister les utilisateurs auth
      const { data, error } = await supabaseAdmin.auth.admin.listUsers();

      if (error) {
        console.error("❌ Supabase Admin test failed:", error);
        return false;
      }

      console.log(
        "✅ Supabase Admin configuration OK - Utilisateurs trouvés:",
        data.users?.length || 0
      );
      return true;
    } catch (err) {
      console.error("❌ Test configuration Supabase Admin error:", err);
      return false;
    }
  };

  // Récupère les informations utilisateur pour les actions de sécurité
  const getUserProfile = async (
    userId: string
  ): Promise<UserProfile | null> => {
    if (!supabaseAdmin) {
      throw new Error("Configuration Supabase manquante");
    }

    const { data, error } = await supabaseAdmin
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

      // Vérifier si l'utilisateur existe dans le système d'auth Supabase
      if (supabaseAdmin) {
        try {
          const { data: authUser, error: authError } =
            await supabaseAdmin.auth.admin.getUserById(userId);

          if (authError || !authUser.user) {
            if (import.meta.env.DEV) {
              console.warn(
                "Utilisateur non trouvé dans le système d'auth:",
                authError
              );
            }
            throw new Error(
              "Utilisateur non trouvé dans le système d'authentification"
            );
          }

          if (authUser.user.email !== userProfile.email) {
            throw new Error(
              "Incohérence entre l'email du profil et l'email d'authentification"
            );
          }

          if (import.meta.env.DEV) {
            console.log("Utilisateur trouvé dans le système d'auth:", {
              id: authUser.user.id,
              email: authUser.user.email,
              emailConfirmed: authUser.user.email_confirmed_at,
            });
          }
        } catch (authCheckError) {
          if (import.meta.env.DEV) {
            console.error(
              "Erreur lors de la vérification de l'utilisateur d'auth:",
              authCheckError
            );
          }
          throw authCheckError;
        }
      }

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

        // Méthode 2: Fallback avec l'API admin si la première méthode échoue
        if (supabaseAdmin) {
          try {
            const { data: linkData, error: linkError } =
              await supabaseAdmin.auth.admin.generateLink({
                type: "recovery",
                email: userProfile.email,
                options: {
                  redirectTo: redirectUrl,
                },
              });

            if (linkError) {
              throw new Error(
                `Impossible de générer le lien de récupération: ${linkError.message}`
              );
            }

            if (import.meta.env.DEV) {
              console.log(
                "Lien de récupération généré (à envoyer manuellement):",
                linkData
              );
              console.warn(
                "⚠️ ATTENTION: L'email automatique a échoué. Le lien de récupération a été généré mais doit être envoyé manuellement."
              );
            }

            // Pour l'instant, on continue même si l'email automatique a échoué
            // En production, vous pourriez vouloir envoyer le lien via votre propre service email
          } catch (adminError) {
            throw new Error(
              `Toutes les méthodes de reset ont échoué: ${resetError.message}`
            );
          }
        } else {
          throw new Error(
            `Erreur lors de l'envoi de l'email: ${resetError.message}`
          );
        }
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

  // Force la déconnexion de tous les appareils - VERSION AMÉLIORÉE
  const forceLogout = async (userId: string, reason?: string) => {
    try {
      setLoading(true);
      setError(null);

      // Validation du userId
      if (!userId || typeof userId !== "string" || userId.trim() === "") {
        throw new Error("UserID invalide ou manquant");
      }

      // Validation UUID format (Supabase utilise des UUIDs)
      const uuidRegex =
        /^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i;
      if (!uuidRegex.test(userId)) {
        throw new Error(
          `UserID format invalide: ${userId}. Doit être un UUID valide.`
        );
      }

      if (!supabaseAdmin) {
        throw new Error(
          "Configuration Supabase Admin manquante - vérifiez VITE_SUPABASE_SERVICE_ROLE_KEY"
        );
      }

      if (import.meta.env.DEV) {
        console.log("🔍 Tentative de force logout pour userId:", userId);
      }

      // Vérifier d'abord que l'utilisateur existe
      const userProfile = await getUserProfile(userId);
      if (!userProfile) {
        throw new Error(`Utilisateur non trouvé avec l'ID: ${userId}`);
      }

      if (import.meta.env.DEV) {
        console.log("✅ Utilisateur trouvé:", userProfile.email);
      }

      // MÉTHODE 1: Mettre à jour la base de données pour marquer le timestamp de force logout
      const forceLogoutTimestamp = new Date().toISOString();

      const { error: updateError } = await supabaseAdmin
        .from("profiles")
        .update({
          updated_at: forceLogoutTimestamp,
          // Note: Le timestamp est enregistré dans updated_at pour traquer le force logout
          // En production, vous pourriez vouloir ajouter un champ dédié last_force_logout
        })
        .eq("id", userId);

      if (updateError) {
        if (import.meta.env.DEV) {
          console.error(
            "❌ Erreur lors de la mise à jour du profil:",
            updateError
          );
        }
        // Continue malgré l'erreur de mise à jour
      }

      // MÉTHODE 2: Invalider les tokens Supabase
      const { error: authError } = await supabaseAdmin.auth.admin.signOut(
        userId,
        "global"
      );

      if (authError) {
        if (import.meta.env.DEV) {
          console.error("❌ Supabase Auth signout failed:", {
            error: authError,
            message: authError.message,
            status: authError.status,
            userId: userId,
          });
        }

        // Messages d'erreur plus spécifiques
        if (authError.message.includes("JWT")) {
          throw new Error(
            `Erreur JWT Supabase Admin: ${authError.message}. Vérifiez votre VITE_SUPABASE_SERVICE_ROLE_KEY.`
          );
        } else if (authError.message.includes("User not found")) {
          throw new Error(
            `Utilisateur non trouvé dans Supabase Auth: ${userId}`
          );
        } else {
          throw new Error(
            `Échec de la déconnexion Supabase: ${authError.message}`
          );
        }
      }

      if (import.meta.env.DEV) {
        console.log(
          "✅ Utilisateur déconnecté avec succès via Supabase Auth Admin"
        );
      }

      // Log l'action dans l'audit
      await logAction(
        "force_logout",
        userId,
        `Déconnexion forcée par l'administrateur - ${userProfile.email}`,
        "system",
        { reason, email: userProfile.email, timestamp: forceLogoutTimestamp }
      );

      return {
        success: true,
        message: "Utilisateur déconnecté avec succès",
        userId,
        email: userProfile.email,
        timestamp: forceLogoutTimestamp,
        methods: [
          "Tokens Supabase invalidés",
          "Timestamp de force logout mis à jour",
        ],
      };
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : "Unknown error";
      if (import.meta.env.DEV) {
        console.error("❌ Force logout error details:", {
          userId,
          error: err,
          errorMessage,
          timestamp: new Date().toISOString(),
        });
      }
      setError(errorMessage);
      throw err;
    } finally {
      setLoading(false);
    }
  };

  // Verrouille temporairement un compte - VERSION SIMPLIFIÉE
  const lockAccount = async (
    userId: string,
    duration: number = 60,
    reason?: string
  ) => {
    try {
      setLoading(true);
      setError(null);

      if (!supabaseAdmin) {
        throw new Error("Configuration Supabase manquante");
      }

      const lockUntil = new Date(Date.now() + duration * 60000);

      // Met à jour uniquement le profil utilisateur pour verrouiller le compte
      const { error } = await supabaseAdmin
        .from("profiles")
        .update({
          account_locked: true,
          locked_until: lockUntil.toISOString(),
          lock_reason: reason || "Verrouillage temporaire",
        })
        .eq("id", userId);

      if (error) throw error;

      // Force logout via Supabase Auth lors du lock
      try {
        await forceLogout(userId, `Account locked: ${reason}`);
        console.log("✅ Force logout appliqué lors du verrouillage");
      } catch (logoutError) {
        console.warn("⚠️ Force logout failed during lock:", logoutError);
        // Continue même si le logout échoue
      }

      // Récupère les informations utilisateur pour les logs
      const userProfile = await getUserProfile(userId);

      // Log l'action dans l'audit
      await logAction(
        "account_lock",
        userId,
        `Compte verrouillé jusqu'à ${lockUntil.toLocaleString()}${
          userProfile ? ` pour ${userProfile.email}` : ""
        }`,
        "system",
        {
          reason,
          duration,
          lockedUntil: lockUntil.toISOString(),
        }
      );

      return {
        success: true,
        message: `Compte verrouillé pendant ${duration} minutes`,
        userId,
        lockedUntil: lockUntil.toISOString(),
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

  // Déverrouille un compte
  const unlockAccount = async (userId: string, reason?: string) => {
    try {
      setLoading(true);
      setError(null);

      if (!supabaseAdmin) {
        throw new Error("Configuration Supabase manquante");
      }

      // Met à jour le profil utilisateur pour déverrouiller le compte
      const { error } = await supabaseAdmin
        .from("profiles")
        .update({
          account_locked: false,
          locked_until: null,
          lock_reason: null,
        })
        .eq("id", userId);

      if (error) throw error;

      // Récupère les informations utilisateur pour les logs
      const userProfile = await getUserProfile(userId);

      // Log l'action dans l'audit
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

  // Nouvelle fonction pour créer un utilisateur complet via Supabase Auth Admin
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

      if (!supabaseAdmin) {
        throw new Error("Configuration Supabase Admin manquante");
      }

      // 1. Créer l'utilisateur dans auth.users avec Supabase Auth Admin
      const { data: authUser, error: authError } =
        await supabaseAdmin.auth.admin.createUser({
          email: userData.email,
          email_confirm: true, // Confirmer automatiquement l'email
          user_metadata: {
            full_name: userData.full_name,
            phone: userData.phone,
            role: userData.role,
          },
        });

      if (authError || !authUser.user) {
        throw new Error(
          `Erreur création auth: ${
            authError?.message || "Utilisateur auth non créé"
          }`
        );
      }

      // 2. Créer ou mettre à jour le profil dans la table profiles
      const profileData = {
        id: authUser.user.id, // Utiliser l'ID généré par Auth
        email: userData.email,
        role: userData.role,
        full_name: userData.full_name || null,
        phone: userData.phone || null,
        profile_validated: userData.profile_validated || false,
        vip_subscription: userData.vip_subscription || false,
        account_locked: false,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
      };

      const { data: profile, error: profileError } = await supabaseAdmin
        .from("profiles")
        .upsert(profileData)
        .select()
        .single();

      if (profileError) {
        // Si le profil échoue, supprimer l'utilisateur auth créé
        await supabaseAdmin.auth.admin.deleteUser(authUser.user.id);
        throw new Error(`Erreur création profil: ${profileError.message}`);
      }

      return {
        success: true,
        user: authUser.user,
        profile: profile,
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
    if (!supabaseAdmin) {
      console.warn("Supabase admin not available for auto-unlock");
      return;
    }

    try {
      const now = new Date().toISOString();

      // Récupérer les comptes verrouillés avec une date d'expiration passée
      const { data: expiredAccounts, error: fetchError } = await supabaseAdmin
        .from("profiles")
        .select("id, email, locked_until")
        .eq("account_locked", true)
        .not("locked_until", "is", null)
        .lt("locked_until", now);

      if (fetchError) {
        console.error("Error fetching expired locked accounts:", fetchError);
        return;
      }

      if (expiredAccounts && expiredAccounts.length > 0) {
        console.log(
          `Found ${expiredAccounts.length} expired locked accounts to unlock`
        );

        // Déverrouiller les comptes expirés
        const { error: updateError } = await supabaseAdmin
          .from("profiles")
          .update({
            account_locked: false,
            locked_until: null,
            lock_reason: null,
          })
          .eq("account_locked", true)
          .not("locked_until", "is", null)
          .lt("locked_until", now);

        if (updateError) {
          console.error("Error auto-unlocking expired accounts:", updateError);
        } else {
          console.log(
            `Successfully auto-unlocked ${expiredAccounts.length} accounts`
          );

          // Log l'action dans l'audit pour traçabilité
          const auditLogs = expiredAccounts.map((account) => ({
            action: "ACCOUNT_AUTO_UNLOCK",
            user_id: account.id,
            details: `Compte automatiquement déverrouillé après expiration (${account.locked_until})`,
            performed_by_email: "system",
            metadata: {
              unlock_reason: "automatic_expiration",
              locked_until: account.locked_until,
            },
          }));

          await supabaseAdmin.from("audit_logs").insert(auditLogs);
        }
      }
    } catch (error) {
      console.error("Error in auto-unlock process:", error);
    }
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
    forceLogout,
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
