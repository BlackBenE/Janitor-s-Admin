/**
 * Data Table Components
 *
 * Composants atomiques pour construire des tableaux de données
 * avec recherche, filtres, onglets et actions en masse.
 *
 * ## Composants disponibles
 *
 * - **DataTableContainer**: Wrapper visuel avec titre et description
 * - **DataTableSearch**: Barre de recherche avec filtres avancés
 * - **DataTableTabs**: Onglets avec badges de comptage
 * - **DataTableView**: Tableau de données avec MUI DataGrid
 * - **DataTableSection**: HOC qui combine tous les composants
 *
 * ## Usage
 *
 * ### Approche Compositionnelle (Recommandée)
 * ```tsx
 * <DataTableContainer title="Titre" description="Description">
 *   <DataTableSearch searchValue={search} onSearchChange={setSearch} />
 *   <DataTableTabs tabs={tabs} activeTab={activeTab} onTabChange={setActiveTab} />
 *   <DataTableView columns={columns} data={data} />
 * </DataTableContainer>
 * ```
 *
 * ### Approche HOC (Pour cas simples)
 * ```tsx
 * <DataTableSection
 *   title="Titre"
 *   searchValue={search}
 *   onSearchChange={setSearch}
 *   tabs={tabs}
 *   activeTab={activeTab}
 *   onTabChange={setActiveTab}
 *   columns={columns}
 *   data={data}
 * />
 * ```
 */

// Types
export * from './data-table.types';

// Composants atomiques
export { DataTableContainer } from './DataTableContainer/DataTableContainer';
export { DataTableSearch } from './DataTableSearch/DataTableSearch';
export { DataTableTabs } from './DataTableTabs/DataTableTabs';
export { DataTableView } from './DataTableView/DataTableView';

// HOC
export { DataTableSection } from './DataTableSection/DataTableSection';
