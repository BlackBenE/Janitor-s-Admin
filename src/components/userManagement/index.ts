// Configuration
export { USER_TABS, UserRole } from "../../types/userManagement";
export type { UserTab } from "../../types/userManagement";

// Composants principaux
export { default as UserManagementPage } from "./UserManagementPage";
export { UserStatsCards } from "./UserStatsCards";
export { UserFiltersComponent } from "./UserFilters";
export { UserActions } from "./UserActions";
export { UserTabs } from "./UserTabs";

// Colonnes et logique
export { createUserTableColumns } from "./UserTableColumns";

// Hooks
export { useUserActions } from "./hooks/useUserActions";
export { useModalHandlers } from "./hooks/useModalHandlers";

// Modales
export * from "./modals";
