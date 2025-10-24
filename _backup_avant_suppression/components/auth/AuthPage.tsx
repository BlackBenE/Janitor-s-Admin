import React, { useEffect } from "react";
import { Box, Container, Paper } from "@mui/material";
import { Navigate } from "react-router-dom";

// Sections modulaires
import {
  AuthHeader,
  AuthMessageSection,
  AuthNavigationSection,
  AuthFormSection,
  AuthBackNavigationSection,
  AuthLoadingSection,
} from "./components";

import { useAuth } from "./hooks/useAuth";
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
  }, [auth.error]);

  // Rediriger les utilisateurs admin déjà authentifiés
  if (!auth.loading && auth.session && auth.isAdmin()) {
    return <Navigate to="/dashboard" replace />;
  }

  // Afficher le chargement pendant l'initialisation de l'auth
  if (auth.loading) {
    return <AuthLoadingSection />;
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
          {/* En-tête */}
          <AuthHeader />

          {/* Navigation par onglets */}
          <AuthNavigationSection
            currentView={auth.currentView}
            onViewChange={auth.setCurrentView}
          />

          {/* Messages d'état */}
          <AuthMessageSection
            message={auth.message}
            onClearMessage={auth.clearMessage}
          />

          {/* Formulaires d'authentification */}
          <AuthFormSection
            currentView={auth.currentView}
            isSubmitting={auth.isSubmitting}
            onSignIn={auth.handleSignIn}
            onSignUp={auth.handleSignUp}
            onForgotPassword={auth.handleForgotPassword}
          />

          {/* Navigation de retour */}
          <AuthBackNavigationSection
            currentView={auth.currentView}
            onBackToSignIn={() => auth.setCurrentView("signin")}
          />
        </Paper>
      </Container>
    </Box>
  );
};

export default AuthPage;
