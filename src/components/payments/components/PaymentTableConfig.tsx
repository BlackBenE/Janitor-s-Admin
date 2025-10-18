import React from "react";
import { Box, Chip, Tooltip } from "@mui/material";
import {
  Visibility as ViewIcon,
  PictureAsPdf as PdfIcon,
  CheckCircle as CheckCircleIcon,
  Schedule as ScheduleIcon,
  Replay as RefundIcon,
  Warning as WarningIcon,
} from "@mui/icons-material";
import { GridRenderCellParams } from "@mui/x-data-grid";
import {
  GenericTableConfig,
  BaseItem,
  GenericAction,
  ColumnConfig,
} from "../../shared/GenericTableColumns";
import { PaymentWithDetails } from "../../../types/payments";

// =====================================================
// TYPES SPÉCIFIQUES AUX FACTURES
// =====================================================

export interface InvoiceItem extends BaseItem {
  invoice_id: string;
  provider_name: string;
  service_name: string;
  client_name: string;
  amount: number;
  status: string;
  due_date: string;
  created_at: string;
}

export interface InvoiceTableConfig {
  selectedInvoices: string[];
  onToggleInvoiceSelection: (invoiceId: string) => void;
  onViewDetails: (invoice: InvoiceItem) => void;
  onDownloadPdf: (invoiceId: string) => void;
  onMarkPaid?: (invoiceId: string) => void;
  onRefund?: (invoiceId: string) => void;
  isMarkPaidPending?: boolean;
  isRefundPending?: boolean;
}

// =====================================================
// UTILITAIRES
// =====================================================

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
    case "overdue":
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
    case "overdue":
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

const formatDate = (dateString: string | null): string => {
  if (!dateString) return "N/A";
  return new Date(dateString).toLocaleDateString("fr-FR");
};

const isOverdue = (dueDateString: string, status: string): boolean => {
  if (status === "paid" || status === "refunded") return false;
  if (!dueDateString) return false;

  const dueDate = new Date(dueDateString);
  const now = new Date();
  return dueDate < now;
};

// =====================================================
// TRANSFORMATION DES DONNÉES
// =====================================================

export const transformPaymentsForTable = (
  payments: PaymentWithDetails[]
): InvoiceItem[] => {
  return payments.map((payment) => ({
    id: payment.id,
    invoice_id:
      payment.stripe_payment_intent_id || `INV-${payment.id.slice(-8)}`,
    provider_name: payment.payee
      ? `${payment.payee.first_name || ""} ${
          payment.payee.last_name || ""
        }`.trim() || "N/A"
      : "N/A",
    service_name: payment.service_request?.service?.title || "Service général",
    client_name: payment.payer
      ? `${payment.payer.first_name || ""} ${
          payment.payer.last_name || ""
        }`.trim() || "Client"
      : "Client",
    amount: payment.amount,
    status: payment.status || "pending",
    due_date: payment.created_at
      ? new Date(
          new Date(payment.created_at).getTime() + 30 * 24 * 60 * 60 * 1000
        ).toISOString()
      : new Date().toISOString(),
    created_at: payment.created_at || new Date().toISOString(),
  }));
};

// =====================================================
// CONFIGURATION DES COLONNES
// =====================================================

