import React from "react";
import {
  Box,
  Paper,
  Typography,
  Alert,
  Container,
  Button,
  Fade,
  CircularProgress,
} from "@mui/material";
import { LockReset as LockResetIcon } from "@mui/icons-material";
import { useNavigate } from "react-router-dom";

interface ResetErrorPageProps {
  error: string;
}

export const ResetErrorPage: React.FC<ResetErrorPageProps> = ({ error }) => {
  const navigate = useNavigate();

  return (
    <Container maxWidth="sm" sx={{ mt: 8 }}>
      <Fade in={true} timeout={800}>
        <Paper elevation={3} sx={{ p: 4 }}>
          <Box sx={{ textAlign: "center", mb: 2 }}>
            <LockResetIcon sx={{ fontSize: 48, color: "error.main", mb: 2 }} />
          </Box>
          <Alert severity="error">{error}</Alert>

          {error?.includes("expiré") && (
            <Box sx={{ mt: 2, p: 2, bgcolor: "info.light", borderRadius: 1 }}>
              <Typography variant="body2" color="info.contrastText">
                💡 <strong>Conseil :</strong> Les liens de réinitialisation
                expirent rapidement. Demandez un nouveau lien et cliquez dessus
                immédiatement après l'avoir reçu.
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
};
