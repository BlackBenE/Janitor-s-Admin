import { useState } from "react";
import {
  ProfileFormData,
  ProfileState,
  ProfileStats,
} from "../../types/profile";
import { useAuth } from "../../providers/authProvider";
import { dataProvider } from "../../providers/dataProvider";
import { useUINotifications } from "../shared";

/**
 * Hook principal pour la gestion de l'état de la page Profile
 */
export const useProfile = () => {
  const { user, userProfile, getUserFullName, getUserPhone } = useAuth();
  const { showSuccess, showError } = useUINotifications();

  const [state, setState] = useState<ProfileState>({
    formData: {
      full_name: getUserFullName() || "",
      phone: getUserPhone() || "",
    },
    isLoading: false,
    isEditMode: false,
  });

  // Actions principales
  const updateFormData = (field: keyof ProfileFormData, value: string) => {
    setState((prev) => ({
      ...prev,
      formData: { ...prev.formData, [field]: value },
    }));
  };

  const toggleEditMode = () => {
    setState((prev) => ({ ...prev, isEditMode: !prev.isEditMode }));
  };

  const resetForm = () => {
    setState((prev) => ({
      ...prev,
      formData: {
        full_name: getUserFullName() || "",
        phone: getUserPhone() || "",
      },
    }));
  };

  // Sauvegarde du profil
  const saveProfile = async (): Promise<boolean> => {
    if (!user?.id) {
      showError("User not found");
      return false;
    }

    if (!state.formData.full_name.trim()) {
      showError("Full name is required");
      return false;
    }

    try {
      setState((prev) => ({ ...prev, isLoading: true }));

      const response = await dataProvider.update("profiles", user.id, {
        full_name: state.formData.full_name.trim(),
        phone: state.formData.phone.trim() || null,
        updated_at: new Date().toISOString(),
      });

      if (!response.success) {
        throw new Error(response.error?.message || "Failed to update profile");
      }

      showSuccess("Profile updated successfully!");
      setState((prev) => ({ ...prev, isEditMode: false }));
      return true;
    } catch (err) {
      showError(
        err instanceof Error ? err.message : "Failed to update profile"
      );
      return false;
    } finally {
      setState((prev) => ({ ...prev, isLoading: false }));
    }
  };

  // Générer les initiales de l'avatar
  const getAvatarInitials = (): string => {
    const name = getUserFullName();
    if (!name) return "U";
    const names = name.split(" ");
    if (names.length >= 2) {
      return `${names[0][0]}${names[1][0]}`.toUpperCase();
    }
    return name[0].toUpperCase();
  };

  // Calculer les statistiques du profil
  const getProfileStats = (): ProfileStats => {
    const accountAge = user?.created_at
      ? new Date(user.created_at).toLocaleDateString()
      : "Unknown";

    const lastUpdated = userProfile?.updated_at
      ? new Date(userProfile.updated_at).toLocaleDateString()
      : null;

    return {
      accountAge,
      lastUpdated,
      createdAt: user?.created_at || "",
      updatedAt: userProfile?.updated_at || user?.updated_at || "",
      lastSignInAt: user?.last_sign_in_at || "",
      emailConfirmed: user?.email_confirmed_at !== null,
      profileValidated: userProfile?.profile_validated || false,
    };
  };

  // Validation du formulaire
  const isFormValid = (): boolean => {
    return state.formData.full_name.trim().length > 0;
  };

  const hasChanges = (): boolean => {
    return (
      state.formData.full_name !== (getUserFullName() || "") ||
      state.formData.phone !== (getUserPhone() || "")
    );
  };

  return {
    // État
    ...state,
    user,
    userProfile,

    // Actions
    updateFormData,
    toggleEditMode,
    resetForm,
    saveProfile,

    // Utilitaires
    getAvatarInitials,
    getProfileStats,
    isFormValid,
    hasChanges,
  };
};

export default useProfile;
