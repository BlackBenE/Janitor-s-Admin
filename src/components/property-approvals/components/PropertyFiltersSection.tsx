import React from "react";
import { Box, Button, Tooltip, Typography, Divider } from "@mui/material";
import {
  Check as CheckIcon,
  Close as CloseIcon,
  Delete as DeleteIcon,
} from "@mui/icons-material";
import {
  GenericFilters,
  GenericTabs,
  propertyFilterConfigs,
  propertyTabConfigs,
  getPropertyCount,
} from "../../shared";
import {
  PropertyFilters,
  PropertyStatus,
} from "../../../types/propertyApprovals";

interface PropertyFiltersSectionProps {
  // Filters props
  filters: PropertyFilters;
  onUpdateFilter: (key: keyof PropertyFilters, value: string) => void;
  simplified?: boolean;

  // Tabs props
  activeTab: number;
  properties: any[];
  onTabChange: (
    event: React.MouseEvent<HTMLElement>,
    newValue: number | null
  ) => void;

  // Actions props
  selectedProperties: string[];
  onApproveSelected: () => void;
  onRejectSelected: () => void;
  onClearSelection: () => void;
  isApprovePending?: boolean;
  isRejectPending?: boolean;
}

// Actions component intégré
const PropertyBulkActions: React.FC<{
  selectedProperties: string[];
  onApproveSelected: () => void;
  onRejectSelected: () => void;
  onClearSelection: () => void;
  isApprovePending?: boolean;
  isRejectPending?: boolean;
}> = ({
  selectedProperties,
  onApproveSelected,
  onRejectSelected,
  onClearSelection,
  isApprovePending = false,
  isRejectPending = false,
}) => {
  const selectedCount = selectedProperties.length;

  if (selectedCount === 0) return null;

  return (
    <Box
      sx={{
        display: "flex",
        alignItems: "center",
        gap: 2,
        p: 2,
        backgroundColor: "action.hover",
        borderRadius: 1,
        mb: 2,
      }}
    >
      <Typography variant="body2" sx={{ fontWeight: 500 }}>
        {selectedCount} propert{selectedCount === 1 ? "y" : "ies"} selected
      </Typography>

      <Divider orientation="vertical" flexItem />

      <Box sx={{ display: "flex", gap: 1 }}>
        <Tooltip
          title={`Approve ${selectedCount} propert${
            selectedCount === 1 ? "y" : "ies"
          }`}
        >
          <Button
            variant="contained"
            color="success"
            size="small"
            startIcon={<CheckIcon />}
            onClick={onApproveSelected}
            disabled={isApprovePending}
          >
            Approve All
          </Button>
        </Tooltip>

        <Tooltip
          title={`Reject ${selectedCount} propert${
            selectedCount === 1 ? "y" : "ies"
          }`}
        >
          <Button
            variant="contained"
            color="error"
            size="small"
            startIcon={<CloseIcon />}
            onClick={onRejectSelected}
            disabled={isRejectPending}
          >
            Reject All
          </Button>
        </Tooltip>

        <Tooltip title="Clear selection">
          <Button
            variant="outlined"
            size="small"
            startIcon={<DeleteIcon />}
            onClick={onClearSelection}
          >
            Clear
          </Button>
        </Tooltip>
      </Box>
    </Box>
  );
};

// Filters component intégré
const PropertyFiltersComponent: React.FC<{
  filters: PropertyFilters;
  onUpdateFilter: (key: keyof PropertyFilters, value: string) => void;
  simplified?: boolean;
}> = ({ filters, onUpdateFilter, simplified = false }) => {
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

// Tabs component intégré
const PropertyTabsComponent: React.FC<{
  activeTab: number;
  properties: any[];
  onTabChange: (
    event: React.MouseEvent<HTMLElement>,
    newValue: number | null
  ) => void;
}> = ({ activeTab, properties, onTabChange }) => {
  return (
    <GenericTabs<any, PropertyStatus>
      activeTab={activeTab}
      items={properties}
      tabConfigs={propertyTabConfigs}
      onTabChange={onTabChange}
      getItemCount={getPropertyCount}
      ariaLabel="property status filter"
    />
  );
};

export const PropertyFiltersSection: React.FC<PropertyFiltersSectionProps> = ({
  // Filters
  filters,
  onUpdateFilter,
  simplified = false,

  // Tabs
  activeTab,
  properties,
  onTabChange,

  // Actions
  selectedProperties,
  onApproveSelected,
  onRejectSelected,
  onClearSelection,
  isApprovePending = false,
  isRejectPending = false,
}) => {
  return (
    <Box sx={{ mb: 3 }}>
      {/* Filtres de recherche */}
      <Box sx={{ mb: 2 }}>
        <PropertyFiltersComponent
          filters={filters}
          onUpdateFilter={onUpdateFilter}
          simplified={simplified}
        />
      </Box>

      {/* Onglets de statut */}
      <Box sx={{ mb: 2 }}>
        <PropertyTabsComponent
          activeTab={activeTab}
          properties={properties}
          onTabChange={onTabChange}
        />
      </Box>

      {/* Actions groupées */}
      <PropertyBulkActions
        selectedProperties={selectedProperties}
        onApproveSelected={onApproveSelected}
        onRejectSelected={onRejectSelected}
        onClearSelection={onClearSelection}
        isApprovePending={isApprovePending}
        isRejectPending={isRejectPending}
      />
    </Box>
  );
};
