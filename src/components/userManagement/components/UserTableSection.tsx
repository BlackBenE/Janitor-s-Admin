import React from "react";
import { Box, Chip, Checkbox, Tooltip } from "@mui/material";
import { Lock as LockIcon } from "@mui/icons-material";
import { GridRenderCellParams } from "@mui/x-data-grid";
import DataTable from "../../Table";
import {
  UserProfile,
  USER_TABS,
  UserActivityData,
  UserRole,
} from "../../../types/userManagement";
import { UserFiltersSection } from "./UserFiltersSection";
import { UserTableActionsHub } from "./UserTableActionsHub";
import {
  getRoleColor,
  getRoleLabel,
  formatDate,
  formatCurrency,
  calculateLockTimeRemaining,
  getActivityHeaderName,
} from "../utils/userManagementUtils";

interface UserTableSectionProps {
  // Filters & Tabs
  filters: any;
  onUpdateFilter: (key: string, value: string) => void;
  activeTab: number;
  allUsers: UserProfile[]; // Pour le tableau (utilisateurs actuellement affichés)
  activeUsers: UserProfile[]; // Données filtrées par onglet
  deletedUsers: UserProfile[]; // Données filtrées par onglet
  adminUsers: UserProfile[]; // Données filtrées par onglet

  // Données brutes pour compteurs d'onglets (optionnelles pour compatibilité)
  rawActiveUsers?: UserProfile[]; // Tous les utilisateurs actifs (pour compteurs)
  rawDeletedUsers?: UserProfile[]; // Tous les utilisateurs supprimés (pour compteurs)
  rawAdminUsers?: UserProfile[]; // Tous les admins (pour compteurs)
  onTabChange: (
    event: React.MouseEvent<HTMLElement>,
    newValue: number | null
  ) => void;

  // Selection & Actions
  selectedUsers: string[];
  onToggleUserSelection: (userId: string) => void;
  onBulkValidate: () => void;
  onBulkSetPending: () => void;
  onBulkSuspend: () => void;
  onBulkUnsuspend: () => void;
  onBulkAction: (actionType: "delete" | "role" | "vip") => void;
  onBulkAddVip: () => void;
  onBulkRemoveVip: () => void;

  // Table Actions
  onShowUser: (user: UserProfile) => void;
  onShowAudit: (userId: string) => void;
  onPasswordReset: (userId: string) => void;
  onLockAccount: (userId: string) => void;
  onUnlockAccount: (userId: string) => void;
  onToggleVIP: (userId: string, isVIP: boolean) => void;
  onValidateProvider: (userId: string, approved: boolean) => void;

  // Table Data
  filteredUsers: UserProfile[];
  activityData: Record<string, UserActivityData> | undefined;
  currentUserRole: UserRole | null;
  currentTabRole: UserRole | string | null;
  isLoading: boolean;
}

// ======================== TABLE CELL COMPONENTS ========================

/**
 * Cellule de sélection avec checkbox
 */
const SelectCell: React.FC<{
  params: GridRenderCellParams<UserProfile>;
  selectedUsers: string[];
  onToggleUserSelection: (userId: string) => void;
}> = ({ params, selectedUsers, onToggleUserSelection }) => (
  <Checkbox
    checked={selectedUsers.includes(params.row.id)}
    onChange={() => onToggleUserSelection(params.row.id)}
    size="small"
  />
);

/**
 * Cellule d'informations utilisateur (nom + email)
 */
const UserInfoCell: React.FC<{
  params: GridRenderCellParams<UserProfile>;
}> = ({ params }) => (
  <Box>
    <Box sx={{ fontWeight: "medium" }}>
      {params.row.full_name || "Unnamed User"}
    </Box>
    <Box sx={{ fontSize: "0.75rem", color: "text.secondary" }}>
      {params.row.email}
    </Box>
  </Box>
);

/**
 * Cellule de rôle avec chip coloré
 */
const RoleCell: React.FC<{
  params: GridRenderCellParams<UserProfile>;
}> = ({ params }) => (
  <Chip
    label={getRoleLabel(params.row.role)}
    color={getRoleColor(params.row.role)}
    size="small"
    variant="outlined"
  />
);

/**
 * Cellule de statut VIP/Subscription
 */
const SubscriptionCell: React.FC<{
  params: GridRenderCellParams<UserProfile>;
}> = ({ params }) => (
  <Chip
    label={params.row.vip_subscription ? "VIP" : "Standard"}
    color={params.row.vip_subscription ? "warning" : "default"}
    size="small"
  />
);

/**
 * Cellule de statut (Validated/Pending/Locked)
 */
