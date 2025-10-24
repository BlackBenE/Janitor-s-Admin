/**
 * Point d'entrée pour tous les utilitaires
 * Centralise l'export de tous les utils pour faciliter les imports
 */

// Formatage
export * from './formatting';

// Validation
export * from './validation';

// Manipulation de données
export * from './dataHelpers';

// Constantes
export * from './constants';

// Statuts et couleurs
export * from './statusHelpers';

// Métriques utilisateurs (standardisation)
export * from './userMetrics';

// Types utilitaires communs
export interface SelectOption {
  value: string;
  label: string;
  disabled?: boolean;
  icon?: string;
}

export interface PaginationConfig {
  page: number;
  size: number;
  total: number;
}

export interface SortConfig<T> {
  field: keyof T;
  direction: 'asc' | 'desc';
}

export interface FilterConfig<T> {
  field: keyof T;
  operator: 'equals' | 'contains' | 'startsWith' | 'greaterThan' | 'lessThan' | 'between';
  value: any;
}

export interface ApiResponse<T> {
  success: boolean;
  data?: T;
  error?: string;
  message?: string;
}

export interface TableColumn<T> {
  field: keyof T;
  headerName: string;
  width?: number;
  sortable?: boolean;
  filterable?: boolean;
  formatter?: (value: any) => string;
}

// Types pour les statistiques
export interface StatItem {
  label: string;
  value: number | string;
  change?: number;
  trend?: 'up' | 'down' | 'stable';
  color?: string;
}

// Types pour les notifications
export interface NotificationItem {
  id: string;
  type: 'success' | 'error' | 'warning' | 'info';
  title: string;
  message: string;
  timestamp: Date;
  read?: boolean;
}

// Types pour les actions
export interface ActionItem {
  id: string;
  label: string;
  icon?: string;
  color?: string;
  disabled?: boolean;
  onClick: () => void;
}
