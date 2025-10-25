import React from 'react';
import { IconButton, Tooltip, CircularProgress } from '@mui/material';
import {
  Add as AddIcon,
  Download as DownloadIcon,
  Refresh as RefreshIcon,
} from '@mui/icons-material';
import { PageHeader } from '@/shared/components';

interface UserHeaderProps {
  activeTab: number;
  userTabs: Array<{ label: string; role: any }>;
  onCreateUser: () => void;
  onExportUsers: (format: 'csv') => Promise<void>;
  onRefresh: () => void;
  isFetching?: boolean;
}

export const UserHeader: React.FC<UserHeaderProps> = ({
  activeTab,
  userTabs,
  onCreateUser,
  onExportUsers,
  onRefresh,
  isFetching = false,
}) => {
  return (
    <PageHeader
      title="Gestion des utilisateurs"
      description="Gérez tous les types d'utilisateurs, y compris les locataires, les propriétaires et les prestataires de services sur l'ensemble de la plateforme."
      actions={
        <>
          <Tooltip
            title={`Créer un nouveau ${
              userTabs[activeTab]?.label?.slice(0, -1)?.toLowerCase() || 'utilisateur'
            }`}
          >
            <IconButton size="large" onClick={onCreateUser}>
              <AddIcon />
            </IconButton>
          </Tooltip>
          <Tooltip title="Exporter les données en CSV">
            <IconButton onClick={() => onExportUsers('csv')} size="large">
              <DownloadIcon />
            </IconButton>
          </Tooltip>
          <Tooltip title="Actualiser les utilisateurs">
            <IconButton onClick={onRefresh} disabled={isFetching} size="large">
              {isFetching ? <CircularProgress size={24} /> : <RefreshIcon />}
            </IconButton>
          </Tooltip>
        </>
      }
    />
  );
};
