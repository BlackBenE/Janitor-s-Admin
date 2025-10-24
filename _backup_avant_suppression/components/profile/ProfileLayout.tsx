import React, { ReactNode } from "react";
import { Box } from "@mui/material";

interface ProfileLayoutProps {
  leftColumn: ReactNode;
  rightColumn: ReactNode;
}

export const ProfileLayout: React.FC<ProfileLayoutProps> = ({
  leftColumn,
  rightColumn,
}) => {
  return (
    <Box
      sx={{
        display: "flex",
        flexDirection: { xs: "column", md: "row" },
        gap: 3,
      }}
    >
      {/* Colonne gauche - Avatar et infos */}
      <Box
        sx={{
          flex: { xs: "1 1 100%", md: "0 0 33.333%" },
          maxWidth: { md: "33.333%" },
        }}
      >
        {leftColumn}
      </Box>

      {/* Colonne droite - Formulaire et paramètres */}
      <Box
        sx={{
          flex: { xs: "1 1 100%", md: "0 0 66.667%" },
          maxWidth: { md: "66.667%" },
        }}
      >
        {rightColumn}
      </Box>
    </Box>
  );
};
