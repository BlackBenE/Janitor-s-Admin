import React from "react";
import { DialogTitle, Box, Typography, Chip } from "@mui/material";
import { Home as HomeIcon } from "@mui/icons-material";

import { Property } from "@/types";
import { getStatusColor } from "@/utils";
import { LABELS } from "@/core/config/labels";

interface PropertyDetailsHeaderProps {
  property: Property;
}

export const PropertyDetailsHeader: React.FC<PropertyDetailsHeaderProps> = ({
  property,
}) => {
  return (
    <DialogTitle>
      <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
        <HomeIcon color="primary" />
        <Typography variant="h6">
          {LABELS.propertyApprovals.modals.title}
        </Typography>
        <Chip
          label={
            property?.validation_status ||
            LABELS.propertyApprovals.status.pending
          }
          color={getStatusColor(property?.validation_status, "property")}
          size="small"
        />
      </Box>
    </DialogTitle>
  );
};
