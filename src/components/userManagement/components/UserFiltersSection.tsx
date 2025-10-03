import React from "react";
import { Box } from "@mui/material";
import { UserFiltersComponent } from "../UserFilters";
import { UserTabs } from "../UserTabs";
import { UserActions } from "../UserActions";
import {
  UserFilters,
  UserProfile,
  USER_TABS,
} from "../../../types/userManagement";

interface UserFiltersSectionProps {
  filters: UserFilters;
  onUpdateFilter: (key: keyof UserFilters, value: string) => void;
  activeTab: number;
  users: UserProfile[];
  onTabChange: (
    event: React.MouseEvent<HTMLElement>,
    newValue: number | null
  ) => void;
  selectedUsers: string[];
  onBulkValidate: () => void;
  onBulkSuspend: () => void;
  onBulkAction: (actionType: "delete" | "role" | "vip") => void;
}

export const UserFiltersSection: React.FC<UserFiltersSectionProps> = ({
  filters,
  onUpdateFilter,
  activeTab,
  users,
  onTabChange,
  selectedUsers,
  onBulkValidate,
  onBulkSuspend,
  onBulkAction,
}) => {
  return (
    <Box>
      {/* Filtres */}
      <Box sx={{ mb: 3 }}>
        <UserFiltersComponent
          filters={filters}
          onUpdateFilter={onUpdateFilter}
          simplified={true}
        />
      </Box>

      {/* Onglets */}
      <Box sx={{ mb: 3 }}>
        <UserTabs
          activeTab={activeTab}
          users={users}
          onTabChange={onTabChange}
        />
      </Box>

      {/* Actions en lot */}
      {selectedUsers.length > 0 && (
        <Box sx={{ mb: 3 }}>
          <UserActions
            selectedUsers={selectedUsers}
            onBulkValidate={onBulkValidate}
            onBulkSuspend={onBulkSuspend}
            onBulkAction={onBulkAction}
          />
        </Box>
      )}
    </Box>
  );
};
