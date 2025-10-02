import React from "react";
import { GenericFilters, propertyFilterConfigs } from "../shared";
import { PropertyFilters } from "../../types/propertyApprovals";

interface PropertyFiltersProps {
  filters: PropertyFilters;
  onUpdateFilter: (key: keyof PropertyFilters, value: string) => void;
  simplified?: boolean;
}

export const PropertyFiltersComponent: React.FC<PropertyFiltersProps> = ({
  filters,
  onUpdateFilter,
  simplified = false,
}) => {
  return (
    <GenericFilters
      filters={filters}
      onUpdateFilter={onUpdateFilter}
      searchConfig={{
        placeholder: "Search properties...",
        minWidth: 200,
      }}
      filterConfigs={propertyFilterConfigs}
      simplified={simplified}
    />
  );
};
