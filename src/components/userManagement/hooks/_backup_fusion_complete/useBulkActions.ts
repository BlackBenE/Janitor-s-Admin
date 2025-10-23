import { useCallback } from "react";
import { UserProfile } from "../../../types/userManagement";
import { useModals } from "./useUserModals";

interface UseBulkActionsProps {
  users: UserProfile[];
  selectedUsers: string[];
  clearUserSelection: () => void;
  showNotification: (message: string, severity: "success" | "error") => void;
  updateUser: any; // Fonction updateUser passée depuis le parent
  softDeleteUser: any; // Fonction softDeleteUser passée depuis le parent
}

export const useBulkActions = ({
  users,
  selectedUsers,
  clearUserSelection,
  showNotification,
  updateUser,
  softDeleteUser,
}: UseBulkActionsProps) => {
  const modals = useModals();

  const getSelectedUsersList = useCallback(
    () => users.filter((u) => selectedUsers.includes(u.id)),
    [users, selectedUsers]
  );

  const handleBulkValidate = useCallback(async () => {
    try {
      const selectedUsersList = getSelectedUsersList();

      for (const user of selectedUsersList) {
        await updateUser.mutateAsync({
          userId: user.id,
          updates: { profile_validated: true },
        });
      }

      showNotification("Utilisateurs validés en masse", "success");
      clearUserSelection();
    } catch (error) {
      showNotification("Erreur lors de la validation en masse", "error");
    }
  }, [getSelectedUsersList, updateUser, showNotification, clearUserSelection]);

  const handleBulkSetPending = useCallback(async () => {
    try {
      const selectedUsersList = getSelectedUsersList();

      for (const user of selectedUsersList) {
        await updateUser.mutateAsync({
          userId: user.id,
          updates: { profile_validated: false },
        });
      }

      showNotification("Utilisateurs mis en attente en masse", "success");
      clearUserSelection();
    } catch (error) {
      showNotification("Erreur lors de la mise en attente en masse", "error");
    }
  }, [getSelectedUsersList, updateUser, showNotification, clearUserSelection]);

  const handleBulkSuspend = useCallback(async () => {
    try {
      const selectedUsersList = getSelectedUsersList();

      for (const user of selectedUsersList) {
        await updateUser.mutateAsync({
          userId: user.id,
          updates: { account_locked: true },
        });
      }

      showNotification("Utilisateurs suspendus en masse", "success");
      clearUserSelection();
    } catch (error) {
      showNotification("Erreur lors de la suspension en masse", "error");
    }
  }, [getSelectedUsersList, updateUser, showNotification, clearUserSelection]);

  const handleBulkUnsuspend = useCallback(async () => {
    try {
      const selectedUsersList = getSelectedUsersList();

      for (const user of selectedUsersList) {
        await updateUser.mutateAsync({
          userId: user.id,
          updates: {
            account_locked: false,
            locked_until: null,
            lock_reason: null,
          },
        });
      }

      showNotification("Utilisateurs débloqués en masse", "success");
      clearUserSelection();
    } catch (error) {
      showNotification("Erreur lors du déblocage en masse", "error");
    }
  }, [getSelectedUsersList, updateUser, showNotification, clearUserSelection]);

  const handleBulkDelete = useCallback(() => {
    // Cette fonction sera remplacée par l'appel direct à openBulkSmartDeleteModal
    modals.openBulkActionModal("delete");
  }, [modals]);

  const handleBulkAddVip = useCallback(() => {
    modals.updateBulkVipChange(true);
    modals.openBulkActionModal("vip");
  }, [modals]);

  const handleBulkRemoveVip = useCallback(() => {
    modals.updateBulkVipChange(false);
    modals.openBulkActionModal("vip");
  }, [modals]);

  const handleBulkActionConfirm = useCallback(async () => {
    try {
      const bulkState = modals.bulkActionData;

      if (bulkState.type === "delete") {
        // Soft delete en lot avec Promise.all pour la performance
        await Promise.all(
          selectedUsers.map((userId) =>
            softDeleteUser.mutateAsync({
              userId,
              reason: "Suppression en lot par l'administrateur",
            })
          )
        );
        showNotification("Utilisateurs supprimés (soft delete)", "success");
      } else if (bulkState.type === "role") {
        for (const userId of selectedUsers) {
          await updateUser.mutateAsync({
            userId: userId,
            updates: { role: bulkState.roleChange as any },
          });
        }
        showNotification("Rôles mis à jour", "success");
      } else if (bulkState.type === "vip") {
        for (const userId of selectedUsers) {
          await updateUser.mutateAsync({
            userId: userId,
            updates: { vip_subscription: bulkState.vipChange },
          });
        }
        showNotification("Statuts VIP mis à jour", "success");
      }

      clearUserSelection();
      modals.closeBulkActionModal();
    } catch (error) {
      showNotification("Erreur lors de l'action en masse", "error");
    }
  }, [
    modals,
    selectedUsers,
    updateUser,
    softDeleteUser,
    showNotification,
    clearUserSelection,
  ]);

  return {
    handleBulkValidate,
    handleBulkSetPending,
    handleBulkSuspend,
    handleBulkUnsuspend,
    handleBulkAddVip,
    handleBulkRemoveVip,
    handleBulkActionConfirm,
  };
};
