import React from "react";
import {
  UserDetailsModal,
  CreateUserModal,
  PasswordResetModal,
  AuditModal,
  LockAccountModal,
  BulkSmartDeleteModal,
} from "../modals";
import { SmartDeleteModal } from "../modals/SmartDeleteModal";
import { RestoreUserModal } from "../modals/RestoreUserModal";
import {
  UserProfile,
  AuditModalState,
  LockAccountState,
  UserActivityData,
} from "@/types/userManagement";
import {
  DeletionReason,
  AnonymizationLevel,
} from "@/types/dataRetention";

interface ModalsManagerProps {
  // ======================== USER MANAGEMENT MODALS ========================

  // User Details Modal
  showUserDetailsModal: boolean;
  selectedUser: UserProfile | null;
  editForm: Partial<UserProfile>;
  activityData?: Record<string, UserActivityData>;
  onCloseUserDetailsModal: () => void;

  // Create User Modal
  showCreateUserModal: boolean;
  onCloseCreateUserModal: () => void;

  // Password Reset Modal
  showPasswordResetModal: boolean;
  passwordResetUserId: string | null;
  onClosePasswordResetModal: () => void;

  // Audit Modal
  showAuditModal: boolean;
  auditState: AuditModalState;
  userEmail?: string;
  onCloseAuditModal: () => void;
  onUpdateAuditTab: (tabValue: number) => void;

  // Lock Modal
  showLockModal: boolean;
  lockAccountState: LockAccountState;
  onCloseLockModal: () => void;
  onUpdateLockDuration: (duration: number) => void;
  onUpdateLockReason: (reason: string) => void;

  // ======================== ANONYMIZATION & DELETION MODALS ========================

  // Smart Delete Modal (single user)
  smartDeleteModalOpen: boolean;
  restoreModalOpen: boolean;

  // Bulk Smart Delete Modal
  bulkSmartDeleteModalOpen: boolean;
  selectedUserIds: string[];

  // Anonymization Handlers
  onCloseSmartDeleteModal: () => void;
  onCloseRestoreModal: () => void;
  onCloseBulkSmartDeleteModal: () => void;
  onSmartDelete: (
    userId: string,
    reason: DeletionReason,
    level: AnonymizationLevel,
    customReason?: string
  ) => Promise<void>;
  onBulkSmartDelete: (
    reason: DeletionReason,
    level: AnonymizationLevel,
    customReason?: string
  ) => Promise<void>;
  onRestoreUser: (userId: string) => Promise<void>;

  // ======================== LOADING STATES ========================

  isSmartDeleting: boolean;
  isRestoring: boolean;
  isBulkDeleting: boolean;

  // ======================== USER MANAGEMENT HANDLERS ========================

  onSaveUser: () => void;
  onOpenLockModal: () => void;
  onUnlockAccount: () => void;
  onResetPassword: () => void;
  onDeleteUser: () => void;
  onRestore?: () => void; // Handler pour ouvrir la modale de restauration
  onInputChange: (
    field: keyof UserProfile,
    value: string | boolean | null
  ) => void;
  onCreateUser: () => void;
  onPasswordResetConfirm: () => void;
  onLockAccountConfirm: () => void;
}

/**
 * Manager unifié pour toutes les modales du domaine UserManagement
 * Combine la gestion des modales utilisateur standard et d'anonymisation
 */
export const ModalsManager: React.FC<ModalsManagerProps> = ({
  // User Management Modals Props
  showUserDetailsModal,
  selectedUser,
  editForm,
  activityData,
  onCloseUserDetailsModal,
  showCreateUserModal,
  onCloseCreateUserModal,
  showPasswordResetModal,
  passwordResetUserId,
  onClosePasswordResetModal,
  showAuditModal,
  auditState,
  userEmail,
  onCloseAuditModal,
  onUpdateAuditTab,
  showLockModal,
  lockAccountState,
  onCloseLockModal,
  onUpdateLockDuration,
  onUpdateLockReason,

  // Anonymization Modals Props
  smartDeleteModalOpen,
  restoreModalOpen,
  bulkSmartDeleteModalOpen,
  selectedUserIds,
  onCloseSmartDeleteModal,
  onCloseRestoreModal,
  onCloseBulkSmartDeleteModal,
  onSmartDelete,
  onBulkSmartDelete,
  onRestoreUser,
  isSmartDeleting,
  isRestoring,
  isBulkDeleting,

  // User Management Handlers
  onSaveUser,
  onOpenLockModal,
  onUnlockAccount,
  onResetPassword,
  onDeleteUser,
  onRestore,
  onInputChange,
  onCreateUser,
  onPasswordResetConfirm,
  onLockAccountConfirm,
}) => {
  return (
    <>
      {/* ======================== USER MANAGEMENT MODALS ======================== */}

      {/* User Details Modal */}
      <UserDetailsModal
        open={showUserDetailsModal}
        user={selectedUser}
        editForm={editForm}
        activityData={activityData}
        onClose={onCloseUserDetailsModal}
        onSave={onSaveUser}
        onOpenLockModal={onOpenLockModal}
        onUnlockAccount={onUnlockAccount}
        onResetPassword={onResetPassword}
        onDelete={onDeleteUser}
        onRestore={onRestore}
        onInputChange={onInputChange}
      />

      {/* Create User Modal */}
      <CreateUserModal
        open={showCreateUserModal}
        onClose={onCloseCreateUserModal}
        editForm={editForm}
        onCreate={onCreateUser}
        onInputChange={onInputChange}
      />

      {/* Password Reset Modal */}
      <PasswordResetModal
        open={showPasswordResetModal}
        userId={passwordResetUserId || ""}
        onClose={onClosePasswordResetModal}
        onConfirm={onPasswordResetConfirm}
      />

      {/* Audit Modal */}
      <AuditModal
        open={showAuditModal}
        audit={auditState}
        userEmail={userEmail}
        onClose={onCloseAuditModal}
        onUpdateTab={onUpdateAuditTab}
      />

      {/* Lock Account Modal */}
      <LockAccountModal
        open={showLockModal}
        lockAccount={lockAccountState}
        userEmail={userEmail}
        onClose={onCloseLockModal}
        onConfirm={onLockAccountConfirm}
        onUpdateDuration={onUpdateLockDuration}
        onUpdateReason={onUpdateLockReason}
      />

      {/* ======================== ANONYMIZATION & DELETION MODALS ======================== */}

      {/* Smart Delete Modal */}
      <SmartDeleteModal
        open={smartDeleteModalOpen}
        user={selectedUser}
        onClose={onCloseSmartDeleteModal}
        onConfirm={onSmartDelete}
        isDeleting={isSmartDeleting}
      />

      {/* Restore User Modal */}
      <RestoreUserModal
        open={restoreModalOpen}
        user={selectedUser}
        onClose={onCloseRestoreModal}
        onConfirm={onRestoreUser}
        isRestoring={isRestoring}
      />

      {/* Bulk Smart Delete Modal */}
      <BulkSmartDeleteModal
        open={bulkSmartDeleteModalOpen}
        selectedUserIds={selectedUserIds}
        onClose={onCloseBulkSmartDeleteModal}
        onConfirm={onBulkSmartDelete}
        isDeleting={isBulkDeleting}
      />
    </>
  );
};
