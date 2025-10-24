import { useState } from 'react';
import {
  AuthState,
  AuthView,
  AuthMessage,
  SignInFormData,
  SignUpFormData,
  ForgotPasswordFormData,
} from '../../../types/auth';
import { useAuth as useAuthProvider } from '@/core/providers/auth.provider';

/**
 * Hook principal pour la gestion de l'état de la page Auth
 */
export const useAuth = () => {
  const authProvider = useAuthProvider();

  const [state, setState] = useState<AuthState>({
    currentView: 'signin',
    isSubmitting: false,
    message: null,
  });

  // Changer de vue (signin, signup, forgot-password)
  const setCurrentView = (view: AuthView) => {
    setState((prev) => ({
      ...prev,
      currentView: view,
      message: null, // Clear message when switching views
    }));
  };

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

      const result = await authProvider.signIn(data.email, data.password);

      if (result.error) {
        setMessage({
          type: 'error',
          text: result.error.message,
        });
        return false;
      } else {
        setMessage({
          type: 'success',
          text: 'Sign in successful! Redirecting...',
        });
        return true;
      }
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

  // Gérer l'inscription
  const handleSignUp = async (data: SignUpFormData) => {
    try {
      setMessage(null);
      setIsSubmitting(true);

      if (data.password !== data.confirmPassword) {
        setMessage({ type: 'error', text: "Passwords don't match" });
        return false;
      }

      const result = await authProvider.signUp(
        data.email,
        data.password,
        data.fullName,
        data.phone
      );

      if (result.error) {
        setMessage({
          type: 'error',
          text: result.error.message,
        });
        return false;
      } else {
        setMessage({
          type: 'success',
          text: 'Admin account created successfully. Please sign in.',
        });
        setCurrentView('signin');
        return true;
      }
    } catch (error: unknown) {
      setMessage({
        type: 'error',
        text: (error as Error).message || 'Sign up failed',
      });
      return false;
    } finally {
      setIsSubmitting(false);
    }
  };

  // Gérer la réinitialisation de mot de passe
  const handleForgotPassword = async (data: ForgotPasswordFormData) => {
    try {
      setMessage(null);
      setIsSubmitting(true);

      const result = await authProvider.resetPassword(data.email);

      if (result.error) {
        setMessage({
          type: 'error',
          text: result.error.message,
        });
        return false;
      } else {
        setMessage({
          type: 'success',
          text: 'Password reset email sent. Check your inbox.',
        });
        return true;
      }
    } catch (error: unknown) {
      setMessage({
        type: 'error',
        text: (error as Error).message || 'Password reset failed',
      });
      return false;
    } finally {
      setIsSubmitting(false);
    }
  };

  // Effacer le message
  const clearMessage = () => {
    setMessage(null);
  };

  return {
    // État
    ...state,

    // Provider data
    session: authProvider.session,
    loading: authProvider.loading,
    error: authProvider.error,
    isAdmin: authProvider.isAdmin,

    // Actions
    setCurrentView,
    setMessage,
    clearMessage,
    handleSignIn,
    handleSignUp,
    handleForgotPassword,
  };
};

export default useAuth;
