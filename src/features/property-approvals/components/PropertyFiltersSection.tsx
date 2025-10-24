import React from 'react';
import { Box, Button, Tooltip, Typography, Divider } from '@mui/material';
import {
  Check as CheckIcon,
  Close as CloseIcon,
  Delete as DeleteIcon,
  AccessTime as AccessTimeIcon,
} from '@mui/icons-material';
import { GenericFilters } from '@/shared/components/filters';
import { GenericTabs } from '@/shared/components/navigation';
import { propertyFilterConfigs, propertyTabConfigs, getPropertyCount } from '@/shared/config';
import { Property } from '@/types';
import { PropertyFilters, PropertyStatus } from '@/types/propertyApprovals';
import { LABELS } from '@/core/config/labels';

interface PropertyFiltersSectionProps {
  // Filters props
  filters: PropertyFilters;
  onUpdateFilter: (key: keyof PropertyFilters, value: string) => void;
  simplified?: boolean;

  // Tabs props
  activeTab: number;
  properties: Property[];
  onTabChange: (event: React.MouseEvent<HTMLElement>, newValue: number | null) => void;

  // Actions props
  selectedProperties: string[];
  onApproveSelected: () => void;
  onRejectSelected: () => void;
  onSetPendingSelected: () => void;
  onClearSelection: () => void;
  isApprovePending?: boolean;
  isRejectPending?: boolean;
  isPendingPending?: boolean;
}

// Actions component intégré
const PropertyBulkActions: React.FC<{
  selectedProperties: string[];
  onApproveSelected: () => void;
  onRejectSelected: () => void;
  onSetPendingSelected: () => void;
  onClearSelection: () => void;
  isApprovePending?: boolean;
  isRejectPending?: boolean;
  isPendingPending?: boolean;
}> = ({
  selectedProperties,
  onApproveSelected,
  onRejectSelected,
  onSetPendingSelected,
  onClearSelection,
  isApprovePending = false,
  isRejectPending = false,
  isPendingPending = false,
}) => {
  const selectedCount = selectedProperties.length;

  if (selectedCount === 0) return null;

  return (
    <Box
      sx={{
        display: 'flex',
        alignItems: 'center',
        gap: 2,
        p: 2,
        backgroundColor: 'action.hover',
        borderRadius: 1,
        mb: 2,
      }}
    >
      <Typography variant="body2" sx={{ fontWeight: 500 }}>
        {LABELS.propertyApprovals.bulk.selected.replace('{{count}}', selectedCount.toString())}
      </Typography>

      <Divider orientation="vertical" flexItem />

      <Box sx={{ display: 'flex', gap: 1 }}>
        <Tooltip
          title={LABELS.propertyApprovals.bulk.tooltips.approve.replace(
            '{{count}}',
            selectedCount.toString()
          )}
        >
          <Button
            variant="contained"
            color="success"
            size="small"
            startIcon={<CheckIcon />}
            onClick={onApproveSelected}
            disabled={isApprovePending}
          >
            {LABELS.propertyApprovals.bulk.actions.approveAll}
          </Button>
        </Tooltip>

        <Tooltip
          title={LABELS.propertyApprovals.bulk.tooltips.setPending.replace(
            '{{count}}',
            selectedCount.toString()
          )}
        >
          <Button
            variant="contained"
            color="warning"
            size="small"
            startIcon={<AccessTimeIcon />}
            onClick={onSetPendingSelected}
            disabled={isPendingPending}
          >
            {LABELS.propertyApprovals.bulk.actions.setPending}
          </Button>
        </Tooltip>

        <Tooltip
          title={LABELS.propertyApprovals.bulk.tooltips.reject.replace(
            '{{count}}',
            selectedCount.toString()
          )}
        >
          <Button
            variant="contained"
            color="error"
            size="small"
            startIcon={<CloseIcon />}
            onClick={onRejectSelected}
            disabled={isRejectPending}
          >
            {LABELS.propertyApprovals.bulk.actions.rejectAll}
          </Button>
        </Tooltip>

        <Tooltip title={LABELS.propertyApprovals.bulk.tooltips.clear}>
          <Button
            variant="outlined"
            size="small"
            startIcon={<DeleteIcon />}
            onClick={onClearSelection}
          >
            {LABELS.propertyApprovals.bulk.actions.clear}
          </Button>
        </Tooltip>
      </Box>
    </Box>
  );
};

// Filters component intégré
const PropertyFiltersComponent: React.FC<{
  filters: PropertyFilters;
  onUpdateFilter: (key: keyof PropertyFilters, value: string) => void;
  simplified?: boolean;
}> = ({ filters, onUpdateFilter, simplified = false }) => {
  return (
    <GenericFilters
      filters={filters}
      onUpdateFilter={onUpdateFilter}
      searchConfig={{
        placeholder: LABELS.propertyApprovals.search.placeholder,
        minWidth: 200,
      }}
      filterConfigs={propertyFilterConfigs}
      simplified={simplified}
    />
  );
};

// Tabs component intégré
const PropertyTabsComponent: React.FC<{
  activeTab: number;
  properties: Property[];
  onTabChange: (event: React.MouseEvent<HTMLElement>, newValue: number | null) => void;
}> = ({ activeTab, properties, onTabChange }) => {
  return (
    <GenericTabs<Property, PropertyStatus>
      activeTab={activeTab}
      items={properties}
      tabConfigs={propertyTabConfigs}
      onTabChange={onTabChange}
      getItemCount={getPropertyCount}
      ariaLabel={LABELS.propertyApprovals.search.ariaLabel}
    />
  );
};

export const PropertyFiltersSection: React.FC<PropertyFiltersSectionProps> = ({
  // Filters
  filters,
  onUpdateFilter,
  simplified = false,

  // Tabs
  activeTab,
  properties,
  onTabChange,

  // Actions
  selectedProperties,
  onApproveSelected,
  onRejectSelected,
  onSetPendingSelected,
  onClearSelection,
  isApprovePending = false,
  isRejectPending = false,
  isPendingPending = false,
}) => {
  return (
    <Box sx={{ mb: 3 }}>
      {/* Filtres de recherche */}
      <Box sx={{ mb: 2 }}>
        <PropertyFiltersComponent
          filters={filters}
          onUpdateFilter={onUpdateFilter}
          simplified={simplified}
        />
      </Box>

      {/* Onglets de statut */}
      <Box sx={{ mb: 2 }}>
        <PropertyTabsComponent
          activeTab={activeTab}
          properties={properties}
          onTabChange={onTabChange}
        />
      </Box>

      {/* Actions groupées */}
      <PropertyBulkActions
        selectedProperties={selectedProperties}
        onApproveSelected={onApproveSelected}
        onRejectSelected={onRejectSelected}
        onSetPendingSelected={onSetPendingSelected}
        onClearSelection={onClearSelection}
        isApprovePending={isApprovePending}
        isRejectPending={isRejectPending}
        isPendingPending={isPendingPending}
      />
    </Box>
  );
};
