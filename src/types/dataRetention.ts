import { Database } from "./database.types";

// =====================================================
// DATA RETENTION & ANONYMIZATION - TYPES COMPLETS
// =====================================================

// Énumération pour les raisons de suppression
export enum DeletionReason {
  USER_REQUEST = "user_request",
  GDPR_COMPLIANCE = "gdpr_compliance",
  ACCOUNT_CLOSURE = "account_closure",
  ADMIN_ACTION = "admin_action",
  POLICY_VIOLATION = "policy_violation",
}

// Énumération pour les niveaux d'anonymisation
export enum AnonymizationLevel {
  NONE = "none",
  PARTIAL = "partial", // Données personnelles anonymisées, métier conservé
  FULL = "full", // Toutes les données anonymisées
  PURGED = "purged", // Suppression définitive
}

// Stratégie d'anonymisation par type de données
export interface AnonymizationStrategy {
  personal_data: {
    immediate: boolean; // Anonymiser immédiatement à la suppression
    fields: string[]; // Champs à anonymiser
    replacement: string; // Valeur de remplacement
  };
  business_data: {
    preserve_period_days: number; // Garder combien de temps en anonymisé
    anonymize_fields: string[]; // Champs à anonymiser mais garder structure
  };
  financial_data: {
    legal_retention_days: number; // Obligation légale de conservation
    anonymize_after_days: number; // Anonymiser après cette période
  };
  audit_data: {
    retention_days: number; // Conservation pour audit
    anonymize_user_refs: boolean; // Anonymiser les références utilisateur
  };
}

// Configuration par défaut de l'anonymisation
export const DEFAULT_ANONYMIZATION_STRATEGY: AnonymizationStrategy = {
  personal_data: {
    immediate: true,
    fields: [
      "first_name",
      "last_name",
      "full_name",
      "email",
      "phone",
      "avatar_url",
    ],
    replacement: "[ANONYMIZED]",
  },
  business_data: {
    preserve_period_days: 2555, // 7 ans
    anonymize_fields: ["user_id"], // Remplacer par ID anonyme
  },
  financial_data: {
    legal_retention_days: 3650, // 10 ans
    anonymize_after_days: 2555, // 7 ans
  },
  audit_data: {
    retention_days: 1095, // 3 ans
    anonymize_user_refs: true,
  },
};

// Interface pour les données de suppression d'utilisateur
export interface UserDeletionData {
  user_id: string;
  deleted_at: string;
  deletion_reason: DeletionReason;
  anonymization_level: AnonymizationLevel;
  anonymized_at?: string;
  scheduled_purge_at?: string;
}

// Résultat d'une opération d'anonymisation
export interface AnonymizationResult {
  user_id: string;
  anonymization_level: AnonymizationLevel;
  anonymized_fields: string[];
  preserved_data_until?: string;
  scheduled_purge_at?: string;
  success: boolean;
  error?: string;
}

// Interface pour les données de suppression d'utilisateur
export interface UserDeletionData {
  user_id: string;
  deleted_at: string;
  deletion_reason: DeletionReason;
}

// Interface pour les statistiques de suppression
export interface DeletionStats {
  total_deleted_users: number;
  deletions_by_reason: Record<DeletionReason, number>;
  recent_deletions: UserDeletionData[];
}

// Types pour les hooks de soft delete
export interface SoftDeleteOptions {
  reason?: string;
}

export interface DeletedUserInfo {
  id: string;
  deleted_at: string | null;
  deletion_reason: string | null;
}

export interface UserDeletionAction {
  userId: string;
  reason?: string;
}

export interface UserRestorationResult {
  id: string;
  restored_at: string;
}

// Filtres étendus pour les requêtes utilisateurs
export interface UserFilters {
  includeDeleted?: boolean;
  onlyDeleted?: boolean;
  role?: string;
  status?: string;
  deleted_after?: string;
  deleted_before?: string;
}
export interface UseSoftDeleteResult {
  // Actions
  softDeleteUser: (userId: string, reason: DeletionReason) => Promise<void>;
  restoreUser: (userId: string) => Promise<void>;

  // Données
  deletedUsers: Database["public"]["Tables"]["profiles"]["Row"][];
  deletionStats: DeletionStats;

  // États
  isLoading: boolean;
  error: string | null;
}

// Interface pour le composant de confirmation de suppression
export interface DeleteConfirmationProps {
  user: Database["public"]["Tables"]["profiles"]["Row"];
  open: boolean;
  onClose: () => void;
  onConfirm: (reason: DeletionReason) => Promise<void>;
  isDeleting: boolean;
}
