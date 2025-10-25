import React from 'react';
import { Box, Chip, Checkbox, Tooltip, Typography } from '@mui/material';
import { Lock as LockIcon } from '@mui/icons-material';
import {
  Delete as DeleteIcon,
  CheckCircle as ValidateIcon,
  Pending as PendingIcon,
  Block as SuspendIcon,
  CheckCircleOutline as UnsuspendIcon,
  SupervisorAccount as RoleIcon,
  WorkspacePremium as VipIcon,
} from '@mui/icons-material';
import { GridRenderCellParams } from '@mui/x-data-grid';
import {
  DataTableContainer,
  DataTableSearch,
  DataTableTabs,
  DataTableView,
  DataTableTab,
} from '@/shared/components';
import { UserProfile, USER_TABS, UserActivityData, UserRole } from '@/types/userManagement';
import { UserTableActionsHub } from './UserTableActionsHub';
import {
  getRoleColor,
  getRoleLabel,
  calculateLockTimeRemaining,
  getActivityHeaderName,
} from '../utils/userManagementUtils';
import { formatDate, formatCurrency } from '@/utils';
import { USERS_LABELS } from '@/features/users/constants';
import { COMMON_LABELS } from '@/shared/constants';

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
  onTabChange: (event: React.MouseEvent<HTMLElement>, newValue: number | null) => void;

  // Selection & Actions
  selectedUsers: string[];
  onToggleUserSelection: (userId: string) => void;
  onClearSelection: () => void;
  onBulkValidate: () => void;
  onBulkSetPending: () => void;
  onBulkSuspend: () => void;
  onBulkUnsuspend: () => void;
  onBulkAction: (actionType: 'delete' | 'role' | 'vip') => void;
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
  <Box
    sx={{
      display: 'flex',
      flexDirection: 'column',
      gap: 0,
      height: '100%',
      justifyContent: 'center',
    }}
  >
    <Typography
      variant="body2"
      fontWeight="medium"
      sx={{ lineHeight: 1.1, margin: 0, padding: 0 }}
    >
      {params.row.full_name || USERS_LABELS.unnamedUser}
    </Typography>
    <Typography
      variant="caption"
      color="text.secondary"
      sx={{ lineHeight: 1.1, margin: 0, padding: 0 }}
    >
      {params.row.email}
    </Typography>
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
    label={params.row.vip_subscription ? 'VIP' : USERS_LABELS.subscription.standard}
    color={params.row.vip_subscription ? 'warning' : 'default'}
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
        title={`${USERS_LABELS.status.unlockAt}: ${
          params.row.locked_until
            ? new Date(params.row.locked_until).toLocaleString()
            : USERS_LABELS.status.permanent
        }`}
      >
        <Chip
          label={`${COMMON_LABELS.status.locked} (${timeRemaining})`}
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
        params.row.profile_validated ? USERS_LABELS.status.validated : USERS_LABELS.status.pending
      }
      color={params.row.profile_validated ? 'success' : 'warning'}
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
    return <Box sx={{ color: 'text.secondary' }}>{COMMON_LABELS.messages.loading}</Box>;
  }

  if (currentUserRole === UserRole.TRAVELER) {
    return (
      <Box>
        <Box sx={{ fontWeight: 'medium', fontSize: '0.875rem' }}>
          {activity.totalBookings} {USERS_LABELS.activity.bookings.toLowerCase()}
        </Box>
        <Box sx={{ fontSize: '0.75rem', color: 'text.secondary' }}>
          {USERS_LABELS.activity.lastBooking}: {formatDate(activity.lastBookingDate)}
        </Box>
      </Box>
    );
  } else if (currentUserRole === UserRole.PROPERTY_OWNER) {
    return (
      <Box>
        <Box sx={{ fontWeight: 'medium', fontSize: '0.875rem' }}>
          {activity.totalProperties || 0} {USERS_LABELS.activity.properties.toLowerCase()}
        </Box>
        <Box sx={{ fontSize: '0.75rem', color: 'text.secondary' }}>
          {USERS_LABELS.activity.earnings}: {formatCurrency(activity.totalEarned || 0)}
        </Box>
      </Box>
    );
  } else if (currentUserRole === UserRole.SERVICE_PROVIDER) {
    return (
      <Box>
        <Box sx={{ fontWeight: 'medium', fontSize: '0.875rem' }}>
          {activity.totalServices || 0} {USERS_LABELS.activity.services.toLowerCase()}
        </Box>
        <Box sx={{ fontSize: '0.75rem', color: 'text.secondary' }}>
          {activity.totalInterventions || 0} {USERS_LABELS.activity.interventions.toLowerCase()}
        </Box>
      </Box>
    );
  }

  return (
    <Box>
      <Box sx={{ fontWeight: 'medium', fontSize: '0.875rem' }}>
        {activity.totalBookings} {USERS_LABELS.activity.bookings.toLowerCase()}
      </Box>
      <Box sx={{ fontSize: '0.75rem', color: 'text.secondary' }}>
        {USERS_LABELS.activity.lastBooking}: {formatDate(activity.lastBookingDate)}
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
    return <Box sx={{ color: 'text.secondary' }}>{COMMON_LABELS.messages.loading}</Box>;
  }

  return <Box sx={{ fontWeight: 'medium' }}>{formatCurrency(activity.totalSpent)}</Box>;
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
  onClearSelection,
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
      field: 'select',
      headerName: '',
      width: 50,
      sortable: false,
      filterable: false,
      disableColumnMenu: true,
      renderCell: (params: GridRenderCellParams<UserProfile>) => (
        <SelectCell
          params={params}
          selectedUsers={selectedUsers}
          onToggleUserSelection={onToggleUserSelection}
        />
      ),
    },
    {
      field: 'full_name',
      headerName: USERS_LABELS.table.headers.name,
      minWidth: 200,
      flex: 1,
      valueGetter: (value: string | null, row: UserProfile) =>
        `${row.full_name || USERS_LABELS.unnamedUser} ${row.email}`,
      renderCell: (params: GridRenderCellParams<UserProfile>) => <UserInfoCell params={params} />,
    },
    {
      field: 'role',
      headerName: USERS_LABELS.table.headers.role,
      valueGetter: (value: string) => value?.replace('_', ' ') || '',
      renderCell: (params: GridRenderCellParams<UserProfile>) => <RoleCell params={params} />,
    },
    {
      field: 'vip_subscription',
      headerName: USERS_LABELS.table.headers.subscription,
      valueGetter: (value: boolean) => (value ? 'VIP' : USERS_LABELS.subscription.standard),
      renderCell: (params: GridRenderCellParams<UserProfile>) => (
        <SubscriptionCell params={params} />
      ),
    },
    {
      field: 'profile_validated',
      headerName: USERS_LABELS.table.headers.status,
      valueGetter: (value: boolean, row: UserProfile) => {
        if (row.account_locked) return COMMON_LABELS.status.locked;
        return value ? USERS_LABELS.status.validated : USERS_LABELS.status.pending;
      },
      renderCell: (params: GridRenderCellParams<UserProfile>) => <StatusCell params={params} />,
    },
    {
      field: 'activity',
      headerName: getActivityHeaderName(currentUserRole),
      sortable: false,
      filterable: false,
      valueGetter: (value: string | null, row: UserProfile) => {
        const activity = activityData?.[row.id];
        if (currentUserRole === UserRole.TRAVELER) {
          return activity
            ? `${activity.totalBookings} ${USERS_LABELS.activity.bookings.toLowerCase()}`
            : `0 ${USERS_LABELS.activity.bookings.toLowerCase()}`;
        } else if (currentUserRole === UserRole.PROPERTY_OWNER) {
          return activity
            ? `${activity.totalProperties || 0} ${USERS_LABELS.activity.properties.toLowerCase()}`
            : `0 ${USERS_LABELS.activity.properties.toLowerCase()}`;
        } else if (currentUserRole === UserRole.SERVICE_PROVIDER) {
          return activity
            ? `${activity.totalServices || 0} ${USERS_LABELS.activity.services.toLowerCase()}`
            : `0 ${USERS_LABELS.activity.services.toLowerCase()}`;
        }
        return activity
          ? `${activity.totalBookings} ${USERS_LABELS.activity.bookings.toLowerCase()}`
          : `0 ${USERS_LABELS.activity.bookings.toLowerCase()}`;
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
      field: 'spending',
      headerName: USERS_LABELS.table.headers.spending,
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
      field: 'Actions',
      headerName: USERS_LABELS.table.headers.actions,
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

  const tabs: DataTableTab[] = USER_TABS.map((tab) => {
    const isDeletedTab = (tab.role as any) === 'deleted';
    const isAdminTab = tab.role === 'admin';
    const isAllTab = tab.role === null;

    return {
      key: tab.role?.toString() || 'all',
      label: tab.label,
      icon: React.createElement(tab.icon),
      filterFn: isAllTab
        ? (user: UserProfile) => user.role !== 'admin' && !user.deleted_at
        : isDeletedTab
          ? (user: UserProfile) => !!user.deleted_at
          : (user: UserProfile) => user.role === tab.role && !user.deleted_at,
      badge: (data: UserProfile[]) => {
        if (isDeletedTab) return rawDeletedUsers?.length || 0;
        if (isAdminTab) return rawAdminUsers?.length || 0;
        if (isAllTab) return (rawActiveUsers || []).filter((u) => u.role !== 'admin').length;
        return (rawActiveUsers || []).filter((u) => u.role === tab.role).length;
      },
      badgeColor: isDeletedTab ? 'error' : isAdminTab ? 'warning' : 'primary',
    };
  });

  return (
    <DataTableContainer
      title="Tous les utilisateurs"
      description="Gérez les utilisateurs de toutes les catégories grâce à des vues spécialisées."
    >
      {/* 🆕 Recherche avec filtres */}
      <DataTableSearch
        searchValue={filters.search || ''}
        onSearchChange={(value) => onUpdateFilter('search', value)}
        searchPlaceholder="Rechercher par nom, email..."
      />

      {/* 🆕 Onglets avec badges */}
      <DataTableTabs tabs={tabs} activeTab={activeTab} onTabChange={onTabChange} data={allUsers} />

      {/* 🆕 Tableau avec états et bulk actions */}
      <DataTableView
        columns={columns}
        data={filteredUsers}
        loading={isLoading}
        emptyStateMessage={`Aucun ${USER_TABS[activeTab]?.label?.toLowerCase() || 'utilisateur'} trouvé`}
        height={500}
        selectionModel={selectedUsers}
        onSelectionChange={(newSelection) => {
          // La sélection est gérée manuellement via les checkboxes dans les cellules
        }}
        onClearSelection={onClearSelection}
        bulkActions={[
          {
            key: 'validate',
            label: 'Valider',
            icon: <ValidateIcon />,
            onClick: (ids) => onBulkValidate(),
            color: 'success',
            variant: 'outlined',
          },
          {
            key: 'pending',
            label: 'En attente',
            icon: <PendingIcon />,
            onClick: (ids) => onBulkSetPending(),
            color: 'warning',
            variant: 'outlined',
          },
          {
            key: 'suspend',
            label: 'Suspendre',
            icon: <SuspendIcon />,
            onClick: (ids) => onBulkSuspend(),
            color: 'error',
            variant: 'outlined',
          },
          {
            key: 'unsuspend',
            label: 'Réactiver',
            icon: <UnsuspendIcon />,
            onClick: (ids) => onBulkUnsuspend(),
            color: 'info',
            variant: 'outlined',
          },
          {
            key: 'role',
            label: 'Changer rôle',
            icon: <RoleIcon />,
            onClick: (ids) => onBulkAction('role'),
            color: 'info',
            variant: 'outlined',
          },
          {
            key: 'add-vip',
            label: 'Ajouter VIP',
            icon: <VipIcon />,
            onClick: (ids) => onBulkAddVip(),
            color: 'warning',
            variant: 'outlined',
          },
          {
            key: 'remove-vip',
            label: 'Retirer VIP',
            icon: <VipIcon />,
            onClick: (ids) => onBulkRemoveVip(),
            color: 'secondary',
            variant: 'outlined',
          },
          {
            key: 'delete',
            label: 'Supprimer',
            icon: <DeleteIcon />,
            onClick: (ids) => onBulkAction('delete'),
            color: 'error',
            variant: 'contained',
          },
        ]}
      />
    </DataTableContainer>
  );
};
