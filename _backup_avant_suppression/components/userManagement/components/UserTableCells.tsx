import React from "react";
import { Box, Chip, Checkbox, Tooltip } from "@mui/material";
import { Lock as LockIcon } from "@mui/icons-material";
import { GridRenderCellParams } from "@mui/x-data-grid";
import {
  UserProfile,
  UserActivityData,
  UserRole,
} from "../../../types/userManagement";
import {
  getRoleColor,
  getRoleLabel,
  calculateLockTimeRemaining,
} from "../utils/userManagementUtils";
import {
  shouldShowEarnings,
  formatFinancialAmount,
  getFinancialColor,
} from "../utils/financialUtils";
import { formatDate, formatCurrency } from "../../../utils";
import { LABELS } from "../../../constants/labels";

/**
 * Cellule de sélection avec checkbox
 */
export const SelectCell: React.FC<{
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
export const UserInfoCell: React.FC<{
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
export const RoleCell: React.FC<{
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
export const SubscriptionCell: React.FC<{
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
export const StatusCell: React.FC<{
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
      label={
        params.row.profile_validated
          ? LABELS.common.messages.validated
          : LABELS.common.status.pending
      }
      color={params.row.profile_validated ? "success" : "warning"}
      size="small"
    />
  );
};

/**
 * Cellule d'activité (adaptée selon le rôle)
 */
export const ActivityCell: React.FC<{
  params: GridRenderCellParams<UserProfile>;
  activityData: Record<string, UserActivityData> | undefined;
  currentUserRole: UserRole | null;
}> = ({ params, activityData, currentUserRole }) => {
  const activity = activityData?.[params.row.id];

  if (!activity) {
    return (
      <Box sx={{ color: "text.secondary" }}>
        {LABELS.common.messages.loading}
      </Box>
    );
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
 * Cellule de dépenses/gains (role-aware)
 * Affiche les dépenses pour travelers/clients et les gains pour providers/owners
 */
export const SpendingCell: React.FC<{
  params: GridRenderCellParams<UserProfile>;
  activityData: Record<string, UserActivityData> | undefined;
}> = ({ params, activityData }) => {
  const activity = activityData?.[params.row.id];

  if (!activity) {
    return (
      <Box sx={{ color: "text.secondary" }}>
        {LABELS.common.messages.loading}
      </Box>
    );
  }

  return (
    <Box
      sx={{
        fontWeight: "medium",
        color: getFinancialColor(params.row, activity),
      }}
    >
      {formatFinancialAmount(params.row, activity, formatCurrency)}
    </Box>
  );
};
