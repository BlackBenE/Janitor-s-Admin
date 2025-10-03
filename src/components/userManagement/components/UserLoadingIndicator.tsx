import React from "react";
import { Box, Typography, IconButton, CircularProgress } from "@mui/material";
import { Refresh as RefreshIcon } from "@mui/icons-material";
import AdminLayout from "../../AdminLayout";

interface UserLoadingIndicatorProps {
  error?: Error | null;
  onRefresh: () => void;
}

export const UserLoadingIndicator: React.FC<UserLoadingIndicatorProps> = ({
  error,
  onRefresh,
}) => {
  if (error) {
    return (
      <AdminLayout>
        <Box
          display="flex"
          justifyContent="center"
          alignItems="center"
          minHeight="400px"
          flexDirection="column"
          gap={2}
        >
          <Typography variant="h6" color="error">
            Erreur lors du chargement des utilisateurs
          </Typography>
          <Typography variant="body2" color="text.secondary">
            {error.message}
          </Typography>
          <IconButton onClick={onRefresh} color="primary">
            <RefreshIcon />
          </IconButton>
        </Box>
      </AdminLayout>
    );
  }

  return (
    <AdminLayout>
      <Box
        display="flex"
        justifyContent="center"
        alignItems="center"
        minHeight="400px"
      >
        <CircularProgress />
      </Box>
    </AdminLayout>
  );
};
