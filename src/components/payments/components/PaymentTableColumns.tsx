import React from "react";
import { Box, Chip, Checkbox } from "@mui/material";
import { GridRenderCellParams, GridColDef } from "@mui/x-data-grid";
import { PaymentWithDetails } from "../../../types/payments";
import { PaymentTableActions } from "./PaymentTableActions";

interface PaymentTableColumnsProps {
  selectedPayments: string[];
  onTogglePaymentSelection: (paymentId: string) => void;
  onViewDetails: (payment: PaymentWithDetails) => void;
  onDownloadPdf: (paymentId: string) => void;
  onMarkPaid: (paymentId: string) => void;
  onRefund: (paymentId: string) => void;
  onRetry: (paymentId: string) => void;
  highlightId?: string; // Pour l'highlighting depuis le dashboard
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
    case "success":
    case "succeeded":
      return "success";
    case "pending":
    case "processing":
      return "warning";
    case "refunded":
    case "refund":
      return "info";
    case "failed":
    case "error":
    case "cancelled":
      return "error";
    default:
      return "default";
  }
};

const getPaymentTypeColor = (
  paymentType: string
):
  | "default"
  | "primary"
  | "secondary"
  | "error"
  | "info"
  | "success"
  | "warning" => {
  switch (paymentType?.toLowerCase()) {
    case "booking":
    case "reservation":
      return "primary";
    case "service":
    case "maintenance":
      return "info";
    case "subscription":
    case "abonnement":
      return "success";
    case "refund":
    case "remboursement":
      return "warning";
    case "fee":
    case "frais":
      return "secondary";
    case "commission":
      return "error";
    default:
      return "default";
  }
};

const getStatusLabel = (status: string): string => {
  switch (status?.toLowerCase()) {
    case "paid":
      return "Payé";
    case "succeeded":
    case "success":
      return "Réussi";
    case "pending":
    case "processing":
      return "En attente";
    case "refunded":
    case "refund":
      return "Remboursé";
    case "failed":
    case "error":
    case "cancelled":
      return "Échoué";
    default:
      return status || "Inconnu";
  }
};

const formatCurrency = (amount: number): string => {
  return new Intl.NumberFormat("fr-FR", {
    style: "currency",
    currency: "EUR",
  }).format(amount);
};

const formatDate = (dateString: string | null): string => {
  if (!dateString) return "N/A";
  return new Date(dateString).toLocaleDateString("fr-FR");
};

// Composant pour la cellule de sélection
const SelectCell: React.FC<{
  params: GridRenderCellParams;
  selectedPayments: string[];
  onTogglePaymentSelection: (paymentId: string) => void;
}> = ({ params, selectedPayments, onTogglePaymentSelection }) => (
  <Checkbox
    checked={selectedPayments.includes(params.row.id)}
    onChange={() => onTogglePaymentSelection(params.row.id)}
    size="small"
    onClick={(e) => e.stopPropagation()}
  />
);

export const createPaymentTableColumns = ({
  selectedPayments,
  onTogglePaymentSelection,
  onViewDetails,
  onDownloadPdf,
  onMarkPaid,
  onRefund,
  onRetry,
  highlightId,
}: PaymentTableColumnsProps): GridColDef[] => [
  {
    field: "select",
    headerName: "",
    width: 50,
    sortable: false,
    filterable: false,
    renderCell: (params: GridRenderCellParams) => (
      <SelectCell
        params={params}
        selectedPayments={selectedPayments}
        onTogglePaymentSelection={onTogglePaymentSelection}
      />
    ),
  },
  {
    field: "invoice_id",
    headerName: "Invoice ID",
    width: 140,
    renderCell: (params: GridRenderCellParams) => (
      <Box sx={{ fontFamily: "monospace", fontWeight: "medium" }}>
        {params.row.stripe_payment_intent_id ||
          `INV-${params.row.id.slice(-8)}`}
      </Box>
    ),
  },
  {
    field: "provider_name",
    headerName: "Prestataire",
    minWidth: 160,
    flex: 1,
    renderCell: (params: GridRenderCellParams) => {
      // Si c'est une subscription, c'est toujours Paris Janitor
      if (params.row.payment_type === "subscription") {
        return (
          <Box>
            <Box sx={{ fontWeight: "medium" }}>Paris Janitor</Box>
          </Box>
        );
      }

      const payee = params.row.payee;
      const name = payee
        ? `${payee.first_name || ""} ${payee.last_name || ""}`.trim()
        : "N/A";
      return (
        <Box>
          <Box sx={{ fontWeight: "medium" }}>{name}</Box>
        </Box>
      );
    },
  },
  {
    field: "service_name",
    headerName: "Service",
    minWidth: 180,
    renderCell: (params: GridRenderCellParams) => {
      const paymentType = params.row.payment_type || "N/A";
      return (
        <Chip
          label={paymentType}
          size="small"
          color={getPaymentTypeColor(paymentType)}
          sx={{
            fontWeight: 500,
            textTransform: "capitalize",
          }}
        />
      );
    },
  },
  {
    field: "client_name",
    headerName: "Client",
    minWidth: 160,
    renderCell: (params: GridRenderCellParams) => {
      const payer = params.row.payer;
      const name = payer
        ? `${payer.first_name || ""} ${payer.last_name || ""}`.trim()
        : "Client";
      return (
        <Box>
          <Box sx={{ fontWeight: "medium" }}>{name}</Box>
        </Box>
      );
    },
  },
  {
    field: "amount",
    headerName: "Montant",
    width: 120,
    renderCell: (params: GridRenderCellParams) => (
      <Box sx={{ fontWeight: "medium", textAlign: "right" }}>
        {formatCurrency(params.row.amount)}
      </Box>
    ),
  },
  {
    field: "status",
    headerName: "Statut",
    width: 130,
    renderCell: (params: GridRenderCellParams) => {
      const status = params.row.status;
      const dueDate = params.row.created_at
        ? new Date(
            new Date(params.row.created_at).getTime() + 30 * 24 * 60 * 60 * 1000
          )
        : new Date();
      const isOverdue = status === "pending" && dueDate < new Date();

      return (
        <Chip
          label={isOverdue ? "En retard" : getStatusLabel(status)}
          color={isOverdue ? "error" : getStatusColor(status)}
          size="small"
          variant="filled"
        />
      );
    },
  },
  {
    field: "due_date",
    headerName: "Échéance",
    width: 120,
    renderCell: (params: GridRenderCellParams) => {
      const dueDate = params.row.created_at
        ? new Date(
            new Date(params.row.created_at).getTime() + 30 * 24 * 60 * 60 * 1000
          )
        : new Date();
      const isOverdue = params.row.status === "pending" && dueDate < new Date();

      return (
        <Box
          sx={{
            color: isOverdue ? "error.main" : "text.primary",
            fontWeight: isOverdue ? "medium" : "normal",
          }}
        >
          {formatDate(dueDate.toISOString())}
        </Box>
      );
    },
  },
  {
    field: "actions",
    headerName: "Actions",
    width: 200,
    sortable: false,
    filterable: false,
    renderCell: (params: GridRenderCellParams) => (
      <PaymentTableActions
        params={params}
        onViewDetails={onViewDetails}
        onDownloadPdf={onDownloadPdf}
        onMarkPaid={onMarkPaid}
        onRefund={onRefund}
        onRetry={onRetry}
      />
    ),
  },
];
