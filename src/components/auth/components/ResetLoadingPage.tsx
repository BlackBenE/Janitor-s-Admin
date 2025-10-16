import React from "react";
import {
  Box,
  Paper,
  Typography,
  Container,
  Fade,
  CircularProgress,
} from "@mui/material";
import { LockReset as LockResetIcon } from "@mui/icons-material";

export const ResetLoadingPage: React.FC = () => {
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
};
