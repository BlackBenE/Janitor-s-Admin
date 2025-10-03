import { useState } from "react";
import {
  BulkActionState,
  LockAccountState,
  AuditModalState,
} from "../../../types/userManagement";

export const useUserModals = () => {
  // États des modales
  const [showUserDetailsModal, setShowUserDetailsModal] = useState(false);
  const [showCreateUserModal, setShowCreateUserModal] = useState(false);
  const [showPasswordResetModal, setShowPasswordResetModal] = useState(false);
  const [showLockModal, setShowLockModal] = useState(false);
  const [showBulkActionModal, setShowBulkActionModal] = useState(false);
  const [showAuditModal, setShowAuditModal] = useState(false);

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

  const openUserDetailsModal = () => setShowUserDetailsModal(true);
  const closeUserDetailsModal = () => setShowUserDetailsModal(false);

  const openCreateUserModal = () => setShowCreateUserModal(true);
  const closeCreateUserModal = () => setShowCreateUserModal(false);

  const openPasswordResetModal = (userId: string) => {
    setPasswordResetUserId(userId);
    setShowPasswordResetModal(true);
  };
  const closePasswordResetModal = () => {
    setShowPasswordResetModal(false);
    setPasswordResetUserId(null);
  };

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
    showUserDetailsModal,
    showCreateUserModal,
    showPasswordResetModal,
    showLockModal,
    showBulkActionModal,
    showAuditModal,

    passwordResetUserId,
    lockAccount,
    bulkAction,
    audit,

    openUserDetailsModal,
    closeUserDetailsModal,

    openCreateUserModal,
    closeCreateUserModal,

    openPasswordResetModal,
    closePasswordResetModal,

    openLockModal,
    closeLockModal,
    updateLockDuration,
    updateLockReason,

    openBulkActionModal,
    closeBulkActionModal,
    updateBulkRoleChange,
    updateBulkVipChange,

    openAuditModal,
    closeAuditModal,
    updateAuditTab,
  };
};
