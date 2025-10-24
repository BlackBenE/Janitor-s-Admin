/**
 * 🎭 User Interface State Hook - ÉTAPE 4 : FUSION 2
 *
 * Hook unifié pour la gestion de l'état UI et modales:
 * - useUserModals.ts (288 lignes) ✅
 * - Partie stratégies useAnonymization.ts (~45 lignes) ✅
 *
 * PHASE 4B - FUSION ÉTAPE 4/4 - FUSION 2 DÉMARRÉE
 */

import { useState, useCallback } from "react";
import {
  UserProfile,
  LockAccountState,
  AuditModalState,
  ModalData,
  ModalUserData,
} from "@/types/userManagement";
import {
  DeletionReason,
  AnonymizationLevel,
} from "@/types/dataRetention";

// ========================================
// HELPER: GENERIC MODAL STATE CREATOR
// ========================================

/**
 * Hook générique pour créer un état de modal
 */
const createModalState = <T>(initialData: T) => {
  const [state, setState] = useState<ModalData<T>>({
    open: false,
    data: initialData,
  });

  const openModal = useCallback((data: T) => {
    setState({ open: true, data });
  }, []);

  const closeModal = useCallback(() => {
    setState({ open: false, data: initialData });
  }, [initialData]);

  const updateData = useCallback((updates: Partial<T>) => {
    setState((prev) => ({
      ...prev,
      data: { ...prev.data, ...updates },
    }));
  }, []);

  return {
    ...state,
    openModal,
    closeModal,
    updateData,
  };
};

// ========================================
// HOOK PRINCIPAL
// ========================================

/**
 * Hook unifié pour toutes les modals + stratégies UI de gestion des utilisateurs
 */
