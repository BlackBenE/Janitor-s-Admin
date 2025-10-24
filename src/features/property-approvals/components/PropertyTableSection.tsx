import React from 'react';
import {
  Box,
  Typography,
  CircularProgress,
  Snackbar,
  Alert,
  Skeleton,
  Card,
  CardContent,
} from '@mui/material';
import { Table as DataTable } from '@/shared/components/data-display';
import { PropertyFiltersSection } from './PropertyFiltersSection';
import { PropertyFilters, PropertyStatus, Property } from '@/types/propertyApprovals';
import { LABELS } from '@/core/config/labels';

// Skeleton loading component for property table
const PropertyTableSkeleton: React.FC = () => (
  <Box sx={{ p: 2 }}>
    {Array.from({ length: 6 }).map((_, index) => (
      <Card key={index} sx={{ mb: 2 }}>
        <CardContent>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
            <Skeleton variant="rectangular" width={60} height={60} />
            <Box sx={{ flex: 1 }}>
              <Skeleton variant="text" width="40%" height={24} />
              <Skeleton variant="text" width="60%" height={20} />
              <Skeleton variant="text" width="30%" height={20} />
            </Box>
            <Box>
              <Skeleton variant="rectangular" width={80} height={32} />
            </Box>
          </Box>
        </CardContent>
      </Card>
    ))}
  </Box>
);

interface PropertyTableSectionProps {
  // Data
  properties: Property[];
  filteredProperties: Property[];
  transformedData: any[]; // Garde any car c'est le format transformé pour DataTable
  columns: any[]; // Garde any car c'est le format de colonnes MUI

  // State
  activeTab: number;
  isLoading: boolean;
  error?: Error | null;

  // Filters
  filters: PropertyFilters;
  onUpdateFilter: (key: keyof PropertyFilters, value: string) => void;

  // Tabs
  onTabChange: (event: React.MouseEvent<HTMLElement>, newValue: number | null) => void;

  // Actions
  selectedProperties: string[];
  onApproveSelected: () => void;
  onRejectSelected: () => void;
  onSetPendingSelected: () => void;
  onClearSelection: () => void;
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
  transformedData,
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
  onApproveSelected,
  onRejectSelected,
  onSetPendingSelected,
  onClearSelection,
  isApprovePending = false,
  isRejectPending = false,
  isPendingPending = false,

  // Notifications
  notification,
  onHideNotification,
}) => {
  return (
    <Box
      sx={{
        mt: 2,
        border: '1px solid #ddd',
        borderRadius: 4,
        p: 2,
      }}
    >
      {/* Section Title */}
      <h3>{LABELS.propertyApprovals.table.title}</h3>
      <p>{LABELS.propertyApprovals.table.subtitle}</p>

      {/* Filtres, onglets et actions combinés */}
      <PropertyFiltersSection
        // Filters
        filters={filters}
        onUpdateFilter={onUpdateFilter}
        simplified={true}
        // Tabs
        activeTab={activeTab}
        properties={properties}
        onTabChange={onTabChange}
        // Actions
        selectedProperties={selectedProperties}
        onApproveSelected={onApproveSelected}
        onRejectSelected={onRejectSelected}
        onSetPendingSelected={onSetPendingSelected}
        onClearSelection={onClearSelection}
        isApprovePending={isApprovePending}
        isRejectPending={isRejectPending}
        isPendingPending={isPendingPending}
      />

      {/* Table Content */}
      {isLoading ? (
        <PropertyTableSkeleton />
      ) : error ? (
        <Box sx={{ p: 3, textAlign: 'center' }}>
          <Typography color="error">{LABELS.propertyApprovals.messages.loadError}</Typography>
        </Box>
      ) : (
        <DataTable columns={columns} data={transformedData} />
      )}

      {/* Empty state */}
      {transformedData.length === 0 && !isLoading && !error && (
        <Box
          sx={{
            textAlign: 'center',
            py: 4,
            color: 'text.secondary',
            backgroundColor: 'grey.50',
            borderRadius: 2,
            border: '1px dashed',
            borderColor: 'grey.300',
          }}
        >
          <Typography variant="h6" color="text.secondary">
            {LABELS.propertyApprovals.emptyState.title}
          </Typography>
          <Typography variant="body2" sx={{ mt: 1 }}>
            {filters.search || Object.values(filters).some((f) => f)
              ? LABELS.propertyApprovals.emptyState.noMatch
              : LABELS.propertyApprovals.emptyState.noProperties}
          </Typography>
        </Box>
      )}

      {/* Notification Snackbar */}
      <Snackbar open={notification.open} autoHideDuration={6000} onClose={onHideNotification}>
        <Alert onClose={onHideNotification} severity={notification.severity} sx={{ width: '100%' }}>
          {notification.message}
        </Alert>
      </Snackbar>
    </Box>
  );
};
