import React from 'react';
import { Box, Typography, Chip, useTheme, CircularProgress } from '@mui/material';
import {
  TrendingUp,
  TrendingDown,
  TrendingFlat,
  People,
  AttachMoney,
  EventNote,
} from '@mui/icons-material';
import { StatsCard } from '@/shared/components/cards';

interface MetricCardProps {
  title: string;
  value: string | number;
  change?: number;
  changeLabel?: string;
  icon?: React.ComponentType<any>;
  loading?: boolean;
  format?: 'number' | 'currency' | 'percentage';
  color?: 'primary' | 'secondary' | 'success' | 'warning' | 'error';
}

const MetricCard: React.FC<MetricCardProps> = ({
  title,
  value,
  change,
  changeLabel,
  icon,
  loading = false,
  format = 'number',
  color = 'primary',
}) => {
  const formatValue = (val: string | number): string => {
    if (typeof val === 'string') return val;

    switch (format) {
      case 'currency':
        return new Intl.NumberFormat('fr-FR', {
          style: 'currency',
          currency: 'EUR',
        }).format(val);
      case 'percentage':
        return `${val.toFixed(1)}%`;
      default:
        return new Intl.NumberFormat('fr-FR').format(val);
    }
  };

  const getTrendingType = (): 'up' | 'down' | 'neutral' => {
    if (change === undefined) return 'neutral';
    if (change > 0) return 'up';
    if (change < 0) return 'down';
    return 'neutral';
  };

  const progressText =
    change !== undefined
      ? `${change > 0 ? '+' : ''}${change.toFixed(1)}% ${changeLabel || ''}`
      : changeLabel;

  return (
    <StatsCard
      title={title}
      value={formatValue(value)}
      icon={icon}
      iconColor={color}
      progressText={progressText}
      showTrending={change !== undefined}
      trendingType={getTrendingType()}
      loading={loading}
      variant="outlined"
    />
  );
};

interface MetricsSummarySimplifiedProps {
  userMetrics: {
    totalUsers: number;
    activeUsers: number;
    newUsers: number;
    growthRate: number;
  };
  revenueMetrics: {
    totalRevenue: number;
    monthlyRevenue: number;
    averageOrderValue: number;
    revenueGrowthRate: number;
  };
  activityMetrics: {
    totalBookings: number;
    completedBookings: number;
    cancelledBookings: number;
    activeServices: number;
    activeUsersGrowthRate?: number;
    bookingsGrowthRate?: number;
    cancellationRateChange?: number;
    currentCancellationRate?: number;
  };
  loading?: boolean;
}

/**
 * Version simplifiée avec seulement les 6 métriques essentielles
 */
const MetricsSummarySimplified: React.FC<MetricsSummarySimplifiedProps> = ({
  userMetrics,
  revenueMetrics,
  activityMetrics,
  loading = false,
}) => {
  const cancelationRate =
    activityMetrics.totalBookings > 0
      ? (activityMetrics.cancelledBookings / activityMetrics.totalBookings) * 100
      : 0;

  return (
    <Box
      sx={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))',
        gap: 3,
        mb: 4,
      }}
    >
      {/* KPIs Essentiels */}
      <MetricCard
        title="Utilisateurs Total"
        value={userMetrics.totalUsers}
        change={userMetrics.growthRate}
        changeLabel="croissance"
        icon={People}
        loading={loading}
        color="primary"
      />

      <MetricCard
        title="Utilisateurs Actifs"
        value={userMetrics.activeUsers}
        change={activityMetrics.activeUsersGrowthRate}
        changeLabel="vs période précédente"
        icon={People}
        loading={loading}
        color="success"
      />

      <MetricCard
        title="Revenus Total"
        value={revenueMetrics.totalRevenue}
        change={revenueMetrics.revenueGrowthRate}
        changeLabel="croissance"
        icon={AttachMoney}
        loading={loading}
        format="currency"
        color="success"
      />

      <MetricCard
        title="Revenus Mensuels"
        value={revenueMetrics.monthlyRevenue}
        change={revenueMetrics.revenueGrowthRate}
        changeLabel="vs période précédente"
        icon={AttachMoney}
        loading={loading}
        format="currency"
        color="primary"
      />

      <MetricCard
        title="Réservations Total"
        value={activityMetrics.totalBookings}
        change={activityMetrics.bookingsGrowthRate}
        changeLabel="croissance"
        icon={EventNote}
        loading={loading}
        color="primary"
      />

      <MetricCard
        title="Taux d'Annulation"
        value={activityMetrics.currentCancellationRate || cancelationRate}
        change={activityMetrics.cancellationRateChange}
        changeLabel="évolution"
        icon={EventNote}
        loading={loading}
        format="percentage"
        color="error"
      />
    </Box>
  );
};

export default MetricsSummarySimplified;
