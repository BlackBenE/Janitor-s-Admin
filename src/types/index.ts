// =====================================================
// MAIN TYPES EXPORT INDEX - Types Supabase UNIQUEMENT
// =====================================================

// Types Supabase de base (directement depuis la DB)
export type {
  Property,
  Booking,
  Payment,
  Subscription,
  Profile,
  ServiceRequest,
} from "./supabase";

// Database Types complets
export type { Database, Tables } from "./database.types";

// Types domaine spécifiques (seulement ceux qui ajoutent de la valeur)
export type {
  PropertyWithOwner,
  PropertyTab,
  PropertyFilters,
  PropertyStats,
  PropertyAdminAction,
  PropertyModerationData,
  PropertyNotificationState,
  ValidationStatus,
} from "./propertyApprovals";

export { PropertyStatus, PROPERTY_TABS } from "./propertyApprovals";

// Types User Management
export type {
  UserPreferences,
  UserActivity,
  UserStats,
  UserAdditionalData,
} from "./userManagement";

// Types domaine Services
export type {
  ServiceWithDetails,
  ServiceFilters,
  ServiceStats,
  ServiceStatusFilter,
  ServiceStatus,
  ServiceNotificationState,
  ServiceTab,
  ServiceActionConfig,
  ServiceCategory,
  ServiceProvider,
} from "./services";

export { SERVICE_CATEGORIES } from "./services";

// Types domaine Quote Requests
export type {
  QuoteRequest,
  QuoteRequestInsert,
  QuoteRequestUpdate,
  QuoteRequestWithDetails,
  QuoteRequestProfile,
  QuoteRequestService,
  QuoteRequestProperty,
  QuoteRequestStatus,
  QuoteRequestStatusFilter,
  QuoteRequestFilters,
  QuoteRequestStats,
  QuoteRequestTab,
  QuoteRequestActionConfig,
  QuoteRequestNotificationState,
  QuoteRequestPriority,
} from "./quoteRequests";

export { QUOTE_REQUEST_STATUSES, QUOTE_REQUEST_ACTIONS } from "./quoteRequests";
