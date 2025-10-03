import React from "react";
import {
  Box,
  Typography,
  CircularProgress,
  Snackbar,
  Alert,
} from "@mui/material";
import DataTable from "../../Table";
import { PropertyFiltersSection } from "./PropertyFiltersSection";
import {
  PropertyFilters,
  PropertyStatus,
} from "../../../types/propertyApprovals";

interface PropertyTableSectionProps {
  // Data
  properties: any[];
  filteredProperties: any[];
  transformedData: any[];
  columns: any[];

  // State
  activeTab: number;
  isLoading: boolean;
  error?: Error | null;

  // Filters
  filters: PropertyFilters;
  onUpdateFilter: (key: keyof PropertyFilters, value: string) => void;

  // Tabs
  onTabChange: (
    event: React.MouseEvent<HTMLElement>,
    newValue: number | null
  ) => void;

  // Actions
  selectedProperties: string[];
  onApproveSelected: () => void;
  onRejectSelected: () => void;
  onClearSelection: () => void;
  isApprovePending?: boolean;
  isRejectPending?: boolean;

  // Notifications
  notification: {
    open: boolean;
    message: string;
    severity: "success" | "error" | "warning" | "info";
  };
  onHideNotification: () => void;
}

export const PropertyTableSection: React.FC<PropertyTableSectionProps> = ({
  // Data
  properties,
  filteredProperties,
  transformedData,
  columns,

  // State
  activeTab,
  isLoading,
  error,

  // Filters
  filters,
  onUpdateFilter,

  // Tabs
  onTabChange,

  // Actions
  selectedProperties,
  onApproveSelected,
  onRejectSelected,
  onClearSelection,
  isApprovePending = false,
  isRejectPending = false,

  // Notifications
  notification,
  onHideNotification,
}) => {
  return (
    <Box
      sx={{
        mt: 2,
        border: "1px solid #ddd",
        borderRadius: 4,
        p: 2,
      }}
    >
      {/* Section Title */}
      <h3>All Properties</h3>
      <p>Manage properties across all categories with specialized views</p>

      {/* Filtres, onglets et actions combinés */}
      <PropertyFiltersSection
        // Filters
        filters={filters}
        onUpdateFilter={onUpdateFilter}
        simplified={true}
        // Tabs
        activeTab={activeTab}
        properties={properties}
        onTabChange={onTabChange}
        // Actions
        selectedProperties={selectedProperties}
        onApproveSelected={onApproveSelected}
        onRejectSelected={onRejectSelected}
        onClearSelection={onClearSelection}
        isApprovePending={isApprovePending}
        isRejectPending={isRejectPending}
      />

      {/* Table Content */}
      {isLoading ? (
        <Box sx={{ display: "flex", justifyContent: "center", p: 3 }}>
          <CircularProgress />
        </Box>
      ) : error ? (
        <Box sx={{ p: 3, textAlign: "center" }}>
          <Typography color="error">Error loading properties</Typography>
        </Box>
      ) : (
        <DataTable columns={columns} data={transformedData} />
      )}

      {/* Empty state */}
      {transformedData.length === 0 && !isLoading && !error && (
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
            No properties found
          </Typography>
          <Typography variant="body2" sx={{ mt: 1 }}>
            {filters.search || Object.values(filters).some((f) => f)
              ? "No properties match your search criteria."
              : "There are no properties in the system yet."}
          </Typography>
        </Box>
      )}

      {/* Notification Snackbar */}
      <Snackbar
        open={notification.open}
        autoHideDuration={6000}
        onClose={onHideNotification}
      >
        <Alert
          onClose={onHideNotification}
          severity={notification.severity}
          sx={{ width: "100%" }}
        >
          {notification.message}
        </Alert>
      </Snackbar>
    </Box>
  );
};
