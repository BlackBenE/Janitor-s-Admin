import React from "react";
import { Box, Paper, Typography, Alert, Container, Grow } from "@mui/material";
import { CheckCircle as CheckCircleIcon } from "@mui/icons-material";

interface ResetSuccessPageProps {
  userEmail: string | null;
  userRole: string | null;
}

export const ResetSuccessPage: React.FC<ResetSuccessPageProps> = ({
  userEmail,
  userRole,
}) => {
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
};
