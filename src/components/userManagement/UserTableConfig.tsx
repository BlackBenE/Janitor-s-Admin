import React from "react";
import { Box, Chip, Tooltip } from "@mui/material";
import {
  RemoveRedEyeOutlined as ViewIcon,
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
} from "@mui/icons-material";
import { GridRenderCellParams } from "@mui/x-data-grid";
import {
  GenericTableConfig,
  BaseItem,
  GenericAction,
  ColumnConfig,
} from "../shared/GenericTableColumns";
import {
  UserProfile,
  UserRole,
  UserActivityData,
} from "../../types/userManagement";

// =====================================================
// TYPES SPÉCIFIQUES AUX UTILISATEURS
// =====================================================

export interface UserItem extends BaseItem {
  full_name: string;
  email: string;
  role: UserRole;
  vip_subscription: boolean;
  profile_validated: boolean;
  account_locked: boolean;
  locked_until?: string;
}

export interface UserTableConfig {
  selectedUsers: string[];
  activityData?: Record<string, UserActivityData>;
  currentUserRole?: UserRole | null;
  currentTabRole?: UserRole | null;
  onToggleUserSelection: (userId: string) => void;
  onShowUser: (user: UserProfile) => void;
  onShowAudit: (userId: string) => void;
  onPasswordReset: (userId: string) => void;
  onLockAccount: (userId: string) => void;
  onUnlockAccount: (userId: string) => void;
  onViewBookings: (userId: string, userName: string) => void;
  onManageSubscription: (userId: string, userName: string) => void;
  onManageServices: (userId: string, userName: string) => void;
  onToggleVIP: (userId: string, vipStatus: boolean) => void;
  onValidateProvider: (userId: string, validated: boolean) => void;
}

// =====================================================
// UTILITAIRES
// =====================================================

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

// =====================================================
// CONFIGURATION DES COLONNES
// =====================================================

