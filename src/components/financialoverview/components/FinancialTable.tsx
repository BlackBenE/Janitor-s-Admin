import React from "react";
import { Box, Chip } from "@mui/material";
import DataTable from "../../Table";
import { Transaction } from "../../../types/financialoverview";

interface FinancialTableProps {
  transactions: Transaction[];
  // Domaine lecture seule - pas d'actions d'écriture
}

/**
 * Tableau des transactions récentes avec actions complètes
 */
export const FinancialTable: React.FC<FinancialTableProps> = ({
  transactions,
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

  const tableData = transactions.slice(0, 10).map((transaction) => ({
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
      <h3>Recent Transactions</h3>
      <p>Latest payment activities and transactions</p>
      <DataTable
        columns={columns}
        data={tableData}
        // Pas d'actions - domaine lecture seule
      />
    </Box>
  );
};
