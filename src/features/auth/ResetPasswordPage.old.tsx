import React, { useState, useEffect } from "react";
import {
  Box,
  Paper,
  Typography,
  TextField,
  Button,
  Alert,
  CircularProgress,
  Container,
  Fade,
  Grow,
} from "@mui/material";
import {
  LockReset as LockResetIcon,
  CheckCircle as CheckCircleIcon,
} from "@mui/icons-material";
import { useSearchParams, useNavigate } from "react-router-dom";
import { supabase } from "../../lib/supabaseClient";

export const ResetPasswordPage: React.FC = () => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);
  const [userEmail, setUserEmail] = useState<string | null>(null);
  const [userRole, setUserRole] = useState<string | null>(null);
  const [isWaitingForAuth, setIsWaitingForAuth] = useState(false);

  // Capturer les tokens immédiatement au chargement de la page
  const [capturedTokens] = useState(() => {
    const fullUrl = window.location.href;
    console.log("🕵️ Capture initiale URL complète:", fullUrl);

    // Extraire tokens de l'URL complète
    const urlMatch = fullUrl.match(/[?&#]access_token=([^&]+)/);
    const refreshMatch = fullUrl.match(/[?&#]refresh_token=([^&]+)/);
    const typeMatch = fullUrl.match(/[?&#]type=([^&]+)/);

    return {
      access_token: urlMatch ? decodeURIComponent(urlMatch[1]) : null,
      refresh_token: refreshMatch ? decodeURIComponent(refreshMatch[1]) : null,
      type: typeMatch ? decodeURIComponent(typeMatch[1]) : null,
    };
  });

  // Récupérer les tokens depuis l'URL (query params ET hash fragments ET capture initiale)
  const urlHash = window.location.hash;
  const searchParamsFromHash = new URLSearchParams(urlHash.substring(1)); // Enlever le #

  // Essayer plusieurs sources : query params, hash, capture initiale
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
  const errorMatch = urlHash.match(/error=([^&]+)/);
  const errorCodeMatch = urlHash.match(/error_code=([^&]+)/);
  const errorDescriptionMatch = urlHash.match(/error_description=([^&]+)/);

  useEffect(() => {
    // Log de l'URL initiale au chargement de la page
    console.log("📄 Page chargée avec URL:", window.location.href);
    console.log("📄 Referrer:", document.referrer);

    // Éviter les doubles appels en mode strict
    let isSessionSet = false;

    // Alternative : Écouter les événements auth de Supabase
    const { data: authListener } = supabase.auth.onAuthStateChange(
      async (event, session) => {
        console.log("🎧 Auth event:", event, session?.user?.email);

        if (event === "INITIAL_SESSION" && session) {
          console.log(
            "⚠️ Session initiale détectée pour:",
            session.user?.email
          );

          // Vérifier si c'est une session de recovery (l'utilisateur vient d'un lien reset)
          const isRecoverySession =
            window.location.pathname === "/reset-password";

          if (isRecoverySession) {
            console.log(
              "✅ Session de recovery détectée - Autorisation du changement de mot de passe"
            );
            setUserEmail(session.user?.email || null);
            setUserRole(session.user?.user_metadata?.role || "traveler");
            setError(null);
            setIsWaitingForAuth(false); // Arrêter l'attente
            return;
          } else {
            console.log(
              "⚠️ Utilisateur connecté normalement - Force déconnexion pour reset password"
            );
            await supabase.auth.signOut();
            return;
          }
        }

        if (event === "PASSWORD_RECOVERY" && session) {
          console.log("✅ Session de récupération détectée automatiquement");
          setUserEmail(session.user?.email || null);
          setError(null);
          return;
        }

        if (event === "SIGNED_IN" && session?.user) {
          console.log(
            "🔐 Connexion détectée, vérification si c'est pour un reset..."
          );
          // Si on arrive sur cette page et qu'on se connecte, c'est probablement un reset
          setUserEmail(session.user.email || null);
          setError(null);
          return;
        }

        if (event === "SIGNED_OUT") {
          console.log("🚪 Utilisateur déconnecté - Prêt pour reset password");
        }
      }
    );

    // Debug: Afficher les paramètres reçus
    console.log("🔍 Reset Password Page - Analyse URL:");
    console.log("  Query params:", window.location.search);
    console.log("  Hash fragment:", urlHash || "Aucun");
    console.log("  Tokens capturés:", capturedTokens);
    console.log(
      "  access_token final:",
      accessToken
        ? `✅ Présent (${accessToken.substring(0, 20)}...)`
        : "❌ Manquant"
    );
    console.log(
      "  refresh_token final:",
      refreshToken
        ? `✅ Présent (${refreshToken.substring(0, 20)}...)`
        : "❌ Manquant"
    );
    console.log("  type final:", type || "❌ Manquant");
    console.log("  URL complète:", window.location.href);
    console.log("  Timestamp:", new Date().toISOString());

    // Vérifier s'il y a des erreurs dans l'URL
    if (errorMatch) {
      const error = decodeURIComponent(errorMatch[1]);
      const errorCode = errorCodeMatch
        ? decodeURIComponent(errorCodeMatch[1])
        : "";
      const errorDescription = errorDescriptionMatch
        ? decodeURIComponent(errorDescriptionMatch[1].replace(/\+/g, " "))
        : "";

      console.log("❌ Erreur détectée dans l'URL:");
      console.log("  Error:", error);
      console.log("  Code:", errorCode);
      console.log("  Description:", errorDescription);

      if (errorCode === "otp_expired") {
        setError(
          "Le lien de réinitialisation a expiré. Veuillez demander un nouveau lien."
        );
      } else {
        setError(`Erreur : ${errorDescription || error}`);
      }
      return;
    }

    // Vérifier que nous avons les bons tokens et que c'est un reset
    if (!accessToken || !refreshToken || type !== "recovery") {
      console.log("❌ Validation échouée - Tokens manquants ou type incorrect");
      console.log("⏳ Attente d'une session de recovery automatique...");
      // Marquer qu'on attend les événements auth avant d'afficher une erreur
      setIsWaitingForAuth(true);

      // Timeout pour afficher l'erreur si aucune session ne se crée après 10 secondes
      setTimeout(() => {
        if (!userEmail) {
          console.log("⏰ Timeout - Aucune session de recovery détectée");
          setError("Lien de réinitialisation invalide ou expiré.");
          setIsWaitingForAuth(false);
        }
      }, 10000);

      return;
    }

    console.log("✅ Tokens valides - Tentative de création de session");

    // Définir la session avec les tokens reçus
    const setSession = async () => {
      if (isSessionSet) {
        console.log("⚠️ Session déjà en cours de création, abandon");
        return;
      }

      isSessionSet = true;
      console.log("🔄 Création de session avec Supabase...");

      try {
        const { data, error } = await supabase.auth.setSession({
          access_token: accessToken,
          refresh_token: refreshToken,
        });

        if (error) {
          console.error(
            "❌ Erreur lors de la définition de la session:",
            error
          );
          setError("Erreur lors de la validation du lien de réinitialisation.");
        } else if (data.user?.email) {
          // Récupérer l'email de l'utilisateur pour l'affichage
          console.log("✅ Session créée avec succès pour:", data.user.email);
          setUserEmail(data.user.email);
        } else {
          console.log("⚠️ Session créée mais pas d'email utilisateur");
        }
      } catch (err) {
        console.error("Erreur de session:", err);
        setError("Erreur lors de la validation du lien de réinitialisation.");
      }
    };

    setSession();

    // Cleanup function
    return () => {
      isSessionSet = false;
      authListener.subscription.unsubscribe();
    };
  }, [accessToken, refreshToken, type]);

  const handleResetPassword = async (e: React.FormEvent) => {
    e.preventDefault();

    if (password !== confirmPassword) {
      setError("Les mots de passe ne correspondent pas.");
      return;
    }

    if (password.length < 6) {
      setError("Le mot de passe doit contenir au moins 6 caractères.");
      return;
    }

    setLoading(true);
    setError(null);

    try {
      const { error } = await supabase.auth.updateUser({
        password: password,
      });

      if (error) {
        throw error;
      }

      setSuccess(true);

      // Récupérer le rôle de l'utilisateur avant de le déconnecter
      const {
        data: { user },
      } = await supabase.auth.getUser();
      const userRole = user?.user_metadata?.role || "traveler";

      console.log("👤 Rôle utilisateur détecté:", userRole);

      // Déconnecter l'utilisateur pour qu'il doive se reconnecter avec le nouveau mot de passe
      await supabase.auth.signOut();

      // Déterminer l'URL de redirection selon le rôle
      const getRedirectUrl = (role: string) => {
        const ADMIN_APP_URL =
          import.meta.env.VITE_ADMIN_APP_URL || "http://localhost:3000";
        const CLIENT_APP_URL =
          import.meta.env.VITE_CLIENT_APP_URL || "http://localhost:5173";

        switch (role.toLowerCase()) {
          case "admin":
            return `${ADMIN_APP_URL}/auth`;
          case "traveler":
          case "property_owner":
          case "service_provider":
            return `${CLIENT_APP_URL}/auth`;
          default:
            return `${CLIENT_APP_URL}/auth`;
        }
      };

      const redirectUrl = getRedirectUrl(userRole);
      console.log("🔄 Redirection vers:", redirectUrl);

      // Rediriger vers la page d'authentification appropriée après 8 secondes
      setTimeout(() => {
        if (userRole.toLowerCase() === "admin") {
          // Pour les admins, naviguer dans la même app
          navigate("/auth");
        } else {
          // Pour les autres utilisateurs, rediriger vers l'app client
          window.location.href = redirectUrl;
        }
      }, 8000);
    } catch (err) {
      console.error("Erreur lors de la réinitialisation:", err);
      setError(
        err instanceof Error
          ? err.message
          : "Erreur lors de la réinitialisation du mot de passe."
      );
    } finally {
      setLoading(false);
    }
  };

  // Affichage pendant l'attente de la session
  if (isWaitingForAuth && !userEmail) {
    return (
      <Container maxWidth="sm" sx={{ mt: 8 }}>
        <Fade in={true} timeout={800}>
          <Paper elevation={3} sx={{ p: 4 }}>
            <Box sx={{ textAlign: "center", mb: 3 }}>
              <LockResetIcon
                sx={{ fontSize: 48, color: "primary.main", mb: 2 }}
              />
              <Typography variant="h5" gutterBottom>
                Validation du lien...
              </Typography>
              <CircularProgress />
              <Typography variant="body2" color="text.secondary" sx={{ mt: 2 }}>
                Vérification de votre lien de réinitialisation en cours...
              </Typography>
            </Box>
          </Paper>
        </Fade>
      </Container>
    );
  }

  // Afficher l'erreur seulement si on a une erreur ET qu'on n'attend pas une session ET qu'on n'a pas d'email
  if (error && !isWaitingForAuth && !userEmail) {
    return (
      <Container maxWidth="sm" sx={{ mt: 8 }}>
        <Fade in={true} timeout={800}>
          <Paper elevation={3} sx={{ p: 4 }}>
            <Box sx={{ textAlign: "center", mb: 2 }}>
              <LockResetIcon
                sx={{ fontSize: 48, color: "error.main", mb: 2 }}
              />
            </Box>
            <Alert severity="error">{error}</Alert>

            {error?.includes("expiré") && (
              <Box sx={{ mt: 2, p: 2, bgcolor: "info.light", borderRadius: 1 }}>
                <Typography variant="body2" color="info.contrastText">
                  💡 <strong>Conseil :</strong> Les liens de réinitialisation
                  expirent rapidement. Demandez un nouveau lien et cliquez
                  dessus immédiatement après l'avoir reçu.
                </Typography>
              </Box>
            )}
            <Box sx={{ mt: 3, textAlign: "center" }}>
              <Button variant="contained" onClick={() => navigate("/auth")}>
                Retour à la connexion
              </Button>
            </Box>
          </Paper>
        </Fade>
      </Container>
    );
  }

  if (success) {
    return (
      <Container maxWidth="sm" sx={{ mt: 8 }}>
        <Grow in={true} timeout={800}>
          <Paper
            elevation={3}
            sx={{
              p: 4,
              textAlign: "center",
              background: "linear-gradient(135deg, #4caf50 0%, #2e7d32 100%)",
              color: "white",
            }}
          >
            <Box sx={{ mb: 3 }}>
              <Grow in={true} timeout={1200}>
                <CheckCircleIcon sx={{ fontSize: 64, mb: 2 }} />
              </Grow>
              <Typography variant="h5" component="h1" gutterBottom>
                Mot de passe modifié !
              </Typography>
              {userEmail && (
                <Typography variant="body1" sx={{ opacity: 0.9, mb: 2 }}>
                  Le mot de passe pour <strong>{userEmail}</strong> a été mis à
                  jour avec succès.
                </Typography>
              )}
            </Box>

            <Alert
              severity="success"
              sx={{
                mb: 3,
                backgroundColor: "rgba(255, 255, 255, 0.1)",
                color: "white",
                "& .MuiAlert-icon": {
                  color: "white",
                },
              }}
            >
              🎉 Félicitations ! Votre mot de passe a été changé avec succès.
            </Alert>

            <Typography variant="body2" sx={{ opacity: 0.9, mb: 2 }}>
              Pour votre sécurité, vous avez été automatiquement déconnecté.
            </Typography>

            <Typography variant="body2" sx={{ opacity: 0.8, mb: 1 }}>
              {userRole?.toLowerCase() === "admin"
                ? "Redirection vers le portail administrateur..."
                : "Redirection vers l'application client..."}
            </Typography>

            <Typography variant="caption" sx={{ opacity: 0.7 }}>
              {userRole?.toLowerCase() === "admin"
                ? "Vous serez redirigé vers la page de connexion admin"
                : "Vous serez redirigé vers l'application client"}
            </Typography>
          </Paper>
        </Grow>
      </Container>
    );
  }

  return (
    <Container maxWidth="sm" sx={{ mt: 8 }}>
      <Fade in={true} timeout={800}>
        <Paper elevation={3} sx={{ p: 4 }}>
          <Box sx={{ textAlign: "center", mb: 4 }}>
            <LockResetIcon
              sx={{ fontSize: 48, color: "primary.main", mb: 2 }}
            />
            <Typography variant="h4" component="h1" gutterBottom>
              Nouveau mot de passe
            </Typography>
            {userEmail && (
              <Typography variant="body1" color="text.secondary" sx={{ mb: 1 }}>
                Compte : <strong>{userEmail}</strong>
              </Typography>
            )}
            <Typography variant="body2" color="text.secondary">
              Choisissez un nouveau mot de passe sécurisé pour votre compte.
            </Typography>
          </Box>

          {error && (
            <Alert severity="error" sx={{ mb: 3 }}>
              {error}
            </Alert>
          )}

          <Box component="form" onSubmit={handleResetPassword}>
            <TextField
              fullWidth
              type="password"
              label="Nouveau mot de passe"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              margin="normal"
              required
              disabled={loading}
              helperText="Au moins 6 caractères"
            />

            <TextField
              fullWidth
              type="password"
              label="Confirmer le mot de passe"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              margin="normal"
              required
              disabled={loading}
            />

            <Button
              type="submit"
              fullWidth
              variant="contained"
              sx={{ mt: 3, mb: 2 }}
              disabled={loading || !password || !confirmPassword}
            >
              {loading ? (
                <CircularProgress size={24} />
              ) : (
                "Réinitialiser le mot de passe"
              )}
            </Button>
          </Box>

          <Box sx={{ textAlign: "center", mt: 2 }}>
            <Button
              variant="text"
              onClick={() => navigate("/auth")}
              disabled={loading}
            >
              Retour à la connexion
            </Button>
          </Box>
        </Paper>
      </Fade>
    </Container>
  );
};
