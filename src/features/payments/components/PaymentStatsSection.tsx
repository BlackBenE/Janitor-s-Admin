import React from 'react';
import { Alert, Grid } from '@mui/material';
import { StatsCard, DashboardItem } from '@/shared/components';
import { PaymentStats } from '@/types/payments';
import { formatCurrency } from '@/shared/utils';
import { COMMON_LABELS } from '@/shared/constants';

interface PaymentStatsSectionProps {
  stats: PaymentStats;
  error?: Error | null;
}

const PaymentStatsCards: React.FC<{
  stats: PaymentStats;
  formatCurrency: (amount: number) => string;
}> = ({ stats, formatCurrency }) => {
  // Utilisation des stats pré-calculées
  const { totalPayments, paidPayments, pendingPayments, monthlyRevenue } = stats;

  const paidPercentage = totalPayments > 0 ? Math.round((paidPayments / totalPayments) * 100) : 0;
  const pendingPercentage =
    totalPayments > 0 ? Math.round((pendingPayments / totalPayments) * 100) : 0;

  return (
    <Grid container spacing={3} sx={{ width: '100%', display: 'flex', mb: 3 }}>
      <Grid size={{ xs: 12, sm: 6, md: 3 }}>
        <DashboardItem>
          <StatsCard
            title="Total des paiements"
            value={totalPayments}
            progressText="Tous paiements"
            showTrending={false}
            variant="outlined"
          />
        </DashboardItem>
      </Grid>

      <Grid size={{ xs: 12, sm: 6, md: 3 }}>
        <DashboardItem>
          <StatsCard
            title="Payés & Réussis"
            value={paidPayments}
            progressText={`${paidPercentage}% terminés`}
            showTrending={false}
            variant="outlined"
          />
        </DashboardItem>
      </Grid>

      <Grid size={{ xs: 12, sm: 6, md: 3 }}>
        <DashboardItem>
          <StatsCard
            title="En attente"
            value={pendingPayments}
            progressText={`${pendingPercentage}% à traiter`}
            showTrending={false}
            variant="outlined"
          />
        </DashboardItem>
      </Grid>

      <Grid size={{ xs: 12, sm: 6, md: 3 }}>
        <DashboardItem>
          <StatsCard
            title="Revenus mensuels"
            value={formatCurrency(monthlyRevenue)}
            progressText="20% bookings + 100% subscriptions"
            showTrending={false}
            variant="outlined"
          />
        </DashboardItem>
      </Grid>

      {stats.failedPayments > 0 && (
        <Grid size={{ xs: 12, sm: 6, md: 3 }}>
          <DashboardItem>
            <StatsCard
              title="Paiements échoués"
              value={stats.failedPayments}
              progressText={`${Math.round((stats.failedPayments / totalPayments) * 100)}% échoués`}
              showTrending={false}
              variant="outlined"
            />
          </DashboardItem>
        </Grid>
      )}
    </Grid>
  );
};

export const PaymentStatsSection: React.FC<PaymentStatsSectionProps> = ({ stats, error }) => {
  return (
    <>
      {/* Cartes de statistiques globales */}
      <PaymentStatsCards stats={stats} formatCurrency={formatCurrency} />

      {/* Message d'erreur */}
      {error && (
        <Alert severity="error" sx={{ mb: 2 }}>
          Erreur lors du chargement des paiements :{' '}
          {error instanceof Error ? error.message : COMMON_LABELS.messages.unknownError}
        </Alert>
      )}
    </>
  );
};
