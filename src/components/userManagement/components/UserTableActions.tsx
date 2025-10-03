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
  RemoveRedEyeOutlined as RemoveRedEyeOutlinedIcon,
  History as HistoryIcon,
  LockReset as LockResetIcon,
  Lock as LockIcon,
  LockOpen as LockOpenIcon,
  CalendarToday as CalendarTodayIcon,
  Payment as PaymentIcon,
  Build as BuildIcon,
  Star as StarIcon,
  StarBorder as StarBorderIcon,
  CheckCircle as CheckCircleIcon,
  Cancel as CancelIcon,
  MoreVert as MoreVertIcon,
} from "@mui/icons-material";
import { GridRenderCellParams } from "@mui/x-data-grid";
import { UserProfile, UserRole } from "../../../types/userManagement";

interface UserTableActionsProps {
  params: GridRenderCellParams<UserProfile>;
  currentTabRole: UserRole | null;
  onShowUser: (user: UserProfile) => void;
  onShowAudit: (userId: string) => void;
  onPasswordReset: (userId: string) => void;
  onLockAccount: (userId: string) => void;
  onUnlockAccount: (userId: string) => void;
  onViewBookings: (userId: string, userName: string) => void;
  onManageSubscription: (userId: string, userName: string) => void;
  onManageServices: (userId: string, userName: string) => void;
  onToggleVIP: (userId: string, isVIP: boolean) => void;
  onValidateProvider: (userId: string, approved: boolean) => void;
}

/**
 * Composant des actions spécifiques selon le rôle de l'onglet actuel
 */
const RoleSpecificAction: React.FC<{
  currentTabRole: UserRole | null;
  params: GridRenderCellParams<UserProfile>;
  onViewBookings: (userId: string, userName: string) => void;
  onManageSubscription: (userId: string, userName: string) => void;
  onManageServices: (userId: string, userName: string) => void;
  onShowAudit: (userId: string) => void;
}> = ({
  currentTabRole,
  params,
  onViewBookings,
  onManageSubscription,
  onManageServices,
  onShowAudit,
}) => {
  const userName = params.row.full_name || "Unnamed User";

  // Si nous sommes dans l'onglet "All Users", ne pas afficher d'action spécifique
  if (currentTabRole === null) {
    return null;
  }

  // Afficher l'action spécifique selon l'onglet actuel
  if (currentTabRole === UserRole.TRAVELER) {
    return (
      <Tooltip title="View Bookings">
        <IconButton
          size="small"
          onClick={() => onViewBookings(params.row.id, userName)}
          sx={{
            color: "text.secondary",
            "&:hover": { color: "primary.main" },
          }}
        >
          <CalendarTodayIcon fontSize="small" />
        </IconButton>
      </Tooltip>
    );
  } else if (currentTabRole === UserRole.PROPERTY_OWNER) {
    return (
      <Tooltip title="Manage Subscription">
        <IconButton
          size="small"
          onClick={() => onManageSubscription(params.row.id, userName)}
          sx={{
            color: "text.secondary",
            "&:hover": { color: "primary.main" },
          }}
        >
          <PaymentIcon fontSize="small" />
        </IconButton>
      </Tooltip>
    );
  } else if (currentTabRole === UserRole.SERVICE_PROVIDER) {
    return (
      <Tooltip title="Manage Services">
        <IconButton
          size="small"
          onClick={() => onManageServices(params.row.id, userName)}
          sx={{
            color: "text.secondary",
            "&:hover": { color: "primary.main" },
          }}
        >
          <BuildIcon fontSize="small" />
        </IconButton>
      </Tooltip>
    );
  } else if (currentTabRole === UserRole.ADMIN) {
    return (
      <Tooltip title="Admin Actions">
        <IconButton
          size="small"
          onClick={() => onShowAudit(params.row.id)}
          sx={{
            color: "text.secondary",
            "&:hover": { color: "primary.main" },
          }}
        >
          <HistoryIcon fontSize="small" />
        </IconButton>
      </Tooltip>
    );
  }

  return null;
};

