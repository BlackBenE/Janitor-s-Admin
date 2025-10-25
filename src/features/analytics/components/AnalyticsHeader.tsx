import React from 'react';
import { IconButton, Tooltip } from '@mui/material';
import { Refresh as RefreshIcon } from '@mui/icons-material';
import { PageHeader } from '@/shared/components';
import { ExportMenu, type ExportFormat } from '@/shared/components/ui';
import { ANALYTICS_LABELS } from '../constants';

interface AnalyticsHeaderProps {
  onRefresh?: () => void;
  onExport?: (format: ExportFormat) => void;
  isLoading?: boolean;
  hasData?: boolean;
}

export const AnalyticsHeader: React.FC<AnalyticsHeaderProps> = ({
  onRefresh,
  onExport,
  isLoading = false,
  hasData = false,
}) => {
  return (
    <PageHeader
      title={ANALYTICS_LABELS.title}
      description={ANALYTICS_LABELS.subtitle}
      actions={
        onRefresh || onExport ? (
          <>
            {onRefresh && (
              <Tooltip title={ANALYTICS_LABELS.filters.refreshData}>
                <IconButton size="large" onClick={onRefresh} disabled={isLoading}>
                  <RefreshIcon />
                </IconButton>
              </Tooltip>
            )}
            {onExport && (
              <ExportMenu
                onExport={onExport}
                formats={['csv', 'pdf']}
                disabled={isLoading || !hasData}
                isExporting={isLoading}
                tooltipTitle="Exporter les données"
              />
            )}
          </>
        ) : undefined
      }
    />
  );
};
