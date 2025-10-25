import { useState, useCallback } from 'react';
import { useQueryClient } from '@tanstack/react-query';
import { AnalyticsData, DateRange, ExportFormat } from '../../../types/analytics';
import { useUINotifications, useExport } from '@/shared/hooks';
import { useAnalyticsData } from './analyticsDataGenerator';

/**
 * 🎯 Hook Principal - useAnalytics (ORCHESTRATEUR)
 * 
 * ⚠️ TODO: Séparer en modules pour suivre le pattern
 * - useAnalyticsQueries.ts → queries (useAnalyticsData, etc.)
 * - useAnalyticsManagement.ts → UI state (tabs, dates, filters)
 * - useAnalytics.ts → orchestrateur
 * 
 * Pour l'instant, tout est dans ce fichier (fonctionne mais moins scalable)
 */
export const useAnalytics = () => {
  const { showNotification } = useUINotifications();
  const { exportToCSV } = useExport();
  const queryClient = useQueryClient();

  // État de base
  const [state, setState] = useState({
    tabValue: 0,
    dateRange: {
      from: new Date(new Date().setMonth(new Date().getMonth() - 3)),
      to: new Date(),
    },
  });

  // Récupérer les données analytics depuis Supabase
  const { data: analyticsData, isLoading, refetch } = useAnalyticsData(state.dateRange);

  // Handlers pour l'état
  const handleTabChange = useCallback((newValue: number) => {
    setState((prev) => ({ ...prev, tabValue: newValue }));
  }, []);

  const handleDateRangeChange = useCallback((dateRange: DateRange) => {
    setState((prev) => ({ ...prev, dateRange }));
    // Le changement de dateRange va automatiquement recalculer les données filtrées
    // Pas besoin d'invalider le cache car le filtrage se fait en mémoire dans analyticsQueries
  }, []);

  // Export des données - simplifié en CSV uniquement
  const exportData = useCallback(
    async (format: ExportFormat) => {
      try {
        if (!analyticsData) {
          showNotification('Aucune donnée à exporter', 'warning');
          return;
        }

        // Pour l'instant, on supporte uniquement CSV avec useExport
        // Les autres formats nécessiteraient une implémentation spécifique
        if (format !== 'csv') {
          showNotification(`Le format ${format} n'est pas encore supporté`, 'warning');
          return;
        }

        // Préparer les données pour l'export
        const columns = [
          { key: 'metric', label: 'Métrique' },
          { key: 'value', label: 'Valeur' },
        ];

        const flatData = [
          { metric: 'Total Users', value: analyticsData.userMetrics.totalUsers },
          { metric: 'Active Users', value: analyticsData.userMetrics.activeUsers },
          { metric: 'Total Revenue', value: analyticsData.revenueMetrics.totalRevenue },
          { metric: 'Total Bookings', value: analyticsData.activityMetrics.totalBookings },
          { metric: 'Active Services', value: analyticsData.activityMetrics.activeServices },
        ];

        exportToCSV(flatData, columns, { filename: `analytics-${Date.now()}` });
        showNotification('Export réussi', 'success');
      } catch (err) {
        console.error('Export error:', err);
        showNotification("Erreur lors de l'export", 'error');
      }
    },
    [exportToCSV, analyticsData, showNotification]
  );

  // Refresh des données
  const refreshData = useCallback(() => {
    refetch();
  }, [refetch]);

  return {
    // État
    state,
    data: analyticsData,
    loading: isLoading,
    error: null,

    // Actions
    handleTabChange,
    handleDateRangeChange,
    exportData,
    refreshData,

    // Données spécifiques pour faciliter l'accès
    userMetrics: analyticsData?.userMetrics || {
      totalUsers: 0,
      activeUsers: 0,
      newUsers: 0,
      userGrowthRate: 0,
    },
    revenueMetrics: analyticsData?.revenueMetrics || {
      totalRevenue: 0,
      monthlyRevenue: 0,
      averageOrderValue: 0,
      revenueGrowthRate: 0,
    },
    activityMetrics: analyticsData?.activityMetrics || {
      totalBookings: 0,
      completedBookings: 0,
      cancelledBookings: 0,
      activeServices: 0,
    },
    chartData: {
      userGrowth: analyticsData?.userGrowthData || [],
      bookingTrends: analyticsData?.bookingTrends || [],
      topServices: analyticsData?.topServices || [],
      bookingsByStatus: analyticsData?.usersByStatus || [],
    },
  };
};

export default useAnalytics;
