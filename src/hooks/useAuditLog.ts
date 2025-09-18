import { useState } from "react";
import { supabaseAdmin } from "../lib/supabaseClient";
import { Database, type Json } from "../types/database.types";

type AuditLogRow = Database["public"]["Tables"]["audit_logs"]["Row"];
type AuditLogInsert = Database["public"]["Tables"]["audit_logs"]["Insert"];

export interface AuditLog {
  id: string;
  action: string;
  details: string | null;
  created_at: string;
  performed_by_email: string | null;
  user_id: string | null;
  metadata?: Record<string, unknown>;
}

export const useAuditLog = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Log une action d'audit
  const logAction = async (
    action: string,
    userId: string,
    details: string,
    adminUser: string,
    metadata?: Record<string, unknown>
  ) => {
    try {
      setLoading(true);
      setError(null);

      if (!supabaseAdmin) {
        throw new Error("Supabase admin client not available");
      }

      const auditEntry: AuditLogInsert = {
        action,
        user_id: userId,
        details,
        performed_by_email: adminUser,
        metadata: (metadata as Json) || {},
      };

      const { data, error } = await supabaseAdmin
        .from("audit_logs")
        .insert(auditEntry)
        .select()
        .single();

      if (error) throw error;

      console.log("Audit log created:", data);
      return data;
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : "Unknown error";
      setError(errorMessage);
      throw err;
    } finally {
      setLoading(false);
    }
  };

  // Récupère les logs d'audit pour un utilisateur
  const getAuditLogs = async (userId: string): Promise<AuditLog[]> => {
    try {
      setLoading(true);
      setError(null);

      if (!supabaseAdmin) {
        throw new Error("Supabase admin client not available");
      }

      const { data, error } = await supabaseAdmin
        .from("audit_logs")
        .select("*")
        .eq("user_id", userId)
        .order("created_at", { ascending: false });

      if (error) throw error;

      // Convertir les données pour correspondre à l'interface AuditLog
      const logs: AuditLog[] = (data || []).map((log: AuditLogRow) => ({
        id: log.id,
        action: log.action,
        details: log.details,
        created_at: log.created_at,
        performed_by_email: log.performed_by_email,
        user_id: log.user_id,
        metadata: (log.metadata as Record<string, unknown>) || {},
      }));

      return logs;
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : "Unknown error";
      setError(errorMessage);
      throw err;
    } finally {
      setLoading(false);
    }
  };

  // Actions courantes d'audit
  const auditActions = {
    USER_CREATED: "Utilisateur Créé",
    USER_UPDATED: "Utilisateur Modifié",
    USER_SUSPENDED: "Utilisateur Suspendu",
    USER_REACTIVATED: "Utilisateur Réactivé",
    PASSWORD_RESET: "Mot de Passe Réinitialisé",
    FORCE_LOGOUT: "Déconnexion Forcée",
    ROLE_CHANGED: "Rôle Modifié",
    VIP_STATUS_CHANGED: "Statut VIP Modifié",
    PROFILE_VALIDATED: "Profil Validé",
    BULK_ACTION: "Action en Masse",
    EXPORT_DATA: "Données Exportées",
  };

  return {
    logAction,
    getAuditLogs,
    auditActions,
    loading,
    error,
  };
};
