import React from 'react';
import { Snackbar, Alert } from '@mui/material';
import {
  DataTableContainer,
  DataTableSearch,
  DataTableTabs,
  DataTableView,
  DataTableTab,
  DataTableFilter,
} from '@/shared/components';
import { PropertyFilters, PropertyStatus, Property } from '@/types/propertyApprovals';
import { PROPERTY_TABS } from '@/types/propertyApprovals';
import { COMMON_LABELS } from '@/shared/constants';
import { PROPERTY_APPROVALS_LABELS } from '../constants';
import {
  Check as CheckIcon,
  Close as CloseIcon,
  AccessTime as AccessTimeIcon,
} from '@mui/icons-material';

interface PropertyTableSectionProps {
  // Data
  properties: Property[];
  filteredProperties: Property[];
  columns: any[]; // Format de colonnes MUI DataGrid

  // State
  activeTab: number;
  isLoading: boolean;
  error?: Error | null;

  // Filters
  filters: PropertyFilters;
  onUpdateFilter: (key: keyof PropertyFilters, value: string) => void;

  // Tabs
  onTabChange: (event: React.MouseEvent<HTMLElement>, newValue: number | null) => void;

  // Selection & Actions
  selectedProperties: string[];
  onClearSelection: () => void;
  onApproveSelected: () => void;
  onRejectSelected: () => void;
  onSetPendingSelected: () => void;
  isApprovePending?: boolean;
  isRejectPending?: boolean;
  isPendingPending?: boolean;

  // Notifications
  notification: {
    open: boolean;
    message: string;
    severity: 'success' | 'error' | 'warning' | 'info';
  };
  onHideNotification: () => void;
}

export const PropertyTableSection: React.FC<PropertyTableSectionProps> = ({
  // Data
  properties,
  filteredProperties,
  columns,

  // State
  activeTab,
  isLoading,
  error,

  // Filters
  filters,
  onUpdateFilter,

  // Tabs
  onTabChange,

  // Actions
  selectedProperties,
  onClearSelection,
  onApproveSelected,
  onRejectSelected,
  onSetPendingSelected,
  isApprovePending = false,
  isRejectPending = false,
  isPendingPending = false,

  // Notifications
  notification,
  onHideNotification,
}) => {
  // Configuration des onglets
  const tabs: DataTableTab[] = PROPERTY_TABS.map((tab) => {
    const statusMap: Record<PropertyStatus, string | null> = {
      [PropertyStatus.ALL]: null,
      [PropertyStatus.PENDING]: 'pending',
      [PropertyStatus.APPROVED]: 'approved',
      [PropertyStatus.REJECTED]: 'rejected',
    };

    const validationStatus = statusMap[tab.status];

    return {
      key: tab.status.toString(),
      label: tab.label,
      icon: React.createElement(tab.icon),
      filterFn:
        validationStatus === null
          ? () => true
          : (property: Property) => property.validation_status === validationStatus,
      badge: (data: Property[]) => {
        if (validationStatus === null) return data.length;
        return data.filter((p) => p.validation_status === validationStatus).length;
      },
      badgeColor:
        tab.status === PropertyStatus.APPROVED
          ? 'success'
          : tab.status === PropertyStatus.REJECTED
            ? 'error'
            : tab.status === PropertyStatus.PENDING
              ? 'warning'
              : 'primary',
    };
  });

  // Configuration des bulk actions
  const bulkActions = [
    {
      key: 'approve',
      label: PROPERTY_APPROVALS_LABELS.bulk.actions.approveAll,
      icon: <CheckIcon />,
      onClick: () => onApproveSelected(),
      color: 'success' as const,
      variant: 'contained' as const,
      disabled: isApprovePending,
    },
    {
      key: 'setPending',
      label: PROPERTY_APPROVALS_LABELS.bulk.actions.setPending,
      icon: <AccessTimeIcon />,
      onClick: () => onSetPendingSelected(),
      color: 'warning' as const,
      variant: 'contained' as const,
      disabled: isPendingPending,
    },
    {
      key: 'reject',
      label: PROPERTY_APPROVALS_LABELS.bulk.actions.rejectAll,
      icon: <CloseIcon />,
      onClick: () => onRejectSelected(),
      color: 'error' as const,
      variant: 'contained' as const,
      disabled: isRejectPending,
    },
  ];

  return (
    <>
      <DataTableContainer
        title={PROPERTY_APPROVALS_LABELS.table.title}
        description={PROPERTY_APPROVALS_LABELS.table.subtitle}
      >
        {/* 🔍 Barre de recherche + filtres avancés */}
        <DataTableSearch
          searchValue={filters.search || ''}
          onSearchChange={(value) => onUpdateFilter('search', value)}
          searchPlaceholder={PROPERTY_APPROVALS_LABELS.search.placeholder}
          onFilterChange={(key, value) => onUpdateFilter(key as keyof PropertyFilters, value)}
          showAdvancedFilters={true}
        />

        {/* 📑 Onglets de statut */}
        <DataTableTabs
          tabs={tabs}
          activeTab={activeTab}
          onTabChange={onTabChange}
          data={properties}
        />

        {/* 📊 Tableau avec bulk actions */}
        <DataTableView
          columns={columns}
          data={filteredProperties}
          loading={isLoading}
          emptyStateMessage={
            filters.search || Object.values(filters).some((f) => f)
              ? PROPERTY_APPROVALS_LABELS.emptyState.noMatch
              : PROPERTY_APPROVALS_LABELS.emptyState.noProperties
          }
          height={500}
          selectionModel={selectedProperties}
          onClearSelection={onClearSelection}
          bulkActions={bulkActions}
        />
      </DataTableContainer>

      {/* 🔔 Notification Snackbar */}
      <Snackbar open={notification.open} autoHideDuration={6000} onClose={onHideNotification}>
        <Alert onClose={onHideNotification} severity={notification.severity} sx={{ width: '100%' }}>
          {notification.message}
        </Alert>
      </Snackbar>
    </>
  );
};
