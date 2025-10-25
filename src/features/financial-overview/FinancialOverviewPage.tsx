import React from 'react';
import { Box, Typography, IconButton, Tooltip } from '@mui/material';
import { AdminLayout, PageHeader } from '@/shared/components/layout';
import { LoadingIndicator } from '@/shared/components/feedback';
import { ExportMenu } from '@/shared/components/ui';
import { Refresh as RefreshIcon } from '@mui/icons-material';
import { useFinancialOverview } from './hooks';
import { FINANCIAL_LABELS } from './constants';
import {
  FinancialStatsCards,
  FinancialChartsSection,
  FinancialTransactionsTableSection,
  FinancialOwnersReportSection,
} from './components';

/**
 * Page Financial Overview - Vue d'ensemble financière
 * Affiche une vue complète des finances de Paris Janitor :
 * - Indicateurs clés (revenus, dépenses, bénéfices, abonnements)
 * - Graphiques d'évolution et de répartition
 * - Tableau des transactions
 * - Rapport consolidé par propriétaire
 */
export const FinancialOverviewPage: React.FC = () => {
  const {
    overview,
    monthlyData,
    revenueByCategory,
    transactions,
    ownersReport,
    isLoading,
    refetch,
    exportData,
  } = useFinancialOverview();

  if (isLoading) {
    return (
      <AdminLayout>
        <LoadingIndicator />
      </AdminLayout>
    );
  }

  if (!overview) {
    return (
      <AdminLayout>
        <Box>
          <Typography variant="h6">Aucune donnée disponible</Typography>
        </Box>
      </AdminLayout>
    );
  }

  return (
    <AdminLayout>
      {/* En-tête avec titre et boutons d'actions */}
      <PageHeader
        title={FINANCIAL_LABELS.title}
        description={FINANCIAL_LABELS.subtitle}
        actions={
          <>
            <Tooltip title={FINANCIAL_LABELS.actions.refresh}>
              <IconButton size="large" onClick={refetch}>
                <RefreshIcon />
              </IconButton>
            </Tooltip>
            <ExportMenu
              onExport={exportData}
              formats={['csv', 'pdf']}
              tooltipTitle={FINANCIAL_LABELS.actions.export}
            />
          </>
        }
      />

      {/* Cartes d'indicateurs clés */}
      <FinancialStatsCards overview={overview} isLoading={isLoading} />

      {/* Graphiques : Revenus vs Dépenses + Répartition des revenus */}
      <FinancialChartsSection
        monthlyData={monthlyData}
        revenueByCategory={revenueByCategory}
        loading={isLoading}
      />

      {/* Tableau des transactions financières */}
      <FinancialTransactionsTableSection transactions={transactions} loading={isLoading} />

      {/* Rapport consolidé par propriétaire */}
      <FinancialOwnersReportSection ownersReport={ownersReport} loading={isLoading} />
    </AdminLayout>
  );
};

export default FinancialOverviewPage;