const createUserColumns = (config: UserTableConfig): ColumnConfig[] => [
  {
    field: "full_name",
    headerName: "User",
    width: 200,
    flex: 1,
    valueGetter: (value: string | null, row: BaseItem) => {
      const user = row as UserItem;
      return `${user.full_name || "Unnamed User"} ${user.email}`;
    },
    renderCell: (params: GridRenderCellParams) => (
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
    width: 120,
    valueGetter: (value: string) => value?.replace("_", " ") || "",
    renderCell: (params: GridRenderCellParams) => (
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
    width: 120,
    valueGetter: (value: boolean) => (value ? "VIP" : "Standard"),
    renderCell: (params: GridRenderCellParams) => (
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
    width: 140,
    valueGetter: (value: boolean, row: BaseItem) => {
      const user = row as UserItem;
      if (user.account_locked) return "Locked";
      return value ? "Validated" : "Pending";
    },
    renderCell: (params: GridRenderCellParams) => {
      if (params.row.account_locked) {
        const timeRemaining = params.row.locked_until
          ? (() => {
              const now = new Date();
              const unlockDate = new Date(params.row.locked_until);
              const diffMs = unlockDate.getTime() - now.getTime();

              if (diffMs <= 0) {
                return "Expired";
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
            title={`Unlock: ${
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
      config.currentUserRole === UserRole.TRAVELER
        ? "Bookings"
        : config.currentUserRole === UserRole.PROPERTY_OWNER
        ? "Properties"
        : config.currentUserRole === UserRole.SERVICE_PROVIDER
        ? "Services"
        : "Activity",
    width: 120,
    sortable: false,
    filterable: false,
    valueGetter: (value: string | null, row: BaseItem) => {
      const user = row as UserItem;
      const activity = config.activityData?.[user.id];
      if (config.currentUserRole === UserRole.TRAVELER) {
        return activity ? `${activity.totalBookings} bookings` : "0 bookings";
      } else if (config.currentUserRole === UserRole.PROPERTY_OWNER) {
        return activity
          ? `${activity.totalProperties || 0} properties`
          : "0 properties";
      } else if (config.currentUserRole === UserRole.SERVICE_PROVIDER) {
        return activity
          ? `${activity.totalServices || 0} services`
          : "0 services";
      }
      return activity ? `${activity.totalBookings} bookings` : "0 bookings";
    },
    renderCell: (params: GridRenderCellParams) => {
      const activity = config.activityData?.[params.row.id];
      if (!activity) {
        return <Box sx={{ color: "text.secondary" }}>Loading...</Box>;
      }

      if (config.currentUserRole === UserRole.TRAVELER) {
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
      } else if (config.currentUserRole === UserRole.PROPERTY_OWNER) {
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
      } else if (config.currentUserRole === UserRole.SERVICE_PROVIDER) {
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
    width: 120,
    sortable: false,
    filterable: false,
    valueGetter: (value: string | null, row: BaseItem) => {
      const user = row as UserItem;
      const activity = config.activityData?.[user.id];
      return activity ? activity.totalSpent : 0;
    },
    renderCell: (params: GridRenderCellParams) => {
      const activity = config.activityData?.[params.row.id];
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
];

// =====================================================
// CONFIGURATION DES ACTIONS
// =====================================================

const createUserPrimaryActions = (config: UserTableConfig): GenericAction[] => {
  const actions: GenericAction[] = [
    {
      id: "view",
      label: "See details",
      icon: ViewIcon,
      color: "primary",
      tooltip: "See details",
      onClick: (item: BaseItem) => config.onShowUser(item as UserProfile),
    },
  ];

  // Action spécifique selon l'onglet actuel
  if (config.currentTabRole && config.currentTabRole !== null) {
    if (config.currentTabRole === UserRole.TRAVELER) {
      actions.push({
        id: "bookings",
        label: "View Bookings",
        icon: CalendarTodayIcon,
        color: "primary",
        tooltip: "View Bookings",
        onClick: (item: BaseItem) => {
          const user = item as UserItem;
          config.onViewBookings(user.id, user.full_name || "Unnamed User");
        },
      });
    } else if (config.currentTabRole === UserRole.PROPERTY_OWNER) {
      actions.push({
        id: "subscription",
        label: "Manage Subscription",
        icon: PaymentIcon,
        color: "primary",
        tooltip: "Manage Subscription",
        onClick: (item: BaseItem) => {
          const user = item as UserItem;
          config.onManageSubscription(
            user.id,
            user.full_name || "Unnamed User"
          );
        },
      });
    } else if (config.currentTabRole === UserRole.SERVICE_PROVIDER) {
      actions.push({
        id: "services",
        label: "Manage Services",
        icon: BuildIcon,
        color: "primary",
        tooltip: "Manage Services",
        onClick: (item: BaseItem) => {
          const user = item as UserItem;
          config.onManageServices(user.id, user.full_name || "Unnamed User");
        },
      });
    } else if (config.currentTabRole === UserRole.ADMIN) {
      actions.push({
        id: "audit",
        label: "Admin Actions",
        icon: HistoryIcon,
        color: "primary",
        tooltip: "Admin Actions",
        onClick: (item: BaseItem) => config.onShowAudit(item.id),
      });
    }
  }

  return actions;
};

const createUserSecondaryActions = (
  config: UserTableConfig
): GenericAction[] => [
  {
    id: "audit",
    label: "Audit & History",
    icon: HistoryIcon,
    onClick: (item: BaseItem) => config.onShowAudit(item.id),
  },
  {
    id: "toggle-vip",
    label: "Toggle VIP",
    icon: StarIcon,
    onClick: (item: BaseItem) => {
      const user = item as UserItem;
      config.onToggleVIP(user.id, !user.vip_subscription);
    },
    visible: (item: BaseItem) => {
      const user = item as UserItem;
      return user.role === UserRole.TRAVELER;
    },
  },
  {
    id: "view-bookings",
    label: "View Bookings & Disputes",
    icon: CalendarTodayIcon,
    onClick: (item: BaseItem) => {
      const user = item as UserItem;
      config.onViewBookings(user.id, user.full_name || "Unnamed User");
    },
    visible: (item: BaseItem) => {
      const user = item as UserItem;
      return user.role === UserRole.PROPERTY_OWNER;
    },
  },
  {
    id: "validate-provider",
    label: "Toggle Provider Validation",
    icon: CheckCircleIcon,
    onClick: (item: BaseItem) => {
      const user = item as UserItem;
      config.onValidateProvider(user.id, !user.profile_validated);
    },
    visible: (item: BaseItem) => {
      const user = item as UserItem;
      return user.role === UserRole.SERVICE_PROVIDER;
    },
  },
  {
    id: "password-reset",
    label: "Reset password",
    icon: LockResetIcon,
    onClick: (item: BaseItem) => config.onPasswordReset(item.id),
  },
  {
    id: "toggle-lock",
    label: "Toggle Account Lock",
    icon: LockIcon,
    onClick: (item: BaseItem) => {
      const user = item as UserItem;
      user.account_locked
        ? config.onUnlockAccount(user.id)
        : config.onLockAccount(user.id);
    },
  },
];

// =====================================================
// FONCTION PRINCIPALE
// =====================================================

export const createUserTableConfig = (
  config: UserTableConfig
): GenericTableConfig => ({
  selectable: true,
  selectedItems: config.selectedUsers,
  onToggleSelection: config.onToggleUserSelection,

  columns: createUserColumns(config),

  primaryActions: createUserPrimaryActions(config),
  secondaryActions: createUserSecondaryActions(config),

  actionColumnWidth: 200,
  showActionsMenu: true,
});
