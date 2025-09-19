import { useState } from "react";
import { GridColDef, GridRowSelectionModel } from "@mui/x-data-grid";

export interface UseDataTableProps<T> {
  data: T[];
  columns: GridColDef[];
  enableSelection?: boolean;
  enablePagination?: boolean;
  pageSize?: number;
}

/**
 * Hook universel pour la gestion des DataTables
 * Standardise la configuration et les actions communes
 */
export const useDataTable = <T extends { id: string }>({
  data,
  columns,
  enableSelection = true,
  enablePagination = true,
  pageSize = 25,
}: UseDataTableProps<T>) => {
  const [selectedRows, setSelectedRows] = useState<string[]>([]);
  const [page, setPage] = useState(0);
  const [currentPageSize, setCurrentPageSize] = useState(pageSize);

  // Gestion de la sélection
  const handleSelectionChange = (selection: GridRowSelectionModel) => {
    const selectionArray = Array.isArray(selection)
      ? selection
      : Object.keys(selection);
    setSelectedRows(selectionArray.map((id) => String(id)));
  };

  const selectAll = () => {
    setSelectedRows(data.map((item) => item.id));
  };

  const deselectAll = () => {
    setSelectedRows([]);
  };

  const toggleSelection = (id: string) => {
    setSelectedRows((prev) =>
      prev.includes(id) ? prev.filter((item) => item !== id) : [...prev, id]
    );
  };

  // Gestion de la pagination
  const handlePageChange = (newPage: number) => {
    setPage(newPage);
  };

  const handlePageSizeChange = (newPageSize: number) => {
    setCurrentPageSize(newPageSize);
    setPage(0); // Reset à la première page
  };

  // Données paginées
  const paginatedData = enablePagination
    ? data.slice(page * currentPageSize, (page + 1) * currentPageSize)
    : data;

  // Éléments sélectionnés avec leurs données complètes
  const selectedData = data.filter((item) => selectedRows.includes(item.id));

  // Configuration commune pour DataGrid
  const dataGridProps = {
    rows: paginatedData,
    columns,
    checkboxSelection: enableSelection,
    rowSelectionModel: selectedRows,
    onRowSelectionModelChange: handleSelectionChange,
    pageSizeOptions: [10, 25, 50, 100],
    pagination: enablePagination,
    paginationMode: "client" as const,
    page,
    pageSize: currentPageSize,
    onPageChange: handlePageChange,
    onPageSizeChange: handlePageSizeChange,
    disableRowSelectionOnClick: true,
    autoHeight: true,
    localeText: {
      noRowsLabel: "Aucune donnée disponible",
      noResultsOverlayLabel: "Aucun résultat trouvé",
      toolbarColumns: "Colonnes",
      toolbarFilters: "Filtres",
      toolbarExport: "Exporter",
      toolbarDensity: "Densité",
    },
  };

  // Stats de sélection
  const selectionStats = {
    selectedCount: selectedRows.length,
    totalCount: data.length,
    isAllSelected: selectedRows.length === data.length && data.length > 0,
    isNoneSelected: selectedRows.length === 0,
    hasSelection: selectedRows.length > 0,
  };

  return {
    // État
    selectedRows,
    selectedData,
    page,
    pageSize: currentPageSize,
    paginatedData,

    // Actions de sélection
    handleSelectionChange,
    selectAll,
    deselectAll,
    toggleSelection,

    // Actions de pagination
    handlePageChange,
    handlePageSizeChange,

    // Configuration DataGrid
    dataGridProps,

    // Stats
    selectionStats,
  };
};

export default useDataTable;
