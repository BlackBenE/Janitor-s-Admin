// Hooks partagés pour l'architecture refactorisée
export { useFilters } from "./useFilters";
export { useNotifications } from "./useNotifications";
export { useUINotifications } from "./useUINotifications";
export { useExport } from "./useExport";
export { useDataTable } from "./useDataTable";
export { useAudit } from "./useAudit";

// Types partagés
export type { FilterState } from "./useFilters";
export type { NotificationState } from "./useUINotifications";
export type { AuditLogEntry, CreateAuditLogParams } from "./useAudit";
export type { ExportOptions, ExportColumn } from "./useExport";
export type { UseDataTableProps } from "./useDataTable";
export type {
  NotificationStats,
  NotificationSummary,
  NotificationGroup,
  CreateNotificationData,
  BulkNotificationAction,
} from "./useNotifications";
