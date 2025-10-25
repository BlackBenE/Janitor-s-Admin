import React from 'react';
import { IconButton, Tooltip, CircularProgress } from '@mui/material';
import {
  Refresh as RefreshIcon,
  Add as AddIcon,
  Download as DownloadIcon,
} from '@mui/icons-material';
import { PageHeader } from '@/shared/components';
import { COMMON_LABELS } from '@/shared/constants';
import { PROPERTY_APPROVALS_LABELS } from '../constants';

interface PropertyHeaderProps {
  propertiesCount: number;
  onRefresh: () => void;
  onAddProperty: () => void;
  onExportProperties: () => void;
  isRefreshing?: boolean;
  isExportDisabled?: boolean;
}

export const PropertyHeader: React.FC<PropertyHeaderProps> = ({
  propertiesCount,
  onRefresh,
  onAddProperty,
  onExportProperties,
  isRefreshing = false,
  isExportDisabled = false,
}) => {
  return (
    <PageHeader
      title={PROPERTY_APPROVALS_LABELS.title}
      description={PROPERTY_APPROVALS_LABELS.subtitle}
      actions={
        <>
          <Tooltip title={`${PROPERTY_APPROVALS_LABELS.actions.export} (${propertiesCount})`}>
            <IconButton size="large" onClick={onExportProperties} disabled={isExportDisabled}>
              <DownloadIcon />
            </IconButton>
          </Tooltip>
          <Tooltip title={COMMON_LABELS.actions.refresh}>
            <IconButton onClick={onRefresh} disabled={isRefreshing} size="large">
              {isRefreshing ? <CircularProgress size={24} /> : <RefreshIcon />}
            </IconButton>
          </Tooltip>
        </>
      }
    />
  );
};
