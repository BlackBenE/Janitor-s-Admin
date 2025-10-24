import React, { useState } from "react";
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
  Visibility as VisibilityIcon,
  Check as CheckIcon,
  Close as CloseIcon,
  Schedule as ScheduleIcon,
  Edit as EditIcon,
  Delete as DeleteIcon,
  MoreVert as MoreVertIcon,
} from "@mui/icons-material";
import { GridRenderCellParams, GridCellParams } from "@mui/x-data-grid";
import { LABELS } from "../../../constants/labels";

// Import du type depuis PropertyTableConfig pour éviter la duplication
interface PropertyTableItem {
  id: string;
  title: string;
  validation_status: string;
  owner_name: string;
  owner_email: string;
  location: string;
  address: string;
  rent_amount: number;
  created_at: string;
  [key: string]: any;
}

interface PropertyTableActionsProps {
  params: GridRenderCellParams<PropertyTableItem>;
  onViewProperty: (property: PropertyTableItem) => void;
  onApproveProperty: (propertyId: string) => void;
  onRejectProperty: (propertyId: string) => void;
  onSetPendingProperty: (propertyId: string) => void;
  onDeleteProperty: (propertyId: string) => void;
  isApprovePending?: boolean;
  isRejectPending?: boolean;
  isPendingPending?: boolean;
  isDeletePending?: boolean;
}

/**
 * Menu des actions pour les propriétés
 */
const PropertyActionsMenu: React.FC<{
  params: GridRenderCellParams<PropertyTableItem>;
  propertyTitle: string;
  anchorEl: HTMLElement | null;
  open: boolean;
  onClose: () => void;
  onApproveProperty: (propertyId: string) => void;
  onRejectProperty: (propertyId: string) => void;
  onSetPendingProperty: (propertyId: string) => void;
  onDeleteProperty: (propertyId: string) => void;
  isApprovePending?: boolean;
  isRejectPending?: boolean;
  isPendingPending?: boolean;
  isDeletePending?: boolean;
}> = ({
  params,
  anchorEl,
  open,
  onClose,
  onApproveProperty,
  onRejectProperty,
  onSetPendingProperty,
  onDeleteProperty,
  isApprovePending = false,
  isRejectPending = false,
  isPendingPending = false,
  isDeletePending = false,
}) => (
  <Menu
    anchorEl={anchorEl}
    open={open}
    onClose={onClose}
    anchorOrigin={{
      vertical: "bottom",
      horizontal: "right",
    }}
    transformOrigin={{
      vertical: "top",
      horizontal: "right",
    }}
  >
    {/* Approve */}
    <MenuItem
      onClick={() => {
        onApproveProperty(params.row.id);
        onClose();
      }}
      disabled={isApprovePending}
    >
      <ListItemIcon>
        <CheckIcon fontSize="small" />
      </ListItemIcon>
      <ListItemText primary={LABELS.propertyApprovals.actions.approve} />
    </MenuItem>

    {/* Reject */}
    <MenuItem
      onClick={() => {
        onRejectProperty(params.row.id);
        onClose();
      }}
      disabled={isRejectPending}
    >
      <ListItemIcon>
        <CloseIcon fontSize="small" />
      </ListItemIcon>
      <ListItemText primary={LABELS.propertyApprovals.actions.reject} />
    </MenuItem>

    {/* Set Pending */}
    <MenuItem
      onClick={() => {
        onSetPendingProperty(params.row.id);
        onClose();
      }}
      disabled={isPendingPending}
    >
      <ListItemIcon>
        <ScheduleIcon fontSize="small" />
      </ListItemIcon>
      <ListItemText primary={LABELS.propertyApprovals.actions.setPending} />
    </MenuItem>

    {/* Delete */}
    <MenuItem
      onClick={() => {
        onDeleteProperty(params.row.id);
        onClose();
      }}
      disabled={isDeletePending}
    >
      <ListItemIcon>
        <DeleteIcon fontSize="small" />
      </ListItemIcon>
      <ListItemText primary={LABELS.propertyApprovals.actions.deleteProperty} />
    </MenuItem>
  </Menu>
);

/**
 * Composant principal des actions du tableau des propriétés
 */
export const PropertyTableActions: React.FC<PropertyTableActionsProps> = ({
  params,
  onViewProperty,
  onApproveProperty,
  onRejectProperty,
  onSetPendingProperty,
  onDeleteProperty,
  isApprovePending = false,
  isRejectPending = false,
  isPendingPending = false,
  isDeletePending = false,
}) => {
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const open = Boolean(anchorEl);

  const propertyTitle =
    params.row.title || LABELS.propertyApprovals.table.unknownProperty;

  const handleMenuClick = (event: React.MouseEvent<HTMLButtonElement>) => {
    setAnchorEl(event.currentTarget);
  };

  const handleMenuClose = () => {
    setAnchorEl(null);
  };

  return (
    <Box sx={{ display: "flex", gap: 0.5 }}>
      {/* Action principale : View Details */}
      <Tooltip title={LABELS.propertyApprovals.actions.viewDetails}>
        <IconButton
          size="small"
          onClick={() => onViewProperty(params.row)}
          sx={{
            color: "text.secondary",
            "&:hover": { color: "primary.main" },
          }}
        >
          <VisibilityIcon fontSize="small" />
        </IconButton>
      </Tooltip>

      {/* Menu des actions secondaires */}
      <Tooltip title={LABELS.propertyApprovals.actions.moreActions}>
        <IconButton
          size="small"
          onClick={handleMenuClick}
          sx={{
            color: "text.secondary",
            "&:hover": { color: "primary.main" },
          }}
        >
          <MoreVertIcon fontSize="small" />
        </IconButton>
      </Tooltip>

      <PropertyActionsMenu
        params={params}
        propertyTitle={propertyTitle}
        anchorEl={anchorEl}
        open={open}
        onClose={handleMenuClose}
        onApproveProperty={(propertyId) => onApproveProperty(propertyId)}
        onRejectProperty={(propertyId) => onRejectProperty(propertyId)}
        onSetPendingProperty={(propertyId) => onSetPendingProperty(propertyId)}
        onDeleteProperty={(propertyId) => onDeleteProperty(propertyId)}
        isApprovePending={isApprovePending}
        isRejectPending={isRejectPending}
        isPendingPending={isPendingPending}
        isDeletePending={isDeletePending}
      />
    </Box>
  );
};
