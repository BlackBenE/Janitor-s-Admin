import React from "react";
import { Box, Chip } from "@mui/material";
import {
  Check as CheckIcon,
  Close as CloseIcon,
  Visibility as VisibilityIcon,
  Home as HomeIcon,
  LocationOn as LocationIcon,
} from "@mui/icons-material";
import { GridRenderCellParams } from "@mui/x-data-grid";
import {
  GenericTableConfig,
  BaseItem,
  GenericAction,
  ColumnConfig,
  createDateColumn,
} from "../shared/GenericTableColumns";

// =====================================================
// TYPES SPÉCIFIQUES AUX PROPRIÉTÉS
// =====================================================

export interface PropertyItem extends BaseItem {
  title: string;
  owner_name: string;
  owner_email: string;
  location: string;
  address: string;
  rent_amount: number;
  validation_status: string;
  created_at: string;
}

export interface PropertyTableConfig {
  selectedProperties: string[];
  onTogglePropertySelection: (propertyId: string) => void;
  onApproveProperty: (propertyId: string) => void;
  onRejectProperty: (propertyId: string) => void;
  onViewProperty: (property: PropertyItem) => void;
  isApprovePending?: boolean;
  isRejectPending?: boolean;
}

// =====================================================
// CONFIGURATION DES COLONNES
// =====================================================

const createPropertyColumns = (): ColumnConfig[] => [
  {
    field: "title",
    headerName: "Property",
    width: 200,
    renderCell: (params: GridRenderCellParams) => (
      <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
        <Box>
          <Box sx={{ fontWeight: 500 }}>
            {params.value || "Untitled Property"}
          </Box>
          <Box sx={{ fontSize: "0.75rem", color: "text.secondary" }}>
            ID: {params.row.id?.slice(0, 8)}...
          </Box>
        </Box>
      </Box>
    ),
  },
  {
    field: "owner_name",
    headerName: "Owner",
    width: 180,
    renderCell: (params: GridRenderCellParams) => (
      <Box>
        <Box sx={{ fontWeight: 500 }}>{params.value || "Unknown Owner"}</Box>
        <Box sx={{ fontSize: "0.75rem", color: "text.secondary" }}>
          {params.row.owner_email || "No email"}
        </Box>
      </Box>
    ),
  },
  {
    field: "location",
    headerName: "Location",
    width: 200,
    renderCell: (params: GridRenderCellParams) => (
      <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
        <Box>
          <Box>{params.value || "Location not specified"}</Box>
          <Box sx={{ fontSize: "0.75rem", color: "text.secondary" }}>
            {params.row.address || "No address"}
          </Box>
        </Box>
      </Box>
    ),
  },
  {
    field: "rent_amount",
    headerName: "Price",
    width: 120,
    renderCell: (params: GridRenderCellParams) => (
      <Box sx={{ fontWeight: 500, color: "primary.main" }}>
        {params.value ? `€${params.value}` : "N/A"}
      </Box>
    ),
  },
  {
    field: "validation_status",
    headerName: "Status",
    width: 120,
    renderCell: (params: GridRenderCellParams) => {
      const getStatusColor = (status: string) => {
        switch (status?.toLowerCase()) {
          case "approved":
            return "success";
          case "rejected":
            return "error";
          case "under_review":
            return "info";
          case "pending":
          default:
            return "warning";
        }
      };

      const getStatusLabel = (status: string) => {
        switch (status?.toLowerCase()) {
          case "approved":
            return "Approved";
          case "rejected":
            return "Rejected";
          case "under_review":
            return "Under Review";
          case "pending":
          default:
            return "Pending";
        }
      };

      return (
        <Chip
          label={getStatusLabel(params.value)}
          color={getStatusColor(params.value) as any}
          size="small"
          variant="outlined"
        />
      );
    },
  },
  createDateColumn("created_at", "Submitted"),
];

// =====================================================
// CONFIGURATION DES ACTIONS
// =====================================================

const createPropertyActions = (
  config: PropertyTableConfig
): GenericAction[] => [
  {
    id: "view",
    label: "View Details",
    icon: VisibilityIcon,
    color: "primary",
    tooltip: "View Details",
    onClick: (item: BaseItem) => config.onViewProperty(item as PropertyItem),
  },
  {
    id: "approve",
    label: "Approve",
    icon: CheckIcon,
    color: "success",
    tooltip: "Approve",
    onClick: (item: BaseItem) => config.onApproveProperty(item.id),
    disabled: () => config.isApprovePending || false,
  },
  {
    id: "reject",
    label: "Reject",
    icon: CloseIcon,
    color: "error",
    tooltip: "Reject",
    onClick: (item: BaseItem) => config.onRejectProperty(item.id),
    disabled: () => config.isRejectPending || false,
  },
];

// =====================================================
// FONCTION PRINCIPALE
// =====================================================

export const createPropertyTableConfig = (
  config: PropertyTableConfig
): GenericTableConfig => ({
  selectable: true,
  selectedItems: config.selectedProperties,
  onToggleSelection: config.onTogglePropertySelection,

  columns: createPropertyColumns(),

  primaryActions: createPropertyActions(config),

  actionColumnWidth: 140,
  showActionsMenu: false,
});
