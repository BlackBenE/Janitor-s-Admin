import React, { useState } from "react";
import { Dialog, DialogContent, Box, Divider, Collapse } from "@mui/material";
import { UserDetailsHeader } from "./UserDetailsHeader";
import { UserInfoSections } from "./UserInfoSections";
import { UserEditForm } from "./UserEditForm";
import { UserActions } from "./UserActions";
import { BookingsSection } from "./sections/BookingsSection";
import { ServicesSection } from "./sections/ServicesSection";
import {
  UserProfile,
  UserProfileWithAnonymization,
  UserActivityData,
} from "../../../types/userManagement";

interface UserDetailsModalProps {
  open: boolean;
  user: UserProfileWithAnonymization | null;
  editForm: Partial<UserProfile>;
  activityData?: Record<string, UserActivityData>;
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
  activityData,
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
        <Box
          sx={{
            display: "flex",
            flexDirection: { xs: "column", md: "row" },
            gap: 3,
            minHeight: "500px",
          }}
        >
          {/* Contenu principal - Centre */}
          <Box sx={{ flex: 1, order: { xs: 2, md: 1 } }}>
            {isEditMode ? (
              <UserEditForm
                user={user}
                editForm={editForm}
                onInputChange={onInputChange}
                isLoading={isLoading}
              />
            ) : (
              <>
                {/* Basic Information */}
                <UserInfoSections
                  user={user}
                  layoutMode="main"
                  activityData={activityData}
                />

                {/* Section spécifique au rôle - intégrée dans le contenu principal */}
                {user &&
                  (user.role === "traveler" ||
                    user.role === "property_owner") && (
                    <BookingsSection
                      userId={user.id}
                      userName={user.full_name || user.email || "Utilisateur"}
                      userRole={user.role}
                      isVisible={true}
                    />
                  )}

                {/* Section Services pour prestataires et clients de services */}
                {user &&
                  (user.role === "service_provider" ||
                    user.role === "provider" ||
                    user.role === "traveler") && (
                    <ServicesSection
                      userId={user.id}
                      userName={user.full_name || user.email || "Utilisateur"}
                      userRole={user.role}
                      isVisible={true}
                    />
                  )}
              </>
            )}
          </Box>

          {/* Account Information - Droite */}
          <Box
            sx={{
              width: { xs: "100%", md: "320px" },
              order: { xs: 1, md: 2 },
              flexShrink: 0,
            }}
          >
            {!isEditMode && (
              <UserInfoSections
                user={user}
                layoutMode="sidebar"
                activityData={activityData}
              />
            )}
          </Box>
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
