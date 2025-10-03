import React from "react";
import { Box, Typography, Snackbar, Alert } from "@mui/material";
import { PaymentFiltersComponent } from "../PaymentFilters";
import { PaymentTabs } from "../PaymentTabs";
import { PaymentActions } from "../PaymentActions";
import DataTable from "../../Table";
import { PaymentWithDetails } from "../../../types/payments";

interface PaymentTableSectionProps {
  payments: PaymentWithDetails[];
  activeTab: number;
  paymentManagement: any;
  onTabChange: (
    event: React.MouseEvent<HTMLElement>,
    newValue: number | null
  ) => void;
  columns: any[];
  transformedData: any[];
  isLoading: boolean;
}

export const PaymentTableSection: React.FC<PaymentTableSectionProps> = ({
  payments,
  activeTab,
  paymentManagement,
  onTabChange,
  columns,
  transformedData,
  isLoading,
}) => {
  return (
    <Box sx={{ mt: 2, border: "1px solid #ddd", borderRadius: 4, p: 2 }}>
      {/* Section Title */}
      <h3>Tous les paiements</h3>
      <p>
        Gérez les paiements et leurs statuts grâce à des vues spécialisées par
        catégorie.
      </p>

      {/* Filtres */}
      <Box sx={{ mb: 3 }}>
        <PaymentFiltersComponent
          filters={paymentManagement.filters}
          onUpdateFilter={paymentManagement.updateFilter}
          simplified={true}
        />
      </Box>

      {/* Onglets */}
      <Box sx={{ mb: 3 }}>
        <PaymentTabs
          activeTab={activeTab}
          payments={payments}
          onTabChange={onTabChange}
        />
      </Box>

      {/* Actions et contrôles */}
      <Box
        sx={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          mb: 3,
        }}
      >
        {/* Actions en lot pour les paiements sélectionnés */}
        {paymentManagement.hasSelection && (
          <PaymentActions
            selectedPayments={paymentManagement.selectedPayments || []}
            onBulkMarkPaid={paymentManagement.markSelectedAsPaid || (() => {})}
            onBulkSendReminders={() =>
              console.log("Bulk send payment reminders")
            }
            onBulkCancel={
              paymentManagement.refundSelectedPayments || (() => {})
            }
            onBulkExport={paymentManagement.exportSelectedToCSV || (() => {})}
          />
        )}
      </Box>

      {/* Table des paiements */}
      <DataTable columns={columns} data={transformedData} />

      {/* Loading indicator */}
      {isLoading && <Box sx={{ textAlign: "center", py: 2 }}>Loading...</Box>}

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
