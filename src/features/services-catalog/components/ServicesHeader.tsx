import React from 'react';
import { IconButton, Tooltip } from '@mui/material';
import {
  Download as DownloadIcon,
  Refresh as RefreshIcon,
  Add as AddIcon,
} from '@mui/icons-material';
import { PageHeader } from '@/shared/components/layout';

interface ServicesHeaderProps {
  onRefresh: () => void;
  onExport: () => Promise<void>;
  onAddService: () => void;
  isLoading?: boolean;
}

export const ServicesHeader: React.FC<ServicesHeaderProps> = ({
  onRefresh,
  onExport,
  onAddService,
  isLoading = false,
}) => {
  const actions = (
    <>
      <Tooltip title="Ajouter un service">
        <IconButton onClick={onAddService} disabled={isLoading}>
          <AddIcon />
        </IconButton>
      </Tooltip>

      <Tooltip title="Actualiser les données">
        <IconButton onClick={onRefresh} disabled={isLoading}>
          <RefreshIcon />
        </IconButton>
      </Tooltip>

      <Tooltip title="Exporter les services sélectionnés">
        <IconButton onClick={onExport} disabled={isLoading}>
          <DownloadIcon />
        </IconButton>
      </Tooltip>
    </>
  );

  return (
    <PageHeader
      title="Catalogue des Services"
      description="Gérez tous les services proposés sur la plateforme"
      actions={actions}
    />
  );
};
