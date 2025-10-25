import React from 'react';
import { Alert, Grid } from '@mui/material';
import { StatsCard } from '@/shared/components/cards';
import { DashboardItem } from '@/shared/components/data-display';
import { ServiceStats } from '@/types/services';
import { formatCurrency } from '@/shared/utils';

interface ServicesStatsSectionProps {
  stats: ServiceStats;
  error?: Error | null;
}

const ServicesStatsCards: React.FC<{
  stats: ServiceStats;
  formatCurrency: (amount: number) => string;
}> = ({ stats, formatCurrency }) => {
  const { totalServices, activeServices, totalProviders, totalCategories, averagePrice } = stats;

  const activePercentage =
    totalServices > 0 ? Math.round((activeServices / totalServices) * 100) : 0;

  return (
    <Grid container spacing={3} sx={{ width: '100%', display: 'flex', mb: 3 }}>
      <Grid size={{ xs: 12, sm: 6, md: 3 }}>
        <DashboardItem>
          <StatsCard
            title="Total Services"
            value={totalServices}
            progressText={`${activeServices} actifs`}
            showTrending={false}
            variant="outlined"
          />
        </DashboardItem>
      </Grid>

      <Grid size={{ xs: 12, sm: 6, md: 3 }}>
        <DashboardItem>
          <StatsCard
            title="Services Actifs"
            value={activeServices}
            progressText={`${activePercentage}% actifs`}
            showTrending={false}
            variant="outlined"
          />
        </DashboardItem>
      </Grid>

      <Grid size={{ xs: 12, sm: 6, md: 3 }}>
        <DashboardItem>
          <StatsCard
            title="Prestataires"
            value={totalProviders}
            progressText="Total prestataires"
            showTrending={false}
            variant="outlined"
          />
        </DashboardItem>
      </Grid>

      <Grid size={{ xs: 12, sm: 6, md: 3 }}>
        <DashboardItem>
          <StatsCard
            title="Prix Moyen"
            value={formatCurrency(averagePrice)}
            progressText={`${totalCategories} catégories`}
            showTrending={false}
            variant="outlined"
          />
        </DashboardItem>
      </Grid>
    </Grid>
  );
};

export const ServicesStatsSection: React.FC<ServicesStatsSectionProps> = ({ stats, error }) => {
  return (
    <>
      {/* Cartes de statistiques globales */}
      <ServicesStatsCards stats={stats} formatCurrency={formatCurrency} />

      {/* Message d'erreur */}
      {error && (
        <Alert severity="error" sx={{ mb: 2 }}>
          Erreur lors du chargement des services :{' '}
          {error instanceof Error ? error.message : 'Unknown error'}
        </Alert>
      )}
    </>
  );
};
