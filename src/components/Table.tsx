import * as React from "react";
import Portal from "@mui/material/Portal";
import Box from "@mui/material/Box";
import {
  DataGrid,
  GridPortalWrapper,
  QuickFilter,
  QuickFilterClear,
  QuickFilterControl,
  ToolbarButton,
  ColumnsPanelTrigger,
  FilterPanelTrigger,
  Toolbar,
  GridRenderCellParams,
  GridColDef,
} from "@mui/x-data-grid";
import TextField from "@mui/material/TextField";
import InputAdornment from "@mui/material/InputAdornment";
import SearchIcon from "@mui/icons-material/Search";
import CancelIcon from "@mui/icons-material/Cancel";
import Tooltip from "@mui/material/Tooltip";
import Badge from "@mui/material/Badge";
import FilterListIcon from "@mui/icons-material/FilterList";
import ViewColumnIcon from "@mui/icons-material/ViewColumn";

function MyCustomToolbar() {
  return (
    <React.Fragment>
      <Portal container={() => document.getElementById("filter-panel")}>
        <GridPortalWrapper>
          <QuickFilter expanded>
            <QuickFilterControl
              render={({ ref, ...other }) => (
                <TextField
                  {...other}
                  sx={{ width: 260 }}
                  inputRef={ref}
                  aria-label="Search"
                  placeholder="Search..."
                  size="small"
                  slotProps={{
                    input: {
                      startAdornment: (
                        <InputAdornment position="start">
                          <SearchIcon fontSize="small" />
                        </InputAdornment>
                      ),
                      endAdornment: other.value ? (
                        <InputAdornment position="end">
                          <QuickFilterClear
                            edge="end"
                            size="small"
                            aria-label="Clear search"
                            material={{ sx: { marginRight: -0.75 } }}
                          >
                            <CancelIcon fontSize="small" />
                          </QuickFilterClear>
                        </InputAdornment>
                      ) : null,
                    },
                  }}
                />
              )}
            />
          </QuickFilter>
        </GridPortalWrapper>
      </Portal>

      <Toolbar>
        <Tooltip title="Columns">
          <ColumnsPanelTrigger render={<ToolbarButton />}>
            <ViewColumnIcon fontSize="small" />
          </ColumnsPanelTrigger>
        </Tooltip>

        <Tooltip title="Filters">
          <FilterPanelTrigger
            render={(triggerProps, state) => (
              <ToolbarButton {...triggerProps} color="default">
                <Badge
                  badgeContent={state.filterCount}
                  color="primary"
                  variant="dot"
                >
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
  // Convert columns to DataGrid format
  const gridColumns: GridColDef[] = [
    ...columns.map((col) => ({ ...col, flex: 1 })),
    ...(renderActions
      ? [
          {
            field: "actions",
            headerName: "Actions",
            sortable: false,
            filterable: false,
            renderCell: (params: GridRenderCellParams<T>) =>
              renderActions(params.row),
            flex: 1,
          },
        ]
      : []),
  ];

  // Add id to each row (required by DataGrid)
  const gridRows = data.map((row, idx) => ({ id: idx, ...row }));

  return (
    <Box
      sx={{ display: "flex", flexDirection: "column", gap: 2, width: "100%" }}
    >
      <Box id="filter-panel" />
      <Box sx={{ height: 400, width: "100%" }}>
        <DataGrid
          rows={gridRows}
          columns={gridColumns}
          slots={{ toolbar: MyCustomToolbar }}
          slotProps={{ toolbar: { showQuickFilter: false } }}
          showToolbar
          initialState={{
            filter: {
              filterModel: {
                items: [],
                quickFilterExcludeHiddenColumns: true,
              },
            },
          }}
          sx={{ borderRadius: 4 }}
        />
      </Box>
    </Box>
  );
}

export default DataTable;
