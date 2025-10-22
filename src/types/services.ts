import { Database } from "./database.types";

// Base Service type from database
export type Service = Database["public"]["Tables"]["services"]["Row"];
export type ServiceInsert = Database["public"]["Tables"]["services"]["Insert"];
export type ServiceUpdate = Database["public"]["Tables"]["services"]["Update"];

// Profile type for provider relations
export interface ServiceProvider {
  id: string;
  first_name: string | null;
  last_name: string | null;
  email: string;
  full_name: string | null;
  phone: string | null;
  role: string;
}

// Extended Service with joined data for display
export interface ServiceWithDetails extends Service {
  // Related provider
  provider?: ServiceProvider;

  // Calculated fields
  total_requests?: number;
  avg_rating?: number;
  active_providers?: number;
}

// Service status type
export type ServiceStatus = "active" | "inactive" | "pending" | "archived";

// Service filter type for tabs
export type ServiceStatusFilter = "all" | ServiceStatus;

export interface ServiceFilters {
  search: string;
  status: string;
  category: string;
  priceFrom: string;
  priceTo: string;
  provider: string;
  isVipOnly: boolean;
}

export interface ServiceStats {
  totalServices: number;
  activeServices: number;
  inactiveServices: number;
  pendingServices: number;
  archivedServices: number;
  totalProviders: number;
  totalCategories: number;
  averagePrice: number;
  totalRevenue: number;
}

export interface ServiceNotificationState {
  open: boolean;
  message: string;
  severity: "success" | "error" | "warning" | "info";
}

// Tab configuration for service statuses
export interface ServiceTab {
  label: string;
  status: ServiceStatusFilter;
  count?: number;
}

// Action interfaces
export interface ServiceActionConfig {
  type: "activate" | "deactivate" | "archive" | "view" | "edit" | "delete";
  label: string;
  icon: string;
  color?: "primary" | "success" | "warning" | "error";
  requiresConfirmation?: boolean;
  confirmationMessage?: string;
  permission?: string;
}

// Categories disponibles (peut être étendu depuis la DB)
export const SERVICE_CATEGORIES = [
  "Nettoyage",
  "Maintenance",
  "Jardinage",
  "Plomberie",
  "Électricité",
  "Peinture",
  "Ménage",
  "Conciergerie",
  "Sécurité",
  "Autre",
] as const;

export type ServiceCategory = (typeof SERVICE_CATEGORIES)[number];
