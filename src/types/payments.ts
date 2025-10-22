import { Database } from "./database.types";

// Base Payment type from database
export type Payment = Database["public"]["Tables"]["payments"]["Row"];
export type PaymentInsert = Database["public"]["Tables"]["payments"]["Insert"];
export type PaymentUpdate = Database["public"]["Tables"]["payments"]["Update"];

// Profile type extracted for relations
export interface PaymentProfile {
  id: string;
  first_name: string | null;
  last_name: string | null;
  email: string;
  full_name: string | null;
  phone: string | null;
}

// Property type for booking relations
export interface PaymentProperty {
  id: string;
  title: string | null;
  address: string | null;
  city: string | null;
}

// Service type for service request relations
export interface PaymentService {
  id: string;
  title: string | null;
  description: string | null;
}

// Booking with property relation
export interface PaymentBooking {
  id: string;
  check_in: string;
  check_out: string;
  total_amount: number;
  status: string | null;
  property?: PaymentProperty;
}

// Service request with service relation
export interface PaymentServiceRequest {
  id: string;
  requested_date: string;
  status: string | null;
  total_amount: number;
  address: string | null;
  service?: PaymentService;
}

// Extended Payment with joined data for display
export interface PaymentWithDetails extends Payment {
  // Related profiles
  payer?: PaymentProfile;
  payee?: PaymentProfile;

  // Related booking with property
  booking?: PaymentBooking;

  // Related service request with service
  service_request?: PaymentServiceRequest;
}

// Payment status type based on database values
export type PaymentStatus =
  | "pending"
  | "paid"
  | "refunded"
  | "failed"
  | "succeeded";

// Status for tabs (including "all" for filtering)
export type PaymentStatusFilter = "all" | PaymentStatus;

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
  failedPayments: number;
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
