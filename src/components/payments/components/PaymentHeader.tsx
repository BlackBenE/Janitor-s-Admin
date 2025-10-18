import React from "react";
import { Box, Typography, IconButton, Tooltip } from "@mui/material";
import {
  Download as DownloadIcon,
  Refresh as RefreshIcon,
} from "@mui/icons-material";

interface PaymentHeaderProps {
  onRefresh: () => void;
  onExport: () => Promise<void>;
  isLoading?: boolean;
}

export const PaymentHeader: React.FC<PaymentHeaderProps> = ({
  onRefresh,
  onExport,
  isLoading = false,
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
      <Typography variant="h4" component="h1" fontWeight="bold">
        Gestion des Paiements
      </Typography>

      <Box sx={{ display: "flex", gap: 1 }}>
        <Tooltip title="Actualiser les données">
          <IconButton onClick={onRefresh} disabled={isLoading}>
            <RefreshIcon />
          </IconButton>
        </Tooltip>

        <Tooltip title="Exporter les paiements sélectionnés">
          <IconButton onClick={onExport} disabled={isLoading}>
            <DownloadIcon />
          </IconButton>
        </Tooltip>
      </Box>
    </Box>
  );
};
