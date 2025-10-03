import React from "react";
import { Box } from "@mui/material";
import AdminLayout from "../AdminLayout";

// Components modularisés
import {
  UserHeader,
  UserStatsSection,
  UserTableSection,
  UserLoadingIndicator,
  UserModalsManager,
  createUserTableColumns,
} from "./components";

// Types
import { UserRole, UserProfile, USER_TABS } from "../../types/userManagement";

// Hooks
import { useUserManagement, useUserModals, useUsers } from "./hooks";
import { useAuth } from "../../providers/authProvider";

export const UserManagementPage: React.FC = () => {
  const [activeTab, setActiveTab] = React.useState(0);
  const [selectedUserRole, setSelectedUserRole] =
    React.useState<UserRole | null>(null);

  // États pour les nouvelles modals role-spécifiques
  const [bookingsModal, setBookingsModal] = React.useState({
    open: false,
    userId: "",
    userName: "",
  });
  const [subscriptionModal, setSubscriptionModal] = React.useState({
    open: false,
    userId: "",
    userName: "",
  });
  const [servicesModal, setServicesModal] = React.useState({
    open: false,
    userId: "",
    userName: "",
  });

  // Main Hooks
  const userManagement = useUserManagement();
  const modals = useUserModals();
  const { getEmail } = useAuth();

  // Hook pour récupérer tous les utilisateurs
  const {
    users: allUsers,
    isLoading,
    isFetching,
    error,
    updateUser,
    refetch,
  } = useUsers({
    filters: {},
    orderBy: "created_at",
  });

  // Filtrage côté client par rôle
  const users = selectedUserRole
    ? allUsers.filter((user) => user.role === selectedUserRole)
    : allUsers;

  // Configuration du tableau avec toutes les fonctionnalités
  const columns = createUserTableColumns({
    selectedUsers: userManagement.selectedUsers,
    onToggleUserSelection: userManagement.toggleUserSelection,
    onShowUser: (user: UserProfile) => {
      userManagement.setSelectedUser(user);
      modals.openUserDetailsModal();
    },
    onShowAudit: (userId: string) => {
      const user = users.find((u) => u.id === userId);
      if (user) userManagement.setSelectedUser(user);
      modals.openAuditModal(userId);
    },
    onPasswordReset: (userId: string) => {
      const user = users.find((u) => u.id === userId);
      if (user) userManagement.setSelectedUser(user);
      modals.openPasswordResetModal(userId);
    },
    onLockAccount: (userId: string) => {
      const user = users.find((u) => u.id === userId);
      if (user) userManagement.setSelectedUser(user);
      modals.openLockModal(userId);
    },
    onUnlockAccount: (userId: string) => {
      console.log("Unlock account:", userId);
      // TODO: Implémenter déverrouillage
    },
    onViewBookings: (userId: string, userName: string) => {
      setBookingsModal({ open: true, userId, userName });
    },
    onManageSubscription: (userId: string, userName: string) => {
      setSubscriptionModal({ open: true, userId, userName });
    },
    onManageServices: (userId: string, userName: string) => {
      setServicesModal({ open: true, userId, userName });
    },
    onToggleVIP: (userId: string) => {
      console.log("Toggle VIP:", userId);
      // TODO: Implémenter toggle VIP
    },
    onValidateProvider: (userId: string) => {
      console.log("Validate provider:", userId);
      // TODO: Implémenter validation prestataire
    },
    activityData: {},
    currentUserRole: UserRole.ADMIN,
    currentTabRole: selectedUserRole,
  });

  // Appliquer les filtres (version simplifiée)
  const filteredUsers = users.filter((user) => {
    if (userManagement.filters.search) {
      const search = userManagement.filters.search.toLowerCase();
      return (
        user.email?.toLowerCase().includes(search) ||
        user.full_name?.toLowerCase().includes(search)
      );
    }
    return true;
  });

  // Event handlers
  const handleTabChange = (
    event: React.MouseEvent<HTMLElement>,
    newValue: number | null
  ) => {
    if (newValue !== null) {
      setActiveTab(newValue);
      setSelectedUserRole(USER_TABS[newValue].role);
    }
  };

  const handleExportUsers = async (format: "csv") => {
    console.log("Export users:", format);
  };

  // Modal handlers pour les modals role-spécifiques
  const handleCloseBookingsModal = () =>
    setBookingsModal({ open: false, userId: "", userName: "" });

  const handleCloseSubscriptionModal = () =>
    setSubscriptionModal({ open: false, userId: "", userName: "" });

  const handleCloseServicesModal = () =>
    setServicesModal({ open: false, userId: "", userName: "" });

  // Action handlers
  const handleBulkValidate = () => {
    console.log("Bulk validate");
  };

  const handleBulkSuspend = () => {
    console.log("Bulk suspend");
  };

  const handleBulkAction = (actionType: "delete" | "role" | "vip") => {
    console.log("Bulk action:", actionType);
    modals.openBulkActionModal(actionType);
  };

  // Error state
  if (error) {
    return (
      <AdminLayout>
        <UserLoadingIndicator error={error} onRefresh={() => refetch()} />
      </AdminLayout>
    );
  }

  return (
    <AdminLayout>
      <Box sx={{ height: "100%", display: "flex", flexDirection: "column" }}>
        {/* En-tête de la page */}
        <UserHeader
          activeTab={activeTab}
          userTabs={USER_TABS}
          onCreateUser={() => modals.openCreateUserModal()}
          onExportUsers={handleExportUsers}
          onRefresh={() => refetch()}
          isFetching={isFetching}
        />

        {/* Section statistiques */}
        <UserStatsSection allUsers={allUsers} activityData={{}} error={error} />

        {/* Section du tableau (complètement modularisée) */}
        <UserTableSection
          filters={userManagement.filters}
          onUpdateFilter={
            userManagement.updateFilter as (key: string, value: string) => void
          }
          activeTab={activeTab}
          allUsers={allUsers}
          onTabChange={handleTabChange}
          selectedUsers={userManagement.selectedUsers}
          onBulkValidate={handleBulkValidate}
          onBulkSuspend={handleBulkSuspend}
          onBulkAction={handleBulkAction}
          columns={columns}
          filteredUsers={filteredUsers}
          isLoading={isLoading}
        />

        {/* Gestionnaire de toutes les modals */}
        <UserModalsManager
          // User Details Modal
          showUserDetailsModal={modals.showUserDetailsModal}
          selectedUser={userManagement.selectedUser}
          onCloseUserDetailsModal={modals.closeUserDetailsModal}
          // Create User Modal
          showCreateUserModal={modals.showCreateUserModal}
          onCloseCreateUserModal={modals.closeCreateUserModal}
          // Password Reset Modal
          showPasswordResetModal={modals.showPasswordResetModal}
          passwordResetUserId={modals.passwordResetUserId}
          onClosePasswordResetModal={modals.closePasswordResetModal}
          // Audit Modal (with proper state)
          showAuditModal={modals.showAuditModal}
          auditState={modals.audit}
          userEmail={userManagement.selectedUser?.email}
          onCloseAuditModal={modals.closeAuditModal}
          onUpdateAuditTab={modals.updateAuditTab}
          // Lock Modal (with proper state)
          showLockModal={modals.showLockModal}
          lockAccountState={modals.lockAccount}
          onCloseLockModal={modals.closeLockModal}
          onUpdateLockDuration={modals.updateLockDuration}
          onUpdateLockReason={modals.updateLockReason}
          // Bulk Action Modal (with proper state)
          showBulkActionModal={modals.showBulkActionModal}
          bulkActionState={modals.bulkAction}
          selectedUsers={userManagement.selectedUsers}
          onCloseBulkActionModal={modals.closeBulkActionModal}
          onUpdateRoleChange={modals.updateBulkRoleChange}
          onUpdateVipChange={modals.updateBulkVipChange}
          // Role-specific modals
          bookingsModal={bookingsModal}
          subscriptionModal={subscriptionModal}
          servicesModal={servicesModal}
          onCloseBookingsModal={handleCloseBookingsModal}
          onCloseSubscriptionModal={handleCloseSubscriptionModal}
          onCloseServicesModal={handleCloseServicesModal}
          // Action handlers
          onSaveUser={() => console.log("Save user")}
          onSuspendUser={() => console.log("Suspend user")}
          onInputChange={() => console.log("Input change")}
          onCreateUser={() => console.log("Create user")}
          onPasswordResetConfirm={() => console.log("Password reset confirmed")}
          onLockAccountConfirm={() => console.log("Account locked")}
          onBulkActionConfirm={() => console.log("Bulk action confirmed")}
        />
      </Box>
    </AdminLayout>
  );
};
