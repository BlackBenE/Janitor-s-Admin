import React from "react";
import {
  IconButton,
  Menu,
  MenuItem,
  ListItemIcon,
  ListItemText,
  Divider,
  Tooltip,
} from "@mui/material";
import {
  MoreVert as MoreVertIcon,
  Visibility as ViewIcon,
  Edit as EditIcon,
  PlayArrow as ActivateIcon,
  Pause as DeactivateIcon,
  Delete as DeleteIcon,
} from "@mui/icons-material";
import { ServiceWithDetails } from "../../../types/services";

interface ServicesTableActionsProps {
  service: ServiceWithDetails;
  onViewDetails: (service: ServiceWithDetails) => void;
  onEditService: (service: ServiceWithDetails) => void;
  onActivateService: (serviceId: string) => void;
  onDeactivateService: (serviceId: string) => void;
  onDeleteService: (serviceId: string) => void;
}

export const ServicesTableActions: React.FC<ServicesTableActionsProps> = ({
  service,
  onViewDetails,
  onEditService,
  onActivateService,
  onDeactivateService,
  onDeleteService,
}) => {
  const [anchorEl, setAnchorEl] = React.useState<null | HTMLElement>(null);
  const open = Boolean(anchorEl);

  const handleClick = (event: React.MouseEvent<HTMLElement>) => {
    event.stopPropagation();
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  const handleCloseWithEvent = (event: React.MouseEvent) => {
    event.stopPropagation();
    setAnchorEl(null);
  };

  const handleAction = (
    event: React.MouseEvent,
    action: () => void
  ) => {
    event.stopPropagation();
    action();
    handleClose();
  };

  return (
    <>
      <Tooltip title="Actions">
        <IconButton
          size="small"
          onClick={handleClick}
          aria-label="actions"
          aria-controls={open ? "service-actions-menu" : undefined}
          aria-haspopup="true"
          aria-expanded={open ? "true" : undefined}
        >
          <MoreVertIcon fontSize="small" />
        </IconButton>
      </Tooltip>

      <Menu
        id="service-actions-menu"
        anchorEl={anchorEl}
        open={open}
        onClose={handleClose}
        MenuListProps={{
          "aria-labelledby": "service-actions-button",
        }}
        transformOrigin={{ horizontal: "right", vertical: "top" }}
        anchorOrigin={{ horizontal: "right", vertical: "bottom" }}
      >
        <MenuItem onClick={(e) => handleAction(e, () => onViewDetails(service))}>
          <ListItemIcon>
            <ViewIcon fontSize="small" />
          </ListItemIcon>
          <ListItemText>Voir détails</ListItemText>
        </MenuItem>

        <MenuItem onClick={(e) => handleAction(e, () => onEditService(service))}>
          <ListItemIcon>
            <EditIcon fontSize="small" />
          </ListItemIcon>
          <ListItemText>Modifier</ListItemText>
        </MenuItem>

        <Divider />

        {service.is_active ? (
          <MenuItem
            onClick={(e) => handleAction(e, () => onDeactivateService(service.id))}
            sx={{ color: "warning.main" }}
          >
            <ListItemIcon>
              <DeactivateIcon fontSize="small" color="warning" />
            </ListItemIcon>
            <ListItemText>Désactiver</ListItemText>
          </MenuItem>
        ) : (
          <MenuItem
            onClick={(e) => handleAction(e, () => onActivateService(service.id))}
            sx={{ color: "success.main" }}
          >
            <ListItemIcon>
              <ActivateIcon fontSize="small" color="success" />
            </ListItemIcon>
            <ListItemText>Activer</ListItemText>
          </MenuItem>
        )}

        <Divider />

        <MenuItem
          onClick={(e) => handleAction(e, () => onDeleteService(service.id))}
          sx={{ color: "error.main" }}
        >
          <ListItemIcon>
            <DeleteIcon fontSize="small" color="error" />
          </ListItemIcon>
          <ListItemText>Supprimer</ListItemText>
        </MenuItem>
      </Menu>
    </>
  );
};