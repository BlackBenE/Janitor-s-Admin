import React from "react";
import {
  Box,
  Typography,
  IconButton,
  Tooltip,
  CircularProgress,
} from "@mui/material";
import RefreshIcon from "@mui/icons-material/Refresh";

interface DashboardHeaderProps {
  onRefresh: () => void;
  isRefreshing: boolean;
}

export const DashboardHeader: React.FC<DashboardHeaderProps> = ({
  onRefresh,
  isRefreshing,
}) => {
  return (
    <Box
      sx={{
        display: "flex",
        justifyContent: "space-between",
        alignItems: "center",
        mb: 2,
      }}
    >
      <Box>
        <Typography variant="h4" component="h1" fontWeight="bold">
          Tableau de bord général
        </Typography>
        <Typography variant="body1" color="text.secondary">
          Bon retour ! Voici les dernières actualités concernant votre
          plateforme.
        </Typography>
      </Box>
      <Tooltip title="Rafraîchir les données">
        <IconButton onClick={onRefresh} disabled={isRefreshing} sx={{ ml: 2 }}>
          {isRefreshing ? <CircularProgress size={20} /> : <RefreshIcon />}
        </IconButton>
      </Tooltip>
    </Box>
  );
};
