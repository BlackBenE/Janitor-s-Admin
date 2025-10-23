import React from "react";
import { Box, Chip, Checkbox } from "@mui/material";
import { GridRenderCellParams, GridColDef } from "@mui/x-data-grid";
import { ServiceWithDetails } from "../../../types/services";
import { ServiceTableActions } from "./ServiceTableActions";

interface ServiceTableColumnsProps {
  selectedServices: string[];
  onToggleServiceSelection: (serviceId: string) => void;
  onViewDetails: (service: ServiceWithDetails) => void;
  onApproveService: (serviceId: string) => void;
  onRejectService: (serviceId: string) => void;
  onDeleteService: (serviceId: string) => void;
}

const getStatusColor = (
  isActive: boolean | null
):
  | "default"
  | "primary"
  | "secondary"
  | "error"
  | "info"
  | "success"
  | "warning" => {
  return isActive ? "success" : "error";
};

const getCategoryColor = (
  category: string
):
  | "default"
  | "primary"
  | "secondary"
  | "error"
  | "info"
  | "success"
  | "warning" => {
  switch (category?.toLowerCase()) {
    case "nettoyage":
    case "ménage":
      return "primary";
    case "maintenance":
    case "plomberie":
    case "électricité":
      return "info";
    case "jardinage":
      return "success";
    case "peinture":
      return "warning";
    case "conciergerie":
    case "sécurité":
      return "secondary";
    default:
      return "default";
  }
};

const getStatusLabel = (isActive: boolean | null): string => {
  return isActive ? "Actif" : "Inactif";
};

const formatCurrency = (amount: number): string => {
  return new Intl.NumberFormat("fr-FR", {
    style: "currency",
    currency: "EUR",
  }).format(amount);
};

const formatDate = (dateString: string | null): string => {
  if (!dateString) return "N/A";
  return new Date(dateString).toLocaleDateString("fr-FR");
};

// Composant pour la cellule de sélection
const SelectCell: React.FC<{
  params: GridRenderCellParams;
  selectedServices: string[];
  onToggleServiceSelection: (serviceId: string) => void;
}> = ({ params, selectedServices, onToggleServiceSelection }) => (
  <Checkbox
    checked={selectedServices.includes(params.row.id)}
    onChange={() => onToggleServiceSelection(params.row.id)}
    size="small"
    onClick={(e) => e.stopPropagation()}
  />
);

export const createServiceTableColumns = ({
  selectedServices,
  onToggleServiceSelection,
  onViewDetails,
  onApproveService,
  onRejectService,
  onDeleteService,
}: ServiceTableColumnsProps): GridColDef[] => [
  {
    field: "select",
    headerName: "",
    width: 50,
    sortable: false,
    filterable: false,
    renderCell: (params: GridRenderCellParams) => (
      <SelectCell
        params={params}
        selectedServices={selectedServices}
        onToggleServiceSelection={onToggleServiceSelection}
      />
    ),
  },
  {
    field: "name",
    headerName: "Nom du service",
    width: 250,
    renderCell: (params: GridRenderCellParams) => (
      <Box>
        <Box sx={{ fontWeight: "medium" }}>{params.row.name}</Box>
        <Box sx={{ fontSize: "0.75rem", color: "text.secondary" }}>
          {params.row.description?.substring(0, 50)}
          {params.row.description?.length > 50 ? "..." : ""}
        </Box>
      </Box>
    ),
  },
  {
    field: "category",
    headerName: "Catégorie",
    width: 130,
    renderCell: (params: GridRenderCellParams) => (
      <Chip
        label={params.row.category}
        color={getCategoryColor(params.row.category)}
        size="small"
        variant="filled"
      />
    ),
  },
  {
    field: "base_price",
    headerName: "Prix",
    width: 120,
    renderCell: (params: GridRenderCellParams) => (
      <Box sx={{ fontWeight: "medium" }}>
        {formatCurrency(params.row.base_price)}
      </Box>
    ),
  },
  {
    field: "provider",
    headerName: "Prestataire",
    width: 200,
    renderCell: (params: GridRenderCellParams) => {
      const provider = params.row.provider;
      if (!provider) return <Box>N/A</Box>;
      
      return (
        <Box>
          <Box sx={{ fontWeight: "medium" }}>
            {provider.first_name && provider.last_name
              ? `${provider.first_name} ${provider.last_name}`
              : provider.full_name || "N/A"}
          </Box>
          <Box sx={{ fontSize: "0.75rem", color: "text.secondary" }}>
            {provider.email}
          </Box>
        </Box>
      );
    },
  },
  {
    field: "is_active",
    headerName: "Statut",
    width: 100,
    renderCell: (params: GridRenderCellParams) => (
      <Chip
        label={getStatusLabel(params.row.is_active)}
        color={getStatusColor(params.row.is_active)}
        size="small"
        variant="filled"
      />
    ),
  },
  {
    field: "is_vip_only",
    headerName: "VIP",
    width: 80,
    renderCell: (params: GridRenderCellParams) => (
      params.row.is_vip_only ? (
        <Chip
          label="VIP"
          color="warning"
          size="small"
          variant="filled"
        />
      ) : null
    ),
  },
  {
    field: "created_at",
    headerName: "Date de création",
    width: 130,
    renderCell: (params: GridRenderCellParams) => (
      <Box>{formatDate(params.row.created_at)}</Box>
    ),
  },
  {
    field: "actions",
    headerName: "Actions",
    width: 200,
    sortable: false,
    filterable: false,
    renderCell: (params: GridRenderCellParams) => (
      <ServiceTableActions
        params={params}
        onViewDetails={onViewDetails}
        onApproveService={onApproveService}
        onRejectService={onRejectService}
        onDeleteService={onDeleteService}
      />
    ),
  },
];