import React, { useEffect } from "react";
import {
  Box,
  Container,
  Paper,
  Typography,
  Alert,
  CircularProgress,
} from "@mui/material";
import { Navigate } from "react-router-dom";

// Composants spécialisés

// Hooks
import { useAuth } from "../../hooks/auth/useAuth";
import { AuthTabs } from "./AuthTabs";
import { AuthNavigation } from "./AuthNavigation";
import { AuthFormRenderer } from "./AuthFormRenderer";

export const AuthPage: React.FC = () => {
  const auth = useAuth();

  // Afficher les erreurs globales d'authentification
  useEffect(() => {
    if (auth.error) {
      auth.setMessage({
        type: "error",
        text: auth.error,
      });
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [auth.error]); // Seule auth.error comme dépendance

  // Rediriger les utilisateurs admin déjà authentifiés
  if (!auth.loading && auth.session && auth.isAdmin()) {
    return <Navigate to="/dashboard" replace />;
  }

  // Afficher le chargement pendant l'initialisation de l'auth
  if (auth.loading) {
    return (
      <Box
        sx={{
          minHeight: "100vh",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          background: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
        }}
      >
        <CircularProgress size={60} sx={{ color: "white" }} />
      </Box>
    );
  }

  return (
    <Box
      sx={{
        minHeight: "100vh",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        background: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
        padding: 2,
      }}
    >
      <Container maxWidth="sm">
        <Paper
          elevation={8}
          sx={{
            padding: 4,
            borderRadius: 3,
            background: "rgba(255, 255, 255, 0.95)",
            backdropFilter: "blur(10px)",
          }}
        >
          {/* Header */}
          <Typography
            variant="h4"
            component="h1"
            gutterBottom
            align="center"
            sx={{
              fontWeight: 700,
              color: "primary.main",
              marginBottom: 3,
            }}
          >
            Admin Portal
          </Typography>

          {/* Tabs de navigation */}
          <AuthTabs
            currentView={auth.currentView}
            onViewChange={auth.setCurrentView}
          />

          {/* Message d'état */}
          {auth.message && (
            <Alert
              severity={auth.message.type}
              sx={{ marginBottom: 2 }}
              onClose={auth.clearMessage}
            >
              {auth.message.text}
            </Alert>
          )}

          {/* Formulaire basé sur la vue actuelle */}
          <AuthFormRenderer
            currentView={auth.currentView}
            isSubmitting={auth.isSubmitting}
            onSignIn={auth.handleSignIn}
            onSignUp={auth.handleSignUp}
            onForgotPassword={auth.handleForgotPassword}
          />

          {/* Navigation de retour */}
          <AuthNavigation
            currentView={auth.currentView}
            onBackToSignIn={() => auth.setCurrentView("signin")}
          />
        </Paper>
      </Container>
    </Box>
  );
};

export default AuthPage;
