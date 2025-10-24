import React from "react";
import {
  Box,
  Button,
  Tooltip,
  Badge,
  Menu,
  MenuItem,
  ListItemIcon,
  ListItemText,
  Divider,
} from "@mui/material";
import {
  Download as DownloadIcon,
  MoreVert as MoreVertIcon,
  CheckCircle as CheckCircleIcon,
  Cancel as CancelIcon,
  Delete as DeleteIcon,
} from "@mui/icons-material";

export interface BulkAction {
  key: string;
  label: string;
  icon: React.ReactNode;
  color?: "primary" | "success" | "warning" | "error";
  requiresConfirmation?: boolean;
}

interface ActionToolbarProps {
  selectedCount: number;
  totalCount: number;
  onExport?: (format: "csv" | "excel") => void;
  bulkActions?: BulkAction[];
  onBulkAction?: (actionKey: string) => void;
  customActions?: React.ReactNode;
  isExporting?: boolean;
}

export const ActionToolbar: React.FC<ActionToolbarProps> = ({
  selectedCount,
  totalCount,
  onExport,
  bulkActions = [],
  onBulkAction,
  customActions,
  isExporting = false,
}) => {
  const [anchorEl, setAnchorEl] = React.useState<null | HTMLElement>(null);
  const [exportAnchorEl, setExportAnchorEl] =
    React.useState<null | HTMLElement>(null);

  const handleMoreClick = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorEl(event.currentTarget);
  };

  const handleExportClick = (event: React.MouseEvent<HTMLElement>) => {
    setExportAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
    setExportAnchorEl(null);
  };

  const handleBulkAction = (actionKey: string) => {
    onBulkAction?.(actionKey);
    handleClose();
  };

  const handleExport = (format: "csv" | "excel") => {
    onExport?.(format);
    handleClose();
  };

  // Actions prédéfinies courantes
  const defaultBulkActions: BulkAction[] = [
    {
      key: "validate",
      label: "Valider la sélection",
      icon: <CheckCircleIcon />,
      color: "success",
    },
    {
      key: "suspend",
      label: "Suspendre la sélection",
      icon: <CancelIcon />,
      color: "warning",
      requiresConfirmation: true,
    },
    {
      key: "delete",
      label: "Supprimer la sélection",
      icon: <DeleteIcon />,
      color: "error",
      requiresConfirmation: true,
    },
  ];

  const allBulkActions = [...bulkActions, ...defaultBulkActions];

  return (
    <Box
      sx={{
        display: "flex",
        justifyContent: "space-between",
        alignItems: "center",
        mb: 2,
        p: 1,
        bgcolor: selectedCount > 0 ? "action.selected" : "transparent",
        borderRadius: 1,
        transition: "background-color 0.2s",
      }}
    >
      {/* Section gauche - Info sélection */}
      <Box sx={{ display: "flex", alignItems: "center", gap: 2 }}>
        {selectedCount > 0 ? (
          <Box sx={{ fontSize: "0.875rem", fontWeight: "medium" }}>
            {selectedCount} sur {totalCount} élément
            {selectedCount > 1 ? "s" : ""} sélectionné
            {selectedCount > 1 ? "s" : ""}
          </Box>
        ) : (
          <Box sx={{ fontSize: "0.875rem", color: "text.secondary" }}>
            {totalCount} élément{totalCount > 1 ? "s" : ""} au total
          </Box>
        )}
      </Box>

      {/* Section droite - Actions */}
      <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
        {/* Actions personnalisées */}
        {customActions}

        {/* Bouton d'export */}
        {onExport && (
          <Tooltip title="Exporter les données">
            <Button
              variant="outlined"
              size="small"
              startIcon={<DownloadIcon />}
              onClick={handleExportClick}
              disabled={isExporting}
            >
              {isExporting ? "Export..." : "Export"}
            </Button>
          </Tooltip>
        )}

        {/* Menu d'export */}
        <Menu
          anchorEl={exportAnchorEl}
          open={Boolean(exportAnchorEl)}
          onClose={handleClose}
        >
          <MenuItem onClick={() => handleExport("csv")}>
            <ListItemText>CSV</ListItemText>
          </MenuItem>
          <MenuItem onClick={() => handleExport("excel")}>
            <ListItemText>Excel</ListItemText>
          </MenuItem>
        </Menu>

        {/* Actions en masse */}
        {selectedCount > 0 && allBulkActions.length > 0 && (
          <>
            <Tooltip title="Actions en masse">
              <Badge badgeContent={selectedCount} color="primary">
                <Button
                  variant="outlined"
                  size="small"
                  startIcon={<MoreVertIcon />}
                  onClick={handleMoreClick}
                >
                  Actions
                </Button>
              </Badge>
            </Tooltip>

            <Menu
              anchorEl={anchorEl}
              open={Boolean(anchorEl)}
              onClose={handleClose}
            >
              {allBulkActions.map((action, index) => (
                <React.Fragment key={action.key}>
                  <MenuItem
                    onClick={() => handleBulkAction(action.key)}
                    sx={{
                      color:
                        action.color === "error"
                          ? "error.main"
                          : action.color === "warning"
                          ? "warning.main"
                          : action.color === "success"
                          ? "success.main"
                          : "text.primary",
                    }}
                  >
                    <ListItemIcon
                      sx={{
                        color: "inherit",
                      }}
                    >
                      {action.icon}
                    </ListItemIcon>
                    <ListItemText>{action.label}</ListItemText>
                  </MenuItem>
                  {index < allBulkActions.length - 1 && <Divider />}
                </React.Fragment>
              ))}
            </Menu>
          </>
        )}
      </Box>
    </Box>
  );
};

export default ActionToolbar;
