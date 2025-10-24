import React from "react";
import { Box } from "@mui/material";
import AdminLayout from "../AdminLayout";

// Components modularisés
import {
  UserHeader,
  UserStatsSection,
  UserTableSection,
  ModalsManager,
} from "./components";
import { LoadingIndicator } from "../shared";

// Types
import { UserRole, UserProfile, USER_TABS } from "../../types/userManagement";

// 🎯 MIGRATION: Hook unifié - SEUL hook utilisé
import { useUsers } from "./hooks/useUsers";
import { useAuth } from "@/core/providers/auth.provider";

export const UserManagementPage: React.FC = () => {
  // 🎯 MIGRATION: SEUL hook unifié utilisé - activeTab vient du hook
  const users = useUsers();
  const { getEmail } = useAuth();

  // Extraction des propriétés du hook unifié
  const {
    // Données utilisateurs depuis le hook unifié
    users: usersData,
    activeUsers,
    deletedUsers,
    adminUsers,

    // États de chargement et erreurs
    isLoading: unifiedLoading,
    isFetching: unifiedFetching,
    error: unifiedError,
    errorActive,
    isLoadingActive,
    isLoadingDeleted,
    isLoadingAdmins,
    errorDeleted,
    errorAdmins,

    // Actions CRUD
    updateUser,
    softDeleteUser,
    restoreUser,

    // Actions UI et état
    selectedUser,
    selectedUsers,
    editForm,
    filters,
    toggleUserSelection,
    setUserForEdit,
    setSelectedUser,
    resetEditForm,
    showNotification,
    updateFilter,

    // Form management
    updateEditForm,

    // Modals
    modals,

    // Security actions
    securityActions,

    // Anonymization
    anonymization,

    // Bulk actions
    bulkActions,

    // Export
    exportUsers,

    // Refresh
    refetch: unifiedRefetch,
    refetchActive,
    refetchDeleted,
    refetchAdmins,

    // Raw data (non filtrées par onglet)
    rawActiveUsers,
    rawDeletedUsers,
    rawAllUsers,
    rawAdminUsers,

    // Stats data (actifs sans admins - comme avant)
    statsUsers,

    // Tab management
    handleTabChange,
    activeTab,
    currentTabRole,
    isDeletedTab,
    isAdminTab,
  } = users;

  // Les états isDeletedTab et isAdminTab viennent maintenant du hook

  // Utiliser les données directement du hook unifié
  const allUsers = (() => {
    if (isDeletedTab) return deletedUsers;
    if (isAdminTab) return adminUsers;
    return activeUsers;
  })();

  const isLoading = (() => {
    if (isDeletedTab) return isLoadingDeleted;
    if (isAdminTab) return isLoadingAdmins;
    return isLoadingActive;
  })();

  const isFetching = (() => {
    if (isDeletedTab) return false;
    if (isAdminTab) return false;
    return unifiedFetching; // Utiliser la valeur du hook unifié
  })();

  const error = (() => {
    if (isDeletedTab) return errorDeleted;
    if (isAdminTab) return errorAdmins;
    return errorActive;
  })();

  const refetch = (() => {
    if (isDeletedTab) return refetchDeleted;
    if (isAdminTab) return refetchAdmins;
    return refetchActive;
  })();

  // Utiliser directement les utilisateurs du hook (plus besoin de filtrage manuel)
  const finalUsers = allUsers || [];

  // Debug: log des données
  console.log("UserManagementPage Debug:", {
    activeTab,
    isDeletedTab,
    isAdminTab,
    deletedUsersCount: deletedUsers?.length,
    activeUsersCount: activeUsers?.length,
    adminUsersCount: adminUsers?.length,
    currentTabRole,
    currentUsersCount: finalUsers.length,
    allUsersToDisplay: allUsers?.length,
  });

  // Les bulk actions et activity data sont maintenant dans le hook unifié
  const activityData = users.activityData || {};

  // Handlers pour les actions du tableau - maintenant passés directement à UserTableSection
  const tableHandlers = {
    onToggleUserSelection: toggleUserSelection,
    onShowUser: (user: UserProfile) => {
      setUserForEdit(user);
      modals.openUserDetailsModal();
    },
    onShowAudit: (userId: string) => {
      const user = finalUsers.find((u) => u.id === userId);
      if (user) setSelectedUser(user);
      modals.openAuditModal(userId);
    },
    onPasswordReset: (userId: string) => {
      const user = finalUsers.find((u) => u.id === userId);
      if (user) setSelectedUser(user);
      modals.openPasswordResetModal(userId);
    },
    onLockAccount: (userId: string) => {
      const user = finalUsers.find((u) => u.id === userId);
      if (user) setSelectedUser(user);
      modals.openLockModal(userId);
    },
    onUnlockAccount: async (userId: string) => {
      try {
        // 🎯 Utilisation de notre nouveau hook au lieu de securityActions
        await updateUser.mutateAsync({
          userId: userId,
          updates: { account_locked: false },
        });
        showNotification("Compte déverrouillé avec succès", "success");
        // Le refetch est déjà géré automatiquement par la mutation
      } catch (error) {
        showNotification("Erreur lors du déverrouillage", "error");
        console.error("Unlock error:", error);
      }
    },

    onToggleVIP: async (userId: string) => {
      try {
        const user = finalUsers.find((u) => u.id === userId);
        if (!user) return;

        await updateUser.mutateAsync({
          userId: userId,
          updates: { vip_subscription: !user.vip_subscription },
        });

        showNotification(
          `Statut VIP ${
            user.vip_subscription ? "désactivé" : "activé"
          } avec succès`,
          "success"
        );
      } catch (error) {
        showNotification("Erreur lors du changement VIP", "error");
        console.error("Toggle VIP error:", error);
      }
    },
    onValidateProvider: async (userId: string) => {
      try {
        await updateUser.mutateAsync({
          userId: userId,
          updates: { profile_validated: true },
        });

        showNotification("Prestataire validé avec succès", "success");
      } catch (error) {
        showNotification("Erreur lors de la validation", "error");
        console.error("Validate provider error:", error);
      }
    },
  };

  // 🎯 Les filtres sont maintenant appliqués directement dans les hooks
  // Plus besoin de filtrage manuel ici
  const filteredUsers = finalUsers;

  // Handlers simples pour les fonctions non-bulk
  // handleTabChange est maintenant fourni par le hook useUsers

  const handleExportUsers = async (format: "csv") => {
    if (format === "csv") {
      // Utiliser les utilisateurs de l'onglet actif
      const usersToExport = allUsers || [];

      if (usersToExport.length === 0) {
        showNotification("Aucun utilisateur à exporter", "warning");
        return;
      }

      exportUsers(usersToExport);
      showNotification("Export CSV généré avec succès", "success");
    } else {
      showNotification("Format d'export non supporté", "warning");
    }
  };

  // Error state
  if (error) {
    return (
      <LoadingIndicator
        error={error}
        onRefresh={() => refetch()}
        errorTitle="Erreur lors du chargement des utilisateurs"
        withLayout={true}
      />
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

        {/* Section statistiques avec nouveaux hooks - utilisateurs actifs SANS admins (comme avant) */}
        <UserStatsSection
          allUsers={statsUsers || []}
          activityData={activityData}
          error={errorActive}
        />

        {/* Section du tableau (complètement modularisée) */}
        <UserTableSection
          filters={filters}
          onUpdateFilter={updateFilter as (key: string, value: string) => void}
          activeTab={activeTab}
          allUsers={allUsers || []}
          activeUsers={activeUsers || []}
          deletedUsers={deletedUsers || []}
          adminUsers={adminUsers || []}
          rawActiveUsers={rawActiveUsers || []}
          rawDeletedUsers={rawDeletedUsers || []}
          rawAdminUsers={rawAdminUsers || []}
          onTabChange={handleTabChange}
          selectedUsers={selectedUsers}
          onBulkValidate={bulkActions.handleBulkValidate}
          onBulkSetPending={bulkActions.handleBulkSetPending}
          onBulkSuspend={bulkActions.handleBulkSuspend}
          onBulkUnsuspend={bulkActions.handleBulkUnsuspend}
          onBulkAction={(actionType: string) => {
            if (actionType === "delete") {
              bulkActions.handleBulkDelete();
            } else if (actionType === "role") {
              bulkActions.handleBulkChangeRole();
            }
          }}
          onBulkAddVip={bulkActions.handleBulkAddVip}
          onBulkRemoveVip={bulkActions.handleBulkRemoveVip}
          {...tableHandlers}
          filteredUsers={filteredUsers}
          activityData={activityData || {}}
          currentUserRole={UserRole.ADMIN}
          currentTabRole={currentTabRole}
          isLoading={isLoading}
        />

        {/* Gestionnaire unifié de toutes les modals */}
        <ModalsManager
          // User Details Modal
          showUserDetailsModal={modals.showUserDetailsModal}
          selectedUser={selectedUser}
          editForm={editForm}
          activityData={activityData}
          onCloseUserDetailsModal={() => {
            modals.closeUserDetailsModal();
            resetEditForm();
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
          auditState={{
            show: modals.showAuditModal,
            userId: selectedUser?.id || null,
            tabValue: 0,
          }}
          userEmail={selectedUser?.email}
          onCloseAuditModal={modals.closeAuditModal}
          onUpdateAuditTab={modals.updateAuditTab}
          // Lock Modal (with proper state)
          showLockModal={modals.showLockModal}
          lockAccountState={modals.lockAccount}
          onCloseLockModal={modals.closeLockModal}
          onUpdateLockDuration={modals.updateLockDuration}
          onUpdateLockReason={modals.updateLockReason}
          // Action handlers
          onSaveUser={async () => {
            try {
              if (!selectedUser) return;
              await updateUser.mutateAsync({
                userId: selectedUser.id,
                updates: editForm,
              });
              showNotification("Utilisateur mis à jour", "success");
              modals.closeUserDetailsModal();
            } catch (error) {
              showNotification("Erreur lors de la mise à jour", "error");
            }
          }}
          onOpenLockModal={() => {
            if (selectedUser) {
              modals.openLockModal(selectedUser.id);
            }
          }}
          onUnlockAccount={async () => {
            try {
              if (!selectedUser) return;
              console.log("Unlocking user:", selectedUser.id);
              // 🎯 Utilisation de notre nouveau hook au lieu de securityActions
              await updateUser.mutateAsync({
                userId: selectedUser.id,
                updates: { account_locked: false },
              });
              console.log("Unlock successful with new hooks");
              showNotification("Compte déverrouillé avec succès", "success");
              modals.closeUserDetailsModal(); // Ferme la modal après unlock
            } catch (error) {
              console.error("Unlock error:", error);
              showNotification("Erreur lors du déverrouillage", "error");
            }
          }}
          onResetPassword={async () => {
            try {
              if (!selectedUser) return;
              await securityActions.resetPassword(
                selectedUser.id,
                "Réinitialisation par admin depuis le modal utilisateur"
              );
              showNotification("Email de réinitialisation envoyé", "success");
            } catch (error) {
              showNotification("Erreur lors de l'envoi de l'email", "error");
            }
          }}
          onDeleteUser={() => {
            // Ouvrir la modale de suppression intelligente au lieu de supprimer directement
            if (selectedUser) {
              modals.openSmartDeleteModal(selectedUser);
            }
          }}
          onRestore={() => {
            // Ouvrir la modale de restauration pour un utilisateur supprimé
            if (selectedUser) {
              modals.openRestoreModal(selectedUser);
            }
          }}
          onInputChange={updateEditForm}
          onCreateUser={async () => {
            try {
              const result = await securityActions.createUserWithAuth({
                email: editForm.email || "",
                role: editForm.role || "traveler",
                full_name: editForm.full_name,
                phone: editForm.phone,
                profile_validated: editForm.profile_validated ?? false,
                vip_subscription: editForm.vip_subscription ?? false,
              });

              if (result.success) {
                showNotification("Utilisateur créé avec succès", "success");
                modals.closeCreateUserModal();
                resetEditForm();
                refetch();
              } else {
                showNotification(
                  result.message || "Erreur lors de la création",
                  "error"
                );
              }
            } catch (error) {
              showNotification("Erreur lors de la création", "error");
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
              showNotification("Email de réinitialisation envoyé", "success");
              modals.closePasswordResetModal();
            } catch (error) {
              showNotification("Erreur lors de la réinitialisation", "error");
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
              // 🎯 Utilisation de notre nouveau hook au lieu de securityActions
              await updateUser.mutateAsync({
                userId: modals.lockAccount.userId,
                updates: {
                  account_locked: true,
                  // Note: duration et reason pourraient être ajoutés si nécessaire
                },
              });
              console.log("Lock successful with new hooks");
              showNotification("Compte verrouillé avec succès", "success");
              modals.closeLockModal();
            } catch (error) {
              console.error("Lock error:", error);
              showNotification("Erreur lors du verrouillage", "error");
            }
          }}
          /* Anonymization Modals State */
          smartDeleteModalOpen={modals.smartDeleteModalOpen}
          restoreModalOpen={modals.restoreModalOpen}
          bulkSmartDeleteModalOpen={modals.bulkSmartDeleteModalOpen}
          selectedUserIds={modals.selectedUserIdsForBulkDelete}
          /* Anonymization Handlers */
          onCloseSmartDeleteModal={modals.closeSmartDeleteModal}
          onCloseRestoreModal={modals.closeRestoreModal}
          onCloseBulkSmartDeleteModal={modals.closeBulkSmartDeleteModal}
          onSmartDelete={async (
            userId: string,
            reason: any,
            level: any,
            customReason?: string
          ) => {
            await anonymization.anonymizeUser({ userId, reason, level });
          }}
          onBulkSmartDelete={async (
            reason: any,
            level: any,
            customReason?: string
          ) => {
            // Le composant passe les userIds via selectedUserIds prop
            const userIds = modals.selectedUserIdsForBulkDelete || [];
            await anonymization.anonymizeUsers({ userIds, reason, level });
          }}
          onRestoreUser={async (userId: string) => {
            await restoreUser.mutateAsync(userId);
          }}
          // Loading States
          isSmartDeleting={anonymization.isAnonymizing}
          isRestoring={restoreUser.isPending}
          isBulkDeleting={anonymization.isBulkAnonymizing}
        />
      </Box>
    </AdminLayout>
  );
};
