import React from "react";
import { GenericFilters, paymentFilterConfigs } from "../../shared";
import { PaymentFilters } from "../../../types/payments";

interface PaymentFiltersProps {
  filters: PaymentFilters;
  onUpdateFilter: (key: keyof PaymentFilters, value: string) => void;
  simplified?: boolean;
}

export const PaymentFiltersComponent: React.FC<PaymentFiltersProps> = ({
  filters,
  onUpdateFilter,
  simplified = false,
}) => {
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
