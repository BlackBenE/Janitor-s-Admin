import React from "react";
import {
  DialogTitle,
  Typography,
  IconButton,
  Box,
  Chip,
  Tooltip,
} from "@mui/material";
import {
  Close as CloseIcon,
  Payment as PaymentIcon,
  CheckCircle as CheckCircleIcon,
  Schedule as ScheduleIcon,
  Replay as RefundIcon,
  Warning as WarningIcon,
} from "@mui/icons-material";
import { PaymentWithDetails } from "../../../types/payments";

interface PaymentDetailsHeaderProps {
  payment: PaymentWithDetails;
  onClose: () => void;
}

const getStatusColor = (
  status: string
):
  | "default"
  | "primary"
  | "secondary"
  | "error"
  | "info"
  | "success"
  | "warning" => {
  switch (status?.toLowerCase()) {
    case "paid":
      return "success";
    case "pending":
      return "warning";
    case "refunded":
      return "error";
    case "failed":
      return "error";
    default:
      return "default";
  }
};

const getStatusIcon = (status: string) => {
  switch (status?.toLowerCase()) {
    case "paid":
      return <CheckCircleIcon fontSize="small" />;
    case "pending":
      return <ScheduleIcon fontSize="small" />;
    case "refunded":
      return <RefundIcon fontSize="small" />;
    case "failed":
      return <WarningIcon fontSize="small" />;
    default:
      return null;
  }
};

const formatCurrency = (amount: number): string => {
  return new Intl.NumberFormat("fr-FR", {
    style: "currency",
    currency: "EUR",
  }).format(amount);
};

export const PaymentDetailsHeader: React.FC<PaymentDetailsHeaderProps> = ({
  payment,
  onClose,
}) => {
  const invoiceId =
    payment.stripe_payment_intent_id || `INV-${payment.id.slice(-8)}`;
  const payerName = payment.payer
    ? `${payment.payer.first_name || ""} ${
        payment.payer.last_name || ""
      }`.trim()
    : "Client inconnu";

  return (
    <DialogTitle
      sx={{
        display: "flex",
        justifyContent: "space-between",
        alignItems: "center",
        bgcolor: "background.paper",
        borderBottom: 1,
        borderColor: "divider",
        py: 2,
      }}
    >
      <Box sx={{ display: "flex", alignItems: "center", gap: 2, flex: 1 }}>
        <PaymentIcon color="primary" fontSize="large" />

        <Box sx={{ flex: 1 }}>
          <Box sx={{ display: "flex", alignItems: "center", gap: 2, mb: 1 }}>
            <Typography variant="h6" component="h2" fontWeight="bold">
              {invoiceId}
            </Typography>

            <Chip
              icon={getStatusIcon(payment.status || "pending") || undefined}
              label={
                payment.status === "paid"
                  ? "Payé"
                  : payment.status === "pending"
                  ? "En attente"
                  : payment.status === "refunded"
                  ? "Remboursé"
                  : payment.status === "failed"
                  ? "Échoué"
                  : payment.status || "Statut inconnu"
              }
              color={getStatusColor(payment.status || "pending")}
              size="small"
              variant="outlined"
            />
          </Box>

          <Box sx={{ display: "flex", alignItems: "center", gap: 2 }}>
            <Typography variant="body2" color="text.secondary">
              {payerName}
            </Typography>
            <Typography variant="body2" color="text.secondary">
              •
            </Typography>
            <Typography variant="body1" fontWeight="medium" color="primary">
              {formatCurrency(payment.amount)}
            </Typography>
          </Box>
        </Box>
      </Box>

      <Tooltip title="Fermer">
        <IconButton onClick={onClose} edge="end">
          <CloseIcon />
        </IconButton>
      </Tooltip>
    </DialogTitle>
  );
};
