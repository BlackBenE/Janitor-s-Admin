import React from "react";
import { Box, Button, Tooltip } from "@mui/material";
import {
  Delete as DeleteIcon,
  SupervisorAccount as SupervisorAccountIcon,
  WorkspacePremium as WorkspacePremiumIcon,
} from "@mui/icons-material";
import { GenericFilters, userFilterConfigs } from "../../shared";
import { GenericTabs, userTabConfigs, getUserCount } from "../../shared";
import {
  UserFilters,
  UserProfile,
  UserRole,
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
        <GenericFilters
          filters={filters}
          onUpdateFilter={onUpdateFilter}
          searchConfig={{
            placeholder: "Search users...",
            minWidth: 200,
          }}
          filterConfigs={userFilterConfigs}
          simplified={true}
        />
      </Box>

      {/* Onglets */}
      <Box sx={{ mb: 3 }}>
        <GenericTabs<UserProfile, UserRole | null>
          activeTab={activeTab}
          items={users}
          tabConfigs={userTabConfigs}
          onTabChange={onTabChange}
          getItemCount={getUserCount}
          ariaLabel="user type filter"
        />
      </Box>

      {/* Actions en lot */}
      {selectedUsers.length > 0 && (
        <Box sx={{ display: "flex", gap: 1, ml: "auto", flexWrap: "wrap" }}>
          <Button
            variant="outlined"
            color="success"
            size="small"
            onClick={onBulkValidate}
          >
            Validate Selected ({selectedUsers.length})
          </Button>

          <Button
            variant="outlined"
            color="error"
            size="small"
            onClick={onBulkSuspend}
          >
            Suspend Selected ({selectedUsers.length})
          </Button>

          <Tooltip title="Changer le rôle des utilisateurs sélectionnés">
            <Button
              variant="outlined"
              color="info"
              size="small"
              startIcon={<SupervisorAccountIcon />}
              onClick={() => onBulkAction("role")}
            >
              Change Role
            </Button>
          </Tooltip>

          <Tooltip title="Basculer le statut VIP des utilisateurs sélectionnés">
            <Button
              variant="outlined"
              color="warning"
              size="small"
              startIcon={<WorkspacePremiumIcon />}
              onClick={() => onBulkAction("vip")}
            >
              Toggle VIP
            </Button>
          </Tooltip>

          <Tooltip title="Supprimer les utilisateurs sélectionnés">
            <Button
              variant="outlined"
              color="error"
              size="small"
              startIcon={<DeleteIcon />}
              onClick={() => onBulkAction("delete")}
            >
              Delete Selected
            </Button>
          </Tooltip>
        </Box>
      )}
    </Box>
  );
};
