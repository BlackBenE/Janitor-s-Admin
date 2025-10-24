import React from "react";
import { Box, CircularProgress } from "@mui/material";

/**
 * Section d'affichage du chargement lors de l'initialisation de l'auth
 */
export const AuthLoadingSection: React.FC = () => {
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
};
