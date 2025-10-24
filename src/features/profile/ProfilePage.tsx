import React from "react";
import { Box, Typography, Container, Alert, Snackbar } from "@mui/material";
import { useNavigate } from "react-router-dom";
import { LABELS } from "@/core/config/labels";

// Composants spécialisés
import { ProfileHeader } from "./components/ProfileHeader";
import { ProfileAccountInfo } from "./components/ProfileAccountInfo";

// Modales
import {
  ChangePasswordModal,
  AvatarUploadModal,
  DeleteAccountModal,
  TwoFactorModal,
} from "./modals";

// Hooks
import { useProfile } from "./hooks/useProfile";
import { useProfileModals } from "./hooks/useProfileModals";
import { useUINotifications } from "@/shared/hooks";
import { ProfileLayout } from "./components/ProfileLayout";
import { ProfileCard } from "./components/ProfileCard";
import { ProfileDetailsCard } from "./components/ProfileDetailsCard";
import { SecuritySettingsCard } from "./components/SecuritySettingsCard";

export const ProfilePage: React.FC = () => {
  const navigate = useNavigate();

  // Hooks principaux
  const profile = useProfile();
  const modals = useProfileModals();
  const { notification, hideNotification } = useUINotifications();

  // Navigation
  const handleReturnToDashboard = () => {
    navigate("/dashboard");
  };

  // Vérification de l'état de chargement
  if (!profile.user) {
    return (
      <Container maxWidth="lg">
        <Box
          display="flex"
          justifyContent="center"
          alignItems="center"
          minHeight="400px"
        >
          <Typography>{LABELS.common.messages.loading}</Typography>
        </Box>
      </Container>
    );
  }

  return (
    <Container maxWidth="lg">
      <Box sx={{ py: 4 }}>
        {/* Header avec navigation */}
        <ProfileHeader
          onReturnToDashboard={handleReturnToDashboard}
          title="Account"
          subtitle="Manage your account settings and preferences"
        />

        {/* Layout principal à deux colonnes */}
        <ProfileLayout
          leftColumn={
            <>
              {/* Carte profil avec avatar */}
              <ProfileCard
                avatarInitials={profile.getAvatarInitials()}
                avatarUrl={profile.userProfile?.avatar_url}
                fullName={profile.formData.full_name}
                email={profile.user.email || ""}
                isAdmin={profile.user.role === "admin"}
                isVerified={profile.userProfile?.profile_validated || false}
                onUploadAvatar={modals.openAvatarUploadModal}
              />

              {/* Informations du compte */}
              <ProfileAccountInfo
                userId={profile.user.id}
                stats={profile.getProfileStats()}
                role={profile.user.role || "user"}
              />
            </>
          }
          rightColumn={
            <>
              {/* Détails du profil (formulaire) */}
              <ProfileDetailsCard
                formData={profile.formData}
                isLoading={profile.isLoading}
                isEditMode={profile.isEditMode}
                onInputChange={profile.updateFormData}
                onSave={profile.saveProfile}
                onToggleEdit={profile.toggleEditMode}
                onCancel={profile.resetForm}
                hasChanges={profile.hasChanges()}
                isFormValid={profile.isFormValid()}
                userEmail={profile.user.email || ""}
                userRole={profile.user.role || "user"}
              />

              {/* Paramètres de sécurité */}
              <SecuritySettingsCard
                onChangePassword={modals.openChangePasswordModal}
                onToggleTwoFactor={modals.openTwoFactorModal}
                onDeleteAccount={modals.openDeleteAccountModal}
                twoFactorEnabled={false} // TODO: Récupérer depuis les settings
              />
            </>
          }
        />

        {/* Modales */}
        <ChangePasswordModal
          open={modals.showChangePasswordModal}
          data={modals.changePasswordData}
          onClose={modals.closeChangePasswordModal}
          onChange={modals.updateChangePasswordData}
          isValid={modals.isChangePasswordValid()}
        />

        <AvatarUploadModal
          open={modals.showAvatarUploadModal}
          data={modals.avatarUploadData}
          onClose={modals.closeAvatarUploadModal}
          onFileSelect={modals.updateAvatarData}
          onUploadSuccess={() => {
            // Force un re-render en rechargeant les données utilisateur
            window.location.reload();
          }}
        />

        <DeleteAccountModal
          open={modals.showDeleteAccountModal}
          onClose={modals.closeDeleteAccountModal}
          userEmail={profile.user.email || ""}
        />

        <TwoFactorModal
          open={modals.showTwoFactorModal}
          onClose={modals.closeTwoFactorModal}
        />

        {/* Notifications */}
        <Snackbar
          open={notification.open}
          autoHideDuration={6000}
          onClose={hideNotification}
          anchorOrigin={{ vertical: "bottom", horizontal: "right" }}
        >
          <Alert
            onClose={hideNotification}
            severity={notification.type}
            sx={{ width: "100%" }}
          >
            {notification.message}
          </Alert>
        </Snackbar>
      </Box>
    </Container>
  );
};

export default ProfilePage;
