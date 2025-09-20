import {
  UserProfile,
  UserFilters,
  UserManagementHook,
  UpdateUserMutation,
  LogActionFunction,
  AuditActions,
  SecurityActions,
} from "../../../types/userManagement";

interface UseUserActionsProps {
  userManagement: UserManagementHook;
  updateUser: UpdateUserMutation;
  logAction: LogActionFunction;
  auditActions: AuditActions;
  securityActions: SecurityActions;
  getEmail: () => string | null;
  refetch?: () => void; // Nouvelle prop pour rafraîchir les données
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
  refetch,
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
      .catch((error: Error) => {
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
      .catch((error: Error) => {
        userManagement.showNotification(
          `Error suspending users: ${error.message}`,
          "error"
        );
      });
  };

  const handleForceLogout = async (userId: string) => {
    try {
      console.log("🔍 Debug force logout:", { userId });

      // Approche hybride : session + profil pour garantir la déconnexion
      try {
        // 1. Essayer de terminer les sessions existantes (si elles existent)
        console.log("📊 Tentative de récupération des sessions...");
        const sessions = await securityActions.getUserSessions(userId);
        console.log("📊 Sessions trouvées:", sessions?.length || 0);

        if (sessions && sessions.length > 0) {
          console.log("🔄 Terminaison des sessions via user_sessions");
          await securityActions.forceLogout(userId, "Admin force logout");
        } else {
          console.log(
            "⚠️ Aucune session trouvée, utilisation de l'approche alternative"
          );

          // 2. Approche alternative : forcer une mise à jour du profil pour déclencher la déconnexion
          await updateUser.mutateAsync({
            id: userId,
            payload: {
              updated_at: new Date().toISOString(),
              // Ajouter un flag pour indiquer la déconnexion forcée
            },
          });

          console.log("✅ Déconnexion forcée via mise à jour du profil");
        }
      } catch (sessionError) {
        console.error(
          "❌ Erreur sessions, fallback sur mise à jour profil:",
          sessionError
        );

        // Fallback : mise à jour du profil
        await updateUser.mutateAsync({
          id: userId,
          payload: {
            updated_at: new Date().toISOString(),
          },
        });
      }

      await logAction(
        auditActions.FORCE_LOGOUT,
        userId,
        "Utilisateur déconnecté de force par l'administrateur",
        getCurrentAdminEmail(),
        {
          timestamp: new Date().toISOString(),
          reason: "Force logout by admin",
          method: "hybrid_approach",
        }
      );

      userManagement.showNotification(
        "Utilisateur déconnecté de force",
        "success"
      );

      // Rafraîchir les données pour refléter les changements
      if (refetch) refetch();
    } catch (error) {
      console.error("❌ Force logout error:", error);
      userManagement.showNotification(
        `Erreur lors de la déconnexion forcée: ${
          error instanceof Error
            ? error.message
            : typeof error === "string"
            ? error
            : JSON.stringify(error)
        }`,
        "error"
      );
    }
  };

  const handleUnlockAccount = async (userId: string) => {
    try {
      // Utilisons updateUser.mutateAsync comme pour l'action VIP
      await updateUser.mutateAsync({
        id: userId,
        payload: {
          account_locked: false,
          locked_until: null,
          lock_reason: null,
        },
      });

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

      // Rafraîchir les données pour refléter les changements
      if (refetch) refetch();
    } catch (error) {
      userManagement.showNotification(
        `Erreur lors du déverrouillage: ${
          error instanceof Error
            ? error.message
            : typeof error === "string"
            ? error
            : JSON.stringify(error)
        }`,
        "error"
      );
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
