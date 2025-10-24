import { useState } from "react";
import { ChangePasswordData, AvatarUploadData } from "@/types/profile";

/**
 * Hook pour la gestion des modales de la page Profile
 */
export const useProfileModals = () => {
  const [showChangePasswordModal, setShowChangePasswordModal] = useState(false);
  const [showAvatarUploadModal, setShowAvatarUploadModal] = useState(false);
  const [showDeleteAccountModal, setShowDeleteAccountModal] = useState(false);
  const [showTwoFactorModal, setShowTwoFactorModal] = useState(false);

  // État des formulaires des modales
  const [changePasswordData, setChangePasswordData] =
    useState<ChangePasswordData>({
      currentPassword: "",
      newPassword: "",
      confirmPassword: "",
    });

  const [avatarUploadData, setAvatarUploadData] = useState<AvatarUploadData>({
    file: null,
    preview: null,
  });

  // Actions Change Password Modal
  const openChangePasswordModal = () => setShowChangePasswordModal(true);
  const closeChangePasswordModal = () => {
    setShowChangePasswordModal(false);
    setChangePasswordData({
      currentPassword: "",
      newPassword: "",
      confirmPassword: "",
    });
  };

  const updateChangePasswordData = (
    field: keyof ChangePasswordData,
    value: string
  ) => {
    setChangePasswordData((prev) => ({ ...prev, [field]: value }));
  };

  // Actions Avatar Upload Modal
  const openAvatarUploadModal = () => setShowAvatarUploadModal(true);
  const closeAvatarUploadModal = () => {
    setShowAvatarUploadModal(false);
    setAvatarUploadData({ file: null, preview: null });
  };

  const updateAvatarData = (file: File | null) => {
    if (file) {
      const preview = URL.createObjectURL(file);
      setAvatarUploadData({ file, preview });
    } else {
      setAvatarUploadData({ file: null, preview: null });
    }
  };

  // Actions Delete Account Modal
  const openDeleteAccountModal = () => setShowDeleteAccountModal(true);
  const closeDeleteAccountModal = () => setShowDeleteAccountModal(false);

  // Actions Two Factor Modal
  const openTwoFactorModal = () => setShowTwoFactorModal(true);
  const closeTwoFactorModal = () => setShowTwoFactorModal(false);

  // Validation pour le changement de mot de passe
  const isChangePasswordValid = (): boolean => {
    return (
      changePasswordData.currentPassword.length > 0 &&
      changePasswordData.newPassword.length >= 8 &&
      changePasswordData.newPassword === changePasswordData.confirmPassword
    );
  };

  return {
    // État des modales
    showChangePasswordModal,
    showAvatarUploadModal,
    showDeleteAccountModal,
    showTwoFactorModal,

    // Données des formulaires
    changePasswordData,
    avatarUploadData,

    // Actions Change Password
    openChangePasswordModal,
    closeChangePasswordModal,
    updateChangePasswordData,

    // Actions Avatar Upload
    openAvatarUploadModal,
    closeAvatarUploadModal,
    updateAvatarData,

    // Actions Delete Account
    openDeleteAccountModal,
    closeDeleteAccountModal,

    // Actions Two Factor
    openTwoFactorModal,
    closeTwoFactorModal,

    // Validation
    isChangePasswordValid,
  };
};

export default useProfileModals;
