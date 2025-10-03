// Composants partagés pour l'architecture refactorisée
export { FilterPanel } from "./FilterPanel";
export { ActionToolbar } from "./ActionToolbar";
export { StatsCardGrid } from "./StatsCardGrid";
export { GenericFilters } from "./GenericFilters";
export { GenericTabs } from "./GenericTabs";

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
  getUserCount,
  getPropertyCount,
} from "./tabConfigs";

// Types partagés
export type { FilterOption, FilterConfig } from "./FilterPanel";
export type { BulkAction } from "./ActionToolbar";
export type { StatCard } from "./StatsCardGrid";
export type {
  FilterConfig as GenericFilterConfig,
  GenericFiltersProps,
} from "./GenericFilters";
export type { TabConfig, GenericTabsProps } from "./GenericTabs";
