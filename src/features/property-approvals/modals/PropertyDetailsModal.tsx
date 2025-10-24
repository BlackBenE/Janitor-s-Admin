import React, { useState } from "react";
import { Dialog, DialogContent, Box } from "@mui/material";
import { PropertyDetailsHeader } from "./PropertyDetailsHeader";
import { PropertyBasicInfo } from "./PropertyBasicInfo";
import { PropertyOwnerInfo } from "./PropertyOwnerInfo";
import { PropertyImageGallery } from "./PropertyImageGallery";
import { PropertyModerationActions } from "./PropertyModerationActions";

import { Property, PropertyWithOwner } from "@/types";
import { PropertyEditForm } from "./PropertyEditForm";

interface PropertyDetailsModalProps {
  open: boolean;
  property: PropertyWithOwner | null;
  onClose: () => void;
  onApprove: (propertyId: string, notes?: string) => Promise<void>;
  onReject: (propertyId: string, notes?: string) => Promise<void>;
  onSetPending: (propertyId: string, notes?: string) => Promise<void>;
  onUpdateProperty?: (
    propertyId: string,
    updates: Partial<Property>
  ) => Promise<void>;
  isApprovePending?: boolean;
  isRejectPending?: boolean;
  isPendingPending?: boolean;
  isUpdatePending?: boolean;
}

export const PropertyDetailsModal: React.FC<PropertyDetailsModalProps> = ({
  open,
  property,
  onClose,
  onApprove,
  onReject,
  onSetPending,
  onUpdateProperty,
  isApprovePending = false,
  isRejectPending = false,
  isPendingPending = false,
  isUpdatePending = false,
}) => {
  const [isEditMode, setIsEditMode] = useState(false);

  if (!property) return null;

  const handleEditSave = async (updates: Partial<Property>) => {
    if (onUpdateProperty && property.id) {
      try {
        await onUpdateProperty(property.id, updates);
        setIsEditMode(false);
      } catch (error) {
        console.error("Error updating property:", error);
        // Error handling will be done in the parent component
      }
    }
  };

  const handleEditCancel = () => {
    setIsEditMode(false);
  };

  const handleClose = () => {
    setIsEditMode(false);
    onClose();
  };

  return (
    <Dialog
      open={open}
      onClose={handleClose}
      maxWidth="lg"
      fullWidth
      sx={{ "& .MuiDialog-paper": { maxHeight: "90vh" } }}
    >
      <PropertyDetailsHeader property={property} />

      <DialogContent dividers>
        <Box sx={{ display: "flex", flexDirection: "column", gap: 3 }}>
          {isEditMode ? (
            /* Edit Mode - Full width form */
            <PropertyEditForm
              property={property}
              onSave={handleEditSave}
              onCancel={handleEditCancel}
              isLoading={isUpdatePending}
            />
          ) : (
            /* View Mode - Two-column layout */
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
          )}
        </Box>
      </DialogContent>

      <PropertyModerationActions
        property={property}
        onClose={handleClose}
        onApprove={onApprove}
        onReject={onReject}
        onSetPending={onSetPending}
        onEditProperty={
          onUpdateProperty ? () => setIsEditMode(true) : undefined
        }
        onSaveEdit={isEditMode ? handleEditSave : undefined}
        onCancelEdit={isEditMode ? handleEditCancel : undefined}
        isEditMode={isEditMode}
        isApprovePending={isApprovePending}
        isRejectPending={isRejectPending}
        isPendingPending={isPendingPending}
        isUpdatePending={isUpdatePending}
      />
    </Dialog>
  );
};
