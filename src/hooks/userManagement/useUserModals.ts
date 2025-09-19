import { useState } from "react";
import {
  BulkActionState,
  LockAccountState,
  AuditModalState,
} from "../../types/userManagement";

/**
 * Hook pour la gestion des modales de la page User Management
 */
export const useUserModals = () => {
  // États des modales
  const [showUserDetailsModal, setShowUserDetailsModal] = useState(false);
  const [showCreateUserModal, setShowCreateUserModal] = useState(false);
  const [showPasswordResetModal, setShowPasswordResetModal] = useState(false);
  const [showLockModal, setShowLockModal] = useState(false);
  const [showBulkActionModal, setShowBulkActionModal] = useState(false);
  const [showAuditModal, setShowAuditModal] = useState(false);

  // États spécialisés
  const [passwordResetUserId, setPasswordResetUserId] = useState<string | null>(
    null
  );
  const [lockAccount, setLockAccount] = useState<LockAccountState>({
    userId: null,
    duration: 60,
    reason: "",
  });
  const [bulkAction, setBulkAction] = useState<BulkActionState>({
    type: "delete",
    roleChange: "",
    vipChange: false,
  });
  const [audit, setAudit] = useState<AuditModalState>({
    show: false,
    userId: null,
    tabValue: 0,
  });

  // Actions pour User Details Modal
  const openUserDetailsModal = () => setShowUserDetailsModal(true);
  const closeUserDetailsModal = () => setShowUserDetailsModal(false);

  // Actions pour Create User Modal
  const openCreateUserModal = () => setShowCreateUserModal(true);
  const closeCreateUserModal = () => setShowCreateUserModal(false);

  // Actions pour Password Reset Modal
  const openPasswordResetModal = (userId: string) => {
    setPasswordResetUserId(userId);
    setShowPasswordResetModal(true);
  };
  const closePasswordResetModal = () => {
    setShowPasswordResetModal(false);
    setPasswordResetUserId(null);
  };

  // Actions pour Lock Account Modal
  const openLockModal = (userId: string) => {
    setLockAccount({
      userId,
      duration: 60,
      reason: "",
    });
    setShowLockModal(true);
  };
  const closeLockModal = () => {
    setShowLockModal(false);
    setLockAccount({ userId: null, duration: 60, reason: "" });
  };
  const updateLockDuration = (duration: number) => {
    setLockAccount((prev) => ({ ...prev, duration }));
  };
  const updateLockReason = (reason: string) => {
    setLockAccount((prev) => ({ ...prev, reason }));
  };

  // Actions pour Bulk Action Modal
  const openBulkActionModal = (type: "delete" | "role" | "vip") => {
    setBulkAction((prev) => ({ ...prev, type }));
    setShowBulkActionModal(true);
  };
  const closeBulkActionModal = () => setShowBulkActionModal(false);
  const updateBulkRoleChange = (role: string) => {
    setBulkAction((prev) => ({ ...prev, roleChange: role }));
  };
  const updateBulkVipChange = (vip: boolean) => {
    setBulkAction((prev) => ({ ...prev, vipChange: vip }));
  };

  // Actions pour Audit Modal
  const openAuditModal = (userId: string) => {
    setAudit({
      show: true,
      userId,
      tabValue: 0,
    });
    setShowAuditModal(true);
  };
  const closeAuditModal = () => {
    setShowAuditModal(false);
    setAudit({ show: false, userId: null, tabValue: 0 });
  };
  const updateAuditTab = (tabValue: number) => {
    setAudit((prev) => ({ ...prev, tabValue }));
  };

  return {
    // États des modales
    showUserDetailsModal,
    showCreateUserModal,
    showPasswordResetModal,
    showLockModal,
    showBulkActionModal,
    showAuditModal,

    // États spécialisés
    passwordResetUserId,
    lockAccount,
    bulkAction,
    audit,

    // Actions User Details
    openUserDetailsModal,
    closeUserDetailsModal,

    // Actions Create User
    openCreateUserModal,
    closeCreateUserModal,

    // Actions Password Reset
    openPasswordResetModal,
    closePasswordResetModal,

    // Actions Lock Account
    openLockModal,
    closeLockModal,
    updateLockDuration,
    updateLockReason,

    // Actions Bulk Action
    openBulkActionModal,
    closeBulkActionModal,
    updateBulkRoleChange,
    updateBulkVipChange,

    // Actions Audit
    openAuditModal,
    closeAuditModal,
    updateAuditTab,
  };
};
