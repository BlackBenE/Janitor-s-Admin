import React from "react";
import {
  Box,
  Button,
  Tooltip,
  Snackbar,
  Alert,
  Typography,
} from "@mui/material";
import { Add as AddIcon, Download as DownloadIcon } from "@mui/icons-material";

import AdminLayout from "../AdminLayout";
import DataTable from "../Table";
import { UserStatsCards } from "./UserStatsCards";
import { UserFiltersComponent } from "./UserFilters";
import { UserActions } from "./UserActions";
import { UserTabs } from "./UserTabs";

// Configuration
import { USER_TABS, UserRole } from "./config/userTabs";

// Modales
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
} from "./modals";

// Hooks
import {
  useUserManagement,
  useUsers,
  useUserActivity,
  useAuditLog,
  useSecurityActions,
  useUserModals,
} from "../../hooks";
import { useAuth } from "../../providers/authProvider";
import { createUserTableColumns } from "./UserTableColumns";
import { useUserActions } from "./hooks/useUserActions";
import { useModalHandlers } from "./hooks/useModalHandlers";

// Types
import { UserProfile } from "../../types/userManagement";

export const UserManagementPage: React.FC = () => {
  // State pour les onglets
  const [activeTab, setActiveTab] = React.useState(0);
  const [selectedUserRole, setSelectedUserRole] =
    React.useState<UserRole | null>(
      null // null pour "All Users"
    );

  // State pour les nouvelles modals role-spécifiques
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

  // Hooks principaux
  const userManagement = useUserManagement();
  const modals = useUserModals();
  const { getEmail } = useAuth();

  // Hooks de données avec filtrage par rôle
  const {
    users,
    isLoading,
    error,
    updateUser,
    createUser,
    deleteManyUsers,
    refetch,
  } = useUsers({
    filters: selectedUserRole ? { role: selectedUserRole } : {}, // Pas de filtre si "All Users"
    orderBy: "created_at",
  });
  const userIds = users.map((user: UserProfile) => user.id);
  const { data: activityData, isLoading: activityLoading } =
    useUserActivity(userIds);

  // Hooks d'actions
  const { logAction, auditActions } = useAuditLog();
  const securityActions = useSecurityActions();

  // Logique métier
  const userActions = useUserActions({
    userManagement,
    updateUser,
    logAction,
    auditActions,
    securityActions,
    getEmail,
    refetch,
  });

  // Handlers de modales
  const modalHandlers = useModalHandlers({
    userManagement,
    updateUser,
    logAction,
    auditActions,
    securityActions,
    modals,
    refetch,
  });

  // Handler pour changer d'onglet
  const handleTabChange = (
    event: React.MouseEvent<HTMLElement>,
    newValue: number | null
  ) => {
    if (newValue !== null) {
      setActiveTab(newValue);
      setSelectedUserRole(USER_TABS[newValue].role);
    }
  };

  // Handlers pour les nouvelles modals
  const handleOpenBookingsModal = (userId: string, userName: string) => {
    setBookingsModal({ open: true, userId, userName });
  };

  const handleOpenSubscriptionModal = (userId: string, userName: string) => {
    setSubscriptionModal({ open: true, userId, userName });
  };

  const handleOpenServicesModal = (userId: string, userName: string) => {
    setServicesModal({ open: true, userId, userName });
  };

  const handleCloseBookingsModal = () => {
    setBookingsModal({ open: false, userId: "", userName: "" });
  };

  const handleCloseSubscriptionModal = () => {
    setSubscriptionModal({ open: false, userId: "", userName: "" });
  };

  const handleCloseServicesModal = () => {
    setServicesModal({ open: false, userId: "", userName: "" });
  };

  // Données filtrées par rôle actuel
  const filteredUsers = userManagement.filterUsers(users);

  // Colonnes du tableau avec actions role-spécifiques
  const columns = createUserTableColumns({
    selectedUsers: userManagement.selectedUsers,
    activityData,
    currentUserRole: selectedUserRole,
    onToggleUserSelection: userManagement.toggleUserSelection,
    onShowUser: (user: UserProfile) => {
      userManagement.setUserForEdit(user);
      modals.openUserDetailsModal();
    },
    onShowAudit: modals.openAuditModal,
    onPasswordReset: modals.openPasswordResetModal,
    onForceLogout: userActions.handleForceLogout,
    onLockAccount: modals.openLockModal,
    onUnlockAccount: userActions.handleUnlockAccount,
    // Nouvelles actions role-spécifiques
    onViewBookings: handleOpenBookingsModal,
    onManageSubscription: handleOpenSubscriptionModal,
    onManageServices: handleOpenServicesModal,
    onToggleVIP: userActions.handleToggleVIP,
    onValidateProvider: userActions.handleValidateProvider,
  });

  // Gestion de l'export
  const handleExportUsers = async (format: "csv") => {
    await userActions.handleExportUsers(
      format,
      filteredUsers,
      userManagement.filters
    );
  };

  return (
    <AdminLayout>
      {/* En-tête de la page */}
      <Box>
        <Typography variant="h4" component="h1" gutterBottom>
          User Management
        </Typography>
        <Typography variant="body1" color="text.secondary" sx={{ mb: 3 }}>
          Manage all user types including tenants, landlords, and service
          providers across the platform.
        </Typography>
      </Box>

      {/* Cartes de statistiques globales */}
      <UserStatsCards
        filteredUsers={filteredUsers}
        activityData={activityData}
      />

      {/* Message d'erreur */}
      {error && (
        <Alert severity="error" sx={{ mb: 2 }}>
          Error loading users:{" "}
          {error instanceof Error ? error.message : "Unknown error"}
        </Alert>
      )}

      <Box sx={{ mt: 2, border: "1px solid #ddd", borderRadius: 4, p: 2 }}>
        {/* Filtres simplifiés - seulement le statut */}
        <h3>All Users</h3>
        <p>Manage users across all categories with specialized views</p>
        <Box sx={{ mb: 3 }}>
          <UserFiltersComponent
            filters={userManagement.filters}
            onUpdateFilter={userManagement.updateFilter}
            simplified={true}
          />
        </Box>

        {/* Onglets en style toggle sous les filtres avec boutons d'action */}
        <Box
          sx={{
            mb: 3,
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            flexWrap: "wrap",
            gap: 2,
          }}
        >
          <UserTabs
            activeTab={activeTab}
            users={users}
            onTabChange={handleTabChange}
          />

          <Box sx={{ display: "flex", gap: 1 }}>
            <Tooltip title="Export to CSV">
              <Button
                variant="outlined"
                size="small"
                startIcon={<DownloadIcon />}
                onClick={() => handleExportUsers("csv")}
              >
                CSV
              </Button>
            </Tooltip>

            <Tooltip
              title={`Create new ${USER_TABS[activeTab].label
                .slice(0, -1)
                .toLowerCase()}`}
            >
              <Button
                variant="contained"
                startIcon={<AddIcon />}
                onClick={() => modals.openCreateUserModal()}
                size="small"
              >
                New{" "}
                {activeTab === 0
                  ? "User"
                  : USER_TABS[activeTab].label.slice(0, -1)}
              </Button>
            </Tooltip>
          </Box>
        </Box>

        {/* Actions et contrôles */}
        <Box
          sx={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            mb: 3,
          }}
        >
          {/* Actions en lot si des utilisateurs sont sélectionnés */}
          {userManagement.selectedUsers.length > 0 && (
            <UserActions
              selectedUsers={userManagement.selectedUsers}
              onBulkValidate={userActions.handleBulkValidate}
              onBulkSuspend={userActions.handleBulkSuspend}
              onBulkAction={modals.openBulkActionModal}
            />
          )}
        </Box>

        {/* Table des utilisateurs */}
        <DataTable columns={columns} data={filteredUsers} />

        {(isLoading || activityLoading) && (
          <Box sx={{ textAlign: "center", py: 2 }}>Loading...</Box>
        )}

        {filteredUsers.length === 0 && !isLoading && (
          <Box sx={{ textAlign: "center", py: 2, color: "text.secondary" }}>
            No {USER_TABS[activeTab].label.toLowerCase()} found
          </Box>
        )}

        {/* Modales */}

        {/* User Details Modal */}
        <UserDetailsModal
          open={modals.showUserDetailsModal}
          user={userManagement.selectedUser}
          editForm={userManagement.editForm}
          onClose={modals.closeUserDetailsModal}
          onSave={modalHandlers.handleSaveUser}
          onSuspend={modalHandlers.handleSuspendUser}
          onInputChange={userManagement.updateEditForm}
        />

        {/* Create User Modal */}
        <CreateUserModal
          open={modals.showCreateUserModal}
          editForm={userManagement.editForm}
          onClose={() => {
            modals.closeCreateUserModal();
            userManagement.resetEditForm();
          }}
          onCreate={modalHandlers.handleCreateUser}
          onInputChange={userManagement.updateEditForm}
        />

        {/* Password Reset Modal */}
        <PasswordResetModal
          open={modals.showPasswordResetModal}
          userId={modals.passwordResetUserId}
          userEmail={
            modals.passwordResetUserId
              ? users.find((u) => u.id === modals.passwordResetUserId)?.email
              : undefined
          }
          onClose={modals.closePasswordResetModal}
          onConfirm={modalHandlers.handleConfirmPasswordReset}
        />

        {/* Audit Modal */}
        <AuditModal
          open={modals.showAuditModal}
          audit={modals.audit}
          userEmail={
            modals.audit.userId
              ? users.find((u) => u.id === modals.audit.userId)?.email
              : undefined
          }
          onClose={modals.closeAuditModal}
          onUpdateTab={modals.updateAuditTab}
        />

        {/* Lock Account Modal */}
        <LockAccountModal
          open={modals.showLockModal}
          lockAccount={modals.lockAccount}
          userEmail={
            modals.lockAccount.userId
              ? users.find((u) => u.id === modals.lockAccount.userId)?.email
              : undefined
          }
          onClose={modals.closeLockModal}
          onConfirm={modalHandlers.handleLockAccount}
          onUpdateDuration={modals.updateLockDuration}
          onUpdateReason={modals.updateLockReason}
        />

        {/* Bulk Action Modal */}
        <BulkActionModal
          open={modals.showBulkActionModal}
          bulkAction={modals.bulkAction}
          selectedUsers={userManagement.selectedUsers}
          onClose={modals.closeBulkActionModal}
          onConfirm={modalHandlers.handleBulkAction}
          onUpdateRoleChange={modals.updateBulkRoleChange}
          onUpdateVipChange={modals.updateBulkVipChange}
        />

        {/* Nouvelles modals role-spécifiques */}

        {/* Bookings Modal */}
        <BookingsModal
          open={bookingsModal.open}
          onClose={handleCloseBookingsModal}
          userId={bookingsModal.userId}
          userName={bookingsModal.userName}
        />

        {/* Subscription Modal */}
        <SubscriptionModal
          open={subscriptionModal.open}
          onClose={handleCloseSubscriptionModal}
          userId={subscriptionModal.userId}
          userName={subscriptionModal.userName}
        />

        {/* Services Modal */}
        <ServicesModal
          open={servicesModal.open}
          onClose={handleCloseServicesModal}
          userId={servicesModal.userId}
          userName={servicesModal.userName}
        />

        {/* Notifications */}
        <Snackbar
          open={userManagement.notification.open}
          autoHideDuration={6000}
          onClose={userManagement.hideNotification}
          anchorOrigin={{ vertical: "bottom", horizontal: "right" }}
        >
          <Alert
            onClose={userManagement.hideNotification}
            severity={userManagement.notification.severity}
            sx={{ width: "100%" }}
          >
            {userManagement.notification.message}
          </Alert>
        </Snackbar>
      </Box>
    </AdminLayout>
  );
};

export default UserManagementPage;
