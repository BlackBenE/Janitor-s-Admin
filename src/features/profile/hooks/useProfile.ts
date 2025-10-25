import { useState, useEffect } from 'react';
import { ProfileFormData, ProfileState, ProfileStats } from '@/types/profile';
import { useAuth } from '@/core/providers/auth.provider';
import { ProfileService } from '@/core/services/profile.service';
import { useUINotifications } from '@/shared/hooks';
import { supabase } from '@/core/config/supabase';

// Import sous-hooks spécialisés
import { useChangePassword } from './useChangePassword';
import { useTwoFactor } from './useTwoFactor';
import { useProfileModals } from './useProfileModals';

/**
 * 🎯 Hook Principal - useProfile (ORCHESTRATEUR)
 *
 * Combine :
 * - Profile state & logic (inline)
 * - useChangePassword (password management)
 * - useTwoFactor (2FA management)
 * - useProfileModals (modal states)
 */
export const useProfile = () => {
  const { user, userProfile, getUserFullName, getUserPhone, refetchUserProfile } = useAuth();
  const { showSuccess, showError } = useUINotifications();

  const [state, setState] = useState<ProfileState>({
    formData: {
      full_name: getUserFullName() || '',
      phone: getUserPhone() || '',
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
        full_name: getUserFullName() || '',
        phone: getUserPhone() || '',
      },
      isEditMode: false,
    }));
  };

  // Sauvegarde du profil
  const saveProfile = async (): Promise<boolean> => {
    if (!user?.id) {
      showError('User not found');
      return false;
    }

    if (!state.formData.full_name.trim()) {
      showError('Full name is required');
      return false;
    }

    try {
      setState((prev) => ({ ...prev, isLoading: true }));

      const result = await ProfileService.updateProfile(user.id, {
        full_name: state.formData.full_name.trim(),
        phone: state.formData.phone.trim() || null,
      });

      if (!result.success) {
        showError(result.error || 'Failed to update profile');
        return false;
      }

      showSuccess('Profile updated successfully!');
      setState((prev) => ({ ...prev, isEditMode: false }));

      // Refetch direct depuis Supabase pour être sûr d'avoir les données fraîches
      const { data: freshProfile, error: fetchError } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', user.id)
        .single();

      if (!fetchError && freshProfile) {
        // Mettre à jour le formData avec les données fraîches
        setState((prev) => ({
          ...prev,
          formData: {
            full_name: freshProfile.full_name || '',
            phone: freshProfile.phone || '',
          },
        }));

        // Appeler aussi le refetch du provider pour synchroniser l'état global
        await refetchUserProfile();
      } else {
        console.error('❌ Error fetching fresh profile:', fetchError);
        // Fallback sur le refetch du provider
        await refetchUserProfile();

        // Forcer une mise à jour du formData
        setState((prev) => ({
          ...prev,
          formData: {
            full_name: getUserFullName() || '',
            phone: getUserPhone() || '',
          },
        }));
      }

      return true;
    } catch (err) {
      console.error('❌ saveProfile error:', err);
      showError(err instanceof Error ? err.message : 'Failed to update profile');
      return false;
    } finally {
      setState((prev) => ({ ...prev, isLoading: false }));
    }
  };

  // Générer les initiales de l'avatar
  const getAvatarInitials = (): string => {
    const name = getUserFullName();
    if (!name) return 'U';
    const names = name.split(' ');
    if (names.length >= 2) {
      return `${names[0][0]}${names[1][0]}`.toUpperCase();
    }
    return name[0].toUpperCase();
  };

  // Calculer les statistiques du profil
  const getProfileStats = (): ProfileStats => {
    const accountAge = user?.created_at
      ? new Date(user.created_at).toLocaleDateString()
      : 'Unknown';

    const lastUpdated = userProfile?.updated_at
      ? new Date(userProfile.updated_at).toLocaleDateString()
      : null;

    return {
      accountAge,
      lastUpdated,
      createdAt: user?.created_at || '',
      updatedAt: userProfile?.updated_at || user?.updated_at || '',
      lastSignInAt: user?.last_sign_in_at || '',
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
      state.formData.full_name !== (getUserFullName() || '') ||
      state.formData.phone !== (getUserPhone() || '')
    );
  };

  // Importer les sous-hooks spécialisés
  const changePassword = useChangePassword();
  const twoFactor = useTwoFactor();
  const modals = useProfileModals();

  return {
    // État principal
    ...state,
    user,
    userProfile,

    // Actions principales
    updateFormData,
    toggleEditMode,
    resetForm,
    saveProfile,

    // Utilitaires
    getAvatarInitials,
    getProfileStats,
    isFormValid,
    hasChanges,

    // Sous-features
    changePassword,
    twoFactor,
    modals,
  };
};

export default useProfile;
