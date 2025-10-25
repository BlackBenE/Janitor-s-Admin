/**
 * Types pour les composants Data Table partagés
 *
 * Ces types définissent les interfaces pour les composants atomiques
 * de gestion de tableaux de données (search, tabs, table, container)
 */

import { ReactNode } from 'react';
import { SxProps, Theme } from '@mui/material';

// ======================== BASE TYPES ========================

/**
 * Props de base pour tous les composants data-table
 */
export interface BaseDataTableProps {
  /** Styles MUI personnalisés */
  sx?: SxProps<Theme>;
  /** Classes CSS personnalisées */
  className?: string;
}

// ======================== CONTAINER ========================

/**
 * Props pour le DataTableContainer
 * Wrapper visuel avec titre et description
 */
export interface DataTableContainerProps extends BaseDataTableProps {
  /** Titre principal de la section (ex: "Tous les utilisateurs") */
  title: string;
  /** Description de la section (ex: "Gérez les utilisateurs...") */
  description?: string;
  /** Contenu du container (filtres, tabs, tableau) */
  children: ReactNode;
  /** Niveau de titre HTML (h2, h3, h4, etc.) */
  titleLevel?: 'h2' | 'h3' | 'h4' | 'h5' | 'h6';
  /** Actions supplémentaires à afficher dans le header (boutons, etc.) */
  headerActions?: ReactNode;
}

// ======================== SEARCH ========================

/**
 * Configuration d'un filtre avancé
 */
export interface DataTableFilter {
  /** Clé unique du filtre */
  key: string;
  /** Label affiché */
  label: string;
  /** Type de filtre */
  type: 'text' | 'select' | 'date' | 'dateRange' | 'number' | 'numberRange';
  /** Valeur actuelle du filtre */
  value: any;
  /** Options pour les select */
  options?: Array<{ value: string | number; label: string }>;
  /** Placeholder */
  placeholder?: string;
}

/**
 * Props pour le DataTableSearch
 * Barre de recherche + filtres avancés
 */
export interface DataTableSearchProps extends BaseDataTableProps {
  /** Valeur de recherche actuelle */
  searchValue: string;
  /** Callback au changement de recherche */
  onSearchChange: (value: string) => void;
  /** Placeholder de la barre de recherche */
  searchPlaceholder?: string;
  /** Filtres avancés optionnels */
  filters?: DataTableFilter[];
  /** Callback au changement d'un filtre */
  onFilterChange?: (key: string, value: any) => void;
  /** Afficher le panneau de filtres avancés */
  showAdvancedFilters?: boolean;
  /** Callback pour reset tous les filtres */
  onResetFilters?: () => void;
}

// ======================== TABS ========================

/**
 * Configuration d'un onglet
 */
export interface DataTableTab {
  /** Clé unique de l'onglet */
  key: string;
  /** Label affiché */
  label: string;
  /** Icône optionnelle */
  icon?: ReactNode;
  /** Fonction pour filtrer les données de cet onglet */
  filterFn?: (item: any) => boolean;
  /** Valeur du badge (compteur) - peut être un nombre ou une fonction */
  badge?: number | ((data: any[]) => number);
  /** Couleur du badge */
  badgeColor?: 'default' | 'primary' | 'secondary' | 'error' | 'info' | 'success' | 'warning';
}

/**
 * Props pour le DataTableTabs
 * Onglets avec badges de comptage
 */
export interface DataTableTabsProps extends BaseDataTableProps {
  /** Configuration des onglets */
  tabs: DataTableTab[];
  /** Index de l'onglet actif */
  activeTab: number;
  /** Callback au changement d'onglet */
  onTabChange: (event: React.MouseEvent<HTMLElement>, newValue: number | null) => void;
  /** Données pour calculer les badges */
  data?: any[];
  /** Variant du ToggleButtonGroup */
  variant?: 'standard' | 'outlined';
  /** Taille des boutons */
  size?: 'small' | 'medium' | 'large';
}

// ======================== TABLE VIEW ========================

/**
 * Configuration d'une action en masse
 */
export interface DataTableBulkAction {
  /** Clé unique de l'action */
  key: string;
  /** Label affiché */
  label: string;
  /** Icône optionnelle */
  icon?: ReactNode;
  /** Callback à l'exécution */
  onClick: (selectedIds: string[]) => void;
  /** Couleur du bouton */
  color?: 'primary' | 'secondary' | 'error' | 'warning' | 'info' | 'success';
  /** Variante du bouton */
  variant?: 'text' | 'outlined' | 'contained';
  /** Désactivé */
  disabled?: boolean;
}

/**
 * Props pour le DataTableView
 * Tableau MUI DataGrid + pagination + actions
 */
export interface DataTableViewProps extends BaseDataTableProps {
  /** Colonnes du tableau (format MUI DataGrid) */
  columns: any[];
  /** Données à afficher */
  data: any[];
  /** État de chargement */
  loading?: boolean;
  /** Message d'état vide */
  emptyStateMessage?: string;
  /** Icône d'état vide */
  emptyStateIcon?: ReactNode;
  /** IDs des lignes sélectionnées */
  selectionModel?: string[];
  /** Callback au changement de sélection */
  onSelectionChange?: (selectedIds: string[]) => void;
  /** Callback pour vider la sélection */
  onClearSelection?: () => void;
  /** Actions en masse disponibles */
  bulkActions?: DataTableBulkAction[];
  /** Hauteur du tableau */
  height?: number | string;
  /** Pagination activée */
  pagination?: boolean;
  /** Taille de page par défaut */
  pageSize?: number;
  /** Options de taille de page */
  pageSizeOptions?: number[];
}

// ======================== SECTION (HOC) ========================

/**
 * Props pour le DataTableSection
 * Composant HOC qui combine tous les autres
 */
export interface DataTableSectionProps extends BaseDataTableProps {
  // Container props
  /** Titre de la section */
  title: string;
  /** Description de la section */
  description?: string;
  /** Actions dans le header */
  headerActions?: ReactNode;

  // Search props
  /** Valeur de recherche */
  searchValue: string;
  /** Callback recherche */
  onSearchChange: (value: string) => void;
  /** Placeholder recherche */
  searchPlaceholder?: string;
  /** Filtres avancés */
  filters?: DataTableFilter[];
  /** Callback filtres */
  onFilterChange?: (key: string, value: any) => void;

  // Tabs props
  /** Configuration des onglets */
  tabs?: DataTableTab[];
  /** Onglet actif */
  activeTab?: number;
  /** Callback tabs */
  onTabChange?: (event: React.MouseEvent<HTMLElement>, newValue: number | null) => void;

  // Table props
  /** Colonnes du tableau */
  columns: any[];
  /** Données du tableau */
  data: any[];
  /** Chargement */
  loading?: boolean;
  /** État vide */
  emptyStateMessage?: string;
  /** Sélection */
  selectionModel?: string[];
  /** Callback sélection */
  onSelectionChange?: (selectedIds: string[]) => void;
  /** Callback pour vider la sélection */
  onClearSelection?: () => void;
  /** Actions en masse */
  bulkActions?: DataTableBulkAction[];
}
