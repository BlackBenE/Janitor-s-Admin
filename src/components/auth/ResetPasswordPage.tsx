import React, { useEffect } from "react";
import { supabase } from "../../lib/supabaseClient";
import { useResetPassword } from "./hooks/useResetPassword";
import {
  ResetErrorPage,
  ResetLoadingPage,
  ResetSuccessPage,
  ResetPasswordForm,
} from "./components";

/**
 * Page de réinitialisation de mot de passe - Version modulaire
 */
export const ResetPasswordPage: React.FC = () => {
  const {
    password,
    confirmPassword,
    loading,
    error,
    success,
    userEmail,
    userRole,
    isWaitingForAuth,
    getTokensFromUrl,
    handleAuthEvents,
    handlePasswordReset,
    setPassword,
    setConfirmPassword,
    updateState,
    navigate,
  } = useResetPassword();

  useEffect(() => {
    const { accessToken, refreshToken, type, urlHash } = getTokensFromUrl();

    // Vérifier s'il y a des erreurs dans l'URL
    const errorMatch = urlHash?.match(/error=([^&]+)/);
    if (errorMatch) {
      const errorCodeMatch = urlHash.match(/error_code=([^&]+)/);
      const errorDescriptionMatch = urlHash.match(/error_description=([^&]+)/);

      const error = decodeURIComponent(errorMatch[1]);
      const errorCode = errorCodeMatch
        ? decodeURIComponent(errorCodeMatch[1])
        : "";
      const errorDescription = errorDescriptionMatch
        ? decodeURIComponent(errorDescriptionMatch[1].replace(/\+/g, " "))
        : "";

      if (errorCode === "otp_expired") {
        updateState({
          error: "Le lien de réinitialisation a expiré. Veuillez demander un nouveau lien.",
          isWaitingForAuth: false,
        });
      } else {
        updateState({
          error: `Erreur : ${errorDescription || error}`,
          isWaitingForAuth: false,
        });
      }
      return;
    }

    // Vérifier que nous avons les bons tokens et que c'est un reset
    if (!accessToken || !refreshToken || type !== "recovery") {
      updateState({ isWaitingForAuth: true });

      // Timeout pour afficher l'erreur si aucune session ne se crée après 10 secondes
      setTimeout(() => {
        if (!userEmail) {
          updateState({
            error: "Lien de réinitialisation invalide ou expiré.",
            isWaitingForAuth: false,
          });
        }
      }, 10000);

      return;
    }

    // Définir la session avec les tokens reçus
    const setSession = async () => {
      try {
        const { data, error } = await supabase.auth.setSession({
          access_token: accessToken,
          refresh_token: refreshToken,
        });

        if (error) {
          updateState({
            error: "Erreur lors de la validation du lien de réinitialisation.",
          });
        } else if (data.user?.email) {
          updateState({
            userEmail: data.user.email,
            userRole: data.user.user_metadata?.role || "traveler",
          });
        }
      } catch (err) {
        updateState({
          error: "Erreur lors de la validation du lien de réinitialisation.",
        });
      }
    };

    setSession();

    // Configurer les événements auth
    const authListener = handleAuthEvents();

    return () => {
      authListener?.subscription.unsubscribe();
    };
  }, []);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    handlePasswordReset(e);
  };

  const handleBackToLogin = () => {
    navigate("/auth");
  };

  // États d'affichage
  if (isWaitingForAuth && !userEmail) {
    return <ResetLoadingPage />;
  }

  if (error && !isWaitingForAuth && !userEmail) {
    return <ResetErrorPage error={error} />;
  }

  if (success) {
    return (
      <ResetSuccessPage 
        userEmail={userEmail}
        userRole={userRole}
      />
    );
  }

  return (
    <ResetPasswordForm
      userEmail={userEmail}
      password={password}
      confirmPassword={confirmPassword}
      loading={loading}
      error={error}
      onPasswordChange={setPassword}
      onConfirmPasswordChange={setConfirmPassword}
      onSubmit={handleSubmit}
      onBackToLogin={handleBackToLogin}
    />
  );
};

export default ResetPasswordPage;