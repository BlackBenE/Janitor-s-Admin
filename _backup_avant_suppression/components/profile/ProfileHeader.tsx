import React from "react";
import { Box, Typography, IconButton } from "@mui/material";
import { ArrowBack as ArrowBackIcon } from "@mui/icons-material";

interface ProfileHeaderProps {
  onReturnToDashboard: () => void;
  title: string;
  subtitle?: string;
}

export const ProfileHeader: React.FC<ProfileHeaderProps> = ({
  onReturnToDashboard,
  title,
  subtitle,
}) => {
  return (
    <Box sx={{ mb: 4 }}>
      <Box sx={{ display: "flex", alignItems: "center", mb: 2 }}>
        <IconButton
          onClick={onReturnToDashboard}
          sx={{ mr: 2 }}
          aria-label="Return to dashboard"
        >
          <ArrowBackIcon />
        </IconButton>
        <Box>
          <Typography variant="h4" component="h1" gutterBottom>
            {title}
          </Typography>
          {subtitle && (
            <Typography variant="body1" color="text.secondary">
              {subtitle}
            </Typography>
          )}
        </Box>
      </Box>
    </Box>
  );
};
