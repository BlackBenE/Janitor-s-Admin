import React from "react";
import { DialogTitle, Box, Typography, Chip } from "@mui/material";
import { Home as HomeIcon } from "@mui/icons-material";

interface PropertyDetailsHeaderProps {
  property: any;
}

const getStatusColor = (status: string) => {
  switch (status) {
    case "approved":
      return "success";
    case "rejected":
      return "error";
    case "pending":
    default:
      return "warning";
  }
};

export const PropertyDetailsHeader: React.FC<PropertyDetailsHeaderProps> = ({
  property,
}) => {
  return (
    <DialogTitle>
      <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
        <HomeIcon color="primary" />
        <Typography variant="h6">Property Details</Typography>
        <Chip
          label={property?.validation_status || "Pending"}
          color={getStatusColor(property?.validation_status) as any}
          size="small"
        />
      </Box>
    </DialogTitle>
  );
};
