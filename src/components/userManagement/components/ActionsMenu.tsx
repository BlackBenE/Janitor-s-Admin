import React from "react";
import { Menu, MenuItem, ListItemIcon, ListItemText } from "@mui/material";
import {
  History as HistoryIcon,
  Star as StarIcon,
  StarBorder as StarBorderIcon,
  CalendarToday as CalendarTodayIcon,
  CheckCircle as CheckCircleIcon,
  Cancel as CancelIcon,
  LockReset as LockResetIcon,
  Lock as LockIcon,
  LockOpen as LockOpenIcon,
} from "@mui/icons-material";
import { GridRenderCellParams } from "@mui/x-data-grid";
import { UserProfile } from "../../../types/userManagement";

interface ActionsMenuProps {
  params: GridRenderCellParams<UserProfile>;
  userName: string;
  anchorEl: HTMLElement | null;
  open: boolean;
  onClose: () => void;
  onShowAudit: (userId: string, userName: string) => void;
  onToggleVIP: (userId: string, isCurrentlyVip: boolean) => void;
  onViewBookings: (userId: string, userName: string) => void;
  onValidateProvider: (userId: string, shouldValidate: boolean) => void;
  onPasswordReset: (userId: string) => void;
  onLockAccount: (userId: string) => void;
  onUnlockAccount: (userId: string) => void;
}

/**
 * Menu contextuel des actions utilisateur
 */
export const ActionsMenu: React.FC<ActionsMenuProps> = ({
  params,
  userName,
  anchorEl,
  open,
  onClose,
  onShowAudit,
  onToggleVIP,
  onViewBookings,
  onValidateProvider,
  onPasswordReset,
  onLockAccount,
  onUnlockAccount,
}) => {
  return (
    <Menu
      anchorEl={anchorEl}
      open={open}
      onClose={onClose}
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
      {/* Audit History - Disponible pour tous les utilisateurs */}
      <MenuItem
        onClick={() => {
          onShowAudit(params.row.id, userName);
          onClose();
        }}
      >
        <ListItemIcon>
          <HistoryIcon fontSize="small" />
        </ListItemIcon>
        <ListItemText primary="View Audit History" />
      </MenuItem>

      {/* Toggle VIP - Disponible pour Property Owners et Tenants */}
      {(params.row.role === "PROPERTY_OWNER" ||
        params.row.role === "property_owner" ||
        params.row.role === "TENANT" ||
        params.row.role === "tenant") && (
        <MenuItem
          onClick={() => {
            onToggleVIP(params.row.id, !!params.row.vip_subscription);
            onClose();
          }}
        >
          <ListItemIcon>
            {params.row.vip_subscription ? (
              <StarIcon fontSize="small" />
            ) : (
              <StarBorderIcon fontSize="small" />
            )}
          </ListItemIcon>
          <ListItemText
            primary={params.row.vip_subscription ? "Remove VIP" : "Make VIP"}
          />
        </MenuItem>
      )}

      {/* Actions spécifiques aux Property Owners */}
      {(params.row.role === "PROPERTY_OWNER" ||
        params.row.role === "property_owner") && (
        <MenuItem
          onClick={() => {
            onViewBookings(params.row.id, userName);
            onClose();
          }}
        >
          <ListItemIcon>
            <CalendarTodayIcon fontSize="small" />
          </ListItemIcon>
          <ListItemText primary="View Bookings & Disputes" />
        </MenuItem>
      )}

      {/* Actions spécifiques aux Service Providers */}
      {(params.row.role === "SERVICE_PROVIDER" ||
        params.row.role === "service_provider") && (
        <MenuItem
          onClick={() => {
            onValidateProvider(params.row.id, !params.row.profile_validated);
            onClose();
          }}
        >
          <ListItemIcon>
            {params.row.profile_validated ? (
              <CheckCircleIcon fontSize="small" />
            ) : (
              <CancelIcon fontSize="small" />
            )}
          </ListItemIcon>
          <ListItemText
            primary={
              params.row.profile_validated
                ? "Reject Provider"
                : "Approve Provider"
            }
          />
        </MenuItem>
      )}

      <MenuItem
        onClick={() => {
          onPasswordReset(params.row.id);
          onClose();
        }}
      >
        <ListItemIcon>
          <LockResetIcon fontSize="small" />
        </ListItemIcon>
        <ListItemText primary="Reset password" />
      </MenuItem>

      <MenuItem
        onClick={() => {
          params.row.account_locked
            ? onUnlockAccount(params.row.id)
            : onLockAccount(params.row.id);
          onClose();
        }}
      >
        <ListItemIcon>
          {params.row.account_locked ? (
            <LockOpenIcon fontSize="small" />
          ) : (
            <LockIcon fontSize="small" />
          )}
        </ListItemIcon>
        <ListItemText
          primary={
            params.row.account_locked ? "Unlock account" : "Lock account"
          }
        />
      </MenuItem>
    </Menu>
  );
};
