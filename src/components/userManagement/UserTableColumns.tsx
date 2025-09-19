import React from "react";
import { Box, Chip, Checkbox, IconButton, Tooltip } from "@mui/material";
import {
  RemoveRedEyeOutlined as RemoveRedEyeOutlinedIcon,
  History as HistoryIcon,
  LockReset as LockResetIcon,
  ExitToApp as ExitToAppIcon,
  Lock as LockIcon,
  LockOpen as LockOpenIcon,
} from "@mui/icons-material";
import { GridRenderCellParams } from "@mui/x-data-grid";
import { UserProfile } from "../../types/userManagement";

interface UserTableColumnsProps {
  selectedUsers: string[];
  activityData: Record<string, any> | undefined;
  onToggleUserSelection: (userId: string) => void;
  onShowUser: (user: UserProfile) => void;
  onShowAudit: (userId: string) => void;
  onPasswordReset: (userId: string) => void;
  onForceLogout: (userId: string) => void;
  onLockAccount: (userId: string) => void;
  onUnlockAccount: (userId: string) => void;
}

export const createUserTableColumns = ({
  selectedUsers,
  activityData,
  onToggleUserSelection,
  onShowUser,
  onShowAudit,
  onPasswordReset,
  onForceLogout,
  onLockAccount,
  onUnlockAccount,
}: UserTableColumnsProps) => {
  const getRoleColor = (
    role: string
  ):
    | "default"
    | "primary"
    | "secondary"
    | "error"
    | "info"
    | "success"
    | "warning" => {
    switch (role.toLowerCase()) {
      case "admin":
        return "error";
      case "property_owner":
        return "primary";
      case "service_provider":
        return "info";
      case "traveler":
        return "default";
      default:
        return "default";
    }
  };

  const formatDate = (dateString: string | null): string => {
    if (!dateString) return "Never";
    return new Date(dateString).toLocaleDateString();
  };

  const formatCurrency = (amount: number): string => {
    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: "USD",
    }).format(amount);
  };

  return [
    {
      field: "select",
      headerName: "",
      width: 50,
      sortable: false,
      filterable: false,
      renderCell: (params: GridRenderCellParams<UserProfile>) => (
        <Checkbox
          checked={selectedUsers.includes(params.row.id)}
          onChange={() => {
            onToggleUserSelection(params.row.id);
          }}
          size="small"
        />
      ),
    },
    {
      field: "full_name",
      headerName: "User",
      minWidth: 200,
      flex: 1,
      valueGetter: (value: string | null, row: UserProfile) =>
        `${row.full_name || "Unnamed User"} ${row.email}`,
      renderCell: (params: GridRenderCellParams<UserProfile>) => (
        <Box>
          <Box sx={{ fontWeight: "medium" }}>
            {params.row.full_name || "Unnamed User"}
          </Box>
          <Box sx={{ fontSize: "0.75rem", color: "text.secondary" }}>
            {params.row.email}
          </Box>
        </Box>
      ),
    },
    {
      field: "role",
      headerName: "Role",
      valueGetter: (value: string) => value?.replace("_", " ") || "",
      renderCell: (params: GridRenderCellParams<UserProfile>) => (
        <Chip
          label={params.row.role.replace("_", " ")}
          color={getRoleColor(params.row.role)}
          size="small"
          variant="outlined"
        />
      ),
    },
    {
      field: "vip_subscription",
      headerName: "Subscription",
      valueGetter: (value: boolean) => (value ? "VIP" : "Standard"),
      renderCell: (params: GridRenderCellParams<UserProfile>) => (
        <Chip
          label={params.row.vip_subscription ? "VIP" : "Standard"}
          color={params.row.vip_subscription ? "warning" : "default"}
          size="small"
        />
      ),
    },
    {
      field: "profile_validated",
      headerName: "Status",
      valueGetter: (value: boolean, row: UserProfile) => {
        if (row.account_locked) return "Locked";
        return value ? "Validated" : "Pending";
      },
      renderCell: (params: GridRenderCellParams<UserProfile>) => {
        if (params.row.account_locked) {
          return (
            <Chip
              label="Locked"
              color="error"
              size="small"
              icon={<LockIcon fontSize="small" />}
            />
          );
        }
        return (
          <Chip
            label={params.row.profile_validated ? "Validated" : "Pending"}
            color={params.row.profile_validated ? "success" : "warning"}
            size="small"
          />
        );
      },
    },
    {
      field: "activity",
      headerName: "Activity",
      sortable: false,
      filterable: false,
      valueGetter: (value: string | null, row: UserProfile) => {
        const activity = activityData?.[row.id];
        return activity ? `${activity.totalBookings} bookings` : "0 bookings";
      },
      renderCell: (params: GridRenderCellParams<UserProfile>) => {
        const activity = activityData?.[params.row.id];
        if (!activity) {
          return <Box sx={{ color: "text.secondary" }}>Loading...</Box>;
        }

        return (
          <Box>
            <Box sx={{ fontWeight: "medium", fontSize: "0.875rem" }}>
              {activity.totalBookings} bookings
            </Box>
            <Box sx={{ fontSize: "0.75rem", color: "text.secondary" }}>
              Last: {formatDate(activity.lastBookingDate)}
            </Box>
          </Box>
        );
      },
    },
    {
      field: "spending",
      headerName: "Spending",
      sortable: false,
      filterable: false,
      valueGetter: (value: string | null, row: UserProfile) => {
        const activity = activityData?.[row.id];
        return activity ? activity.totalSpent : 0;
      },
      renderCell: (params: GridRenderCellParams<UserProfile>) => {
        const activity = activityData?.[params.row.id];
        if (!activity) {
          return <Box sx={{ color: "text.secondary" }}>Loading...</Box>;
        }

        return (
          <Box sx={{ fontWeight: "medium" }}>
            {formatCurrency(activity.totalSpent)}
          </Box>
        );
      },
    },
    {
      field: "Actions",
      headerName: "Actions",
      width: 280,
      sortable: false,
      filterable: false,
      renderCell: (params: GridRenderCellParams<UserProfile>) => (
        <Box sx={{ display: "flex", gap: 0.5 }}>
          <Tooltip title="Voir les détails">
            <IconButton size="small" onClick={() => onShowUser(params.row)}>
              <RemoveRedEyeOutlinedIcon fontSize="small" />
            </IconButton>
          </Tooltip>
          <Tooltip title="Audit & Historique">
            <IconButton size="small" onClick={() => onShowAudit(params.row.id)}>
              <HistoryIcon fontSize="small" />
            </IconButton>
          </Tooltip>
          <Tooltip title="Réinitialiser le mot de passe">
            <IconButton
              size="small"
              onClick={() => onPasswordReset(params.row.id)}
            >
              <LockResetIcon fontSize="small" />
            </IconButton>
          </Tooltip>
          <Tooltip title="Déconnexion forcée">
            <IconButton
              size="small"
              onClick={() => onForceLogout(params.row.id)}
            >
              <ExitToAppIcon fontSize="small" />
            </IconButton>
          </Tooltip>
          <Tooltip
            title={
              params.row.account_locked
                ? "Déverrouiller le compte"
                : "Verrouiller le compte"
            }
          >
            <IconButton
              size="small"
              onClick={() =>
                params.row.account_locked
                  ? onUnlockAccount(params.row.id)
                  : onLockAccount(params.row.id)
              }
              color={params.row.account_locked ? "warning" : "default"}
            >
              {params.row.account_locked ? (
                <LockOpenIcon fontSize="small" />
              ) : (
                <LockIcon fontSize="small" />
              )}
            </IconButton>
          </Tooltip>
        </Box>
      ),
    },
  ];
};
