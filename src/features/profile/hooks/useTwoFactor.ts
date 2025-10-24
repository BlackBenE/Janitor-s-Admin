/**
 * Hook pour gérer la 2FA dans le profil
 */

import { useState, useEffect } from 'react';
import { TwoFactorService } from '@/core/services/two-factor.service';
import type { TwoFactorEnrollment, TwoFactorFactor } from '@/core/services/two-factor.service';
import { useUINotifications } from '@/shared/hooks';

interface UseTwoFactorReturn {
  // État
  isEnabled: boolean;
  isLoading: boolean;
  factors: TwoFactorFactor[];

  // Enrollment
  enrollment: TwoFactorEnrollment | null;
  isEnrolling: boolean;

  // Actions
  checkStatus: () => Promise<void>;
  startEnrollment: () => Promise<void>;
  verifyAndEnable: (code: string) => Promise<boolean>;
  disable: (factorId: string) => Promise<void>;
}

export const useTwoFactor = (): UseTwoFactorReturn => {
  const [isEnabled, setIsEnabled] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [factors, setFactors] = useState<TwoFactorFactor[]>([]);
  const [enrollment, setEnrollment] = useState<TwoFactorEnrollment | null>(null);
  const [isEnrolling, setIsEnrolling] = useState(false);

  const { showNotification } = useUINotifications();

  /**
   * Vérifie le statut de la 2FA
   */
  const checkStatus = async () => {
    try {
      setIsLoading(true);
      const status = await TwoFactorService.checkTwoFactorStatus();
      setIsEnabled(status.enabled);
      setFactors(status.factors);
    } catch (error) {
      console.error('Erreur lors de la vérification du statut 2FA:', error);
      showNotification('Erreur lors de la vérification du statut de la 2FA', 'error');
    } finally {
      setIsLoading(false);
    }
  };

  /**
   * Démarre le processus d'activation de la 2FA
   */
  const startEnrollment = async (): Promise<void> => {
    try {
      setIsEnrolling(true);
      const enrollmentData = await TwoFactorService.enrollTwoFactor(
        "Janitor's Admin - Authenticator"
      );
      setEnrollment(enrollmentData);
    } catch (error) {
      console.error("Erreur lors du démarrage de l'inscription 2FA:", error);
      showNotification("Erreur lors de l'activation de la 2FA", 'error');
      throw error;
    } finally {
      setIsEnrolling(false);
    }
  };

  /**
   * Vérifie le code et active la 2FA
   */
  const verifyAndEnable = async (code: string): Promise<boolean> => {
    if (!enrollment) {
      showNotification('Aucune inscription en cours', 'error');
      return false;
    }

    try {
      const success = await TwoFactorService.verifyTwoFactorCode(enrollment.id, code);

      if (success) {
        showNotification('Authentification à deux facteurs activée avec succès !', 'success');
        await checkStatus(); // Rafraîchir le statut
        setEnrollment(null); // Réinitialiser l'enrollment
        return true;
      } else {
        showNotification('Code de vérification invalide', 'error');
        return false;
      }
    } catch (error) {
      console.error('Erreur lors de la vérification du code:', error);
      showNotification('Erreur lors de la vérification du code', 'error');
      return false;
    }
  };

  /**
   * Désactive la 2FA
   */
  const disable = async (factorId: string) => {
    try {
      await TwoFactorService.disableTwoFactor(factorId);
      showNotification('Authentification à deux facteurs désactivée', 'success');
      await checkStatus(); // Rafraîchir le statut
    } catch (error) {
      console.error('Erreur lors de la désactivation de la 2FA:', error);
      showNotification('Erreur lors de la désactivation de la 2FA', 'error');
      throw error;
    }
  };

  // Vérifier le statut au chargement
  useEffect(() => {
    checkStatus();
  }, []);

  return {
    isEnabled,
    isLoading,
    factors,
    enrollment,
    isEnrolling,
    checkStatus,
    startEnrollment,
    verifyAndEnable,
    disable,
  };
};
