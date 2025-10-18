import React from "react";
import {
  Box,
  Typography,
  IconButton,
  Tooltip,
  CircularProgress,
} from "@mui/material";
import {
  Refresh as RefreshIcon,
  Add as AddIcon,
  Download as DownloadIcon,
} from "@mui/icons-material";

interface PropertyHeaderProps {
  propertiesCount: number;
  onRefresh: () => void;
  onAddProperty: () => void;
  onExportProperties: () => void;
  isRefreshing?: boolean;
  isExportDisabled?: boolean;
}

export const PropertyHeader: React.FC<PropertyHeaderProps> = ({
  propertiesCount,
  onRefresh,
  onAddProperty,
  onExportProperties,
  isRefreshing = false,
  isExportDisabled = false,
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
        <Typography variant="h4" component="h1" gutterBottom>
          Property Approvals
        </Typography>
        <Typography variant="body1" color="text.secondary">
          Review and moderate property listings submitted by landlords.
        </Typography>
      </Box>
      <Box sx={{ display: "flex", gap: 1 }}>
        <Tooltip title={`Export ${propertiesCount} Properties to CSV`}>
          <IconButton
            size="large"
            onClick={onExportProperties}
            disabled={isExportDisabled}
          >
            <DownloadIcon />
          </IconButton>
        </Tooltip>
        <Tooltip title="Refresh Properties">
          <IconButton onClick={onRefresh} disabled={isRefreshing} size="large">
            {isRefreshing ? <CircularProgress size={24} /> : <RefreshIcon />}
          </IconButton>
        </Tooltip>
      </Box>
    </Box>
  );
};
