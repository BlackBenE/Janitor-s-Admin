import { useState, useCallback } from "react";
import {
  UserProfile,
  BulkActionState,
  LockAccountState,
  AuditModalState,
  ModalData,
  ModalUserData,
} from "../../../types/userManagement";

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

/**
 * Hook unifié pour toutes les modals de gestion des utilisateurs
 */
export const useModals = () => {
  // ========================================
  // MODALS SIMPLES (ex-useRoleModals)
  // ========================================
  const bookings = createModalState<ModalUserData>({
    userId: "",
    userName: "",
  });

  const subscription = createModalState<ModalUserData>({
    userId: "",
    userName: "",
  });

  const services = createModalState<ModalUserData>({
    userId: "",
    userName: "",
  });

  // ========================================
  // MODALS UTILISATEUR (ex-useUserModals)
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

  const bulkAction = createModalState<BulkActionState>({
    type: "delete",
    roleChange: "",
    vipChange: false,
  });

  const audit = createModalState<AuditModalState>({
    show: false,
    userId: null,
    tabValue: 0,
  });

  // ========================================
  // MODALS ANONYMISATION (ex-useAnonymizationModals)
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
  // ACTIONS GLOBALES
  // ========================================
  const closeAllModals = useCallback(() => {
    bookings.closeModal();
    subscription.closeModal();
    services.closeModal();
    userDetails.closeModal();
    createUser.closeModal();
    passwordReset.closeModal();
    lock.closeModal();
    bulkAction.closeModal();
    audit.closeModal();
    smartDelete.closeModal();
    restore.closeModal();
    bulkSmartDelete.closeModal();
  }, [
    bookings,
    subscription,
    services,
    userDetails,
    createUser,
    passwordReset,
    lock,
    bulkAction,
    audit,
    smartDelete,
    restore,
    bulkSmartDelete,
  ]);

  const getOpenModalsCount = useCallback(() => {
    const modals = [
      bookings,
      subscription,
      services,
      userDetails,
      createUser,
      passwordReset,
      lock,
      bulkAction,
      audit,
      smartDelete,
      restore,
      bulkSmartDelete,
    ];
    return modals.filter((modal) => modal.open).length;
  }, [
    bookings,
    subscription,
    services,
    userDetails,
    createUser,
    passwordReset,
    lock,
    bulkAction,
    audit,
    smartDelete,
    restore,
    bulkSmartDelete,
  ]);

  // ========================================
  // INTERFACE RETOUR
  // ========================================
  return {
    // Modals groupées par domaine
    roleModals: {
      bookings,
      subscription,
      services,
    },

    userModals: {
      userDetails,
      createUser,
      passwordReset,
      lock,
      bulkAction,
      audit,
    },

    anonymizationModals: {
      smartDelete,
      restore,
      bulkSmartDelete,
    },

    // Actions globales
    closeAllModals,
    getOpenModalsCount,

    // ========================================
    // RÉTRO-COMPATIBILITÉ (pour migration graduelle)
    // ========================================

    // Ex-useRoleModals
    bookingsModal: bookings,
    openBookingsModal: (userId: string, userName: string) =>
      bookings.openModal({ userId, userName }),
    closeBookingsModal: bookings.closeModal,

    subscriptionModal: subscription,
    openSubscriptionModal: (userId: string, userName: string) =>
      subscription.openModal({ userId, userName }),
    closeSubscriptionModal: subscription.closeModal,

    servicesModal: services,
    openServicesModal: (userId: string, userName: string) =>
      services.openModal({ userId, userName }),
    closeServicesModal: services.closeModal,

    // Ex-useUserModals
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

    showBulkActionModal: bulkAction.open,
    bulkActionData: bulkAction.data,
    openBulkActionModal: (type: "delete" | "role" | "vip") =>
      bulkAction.openModal({ type, roleChange: "", vipChange: false }),
    closeBulkActionModal: bulkAction.closeModal,
    updateBulkRoleChange: (roleChange: string) =>
      bulkAction.updateData({ roleChange }),
    updateBulkVipChange: (vipChange: boolean) =>
      bulkAction.updateData({ vipChange }),

    showAuditModal: audit.open,
    auditData: audit.data,
    openAuditModal: (userId: string) =>
      audit.openModal({ show: true, userId, tabValue: 0 }),
    closeAuditModal: audit.closeModal,
    updateAuditTab: (tabValue: number) => audit.updateData({ tabValue }),

    // Ex-useAnonymizationModals (UI seulement)
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
