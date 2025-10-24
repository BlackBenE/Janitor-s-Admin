import React from 'react';
import { Box, Paper, Typography, Chip } from '@mui/material';
import { GridColDef } from '@mui/x-data-grid';
import { Table as DataTable } from '@/shared/components/data-display';
import { formatCurrency, formatDate } from '@/shared/utils';
import { LABELS } from '@/constants/labels';
import type { FinancialTransaction } from '@/types/financial';

interface FinancialTransactionsTableProps {
  transactions: FinancialTransaction[];
  loading?: boolean;
}

/**
 * Tableau des transactions financières
 */
export const FinancialTransactionsTable: React.FC<FinancialTransactionsTableProps> = ({
  transactions,
  loading = false,
}) => {
  // Couleurs pour les types de transactions
  const getTypeColor = (type: FinancialTransaction['type']) => {
    switch (type) {
      case 'revenue':
        return 'success';
      case 'expense':
        return 'error';
      case 'commission':
        return 'info';
      case 'subscription':
        return 'primary';
      default:
        return 'default';
    }
  };

  // Couleurs pour les statuts
  const getStatusColor = (status: FinancialTransaction['status']) => {
    switch (status) {
      case 'completed':
        return 'success';
      case 'pending':
        return 'warning';
      case 'failed':
        return 'error';
      case 'cancelled':
        return 'default';
      default:
        return 'default';
    }
  };

  const columns: GridColDef[] = [
    {
      field: 'id',
      headerName: LABELS.financial.transactions.columns.id,
      width: 150,
      sortable: true,
    },
    {
      field: 'type',
      headerName: LABELS.financial.transactions.columns.type,
      width: 150,
      renderCell: (params) => (
        <Chip
          label={
            LABELS.financial.transactions.types[
              params.value as keyof typeof LABELS.financial.transactions.types
            ] || params.value
          }
          color={getTypeColor(params.value as FinancialTransaction['type'])}
          size="small"
        />
      ),
    },
    {
      field: 'user_name',
      headerName: LABELS.financial.transactions.columns.user,
      width: 200,
      sortable: true,
      valueGetter: (value, row) => row.user_name || row.user_id || 'N/A',
    },
    {
      field: 'amount',
      headerName: LABELS.financial.transactions.columns.amount,
      width: 150,
      sortable: true,
      renderCell: (params) => (
        <Typography
          variant="body2"
          sx={{
            fontWeight: 600,
            color:
              params.row.type === 'revenue' || params.row.type === 'commission'
                ? 'success.main'
                : 'error.main',
          }}
        >
          {formatCurrency(params.value as number)}
        </Typography>
      ),
    },
    {
      field: 'status',
      headerName: LABELS.financial.transactions.columns.status,
      width: 130,
      renderCell: (params) => (
        <Chip
          label={
            LABELS.financial.transactions.status[
              params.value as keyof typeof LABELS.financial.transactions.status
            ] || params.value
          }
          color={getStatusColor(params.value as FinancialTransaction['status'])}
          size="small"
        />
      ),
    },
    {
      field: 'payment_method',
      headerName: LABELS.financial.transactions.columns.paymentMethod,
      width: 180,
      sortable: true,
      valueGetter: (value) =>
        LABELS.financial.transactions.paymentMethods[
          value as keyof typeof LABELS.financial.transactions.paymentMethods
        ] || value,
    },
    {
      field: 'created_at',
      headerName: LABELS.financial.transactions.columns.date,
      width: 180,
      sortable: true,
      valueGetter: (value) => formatDate(value as string),
    },
  ];

  return (
    <Box sx={{ mb: 4 }}>
      <Paper elevation={1} sx={{ p: 3 }}>
        <Typography variant="h6" gutterBottom>
          {LABELS.financial.transactions.title}
        </Typography>
        <Box sx={{ mt: 2 }}>
          <DataTable
            columns={columns}
            data={transactions.map((t) => ({ ...t })) as Array<Record<string, unknown>>}
          />
        </Box>
      </Paper>
    </Box>
  );
};
