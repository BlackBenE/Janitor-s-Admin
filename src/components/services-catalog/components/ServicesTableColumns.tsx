import React from "react";
import { GridColDef, GridRenderCellParams } from "@mui/x-data-grid";
import { Box, Chip, Avatar, Typography, Checkbox } from "@mui/material";
import { ServiceWithDetails } from "../../../types/services";
// import { ServicesTableActions } from "./ServicesTableActions";

interface ServicesTableColumnsProps {
  selectedServices: string[];
  onToggleServiceSelection: (serviceId: string) => void;
  onViewDetails: (service: ServiceWithDetails) => void;
  onEditService: (service: ServiceWithDetails) => void;
  onActivateService: (serviceId: string) => void;
  onDeactivateService: (serviceId: string) => void;
  onDeleteService: (serviceId: string) => void;
}

// =====================================================
// UTILITAIRES DE FORMATAGE
// =====================================================

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

const formatDuration = (minutes: number | null): string => {
  if (!minutes) return "N/A";
  if (minutes < 60) return `${minutes} min`;
  const hours = Math.floor(minutes / 60);
  const remainingMinutes = minutes % 60;
  return remainingMinutes > 0
    ? `${hours}h ${remainingMinutes}min`
    : `${hours}h`;
};

// =====================================================
// COULEURS ET LABELS
// =====================================================

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
  if (isActive === true) return "success";
  if (isActive === false) return "error";
  return "default";
};

const getStatusLabel = (isActive: boolean | null): string => {
  if (isActive === true) return "Actif";
  if (isActive === false) return "Inactif";
  return "Inconnu";
};

// Couleurs basées sur l'enum service_category_enum de la DB
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
    case "cleaning":
      return "primary";
    case "maintenance":
    case "réparation":
      return "info";
    case "transport":
      return "success";
    case "concierge":
      return "secondary";
    case "other":
      return "warning";
    default:
      return "default";
  }
};

const getCategoryLabel = (category: string): string => {
  switch (category?.toLowerCase()) {
    case "cleaning":
      return "Nettoyage";
    case "maintenance":
      return "Maintenance";
    case "transport":
      return "Transport";
    case "concierge":
      return "Conciergerie";
    case "other":
      return "Autre";
    default:
      return category || "Non défini";
  }
};

// =====================================================
// COMPOSANTS CELLULES
// =====================================================

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

export const createServicesTableColumns = ({
  selectedServices,
  onToggleServiceSelection,
  onViewDetails,
  onEditService,
  onActivateService,
  onDeactivateService,
  onDeleteService,
}: ServicesTableColumnsProps): GridColDef[] => [
  // Colonne de sélection
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

  // Service avec avatar et description
  {
    field: "name",
    headerName: "Service",
    minWidth: 200,
    flex: 1,
    renderCell: (params: GridRenderCellParams) => (
      <Box sx={{ display: "flex", alignItems: "center", gap: 2 }}>
        <Avatar src={params.row.image_url} sx={{ width: 32, height: 32 }}>
          {params.row.name?.charAt(0)?.toUpperCase()}
        </Avatar>
        <Box>
          <Typography variant="body2" fontWeight="medium">
            {params.row.name || "Service sans nom"}
          </Typography>
          {params.row.description && (
            <Typography variant="caption" color="text.secondary" noWrap>
              {params.row.description.substring(0, 50)}...
            </Typography>
          )}
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
        label={params.row.category || "Non définie"}
        color={getCategoryColor(params.row.category)}
        size="small"
        variant="filled"
      />
    ),
  },
  {
    field: "provider",
    headerName: "Prestataire",
    width: 180,
    renderCell: (params: GridRenderCellParams) => (
      <Box>
        <Typography variant="body2" fontWeight="medium">
          {params.row.provider
            ? `${params.row.provider.first_name || ""} ${
                params.row.provider.last_name || ""
              }`.trim()
            : "Prestataire inconnu"}
        </Typography>
        {params.row.provider?.email && (
          <Typography variant="caption" color="text.secondary">
            {params.row.provider.email}
          </Typography>
        )}
      </Box>
    ),
  },
  {
    field: "base_price",
    headerName: "Prix de base",
    width: 120,
    renderCell: (params: GridRenderCellParams) => (
      <Typography variant="body2" fontWeight="medium" color="primary">
        {formatCurrency(params.row.base_price || 0)}
      </Typography>
    ),
  },
  {
    field: "duration_minutes",
    headerName: "Durée",
    width: 100,
    renderCell: (params: GridRenderCellParams) => {
      const duration = params.row.duration_minutes;
      if (!duration) return <Typography variant="body2">N/A</Typography>;

      if (duration < 60) {
        return <Typography variant="body2">{duration}min</Typography>;
      } else {
        const hours = Math.floor(duration / 60);
        const minutes = duration % 60;
        return (
          <Typography variant="body2">
            {hours}h{minutes > 0 ? `${minutes}min` : ""}
          </Typography>
        );
      }
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
    renderCell: (params: GridRenderCellParams) =>
      params.row.is_vip_only ? (
        <Chip label="VIP" color="warning" size="small" variant="outlined" />
      ) : null,
  },
  {
    field: "created_at",
    headerName: "Créé le",
    width: 110,
    renderCell: (params: GridRenderCellParams) => (
      <Typography variant="body2">
        {formatDate(params.row.created_at)}
      </Typography>
    ),
  },
  {
    field: "actions",
    headerName: "Actions",
    width: 120,
    sortable: false,
    filterable: false,
    renderCell: (params: GridRenderCellParams) => (
      <Box>
        {/* ServicesTableActions sera ajouté une fois que le composant sera correctement importé */}
        <Typography variant="caption">Actions</Typography>
      </Box>
    ),
  },
];
