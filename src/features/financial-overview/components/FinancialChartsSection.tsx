import React from 'react';
import { Box, Paper, Typography } from '@mui/material';
import { AnalyticsChart } from '@/shared/components/data-display';
import { LABELS } from '@/constants/labels';
import type { MonthlyFinancialData, RevenueByCategory } from '@/types/financial';

interface FinancialChartsSectionProps {
  monthlyData: MonthlyFinancialData[];
  revenueByCategory: RevenueByCategory[];
  loading?: boolean;
}

/**
 * Section des graphiques financiers
 * - Revenus vs Dépenses (évolution mensuelle)
 * - Répartition des revenus par catégorie
 */
export const FinancialChartsSection: React.FC<FinancialChartsSectionProps> = ({
  monthlyData,
  revenueByCategory,
  loading = false,
}) => {
  // Transformation des données pour le graphique de répartition
  const categoryChartData = revenueByCategory.map((item) => ({
    name: item.category,
    value: item.amount,
    percentage: item.percentage,
  }));

  // Conversion du monthlyData pour le type attendu du composant Chart
  const monthlyChartData = monthlyData.map((item) => ({ ...item }));

  return (
    <Box sx={{ mb: 4 }}>
      <Box
        sx={{
          display: 'grid',
          gridTemplateColumns: { xs: '1fr', lg: '1fr 1fr' },
          gap: 3,
        }}
      >
        {/* Graphique 1 : Revenus vs Dépenses */}
        <Paper elevation={1} sx={{ p: 3 }}>
          <AnalyticsChart
            title={LABELS.financial.charts.revenueVsExpenses.title}
            subtitle={LABELS.financial.charts.revenueVsExpenses.subtitle}
            data={monthlyChartData as Array<Record<string, unknown>>}
            type="line"
            dataKey="revenue"
            xAxisKey="month"
            height={350}
            loading={loading}
            colors={['#10b981', '#ef4444', '#3b82f6']}
          />
        </Paper>

        {/* Graphique 2 : Répartition des revenus */}
        <Paper elevation={1} sx={{ p: 3 }}>
          <AnalyticsChart
            title={LABELS.financial.charts.revenueByCategory.title}
            subtitle={LABELS.financial.charts.revenueByCategory.subtitle}
            data={categoryChartData as Array<Record<string, unknown>>}
            type="pie"
            dataKey="value"
            xAxisKey="name"
            height={350}
            loading={loading}
            colors={['#3b82f6', '#10b981', '#f59e0b', '#8b5cf6']}
          />
        </Paper>
      </Box>
    </Box>
  );
};
