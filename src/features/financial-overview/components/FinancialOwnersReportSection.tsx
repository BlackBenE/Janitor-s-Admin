import React, { useState } from 'react';
import { Typography } from '@mui/material';
import { GridColDef } from '@mui/x-data-grid';
import { DataTableContainer, DataTableSearch, DataTableView } from '@/shared/components';
import { formatCurrency } from '@/shared/utils';
import { FINANCIAL_LABELS } from '../constants';
import type { OwnerFinancialReport } from '@/types/financial';

interface FinancialOwnersReportSectionProps {
  ownersReport: OwnerFinancialReport[];
  loading?: boolean;
}

/**
 * Section du rapport consolidé par propriétaire avec DataTable
 */
export const FinancialOwnersReportSection: React.FC<FinancialOwnersReportSectionProps> = ({
  ownersReport,
  loading = false,
}) => {
  const [searchValue, setSearchValue] = useState('');
  const [selectedOwners, setSelectedOwners] = useState<string[]>([]);

  // Colonnes du tableau
  const columns: GridColDef[] = [
    {
      field: 'owner_name',
      headerName: FINANCIAL_LABELS.owners.columns.name,
      flex: 2,
      minWidth: 200,
      sortable: true,
      description: 'Nom du propriétaire',
    },
    {
      field: 'properties_count',
      headerName: FINANCIAL_LABELS.owners.columns.properties,
      flex: 1,
      minWidth: 120,
      sortable: true,
      align: 'center',
      headerAlign: 'center',
      description: 'Nombre de propriétés possédées',
    },
    {
      field: 'total_revenue',
      headerName: FINANCIAL_LABELS.owners.columns.revenue,
      flex: 1.2,
      minWidth: 150,
      sortable: true,
      description:
        'Revenus totaux générés par les locations (100% du montant payé par les voyageurs)',
      renderCell: (params) => (
        <Typography variant="body2" sx={{ fontWeight: 600, color: 'success.main' }}>
          {formatCurrency(params.value as number)}
        </Typography>
      ),
    },
    {
      field: 'commission_earned',
      headerName: 'Commission PJ',
      flex: 1.2,
      minWidth: 150,
      sortable: true,
      description: 'Commission prélevée par Paris Janitor (20% des revenus)',
      renderCell: (params) => (
        <Typography variant="body2" sx={{ fontWeight: 600, color: 'warning.main' }}>
          {formatCurrency(params.value as number)}
        </Typography>
      ),
    },
    // Note: Colonne Dépenses masquée car données non disponibles dans Supabase
    // {
    //   field: 'total_expenses',
    //   headerName: FINANCIAL_LABELS.owners.columns.expenses,
    //   ...
    // },
    {
      field: 'net_balance',
      headerName: 'Revenus nets',
      flex: 1.2,
      minWidth: 150,
      sortable: true,
      description: 'Revenus nets du propriétaire = Revenus - Commission PJ (hors dépenses)',
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

  // Filtrage des données
  const getFilteredData = () => {
    let filtered = ownersReport;

    // Filtrer par recherche
    if (searchValue) {
      const search = searchValue.toLowerCase();
      filtered = filtered.filter(
        (owner) =>
          owner.owner_name?.toLowerCase().includes(search) ||
          owner.owner_id?.toLowerCase().includes(search)
      );
    }

    return filtered;
  };

  const transformedData = getFilteredData();

  return (
    <DataTableContainer
      title={FINANCIAL_LABELS.owners.title}
      description="Vue consolidée des performances financières par propriétaire. Les propriétaires sont triés par revenus décroissants. Seuls les propriétaires actifs avec au moins une propriété sont affichés."
    >
      {/* Barre de recherche */}
      <DataTableSearch
        searchValue={searchValue}
        onSearchChange={setSearchValue}
        searchPlaceholder="Rechercher un propriétaire..."
        showAdvancedFilters={false}
      />

      {/* Tableau sans onglets */}
      <DataTableView
        columns={columns}
        data={transformedData}
        loading={loading}
        emptyStateMessage={
          searchValue
            ? 'Aucun propriétaire ne correspond à vos critères de recherche.'
            : 'Aucun rapport disponible'
        }
        height={500}
        selectionModel={selectedOwners}
        onClearSelection={() => setSelectedOwners([])}
        bulkActions={[]}
      />
    </DataTableContainer>
  );
};
