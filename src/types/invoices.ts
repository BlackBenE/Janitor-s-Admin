// Legacy invoice types - kept for backward compatibility
// For new code, use Payment types from payments.ts

export enum InvoiceStatus {
  ALL = "ALL",
  PENDING = "PENDING",
  PAID = "PAID",
  OVERDUE = "OVERDUE",
  CANCELLED = "CANCELLED",
}

// Legacy Invoice type (use PaymentWithDetails for new code)
export interface Invoice {
  id: string;
  invoice_number?: string;
  amount: number;
  currency?: string;
  status: string;
  due_date?: string;
  issued_date?: string;
  paid_date?: string;
  description?: string;
  payment_method?: string;
  property?: {
    title?: string;
  };
  owner?: {
    full_name?: string;
  };
}

export interface InvoiceFilters {
  search: string;
  status: string;
  dateFrom: string;
  dateTo: string;
  minAmount: string;
  maxAmount: string;
  paymentMethod: string;
}

export interface InvoiceStats {
  totalInvoices: number;
  paidInvoices: number;
  pendingPayments: number;
  monthlyRevenue: number;
  overdueInvoices: number;
  averageAmount: number;
}

export interface InvoiceNotificationState {
  open: boolean;
  message: string;
  severity: "success" | "error" | "warning" | "info";
}

// Tab configuration for invoice statuses
export interface InvoiceTab {
  label: string;
  status: InvoiceStatus;
  count?: number;
}

// Action interfaces
export interface InvoiceActionConfig {
  type: "mark-paid" | "send-reminder" | "cancel" | "edit" | "view";
  label: string;
  icon: string;
  color?: "primary" | "success" | "warning" | "error";
  requiresConfirmation?: boolean;
  confirmationMessage?: string;
  permission?: string;
}
