import React from 'react';
import { Grid } from '@mui/material';
import { DashboardItem, InfoCard } from '@/shared/components/data-display';
import { formatCurrency } from '@/shared/utils';
import { LABELS } from '@/constants/labels';
import type { FinancialOverview } from '@/types/financial';

interface FinancialStatsCardsProps {
  overview?: FinancialOverview;
  isLoading?: boolean;
}

export const FinancialStatsCards: React.FC<FinancialStatsCardsProps> = ({
  overview,
  isLoading = false,
}) => {
  if (!overview) return null;

  return (
    <Grid container spacing={3} sx={{ mb: 3 }}>
      <Grid size={{ xs: 12, sm: 6, md: 3 }}>
        <DashboardItem>
          <InfoCard
            title={LABELS.financial.cards.totalRevenue.title}
            value={formatCurrency(overview.totalRevenue)}
            progressText={`+${overview.revenueGrowth.toFixed(1)}%`}
            showTrending={true}
            progressTextColor="success.main"
          />
        </DashboardItem>
      </Grid>

      <Grid size={{ xs: 12, sm: 6, md: 3 }}>
        <DashboardItem>
          <InfoCard
            title={LABELS.financial.cards.totalExpenses.title}
            value={formatCurrency(overview.totalExpenses)}
            progressText={`+${overview.expensesGrowth.toFixed(1)}%`}
            showTrending={false}
            progressTextColor="warning.main"
          />
        </DashboardItem>
      </Grid>

      <Grid size={{ xs: 12, sm: 6, md: 3 }}>
        <DashboardItem>
          <InfoCard
            title={LABELS.financial.cards.netProfit.title}
            value={formatCurrency(overview.netProfit)}
            progressText={`+${overview.profitGrowth.toFixed(1)}%`}
            showTrending={true}
            progressTextColor="success.main"
          />
        </DashboardItem>
      </Grid>

      <Grid size={{ xs: 12, sm: 6, md: 3 }}>
        <DashboardItem>
          <InfoCard
            title={LABELS.financial.cards.activeSubscriptions.title}
            value={overview.activeSubscriptions}
            progressText={`+${overview.subscriptionsGrowth.toFixed(1)}%`}
            showTrending={true}
            progressTextColor="success.main"
          />
        </DashboardItem>
      </Grid>
    </Grid>
  );
};
