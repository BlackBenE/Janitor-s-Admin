import React from "react";
import {
  Box,
  Button,
  Tooltip,
  Snackbar,
  Alert,
  Typography,
  IconButton,
  CircularProgress,
} from "@mui/material";
import {
  Add as AddIcon,
  Download as DownloadIcon,
  Refresh as RefreshIcon,
} from "@mui/icons-material";

import AdminLayout from "../AdminLayout";
import DataTable from "../Table";
import { UserStatsCards } from "./UserStatsCards";
import { UserFiltersComponent } from "./UserFilters";
import { UserActions } from "./UserActions";
import { UserTabs } from "./UserTabs";

// Configuration
import { USER_TABS, UserRole } from "../../types/userManagement";

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
  useUserModals,
  useUsers,
  useUserActivity,
  useAuditLog,
  useSecurityActions,
} from "../../hooks/userManagement";
import { useAuth } from "../../providers/authProvider";
import { createUserTableColumns } from "./UserTableColumns";
import { useUserActions } from "./hooks/useUserActions";
import { useModalHandlers } from "./hooks/useModalHandlers";

// Types
import { UserProfile } from "../../types/userManagement";

export const UserManagementPage: React.FC = () => {
  const [activeTab, setActiveTab] = React.useState(0);
  const [selectedUserRole, setSelectedUserRole] =
    React.useState<UserRole | null>(
      null // for "All suers"
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

  // Main Hooks
  const userManagement = useUserManagement();
  const modals = useUserModals();
  const { getEmail } = useAuth();

  // Hook pour récupérer tous les utilisateurs (pour les tabs et cartes)
  const {
    users: allUsers,
    isLoading,
    isFetching,
    error,
    updateUser,
    createUser,
    deleteManyUsers,
    refetch,
  } = useUsers({
    filters: {}, // Pas de filtre pour avoir tous les utilisateurs
    orderBy: "created_at",
  });

  // Filtrage côté client par rôle
  const users = selectedUserRole
    ? allUsers.filter((user) => user.role === selectedUserRole)
    : allUsers;
  const userIds = users.map((user: UserProfile) => user.id);
  const { data: activityData, isLoading: activityLoading } =
    useUserActivity(userIds);

  // Hooks d'actions
  const { logAction, auditActions } = useAuditLog();
  const securityActions = useSecurityActions(); // Logique métier
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

  // Données filtrées par rôle actuel avec déverrouillage automatique
  const rawFilteredUsers = userManagement.filterUsers(users);
  const filteredUsers =
    securityActions.processUsersWithExpiredLocks(rawFilteredUsers);

  // Colonnes du tableau avec actions role-spécifiques
  const columns = createUserTableColumns({
    selectedUsers: userManagement.selectedUsers,
    activityData,
    currentUserRole: selectedUserRole,
    currentTabRole: selectedUserRole, // Ajouter l'onglet actuel
    onToggleUserSelection: userManagement.toggleUserSelection,
    onShowUser: (user: UserProfile) => {
      userManagement.setUserForEdit(user);
      modals.openUserDetailsModal();
    },
    onShowAudit: modals.openAuditModal,
    onPasswordReset: modals.openPasswordResetModal,
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
      {/* En-tête de la page avec bouton refresh - même structure que dashboard */}
      <Box
        sx={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          mb: 3,
        }}
      >
        <Box>
          <Typography variant="h4" component="h1" gutterBottom>
            Gestion des utilisateurs
          </Typography>
          <Typography variant="body1" color="text.secondary">
            Gérez tous les types d'utilisateurs, y compris les locataires, les
            propriétaires et les prestataires de services sur l'ensemble de la
            plateforme.
          </Typography>
        </Box>
        <Box sx={{ display: "flex", gap: 1 }}>
          <Tooltip
            title={`Créer un nouveau ${USER_TABS[activeTab].label
              .slice(0, -1)
              .toLowerCase()}`}
          >
            <IconButton
              size="large"
              onClick={() => modals.openCreateUserModal()}
            >
              <AddIcon />
            </IconButton>
          </Tooltip>
          <Tooltip title="Exporter les données en CSV">
            <IconButton onClick={() => handleExportUsers("csv")} size="large">
              <DownloadIcon />
            </IconButton>
          </Tooltip>
          <Tooltip title="Actualiser les utilisateurs">
            <IconButton
              onClick={() => refetch()}
              disabled={isFetching}
              size="large"
            >
              {isFetching ? <CircularProgress size={24} /> : <RefreshIcon />}
            </IconButton>
          </Tooltip>
        </Box>
      </Box>

      {/* Cartes de statistiques globales */}
      <UserStatsCards filteredUsers={allUsers} activityData={activityData} />

      {/* Message d'erreur */}
      {error && (
        <Alert severity="error" sx={{ mb: 2 }}>
          Erreur lors du chargement des utilisateurs :{" "}
          {error instanceof Error ? error.message : "Unknown error"}
        </Alert>
      )}

      <Box sx={{ mt: 2, border: "1px solid #ddd", borderRadius: 4, p: 2 }}>
        {/* Filtres simplifiés - seulement le statut */}
        <h3>Tous les utilisateurs</h3>
        <p>
          Gérez les utilisateurs de toutes les catégories grâce à des vues
          spécialisées.
        </p>
        <Box sx={{ mb: 3 }}>
          <UserFiltersComponent
            filters={userManagement.filters}
            onUpdateFilter={userManagement.updateFilter}
            simplified={true}
          />
        </Box>

        {/* Onglets en style toggle sous les filtres */}
        <Box sx={{ mb: 3 }}>
          <UserTabs
            activeTab={activeTab}
            users={allUsers}
            onTabChange={handleTabChange}
          />
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
          userRole={
            modals.passwordResetUserId
              ? users.find((u) => u.id === modals.passwordResetUserId)?.role
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
