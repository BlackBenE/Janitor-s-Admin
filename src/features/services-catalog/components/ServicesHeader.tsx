import React from "react";
import { Box, Typography, IconButton, Tooltip } from "@mui/material";
import {
  Download as DownloadIcon,
  Refresh as RefreshIcon,
  Add as AddIcon,
} from "@mui/icons-material";

interface ServicesHeaderProps {
  onRefresh: () => void;
  onExport: () => Promise<void>;
  onAddService: () => void;
  isLoading?: boolean;
}

export const ServicesHeader: React.FC<ServicesHeaderProps> = ({
  onRefresh,
  onExport,
  onAddService,
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
        Catalogue des Services
      </Typography>

      <Box sx={{ display: "flex", gap: 1 }}>
        <Tooltip title="Ajouter un service">
          <IconButton onClick={onAddService} disabled={isLoading}>
            <AddIcon />
          </IconButton>
        </Tooltip>

        <Tooltip title="Actualiser les données">
          <IconButton onClick={onRefresh} disabled={isLoading}>
            <RefreshIcon />
          </IconButton>
        </Tooltip>

        <Tooltip title="Exporter les services sélectionnés">
          <IconButton onClick={onExport} disabled={isLoading}>
            <DownloadIcon />
          </IconButton>
        </Tooltip>
      </Box>
    </Box>
  );
};
