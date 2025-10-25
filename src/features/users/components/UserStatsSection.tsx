import React from 'react';
import { Alert, Box } from '@mui/material';
import {
  People as PeopleIcon,
  CheckCircle as CheckCircleIcon,
  AccessTime as AccessTimeIcon,
  Star as StarIcon,
} from '@mui/icons-material';
import { StatsCard, DashboardItem } from '@/shared/components';
import { UserProfile } from '@/types/userManagement';
import { COMMON_LABELS } from '@/shared/constants';
import { USERS_LABELS } from '../constants';
import { isActiveUser, isPendingUser } from '@/utils/userMetrics';

interface UserActivityData {
  userId: string;
  totalBookings: number;
  lastBookingDate: string | null;
  totalSpent: number;
  completedBookings: number;
  pendingBookings: number;
}

interface UserStatsSectionProps {
  allUsers: UserProfile[];
  activityData: Record<string, UserActivityData> | undefined;
  error?: Error | null;
}

const UserStatsCards: React.FC<{
  filteredUsers: UserProfile[];
  activityData: Record<string, UserActivityData> | undefined;
}> = ({ filteredUsers, activityData }) => {
  // 🎯 CORRECTION: Calculer sur TOUS les utilisateurs (non-supprimés) pour cohérence avec Analytics
  // Analytics compte tous les utilisateurs créés jusqu'à la fin de la période.
  // UserManagement doit montrer la même métrique stable : tous utilisateurs non-supprimés,
  // peu importe l'onglet actif (Tous/Voyageurs/Propriétaires/etc).
  // Note: filteredUsers contient déjà tous les utilisateurs (allUsers) dans le contexte parent
  const allNonDeletedUsers = filteredUsers.filter((u) => !u.deleted_at);
  const totalUsers = allNonDeletedUsers.length;

  // Utiliser les fonctions standardisées pour calculer les métriques
  const activeUsers = allNonDeletedUsers.filter(isActiveUser).length;
  const pendingValidations = allNonDeletedUsers.filter(isPendingUser).length;

  // 🎯 NOUVEAU: Compter les utilisateurs VIP (métrique stable, plus pertinente que "Revenu total")
  const vipUsers = allNonDeletedUsers.filter((u) => u.vip_subscription).length;

  const monthlyGrowth = '+12.5%';
  const activeGrowth = '+8.3%';

  return (
    <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 3, mb: 3 }}>
      <Box sx={{ flex: '1 1 220px' }}>
        <DashboardItem>
          <StatsCard
            title={USERS_LABELS.messages.totalUsers}
            value={totalUsers.toString()}
            progressText={monthlyGrowth}
            icon={PeopleIcon}
            variant="outlined"
            showTrending={false}
          />
        </DashboardItem>
      </Box>

      <Box sx={{ flex: '1 1 220px' }}>
        <DashboardItem>
          <StatsCard
            title={USERS_LABELS.messages.activeUsers}
            value={activeUsers.toString()}
            progressText={activeGrowth}
            icon={CheckCircleIcon}
            variant="outlined"
            showTrending={false}
          />
        </DashboardItem>
      </Box>

      <Box sx={{ flex: '1 1 220px' }}>
        <DashboardItem>
          <StatsCard
            title={USERS_LABELS.messages.pendingValidations}
            value={pendingValidations.toString()}
            icon={AccessTimeIcon}
            variant="outlined"
            showTrending={false}
          />
        </DashboardItem>
      </Box>

      <Box sx={{ flex: '1 1 220px' }}>
        <DashboardItem>
          <StatsCard
            title={USERS_LABELS.messages.vipUsers}
            value={vipUsers.toString()}
            icon={StarIcon}
            variant="outlined"
            showTrending={false}
          />
        </DashboardItem>
      </Box>
    </Box>
  );
};

export const UserStatsSection: React.FC<UserStatsSectionProps> = ({
  allUsers,
  activityData,
  error,
}) => {
  return (
    <>
      {/* Cartes de statistiques globales */}
      <UserStatsCards filteredUsers={allUsers} activityData={activityData} />

      {/* Message d'erreur */}
      {error && (
        <Alert severity="error" sx={{ mb: 2 }}>
          {USERS_LABELS.messages.loadingUsersError}:{' '}
          {error instanceof Error ? error.message : COMMON_LABELS.messages.unknownError}
        </Alert>
      )}
    </>
  );
};