/**
 * Menu contextuel avec toutes les actions possibles
 */
const ActionsMenu: React.FC<{
  params: GridRenderCellParams<UserProfile>;
  userName: string;
  anchorEl: HTMLElement | null;
  open: boolean;
  onClose: () => void;
  onShowAudit: (userId: string) => void;
  onToggleVIP: (userId: string, isVIP: boolean) => void;
  onViewBookings: (userId: string, userName: string) => void;
  onValidateProvider: (userId: string, approved: boolean) => void;
  onPasswordReset: (userId: string) => void;
  onLockAccount: (userId: string) => void;
  onUnlockAccount: (userId: string) => void;
}> = ({
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
    <MenuItem
      onClick={() => {
        onShowAudit(params.row.id);
        onClose();
      }}
    >
      <ListItemIcon>
        <HistoryIcon fontSize="small" />
      </ListItemIcon>
      <ListItemText primary="Audit & History" />
    </MenuItem>

    {/* Actions spécifiques aux Travelers */}
    {(params.row.role === "TRAVELER" || params.row.role === "traveler") && (
      <MenuItem
        onClick={() => {
          onToggleVIP(params.row.id, !params.row.vip_subscription);
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
        primary={params.row.account_locked ? "Unlock account" : "Lock account"}
      />
    </MenuItem>
  </Menu>
);

/**
 * Composant principal des actions du tableau utilisateur
 */
export const UserTableActions: React.FC<UserTableActionsProps> = ({
  params,
  currentTabRole,
  onShowUser,
  onShowAudit,
  onPasswordReset,
  onLockAccount,
  onUnlockAccount,
  onViewBookings,
  onManageSubscription,
  onManageServices,
  onToggleVIP,
  onValidateProvider,
}) => {
  const userName = params.row.full_name || "Unnamed User";
  const [anchorEl, setAnchorEl] = React.useState<null | HTMLElement>(null);
  const open = Boolean(anchorEl);

  const handleMenuClick = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorEl(event.currentTarget);
  };

  const handleMenuClose = () => {
    setAnchorEl(null);
  };

  return (
    <Box sx={{ display: "flex", gap: 0.5, alignItems: "center" }}>
      {/* Action principale - Voir détails (toujours présente) */}
      <Tooltip title="See details">
        <IconButton
          size="small"
          onClick={() => onShowUser(params.row)}
          sx={{
            color: "text.secondary",
            "&:hover": { color: "primary.main" },
          }}
        >
          <RemoveRedEyeOutlinedIcon fontSize="small" />
        </IconButton>
      </Tooltip>

      {/* Action spécifique selon l'onglet (masquée pour "All Users") */}
      <RoleSpecificAction
        currentTabRole={currentTabRole}
        params={params}
        onViewBookings={onViewBookings}
        onManageSubscription={onManageSubscription}
        onManageServices={onManageServices}
        onShowAudit={onShowAudit}
      />

      {/* Indicateur de statut rapide */}
      {params.row.account_locked && (
        <Tooltip title="Account locked">
          <Box
            sx={{ color: "error.main", display: "flex", alignItems: "center" }}
          >
            <LockIcon fontSize="small" />
          </Box>
        </Tooltip>
      )}

      {/* Menu des actions secondaires (toujours présent avec toutes les actions) */}
      <Tooltip title="More actions">
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

      <ActionsMenu
        params={params}
        userName={userName}
        anchorEl={anchorEl}
        open={open}
        onClose={handleMenuClose}
        onShowAudit={onShowAudit}
        onToggleVIP={onToggleVIP}
        onViewBookings={onViewBookings}
        onValidateProvider={onValidateProvider}
        onPasswordReset={onPasswordReset}
        onLockAccount={onLockAccount}
        onUnlockAccount={onUnlockAccount}
      />
    </Box>
  );
};
