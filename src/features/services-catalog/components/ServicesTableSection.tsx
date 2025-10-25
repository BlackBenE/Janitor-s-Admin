import React from 'react';
import { Snackbar, Alert } from '@mui/material';
import {
  DataTableContainer,
  DataTableSearch,
  DataTableTabs,
  DataTableView,
  DataTableTab,
} from '@/shared/components';
import { ServiceWithDetails } from '@/types/services';
import { serviceTabConfigs } from '@/shared/config';

interface ServicesTableSectionProps {
  // Data
  services: ServiceWithDetails[];
  transformedData: ServiceWithDetails[];
  columns: any[];

  // State
  activeTab: number;
  isLoading: boolean;

  // Management hook
  serviceManagement: any;

  // Tabs
  onTabChange: (event: React.MouseEvent<HTMLElement>, newValue: number | null) => void;

  // Bulk actions (optional)
  bulkActivateServices?: (ids: string[]) => Promise<any>;
  bulkDeactivateServices?: (ids: string[]) => Promise<any>;
  deleteManyServices?: (ids: string[]) => Promise<any>;
}

export const ServicesTableSection: React.FC<ServicesTableSectionProps> = ({
  // Data
  services,
  transformedData,
  columns,

  // State
  activeTab,
  isLoading,

  // Management
  serviceManagement,

  // Tabs
  onTabChange,

  // Bulk actions
  bulkActivateServices,
  bulkDeactivateServices,
  deleteManyServices,
}) => {
  // Configuration des onglets
  const tabs: DataTableTab[] = serviceTabConfigs.map((tab) => ({
    key: tab.key?.toString() || 'all',
    label: tab.label,
    icon: tab.icon ? React.createElement(tab.icon) : undefined,
    filterFn:
      tab.key === 'all'
        ? () => true
        : (service: ServiceWithDetails) => {
            if (tab.key === 'active') return service.is_active === true;
            if (tab.key === 'inactive') return service.is_active === false;
            // 'pending' et 'archived' ne sont pas encore supportés dans la DB
            return false;
          },
    badge: (data: ServiceWithDetails[]) => {
      if (tab.key === 'all') return data.length;
      if (tab.key === 'active') return data.filter((s) => s.is_active === true).length;
      if (tab.key === 'inactive') return data.filter((s) => s.is_active === false).length;
      // 'pending' et 'archived' ne sont pas encore supportés
      return 0;
    },
    badgeColor:
      tab.color === 'success'
        ? 'success'
        : tab.color === 'warning'
          ? 'warning'
          : tab.color === 'error'
            ? 'error'
            : 'primary',
  }));

  // Configuration des bulk actions
  const bulkActions = [
    {
      key: 'activate',
      label: 'Activer',
      onClick: async () => {
        if (serviceManagement.selectedServices?.length > 0) {
          await bulkActivateServices?.(serviceManagement.selectedServices);
        }
      },
      color: 'success' as const,
      variant: 'outlined' as const,
    },
    {
      key: 'deactivate',
      label: 'Désactiver',
      onClick: async () => {
        if (serviceManagement.selectedServices?.length > 0) {
          await bulkDeactivateServices?.(serviceManagement.selectedServices);
        }
      },
      color: 'warning' as const,
      variant: 'outlined' as const,
    },
    {
      key: 'delete',
      label: 'Supprimer',
      onClick: async () => {
        if (serviceManagement.selectedServices?.length > 0) {
          await deleteManyServices?.(serviceManagement.selectedServices);
        }
      },
      color: 'error' as const,
      variant: 'outlined' as const,
    },
  ];

  return (
    <>
      <DataTableContainer
        title="Tous les services"
        description="Gérez les services et leurs statuts grâce à des vues spécialisées par catégorie."
      >
        {/* 🔍 Barre de recherche */}
        <DataTableSearch
          searchValue={serviceManagement.filters?.search || ''}
          onSearchChange={(value) => serviceManagement.updateFilter('search', value)}
          searchPlaceholder="Rechercher par nom, catégorie, description..."
          showAdvancedFilters={false}
        />

        {/* 📑 Onglets de statut */}
        <DataTableTabs
          tabs={tabs}
          activeTab={activeTab}
          onTabChange={onTabChange}
          data={services}
        />

        {/* 📊 Tableau avec bulk actions */}
        <DataTableView
          columns={columns}
          data={transformedData}
          loading={isLoading}
          emptyStateMessage={
            serviceManagement.filters?.search || serviceManagement.filters?.status
              ? 'Aucun service ne correspond à vos critères de recherche.'
              : 'Aucun service trouvé'
          }
          height={500}
          selectionModel={serviceManagement.selectedServices || []}
          onClearSelection={serviceManagement.clearSelection}
          bulkActions={bulkActions}
        />
      </DataTableContainer>

      {/* 🔔 Notification Snackbar (optionnel) */}
      {serviceManagement.notification && (
        <Snackbar
          open={serviceManagement.notification.open}
          autoHideDuration={6000}
          onClose={serviceManagement.hideNotification}
        >
          <Alert
            onClose={serviceManagement.hideNotification}
            severity={serviceManagement.notification.severity}
            sx={{ width: '100%' }}
          >
            {serviceManagement.notification.message}
          </Alert>
        </Snackbar>
      )}
    </>
  );
};
