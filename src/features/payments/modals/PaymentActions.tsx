import React from "react";
import {
  DialogActions,
  Button,
  Box,
  Tooltip,
  CircularProgress,
} from "@mui/material";
import {
  Edit as EditIcon,
  Save as SaveIcon,
  Cancel as CancelIcon,
  CheckCircle as CheckCircleIcon,
  Replay as RefundIcon,
  PictureAsPdf as PdfIcon,
  Close as CloseIcon,
} from "@mui/icons-material";
import { PaymentWithDetails } from "../../../types/payments";

interface PaymentActionsProps {
  payment: PaymentWithDetails;
  onClose: () => void;
  onEditPayment: () => void;
  onMarkPaid?: (paymentId: string) => void;
  onRefund?: (paymentId: string) => void;
  onDownloadPdf?: (paymentId: string) => void;
  onSaveEdit?: () => void;
  onCancelEdit?: () => void;
  isEditMode?: boolean;
  isLoading?: boolean;
}

export const PaymentActions: React.FC<PaymentActionsProps> = ({
  payment,
  onClose,
  onEditPayment,
  onMarkPaid,
  onRefund,
  onDownloadPdf,
  onSaveEdit,
  onCancelEdit,
  isEditMode = false,
  isLoading = false,
}) => {
  if (isEditMode) {
    return (
      <DialogActions sx={{ p: 3, gap: 1, justifyContent: "flex-end" }}>
        <Button
          onClick={onCancelEdit}
          startIcon={<CancelIcon />}
          color="inherit"
          disabled={isLoading}
        >
          Annuler
        </Button>

        <Button
          onClick={onSaveEdit}
          variant="contained"
          startIcon={isLoading ? <CircularProgress size={16} /> : <SaveIcon />}
          disabled={isLoading}
        >
          {isLoading ? "Sauvegarde..." : "Sauvegarder"}
        </Button>
      </DialogActions>
    );
  }

  return (
    <DialogActions sx={{ p: 3, gap: 1, flexWrap: "wrap", justifyContent: "flex-end" }}>
      {/* Marquer comme payé - uniquement pour les paiements en attente */}
      {payment.status === "pending" && onMarkPaid && (
        <Tooltip title="Marquer comme payé">
          <Button
            onClick={() => onMarkPaid(payment.id)}
            variant="contained"
            color="success"
            startIcon={<CheckCircleIcon />}
            size="small"
          >
            Marquer payé
          </Button>
        </Tooltip>
      )}

      {/* Rembourser - uniquement pour les paiements payés */}
      {payment.status === "paid" && onRefund && (
        <Tooltip title="Rembourser le paiement">
          <Button
            onClick={() => onRefund(payment.id)}
            variant="outlined"
            color="error"
            startIcon={<RefundIcon />}
            size="small"
          >
            Rembourser
          </Button>
        </Tooltip>
      )}

      {/* Télécharger PDF */}
      {onDownloadPdf && (
        <Tooltip title="Télécharger la facture en PDF">
          <Button
            onClick={() => onDownloadPdf(payment.id)}
            variant="outlined"
            color="secondary"
            startIcon={<PdfIcon />}
            size="small"
          >
            PDF
          </Button>
        </Tooltip>
      )}

      {/* Éditer */}
      <Tooltip title="Éditer le paiement">
        <Button
          onClick={onEditPayment}
          variant="outlined"
          startIcon={<EditIcon />}
          size="small"
        >
          Éditer
        </Button>
      </Tooltip>

      {/* Fermer */}
      <Button
        onClick={onClose}
        variant="outlined"
        startIcon={<CloseIcon />}
        color="inherit"
      >
        Fermer
      </Button>
    </DialogActions>
  );
};
