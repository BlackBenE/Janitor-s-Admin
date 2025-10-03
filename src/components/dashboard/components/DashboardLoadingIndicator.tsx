import React from "react";
import { Box, Typography } from "@mui/material";

interface DashboardLoadingIndicatorProps {
  isRefreshing: boolean;
}

export const DashboardLoadingIndicator: React.FC<
  DashboardLoadingIndicatorProps
> = ({ isRefreshing }) => {
  if (!isRefreshing) return null;

  return (
    <Box sx={{ textAlign: "center", py: 2 }}>
      <Typography variant="body2" color="text.secondary">
        Mise à jour des données...
      </Typography>
    </Box>
  );
};
