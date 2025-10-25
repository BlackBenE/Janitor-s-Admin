import * as React from 'react';
import Box from '@mui/material/Box';
import {
  DataGrid,
  ToolbarButton,
  ColumnsPanelTrigger,
  FilterPanelTrigger,
  Toolbar,
  GridRenderCellParams,
  GridColDef,
} from '@mui/x-data-grid';

import Tooltip from '@mui/material/Tooltip';
import Badge from '@mui/material/Badge';
import FilterListIcon from '@mui/icons-material/FilterList';
import ViewColumnIcon from '@mui/icons-material/ViewColumn';
import { COMMON_LABELS } from '@/shared/constants';

function MyCustomToolbar() {
  return (
    <React.Fragment>
      <Toolbar>
        <Tooltip title={COMMON_LABELS.table.toolbar.columns}>
          <ColumnsPanelTrigger render={<ToolbarButton />}>
            <ViewColumnIcon fontSize="small" />
          </ColumnsPanelTrigger>
        </Tooltip>

        <Tooltip title={COMMON_LABELS.table.toolbar.filters}>
          <FilterPanelTrigger
            render={(triggerProps, state) => (
              <ToolbarButton {...triggerProps} color="default">
                <Badge badgeContent={state.filterCount} color="primary" variant="dot">
                  <FilterListIcon fontSize="small" />
                </Badge>
              </ToolbarButton>
            )}
          />
        </Tooltip>
      </Toolbar>
    </React.Fragment>
  );
}

interface DataTableProps<T extends Record<string, unknown>> {
  columns: GridColDef[];
  data: T[];
  renderActions?: (row: T) => React.ReactNode;
}

function DataTable<T extends Record<string, unknown>>({
  columns,
  data,
  renderActions,
}: DataTableProps<T>) {
  const gridColumns: GridColDef[] = [
    ...columns.map((col) => ({
      ...col,
      flex: col.width ? 0 : 1,
      minWidth: col.width || 100,
    })),
    ...(renderActions
      ? [
          {
            field: 'actions',
            headerName: COMMON_LABELS.table.actions,
            sortable: false,
            filterable: false,
            renderCell: (params: GridRenderCellParams<T>) => renderActions(params.row),
            width: 120,
            flex: 0,
          },
        ]
      : []),
  ];

  // Add id to each row (required by DataGrid)
  const gridRows = data.map((row, idx) => ({
    id: (row as any).id || idx, // Utiliser l'ID de la row si disponible, sinon l'index
    ...row,
  }));

  return (
    <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2, width: '100%', height: '100%' }}>
      <Box id="filter-panel" />
      <Box sx={{ height: '100%', width: '100%', minHeight: 400 }}>
        <DataGrid
          rows={gridRows}
          columns={gridColumns}
          slots={{ toolbar: MyCustomToolbar }}
          slotProps={{ toolbar: { showQuickFilter: true } }}
          showToolbar
          initialState={{
            filter: {
              filterModel: {
                items: [],
                quickFilterExcludeHiddenColumns: false,
                quickFilterValues: [],
              },
            },
            pagination: {
              paginationModel: { pageSize: 25 },
            },
          }}
          pageSizeOptions={[10, 25, 50]}
          disableRowSelectionOnClick
          sx={{ borderRadius: 4 }}
        />
      </Box>
    </Box>
  );
}

export default DataTable;
