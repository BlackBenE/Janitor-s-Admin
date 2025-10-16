import { useCallback } from "react";
import { UserProfile } from "../../../types/userManagement";
import { useUsers } from "./useUsers";
import { useUserModals } from "./useUserModals";

interface UseBulkActionsProps {
  users: UserProfile[];
  selectedUsers: string[];
  clearUserSelection: () => void;
  showNotification: (message: string, severity: "success" | "error") => void;
}

export const useBulkActions = ({
  users,
  selectedUsers,
  clearUserSelection,
  showNotification,
}: UseBulkActionsProps) => {
  const { updateUser, deleteManyUsers } = useUsers({
    filters: {},
    orderBy: "created_at",
  });
  const modals = useUserModals();

  const getSelectedUsersList = useCallback(
    () => users.filter((u) => selectedUsers.includes(u.id)),
    [users, selectedUsers]
  );

  const handleBulkValidate = useCallback(async () => {
    try {
      const selectedUsersList = getSelectedUsersList();

      for (const user of selectedUsersList) {
        await updateUser.mutateAsync({
          id: user.id,
          payload: { profile_validated: true },
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
          id: user.id,
          payload: { profile_validated: false },
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
          id: user.id,
          payload: { account_locked: true },
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
          id: user.id,
          payload: {
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

  const handleBulkAction = useCallback(
    (actionType: "delete" | "role" | "vip") => {
      modals.openBulkActionModal(actionType);
    },
    [modals]
  );

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
      const bulkState = modals.bulkAction;

      if (bulkState.type === "delete") {
        await deleteManyUsers.mutateAsync(selectedUsers);
        showNotification("Utilisateurs supprimés", "success");
      } else if (bulkState.type === "role") {
        for (const userId of selectedUsers) {
          await updateUser.mutateAsync({
            id: userId,
            payload: { role: bulkState.roleChange as any },
          });
        }
        showNotification("Rôles mis à jour", "success");
      } else if (bulkState.type === "vip") {
        for (const userId of selectedUsers) {
          await updateUser.mutateAsync({
            id: userId,
            payload: { vip_subscription: bulkState.vipChange },
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
    deleteManyUsers,
    showNotification,
    clearUserSelection,
  ]);

  return {
    handleBulkValidate,
    handleBulkSetPending,
    handleBulkSuspend,
    handleBulkUnsuspend,
    handleBulkAction,
    handleBulkAddVip,
    handleBulkRemoveVip,
    handleBulkActionConfirm,
  };
};
