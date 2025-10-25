import { useState } from 'react';
import { AuthMessage, SignInFormData } from '../../../types/auth';
import { useAuth as useAuthProvider } from '@/core/providers/auth.provider';
import { useTwoFactorLogin } from './useTwoFactorLogin';

interface SimpleAuthState {
  isSubmitting: boolean;
  message: AuthMessage | null;
}

/**
 * Hook pour la gestion de l'authentification (connexion uniquement)
 */
export const useAuth = () => {
  const authProvider = useAuthProvider();
  const twoFactorLogin = useTwoFactorLogin();

  const [state, setState] = useState<SimpleAuthState>({
    isSubmitting: false,
    message: null,
  });

  // Définir un message de notification
  const setMessage = (message: AuthMessage | null) => {
    setState((prev) => ({ ...prev, message }));
  };

  // Définir l'état de soumission
  const setIsSubmitting = (isSubmitting: boolean) => {
    setState((prev) => ({ ...prev, isSubmitting }));
  };

  // Gérer la connexion
  const handleSignIn = async (data: SignInFormData) => {
    try {
      setMessage(null);
      setIsSubmitting(true);

      // Vérifier si 2FA nécessaire et gérer la connexion
      const success = await twoFactorLogin.checkAndPromptMFA(data.email, data.password);

      // Si checkAndPromptMFA retourne false, la modal 2FA est affichée
      // On attend que l'utilisateur entre le code
      if (!success) {
        // Laisser le modal gérer la suite
        return false;
      }

      // Si success = true, l'utilisateur est déjà connecté
      // (soit pas de 2FA, soit 2FA vérifiée)
      setMessage({
        type: 'success',
        text: 'Sign in successful! Redirecting...',
      });
      return true;
    } catch (error: unknown) {
      setMessage({
        type: 'error',
        text: (error as Error).message || 'Sign in failed',
      });
      return false;
    } finally {
      setIsSubmitting(false);
    }
  };

  // Effacer le message
  const clearMessage = () => {
    setState((prev) => ({ ...prev, message: null }));
  };

  return {
    // État local
    isSubmitting: state.isSubmitting,
    message: state.message,

    // Provider data
    session: authProvider.session,
    loading: authProvider.loading,
    error: authProvider.error,
    isAdmin: authProvider.isAdmin,

    // 2FA
    twoFactorLogin,

    // Actions
    setMessage,
    clearMessage,
    handleSignIn,
  };
};

export default useAuth;
