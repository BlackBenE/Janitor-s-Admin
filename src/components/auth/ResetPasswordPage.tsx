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
} from "@mui/material";
import { LockReset as LockResetIcon } from "@mui/icons-material";
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

  // Récupérer les tokens depuis l'URL
  const accessToken = searchParams.get("access_token");
  const refreshToken = searchParams.get("refresh_token");
  const type = searchParams.get("type");

  useEffect(() => {
    // Vérifier que nous avons les bons tokens et que c'est un reset
    if (!accessToken || !refreshToken || type !== "recovery") {
      setError("Lien de réinitialisation invalide ou expiré.");
      return;
    }

    // Définir la session avec les tokens reçus
    const setSession = async () => {
      try {
        const { error } = await supabase.auth.setSession({
          access_token: accessToken,
          refresh_token: refreshToken,
        });

        if (error) {
          console.error("Erreur lors de la définition de la session:", error);
          setError("Erreur lors de la validation du lien de réinitialisation.");
        }
      } catch (err) {
        console.error("Erreur de session:", err);
        setError("Erreur lors de la validation du lien de réinitialisation.");
      }
    };

    setSession();
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

      // Rediriger vers la page d'authentification après 3 secondes
      setTimeout(() => {
        navigate("/auth");
      }, 3000);
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

  if (!accessToken || !refreshToken || type !== "recovery") {
    return (
      <Container maxWidth="sm" sx={{ mt: 8 }}>
        <Paper elevation={3} sx={{ p: 4 }}>
          <Alert severity="error">
            Lien de réinitialisation invalide ou expiré. Veuillez demander un
            nouveau lien.
          </Alert>
          <Box sx={{ mt: 2, textAlign: "center" }}>
            <Button variant="contained" onClick={() => navigate("/auth")}>
              Retour à la connexion
            </Button>
          </Box>
        </Paper>
      </Container>
    );
  }

  if (success) {
    return (
      <Container maxWidth="sm" sx={{ mt: 8 }}>
        <Paper elevation={3} sx={{ p: 4 }}>
          <Alert severity="success">
            Mot de passe réinitialisé avec succès ! Vous allez être redirigé
            vers la page de connexion.
          </Alert>
        </Paper>
      </Container>
    );
  }

  return (
    <Container maxWidth="sm" sx={{ mt: 8 }}>
      <Paper elevation={3} sx={{ p: 4 }}>
        <Box sx={{ display: "flex", alignItems: "center", mb: 3 }}>
          <LockResetIcon sx={{ mr: 1, color: "primary.main" }} />
          <Typography variant="h5" component="h1">
            Réinitialiser le mot de passe
          </Typography>
        </Box>

        <Typography variant="body2" color="text.secondary" sx={{ mb: 3 }}>
          Veuillez saisir votre nouveau mot de passe.
        </Typography>

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
    </Container>
  );
};
