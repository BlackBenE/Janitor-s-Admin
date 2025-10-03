import React from "react";
import { Dialog, DialogContent, Box } from "@mui/material";
import { PropertyDetailsHeader } from "./PropertyDetailsHeader";
import { PropertyBasicInfo } from "./PropertyBasicInfo";
import { PropertyOwnerInfo } from "./PropertyOwnerInfo";
import { PropertyImageGallery } from "./PropertyImageGallery";
import { PropertyModerationActions } from "./PropertyModerationActions";

interface PropertyDetailsModalProps {
  open: boolean;
  property: any | null;
  onClose: () => void;
  onApprove: (propertyId: string, notes?: string) => void;
  onReject: (propertyId: string, notes?: string) => void;
  isApprovePending?: boolean;
  isRejectPending?: boolean;
}

export const PropertyDetailsModal: React.FC<PropertyDetailsModalProps> = ({
  open,
  property,
  onClose,
  onApprove,
  onReject,
  isApprovePending = false,
  isRejectPending = false,
}) => {
  if (!property) return null;

  return (
    <Dialog
      open={open}
      onClose={onClose}
      maxWidth="lg"
      fullWidth
      sx={{ "& .MuiDialog-paper": { maxHeight: "90vh" } }}
    >
      <PropertyDetailsHeader property={property} />

      <DialogContent dividers>
        <Box sx={{ display: "flex", flexDirection: "column", gap: 3 }}>
          {/* Two-column layout */}
          <Box
            sx={{
              display: "flex",
              gap: 3,
              flexDirection: { xs: "column", md: "row" },
            }}
          >
            {/* Left column - Main details */}
            <Box
              sx={{
                flex: 2,
                display: "flex",
                flexDirection: "column",
                gap: 2,
              }}
            >
              <PropertyBasicInfo property={property} />
              <PropertyOwnerInfo property={property} />
            </Box>

            {/* Right column - Images and additional info */}
            <Box
              sx={{
                flex: 1,
                display: "flex",
                flexDirection: "column",
                gap: 2,
              }}
            >
              <PropertyImageGallery property={property} />
            </Box>
          </Box>
        </Box>
      </DialogContent>

      <PropertyModerationActions
        property={property}
        onClose={onClose}
        onApprove={onApprove}
        onReject={onReject}
        isApprovePending={isApprovePending}
        isRejectPending={isRejectPending}
      />
    </Dialog>
  );
};