const createInvoiceColumns = (config: InvoiceTableConfig): ColumnConfig[] => [
  {
    field: "invoice_id",
    headerName: "Invoice ID",
    width: 140,
    flex: 0,
    renderCell: (params: GridRenderCellParams) => (
      <Box sx={{ fontFamily: "monospace", fontWeight: "medium" }}>
        {params.row.invoice_id}
      </Box>
    ),
  },
  {
    field: "provider_name",
    headerName: "Prestataire",
    width: 160,
    flex: 1,
    renderCell: (params: GridRenderCellParams) => (
      <Box>
        <Box sx={{ fontWeight: "medium" }}>{params.row.provider_name}</Box>
      </Box>
    ),
  },
  {
    field: "service_name",
    headerName: "Service",
    width: 180,
    flex: 1,
    renderCell: (params: GridRenderCellParams) => (
      <Box sx={{ color: "text.secondary" }}>{params.row.service_name}</Box>
    ),
  },
  {
    field: "client_name",
    headerName: "Client",
    width: 160,
    flex: 1,
    renderCell: (params: GridRenderCellParams) => (
      <Box>
        <Box sx={{ fontWeight: "medium" }}>{params.row.client_name}</Box>
      </Box>
    ),
  },
  {
    field: "amount",
    headerName: "Montant",
    width: 120,
    flex: 0,
    valueGetter: (value: number) => value,
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
    flex: 0,
    valueGetter: (value: string) =>
      value?.charAt(0).toUpperCase() + value?.slice(1) || "Pending",
    renderCell: (params: GridRenderCellParams) => {
      const status = params.row.status;
      const overdue = isOverdue(params.row.due_date, status);

      return (
        <Chip
          label={
            overdue && status === "pending"
              ? "En retard"
              : status === "paid"
              ? "Payé"
              : status === "pending"
              ? "En attente"
              : status === "refunded"
              ? "Remboursé"
              : status
          }
          color={
            overdue && status === "pending" ? "error" : getStatusColor(status)
          }
          size="small"
          variant="outlined"
        />
      );
    },
  },
  {
    field: "due_date",
    headerName: "Échéance",
    width: 120,
    flex: 0,
    valueGetter: (value: string) => formatDate(value),
    renderCell: (params: GridRenderCellParams) => {
      const overdue = isOverdue(params.row.due_date, params.row.status);

      return (
        <Box
          sx={{
            color: overdue ? "error.main" : "text.primary",
            fontWeight: overdue ? "medium" : "normal",
          }}
        >
          {formatDate(params.row.due_date)}
        </Box>
      );
    },
  },
];

// =====================================================
// CONFIGURATION DES ACTIONS
// =====================================================

// eslint-disable-next-line @typescript-eslint/no-explicit-any
const createInvoiceActions = (config: InvoiceTableConfig): GenericAction[] => {
  const actions: GenericAction[] = [
    {
      id: "view",
      label: "Voir détails",
      icon: ViewIcon,
      color: "primary",
      tooltip: "Voir les détails de la facture",
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      onClick: (item: any) => config.onViewDetails(item as InvoiceItem),
    },
    {
      id: "download-pdf",
      label: "Télécharger PDF",
      icon: PdfIcon,
      color: "secondary",
      tooltip: "Télécharger la facture en PDF",
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      onClick: (item: any) => config.onDownloadPdf(item.id),
    },
  ];

  // Actions conditionnelles selon le statut
  if (config.onMarkPaid) {
    actions.push({
      id: "mark-paid",
      label: "Marquer comme payé",
      icon: CheckCircleIcon,
      color: "success",
      tooltip: "Marquer comme payé",
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      onClick: (item: any) => config.onMarkPaid?.(item.id),
      disabled: () => config.isMarkPaidPending || false,
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      visible: (item: any) => {
        const invoice = item as InvoiceItem;
        return invoice.status === "pending";
      },
    });
  }

  if (config.onRefund) {
    actions.push({
      id: "refund",
      label: "Rembourser",
      icon: RefundIcon,
      color: "error",
      tooltip: "Rembourser le paiement",
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      onClick: (item: any) => config.onRefund?.(item.id),
      disabled: () => config.isRefundPending || false,
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      visible: (item: any) => {
        const invoice = item as InvoiceItem;
        return invoice.status === "paid";
      },
    });
  }

  return actions;
};

// =====================================================
// FONCTION PRINCIPALE
// =====================================================

export const createPaymentTableConfig = (
  config: InvoiceTableConfig
): GenericTableConfig => ({
  selectable: true,
  selectedItems: config.selectedInvoices,
  onToggleSelection: config.onToggleInvoiceSelection,

  columns: createInvoiceColumns(config),
  primaryActions: createInvoiceActions(config),

  actionColumnWidth: 160,
  showActionsMenu: false, // Actions visibles directement
});