export const useUserInterface = () => {
  // ========================================
  // SECTION 2: MODALS UTILISATEUR (ex-useUserModals)
  // ========================================
  const userDetails = createModalState<ModalUserData>({
    userId: "",
  });

  const createUser = createModalState<{}>({});

  const passwordReset = createModalState<{ userId: string }>({
    userId: "",
  });

  const lock = createModalState<LockAccountState>({
    userId: null,
    duration: 60,
    reason: "",
  });

  const audit = createModalState<AuditModalState>({
    show: false,
    userId: null,
    tabValue: 0,
  });

  // ========================================
  // SECTION 3: MODALS ANONYMISATION (ex-useAnonymizationModals)
  // ========================================
  const smartDelete = createModalState<{
    user: UserProfile | null;
  }>({
    user: null,
  });

  const restore = createModalState<{
    user: UserProfile | null;
  }>({
    user: null,
  });

  const bulkSmartDelete = createModalState<{
    userIds: string[];
  }>({
    userIds: [],
  });

  // ========================================
  // SECTION 4: STRATÉGIES ANONYMISATION (ex-useAnonymizationStrategies)
  // ========================================

  /**
   * Stratégies prédéfinies d'anonymisation
   * Ces stratégies retournent les paramètres optimaux pour chaque cas d'usage
   */
  const anonymizationStrategies = {
    // Suppression RGPD complète (anonymisation immédiate)
    gdprCompliantDeletion: {
      reason: DeletionReason.GDPR_COMPLIANCE,
      level: AnonymizationLevel.PARTIAL,
      description: "Conformité RGPD - Droit à l'effacement",
      retentionDays: 0, // Anonymisation immédiate
    },

    // Suppression utilisateur standard (conservation temporaire)
    userRequestedDeletion: {
      reason: DeletionReason.USER_REQUEST,
      level: AnonymizationLevel.PARTIAL,
      description: "Demande de suppression utilisateur",
      retentionDays: 30, // Conservation 30 jours
    },

    // Suppression administrative (conservation pour audit)
    adminDeletion: {
      reason: DeletionReason.ADMIN_ACTION,
      level: AnonymizationLevel.PARTIAL,
      description: "Suppression administrative",
      retentionDays: 90, // Conservation 90 jours pour audit
    },

    // Purge complète (violation de politique)
    policyViolationPurge: {
      reason: DeletionReason.POLICY_VIOLATION,
      level: AnonymizationLevel.FULL,
      description: "Violation des conditions d'utilisation",
      retentionDays: 0, // Purge immédiate
    },

    // Suppression automatique (nettoyage système)
    systemCleanup: {
      reason: DeletionReason.ADMIN_ACTION,
      level: AnonymizationLevel.PARTIAL,
      description: "Nettoyage automatique du système",
      retentionDays: 0,
    },
  };

  /**
   * Helper pour obtenir une stratégie par nom
   */
  const getAnonymizationStrategy = (
    strategyName: keyof typeof anonymizationStrategies
  ) => {
    return anonymizationStrategies[strategyName];
  };

  /**
   * Helper pour obtenir toutes les stratégies disponibles
   */
  const getAllAnonymizationStrategies = () => {
    return Object.entries(anonymizationStrategies).map(([key, strategy]) => ({
      key,
      ...strategy,
    }));
  };

  // ========================================
  // SECTION 5: ACTIONS MODALES & UI
  // ========================================

  const closeAllModals = useCallback(() => {
    userDetails.closeModal();
    createUser.closeModal();
    passwordReset.closeModal();
    lock.closeModal();
    audit.closeModal();
    smartDelete.closeModal();
    restore.closeModal();
    bulkSmartDelete.closeModal();
  }, [
    userDetails,
    createUser,
    passwordReset,
    lock,
    audit,
    smartDelete,
    restore,
    bulkSmartDelete,
  ]);

  const getOpenModalsCount = useCallback(() => {
    const modals = [
      userDetails,
      createUser,
      passwordReset,
      lock,
      audit,
      smartDelete,
      restore,
      bulkSmartDelete,
    ];
    return modals.filter((modal) => modal.open).length;
  }, [
    userDetails,
    createUser,
    passwordReset,
    lock,
    audit,
    smartDelete,
    restore,
    bulkSmartDelete,
  ]);

  // ========================================
  // RETURN - INTERFACE PUBLIQUE
  // ========================================
  return {
    // *** MODALS PAR DOMAINE ***
    roleModals: {},

    userModals: {
      userDetails,
      createUser,
      passwordReset,
      lock,
      audit,
    },

    anonymizationModals: {
      smartDelete,
      restore,
      bulkSmartDelete,
    },

    // *** STRATÉGIES ANONYMISATION ***
    anonymizationStrategies,
    getAnonymizationStrategy,
    getAllAnonymizationStrategies,

    // *** ACTIONS GLOBALES ***
    closeAllModals,
    getOpenModalsCount,

    // ========================================
    // RÉTRO-COMPATIBILITÉ (pour migration graduelle)
    // ========================================

    // Ex-useUserModals API
    showUserDetailsModal: userDetails.open,
    openUserDetailsModal: () => userDetails.openModal({ userId: "" }),
    closeUserDetailsModal: userDetails.closeModal,

    showCreateUserModal: createUser.open,
    openCreateUserModal: () => createUser.openModal({}),
    closeCreateUserModal: createUser.closeModal,

    showPasswordResetModal: passwordReset.open,
    passwordResetUserId: passwordReset.data.userId,
    openPasswordResetModal: (userId: string) =>
      passwordReset.openModal({ userId }),
    closePasswordResetModal: passwordReset.closeModal,

    showLockModal: lock.open,
    lockAccount: lock.data,
    openLockModal: (userId: string) =>
      lock.openModal({ userId, duration: 60, reason: "" }),
    closeLockModal: lock.closeModal,
    updateLockDuration: (duration: number) => lock.updateData({ duration }),
    updateLockReason: (reason: string) => lock.updateData({ reason }),

    showAuditModal: audit.open,
    auditData: audit.data,
    openAuditModal: (userId: string) =>
      audit.openModal({ show: true, userId, tabValue: 0 }),
    closeAuditModal: audit.closeModal,
    updateAuditTab: (tabValue: number) => audit.updateData({ tabValue }),

    // Ex-useAnonymizationModals API
    smartDeleteModalOpen: smartDelete.open,
    selectedUserForSmartDelete: smartDelete.data.user,
    openSmartDeleteModal: (user: UserProfile) =>
      smartDelete.openModal({ user }),
    closeSmartDeleteModal: smartDelete.closeModal,

    restoreModalOpen: restore.open,
    selectedUserForRestore: restore.data.user,
    openRestoreModal: (user: UserProfile) => restore.openModal({ user }),
    closeRestoreModal: restore.closeModal,

    bulkSmartDeleteModalOpen: bulkSmartDelete.open,
    selectedUserIdsForBulkDelete: bulkSmartDelete.data.userIds,
    openBulkSmartDeleteModal: (userIds: string[]) =>
      bulkSmartDelete.openModal({ userIds }),
    closeBulkSmartDeleteModal: bulkSmartDelete.closeModal,
  };
};

/**
 * Type pour l'interface publique du hook
 */
export type UseUserInterfaceReturn = ReturnType<typeof useUserInterface>;

/**
 * Export avec alias pour backward compatibility
 */
export { useUserInterface as useModals };
