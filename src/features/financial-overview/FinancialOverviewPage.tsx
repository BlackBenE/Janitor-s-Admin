import React from 'react';
import { Box, Typography } from '@mui/material';
import { AdminLayout } from '@/shared/components/layout';
import { LoadingIndicator } from '@/shared/components/feedback';
import { useFinancialOverview } from './hooks';
import {
  FinancialHeader,
  FinancialStatsCards,
  FinancialChartsSection,
  FinancialTransactionsTable,
  FinancialOwnersReport,
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
      <FinancialHeader onRefresh={refetch} onExport={exportData} />

      {/* Cartes d'indicateurs clés */}
      <FinancialStatsCards overview={overview} isLoading={isLoading} />

      {/* Graphiques : Revenus vs Dépenses + Répartition des revenus */}
      <FinancialChartsSection
        monthlyData={monthlyData}
        revenueByCategory={revenueByCategory}
        loading={isLoading}
      />

      {/* Tableau des transactions financières */}
      <FinancialTransactionsTable transactions={transactions} loading={isLoading} />

      {/* Rapport consolidé par propriétaire */}
      <FinancialOwnersReport ownersReport={ownersReport} loading={isLoading} />
    </AdminLayout>
  );
};

export default FinancialOverviewPage;
