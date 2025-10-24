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
import { LABELS } from "@/core/config";

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
          {LABELS.propertyApprovals.title}
        </Typography>
        <Typography variant="body1" color="text.secondary">
          {LABELS.propertyApprovals.subtitle}
        </Typography>
      </Box>
      <Box sx={{ display: "flex", gap: 1 }}>
        <Tooltip
          title={`${LABELS.propertyApprovals.actions.export} (${propertiesCount})`}
        >
          <IconButton
            size="large"
            onClick={onExportProperties}
            disabled={isExportDisabled}
          >
            <DownloadIcon />
          </IconButton>
        </Tooltip>
        <Tooltip title={LABELS.common.actions.refresh}>
          <IconButton onClick={onRefresh} disabled={isRefreshing} size="large">
            {isRefreshing ? <CircularProgress size={24} /> : <RefreshIcon />}
          </IconButton>
        </Tooltip>
      </Box>
    </Box>
  );
};
