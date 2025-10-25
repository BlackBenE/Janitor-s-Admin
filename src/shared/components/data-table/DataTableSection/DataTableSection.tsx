/**
 * DataTableSection Component (HOC)
 *
 * Composant de haut niveau qui combine Container, Search, Tabs et View.
 * Utile pour les cas simples où vous voulez tout en un.
 *
 * Pour plus de flexibilité, utilisez les composants individuels directement.
 *
 * @example
 * ```tsx
 * <DataTableSection
 *   // Container
 *   title="Tous les utilisateurs"
 *   description="Gérez les utilisateurs de toutes les catégories..."
 *
 *   // Search
 *   searchValue={filters.search}
 *   onSearchChange={(value) => updateFilter('search', value)}
 *
 *   // Tabs
 *   tabs={USER_TABS}
 *   activeTab={activeTab}
 *   onTabChange={setActiveTab}
 *
 *   // Table
 *   columns={userColumns}
 *   data={filteredUsers}
 *   loading={isLoading}
 * />
 * ```
 */

import React from 'react';
import { DataTableContainer } from '../DataTableContainer/DataTableContainer';
import { DataTableSearch } from '../DataTableSearch/DataTableSearch';
import { DataTableTabs } from '../DataTableTabs/DataTableTabs';
import { DataTableView } from '../DataTableView/DataTableView';
import { DataTableSectionProps } from '../data-table.types';

export const DataTableSection: React.FC<DataTableSectionProps> = ({
  // Container props
  title,
  description,
  headerActions,

  // Search props
  searchValue,
  onSearchChange,
  searchPlaceholder,
  filters,
  onFilterChange,

  // Tabs props
  tabs,
  activeTab = 0,
  onTabChange,

  // Table props
  columns,
  data,
  loading,
  emptyStateMessage,
  selectionModel,
  onSelectionChange,
  bulkActions,

  // Base props
  sx,
  className,
}) => {
  // Déterminer les données à afficher selon l'onglet actif
  const getFilteredDataByTab = (): any[] => {
    if (!tabs || tabs.length === 0) {
      return data;
    }

    const currentTab = tabs[activeTab];
    if (!currentTab?.filterFn) {
      return data;
    }

    return data.filter(currentTab.filterFn);
  };

  const tabFilteredData = getFilteredDataByTab();

  return (
    <DataTableContainer
      title={title}
      description={description}
      headerActions={headerActions}
      className={className}
      sx={sx}
    >
      {/* Search Bar + Filters */}
      <DataTableSearch
        searchValue={searchValue}
        onSearchChange={onSearchChange}
        searchPlaceholder={searchPlaceholder}
        filters={filters}
        onFilterChange={onFilterChange}
        showAdvancedFilters={filters && filters.length > 0}
      />

      {/* Tabs (if provided) */}
      {tabs && tabs.length > 0 && onTabChange && (
        <DataTableTabs
          tabs={tabs}
          activeTab={activeTab}
          onTabChange={onTabChange}
          data={data} // Données complètes pour les compteurs
        />
      )}

      {/* Data Table */}
      <DataTableView
        columns={columns}
        data={tabFilteredData} // Données filtrées par onglet
        loading={loading}
        emptyStateMessage={emptyStateMessage}
        selectionModel={selectionModel}
        onSelectionChange={onSelectionChange}
        bulkActions={bulkActions}
      />
    </DataTableContainer>
  );
};
