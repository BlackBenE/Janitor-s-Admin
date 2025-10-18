import React from "react";
import { Box } from "@mui/material";
import AdminLayout from "../AdminLayout";

// Components modularisés
import {
  FinancialHeader,
  FinancialStatsSection,
  FinancialTableSection,
  FinancialChartsSection,
} from "./components";

// Hooks
import { useFinancialOverview } from "./hooks/useFinancialOverviewNew";

/**
 * Page Financial Overview - Structure identique à UserManagement
 * Utilise les vraies données Supabase et respecte la limite de 350 lignes
 */
export const FinancialOverviewPage: React.FC = () => {
  const {
    // État
    state,
    loading,
    error,

    // Données
    revenueMetrics,
    expenseMetrics,
    profitMetrics,
    subscriptionMetrics,
    transactions,
    chartData,

    // Actions
    updateFilters,
    exportToExcel, // Un seul export comme UserManagement
    refreshData,
  } = useFinancialOverview();

  // Gestion d'erreur comme dans UserManagement
  if (error) {
    return (
      <AdminLayout>
        <Box sx={{ p: 3, textAlign: "center" }}>
          <h2>Erreur de chargement</h2>
          <p>Impossible de charger les données financières: {error}</p>
        </Box>
      </AdminLayout>
    );
  }

  return (
    <AdminLayout>
      <Box sx={{ height: "100%", display: "flex", flexDirection: "column" }}>
        {/* En-tête de la page */}
        <FinancialHeader
          onExport={exportToExcel}
          onRefresh={refreshData}
          isFetching={loading}
        />

        {/* Section statistiques */}
        <FinancialStatsSection
          revenueMetrics={revenueMetrics}
          expenseMetrics={expenseMetrics}
          profitMetrics={profitMetrics}
          subscriptionMetrics={subscriptionMetrics}
          error={error}
        />

        {/* Section graphiques */}
        <FinancialChartsSection chartData={chartData} />

        {/* Section tableau */}
        <FinancialTableSection
          filters={state.filters}
          onUpdateFilter={(key, value) => updateFilters({ [key]: value })}
          transactions={transactions}
          isLoading={loading}
        />
      </Box>
    </AdminLayout>
  );
};

export default FinancialOverviewPage;
