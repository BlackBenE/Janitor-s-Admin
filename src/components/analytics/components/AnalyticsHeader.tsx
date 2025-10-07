import React from "react";
import { Box, Typography } from "@mui/material";

export const AnalyticsHeader: React.FC = () => {
  return (
    <Box sx={{ mb: 4 }}>
      <Typography variant="h4" component="h1" gutterBottom>
        Analytics & Reporting
      </Typography>
      <Typography variant="body1" color="text.secondary">
        Tableau de bord analytique avec métriques de performance et insights
        business
      </Typography>
    </Box>
  );
};
