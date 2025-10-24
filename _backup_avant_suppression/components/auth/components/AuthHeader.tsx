import React from "react";
import { Typography } from "@mui/material";

/**
 * En-tête de la page d'authentification
 */
export const AuthHeader: React.FC = () => {
  return (
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
      Portail Admin
    </Typography>
  );
};
