import { useState } from 'react';
import { ChangePasswordData } from '../../types/profile';
import { ProfileService } from '../../services/profileService';
import { useUINotifications } from '../shared';
import { useAuth } from '@/core/providers/auth.provider';

/**
 * Hook pour gérer le changement de mot de passe
 */
export const useChangePassword = () => {
  const [isLoading, setIsLoading] = useState(false);
  const { user } = useAuth();
  const { showSuccess, showError } = useUINotifications();

  const changePassword = async (data: ChangePasswordData): Promise<boolean> => {
    if (!user?.email) {
      showError('User email not found');
      return false;
    }

    if (data.newPassword !== data.confirmPassword) {
      showError("New passwords don't match");
      return false;
    }

    if (data.newPassword.length < 8) {
      showError('New password must be at least 8 characters long');
      return false;
    }

    setIsLoading(true);
    try {
      // Vérifier le mot de passe actuel
      const verifyResult = await ProfileService.verifyCurrentPassword(
        user.email,
        data.currentPassword
      );

      if (!verifyResult.success) {
        showError(verifyResult.error || 'Current password is incorrect');
        return false;
      }

      // Changer le mot de passe
      const changeResult = await ProfileService.changePassword(
        data.currentPassword,
        data.newPassword
      );

      if (!changeResult.success) {
        showError(changeResult.error || 'Failed to change password');
        return false;
      }

      showSuccess('Password changed successfully!');
      return true;
    } catch (error) {
      console.error('Change password error:', error);
      showError('An unexpected error occurred');
      return false;
    } finally {
      setIsLoading(false);
    }
  };

  return {
    changePassword,
    isLoading,
  };
};

export default useChangePassword;
