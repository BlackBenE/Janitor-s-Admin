import * as React from "react";
import Portal from "@mui/material/Portal";
import Box from "@mui/material/Box";
import Grid from "@mui/material/Grid";
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

function DataTable({ columns, data, renderActions }) {
  // Convert columns to DataGrid format
  const gridColumns = [
    ...columns.map((col) => ({ ...col, flex: 1 })),
    renderActions
      ? {
          field: "actions",
          headerName: "Actions",
          sortable: false,
          filterable: false,
          renderCell: (params) => renderActions(params.row),
          flex: 1,
        }
      : null,
  ].filter(Boolean);

  // Add id to each row (required by DataGrid)
  const gridRows = data.map((row, idx) => ({ id: idx, ...row }));

  return (
    <Grid container spacing={2}>
      <Grid item xs={12}>
        <Box id="filter-panel" />
      </Grid>
      <Grid item xs={12} style={{ height: 400, width: "100%" }}>
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
      </Grid>
    </Grid>
  );
}

export default DataTable;
