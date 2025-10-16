import React from "react";
import { Box } from "@mui/material";
import DataTable from "../../Table";
import { UserProfile, USER_TABS } from "../../../types/userManagement";
import { UserFiltersSection } from "./UserFiltersSection";

interface UserTableSectionProps {
  // Filters & Tabs
  filters: any;
  onUpdateFilter: (key: string, value: string) => void;
  activeTab: number;
  allUsers: UserProfile[];
  onTabChange: (
    event: React.MouseEvent<HTMLElement>,
    newValue: number | null
  ) => void;

  // Selection & Actions
  selectedUsers: string[];
  onBulkValidate: () => void;
  onBulkSetPending: () => void;
  onBulkSuspend: () => void;
  onBulkUnsuspend: () => void;
  onBulkAction: (actionType: "delete" | "role" | "vip") => void;
  onBulkAddVip: () => void;
  onBulkRemoveVip: () => void;

  // Table Data
  columns: any[];
  filteredUsers: UserProfile[];
  isLoading: boolean;
}

export const UserTableSection: React.FC<UserTableSectionProps> = ({
  filters,
  onUpdateFilter,
  activeTab,
  allUsers,
  onTabChange,
  selectedUsers,
  onBulkValidate,
  onBulkSetPending,
  onBulkSuspend,
  onBulkUnsuspend,
  onBulkAction,
  onBulkAddVip,
  onBulkRemoveVip,
  columns,
  filteredUsers,
  isLoading,
}) => {
  return (
    <Box sx={{ mt: 2, border: "1px solid #ddd", borderRadius: 4, p: 2 }}>
      {/* Section Title */}
      <h3>Tous les utilisateurs</h3>
      <p>
        Gérez les utilisateurs de toutes les catégories grâce à des vues
        spécialisées.
      </p>

      {/* Filters, Tabs, and Actions */}
      <UserFiltersSection
        filters={filters}
        onUpdateFilter={onUpdateFilter}
        activeTab={activeTab}
        users={allUsers}
        onTabChange={onTabChange}
        selectedUsers={selectedUsers}
        onBulkValidate={onBulkValidate}
        onBulkSetPending={onBulkSetPending}
        onBulkSuspend={onBulkSuspend}
        onBulkUnsuspend={onBulkUnsuspend}
        onBulkAction={onBulkAction}
        onBulkAddVip={onBulkAddVip}
        onBulkRemoveVip={onBulkRemoveVip}
      />

      {/* Table des utilisateurs */}
      <DataTable columns={columns} data={filteredUsers} />

      {/* Loading & Empty States */}
      {isLoading && (
        <Box sx={{ textAlign: "center", py: 2 }}>Chargement...</Box>
      )}

      {filteredUsers.length === 0 && !isLoading && (
        <Box sx={{ textAlign: "center", py: 2, color: "text.secondary" }}>
          Aucun {USER_TABS[activeTab]?.label?.toLowerCase() || "utilisateur"}{" "}
          trouvé
        </Box>
      )}
    </Box>
  );
};
