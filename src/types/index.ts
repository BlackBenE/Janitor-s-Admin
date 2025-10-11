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

// Types composants/UI seulement
export type {
  FinancialFilters,
  FinancialOverviewState,
  FinancialMetricsCardProps,
  FinancialChartProps,
  TransactionTableProps,
} from "./financialoverview";
