import { Database } from "./database.types";

// Base types from database
export type QuoteRequest =
  Database["public"]["Tables"]["service_requests"]["Row"];
export type QuoteRequestInsert =
  Database["public"]["Tables"]["service_requests"]["Insert"];
export type QuoteRequestUpdate =
  Database["public"]["Tables"]["service_requests"]["Update"];

// Profile type for relations
export interface QuoteRequestProfile {
  id: string;
  first_name: string | null;
  last_name: string | null;
  email: string;
  full_name: string | null;
  phone: string | null;
  role: string;
  avatar_url: string | null;
}

// Service type for relations
export interface QuoteRequestService {
  id: string;
  name: string;
  description: string | null;
  category: string;
  base_price: number;
  is_active: boolean | null;
  provider_id: string;
}

// Property type for relations
export interface QuoteRequestProperty {
  id: string;
  title: string;
  address: string;
  city: string;
  type: string | null;
}

// Extended Quote Request with joined data for display
export interface QuoteRequestWithDetails extends QuoteRequest {
  // Related requester (client)
  requester?: QuoteRequestProfile;

  // Related provider
  provider?: QuoteRequestProfile;

  // Related service
  service?: QuoteRequestService;

  // Related property
  property?: QuoteRequestProperty;
}

// Quote request status types for admin management
export type QuoteRequestStatus =
  | "pending"
  | "accepted"
  | "in_progress"
  | "completed"
  | "cancelled"
  | "rejected";

// Filter type for quote requests
export type QuoteRequestStatusFilter = "all" | QuoteRequestStatus;

// Filters interface for search and filtering
export interface QuoteRequestFilters {
  search: string;
  status: QuoteRequestStatusFilter;
  service: string;
  provider: string;
  requester: string;
  dateFrom: string;
  dateTo: string;
  minAmount: string;
  maxAmount: string;
}

// Statistics interface for dashboard
export interface QuoteRequestStats {
  totalRequests: number;
  pendingRequests: number;
  acceptedRequests: number;
  inProgressRequests: number;
  completedRequests: number;
  cancelledRequests: number;
  rejectedRequests: number;
  totalRevenue: number;
  averageAmount: number;
  averageCompletionTime: number; // in days
}

// Tab configuration for quote request statuses
export interface QuoteRequestTab {
  label: string;
  value: QuoteRequestStatusFilter;
  count?: number;
  color?: "primary" | "secondary" | "error" | "warning" | "info" | "success";
}

// Action interfaces for bulk operations
export interface QuoteRequestActionConfig {
  type: "approve" | "reject" | "assign" | "delete" | "export";
  label: string;
  icon: string;
  color: "primary" | "secondary" | "error" | "warning" | "info" | "success";
  requiresConfirmation?: boolean;
  confirmationMessage?: string;
}

// Notification state for quote request operations
export interface QuoteRequestNotificationState {
  open: boolean;
  message: string;
  severity: "success" | "error" | "warning" | "info";
}

// Priority levels for quote requests
export type QuoteRequestPriority = "low" | "medium" | "high" | "urgent";

// Categories available for services (can be extended from DB)
export const QUOTE_REQUEST_STATUSES: QuoteRequestTab[] = [
  { label: "Tous", value: "all", color: "primary" },
  { label: "En attente", value: "pending", color: "warning" },
  { label: "Acceptées", value: "accepted", color: "info" },
  { label: "En cours", value: "in_progress", color: "secondary" },
  { label: "Terminées", value: "completed", color: "success" },
  { label: "Annulées", value: "cancelled", color: "error" },
  { label: "Rejetées", value: "rejected", color: "error" },
];

// Bulk actions available for quote requests
export const QUOTE_REQUEST_ACTIONS: QuoteRequestActionConfig[] = [
  {
    type: "approve",
    label: "Approuver",
    icon: "CheckCircle",
    color: "success",
    requiresConfirmation: true,
    confirmationMessage: "Êtes-vous sûr de vouloir approuver ces demandes ?",
  },
  {
    type: "reject",
    label: "Rejeter",
    icon: "Cancel",
    color: "error",
    requiresConfirmation: true,
    confirmationMessage: "Êtes-vous sûr de vouloir rejeter ces demandes ?",
  },
  {
    type: "assign",
    label: "Assigner",
    icon: "Assignment",
    color: "primary",
  },
  {
    type: "delete",
    label: "Supprimer",
    icon: "Delete",
    color: "error",
    requiresConfirmation: true,
    confirmationMessage:
      "Êtes-vous sûr de vouloir supprimer définitivement ces demandes ?",
  },
  {
    type: "export",
    label: "Exporter",
    icon: "FileDownload",
    color: "secondary",
  },
];
