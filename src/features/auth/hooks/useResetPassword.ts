import { useState, useEffect } from "react";
import { useSearchParams, useNavigate } from "react-router-dom";
import { supabase } from "../../../lib/supabaseClient";

interface ResetPasswordState {
  password: string;
  confirmPassword: string;
  loading: boolean;
  error: string | null;
  success: boolean;
  userEmail: string | null;
  userRole: string | null;
  isWaitingForAuth: boolean;
}

interface CapturedTokens {
  access_token: string | null;
  refresh_token: string | null;
  type: string | null;
}

export const useResetPassword = () => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();

  const [state, setState] = useState<ResetPasswordState>({
    password: "",
    confirmPassword: "",
    loading: false,
    error: null,
    success: false,
    userEmail: null,
    userRole: null,
    isWaitingForAuth: false,
  });

  // Capturer les tokens immédiatement au chargement de la page
  const [capturedTokens] = useState<CapturedTokens>(() => {
    const fullUrl = window.location.href;

    const urlMatch = fullUrl.match(/[?&#]access_token=([^&]+)/);
    const refreshMatch = fullUrl.match(/[?&#]refresh_token=([^&]+)/);
    const typeMatch = fullUrl.match(/[?&#]type=([^&]+)/);

    return {
      access_token: urlMatch ? decodeURIComponent(urlMatch[1]) : null,
      refresh_token: refreshMatch ? decodeURIComponent(refreshMatch[1]) : null,
      type: typeMatch ? decodeURIComponent(typeMatch[1]) : null,
    };
  });

  // Récupérer les tokens depuis différentes sources
  const getTokensFromUrl = () => {
    const urlHash = window.location.hash;
    const searchParamsFromHash = new URLSearchParams(urlHash.substring(1));

    const accessToken =
      searchParams.get("access_token") ||
      searchParamsFromHash.get("access_token") ||
      capturedTokens.access_token;
    const refreshToken =
      searchParams.get("refresh_token") ||
      searchParamsFromHash.get("refresh_token") ||
      capturedTokens.refresh_token;
    const type =
      searchParams.get("type") ||
      searchParamsFromHash.get("type") ||
      capturedTokens.type;

    return { accessToken, refreshToken, type, urlHash };
  };

  // Mettre à jour l'état
  const updateState = (updates: Partial<ResetPasswordState>) => {
    setState((prev) => ({ ...prev, ...updates }));
  };

  // Gérer les événements d'authentification
  const handleAuthEvents = () => {
    const { data: authListener } = supabase.auth.onAuthStateChange(
      async (event, session) => {
        if (event === "INITIAL_SESSION" && session) {
          const isRecoverySession =
            window.location.pathname === "/reset-password";

          if (isRecoverySession) {
            updateState({
              userEmail: session.user?.email || null,
              userRole: session.user?.user_metadata?.role || "traveler",
              error: null,
              isWaitingForAuth: false,
            });
            return;
          } else {
            await supabase.auth.signOut();
            return;
          }
        }

        if (event === "PASSWORD_RECOVERY" && session) {
          updateState({
            userEmail: session.user?.email || null,
            error: null,
          });
          return;
        }

        if (event === "SIGNED_IN" && session?.user) {
          updateState({
            userEmail: session.user.email || null,
            error: null,
          });
          return;
        }

        if (event === "SIGNED_OUT") {
          // Utilisateur déconnecté - prêt pour reset password
        }
      }
    );

    return authListener;
  };

  // Gérer la réinitialisation du mot de passe
  const handlePasswordReset = async (e: React.FormEvent) => {
    e.preventDefault();

    if (state.password !== state.confirmPassword) {
      updateState({ error: "Les mots de passe ne correspondent pas." });
      return;
    }

    if (state.password.length < 6) {
      updateState({
        error: "Le mot de passe doit contenir au moins 6 caractères.",
      });
      return;
    }

    updateState({ loading: true, error: null });

    try {
      const { error } = await supabase.auth.updateUser({
        password: state.password,
      });

      if (error) {
        throw error;
      }

      // Récupérer le rôle de l'utilisateur avant de le déconnecter
      const {
        data: { user },
      } = await supabase.auth.getUser();
      const userRole = user?.user_metadata?.role || "traveler";

      updateState({ success: true, userRole });

      // Déconnecter l'utilisateur pour qu'il doive se reconnecter
      await supabase.auth.signOut();

      // Redirection basée sur le rôle
      setTimeout(() => {
        if (userRole.toLowerCase() === "admin") {
          navigate("/auth");
        } else {
          const CLIENT_APP_URL =
            import.meta.env.VITE_CLIENT_APP_URL || "http://localhost:5173";
          window.location.href = `${CLIENT_APP_URL}/auth`;
        }
      }, 8000);
    } catch (err) {
      console.error("Erreur lors de la réinitialisation:", err);
      updateState({
        error:
          err instanceof Error
            ? err.message
            : "Erreur lors de la réinitialisation du mot de passe.",
      });
    } finally {
      updateState({ loading: false });
    }
  };

  return {
    ...state,
    capturedTokens,
    getTokensFromUrl,
    updateState,
    handleAuthEvents,
    handlePasswordReset,
    setPassword: (password: string) => updateState({ password }),
    setConfirmPassword: (confirmPassword: string) =>
      updateState({ confirmPassword }),
    navigate,
  };
};
