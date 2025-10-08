import React from "react";
import { Box, Chip } from "@mui/material";
// Icônes d'actions supprimées - domaine lecture seule
import DataTable from "../../Table";
import { Transaction } from "../../../types/financialoverview";
import { FinancialFiltersSection } from "./FinancialFiltersSection";

import { FinancialFilters } from "../../../types/financialoverview";

interface FinancialTableSectionProps {
  // Filters & Search
  filters: FinancialFilters;
  onUpdateFilter: (key: string | number | symbol, value: string) => void;

  // Table Data
  transactions: Transaction[];
  isLoading: boolean;

  // Pas d'actions - domaine lecture seule
}

/**
 * Section tableau pour les transactions - Structure identique à UserTableSection
 */
export const FinancialTableSection: React.FC<FinancialTableSectionProps> = ({
  filters,
  onUpdateFilter,
  transactions,
  isLoading,
}) => {
  // Colonnes du tableau
  const columns = [
    { field: "Transaction ID", headerName: "Transaction ID" },
    { field: "Type", headerName: "Type" },
    { field: "User", headerName: "User" },
    { field: "Amount", headerName: "Amount" },
    { field: "Status", headerName: "Status" },
    { field: "Method", headerName: "Method" },
    { field: "Date", headerName: "Date" },
  ];

  // Fonction pour obtenir la couleur du status
  const getStatusColor = (
    status: string
  ): "success" | "warning" | "error" | "default" => {
    switch (status.toLowerCase()) {
      case "completed":
      case "success":
        return "success";
      case "pending":
        return "warning";
      case "failed":
      case "cancelled":
        return "error";
      default:
        return "default";
    }
  };

  // Transformer les données pour le tableau
  const tableData = transactions.slice(0, 50).map((transaction) => ({
    id: transaction.id,
    "Transaction ID": transaction.transactionId,
    Type: transaction.type.charAt(0).toUpperCase() + transaction.type.slice(1),
    User: transaction.user.name,
    Amount: `${transaction.amount.toLocaleString()} €`,
    Status: (
      <Chip
        label={
          transaction.status.charAt(0).toUpperCase() +
          transaction.status.slice(1)
        }
        color={getStatusColor(transaction.status)}
        size="small"
      />
    ),
    Method:
      transaction.method.replace("_", " ").charAt(0).toUpperCase() +
      transaction.method.replace("_", " ").slice(1),
    Date: transaction.date.toLocaleDateString("fr-FR"),
    transaction, // Garder la transaction complète pour les actions
  }));

  return (
    <Box sx={{ mt: 2, border: "1px solid #ddd", borderRadius: 4, p: 2 }}>
      {/* Section Title */}
      <h3>Recent Transactions</h3>
      <p>Latest payment activities and transactions across the platform.</p>

      {/* Filters and Actions */}
      <FinancialFiltersSection
        filters={filters}
        onUpdateFilter={onUpdateFilter}
      />

      {/* Data Table */}
      <DataTable
        columns={columns}
        data={tableData}
        // Pas d'actions - domaine lecture seule
      />
    </Box>
  );
};
