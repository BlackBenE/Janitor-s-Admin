// Configuration
export { USER_TABS, UserRole } from "../../types/userManagement";
export type { UserTab } from "../../types/userManagement";

// Main page component
export { UserManagementPage } from "./UserManagementPage";

// UserManagement modular components
export * from "./components";

// UserManagement hooks
export * from "./hooks";

// UserManagement modals
export * from "./modals";

// Legacy components (still used by page)
export { UserStatsCards } from "./UserStatsCards";
export { UserFiltersComponent } from "./UserFilters";
export { UserActions } from "./UserActions";
export { UserTabs } from "./UserTabs";
export { createUserTableColumns } from "./UserTableColumns";
