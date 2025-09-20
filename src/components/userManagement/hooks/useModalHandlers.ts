import { useAuth } from "../../../providers/authProvider";
import { UserProfile } from "../../../types/userManagement";

export const useModalHandlers = ({
  userManagement,
  updateUser,
  logAction,
  auditActions,
  securityActions,
  modals,
  refetch,
}: any) => {
  const { getEmail } = useAuth();

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
        onError: (error: any) => {
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
        onError: (error: any) => {
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

  const handleLockAccount = async () => {
    if (!modals.lockAccount.userId || !modals.lockAccount.reason.trim()) {
      userManagement.showNotification(
        "Raison requise pour verrouiller le compte",
        "warning"
      );
      return;
    }

    try {
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
          await userManagement.deleteManyUsers.mutateAsync(
            userManagement.selectedUsers
          );
          break;
        case "role":
          if (!modals.bulkAction.roleChange) {
            userManagement.showNotification("Sélectionnez un rôle", "warning");
            return;
          }
          await Promise.all(
            userManagement.selectedUsers.map((userId: string) =>
              updateUser.mutateAsync({
                id: userId,
                payload: { role: modals.bulkAction.roleChange },
              })
            )
          );
          break;
        case "vip":
          await Promise.all(
            userManagement.selectedUsers.map((userId: string) =>
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

  return {
    handleSaveUser,
    handleSuspendUser,
    handleCreateUser,
    handleConfirmPasswordReset,
    handleLockAccount,
    handleBulkAction,
  };
};
