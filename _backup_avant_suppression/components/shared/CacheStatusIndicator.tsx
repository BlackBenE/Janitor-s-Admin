import React from "react";
import { Box, Typography, CircularProgress, Chip } from "@mui/material";
import { useIsFetching, useIsMutating } from "@tanstack/react-query";
import CloudDoneIcon from "@mui/icons-material/CloudDone";
import CloudSyncIcon from "@mui/icons-material/CloudSync";

/**
 * Indicateur de statut du cache et des requêtes
 */
const CacheStatusIndicator: React.FC = () => {
  const isFetching = useIsFetching();
  const isMutating = useIsMutating();

  const isLoading = isFetching > 0 || isMutating > 0;

  if (isLoading) {
    return (
      <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
        <CircularProgress size={16} />
        <Typography variant="caption" sx={{ fontSize: "0.75rem" }}>
          Synchronisation...
        </Typography>
      </Box>
    );
  }

  return (
    <Chip
      icon={<CloudDoneIcon />}
      label="Données à jour"
      variant="outlined"
      size="small"
      sx={{
        fontSize: "0.7rem",
        height: 24,
        "& .MuiChip-icon": {
          fontSize: "0.875rem",
        },
        color: "success.main",
        borderColor: "success.main",
      }}
    />
  );
};

export default CacheStatusIndicator;
