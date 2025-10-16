import React, { useState } from "react";
import { Dialog, DialogContent, Box } from "@mui/material";
import { UserDetailsHeader } from "./UserDetailsHeader";
import { UserBasicInfo } from "./UserBasicInfo";
import { UserAccountInfo } from "./UserAccountInfo";
import { UserEditForm } from "./UserEditForm";
import { UserActions } from "./UserActions";
import { UserProfile } from "../../../types/userManagement";

interface UserDetailsModalProps {
  open: boolean;
  user: UserProfile | null;
  editForm: Partial<UserProfile>;
  onClose: () => void;
  onSave: () => void;
  onOpenLockModal: () => void;
  onUnlockAccount?: () => void;
  onResetPassword?: () => void;
  onDelete?: () => void;
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
            <Box
              sx={{
                display: "flex",
                gap: 3,
                flexDirection: { xs: "column", md: "row" },
              }}
            >
              {/* Left column - Main details */}
              <Box
                sx={{
                  flex: 2,
                  display: "flex",
                  flexDirection: "column",
                  gap: 2,
                }}
              >
                <UserBasicInfo user={user} />
              </Box>

              {/* Right column - Account info and additional details */}
              <Box
                sx={{
                  flex: 1,
                  display: "flex",
                  flexDirection: "column",
                  gap: 2,
                }}
              >
                <UserAccountInfo user={user} />
              </Box>
            </Box>
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
        onSaveEdit={isEditMode ? handleEditSave : undefined}
        onCancelEdit={isEditMode ? handleEditCancel : undefined}
        isEditMode={isEditMode}
        isLoading={isLoading}
      />
    </Dialog>
  );
};
