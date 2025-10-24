// Composants partagés pour l'architecture refactorisée
export { FilterPanel } from "./FilterPanel";
export { ActionToolbar } from "./ActionToolbar";
export { StatsCardGrid } from "./StatsCardGrid";
export { GenericFilters } from "./GenericFilters";
export { GenericTabs } from "./GenericTabs";
export { LoadingIndicator } from "./LoadingIndicator";

// Configurations de filtres
export {
  userFilterConfigs,
  propertyFilterConfigs,
  invoiceFilterConfigs,
  paymentFilterConfigs,
} from "./filterConfigs";

// Configurations de tabs
export {
  userTabConfigs,
  propertyTabConfigs,
  paymentTabConfigs,
  serviceTabConfigs,
  getUserCount,
  getPropertyCount,
  getPaymentCount,
  getServiceCount,
} from "./tabConfigs";

// Types de statuts (définis dans les types domaines respectifs)
// PaymentStatus défini dans types/payments.ts
// ServiceStatusFilter défini dans types/services.ts

// Types partagés
export type { FilterOption, FilterConfig } from "./FilterPanel";
export type { BulkAction } from "./ActionToolbar";
export type { StatCard } from "./StatsCardGrid";
export type {
  FilterConfig as GenericFilterConfig,
  GenericFiltersProps,
} from "./GenericFilters";
export type { TabConfig, GenericTabsProps } from "./GenericTabs";
