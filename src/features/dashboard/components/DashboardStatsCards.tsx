import React from 'react';
import Box from '@mui/material/Box';
import { DashboardItem } from '@/shared/components/data-display';
import { StatsCard } from '@/shared/components/cards';
import { DashboardStats as DashboardStatsType } from '@/types/dashboard';
import { DASHBOARD_LABELS } from '../constants';

interface DashboardStatsCardsProps {
  stats: DashboardStatsType;
}

export const DashboardStatsCards: React.FC<DashboardStatsCardsProps> = ({ stats }) => {
  const statCards = [
    {
      title: DASHBOARD_LABELS.stats.propertyValidations,
      value: stats.pendingValidations,
      bottomLeft: DASHBOARD_LABELS.stats.pendingTotal,
    },
    {
      title: DASHBOARD_LABELS.stats.providerModeration,
      value: stats.moderationCases,
      bottomLeft: DASHBOARD_LABELS.stats.toValidate,
    },
    {
      title: DASHBOARD_LABELS.stats.activeUsers,
      value: stats.activeUsers,
      bottomLeft: DASHBOARD_LABELS.stats.last30Days,
    },
    {
      title: DASHBOARD_LABELS.stats.monthlyRevenue,
      value: `${stats.monthlyRevenue}€`,
      bottomLeft: DASHBOARD_LABELS.stats.thisMonth,
    },
  ];

  return (
    <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 3 }}>
      {statCards.map((card, index) => (
        <Box key={index} sx={{ flex: '1 1 220px' }}>
          <DashboardItem>
            <StatsCard
              title={card.title}
              value={card.value}
              description={card.bottomLeft}
              showTrending={false}
              variant="outlined"
            />
          </DashboardItem>
        </Box>
      ))}
    </Box>
  );
};
