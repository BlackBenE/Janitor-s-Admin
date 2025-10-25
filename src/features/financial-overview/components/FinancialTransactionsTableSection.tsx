import React, { useState } from 'react';
import { Chip, Typography } from '@mui/material';
import { GridColDef } from '@mui/x-data-grid';
import {
  DataTableContainer,
  DataTableSearch,
  DataTableTabs,
  DataTableView,
  DataTableTab,
} from '@/shared/components';
import { formatCurrency, formatDate } from '@/shared/utils';
import { FINANCIAL_LABELS } from '../constants';
import { transactionTabConfigs } from '@/shared/config';
import type { FinancialTransaction } from '@/types/financial';

interface FinancialTransactionsTableSectionProps {
  transactions: FinancialTransaction[];
  loading?: boolean;
}

/**
 * Section du tableau des transactions financières avec DataTable
 */
export const FinancialTransactionsTableSection: React.FC<
  FinancialTransactionsTableSectionProps
> = ({ transactions, loading = false }) => {
  const [activeTab, setActiveTab] = useState(0);
  const [searchValue, setSearchValue] = useState('');
  const [selectedTransactions, setSelectedTransactions] = useState<string[]>([]);

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

  // Colonnes du tableau
  const columns: GridColDef[] = [
    {
      field: 'id',
      headerName: FINANCIAL_LABELS.transactions.columns.id,
      flex: 1,
      minWidth: 150,
      sortable: true,
    },
    {
      field: 'type',
      headerName: FINANCIAL_LABELS.transactions.columns.type,
      flex: 1,
      minWidth: 130,
      renderCell: (params) => (
        <Chip
          label={
            FINANCIAL_LABELS.transactions.types[
              params.value as keyof typeof FINANCIAL_LABELS.transactions.types
            ] || params.value
          }
          color={getTypeColor(params.value as FinancialTransaction['type'])}
          size="small"
        />
      ),
    },
    {
      field: 'user_name',
      headerName: FINANCIAL_LABELS.transactions.columns.user,
      flex: 1.5,
      minWidth: 180,
      sortable: true,
      valueGetter: (value, row) => row.user_name || row.user_id || 'N/A',
    },
    {
      field: 'amount',
      headerName: FINANCIAL_LABELS.transactions.columns.amount,
      flex: 1,
      minWidth: 120,
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
      headerName: FINANCIAL_LABELS.transactions.columns.status,
      flex: 1,
      minWidth: 120,
      renderCell: (params) => (
        <Chip
          label={
            FINANCIAL_LABELS.transactions.status[
              params.value as keyof typeof FINANCIAL_LABELS.transactions.status
            ] || params.value
          }
          color={getStatusColor(params.value as FinancialTransaction['status'])}
          size="small"
        />
      ),
    },
    {
      field: 'payment_method',
      headerName: FINANCIAL_LABELS.transactions.columns.paymentMethod,
      flex: 1.2,
      minWidth: 150,
      sortable: true,
      valueGetter: (value) =>
        FINANCIAL_LABELS.transactions.paymentMethods[
          value as keyof typeof FINANCIAL_LABELS.transactions.paymentMethods
        ] || value,
    },
    {
      field: 'created_at',
      headerName: FINANCIAL_LABELS.transactions.columns.date,
      flex: 1.2,
      minWidth: 150,
      sortable: true,
      valueGetter: (value) => formatDate(value as string),
    },
  ];

  // Configuration des onglets
  const tabs: DataTableTab[] = transactionTabConfigs.map((tab: any) => ({
    key: tab.key?.toString() || 'all',
    label: tab.label,
    icon: tab.icon ? React.createElement(tab.icon) : undefined,
    filterFn:
      tab.key === 'all'
        ? () => true
        : (transaction: FinancialTransaction) => {
            if (tab.key === 'revenue') return transaction.type === 'revenue';
            if (tab.key === 'expense') return transaction.type === 'expense';
            if (tab.key === 'commission') return transaction.type === 'commission';
            if (tab.key === 'subscription') return transaction.type === 'subscription';
            if (tab.key === 'completed') return transaction.status === 'completed';
            if (tab.key === 'pending') return transaction.status === 'pending';
            if (tab.key === 'failed') return transaction.status === 'failed';
            return false;
          },
    badge: (data: FinancialTransaction[]) => {
      if (tab.key === 'all') return data.length;
      return data.filter((t) => {
        if (tab.key === 'revenue') return t.type === 'revenue';
        if (tab.key === 'expense') return t.type === 'expense';
        if (tab.key === 'commission') return t.type === 'commission';
        if (tab.key === 'subscription') return t.type === 'subscription';
        if (tab.key === 'completed') return t.status === 'completed';
        if (tab.key === 'pending') return t.status === 'pending';
        if (tab.key === 'failed') return t.status === 'failed';
        return false;
      }).length;
    },
    badgeColor: tab.color as
      | 'default'
      | 'primary'
      | 'secondary'
      | 'error'
      | 'info'
      | 'success'
      | 'warning',
  }));

  // Filtrage des données
  const getFilteredData = () => {
    let filtered = transactions;

    // Filtrer par recherche
    if (searchValue) {
      const search = searchValue.toLowerCase();
      filtered = filtered.filter(
        (t) =>
          t.id?.toLowerCase().includes(search) ||
          t.user_name?.toLowerCase().includes(search) ||
          t.user_id?.toLowerCase().includes(search) ||
          t.type?.toLowerCase().includes(search)
      );
    }

    // Filtrer par onglet actif
    if (activeTab > 0 && tabs[activeTab] && tabs[activeTab].filterFn) {
      filtered = filtered.filter(tabs[activeTab].filterFn!);
    }

    return filtered;
  };

  const handleTabChange = (event: React.MouseEvent<HTMLElement>, newValue: number | null) => {
    if (newValue !== null) {
      setActiveTab(newValue);
    }
  };

  const transformedData = getFilteredData();

  return (
    <DataTableContainer
      title={FINANCIAL_LABELS.transactions.title}
      description="Historique complet de toutes les transactions financières"
    >
      {/* 🔍 Barre de recherche */}
      <DataTableSearch
        searchValue={searchValue}
        onSearchChange={setSearchValue}
        searchPlaceholder="Rechercher par ID, utilisateur, type..."
        showAdvancedFilters={false}
      />

      {/* Onglets */}
      <DataTableTabs
        tabs={tabs}
        activeTab={activeTab}
        onTabChange={handleTabChange}
        data={transactions}
      />

      {/* Tableau */}
      <DataTableView
        columns={columns}
        data={transformedData}
        loading={loading}
        emptyStateMessage={
          searchValue
            ? 'Aucune transaction ne correspond à vos critères de recherche.'
            : 'Aucune transaction trouvée'
        }
        height={500}
        selectionModel={selectedTransactions}
        onClearSelection={() => setSelectedTransactions([])}
        bulkActions={[]}
      />
    </DataTableContainer>
  );
};
