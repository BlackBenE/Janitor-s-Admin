import React from "react";
import { Box, Button, Fab, Tooltip, Snackbar, Alert } from "@mui/material";
import { Add as AddIcon, Download as DownloadIcon } from "@mui/icons-material";

import AdminLayout from "../AdminLayout";
import DataTable from "../Table";
import { UserStatsCards } from "./UserStatsCards";
import { UserFiltersComponent } from "./UserFilters";
import { UserActions } from "./UserActions";

// Modales
import {
  UserDetailsModal,
  CreateUserModal,
  PasswordResetModal,
  AuditModal,
  LockAccountModal,
  BulkActionModal,
} from "./modals";

// Hooks - Import optimisé depuis index
import {
  useUserManagement,
  useUsers,
  useUserActivity,
  useAuditLog,
  useSecurityActions,
  useUserModals,
} from "../../hooks";
import { useAuth } from "../../providers/authProvider";

// Types
import { UserProfile } from "../../types/userManagement";

// Colonnes et logique métier
import { createUserTableColumns } from "./UserTableColumns";
import { useUserActions } from "./hooks/useUserActions";

export const UserManagementPage: React.FC = () => {
  // Hooks principaux
  const userManagement = useUserManagement();
  const modals = useUserModals();
  const { getEmail } = useAuth();

  // Hooks de données
  const {
    users,
    isLoading,
    error,
    updateUser,
    createUser,
    deleteManyUsers,
    refetch,
  } = useUsers({
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

  // Données filtrées
  const filteredUsers = userManagement.filterUsers(users);

  // Colonnes du tableau
  const columns = createUserTableColumns({
    selectedUsers: userManagement.selectedUsers,
    activityData,
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
  });

  // Gestion de l'export
  const handleExportUsers = async (format: "csv") => {
    await userActions.handleExportUsers(
      format,
      filteredUsers,
      userManagement.filters
    );
  };

  // Gestion des modales - Actions utilisateur
  const handleSaveUser = () => {
    if (
      !userManagement.selectedUser ||
      Object.keys(userManagement.editForm).length === 0
    ) {
      userManagement.showNotification("No changes detected", "info");
      return;
    }

    const changedFields = Object.keys(userManagement.editForm).filter((key) => {
      const editValue = userManagement.editForm[key as keyof UserProfile];
      const originalValue =
        userManagement.selectedUser![key as keyof UserProfile];
      return editValue !== originalValue;
    });

    if (changedFields.length === 0) {
      userManagement.showNotification("No changes detected", "info");
      return;
    }

    // Helper function pour l'assignation type-safe
    const safeAssign = <K extends keyof UserProfile>(
      target: Partial<UserProfile>,
      key: K,
      value: unknown
    ): void => {
      if (value !== undefined) {
        (target as Record<K, unknown>)[key] = value;
      }
    };

    const updatePayload: Partial<UserProfile> = {};
    changedFields.forEach((field) => {
      const key = field as keyof UserProfile;
      const value = userManagement.editForm[key];
      safeAssign(updatePayload, key, value);
    });

    updateUser.mutate(
      {
        id: userManagement.selectedUser.id,
        payload: updatePayload,
      },
      {
        onSuccess: async () => {
          await logAction(
            auditActions.USER_UPDATED,
            userManagement.selectedUser!.id,
            `Fields modified: ${changedFields.join(", ")}`,
            getEmail() || "system",
            {
              changedFields,
              oldValues: changedFields.reduce((acc, field) => {
                acc[field] =
                  userManagement.selectedUser![field as keyof UserProfile];
                return acc;
              }, {} as Record<string, unknown>),
              newValues: changedFields.reduce((acc, field) => {
                acc[field] =
                  userManagement.editForm[field as keyof UserProfile];
                return acc;
              }, {} as Record<string, unknown>),
            }
          );

          userManagement.showNotification(
            `User updated successfully (${changedFields.length} field${
              changedFields.length > 1 ? "s" : ""
            } modified)`,
            "success"
          );
          modals.closeUserDetailsModal();
          userManagement.resetEditForm();
        },
        onError: (error) => {
          userManagement.showNotification(
            `Error updating user: ${error.message}`,
            "error"
          );
        },
      }
    );
  };

  const handleSuspendUser = () => {
    if (!userManagement.selectedUser) return;

    updateUser.mutate(
      {
        id: userManagement.selectedUser.id,
        payload: { profile_validated: false },
      },
      {
        onSuccess: async () => {
          await logAction(
            auditActions.USER_SUSPENDED,
            userManagement.selectedUser!.id,
            "Account suspended by administrator",
            getEmail() || "system",
            {
              reason: "admin_action",
              previousStatus: userManagement.selectedUser!.profile_validated,
            }
          );

          userManagement.showNotification(
            "User suspended successfully",
            "success"
          );
          modals.closeUserDetailsModal();
          userManagement.resetEditForm();
        },
        onError: (error) => {
          userManagement.showNotification(
            `Error suspending user: ${error.message}`,
            "error"
          );
        },
      }
    );
  };

  const handleCreateUser = async () => {
    if (
      Object.keys(userManagement.editForm).length === 0 ||
      !userManagement.editForm.email ||
      !userManagement.editForm.role
    ) {
      userManagement.showNotification("Email and role are required", "warning");
      return;
    }

    try {
      const userData = {
        email: userManagement.editForm.email!,
        role: userManagement.editForm.role!,
        full_name: userManagement.editForm.full_name || null,
        phone: userManagement.editForm.phone || null,
        profile_validated: userManagement.editForm.profile_validated || false,
        vip_subscription: userManagement.editForm.vip_subscription || false,
      };

      const result = await securityActions.createUserWithAuth(userData);

      if (result.success && result.profile) {
        await logAction(
          auditActions.USER_CREATED,
          result.profile.id,
          `New user created: ${userData.email}`,
          getEmail() || "system",
          { userData }
        );

        userManagement.showNotification("User created successfully", "success");
        modals.closeCreateUserModal();
        userManagement.resetEditForm();
      } else {
        throw new Error("Failed to create user profile");
      }
    } catch (error) {
      console.error("Creation error:", error);
      userManagement.showNotification(
        `Error creating user: ${
          error instanceof Error ? error.message : "Unknown error"
        }`,
        "error"
      );
    }
  };

  const handleConfirmPasswordReset = async () => {
    if (!modals.passwordResetUserId) return;

    try {
      await securityActions.resetPassword(
        modals.passwordResetUserId,
        "Admin-initiated password reset"
      );

      await logAction(
        auditActions.PASSWORD_RESET,
        modals.passwordResetUserId,
        "Password reset email sent by administrator",
        getEmail() || "system",
        { reason: "Admin-initiated password reset" }
      );

      userManagement.showNotification(
        "Password reset email sent successfully",
        "success"
      );
      modals.closePasswordResetModal();
    } catch {
      userManagement.showNotification(
        "Error sending password reset email",
        "error"
      );
    }
  };

  // Handler pour verrouiller un compte
  const handleLockAccount = async () => {
    if (!modals.lockAccount.userId || !modals.lockAccount.reason.trim()) {
      userManagement.showNotification(
        "Raison requise pour verrouiller le compte",
        "warning"
      );
      return;
    }

    try {
      // Utilisons updateUser.mutateAsync comme pour l'action VIP
      const lockUntil = new Date(
        Date.now() + modals.lockAccount.duration * 60000
      );

      await updateUser.mutateAsync({
        id: modals.lockAccount.userId,
        payload: {
          account_locked: true,
          locked_until: lockUntil.toISOString(),
          lock_reason: modals.lockAccount.reason,
        },
      });

      await logAction(
        auditActions.USER_SUSPENDED,
        modals.lockAccount.userId,
        `Account locked for ${modals.lockAccount.duration} minutes: ${modals.lockAccount.reason}`,
        getEmail() || "system",
        {
          duration: modals.lockAccount.duration,
          reason: modals.lockAccount.reason,
          lockedUntil: lockUntil.toISOString(),
        }
      );

      userManagement.showNotification(
        "Compte verrouillé avec succès",
        "success"
      );
      modals.closeLockModal();

      // Rafraîchir les données pour refléter les changements
      refetch();
    } catch (error) {
      userManagement.showNotification(
        `Erreur lors du verrouillage: ${
          error instanceof Error ? error.message : "Erreur inconnue"
        }`,
        "error"
      );
    }
  };

  // Handler pour les actions en masse
  const handleBulkAction = async () => {
    if (userManagement.selectedUsers.length === 0) {
      userManagement.showNotification(
        "Aucun utilisateur sélectionné",
        "warning"
      );
      return;
    }

    try {
      switch (modals.bulkAction.type) {
        case "delete":
          await deleteManyUsers.mutateAsync(userManagement.selectedUsers);
          break;
        case "role":
          if (!modals.bulkAction.roleChange) {
            userManagement.showNotification("Sélectionnez un rôle", "warning");
            return;
          }
          await Promise.all(
            userManagement.selectedUsers.map((userId) =>
              updateUser.mutateAsync({
                id: userId,
                payload: { role: modals.bulkAction.roleChange },
              })
            )
          );
          break;
        case "vip":
          await Promise.all(
            userManagement.selectedUsers.map((userId) =>
              updateUser.mutateAsync({
                id: userId,
                payload: { vip_subscription: modals.bulkAction.vipChange },
              })
            )
          );
          break;
      }

      await logAction(
        auditActions.BULK_ACTION,
        "system",
        `Bulk action ${modals.bulkAction.type} applied to ${userManagement.selectedUsers.length} users`,
        getEmail() || "system",
        {
          action: modals.bulkAction.type,
          userIds: userManagement.selectedUsers,
          details: modals.bulkAction,
        }
      );

      userManagement.showNotification(
        `Action en masse réalisée avec succès sur ${
          userManagement.selectedUsers.length
        } utilisateur${userManagement.selectedUsers.length > 1 ? "s" : ""}`,
        "success"
      );

      modals.closeBulkActionModal();
      userManagement.clearUserSelection();
    } catch (error) {
      userManagement.showNotification(
        `Erreur lors de l'action en masse: ${
          error instanceof Error ? error.message : "Unknown error"
        }`,
        "error"
      );
    }
  };

  return (
    <AdminLayout>
      <Box>
        <h2>User Management</h2>
        <p>
          Manage users, subscriptions, and account activities across the
          platform.
        </p>
      </Box>

      {/* Cartes de statistiques */}
      <UserStatsCards
        filteredUsers={filteredUsers}
        activityData={activityData}
      />

      {/* Message d'erreur */}
      {error && (
        <Box sx={{ color: "error.main", mb: 2 }}>
          Error loading users:{" "}
          {error instanceof Error ? error.message : "Unknown error"}
        </Box>
      )}

      {/* Section principale */}
      <Box sx={{ mt: 2, border: "1px solid #ddd", borderRadius: 4, p: 2 }}>
        <Box
          sx={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            mb: 2,
          }}
        >
          <Box>
            <h3>Users</h3>
            <p>Manage user accounts and subscriptions</p>
          </Box>
          <Box sx={{ display: "flex", gap: 1 }}>
            <Tooltip title="Exporter en CSV">
              <Button
                variant="outlined"
                size="small"
                startIcon={<DownloadIcon />}
                onClick={() => handleExportUsers("csv")}
              >
                CSV
              </Button>
            </Tooltip>
            <Fab
              color="primary"
              size="medium"
              onClick={modals.openCreateUserModal}
              sx={{ ml: 1 }}
            >
              <AddIcon />
            </Fab>
          </Box>
        </Box>

        {/* Filtres et Actions */}
        <Box sx={{ display: "flex", flexDirection: "column", gap: 2 }}>
          <UserFiltersComponent
            filters={userManagement.filters}
            onUpdateFilter={userManagement.updateFilter}
          />

          <UserActions
            selectedUsers={userManagement.selectedUsers}
            onBulkValidate={userActions.handleBulkValidate}
            onBulkSuspend={userActions.handleBulkSuspend}
            onBulkAction={modals.openBulkActionModal}
          />
        </Box>

        {/* Tableau */}
        <DataTable columns={columns} data={filteredUsers} />

        {/* Loading */}
        {(isLoading || activityLoading) && (
          <Box sx={{ textAlign: "center", py: 2 }}>
            Loading {isLoading ? "users" : "activity data"}...
          </Box>
        )}
      </Box>

      {/* Modales - À implémenter dans les prochains composants */}

      {/* User Details Modal */}
      <UserDetailsModal
        open={modals.showUserDetailsModal}
        user={userManagement.selectedUser}
        editForm={userManagement.editForm}
        onClose={modals.closeUserDetailsModal}
        onSave={handleSaveUser}
        onSuspend={handleSuspendUser}
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
        onCreate={handleCreateUser}
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
        onConfirm={handleConfirmPasswordReset}
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
        onConfirm={handleLockAccount}
        onUpdateDuration={modals.updateLockDuration}
        onUpdateReason={modals.updateLockReason}
      />

      {/* Bulk Action Modal */}
      <BulkActionModal
        open={modals.showBulkActionModal}
        bulkAction={modals.bulkAction}
        selectedUsers={userManagement.selectedUsers}
        onClose={modals.closeBulkActionModal}
        onConfirm={handleBulkAction}
        onUpdateRoleChange={modals.updateBulkRoleChange}
        onUpdateVipChange={modals.updateBulkVipChange}
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
    </AdminLayout>
  );
};

export default UserManagementPage;
