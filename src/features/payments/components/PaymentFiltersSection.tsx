import React from "react";
import { Box, Button, Tooltip } from "@mui/material";
import {
  Payment as PaymentIcon,
  Email as EmailIcon,
  Cancel as CancelIcon,
  Download as DownloadIcon,
} from "@mui/icons-material";
import {
  GenericFilters,
  GenericTabs,
  paymentFilterConfigs,
  paymentTabConfigs,
  getPaymentCount,
} from "@/components/shared"; // TODO: À migrer vers @/shared/config
import { PaymentStatusFilter } from "@/types/payments";
import { PaymentWithDetails, PaymentFilters } from "@/types/payments";

interface PaymentFiltersSectionProps {
  // Filters props
  filters: PaymentFilters;
  onUpdateFilter: (key: keyof PaymentFilters, value: string) => void;
  simplified?: boolean;

  // Tabs props
  activeTab: number;
  payments: PaymentWithDetails[];
  onTabChange: (
    event: React.MouseEvent<HTMLElement>,
    newValue: number | null
  ) => void;

  // Actions props
  selectedPayments: string[];
  onBulkMarkPaid: () => void;
  onBulkSendReminders: () => void;
  onBulkCancel: () => void;
  onBulkExport: () => void;
}

// Actions component intégré
const PaymentBulkActions: React.FC<{
  selectedPayments: string[];
  onBulkMarkPaid: () => void;
  onBulkSendReminders: () => void;
  onBulkCancel: () => void;
  onBulkExport: () => void;
}> = ({
  selectedPayments,
  onBulkMarkPaid,
  onBulkSendReminders,
  onBulkCancel,
  onBulkExport,
}) => {
  if (selectedPayments.length === 0) {
    return null;
  }

  return (
    <Box sx={{ display: "flex", gap: 1, ml: "auto", flexWrap: "wrap" }}>
      <Tooltip title={`Mark ${selectedPayments.length} payment(s) as paid`}>
        <Button
          variant="contained"
          size="small"
          startIcon={<PaymentIcon />}
          onClick={onBulkMarkPaid}
          color="success"
        >
          Mark as Paid ({selectedPayments.length})
        </Button>
      </Tooltip>

      <Tooltip
        title={`Send reminders for ${selectedPayments.length} payment(s)`}
      >
        <Button
          variant="outlined"
          size="small"
          startIcon={<EmailIcon />}
          onClick={onBulkSendReminders}
        >
          Send Reminders
        </Button>
      </Tooltip>

      <Tooltip title={`Cancel ${selectedPayments.length} payment(s)`}>
        <Button
          variant="outlined"
          size="small"
          startIcon={<CancelIcon />}
          onClick={onBulkCancel}
          color="error"
        >
          Cancel
        </Button>
      </Tooltip>

      <Tooltip title={`Export ${selectedPayments.length} payment(s)`}>
        <Button
          variant="outlined"
          size="small"
          startIcon={<DownloadIcon />}
          onClick={onBulkExport}
        >
          Export
        </Button>
      </Tooltip>
    </Box>
  );
};

// Filters component intégré
const PaymentFiltersComponent: React.FC<{
  filters: PaymentFilters;
  onUpdateFilter: (key: keyof PaymentFilters, value: string) => void;
  simplified?: boolean;
}> = ({ filters, onUpdateFilter, simplified = false }) => {
  return (
    <GenericFilters
      filters={filters}
      onUpdateFilter={onUpdateFilter}
      searchConfig={{
        placeholder: "Search payments...",
        minWidth: 200,
      }}
      filterConfigs={paymentFilterConfigs}
      simplified={simplified}
    />
  );
};

// Tabs component intégré
const PaymentTabsComponent: React.FC<{
  activeTab: number;
  payments: PaymentWithDetails[];
  onTabChange: (
    event: React.MouseEvent<HTMLElement>,
    newValue: number | null
  ) => void;
}> = ({ activeTab, payments, onTabChange }) => {
  return (
    <GenericTabs<PaymentWithDetails, PaymentStatusFilter>
      activeTab={activeTab}
      items={payments}
      tabConfigs={paymentTabConfigs}
      onTabChange={onTabChange}
      getItemCount={getPaymentCount}
      ariaLabel="payment status filter"
    />
  );
};

export const PaymentFiltersSection: React.FC<PaymentFiltersSectionProps> = ({
  // Filters
  filters,
  onUpdateFilter,
  simplified = false,

  // Tabs
  activeTab,
  payments,
  onTabChange,

  // Actions
  selectedPayments,
  onBulkMarkPaid,
  onBulkSendReminders,
  onBulkCancel,
  onBulkExport,
}) => {
  return (
    <Box sx={{ mb: 3 }}>
      {/* Filtres de recherche */}
      <Box sx={{ mb: 2 }}>
        <PaymentFiltersComponent
          filters={filters}
          onUpdateFilter={onUpdateFilter}
          simplified={simplified}
        />
      </Box>

      {/* Onglets de statut et actions groupées */}
      <Box
        sx={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          flexWrap: "wrap",
          gap: 2,
        }}
      >
        <PaymentTabsComponent
          activeTab={activeTab}
          payments={payments}
          onTabChange={onTabChange}
        />

        <PaymentBulkActions
          selectedPayments={selectedPayments}
          onBulkMarkPaid={onBulkMarkPaid}
          onBulkSendReminders={onBulkSendReminders}
          onBulkCancel={onBulkCancel}
          onBulkExport={onBulkExport}
        />
      </Box>
    </Box>
  );
};
