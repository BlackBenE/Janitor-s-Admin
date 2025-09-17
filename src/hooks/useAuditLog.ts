import { useState } from "react";

export interface AuditLog {
  id: number;
  action: string;
  details: string;
  timestamp: string;
  admin_user: string;
  user_id: string;
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

      // En production, ceci sauvegarderait dans une table audit_logs
      const auditEntry = {
        action,
        user_id: userId,
        details,
        admin_user: adminUser,
        timestamp: new Date().toISOString(),
        metadata: metadata || {},
      };

      // TODO: Implémenter l'insertion en base de données
      // await supabaseAdmin.from('audit_logs').insert(auditEntry);

      console.log("Audit log created:", auditEntry);
      return auditEntry;
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

      // En production, ceci récupérerait depuis la table audit_logs
      // const { data, error } = await supabaseAdmin
      //   .from('audit_logs')
      //   .select('*')
      //   .eq('user_id', userId)
      //   .order('timestamp', { ascending: false });

      // if (error) throw error;

      // Mock data pour la démonstration
      const mockLogs: AuditLog[] = [
        {
          id: 1,
          action: "Profil Modifié",
          details: "Email changé de ancien@email.com vers nouveau@email.com",
          timestamp: new Date().toISOString(),
          admin_user: "admin@example.com",
          user_id: userId,
          metadata: {
            field: "email",
            oldValue: "ancien@email.com",
            newValue: "nouveau@email.com",
          },
        },
        {
          id: 2,
          action: "Compte Suspendu",
          details:
            "Compte suspendu pour violation des conditions d'utilisation",
          timestamp: new Date(Date.now() - 86400000).toISOString(),
          admin_user: "admin@example.com",
          user_id: userId,
          metadata: { reason: "policy_violation", duration: "indefinite" },
        },
        {
          id: 3,
          action: "Mot de Passe Réinitialisé",
          details: "Réinitialisation de mot de passe demandée et effectuée",
          timestamp: new Date(Date.now() - 172800000).toISOString(),
          admin_user: "system",
          user_id: userId,
          metadata: { method: "email_link", ip_address: "192.168.1.1" },
        },
        {
          id: 4,
          action: "Connexion Forcée Terminée",
          details: "Toutes les sessions utilisateur ont été invalidées",
          timestamp: new Date(Date.now() - 259200000).toISOString(),
          admin_user: "admin@example.com",
          user_id: userId,
          metadata: { sessions_terminated: 3, reason: "security_concern" },
        },
        {
          id: 5,
          action: "Rôle Modifié",
          details: 'Rôle changé de "user" vers "vip"',
          timestamp: new Date(Date.now() - 345600000).toISOString(),
          admin_user: "admin@example.com",
          user_id: userId,
          metadata: {
            oldRole: "user",
            newRole: "vip",
            upgrade_reason: "manual_promotion",
          },
        },
      ];

      return mockLogs;
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
