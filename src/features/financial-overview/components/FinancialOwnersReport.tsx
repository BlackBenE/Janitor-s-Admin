import React from 'react';
import { Box, Paper, Typography } from '@mui/material';
import { GridColDef } from '@mui/x-data-grid';
import { Table as DataTable } from '@/shared/components/data-display';
import { formatCurrency } from '@/shared/utils';
import { LABELS } from '@/constants/labels';
import type { OwnerFinancialReport } from '@/types/financial';

interface FinancialOwnersReportProps {
  ownersReport: OwnerFinancialReport[];
  loading?: boolean;
}

/**
 * Rapport consolidé par propriétaire
 */
export const FinancialOwnersReport: React.FC<FinancialOwnersReportProps> = ({
  ownersReport,
  loading = false,
}) => {
  const columns: GridColDef[] = [
    {
      field: 'owner_name',
      headerName: LABELS.financial.owners.columns.name,
      width: 250,
      sortable: true,
    },
    {
      field: 'properties_count',
      headerName: LABELS.financial.owners.columns.properties,
      width: 150,
      sortable: true,
      align: 'center',
      headerAlign: 'center',
    },
    {
      field: 'total_revenue',
      headerName: LABELS.financial.owners.columns.revenue,
      width: 180,
      sortable: true,
      renderCell: (params) => (
        <Typography variant="body2" sx={{ fontWeight: 600, color: 'success.main' }}>
          {formatCurrency(params.value as number)}
        </Typography>
      ),
    },
    {
      field: 'total_expenses',
      headerName: LABELS.financial.owners.columns.expenses,
      width: 180,
      sortable: true,
      renderCell: (params) => (
        <Typography variant="body2" sx={{ fontWeight: 600, color: 'error.main' }}>
          {formatCurrency(params.value as number)}
        </Typography>
      ),
    },
    {
      field: 'net_balance',
      headerName: LABELS.financial.owners.columns.balance,
      width: 180,
      sortable: true,
      renderCell: (params) => {
        const value = params.value as number;
        return (
          <Typography
            variant="body2"
            sx={{
              fontWeight: 700,
              color: value >= 0 ? 'success.main' : 'error.main',
            }}
          >
            {formatCurrency(value)}
          </Typography>
        );
      },
    },
  ];

  return (
    <Box sx={{ mb: 4 }}>
      <Paper elevation={1} sx={{ p: 3 }}>
        <Typography variant="h6" gutterBottom>
          {LABELS.financial.owners.title}
        </Typography>
        <Box sx={{ mt: 2 }}>
          <DataTable
            columns={columns}
            data={ownersReport.map((r) => ({ ...r })) as Array<Record<string, unknown>>}
          />
        </Box>
      </Paper>
    </Box>
  );
};
