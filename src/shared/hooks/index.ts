// Hooks partagés pour l'architecture refactorisée
export { useFilters } from './useFilters';
export { useUINotifications } from './useUINotifications';
export { useExport } from './useExport';
export { useDataTable } from './useDataTable';
export { useAudit } from './useAudit';
export { useHighlightFromUrl } from './useHighlightFromUrl';

// ========================================
// 📊 NOUVEAUX HOOKS DATA - Cache partagé
// ========================================
// Hooks pour partager les données communes entre features
// Utilisent React Query pour un cache global automatique
export * from './data';

// Types partagés
export type { FilterState } from './useFilters';
export type { NotificationState } from './useUINotifications';
export type { AuditLogEntry, CreateAuditLogParams } from './useAudit';
export type { ExportOptions, ExportColumn } from './useExport';
export type { UseDataTableProps } from './useDataTable';
