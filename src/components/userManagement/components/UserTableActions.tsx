import React from "react";
import { Box, IconButton, Tooltip } from "@mui/material";
import {
  MoreVert as MoreVertIcon,
  RemoveRedEyeOutlined as RemoveRedEyeOutlinedIcon,
  Lock as LockIcon,
} from "@mui/icons-material";
import { GridRenderCellParams } from "@mui/x-data-grid";
import { UserProfile, UserRole } from "../../../types/userManagement";
import { RoleSpecificAction } from "./RoleSpecificAction";
import { ActionsMenu } from "./ActionsMenu";

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

  return (
    <Box sx={{ display: "flex", gap: 0.5, alignItems: "center" }}>
      <Tooltip title="See details">
        <IconButton
          size="small"
          onClick={() => onShowUser(params.row)}
          sx={{ color: "text.secondary", "&:hover": { color: "primary.main" } }}
        >
          <RemoveRedEyeOutlinedIcon fontSize="small" />
        </IconButton>
      </Tooltip>

      <RoleSpecificAction
        currentTabRole={currentTabRole || "all"}
        params={params}
        onViewBookings={onViewBookings}
        onManageSubscription={onManageSubscription}
        onManageServices={onManageServices}
        onShowAudit={handleShowAudit}
      />

      {params.row?.account_locked && (
        <Tooltip title="Account locked">
          <Box
            sx={{ color: "error.main", display: "flex", alignItems: "center" }}
          >
            <LockIcon fontSize="small" />
          </Box>
        </Tooltip>
      )}

      <Tooltip title="More actions">
        <IconButton
          size="small"
          onClick={handleMenuClick}
          sx={{ color: "text.secondary", "&:hover": { color: "primary.main" } }}
        >
          <MoreVertIcon fontSize="small" />
        </IconButton>
      </Tooltip>

      <ActionsMenu
        params={params}
        userName={userName}
        anchorEl={anchorEl}
        open={Boolean(anchorEl)}
        onClose={handleMenuClose}
        onShowAudit={handleShowAudit}
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
