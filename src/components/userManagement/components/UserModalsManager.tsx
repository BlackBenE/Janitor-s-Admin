import React from "react";
import {
  UserDetailsModal,
  CreateUserModal,
  PasswordResetModal,
  AuditModal,
  LockAccountModal,
  BulkActionModal,
  BookingsModal,
  SubscriptionModal,
  ServicesModal,
} from "../modals";
import {
  UserProfile,
  AuditModalState,
  LockAccountState,
  BulkActionState,
} from "../../../types/userManagement";

interface UserModalsManagerProps {
  // User Details Modal
  showUserDetailsModal: boolean;
  selectedUser: UserProfile | null;
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

  // Bulk Action Modal
  showBulkActionModal: boolean;
  bulkActionState: BulkActionState;
  selectedUsers: string[];
  onCloseBulkActionModal: () => void;
  onUpdateRoleChange: (role: string) => void;
  onUpdateVipChange: (vip: boolean) => void;

  // Role-specific modals state
  bookingsModal: { open: boolean; userId: string; userName: string };
  subscriptionModal: { open: boolean; userId: string; userName: string };
  servicesModal: { open: boolean; userId: string; userName: string };
  onCloseBookingsModal: () => void;
  onCloseSubscriptionModal: () => void;
  onCloseServicesModal: () => void;

  // Handlers
  onSaveUser: () => void;
  onSuspendUser: () => void;
  onInputChange: () => void;
  onCreateUser: () => void;
  onPasswordResetConfirm: () => void;
  onLockAccountConfirm: () => void;
  onBulkActionConfirm: () => void;
}

export const UserModalsManager: React.FC<UserModalsManagerProps> = ({
  // User Details Modal
  showUserDetailsModal,
  selectedUser,
  onCloseUserDetailsModal,

  // Create User Modal
  showCreateUserModal,
  onCloseCreateUserModal,

  // Password Reset Modal
  showPasswordResetModal,
  passwordResetUserId,
  onClosePasswordResetModal,

  // Audit Modal
  showAuditModal,
  auditState,
  userEmail,
  onCloseAuditModal,
  onUpdateAuditTab,

  // Lock Modal
  showLockModal,
  lockAccountState,
  onCloseLockModal,
  onUpdateLockDuration,
  onUpdateLockReason,

  // Bulk Action Modal
  showBulkActionModal,
  bulkActionState,
  selectedUsers,
  onCloseBulkActionModal,
  onUpdateRoleChange,
  onUpdateVipChange,

  // Role-specific modals
  bookingsModal,
  subscriptionModal,
  servicesModal,
  onCloseBookingsModal,
  onCloseSubscriptionModal,
  onCloseServicesModal,

  // Handlers
  onSaveUser,
  onSuspendUser,
  onInputChange,
  onCreateUser,
  onPasswordResetConfirm,
  onLockAccountConfirm,
  onBulkActionConfirm,
}) => {
  return (
    <>
      {/* User Details Modal */}
      <UserDetailsModal
        open={showUserDetailsModal}
        user={selectedUser}
        onClose={onCloseUserDetailsModal}
        editForm={{}}
        onSave={onSaveUser}
        onSuspend={onSuspendUser}
        onInputChange={onInputChange}
      />

      {/* Create User Modal */}
      <CreateUserModal
        open={showCreateUserModal}
        onClose={onCloseCreateUserModal}
        editForm={{}}
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

      {/* Audit Modal - Avec les bonnes props */}
      <AuditModal
        open={showAuditModal}
        audit={auditState}
        userEmail={userEmail}
        onClose={onCloseAuditModal}
        onUpdateTab={onUpdateAuditTab}
      />

      {/* Lock Account Modal - Avec les bonnes props */}
      <LockAccountModal
        open={showLockModal}
        lockAccount={lockAccountState}
        userEmail={userEmail}
        onClose={onCloseLockModal}
        onConfirm={onLockAccountConfirm}
        onUpdateDuration={onUpdateLockDuration}
        onUpdateReason={onUpdateLockReason}
      />

      {/* Bulk Action Modal - Avec toutes les props requises */}
      <BulkActionModal
        open={showBulkActionModal}
        bulkAction={bulkActionState}
        selectedUsers={selectedUsers}
        onClose={onCloseBulkActionModal}
        onConfirm={onBulkActionConfirm}
        onUpdateRoleChange={onUpdateRoleChange}
        onUpdateVipChange={onUpdateVipChange}
      />

      {/* Role-specific Modals */}
      <BookingsModal
        open={bookingsModal.open}
        userId={bookingsModal.userId}
        userName={bookingsModal.userName}
        onClose={onCloseBookingsModal}
      />

      <SubscriptionModal
        open={subscriptionModal.open}
        userId={subscriptionModal.userId}
        userName={subscriptionModal.userName}
        onClose={onCloseSubscriptionModal}
      />

      <ServicesModal
        open={servicesModal.open}
        userId={servicesModal.userId}
        userName={servicesModal.userName}
        onClose={onCloseServicesModal}
      />
    </>
  );
};
