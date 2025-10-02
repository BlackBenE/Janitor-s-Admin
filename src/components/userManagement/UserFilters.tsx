import React from "react";
import { GenericFilters, userFilterConfigs } from "../shared";
import { UserFilters } from "../../types/userManagement";

interface UserFiltersProps {
  filters: UserFilters;
  onUpdateFilter: (key: keyof UserFilters, value: string) => void;
  simplified?: boolean;
}

export const UserFiltersComponent: React.FC<UserFiltersProps> = ({
  filters,
  onUpdateFilter,
  simplified = false,
}) => {
  return (
    <GenericFilters
      filters={filters}
      onUpdateFilter={onUpdateFilter}
      searchConfig={{
        placeholder: "Search users...",
        minWidth: 200,
      }}
      filterConfigs={userFilterConfigs}
      simplified={simplified}
    />
  );
};
