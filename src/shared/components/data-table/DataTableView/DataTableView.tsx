/**
 * DataTableView Component
 *
 * Tableau de données avec MUI DataGrid, actions en masse, et gestion de sélection.
 * Fournit un état vide, un loader, et des actions en masse optionnelles.
 *
 * @example
 * ```tsx
 * <DataTableView
 *   columns={userColumns}
 *   data={filteredUsers}
 *   loading={isLoading}
 *   emptyStateMessage="Aucun utilisateur trouvé"
 *   selectionModel={selectedUsers}
 *   onSelectionChange={setSelectedUsers}
 *   bulkActions={[
 *     {
 *       key: 'delete',
 *       label: 'Supprimer',
 *       icon: <DeleteIcon />,
 *       onClick: (ids) => handleDelete(ids),
 *       color: 'error'
 *     }
 *   ]}
 *   height={600}
 * />
 * ```
 */

import React from 'react';
import { Box, Typography, Button, Skeleton } from '@mui/material';
import { InboxOutlined as InboxIcon } from '@mui/icons-material';
import { Table as DataTable } from '@/shared/components/data-display';
import { DataTableViewProps } from '../data-table.types';
import type { GridRowSelectionModel } from '@mui/x-data-grid'; /**
 * Skeleton de chargement pour le tableau
 */
const TableSkeleton: React.FC<{ rows?: number }> = ({ rows = 5 }) => (
  <Box sx={{ p: 2 }}>
    {Array.from({ length: rows }).map((_, index) => (
      <Box key={index} sx={{ mb: 2, display: 'flex', gap: 2, alignItems: 'center' }}>
        <Skeleton variant="rectangular" width={40} height={40} />
        <Box sx={{ flex: 1 }}>
          <Skeleton variant="text" width="60%" height={24} />
          <Skeleton variant="text" width="40%" height={20} />
        </Box>
        <Skeleton variant="rectangular" width={100} height={32} />
      </Box>
    ))}
  </Box>
);

/**
 * État vide pour le tableau
 */
const EmptyState: React.FC<{
  message?: string;
  icon?: React.ReactNode;
}> = ({ message, icon }) => (
  <Box
    sx={{
      textAlign: 'center',
      py: 8,
      px: 2,
      color: 'text.secondary',
      backgroundColor: 'grey.50',
      borderRadius: 2,
      border: '1px dashed',
      borderColor: 'grey.300',
    }}
  >
    <Box sx={{ fontSize: 48, mb: 2, color: 'grey.400' }}>
      {icon || <InboxIcon fontSize="inherit" />}
    </Box>
    <Typography variant="h6" color="text.secondary" gutterBottom>
      {message || 'Aucune donnée disponible'}
    </Typography>
    <Typography variant="body2" sx={{ mt: 1 }}>
      Essayez de modifier vos filtres ou critères de recherche
    </Typography>
  </Box>
);

/**
 * Barre d'actions en masse
 */
const BulkActionsBar: React.FC<{
  selectedCount: number;
  actions: DataTableViewProps['bulkActions'];
  onClearSelection?: () => void;
}> = ({ selectedCount, actions = [], onClearSelection }) => {
  if (selectedCount === 0 || actions.length === 0) {
    return null;
  }

  return (
    <Box
      sx={{
        mb: 2,
        p: 2,
        backgroundColor: 'grey.100', // ✅ Neutre au lieu de primary.light
        borderRadius: 2,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        gap: 2,
        border: '1px solid',
        borderColor: 'divider',
      }}
    >
      <Typography variant="body2" sx={{ fontWeight: 600, color: 'text.primary' }}>
        {selectedCount} élément{selectedCount > 1 ? 's' : ''} sélectionné
        {selectedCount > 1 ? 's' : ''}
      </Typography>

      <Box sx={{ display: 'flex', gap: 1, flexWrap: 'wrap' }}>
        {actions.map((action) => (
          <Button
            key={action.key}
            variant={action.variant || 'outlined'}
            color={action.color || 'primary'}
            size="small"
            startIcon={action.icon}
            disabled={action.disabled}
            onClick={() => action.onClick([])} // selectedIds will be passed from parent
          >
            {action.label}
          </Button>
        ))}

        {onClearSelection && (
          <Button variant="text" size="small" onClick={onClearSelection} sx={{ ml: 1 }}>
            Annuler la sélection
          </Button>
        )}
      </Box>
    </Box>
  );
};

export const DataTableView: React.FC<DataTableViewProps> = ({
  columns,
  data,
  loading = false,
  emptyStateMessage,
  emptyStateIcon,
  selectionModel = [],
  onSelectionChange,
  onClearSelection,
  bulkActions = [],
  height = 600,
  pagination = true,
  pageSize = 10,
  pageSizeOptions = [10, 25, 50, 100],
  sx,
  className,
}) => {
  const hasSelection = selectionModel.length > 0;
  const hasBulkActions = bulkActions.length > 0;

  // Gestion de la sélection
  const handleSelectionChange = (newSelection: string[]) => {
    onSelectionChange?.(newSelection);
  };

  // Gestion du nettoyage de la sélection
  const handleClearSelection = () => {
    if (onClearSelection) {
      onClearSelection();
    } else {
      handleSelectionChange([]);
    }
  };

  // Gestion du clic sur une action en masse
  const handleBulkAction = (actionKey: string) => {
    const action = bulkActions.find((a) => a.key === actionKey);
    if (action) {
      action.onClick(selectionModel);
    }
  };

  return (
    <Box className={className} sx={{ ...sx }}>
      {/* Bulk Actions Bar */}
      {hasBulkActions && (
        <BulkActionsBar
          selectedCount={selectionModel.length}
          actions={bulkActions.map((action) => ({
            ...action,
            onClick: () => handleBulkAction(action.key),
          }))}
          onClearSelection={handleClearSelection}
        />
      )}

      {/* Loading State */}
      {loading && <TableSkeleton />}

      {/* Empty State */}
      {!loading && data.length === 0 && (
        <EmptyState message={emptyStateMessage} icon={emptyStateIcon} />
      )}

      {/* Data Table */}
      {!loading && data.length > 0 && (
        <Box
          sx={{
            height: typeof height === 'number' ? `${height}px` : height,
            width: '100%',
          }}
        >
          <DataTable columns={columns} data={data} />
        </Box>
      )}
    </Box>
  );
};
