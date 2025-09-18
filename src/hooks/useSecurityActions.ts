import { useState } from "react";
import { supabaseAdmin } from "../lib/supabaseClient";
import { Tables } from "../types/database.types";
import { useAuditLog } from "./useAuditLog";

export interface SecurityAction {
  type: "password_reset" | "force_logout" | "account_lock" | "account_unlock";
  userId: string;
  reason?: string;
  duration?: number; // en minutes pour les blocages temporaires
}

// Utilise les types de la base de données
export type UserSession = Tables<"user_sessions">;
export type UserProfile = Tables<"profiles">;

export const useSecurityActions = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const { logAction } = useAuditLog();

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

      if (!supabaseAdmin) {
        throw new Error("Configuration Supabase manquante");
      }

      // Récupère les informations utilisateur
      const userProfile = await getUserProfile(userId);
      if (!userProfile) {
        throw new Error("Utilisateur non trouvé");
      }

      // Utilise l'API Supabase Auth pour envoyer un email de réinitialisation
      const { error } = await supabaseAdmin.auth.admin.inviteUserByEmail(
        userProfile.email,
        {
          data: { password_reset: true },
          redirectTo: `${window.location.origin}/reset-password`,
        }
      );

      if (error) throw error;

      // Log l'action dans l'audit
      await logAction(
        "password_reset",
        `Réinitialisation de mot de passe envoyée à ${userProfile.email}`,
        userId,
        JSON.stringify({ reason, email: userProfile.email })
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

  // Force la déconnexion de tous les appareils
  const forceLogout = async (userId: string, reason?: string) => {
    try {
      setLoading(true);
      setError(null);

      if (!supabaseAdmin) {
        throw new Error("Configuration Supabase manquante");
      }

      // Termine toutes les sessions actives dans la base de données
      const { error: sessionsError } = await supabaseAdmin
        .from("user_sessions")
        .update({
          is_active: false,
          terminated_at: new Date().toISOString(),
        })
        .eq("user_id", userId)
        .eq("is_active", true);

      if (sessionsError) throw sessionsError;

      // Récupère les informations utilisateur pour les logs
      const userProfile = await getUserProfile(userId);

      // Log l'action dans l'audit
      await logAction(
        "force_logout",
        `Déconnexion forcée de tous les appareils${
          userProfile ? ` pour ${userProfile.email}` : ""
        }`,
        userId,
        JSON.stringify({ reason })
      );

      return {
        success: true,
        message: "Utilisateur déconnecté de tous les appareils",
        userId,
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

  // Verrouille temporairement un compte
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

      // Met à jour le profil utilisateur pour verrouiller le compte
      const { error } = await supabaseAdmin
        .from("profiles")
        .update({
          account_locked: true,
          locked_until: lockUntil.toISOString(),
          lock_reason: reason || "Verrouillage temporaire",
        })
        .eq("id", userId);

      if (error) throw error;

      // Termine également toutes les sessions actives
      await supabaseAdmin
        .from("user_sessions")
        .update({
          is_active: false,
          terminated_at: new Date().toISOString(),
        })
        .eq("user_id", userId)
        .eq("is_active", true);

      // Récupère les informations utilisateur pour les logs
      const userProfile = await getUserProfile(userId);

      // Log l'action dans l'audit
      await logAction(
        "account_lock",
        `Compte verrouillé jusqu'à ${lockUntil.toLocaleString()}${
          userProfile ? ` pour ${userProfile.email}` : ""
        }`,
        userId,
        JSON.stringify({
          reason,
          duration,
          lockedUntil: lockUntil.toISOString(),
        })
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
        `Compte déverrouillé${userProfile ? ` pour ${userProfile.email}` : ""}`,
        userId,
        JSON.stringify({ reason })
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

  // Récupère les sessions actives d'un utilisateur
  const getUserSessions = async (userId: string): Promise<UserSession[]> => {
    try {
      setLoading(true);
      setError(null);

      if (!supabaseAdmin) {
        throw new Error("Configuration Supabase manquante");
      }

      // Récupère les sessions depuis la base de données
      const { data, error } = await supabaseAdmin
        .from("user_sessions")
        .select("*")
        .eq("user_id", userId)
        .eq("is_active", true)
        .order("last_activity", { ascending: false });

      if (error) throw error;

      return data || [];
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : "Unknown error";
      setError(errorMessage);
      throw err;
    } finally {
      setLoading(false);
    }
  };

  // Termine une session spécifique
  const terminateSession = async (sessionId: string, userId: string) => {
    try {
      setLoading(true);
      setError(null);

      if (!supabaseAdmin) {
        throw new Error("Configuration Supabase manquante");
      }

      // Termine la session spécifique dans la base de données
      const { error } = await supabaseAdmin
        .from("user_sessions")
        .update({
          is_active: false,
          terminated_at: new Date().toISOString(),
        })
        .eq("id", sessionId)
        .eq("user_id", userId);

      if (error) throw error;

      // Récupère les informations utilisateur pour les logs
      const userProfile = await getUserProfile(userId);

      // Log l'action dans l'audit
      await logAction(
        "session_terminate",
        `Session terminée${userProfile ? ` pour ${userProfile.email}` : ""}`,
        userId,
        JSON.stringify({ sessionId })
      );

      return {
        success: true,
        message: "Session terminée avec succès",
        sessionId,
        userId,
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

  return {
    resetPassword,
    forceLogout,
    lockAccount,
    unlockAccount,
    getUserSessions,
    terminateSession,
    loading,
    error,
  };
};
