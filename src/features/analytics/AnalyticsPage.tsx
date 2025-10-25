import React, { useState } from 'react';
import { Box, Typography, Button } from '@mui/material';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFns';
import { fr } from 'date-fns/locale';
import { AdminLayout } from '@/shared/components/layout';
import {
  AnalyticsHeader,
  AnalyticsFiltersSection,
  AnalyticsStatsSection,
  AnalyticsTabsSection,
} from './components';
import { useAnalytics } from './hooks';
import { ANALYTICS_LABELS } from './constants';

/**
 * Page Analytics - Refactorisée en sections modulaires
 */
export const AnalyticsPage: React.FC = () => {
  const {
    state,
    data,
    loading,
    error,
    userMetrics,
    revenueMetrics,
    activityMetrics,
    chartData,
    handleTabChange,
    handleDateRangeChange,
    exportData,
    refreshData,
  } = useAnalytics();

  const handleExport = (format: 'csv' | 'pdf' | 'excel') => {
    try {
      exportData(format);
    } catch (error) {
      console.error('Export error:', error);
    }
  };

  const handleTabChangeWrapper = (_: React.SyntheticEvent, newValue: number) => {
    handleTabChange(newValue);
  };

  const handleDateRangeChangeWrapper = (range: { from?: Date; to?: Date }) => {
    const dateRange = {
      from: range.from || state.dateRange.from,
      to: range.to || state.dateRange.to,
    };
    handleDateRangeChange(dateRange);
  };

  if (error) {
    return (
      <AdminLayout>
        <Box sx={{ p: 3 }}>
          <Typography color="error">
            {ANALYTICS_LABELS.messages.loadingError}: {error}
          </Typography>
          <Button onClick={refreshData} sx={{ mt: 2 }}>
            {ANALYTICS_LABELS.messages.retry}
          </Button>
        </Box>
      </AdminLayout>
    );
  }

  return (
    <AdminLayout>
      <LocalizationProvider dateAdapter={AdapterDateFns} adapterLocale={fr}>
        <Box sx={{ p: 3 }}>
          {/* Header avec actions */}
          <AnalyticsHeader
            onRefresh={refreshData}
            onExport={handleExport}
            isLoading={loading}
            hasData={!!data}
          />

          {/* Filters (seulement les filtres de date) */}
          <AnalyticsFiltersSection
            dateRange={state.dateRange}
            onDateRangeChange={handleDateRangeChangeWrapper}
            isLoading={loading}
          />

          {/* Metrics Summary */}
          <AnalyticsStatsSection
            data={data}
            userMetrics={userMetrics}
            revenueMetrics={revenueMetrics}
            activityMetrics={activityMetrics}
            loading={loading}
          />

          {/* Charts Tabs */}
          <AnalyticsTabsSection
            tabValue={state.tabValue}
            onTabChange={handleTabChangeWrapper}
            chartData={chartData}
            loading={loading}
          />
        </Box>
      </LocalizationProvider>
    </AdminLayout>
  );
};

export default AnalyticsPage;
