import { Database } from "./database.types";

// Base Payment type from database
export type Payment = Database["public"]["Tables"]["payments"]["Row"];
export type PaymentInsert = Database["public"]["Tables"]["payments"]["Insert"];
export type PaymentUpdate = Database["public"]["Tables"]["payments"]["Update"];

// Extended Payment with joined data for display
export interface PaymentWithDetails extends Payment {
  // Related data from joins
  payer?: {
    first_name?: string;
    last_name?: string;
    email?: string;
  };
  payee?: {
    first_name?: string;
    last_name?: string;
    email?: string;
  };
  booking?: {
    id: string;
    property?: {
      title?: string;
      address?: string;
      city?: string;
    };
  };
  service_request?: {
    id: string;
    service?: {
      title?: string;
      description?: string;
    };
  };
}

// Payment status enum based on database values
export enum PaymentStatus {
  ALL = "ALL",
  PENDING = "pending",
  PAID = "paid",
  REFUNDED = "refunded",
}

export interface PaymentFilters {
  search: string;
  status: string;
  dateFrom: string;
  dateTo: string;
  minAmount: string;
  maxAmount: string;
  paymentType: string;
}

export interface PaymentStats {
  totalPayments: number;
  paidPayments: number;
  pendingPayments: number;
  refundedPayments: number;
  monthlyRevenue: number;
  averageAmount: number;
}

export interface PaymentNotificationState {
  open: boolean;
  message: string;
  severity: "success" | "error" | "warning" | "info";
}

// Tab configuration for payment statuses
export interface PaymentTab {
  label: string;
  status: PaymentStatus;
  count?: number;
}

// Action interfaces
export interface PaymentActionConfig {
  type: "mark-paid" | "refund" | "resend" | "view" | "edit";
  label: string;
  icon: string;
  color?: "primary" | "success" | "warning" | "error";
  requiresConfirmation?: boolean;
  confirmationMessage?: string;
  permission?: string;
}

// Legacy Invoice types for backward compatibility (to be phased out)
export type Invoice = PaymentWithDetails;
export type InvoiceFilters = PaymentFilters;
export type InvoiceStats = PaymentStats;
export type InvoiceStatus = PaymentStatus;
export type InvoiceNotificationState = PaymentNotificationState;
export type InvoiceTab = PaymentTab;
export type InvoiceActionConfig = PaymentActionConfig;
