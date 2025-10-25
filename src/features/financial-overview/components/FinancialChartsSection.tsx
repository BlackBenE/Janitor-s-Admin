import React from 'react';
import { AnalyticsChart, ChartGridSection, ChartConfig } from '@/shared/components/data-display';
import { FINANCIAL_LABELS } from '../constants';
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

  // Configuration des graphiques
  const charts: ChartConfig[] = [
    {
      title: FINANCIAL_LABELS.charts.revenueVsExpenses.title,
      subtitle: FINANCIAL_LABELS.charts.revenueVsExpenses.subtitle,
      content: (
        <AnalyticsChart
          title="" // Titre géré par ChartGridSection
          data={monthlyChartData as Array<Record<string, unknown>>}
          type="line"
          dataKey="revenue"
          xAxisKey="month"
          height={350}
          loading={loading}
          colors={['#10b981', '#ef4444', '#3b82f6']}
        />
      ),
    },
    {
      title: FINANCIAL_LABELS.charts.revenueByCategory.title,
      subtitle: FINANCIAL_LABELS.charts.revenueByCategory.subtitle,
      content: (
        <AnalyticsChart
          title="" // Titre géré par ChartGridSection
          data={categoryChartData as Array<Record<string, unknown>>}
          type="pie"
          dataKey="value"
          xAxisKey="name"
          height={350}
          loading={loading}
          colors={['#3b82f6', '#10b981', '#f59e0b', '#8b5cf6']}
        />
      ),
    },
  ];

  return <ChartGridSection charts={charts} />;
};
