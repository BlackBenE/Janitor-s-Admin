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
import {
  useUserManagement,
  useUserModals,
  useUsers,
  useUserActivity,
  useSecurityActions,
  useBulkActions,
  useRoleModals,
} from "./hooks";
import { useAuth } from "../../providers/authProvider";

export const UserManagementPage: React.FC = () => {
  const [activeTab, setActiveTab] = React.useState(0);
  const [selectedUserRole, setSelectedUserRole] =
    React.useState<UserRole | null>(null);

  // Main Hooks
  const userManagement = useUserManagement();
  const modals = useUserModals();
  const securityActions = useSecurityActions();
  const roleModals = useRoleModals();
  const { getEmail } = useAuth();

  // Hook pour récupérer tous les utilisateurs
  const {
    users: allUsers,
    isLoading,
    isFetching,
    error,
    updateUser,
    createUser,
    deleteUser,
    deleteManyUsers,
    refetch,
  } = useUsers({
    filters: {},
    orderBy: "created_at",
  });

  // Filtrage côté client par rôle
  const users = selectedUserRole
    ? allUsers.filter((user) => user.role === selectedUserRole)
    : allUsers;

  // Hook pour les actions en lot (bulk actions)
  const bulkActions = useBulkActions({
    users,
    selectedUsers: userManagement.selectedUsers,
    clearUserSelection: userManagement.clearUserSelection,
    showNotification: userManagement.showNotification,
  });

  // Hook pour les données d'activité des utilisateurs
  const userIds = users.map((user) => user.id);
  const {
    data: activityData,
    isLoading: isLoadingActivity,
    error: activityError,
  } = useUserActivity(userIds);

  // Configuration du tableau avec toutes les fonctionnalités
  const columns = createUserTableColumns({
    selectedUsers: userManagement.selectedUsers,
    onToggleUserSelection: userManagement.toggleUserSelection,
    onShowUser: (user: UserProfile) => {
      userManagement.setUserForEdit(user);
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
    onUnlockAccount: async (userId: string) => {
      try {
        await securityActions.unlockAccount(userId, "Déverrouillé par admin");
        userManagement.showNotification(
          "Compte déverrouillé avec succès",
          "success"
        );
        refetch();
      } catch (error) {
        userManagement.showNotification(
          "Erreur lors du déverrouillage",
          "error"
        );
        console.error("Unlock error:", error);
      }
    },
    onViewBookings: roleModals.openBookingsModal,
    onManageSubscription: roleModals.openSubscriptionModal,
    onManageServices: roleModals.openServicesModal,
    onToggleVIP: async (userId: string) => {
      try {
        const user = users.find((u) => u.id === userId);
        if (!user) return;

        await updateUser.mutateAsync({
          id: userId,
          payload: { vip_subscription: !user.vip_subscription },
        });

        userManagement.showNotification(
          `Statut VIP ${
            user.vip_subscription ? "désactivé" : "activé"
          } avec succès`,
          "success"
        );
      } catch (error) {
        userManagement.showNotification(
          "Erreur lors du changement VIP",
          "error"
        );
        console.error("Toggle VIP error:", error);
      }
    },
    onValidateProvider: async (userId: string) => {
      try {
        await updateUser.mutateAsync({
          id: userId,
          payload: { profile_validated: true },
        });

        userManagement.showNotification(
          "Prestataire validé avec succès",
          "success"
        );
      } catch (error) {
        userManagement.showNotification(
          "Erreur lors de la validation",
          "error"
        );
        console.error("Validate provider error:", error);
      }
    },
    activityData: activityData || {},
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

  // Handlers simples pour les fonctions non-bulk
  const handleTabChange = (
    event: React.MouseEvent<HTMLElement>,
    newValue: number | null
  ) => {
    if (newValue !== null) {
      setActiveTab(newValue);
      const role = USER_TABS[newValue]?.role || null;
      setSelectedUserRole(role);
    }
  };

  const handleExportUsers = async (format: "csv") => {
    userManagement.showNotification("Export functionality coming soon", "info");
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
          onBulkValidate={bulkActions.handleBulkValidate}
          onBulkSetPending={bulkActions.handleBulkSetPending}
          onBulkSuspend={bulkActions.handleBulkSuspend}
          onBulkUnsuspend={bulkActions.handleBulkUnsuspend}
          onBulkAction={bulkActions.handleBulkAction}
          onBulkAddVip={bulkActions.handleBulkAddVip}
          onBulkRemoveVip={bulkActions.handleBulkRemoveVip}
          columns={columns}
          filteredUsers={filteredUsers}
          isLoading={isLoading}
        />

        {/* Gestionnaire de toutes les modals */}
        <UserModalsManager
          // User Details Modal
          showUserDetailsModal={modals.showUserDetailsModal}
          selectedUser={userManagement.selectedUser}
          editForm={userManagement.editForm}
          onCloseUserDetailsModal={() => {
            modals.closeUserDetailsModal();
            userManagement.resetEditForm();
          }}
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
          bookingsModal={roleModals.bookingsModal}
          subscriptionModal={roleModals.subscriptionModal}
          servicesModal={roleModals.servicesModal}
          onCloseBookingsModal={roleModals.closeBookingsModal}
          onCloseSubscriptionModal={roleModals.closeSubscriptionModal}
          onCloseServicesModal={roleModals.closeServicesModal}
          // Action handlers
          onSaveUser={async () => {
            try {
              if (!userManagement.selectedUser) return;
              await updateUser.mutateAsync({
                id: userManagement.selectedUser.id,
                payload: userManagement.editForm,
              });
              userManagement.showNotification(
                "Utilisateur mis à jour",
                "success"
              );
              modals.closeUserDetailsModal();
            } catch (error) {
              userManagement.showNotification(
                "Erreur lors de la mise à jour",
                "error"
              );
            }
          }}
          onOpenLockModal={() => {
            if (userManagement.selectedUser) {
              modals.openLockModal(userManagement.selectedUser.id);
            }
          }}
          onUnlockAccount={async () => {
            try {
              if (!userManagement.selectedUser) return;
              console.log("Unlocking user:", userManagement.selectedUser.id);
              await securityActions.unlockAccount(
                userManagement.selectedUser.id
              );
              console.log("Unlock successful, refreshing data...");
              const refetchResult = await refetch();
              console.log("🔄 Refetch result after unlock:", refetchResult);
              userManagement.showNotification(
                "Compte déverrouillé avec succès",
                "success"
              );
              modals.closeUserDetailsModal(); // Ferme la modal après unlock
            } catch (error) {
              console.error("Unlock error:", error);
              userManagement.showNotification(
                "Erreur lors du déverrouillage",
                "error"
              );
            }
          }}
          onResetPassword={async () => {
            try {
              if (!userManagement.selectedUser) return;
              await securityActions.resetPassword(
                userManagement.selectedUser.id,
                "Réinitialisation par admin depuis le modal utilisateur"
              );
              userManagement.showNotification(
                "Email de réinitialisation envoyé",
                "success"
              );
            } catch (error) {
              userManagement.showNotification(
                "Erreur lors de l'envoi de l'email",
                "error"
              );
            }
          }}
          onDeleteUser={async () => {
            try {
              if (!userManagement.selectedUser) return;
              await deleteUser.mutateAsync(userManagement.selectedUser.id);
              userManagement.showNotification(
                "Utilisateur supprimé",
                "success"
              );
              modals.closeUserDetailsModal();
              userManagement.resetEditForm();
            } catch (error) {
              userManagement.showNotification(
                "Erreur lors de la suppression",
                "error"
              );
            }
          }}
          onInputChange={userManagement.updateEditForm}
          onCreateUser={async () => {
            try {
              const result = await securityActions.createUserWithAuth({
                email: userManagement.editForm.email || "",
                role: userManagement.editForm.role || "traveler",
                full_name: userManagement.editForm.full_name,
                phone: userManagement.editForm.phone,
                profile_validated:
                  userManagement.editForm.profile_validated ?? false,
                vip_subscription:
                  userManagement.editForm.vip_subscription ?? false,
              });

              if (result.success) {
                userManagement.showNotification(
                  "Utilisateur créé avec succès",
                  "success"
                );
                modals.closeCreateUserModal();
                userManagement.resetEditForm();
                refetch();
              } else {
                userManagement.showNotification(
                  result.message || "Erreur lors de la création",
                  "error"
                );
              }
            } catch (error) {
              userManagement.showNotification(
                "Erreur lors de la création",
                "error"
              );
              console.error("Create user error:", error);
            }
          }}
          onPasswordResetConfirm={async () => {
            try {
              if (!modals.passwordResetUserId) return;
              await securityActions.resetPassword(
                modals.passwordResetUserId,
                "Réinitialisation par admin"
              );
              userManagement.showNotification(
                "Email de réinitialisation envoyé",
                "success"
              );
              modals.closePasswordResetModal();
            } catch (error) {
              userManagement.showNotification(
                "Erreur lors de la réinitialisation",
                "error"
              );
            }
          }}
          onLockAccountConfirm={async () => {
            console.log("onLockAccountConfirm called!", modals.lockAccount);
            try {
              if (!modals.lockAccount.userId) {
                console.log("No userId found!");
                return;
              }
              console.log("Calling lockAccount with:", {
                userId: modals.lockAccount.userId,
                duration: modals.lockAccount.duration,
                reason: modals.lockAccount.reason,
              });
              await securityActions.lockAccount(
                modals.lockAccount.userId,
                modals.lockAccount.duration,
                modals.lockAccount.reason
              );
              console.log("Lock successful, refreshing data...");
              const refetchResult = await refetch(); // Rafraîchit les données des utilisateurs
              console.log("🔄 Refetch result:", refetchResult);
              userManagement.showNotification(
                "Compte verrouillé avec succès",
                "success"
              );
              modals.closeLockModal();
            } catch (error) {
              console.error("Lock error:", error);
              userManagement.showNotification(
                "Erreur lors du verrouillage",
                "error"
              );
            }
          }}
          onBulkActionConfirm={bulkActions.handleBulkActionConfirm}
        />
      </Box>
    </AdminLayout>
  );
};
