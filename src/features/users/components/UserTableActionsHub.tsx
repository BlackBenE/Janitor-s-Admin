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
  MoreVert as MoreVertIcon,
  RemoveRedEyeOutlined as RemoveRedEyeOutlinedIcon,
  Lock as LockIcon,
  LockOpen as LockOpenIcon,
  LockReset as LockResetIcon,
  History as HistoryIcon,
  Star as StarIcon,
  StarBorder as StarBorderIcon,
  CheckCircle as CheckCircleIcon,
  Cancel as CancelIcon,
} from "@mui/icons-material";
import { GridRenderCellParams } from "@mui/x-data-grid";
import { UserProfile, UserRole } from "@/types/userManagement";

interface UserTableActionsHubProps {
  params: GridRenderCellParams<UserProfile>;
  currentTabRole: UserRole | string | null;
  onShowUser: (user: UserProfile) => void;
  onShowAudit: (userId: string) => void;
  onPasswordReset: (userId: string) => void;
  onLockAccount: (userId: string) => void;
  onUnlockAccount: (userId: string) => void;
  onToggleVIP: (userId: string, isVIP: boolean) => void;
  onValidateProvider: (userId: string, approved: boolean) => void;
}

export const UserTableActionsHub: React.FC<UserTableActionsHubProps> = ({
  params,
  currentTabRole,
  onShowUser,
  onShowAudit,
  onPasswordReset,
  onLockAccount,
  onUnlockAccount,
  onToggleVIP,
  onValidateProvider,
}) => {
  const userName = params.row?.full_name || "Unnamed User";
  const [anchorEl, setAnchorEl] = React.useState<null | HTMLElement>(null);

  const handleMenuClick = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorEl(event.currentTarget);
  };

  const handleMenuClose = () => {
    setAnchorEl(null);
  };

  const handleShowAudit = (userId: string, userName: string) => {
    onShowAudit(userId);
  };

  // Composant pour l'action spécifique au rôle/onglet - SUPPRIMÉ
  // Maintenant les détails sont accessibles via l'icône "détails" qui ouvre UserDetailsModal

  // Menu contextuel des actions
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
      {/* Audit History - Disponible pour tous les utilisateurs */}
      <MenuItem
        onClick={() => {
          handleShowAudit(params.row.id, userName);
          handleMenuClose();
        }}
      >
        <ListItemIcon>
          <HistoryIcon fontSize="small" />
        </ListItemIcon>
        <ListItemText primary="Voir l'historique d'audit" />
      </MenuItem>

      {/* Toggle VIP - Disponible pour Property Owners et Tenants */}
      {(params.row.role === "PROPERTY_OWNER" ||
        params.row.role === "property_owner" ||
        params.row.role === "TENANT" ||
        params.row.role === "tenant") && (
        <MenuItem
          onClick={() => {
            onToggleVIP(params.row.id, !!params.row.vip_subscription);
            handleMenuClose();
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
            primary={params.row.vip_subscription ? "Retirer le VIP" : "Rendre VIP"}
          />
        </MenuItem>
      )}

      {/* Actions spécifiques aux Service Providers - Validation */}
      {(params.row.role === "SERVICE_PROVIDER" ||
        params.row.role === "service_provider") && (
        <MenuItem
          onClick={() => {
            onValidateProvider(params.row.id, !params.row.profile_validated);
            handleMenuClose();
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
                ? "Rejeter le prestataire"
                : "Approuver le prestataire"
            }
          />
        </MenuItem>
      )}

      <MenuItem
        onClick={() => {
          onPasswordReset(params.row.id);
          handleMenuClose();
        }}
      >
        <ListItemIcon>
          <LockResetIcon fontSize="small" />
        </ListItemIcon>
        <ListItemText primary="Réinitialiser le mot de passe" />
      </MenuItem>

      <MenuItem
        onClick={() => {
          params.row.account_locked
            ? onUnlockAccount(params.row.id)
            : onLockAccount(params.row.id);
          handleMenuClose();
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
            params.row.account_locked ? "Débloquer le compte" : "Bloquer le compte"
          }
        />
      </MenuItem>
    </Menu>
  );

  return (
    <Box sx={{ display: "flex", gap: 0.5, alignItems: "center" }}>
      <Tooltip title="Voir les détails">
        <IconButton
          size="small"
          onClick={() => onShowUser(params.row)}
          sx={{ color: "text.secondary", "&:hover": { color: "primary.main" } }}
        >
          <RemoveRedEyeOutlinedIcon fontSize="small" />
        </IconButton>
      </Tooltip>

      {params.row?.account_locked && (
        <Tooltip title="Compte bloqué">
          <Box
            sx={{ color: "error.main", display: "flex", alignItems: "center" }}
          >
            <LockIcon fontSize="small" />
          </Box>
        </Tooltip>
      )}

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
