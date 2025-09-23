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
  RemoveRedEyeOutlined as RemoveRedEyeOutlinedIcon,
  History as HistoryIcon,
  LockReset as LockResetIcon,
  ExitToApp as ExitToAppIcon,
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
import {
  UserProfile,
  UserActivityData,
  UserTableColumnsProps,
  UserRole,
} from "../../types/userManagement";

export const createUserTableColumns = ({
  selectedUsers,
  activityData,
  currentUserRole,
  currentTabRole, // Nouvel attribut pour l'onglet actuel
  onToggleUserSelection,
  onShowUser,
  onShowAudit,
  onPasswordReset,
  onForceLogout,
  onLockAccount,
  onUnlockAccount,
  onViewBookings,
  onManageSubscription,
  onManageServices,
  onToggleVIP,
  onValidateProvider,
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
          const timeRemaining = params.row.locked_until
            ? (() => {
                const now = new Date();
                const unlockDate = new Date(params.row.locked_until);
                const diffMs = unlockDate.getTime() - now.getTime();

                if (diffMs <= 0) {
                  return "Expiré";
                }

                const diffHours = Math.floor(diffMs / (1000 * 60 * 60));
                const diffMinutes = Math.floor(
                  (diffMs % (1000 * 60 * 60)) / (1000 * 60)
                );

                if (diffHours > 0) {
                  return `${diffHours}h ${diffMinutes}m`;
                } else {
                  return `${diffMinutes}m`;
                }
              })()
            : "Permanent";

          return (
            <Tooltip
              title={`Déverrouillage: ${
                params.row.locked_until
                  ? new Date(params.row.locked_until).toLocaleString()
                  : "Permanent"
              }`}
            >
              <Chip
                label={`Locked (${timeRemaining})`}
                color="error"
                size="small"
                icon={<LockIcon fontSize="small" />}
              />
            </Tooltip>
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
      headerName:
        currentUserRole === UserRole.TRAVELER
          ? "Bookings"
          : currentUserRole === UserRole.PROPERTY_OWNER
          ? "Properties"
          : currentUserRole === UserRole.SERVICE_PROVIDER
          ? "Services"
          : "Activity",
      sortable: false,
      filterable: false,
      valueGetter: (value: string | null, row: UserProfile) => {
        const activity = activityData?.[row.id];
        if (currentUserRole === UserRole.TRAVELER) {
          return activity ? `${activity.totalBookings} bookings` : "0 bookings";
        } else if (currentUserRole === UserRole.PROPERTY_OWNER) {
          return activity
            ? `${activity.totalProperties || 0} properties`
            : "0 properties";
        } else if (currentUserRole === UserRole.SERVICE_PROVIDER) {
          return activity
            ? `${activity.totalServices || 0} services`
            : "0 services";
        }
        return activity ? `${activity.totalBookings} bookings` : "0 bookings";
      },
      renderCell: (params: GridRenderCellParams<UserProfile>) => {
        const activity = activityData?.[params.row.id];
        if (!activity) {
          return <Box sx={{ color: "text.secondary" }}>Loading...</Box>;
        }

        if (currentUserRole === UserRole.TRAVELER) {
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
        } else if (currentUserRole === UserRole.PROPERTY_OWNER) {
          return (
            <Box>
              <Box sx={{ fontWeight: "medium", fontSize: "0.875rem" }}>
                {activity.totalProperties || 0} properties
              </Box>
              <Box sx={{ fontSize: "0.75rem", color: "text.secondary" }}>
                Earnings: {formatCurrency(activity.totalEarned || 0)}
              </Box>
            </Box>
          );
        } else if (currentUserRole === UserRole.SERVICE_PROVIDER) {
          return (
            <Box>
              <Box sx={{ fontWeight: "medium", fontSize: "0.875rem" }}>
                {activity.totalServices || 0} services
              </Box>
              <Box sx={{ fontSize: "0.75rem", color: "text.secondary" }}>
                {activity.totalInterventions || 0} interventions
              </Box>
            </Box>
          );
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
      width: 200,
      sortable: false,
      filterable: false,
      renderCell: (params: GridRenderCellParams<UserProfile>) => {
        const userName = params.row.full_name || "Unnamed User";
        const [anchorEl, setAnchorEl] = React.useState<null | HTMLElement>(
          null
        );
        const open = Boolean(anchorEl);

        const handleMenuClick = (event: React.MouseEvent<HTMLElement>) => {
          setAnchorEl(event.currentTarget);
        };

        const handleMenuClose = () => {
          setAnchorEl(null);
        };

        const getSpecificActionForRole = () => {
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
            {getSpecificActionForRole()}

            {/* Indicateur de statut rapide */}
            {params.row.account_locked && (
              <Tooltip title="Account locked">
                <Box
                  sx={{
                    color: "error.main",
                    display: "flex",
                    alignItems: "center",
                  }}
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

            <Menu
              anchorEl={anchorEl}
              open={open}
              onClose={handleMenuClose}
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
                  handleMenuClose();
                }}
              >
                <ListItemIcon>
                  <HistoryIcon fontSize="small" />
                </ListItemIcon>
                <ListItemText primary="Audit & History" />
              </MenuItem>

              {/* Actions spécifiques aux Travelers */}
              {(params.row.role === "TRAVELER" ||
                params.row.role === "traveler") && (
                <MenuItem
                  onClick={() => {
                    onToggleVIP(params.row.id, !params.row.vip_subscription);
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
                    primary={
                      params.row.vip_subscription ? "Remove VIP" : "Make VIP"
                    }
                  />
                </MenuItem>
              )}

              {/* Actions spécifiques aux Property Owners */}
              {(params.row.role === "PROPERTY_OWNER" ||
                params.row.role === "property_owner") && (
                <MenuItem
                  onClick={() => {
                    onViewBookings(params.row.id, userName);
                    handleMenuClose();
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
                    onValidateProvider(
                      params.row.id,
                      !params.row.profile_validated
                    );
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
                        ? "Reject Provider"
                        : "Approve Provider"
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
                <ListItemText primary="Reset password" />
              </MenuItem>

              <MenuItem
                onClick={() => {
                  onForceLogout(params.row.id);
                  handleMenuClose();
                }}
              >
                <ListItemIcon>
                  <ExitToAppIcon fontSize="small" />
                </ListItemIcon>
                <ListItemText primary="Force logout" />
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
                    params.row.account_locked
                      ? "Unlock account"
                      : "Lock account"
                  }
                />
              </MenuItem>
            </Menu>
          </Box>
        );
      },
    },
  ];
};
