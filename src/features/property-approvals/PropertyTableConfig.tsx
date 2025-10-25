import React from 'react';
import { Box, Chip, Typography } from '@mui/material';
import {
  Check as CheckIcon,
  Close as CloseIcon,
  Schedule as ScheduleIcon,
  Visibility as VisibilityIcon,
  Home as HomeIcon,
  LocationOn as LocationIcon,
  Edit as EditIcon,
  Delete as DeleteIcon,
} from '@mui/icons-material';
import { GridRenderCellParams } from '@mui/x-data-grid';
import {
  GenericTableConfig,
  BaseItem,
  GenericAction,
  ColumnConfig,
  createDateColumn,
} from '@/shared/components/data-display';
import { PropertyWithOwner } from '@/types';
import { COMMON_LABELS } from '@/shared/constants';
import { PROPERTY_APPROVALS_LABELS } from './constants';
import { getStatusLabel, getStatusColor } from '@/utils/statusHelpers';

// =====================================================
// TYPES SPÉCIFIQUES AUX PROPRIÉTÉS
// =====================================================

export interface PropertyItem extends BaseItem {
  title: string;
  owner_name: string;
  owner_email: string;
  location: string;
  address: string;
  rent_amount: number;
  validation_status: string;
  created_at: string;
}

export interface PropertyTableConfig {
  selectedProperties: string[];
  onTogglePropertySelection: (propertyId: string) => void;
  onApproveProperty: (propertyId: string) => void;
  onRejectProperty: (propertyId: string) => void;
  onSetPendingProperty: (propertyId: string) => void;
  onViewProperty: (property: PropertyItem) => void;
  onDeleteProperty: (propertyId: string) => void;
  isApprovePending?: boolean;
  isRejectPending?: boolean;
  isPendingPending?: boolean;
  isDeletePending?: boolean;
}

// =====================================================
// CONFIGURATION DES COLONNES
// =====================================================

const createPropertyColumns = (config: PropertyTableConfig): ColumnConfig[] => [
  {
    field: 'title',
    headerName: PROPERTY_APPROVALS_LABELS.table.headers.property,
    flex: 1,
    renderCell: (params: GridRenderCellParams) => {
      const imageCount = params.row.images?.length || 0;
      return (
        <Box
          sx={{
            display: 'flex',
            alignItems: 'center',
            height: '100%',
          }}
        >
          <Box
            sx={{
              display: 'flex',
              flexDirection: 'column',
              gap: 0,
              justifyContent: 'center',
            }}
          >
            <Typography
              variant="body2"
              fontWeight="medium"
              sx={{ lineHeight: 1.1, margin: 0, padding: 0 }}
            >
              {params.value || PROPERTY_APPROVALS_LABELS.table.untitled}
            </Typography>
            <Typography
              variant="caption"
              color="text.secondary"
              sx={{ lineHeight: 1.1, margin: 0, padding: 0 }}
            >
              {imageCount > 0
                ? `${imageCount} ${PROPERTY_APPROVALS_LABELS.table.headers.images.toLowerCase()}`
                : `0 ${PROPERTY_APPROVALS_LABELS.table.headers.images.toLowerCase()}`}
            </Typography>
          </Box>
        </Box>
      );
    },
  },
  {
    field: 'owner_name',
    headerName: PROPERTY_APPROVALS_LABELS.table.headers.owner,
    renderCell: (params: GridRenderCellParams) => {
      const ownerName =
        params.row.profiles?.full_name || params.row.owner?.full_name || params.value;
      const ownerEmail =
        params.row.profiles?.email || params.row.owner?.email || params.row.owner_email;

      return (
        <Box
          sx={{
            display: 'flex',
            flexDirection: 'column',
            gap: 0,
            height: '100%',
            justifyContent: 'center',
          }}
        >
          <Typography
            variant="body2"
            fontWeight="medium"
            sx={{ lineHeight: 1.1, margin: 0, padding: 0 }}
          >
            {ownerName || PROPERTY_APPROVALS_LABELS.modals.unknownOwner}
          </Typography>
          <Typography
            variant="caption"
            color="text.secondary"
            sx={{ lineHeight: 1.1, margin: 0, padding: 0 }}
          >
            {ownerEmail || PROPERTY_APPROVALS_LABELS.modals.noEmail}
          </Typography>
        </Box>
      );
    },
  },
  {
    field: 'location',
    headerName: PROPERTY_APPROVALS_LABELS.table.headers.location,
    width: 200,
    renderCell: (params: GridRenderCellParams) => {
      const city = params.row.city || '';
      const country = params.row.country || '';
      const location = `${city}, ${country}`.trim().replace(/^,\s*|,\s*$/g, '');

      return (
        <Box
          sx={{
            display: 'flex',
            alignItems: 'center',
            height: '100%',
          }}
        >
          <Box
            sx={{
              display: 'flex',
              flexDirection: 'column',
              gap: 0,
              justifyContent: 'center',
            }}
          >
            <Typography variant="body2" sx={{ lineHeight: 1.1, margin: 0, padding: 0 }}>
              {location || 'N/A'}
            </Typography>
            <Typography
              variant="caption"
              color="text.secondary"
              sx={{ lineHeight: 1.1, margin: 0, padding: 0 }}
            >
              {params.row.address || COMMON_LABELS.messages.noAddress}
            </Typography>
          </Box>
        </Box>
      );
    },
  },
  {
    field: 'nightly_rate',
    headerName: PROPERTY_APPROVALS_LABELS.table.headers.price,
    width: 120,
    renderCell: (params: GridRenderCellParams) => (
      <Typography variant="body2" fontWeight="medium">
        {params.value ? `${params.value}€/nuit` : 'Non défini'}
      </Typography>
    ),
  },
  {
    field: 'validation_status',
    headerName: PROPERTY_APPROVALS_LABELS.table.headers.status,
    width: 130,
    renderCell: (params: GridRenderCellParams) => {
      const status = params.value || 'pending';
      const color = getStatusColor(status, 'property');
      const label = getStatusLabel(status, 'property');

      return <Chip color={color} variant="filled" label={label} size="small" />;
    },
  },
  createDateColumn('created_at', COMMON_LABELS.messages.submitted),
  createActionsColumn(config),
];

// =====================================================
// CONFIGURATION DES ACTIONS
// =====================================================

import { PropertyTableActions } from './components/PropertyTableActions';

const createActionsColumn = (config: PropertyTableConfig): ColumnConfig => ({
  field: 'actions',
  headerName: PROPERTY_APPROVALS_LABELS.table.headers.actions,
  width: 120,
  renderCell: (params: GridRenderCellParams) => (
    <PropertyTableActions
      params={params}
      onViewProperty={config.onViewProperty}
      onApproveProperty={config.onApproveProperty}
      onRejectProperty={config.onRejectProperty}
      onSetPendingProperty={config.onSetPendingProperty}
      onDeleteProperty={config.onDeleteProperty}
      isApprovePending={config.isApprovePending}
      isRejectPending={config.isRejectPending}
      isPendingPending={config.isPendingPending}
      isDeletePending={config.isDeletePending}
    />
  ),
});

// =====================================================
// FONCTION PRINCIPALE
// =====================================================

export const createPropertyTableConfig = (config: PropertyTableConfig): GenericTableConfig => ({
  selectable: true,
  selectedItems: config.selectedProperties,
  onToggleSelection: config.onTogglePropertySelection,

  columns: createPropertyColumns(config),

  primaryActions: [],

  actionColumnWidth: 140,
  showActionsMenu: false,
});
