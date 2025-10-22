import React, { useState } from "react";
import { Dialog, DialogContent, Box } from "@mui/material";
import { PaymentWithDetails } from "../../../types/payments";
import { PaymentActions } from "./PaymentActions";
import { PaymentInfoSections } from "./PaymentInfoSections";
import { PaymentEditForm } from "./PaymentEditForm";
import { PaymentDetailsHeader } from "./PaymentDetailsHeader";

interface PaymentDetailsModalProps {
  open: boolean;
  payment: PaymentWithDetails | null;
  editForm: Partial<PaymentWithDetails>;
  onClose: () => void;
  onSave: () => void;
  onMarkPaid?: (paymentId: string) => void;
  onRefund?: (paymentId: string) => void;
  onDownloadPdf?: (paymentId: string) => void;
  onInputChange: (
    field: keyof PaymentWithDetails,
    value: string | number | boolean | null
  ) => void;
  isLoading?: boolean;
}

export const PaymentDetailsModal: React.FC<PaymentDetailsModalProps> = ({
  open,
  payment,
  editForm,
  onClose,
  onSave,
  onMarkPaid,
  onRefund,
  onDownloadPdf,
  onInputChange,
  isLoading = false,
}) => {
  const [isEditMode, setIsEditMode] = useState(false);

  if (!payment) return null;

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
      <PaymentDetailsHeader payment={payment} onClose={handleClose} />

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
              <PaymentEditForm
                payment={payment}
                editForm={editForm}
                onInputChange={onInputChange}
              />
            ) : (
              <PaymentInfoSections payment={payment} layoutMode="main" />
            )}
          </Box>

          {/* Payment Information - Droite */}
          <Box
            sx={{
              width: { xs: "100%", md: "320px" },
              order: { xs: 1, md: 2 },
              flexShrink: 0,
            }}
          >
            {!isEditMode && (
              <PaymentInfoSections payment={payment} layoutMode="sidebar" />
            )}
          </Box>
        </Box>
      </DialogContent>

      <PaymentActions
        payment={payment}
        onClose={handleClose}
        onEditPayment={() => setIsEditMode(true)}
        onMarkPaid={onMarkPaid}
        onRefund={onRefund}
        onDownloadPdf={onDownloadPdf}
        onSaveEdit={isEditMode ? handleEditSave : undefined}
        onCancelEdit={isEditMode ? handleEditCancel : undefined}
        isEditMode={isEditMode}
        isLoading={isLoading}
      />
    </Dialog>
  );
};
