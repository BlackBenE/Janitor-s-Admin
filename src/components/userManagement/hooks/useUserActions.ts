import { UserProfile, UserFilters } from "../../../types/userManagement";

interface UseUserActionsProps {
  userManagement: any;
  updateUser: any;
  logAction: any;
  auditActions: any;
  securityActions: any;
  getEmail: () => string | null;
}

/**
 * Hook pour la logique métier des actions utilisateur
 */
export const useUserActions = ({
  userManagement,
  updateUser,
  logAction,
  auditActions,
  securityActions,
  getEmail,
}: UseUserActionsProps) => {
  const getCurrentAdminEmail = () => getEmail() || "system";

  const handleBulkValidate = () => {
    if (userManagement.selectedUsers.length === 0) {
      userManagement.showNotification("No users selected", "warning");
      return;
    }

    Promise.all(
      userManagement.selectedUsers.map((userId: string) =>
        updateUser.mutateAsync({
          id: userId,
          payload: { profile_validated: true },
        })
      )
    )
      .then(async () => {
        await Promise.all(
          userManagement.selectedUsers.map((userId: string) =>
            logAction(
              auditActions.BULK_ACTION,
              userId,
              `Validation en masse - ${userManagement.selectedUsers.length} utilisateurs affectés`,
              getCurrentAdminEmail(),
              {
                action: "bulk_validate",
                totalUsers: userManagement.selectedUsers.length,
              }
            )
          )
        );

        userManagement.showNotification(
          `${userManagement.selectedUsers.length} users validated successfully`,
          "success"
        );
        userManagement.clearUserSelection();
      })
      .catch((error: any) => {
        userManagement.showNotification(
          `Error validating users: ${error.message}`,
          "error"
        );
      });
  };

  const handleBulkSuspend = () => {
    if (userManagement.selectedUsers.length === 0) {
      userManagement.showNotification("No users selected", "warning");
      return;
    }

    Promise.all(
      userManagement.selectedUsers.map((userId: string) =>
        updateUser.mutateAsync({
          id: userId,
          payload: { profile_validated: false },
        })
      )
    )
      .then(async () => {
        await Promise.all(
          userManagement.selectedUsers.map((userId: string) =>
            logAction(
              auditActions.BULK_ACTION,
              userId,
              `Suspension en masse - ${userManagement.selectedUsers.length} utilisateurs affectés`,
              getCurrentAdminEmail(),
              {
                action: "bulk_suspend",
                totalUsers: userManagement.selectedUsers.length,
              }
            )
          )
        );

        userManagement.showNotification(
          `${userManagement.selectedUsers.length} users suspended successfully`,
          "success"
        );
        userManagement.clearUserSelection();
      })
      .catch((error: any) => {
        userManagement.showNotification(
          `Error suspending users: ${error.message}`,
          "error"
        );
      });
  };

  const handleForceLogout = async (userId: string) => {
    try {
      await securityActions.forceLogout(userId, "Force logout by admin");

      await logAction(
        auditActions.FORCE_LOGOUT,
        userId,
        "Déconnexion forcée par l'administrateur",
        getCurrentAdminEmail(),
        { reason: "Force logout by admin" }
      );

      userManagement.showNotification(
        "Utilisateur déconnecté de force",
        "success"
      );
    } catch {
      userManagement.showNotification(
        "Erreur lors de la déconnexion forcée",
        "error"
      );
    }
  };

  const handleUnlockAccount = async (userId: string) => {
    try {
      await securityActions.unlockAccount(
        userId,
        "Compte déverrouillé par l'administrateur"
      );

      await logAction(
        auditActions.USER_REACTIVATED,
        userId,
        "Compte déverrouillé par l'administrateur",
        getCurrentAdminEmail(),
        { reason: "Admin unlock action" }
      );

      userManagement.showNotification(
        "Compte déverrouillé avec succès",
        "success"
      );
    } catch {
      userManagement.showNotification("Erreur lors du déverrouillage", "error");
    }
  };

  const handleExportUsers = async (
    format: "csv",
    filteredUsers: UserProfile[],
    filters: UserFilters
  ) => {
    try {
      const formatDate = (dateString: string | null): string => {
        if (!dateString) return "";
        return new Date(dateString).toLocaleDateString();
      };

      const csvContent = [
        [
          "Nom",
          "Email",
          "Téléphone",
          "Rôle",
          "Statut",
          "VIP",
          "Date d'inscription",
        ],
        ...filteredUsers.map((user: UserProfile) => [
          user.full_name || "",
          user.email,
          user.phone || "",
          user.role,
          user.profile_validated ? "Validé" : "En attente",
          user.vip_subscription ? "Oui" : "Non",
          formatDate(user.created_at),
        ]),
      ]
        .map((row) => row.join(","))
        .join("\n");

      const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
      const link = document.createElement("a");
      if (link.download !== undefined) {
        const url = URL.createObjectURL(blob);
        link.setAttribute("href", url);
        link.setAttribute(
          "download",
          `users_export_${new Date().toISOString().split("T")[0]}.${format}`
        );
        link.style.visibility = "hidden";
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
      }

      await logAction(
        auditActions.EXPORT_DATA,
        "system",
        `Export de données utilisateurs en format ${format.toUpperCase()} - ${
          filteredUsers.length
        } utilisateurs`,
        getCurrentAdminEmail(),
        {
          format,
          recordCount: filteredUsers.length,
          exportType: "user_data",
          filters: filters,
        }
      );

      userManagement.showNotification(
        `Export ${format.toUpperCase()} terminé avec succès`,
        "success"
      );
    } catch {
      userManagement.showNotification("Erreur lors de l'export", "error");
    }
  };

  return {
    handleBulkValidate,
    handleBulkSuspend,
    handleForceLogout,
    handleUnlockAccount,
    handleExportUsers,
  };
};
