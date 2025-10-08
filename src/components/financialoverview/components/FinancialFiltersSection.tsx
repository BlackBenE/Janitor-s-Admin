import React from "react";
import { Box } from "@mui/material";
import { GenericFilters } from "../../shared";

import { FinancialFilters } from "../../../types/financialoverview";

interface FinancialFiltersSectionProps {
  filters: FinancialFilters;
  onUpdateFilter: (key: string | number | symbol, value: string) => void;
}

// Configuration des filtres financiers - Identique à userFilterConfigs
const financialFilterConfigs = [
  {
    key: "status" as const,
    type: "select" as const,
    label: "Transaction Status",
    options: [
      { value: "completed", label: "Completed" },
      { value: "pending", label: "Pending" },
      { value: "failed", label: "Failed" },
      { value: "cancelled", label: "Cancelled" },
    ],
    minWidth: 180,
  },
];

/**
 * Section de filtres pour les transactions - Structure identique à UserFiltersSection
 */
export const FinancialFiltersSection: React.FC<
  FinancialFiltersSectionProps
> = ({ filters, onUpdateFilter }) => {
  return (
    <Box>
      {/* Filtres - Exactement comme UserFiltersSection */}
      <Box sx={{ mb: 3 }}>
        <GenericFilters
          filters={filters}
          onUpdateFilter={onUpdateFilter}
          searchConfig={{
            placeholder: "Search transactions...",
            minWidth: 300,
          }}
          filterConfigs={financialFilterConfigs}
          simplified={true}
        />
      </Box>
    </Box>
  );
};
