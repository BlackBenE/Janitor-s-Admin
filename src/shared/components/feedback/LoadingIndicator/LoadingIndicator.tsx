import React from "react";
import { Box, Typography, IconButton, CircularProgress } from "@mui/material";
import { Refresh as RefreshIcon } from "@mui/icons-material";

interface LoadingIndicatorProps {
  error?: Error | null;
  onRefresh?: () => void;
  loadingText?: string;
  errorTitle?: string;
  minHeight?: string;
  withLayout?: boolean;
}

/**
 * 🔄 Composant Loading universel pour tous les domaines
 * Remplace UserLoadingIndicator, PaymentLoadingIndicator, DashboardLoadingIndicator
 */
export const LoadingIndicator: React.FC<LoadingIndicatorProps> = ({
  error,
  onRefresh,
  loadingText = "Chargement...",
  errorTitle = "Erreur lors du chargement",
  minHeight = "400px",
  withLayout = false,
}) => {
  const content = error ? (
    <Box
      display="flex"
      justifyContent="center"
      alignItems="center"
      minHeight={minHeight}
      flexDirection="column"
      gap={2}
    >
      <Typography variant="h6" color="error">
        {errorTitle}
      </Typography>
      <Typography variant="body2" color="text.secondary">
        {error.message}
      </Typography>
      {onRefresh && (
        <IconButton onClick={onRefresh} color="primary">
          <RefreshIcon />
        </IconButton>
      )}
    </Box>
  ) : (
    <Box
      display="flex"
      justifyContent="center"
      alignItems="center"
      minHeight={minHeight}
    >
      <CircularProgress />
      {loadingText && (
        <Typography variant="body2" sx={{ ml: 2 }}>
          {loadingText}
        </Typography>
      )}
    </Box>
  );

  if (withLayout) {
    // Import dynamique pour éviter les dépendances circulaires
    const AdminLayout = React.lazy(() => import("@/shared/components/layout/AdminLayout"));
    return (
      <React.Suspense fallback={content}>
        <AdminLayout>{content}</AdminLayout>
      </React.Suspense>
    );
  }

  return content;
};

export default LoadingIndicator;
