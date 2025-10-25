import React from 'react';
import { Snackbar, Alert } from '@mui/material';
import {
  DataTableContainer,
  DataTableSearch,
  DataTableTabs,
  DataTableView,
  DataTableTab,
} from '@/shared/components';
import { PaymentWithDetails } from '@/types/payments';
import { paymentTabConfigs } from '@/shared/config';

interface PaymentTableSectionProps {
  // Data
  payments: PaymentWithDetails[];
  transformedData: PaymentWithDetails[];
  columns: any[];

  // State
  activeTab: number;
  isLoading: boolean;

  // Management hook
  paymentManagement: any;

  // Tabs
  onTabChange: (event: React.MouseEvent<HTMLElement>, newValue: number | null) => void;

  // Highlighting (optional)
  highlightId?: string | null;
}

export const PaymentTableSection: React.FC<PaymentTableSectionProps> = ({
  // Data
  payments,
  transformedData,
  columns,

  // State
  activeTab,
  isLoading,

  // Management
  paymentManagement,

  // Tabs
  onTabChange,

  // Highlighting
  highlightId,
}) => {
  // Configuration des onglets
  const tabs: DataTableTab[] = paymentTabConfigs.map((tab) => ({
    key: tab.key?.toString() || 'all',
    label: tab.label,
    icon: tab.icon ? React.createElement(tab.icon) : undefined,
    filterFn:
      tab.key === 'all' ? () => true : (payment: PaymentWithDetails) => payment.status === tab.key,
    badge: (data: PaymentWithDetails[]) => {
      if (tab.key === 'all') return data.length;
      return data.filter((p) => p.status === tab.key).length;
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
      key: 'mark-paid',
      label: 'Marquer comme payé',
      onClick: () => paymentManagement.markSelectedAsPaid?.() || (() => {}),
      color: 'success' as const,
      variant: 'outlined' as const,
    },
    {
      key: 'refund',
      label: 'Rembourser',
      onClick: () => paymentManagement.refundSelectedPayments?.() || (() => {}),
      color: 'warning' as const,
      variant: 'outlined' as const,
    },
    {
      key: 'reminder',
      label: 'Envoyer rappel',
      onClick: () => {}, // TODO: Implémenter l'envoi de rappel
      color: 'info' as const,
      variant: 'outlined' as const,
    },
    {
      key: 'export',
      label: 'Exporter sélection',
      onClick: () => paymentManagement.exportSelectedToCSV?.() || (() => {}),
      color: 'secondary' as const,
      variant: 'outlined' as const,
    },
  ];

  return (
    <>
      <DataTableContainer
        title="Tous les paiements"
        description="Gérez les paiements et leurs statuts grâce à des vues spécialisées par catégorie."
      >
        {/* 🔍 Barre de recherche SANS filtres avancés */}
        <DataTableSearch
          searchValue={paymentManagement.filters?.search || ''}
          onSearchChange={(value) => paymentManagement.updateFilter('search', value)}
          searchPlaceholder="Rechercher par ID, nom, service..."
          showAdvancedFilters={false}
        />

        {/* 📑 Onglets de statut */}
        <DataTableTabs
          tabs={tabs}
          activeTab={activeTab}
          onTabChange={onTabChange}
          data={payments}
        />

        {/* 📊 Tableau avec bulk actions */}
        <DataTableView
          columns={columns}
          data={transformedData}
          loading={isLoading}
          emptyStateMessage={
            paymentManagement.filters?.search || paymentManagement.filters?.status
              ? 'Aucun paiement ne correspond à vos critères de recherche.'
              : 'Aucun paiement trouvé'
          }
          height={500}
          selectionModel={paymentManagement.selectedPayments || []}
          onClearSelection={paymentManagement.clearSelection}
          bulkActions={bulkActions}
        />
      </DataTableContainer>

      {/* 🔔 Notification Snackbar (optionnel) */}
      {paymentManagement.notification && (
        <Snackbar
          open={paymentManagement.notification.open}
          autoHideDuration={6000}
          onClose={paymentManagement.hideNotification}
        >
          <Alert
            onClose={paymentManagement.hideNotification}
            severity={paymentManagement.notification.severity}
            sx={{ width: '100%' }}
          >
            {paymentManagement.notification.message}
          </Alert>
        </Snackbar>
      )}
    </>
  );
};