const StatusCell: React.FC<{
  params: GridRenderCellParams<UserProfile>;
}> = ({ params }) => {
  if (params.row.account_locked) {
    const timeRemaining = calculateLockTimeRemaining(params.row.locked_until);

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
};

/**
 * Cellule d'activité (adaptée selon le rôle)
 */
const ActivityCell: React.FC<{
  params: GridRenderCellParams<UserProfile>;
  activityData: Record<string, UserActivityData> | undefined;
  currentUserRole: UserRole | null;
}> = ({ params, activityData, currentUserRole }) => {
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
};

/**
 * Cellule de dépenses
 */
const SpendingCell: React.FC<{
  params: GridRenderCellParams<UserProfile>;
  activityData: Record<string, UserActivityData> | undefined;
}> = ({ params, activityData }) => {
  const activity = activityData?.[params.row.id];

  if (!activity) {
    return <Box sx={{ color: "text.secondary" }}>Loading...</Box>;
  }

  return (
    <Box sx={{ fontWeight: "medium" }}>
      {formatCurrency(activity.totalSpent)}
    </Box>
  );
};

export const UserTableSection: React.FC<UserTableSectionProps> = ({
  filters,
  onUpdateFilter,
  activeTab,
  allUsers,
  activeUsers,
  deletedUsers,
  adminUsers,
  rawActiveUsers,
  rawDeletedUsers,
  rawAdminUsers,
  onTabChange,
  selectedUsers,
  onToggleUserSelection,
  onBulkValidate,
  onBulkSetPending,
  onBulkSuspend,
  onBulkUnsuspend,
  onBulkAction,
  onBulkAddVip,
  onBulkRemoveVip,
  onShowUser,
  onShowAudit,
  onPasswordReset,
  onLockAccount,
  onUnlockAccount,
  onToggleVIP,
  onValidateProvider,
  filteredUsers,
  activityData,
  currentUserRole,
  currentTabRole,
  isLoading,
}) => {
  // ======================== TABLE COLUMNS CONFIGURATION ========================

  const columns = [
    {
      field: "select",
      headerName: "",
      width: 50,
      sortable: false,
      filterable: false,
      renderCell: (params: GridRenderCellParams<UserProfile>) => (
        <SelectCell
          params={params}
          selectedUsers={selectedUsers}
          onToggleUserSelection={onToggleUserSelection}
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
        <UserInfoCell params={params} />
      ),
    },
    {
      field: "role",
      headerName: "Role",
      valueGetter: (value: string) => value?.replace("_", " ") || "",
      renderCell: (params: GridRenderCellParams<UserProfile>) => (
        <RoleCell params={params} />
      ),
    },
    {
      field: "vip_subscription",
      headerName: "Subscription",
      valueGetter: (value: boolean) => (value ? "VIP" : "Standard"),
      renderCell: (params: GridRenderCellParams<UserProfile>) => (
        <SubscriptionCell params={params} />
      ),
    },
    {
      field: "profile_validated",
      headerName: "Status",
      valueGetter: (value: boolean, row: UserProfile) => {
        if (row.account_locked) return "Locked";
        return value ? "Validated" : "Pending";
      },
      renderCell: (params: GridRenderCellParams<UserProfile>) => (
        <StatusCell params={params} />
      ),
    },
    {
      field: "activity",
      headerName: getActivityHeaderName(currentUserRole),
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
      renderCell: (params: GridRenderCellParams<UserProfile>) => (
        <ActivityCell
          params={params}
          activityData={activityData}
          currentUserRole={currentUserRole}
        />
      ),
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
      renderCell: (params: GridRenderCellParams<UserProfile>) => (
        <SpendingCell params={params} activityData={activityData} />
      ),
    },
    {
      field: "Actions",
      headerName: "Actions",
      width: 200,
      sortable: false,
      filterable: false,
      renderCell: (params: GridRenderCellParams<UserProfile>) => (
        <UserTableActionsHub
          params={params}
          currentTabRole={currentTabRole}
          onShowUser={onShowUser}
          onShowAudit={onShowAudit}
          onPasswordReset={onPasswordReset}
          onLockAccount={onLockAccount}
          onUnlockAccount={onUnlockAccount}
          onToggleVIP={onToggleVIP}
          onValidateProvider={onValidateProvider}
        />
      ),
    },
  ];
  return (
    <Box sx={{ mt: 2, border: "1px solid #ddd", borderRadius: 4, p: 2 }}>
      {/* Section Title */}
      <h3>Tous les utilisateurs</h3>
      <p>
        Gérez les utilisateurs de toutes les catégories grâce à des vues
        spécialisées.
      </p>

      {/* Filters, Tabs, and Actions */}
      <UserFiltersSection
        filters={filters}
        onUpdateFilter={onUpdateFilter}
        activeTab={activeTab}
        users={allUsers}
        activeUsers={activeUsers}
        deletedUsers={deletedUsers}
        adminUsers={adminUsers}
        rawActiveUsers={rawActiveUsers}
        rawDeletedUsers={rawDeletedUsers}
        rawAdminUsers={rawAdminUsers}
        onTabChange={onTabChange}
        selectedUsers={selectedUsers}
        onBulkValidate={onBulkValidate}
        onBulkSetPending={onBulkSetPending}
        onBulkSuspend={onBulkSuspend}
        onBulkUnsuspend={onBulkUnsuspend}
        onBulkAction={onBulkAction}
        onBulkAddVip={onBulkAddVip}
        onBulkRemoveVip={onBulkRemoveVip}
      />

      {/* Table des utilisateurs */}
      <DataTable columns={columns} data={filteredUsers} />

      {/* Loading & Empty States */}
      {isLoading && (
        <Box sx={{ textAlign: "center", py: 2 }}>Chargement...</Box>
      )}

      {filteredUsers.length === 0 && !isLoading && (
        <Box sx={{ textAlign: "center", py: 2, color: "text.secondary" }}>
          Aucun {USER_TABS[activeTab]?.label?.toLowerCase() || "utilisateur"}{" "}
          trouvé
        </Box>
      )}
    </Box>
  );
};
