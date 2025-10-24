import React from "react";
import {
  Box,
  Chip,
  Checkbox,
  IconButton,
  Tooltip,
  Menu,
  MenuItem,
  ListItemIcon,
  ListItemText,
} from "@mui/material";
import {
  RemoveRedEyeOutlined as ViewIcon,
  MoreVert as MoreVertIcon,
} from "@mui/icons-material";
import { GridRenderCellParams, GridColDef } from "@mui/x-data-grid";

// =====================================================
// TYPES GÉNÉRIQUES
// =====================================================

export interface BaseItem {
  id: string;
  [key: string]: any;
}

export interface GenericAction {
  id: string;
  label: string;
  icon: React.ComponentType<any>;
  color?: "primary" | "secondary" | "success" | "error" | "info" | "warning";
  tooltip?: string;
  onClick: (item: BaseItem) => void;
  disabled?: (item: BaseItem) => boolean;
  visible?: (item: BaseItem) => boolean;
}

export interface ColumnConfig {
  field: string;
  headerName: string;
  width?: number;
  flex?: number;
  sortable?: boolean;
  filterable?: boolean;
  renderCell?: (params: GridRenderCellParams) => React.ReactNode;
  valueGetter?: (value: any, row: BaseItem) => any;
}

export interface GenericTableConfig {
  // Configuration des sélections
  selectable?: boolean;
  selectedItems?: string[];
  onToggleSelection?: (itemId: string) => void;
  onSelectAll?: (items: BaseItem[]) => void;

  // Configuration des colonnes
  columns: ColumnConfig[];

  // Configuration des actions
  primaryActions?: GenericAction[]; // Actions directes (boutons)
  secondaryActions?: GenericAction[]; // Actions dans le menu

  // Style et comportement
  actionColumnWidth?: number;
  showActionsMenu?: boolean;
}

// =====================================================
// COMPOSANTS GÉNÉRIQUES
// =====================================================

const GenericActionsCell: React.FC<{
  item: BaseItem;
  primaryActions?: GenericAction[];
  secondaryActions?: GenericAction[];
  showActionsMenu?: boolean;
}> = ({
  item,
  primaryActions = [],
  secondaryActions = [],
  showActionsMenu = false,
}) => {
  const [anchorEl, setAnchorEl] = React.useState<null | HTMLElement>(null);
  const open = Boolean(anchorEl);

  const handleMenuClick = (event: React.MouseEvent<HTMLElement>) => {
    event.stopPropagation();
    setAnchorEl(event.currentTarget);
  };

  const handleMenuClose = () => {
    setAnchorEl(null);
  };

  // Filtrer les actions visibles
  const visiblePrimaryActions = primaryActions.filter(
    (action) => !action.visible || action.visible(item)
  );

  const visibleSecondaryActions = secondaryActions.filter(
    (action) => !action.visible || action.visible(item)
  );

  return (
    <Box sx={{ display: "flex", gap: 0.5, alignItems: "center" }}>
      {/* Actions primaires (boutons directs) */}
      {visiblePrimaryActions.map((action) => {
        const IconComponent = action.icon;
        const isDisabled = action.disabled ? action.disabled(item) : false;

        return (
          <Tooltip key={action.id} title={action.tooltip || action.label}>
            <IconButton
              size="small"
              color={action.color || "primary"}
              onClick={(e) => {
                e.stopPropagation();
                action.onClick(item);
              }}
              disabled={isDisabled}
              sx={{
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                minHeight: "32px",
                minWidth: "32px",
              }}
            >
              {React.createElement(IconComponent, { fontSize: "small" })}
            </IconButton>
          </Tooltip>
        );
      })}

      {/* Menu des actions secondaires */}
      {(showActionsMenu || visibleSecondaryActions.length > 0) && (
        <>
          <Tooltip title="More actions">
            <IconButton
              size="small"
              onClick={handleMenuClick}
              sx={{
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                minHeight: "32px",
                minWidth: "32px",
                color: "text.secondary",
                "&:hover": { color: "primary.main" },
              }}
            >
              <MoreVertIcon fontSize="small" />
            </IconButton>
          </Tooltip>

          <Menu
            anchorEl={anchorEl}
            open={open}
            onClose={handleMenuClose}
            onClick={(e) => e.stopPropagation()}
          >
            {visibleSecondaryActions.map((action) => {
              const IconComponent = action.icon;
              const isDisabled = action.disabled
                ? action.disabled(item)
                : false;

              return (
                <MenuItem
                  key={action.id}
                  onClick={(e) => {
                    e.stopPropagation();
                    action.onClick(item);
                    handleMenuClose();
                  }}
                  disabled={isDisabled}
                >
                  <ListItemIcon>
                    {React.createElement(IconComponent, { fontSize: "small" })}
                  </ListItemIcon>
                  <ListItemText primary={action.label} />
                </MenuItem>
              );
            })}
          </Menu>
        </>
      )}
    </Box>
  );
};

