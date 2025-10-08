import React from "react";
import { Box, Chip, Typography } from "@mui/material";
import {
  Check as CheckIcon,
  Close as CloseIcon,
  Schedule as ScheduleIcon,
  Visibility as VisibilityIcon,
  Home as HomeIcon,
  LocationOn as LocationIcon,
  Edit as EditIcon,
  Delete as DeleteIcon,
} from "@mui/icons-material";
import { GridRenderCellParams } from "@mui/x-data-grid";
import {
  GenericTableConfig,
  BaseItem,
  GenericAction,
  ColumnConfig,
  createDateColumn,
} from "../shared/GenericTableColumns";
import { PropertyWithOwner } from "../../types";

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
  onSetPendingProperty: (propertyId: string) => void;
  onViewProperty: (property: PropertyItem) => void;
  onDeleteProperty: (propertyId: string) => void;
  isApprovePending?: boolean;
  isRejectPending?: boolean;
  isPendingPending?: boolean;
  isDeletePending?: boolean;
}

// =====================================================
// CONFIGURATION DES COLONNES
// =====================================================

const createPropertyColumns = (config: PropertyTableConfig): ColumnConfig[] => [
  {
    field: "title",
    headerName: "Property",
    flex: 1,
    renderCell: (params: GridRenderCellParams) => {
      const imageCount = params.row.images?.length || 0;
      return (
        <Box
          sx={{
            display: "flex",
            alignItems: "center",
            height: "100%",
          }}
        >
          <Box
            sx={{
              display: "flex",
              flexDirection: "column",
              gap: 0,
              justifyContent: "center",
            }}
          >
            <Typography
              variant="body2"
              fontWeight="medium"
              sx={{ lineHeight: 1.1, margin: 0, padding: 0 }}
            >
              {params.value || "Untitled"}
            </Typography>
            <Typography
              variant="caption"
              color="text.secondary"
              sx={{ lineHeight: 1.1, margin: 0, padding: 0 }}
            >
              {imageCount > 0
                ? `${imageCount} image${imageCount > 1 ? "s" : ""}`
                : "No images"}
            </Typography>
          </Box>
        </Box>
      );
    },
  },
  {
    field: "owner_name",
    headerName: "Owner",
    renderCell: (params: GridRenderCellParams) => (
      <Box
        sx={{
          display: "flex",
          flexDirection: "column",
          gap: 0,
          height: "100%",
          justifyContent: "center",
        }}
      >
        <Typography
          variant="body2"
          fontWeight="medium"
          sx={{ lineHeight: 1.1, margin: 0, padding: 0 }}
        >
          {params.value || "Unknown"}
        </Typography>
        <Typography
          variant="caption"
          color="text.secondary"
          sx={{ lineHeight: 1.1, margin: 0, padding: 0 }}
        >
          {params.row.owner_email || "No email"}
        </Typography>
      </Box>
    ),
  },
  {
    field: "location",
    headerName: "Location",
    width: 200,
    renderCell: (params: GridRenderCellParams) => (
      <Box
        sx={{
          display: "flex",
          alignItems: "center",
          height: "100%",
        }}
      >
        <Box
          sx={{
            display: "flex",
            flexDirection: "column",
            gap: 0,
            justifyContent: "center",
          }}
        >
          <Typography
            variant="body2"
            sx={{ lineHeight: 1.1, margin: 0, padding: 0 }}
          >
            {params.value || "N/A"}
          </Typography>
          <Typography
            variant="caption"
            color="text.secondary"
            sx={{ lineHeight: 1.1, margin: 0, padding: 0 }}
          >
            {params.row.address || "No address"}
          </Typography>
        </Box>
      </Box>
    ),
  },
  {
    field: "rent_amount",
    headerName: "Price",
    width: 120,
    renderCell: (params: GridRenderCellParams) => (
      <Typography variant="body2" fontWeight="medium">
        {params.value ? `$${params.value}` : "N/A"}
      </Typography>
    ),
  },
  {
    field: "validation_status",
    headerName: "Status",
    width: 130,
    renderCell: (params: GridRenderCellParams) => {
      const status = params.value || "pending";
      let chipProps;

      switch (status.toLowerCase()) {
        case "approved":
          chipProps = { color: "success" as const, variant: "filled" as const };
          break;
        case "rejected":
          chipProps = { color: "error" as const, variant: "filled" as const };
          break;
        default:
        case "pending":
          chipProps = { color: "warning" as const, variant: "filled" as const };
          break;
      }

      const statusText = (() => {
        switch (status.toLowerCase()) {
          case "approved":
            return "Approved";
          case "rejected":
            return "Rejected";
          default:
          case "pending":
            return "Pending";
        }
      })();

      return <Chip {...chipProps} label={statusText} size="small" />;
    },
  },
  createDateColumn("created_at", "Submitted"),
  createActionsColumn(config),
];

// =====================================================
// CONFIGURATION DES ACTIONS
// =====================================================

import { PropertyTableActions } from "./components/PropertyTableActions";

const createActionsColumn = (config: PropertyTableConfig): ColumnConfig => ({
  field: "actions",
  headerName: "Actions",
  width: 120,
  renderCell: (params: GridRenderCellParams) => (
    <PropertyTableActions
      params={params}
      onViewProperty={config.onViewProperty}
      onApproveProperty={config.onApproveProperty}
      onRejectProperty={config.onRejectProperty}
      onSetPendingProperty={config.onSetPendingProperty}
      onDeleteProperty={config.onDeleteProperty}
      isApprovePending={config.isApprovePending}
      isRejectPending={config.isRejectPending}
      isPendingPending={config.isPendingPending}
      isDeletePending={config.isDeletePending}
    />
  ),
});

// =====================================================
// FONCTION PRINCIPALE
// =====================================================

export const createPropertyTableConfig = (
  config: PropertyTableConfig
): GenericTableConfig => ({
  selectable: true,
  selectedItems: config.selectedProperties,
  onToggleSelection: config.onTogglePropertySelection,

  columns: createPropertyColumns(config),

  primaryActions: [],

  actionColumnWidth: 140,
  showActionsMenu: false,
});
