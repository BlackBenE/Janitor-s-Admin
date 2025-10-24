import React from "react";
import { Box, Typography, Snackbar, Alert } from "@mui/material";
import { PaymentFiltersSection } from "./PaymentFiltersSection";
import DataTable from "../../Table";
import { PaymentWithDetails } from "../../../types/payments";
import { LABELS } from "../../../constants/labels";

interface PaymentTableSectionProps {
  payments: PaymentWithDetails[];
  activeTab: number;
  paymentManagement: any;
  onTabChange: (
    event: React.MouseEvent<HTMLElement>,
    newValue: number | null
  ) => void;
  columns: any;
  transformedData: any[];
  isLoading: boolean;
  highlightId?: string | null;
}

export const PaymentTableSection: React.FC<PaymentTableSectionProps> = ({
  payments,
  activeTab,
  paymentManagement,
  onTabChange,
  columns,
  transformedData,
  isLoading,
  highlightId,
}) => {
  return (
    <Box sx={{ mt: 2, border: "1px solid #ddd", borderRadius: 4, p: 2 }}>
      {/* Section Title */}
      <h3>Tous les paiements</h3>
      <p>
        Gérez les paiements et leurs statuts grâce à des vues spécialisées par
        catégorie.
      </p>

      {/* Filtres, onglets et actions combinés */}
      <PaymentFiltersSection
        // Filters
        filters={paymentManagement.filters}
        onUpdateFilter={paymentManagement.updateFilter}
        simplified={true}
        // Tabs
        activeTab={activeTab}
        payments={payments}
        onTabChange={onTabChange}
        // Actions
        selectedPayments={paymentManagement.selectedPayments || []}
        onBulkMarkPaid={paymentManagement.markSelectedAsPaid || (() => {})}
        onBulkSendReminders={() => console.log("Bulk send payment reminders")}
        onBulkCancel={paymentManagement.refundSelectedPayments || (() => {})}
        onBulkExport={paymentManagement.exportSelectedToCSV || (() => {})}
      />

      {/* Table des paiements avec highlighting */}
      <Box
        sx={{
          height: 400,
          width: "100%",
          // Style pour l'highlighting
          ...(highlightId && {
            "& .MuiDataGrid-row": {
              transition: "all 0.3s ease",
            },
            [`& .MuiDataGrid-row[data-rowindex]:has([data-field="id"][title="${highlightId}"])`]:
              {
                backgroundColor: "#fff3cd !important",
                border: "2px solid #ffc107 !important",
                animation: "pulseHighlight 2s ease-in-out",
              },
            "@keyframes pulseHighlight": {
              "0%": { backgroundColor: "#fff3cd" },
              "50%": { backgroundColor: "#fff8e1" },
              "100%": { backgroundColor: "#fff3cd" },
            },
          }),
        }}
      >
        <DataTable columns={columns} data={transformedData} />
      </Box>

      {/* Loading State */}
      {isLoading && (
        <Box sx={{ textAlign: "center", py: 2 }}>
          {LABELS.common.messages.loading}
        </Box>
      )}

      {/* Table */}

      {/* Empty state */}
      {transformedData.length === 0 && !isLoading && (
        <Box
          sx={{
            textAlign: "center",
            py: 4,
            color: "text.secondary",
            backgroundColor: "grey.50",
            borderRadius: 2,
            border: "1px dashed",
            borderColor: "grey.300",
          }}
        >
          <Typography variant="h6" color="text.secondary">
            Aucun paiement trouvé
          </Typography>
          <Typography variant="body2" sx={{ mt: 1 }}>
            {paymentManagement.filters.search ||
            paymentManagement.filters.status
              ? "Aucun paiement ne correspond à vos critères de recherche."
              : "Il n'y a pas encore de paiements dans le système."}
          </Typography>
        </Box>
      )}

      {/* Notifications */}
      {paymentManagement.notification && (
        <Snackbar
          open={paymentManagement.notification.open}
          autoHideDuration={6000}
          onClose={paymentManagement.hideNotification}
          anchorOrigin={{ vertical: "bottom", horizontal: "right" }}
        >
          <Alert
            onClose={paymentManagement.hideNotification}
            severity={paymentManagement.notification.severity}
            variant="filled"
          >
            {paymentManagement.notification.message}
          </Alert>
        </Snackbar>
      )}
    </Box>
  );
};
