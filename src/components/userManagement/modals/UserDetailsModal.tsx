import React, { useState } from "react";
import { Dialog, DialogContent, Box } from "@mui/material";
import { UserDetailsHeader } from "./UserDetailsHeader";
import { UserInfoSections } from "./UserInfoSections";
import { UserEditForm } from "./UserEditForm";
import { UserActions } from "./UserActions";
import {
  UserProfile,
  UserProfileWithAnonymization,
} from "../../../types/userManagement";

interface UserDetailsModalProps {
  open: boolean;
  user: UserProfileWithAnonymization | null;
  editForm: Partial<UserProfile>;
  onClose: () => void;
  onSave: () => void;
  onOpenLockModal: () => void;
  onUnlockAccount?: () => void;
  onResetPassword?: () => void;
  onDelete?: () => void;
  onSmartDelete?: () => void; // Nouvelle action pour suppression intelligente
  onRestore?: () => void; // Nouvelle action pour restauration
  onInputChange: (
    field: keyof UserProfile,
    value: string | boolean | null
  ) => void;
  isLoading?: boolean;
}

export const UserDetailsModal: React.FC<UserDetailsModalProps> = ({
  open,
  user,
  editForm,
  onClose,
  onSave,
  onOpenLockModal,
  onUnlockAccount,
  onResetPassword,
  onDelete,
  onSmartDelete,
  onRestore,
  onInputChange,
  isLoading = false,
}) => {
  const [isEditMode, setIsEditMode] = useState(false);

  if (!user) return null;

  const handleEditSave = async () => {
    await onSave();
    setIsEditMode(false);
  };

  const handleEditCancel = () => {
    setIsEditMode(false);
  };

  const handleClose = () => {
    setIsEditMode(false);
    onClose();
  };

  return (
    <Dialog
      open={open}
      onClose={handleClose}
      maxWidth="lg"
      fullWidth
      sx={{ "& .MuiDialog-paper": { maxHeight: "90vh" } }}
    >
      <UserDetailsHeader user={user} onClose={handleClose} />

      <DialogContent dividers>
        <Box sx={{ display: "flex", flexDirection: "column", gap: 3 }}>
          {isEditMode ? (
            <UserEditForm
              user={user}
              editForm={editForm}
              onInputChange={onInputChange}
              isLoading={isLoading}
            />
          ) : (
            <UserInfoSections user={user} />
          )}
        </Box>
      </DialogContent>

      <UserActions
        user={user}
        onClose={handleClose}
        onEditUser={() => setIsEditMode(true)}
        onSuspend={user.account_locked ? onUnlockAccount : onOpenLockModal}
        onSecurityActions={onResetPassword}
        onDelete={onDelete}
        onSmartDelete={onSmartDelete}
        onRestore={onRestore}
        onSaveEdit={isEditMode ? handleEditSave : undefined}
        onCancelEdit={isEditMode ? handleEditCancel : undefined}
        isEditMode={isEditMode}
        isLoading={isLoading}
      />
    </Dialog>
  );
};