// =====================================================
// FONCTION PRINCIPALE
// =====================================================

export const createGenericTableColumns = (
  config: GenericTableConfig
): GridColDef[] => {
  const columns: GridColDef[] = [];

  // Colonne de sélection (optionnelle)
  if (config.selectable) {
    columns.push({
      field: "select",
      headerName: "",
      width: 60,
      sortable: false,
      filterable: false,
      disableColumnMenu: true,
      renderHeader: () => (
        <Checkbox
          indeterminate={
            config.selectedItems &&
            config.selectedItems.length > 0 &&
            config.selectedItems.length < 10 // Ou le nombre total d'items
          }
          checked={config.selectedItems && config.selectedItems.length > 0}
          onChange={() => {
            // Logique pour sélectionner tout (à implémenter si nécessaire)
            if (config.onSelectAll) {
              // config.onSelectAll(allItems);
            }
          }}
          size="small"
        />
      ),
      renderCell: (params: GridRenderCellParams) => (
        <Checkbox
          checked={config.selectedItems?.includes(params.row.id) || false}
          onChange={() => {
            if (config.onToggleSelection) {
              config.onToggleSelection(params.row.id);
            }
          }}
          size="small"
          onClick={(e) => e.stopPropagation()}
        />
      ),
    });
  }

  // Colonnes de données
  config.columns.forEach((col) => {
    columns.push({
      field: col.field,
      headerName: col.headerName,
      width: col.width,
      flex: col.flex,
      sortable: col.sortable !== false,
      filterable: col.filterable !== false,
      renderCell: col.renderCell,
      valueGetter: col.valueGetter,
    });
  });

  // Colonne d'actions (si des actions sont définies)
  if (
    config.primaryActions?.length ||
    config.secondaryActions?.length ||
    config.showActionsMenu
  ) {
    columns.push({
      field: "actions",
      headerName: "Actions",
      width: config.actionColumnWidth || 140,
      sortable: false,
      filterable: false,
      disableColumnMenu: true,
      renderCell: (params: GridRenderCellParams) => (
        <GenericActionsCell
          item={params.row}
          primaryActions={config.primaryActions}
          secondaryActions={config.secondaryActions}
          showActionsMenu={config.showActionsMenu}
        />
      ),
    });
  }

  return columns;
};

// =====================================================
// UTILITAIRES POUR LES COLONNES COMMUNES
// =====================================================

export const createSelectColumn = (
  selectedItems: string[],
  onToggleSelection: (id: string) => void
): ColumnConfig => ({
  field: "select",
  headerName: "",
  width: 60,
  sortable: false,
  filterable: false,
  renderCell: (params: GridRenderCellParams) => (
    <Checkbox
      checked={selectedItems.includes(params.row.id)}
      onChange={() => onToggleSelection(params.row.id)}
      size="small"
      onClick={(e) => e.stopPropagation()}
    />
  ),
});

export const createStatusColumn = (
  getStatusInfo: (item: BaseItem) => {
    label: string;
    color: any;
    icon?: React.ComponentType<any>;
  }
): ColumnConfig => ({
  field: "status",
  headerName: "Status",
  width: 120,
  renderCell: (params: GridRenderCellParams) => {
    const statusInfo = getStatusInfo(params.row);
    const IconComponent = statusInfo.icon;

    return (
      <Chip
        label={statusInfo.label}
        color={statusInfo.color}
        size="small"
        variant="outlined"
        icon={
          IconComponent
            ? React.createElement(IconComponent, { fontSize: "small" })
            : undefined
        }
      />
    );
  },
});

export const createDateColumn = (
  field: string,
  headerName: string
): ColumnConfig => ({
  field,
  headerName,
  width: 120,
  renderCell: (params: GridRenderCellParams) => (
    <Box sx={{ fontSize: "0.875rem" }}>
      {params.value ? new Date(params.value).toLocaleDateString() : "N/A"}
    </Box>
  ),
});
