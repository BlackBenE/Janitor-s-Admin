import React from "react";
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
} from "@mui/material";
import { LockReset as LockResetIcon } from "@mui/icons-material";

interface ResetPasswordFormProps {
  userEmail: string | null;
  password: string;
  confirmPassword: string;
  loading: boolean;
  error: string | null;
  onPasswordChange: (password: string) => void;
  onConfirmPasswordChange: (confirmPassword: string) => void;
  onSubmit: (e: React.FormEvent) => void;
  onBackToLogin: () => void;
}

export const ResetPasswordForm: React.FC<ResetPasswordFormProps> = ({
  userEmail,
  password,
  confirmPassword,
  loading,
  error,
  onPasswordChange,
  onConfirmPasswordChange,
  onSubmit,
  onBackToLogin,
}) => {
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

          <Box component="form" onSubmit={onSubmit}>
            <TextField
              fullWidth
              type="password"
              label="Nouveau mot de passe"
              value={password}
              onChange={(e) => onPasswordChange(e.target.value)}
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
              onChange={(e) => onConfirmPasswordChange(e.target.value)}
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
            <Button variant="text" onClick={onBackToLogin} disabled={loading}>
              Retour à la connexion
            </Button>
          </Box>
        </Paper>
      </Fade>
    </Container>
  );
};
