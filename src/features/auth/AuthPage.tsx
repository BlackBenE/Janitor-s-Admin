import React, { useEffect } from 'react';
import { Box, Container, Paper, Typography } from '@mui/material';
import { Navigate } from 'react-router-dom';

// Composants shared
import { LoadingScreen, AlertMessage } from '@/shared/components/feedback';

// Composants locaux
import { SignInForm } from './components';

import { useAuth } from './hooks/useAuth';

export const AuthPage: React.FC = () => {
  const auth = useAuth();

  // Afficher les erreurs globales d'authentification
  useEffect(() => {
    if (auth.error) {
      auth.setMessage({
        type: 'error',
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
    return (
      <LoadingScreen
        message="Vérification de la session..."
        background="linear-gradient(135deg, #667eea 0%, #764ba2 100%)"
        spinnerColor="white"
        size="large"
      />
    );
  }

  return (
    <Box
      sx={{
        minHeight: '100vh',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
        padding: 2,
      }}
    >
      <Container maxWidth="sm">
        <Paper
          elevation={8}
          sx={{
            padding: 4,
            borderRadius: 3,
            background: 'rgba(255, 255, 255, 0.95)',
            backdropFilter: 'blur(10px)',
          }}
        >
          {/* En-tête */}
          <Typography
            variant="h4"
            component="h1"
            gutterBottom
            align="center"
            sx={{
              fontWeight: 700,
              color: 'primary.main',
              marginBottom: 3,
            }}
          >
            Portail Admin
          </Typography>

          {/* Messages d'état (erreurs, succès) */}
          {auth.message && (
            <AlertMessage
              severity={auth.message.type}
              message={auth.message.text}
              onClose={auth.clearMessage}
              sx={{ marginBottom: 2 }}
            />
          )}

          {/* Formulaire de connexion */}
          <SignInForm isSubmitting={auth.isSubmitting} onSubmit={auth.handleSignIn} />
        </Paper>
      </Container>
    </Box>
  );
};

export default AuthPage;
