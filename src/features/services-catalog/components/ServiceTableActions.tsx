import React from "react";
import {
  Box,
  IconButton,
  Tooltip,
  Menu,
  MenuItem,
  ListItemIcon,
  ListItemText,
} from "@mui/material";
import {
  RemoveRedEyeOutlined as ViewIcon,
  CheckCircle as ApproveIcon,
  Cancel as RejectIcon,
  Delete as DeleteIcon,
  MoreVert as MoreVertIcon,
} from "@mui/icons-material";
import { GridRenderCellParams } from "@mui/x-data-grid";
import { ServiceWithDetails } from "@/types/services";

interface ServiceTableActionsProps {
  params: GridRenderCellParams;
  onViewDetails: (service: ServiceWithDetails) => void;
  onApproveService: (serviceId: string) => void;
  onRejectService: (serviceId: string) => void;
  onDeleteService: (serviceId: string) => void;
}

export const ServiceTableActions: React.FC<ServiceTableActionsProps> = ({
  params,
  onViewDetails,
  onApproveService,
  onRejectService,
  onDeleteService,
}) => {
  const [anchorEl, setAnchorEl] = React.useState<null | HTMLElement>(null);

  const handleMenuClick = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorEl(event.currentTarget);
  };

  const handleMenuClose = () => {
    setAnchorEl(null);
  };

  const service = params.row as ServiceWithDetails;

  const ActionsMenu = () => (
    <Menu
      anchorEl={anchorEl}
      open={Boolean(anchorEl)}
      onClose={handleMenuClose}
      transformOrigin={{ horizontal: "right", vertical: "top" }}
      anchorOrigin={{ horizontal: "right", vertical: "bottom" }}
      slotProps={{
        paper: {
          sx: {
            maxHeight: 400,
            width: "220px",
          },
        },
      }}
    >
      {/* Approuver - Uniquement pour les services inactifs */}
      {!service.is_active && (
        <MenuItem
          onClick={() => {
            onApproveService(service.id);
            handleMenuClose();
          }}
        >
          <ListItemIcon>
            <ApproveIcon fontSize="small" />
          </ListItemIcon>
          <ListItemText primary="Activer le service" />
        </MenuItem>
      )}

      {/* Rejeter/Désactiver */}
      <MenuItem
        onClick={() => {
          onRejectService(service.id);
          handleMenuClose();
        }}
      >
        <ListItemIcon>
          <RejectIcon fontSize="small" />
        </ListItemIcon>
        <ListItemText primary="Désactiver le service" />
      </MenuItem>

      {/* Supprimer */}
      <MenuItem
        onClick={() => {
          onDeleteService(service.id);
          handleMenuClose();
        }}
        sx={{ color: "error.main" }}
      >
        <ListItemIcon>
          <DeleteIcon fontSize="small" sx={{ color: "error.main" }} />
        </ListItemIcon>
        <ListItemText primary="Supprimer le service" />
      </MenuItem>
    </Menu>
  );

  return (
    <Box sx={{ display: "flex", gap: 0.5, alignItems: "center" }}>
      <Tooltip title="Voir les détails">
        <IconButton
          size="small"
          onClick={() => onViewDetails(service)}
          sx={{ color: "text.secondary", "&:hover": { color: "primary.main" } }}
        >
          <ViewIcon fontSize="small" />
        </IconButton>
      </Tooltip>

      <Tooltip title="Plus d'actions">
        <IconButton
          size="small"
          onClick={handleMenuClick}
          sx={{ color: "text.secondary", "&:hover": { color: "primary.main" } }}
        >
          <MoreVertIcon fontSize="small" />
        </IconButton>
      </Tooltip>

      <ActionsMenu />
    </Box>
  );
};
