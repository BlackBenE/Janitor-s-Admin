import React, { useState } from "react";
import { Dialog, DialogContent, Box } from "@mui/material";
import { ServiceWithDetails } from "../../../types/services";
import { ServiceActions } from "./ServiceActions";
import { ServiceInfoSections } from "./ServiceInfoSections";
import { ServiceEditForm } from "./ServiceEditForm";
import { ServiceDetailsHeader } from "./ServiceDetailsHeader";

interface ServiceDetailsModalProps {
  open: boolean;
  service: ServiceWithDetails | null;
  editForm: Partial<ServiceWithDetails>;
  onClose: () => void;
  onSave: () => void;
  onApproveService?: (serviceId: string) => void;
  onRejectService?: (serviceId: string) => void;
  onDeleteService?: (serviceId: string) => void;
  onInputChange: (
    field: keyof ServiceWithDetails,
    value: string | number | boolean | null | string[]
  ) => void;
  isLoading?: boolean;
}

export const ServiceDetailsModal: React.FC<ServiceDetailsModalProps> = ({
  open,
  service,
  editForm,
  onClose,
  onSave,
  onApproveService,
  onRejectService,
  onDeleteService,
  onInputChange,
  isLoading = false,
}) => {
  const [isEditMode, setIsEditMode] = useState(false);

  if (!service) return null;

  const handleEditSave = async () => {
    await onSave();
    setIsEditMode(false);
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
      <ServiceDetailsHeader service={service} onClose={handleClose} />

      <DialogContent dividers>
        <Box
          sx={{
            display: "flex",
            flexDirection: { xs: "column", md: "row" },
            gap: 3,
            minHeight: "500px",
          }}
        >
          {/* Contenu principal - Centre */}
          <Box sx={{ flex: 1, order: { xs: 2, md: 1 } }}>
            {isEditMode ? (
              <ServiceEditForm
                service={service}
                editForm={editForm}
                onInputChange={onInputChange}
              />
            ) : (
              <ServiceInfoSections service={service} layoutMode="main" />
            )}
          </Box>

          {/* Service Information - Droite */}
          <Box
            sx={{
              width: { xs: "100%", md: "320px" },
              order: { xs: 1, md: 2 },
              flexShrink: 0,
            }}
          >
            {!isEditMode && (
              <ServiceInfoSections service={service} layoutMode="sidebar" />
            )}
          </Box>
        </Box>
      </DialogContent>

      <ServiceActions
        service={service}
        onClose={handleClose}
        onEditService={() => setIsEditMode(true)}
        onApproveService={onApproveService}
        onRejectService={onRejectService}
        onDeleteService={onDeleteService}
        onSaveEdit={isEditMode ? handleEditSave : undefined}
        onCancelEdit={isEditMode ? handleEditCancel : undefined}
        isEditMode={isEditMode}
        isLoading={isLoading}
      />
    </Dialog>
  );
};