import React from "react";
import {
  Box,
  Typography,
  IconButton,
  Tooltip,
  CircularProgress,
} from "@mui/material";
import {
  Download as DownloadIcon,
  Refresh as RefreshIcon,
} from "@mui/icons-material";

interface FinancialHeaderProps {
  title?: string;
  description?: string;
  onExport?: () => void;
  onRefresh?: () => void;
  isFetching?: boolean;
}

/**
 * En-tête de la page Financial Overview - Structure identique à UserHeader
 */
export const FinancialHeader: React.FC<FinancialHeaderProps> = ({
  title = "Financial Management",
  description = "Monitor revenue, expenses, and payment transactions across the platform.",
  onExport,
  onRefresh,
  isFetching = false,
}) => {
  return (
    <Box
      sx={{
        display: "flex",
        justifyContent: "space-between",
        alignItems: "center",
        mb: 3,
        pb: 2,
        borderBottom: "1px solid #ddd",
      }}
    >
      {/* Title and Description */}
      <Box>
        <Typography variant="h4" component="h1" gutterBottom>
          {title}
        </Typography>
        <Typography variant="body1" color="text.secondary">
          {description}
        </Typography>
      </Box>

      {/* Action Buttons - Comme UserHeader */}
      <Box sx={{ display: "flex", gap: 1 }}>
        {onExport && (
          <Tooltip title="Exporter les données financières">
            <IconButton onClick={onExport} size="large">
              <DownloadIcon />
            </IconButton>
          </Tooltip>
        )}

        {onRefresh && (
          <Tooltip title="Actualiser les données financières">
            <IconButton onClick={onRefresh} disabled={isFetching} size="large">
              {isFetching ? <CircularProgress size={24} /> : <RefreshIcon />}
            </IconButton>
          </Tooltip>
        )}
      </Box>
    </Box>
  );
};
