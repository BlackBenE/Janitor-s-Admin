import React from "react";
import { Box, Typography } from "@mui/material";
import { LABELS } from "../../../constants/labels";

export const AnalyticsHeader: React.FC = () => {
  return (
    <Box sx={{ mb: 4 }}>
      <Typography variant="h4" component="h1" gutterBottom>
        {LABELS.analytics.title}
      </Typography>
      <Typography variant="body1" color="text.secondary">
        {LABELS.analytics.subtitle}
      </Typography>
    </Box>
  );
};
