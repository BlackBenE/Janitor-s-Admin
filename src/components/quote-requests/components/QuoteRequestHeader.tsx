import React from "react";
import { Box, Typography, IconButton, Tooltip } from "@mui/material";
import {
  Download as DownloadIcon,
  Refresh as RefreshIcon,
  Add as AddIcon,
} from "@mui/icons-material";

interface QuoteRequestHeaderProps {
  onRefresh: () => void;
  onExport: () => Promise<void>;
  onAddQuoteRequest?: () => void;
  isLoading?: boolean;
  totalCount?: number;
}

export const QuoteRequestHeader: React.FC<QuoteRequestHeaderProps> = ({
  onRefresh,
  onExport,
  onAddQuoteRequest,
  isLoading = false,
  totalCount = 0,
}) => {
  return (
    <Box
      sx={{
        display: "flex",
        justifyContent: "space-between",
        alignItems: "center",
        mb: 3,
      }}
    >
      <Box>
        <Typography variant="h4" component="h1" fontWeight="bold">
          Demandes de devis
        </Typography>
        <Typography variant="body1" color="text.secondary">
          Surveillez et gérez les demandes de devis de service et les
          interventions en cours. ({totalCount} demandes)
        </Typography>
      </Box>

      <Box sx={{ display: "flex", gap: 1 }}>
        {onAddQuoteRequest && (
          <Tooltip title="Ajouter une demande">
            <IconButton onClick={onAddQuoteRequest} disabled={isLoading}>
              <AddIcon />
            </IconButton>
          </Tooltip>
        )}

        <Tooltip title="Actualiser les données">
          <IconButton onClick={onRefresh} disabled={isLoading}>
            <RefreshIcon />
          </IconButton>
        </Tooltip>

        <Tooltip title="Exporter les demandes sélectionnées">
          <IconButton onClick={onExport} disabled={isLoading}>
            <DownloadIcon />
          </IconButton>
        </Tooltip>
      </Box>
    </Box>
  );
};
