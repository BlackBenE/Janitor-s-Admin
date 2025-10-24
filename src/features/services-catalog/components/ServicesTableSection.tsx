import React from "react";
import { Box, Typography, Snackbar, Alert } from "@mui/material";
import { ServiceFiltersSection } from "./ServiceFiltersSection";
import { Table as DataTable } from "@/shared/components/data-display";
import { ServiceWithDetails } from "@/types/services";
import { LABELS } from "@/core/config/labels";

interface ServicesTableSectionProps {
  services: ServiceWithDetails[];
  activeTab: number;
  serviceManagement: any;
  onTabChange: (
    event: React.MouseEvent<HTMLElement>,
    newValue: number | null
  ) => void;
  columns: any[];
  transformedData: any[];
  isLoading: boolean;
  // Bulk actions
  bulkActivateServices?: (ids: string[]) => Promise<any>;
  bulkDeactivateServices?: (ids: string[]) => Promise<any>;
  deleteManyServices?: (ids: string[]) => Promise<any>;
}

export const ServicesTableSection: React.FC<ServicesTableSectionProps> = ({
  services,
  activeTab,
  serviceManagement,
  onTabChange,
  columns,
  transformedData,
  isLoading,
  bulkActivateServices,
  bulkDeactivateServices,
  deleteManyServices,
}) => {
  return (
    <Box sx={{ mt: 2, border: "1px solid #ddd", borderRadius: 4, p: 2 }}>
      {/* Section Title */}
      <h3>Tous les services</h3>
      <p>
        Gérez les services et leurs statuts grâce à des vues spécialisées par
        catégorie.
      </p>

      {/* Filtres, onglets et actions combinés */}
      <ServiceFiltersSection
        // Filters
        filters={serviceManagement.filters}
        onUpdateFilter={serviceManagement.updateFilter}
        simplified={true}
        // Tabs
        activeTab={activeTab}
        services={services}
        onTabChange={onTabChange}
        // Actions
        selectedServices={serviceManagement.selectedServices || []}
        onBulkApprove={serviceManagement.approveSelectedServices || (() => {})}
        onBulkReject={serviceManagement.rejectSelectedServices || (() => {})}
        onBulkSuspend={serviceManagement.suspendSelectedServices || (() => {})}
        onBulkExport={serviceManagement.exportSelectedToCSV || (() => {})}
        // Bulk actions avec mutations réelles
        bulkActivateServices={bulkActivateServices}
        bulkDeactivateServices={bulkDeactivateServices}
        deleteManyServices={deleteManyServices}
      />

      {/* Table des services */}
      <DataTable columns={columns} data={transformedData} />

      {/* Loading indicator */}
      {isLoading && (
        <Box sx={{ textAlign: "center", py: 2 }}>
          {LABELS.common.messages.loading}
        </Box>
      )}

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
            Aucun service trouvé
          </Typography>
          <Typography variant="body2" sx={{ mt: 1 }}>
            {serviceManagement.filters.search ||
            serviceManagement.filters.status
              ? "Aucun service ne correspond à vos critères de recherche."
              : "Il n'y a pas encore de services dans le système."}
          </Typography>
        </Box>
      )}

      {/* Notifications */}
      {serviceManagement.notification && (
        <Snackbar
          open={serviceManagement.notification.open}
          autoHideDuration={6000}
          onClose={serviceManagement.hideNotification}
          anchorOrigin={{ vertical: "bottom", horizontal: "right" }}
        >
          <Alert
            onClose={serviceManagement.hideNotification}
            severity={serviceManagement.notification.severity}
            variant="filled"
          >
            {serviceManagement.notification.message}
          </Alert>
        </Snackbar>
      )}
    </Box>
  );
};
