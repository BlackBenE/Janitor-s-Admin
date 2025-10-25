import React from 'react';
import { IconButton, Tooltip } from '@mui/material';
import { Download as DownloadIcon, Refresh as RefreshIcon } from '@mui/icons-material';
import { PageHeader } from '@/shared/components/layout';

interface PaymentHeaderProps {
  onRefresh: () => void;
  onExport: () => Promise<void>;
  isLoading?: boolean;
}

export const PaymentHeader: React.FC<PaymentHeaderProps> = ({
  onRefresh,
  onExport,
  isLoading = false,
}) => {
  const actions = (
    <>
      <Tooltip title="Actualiser les données">
        <IconButton onClick={onRefresh} disabled={isLoading}>
          <RefreshIcon />
        </IconButton>
      </Tooltip>

      <Tooltip title="Exporter les paiements sélectionnés">
        <IconButton onClick={onExport} disabled={isLoading}>
          <DownloadIcon />
        </IconButton>
      </Tooltip>
    </>
  );

  return (
    <PageHeader
      title="Gestion des Paiements"
      description="Suivez et gérez tous les paiements de la plateforme"
      actions={actions}
    />
  );
};
