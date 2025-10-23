import React from "react";
import { Box, Button, Tooltip } from "@mui/material";
import {
  CheckCircle as ApproveIcon,
  Cancel as RejectIcon,
  Pause as SuspendIcon,
  Download as DownloadIcon,
} from "@mui/icons-material";
import { GenericFilters, GenericTabs } from "../../shared";
import { ServiceWithDetails, ServiceFilters } from "../../../types/services";

// Configuration des filtres pour services - seulement la recherche
const serviceFilterConfigs: any[] = [];

// Configuration des onglets pour services
const serviceTabConfigs = [
  { label: "Tous les services", key: "all" as const },
  { label: "Actifs", key: "active" as const },
  { label: "Inactifs", key: "inactive" as const },
  { label: "VIP", key: "vip" as const },
];

// Fonction pour compter les services par statut
const getServiceCount = (
  filterKey: "all" | "active" | "inactive" | "vip",
  services: ServiceWithDetails[]
) => {
  if (!services) return 0;

  switch (filterKey) {
    case "active":
      return services.filter((s) => s.is_active === true).length;
    case "inactive":
      return services.filter((s) => s.is_active === false).length;
    case "vip":
      return services.filter((s) => s.is_vip_only === true).length;
    case "all":
    default:
      return services.length;
  }
};

interface ServiceFiltersSectionProps {
  // Filters props
  filters: ServiceFilters;
  onUpdateFilter: (key: keyof ServiceFilters, value: string) => void;
  simplified?: boolean;

  // Tabs props
  activeTab: number;
  services: ServiceWithDetails[];
  onTabChange: (
    event: React.MouseEvent<HTMLElement>,
    newValue: number | null
  ) => void;

  // Actions props
  selectedServices: string[];
  onBulkApprove: () => void;
  onBulkReject: () => void;
  onBulkSuspend: () => void;
  onBulkExport: () => void;
  // Nouvelles actions avec mutations réelles
  bulkActivateServices?: (ids: string[]) => Promise<any>;
  bulkDeactivateServices?: (ids: string[]) => Promise<any>;
  deleteManyServices?: (ids: string[]) => Promise<any>;
}

// Actions component intégré
const ServiceBulkActions: React.FC<{
  selectedServices: string[];
  onBulkApprove: () => void;
  onBulkReject: () => void;
  onBulkSuspend: () => void;
  onBulkExport: () => void;
  bulkActivateServices?: (ids: string[]) => Promise<any>;
  bulkDeactivateServices?: (ids: string[]) => Promise<any>;
  deleteManyServices?: (ids: string[]) => Promise<any>;
}> = ({
  selectedServices,
  onBulkApprove,
  onBulkReject,
  onBulkSuspend,
  onBulkExport,
  bulkActivateServices,
  bulkDeactivateServices,
  deleteManyServices,
}) => {
  if (selectedServices.length === 0) {
    return null;
  }

  const handleApprove = async () => {
    if (bulkActivateServices) {
      try {
        await bulkActivateServices(selectedServices);
      } catch (error) {
        console.error("Error in bulk approve:", error);
      }
    } else {
      onBulkApprove();
    }
  };

  const handleReject = async () => {
    if (bulkDeactivateServices) {
      try {
        await bulkDeactivateServices(selectedServices);
      } catch (error) {
        console.error("Error in bulk reject:", error);
      }
    } else {
      onBulkReject();
    }
  };

  return (
    <Box sx={{ display: "flex", gap: 1, ml: "auto", flexWrap: "wrap" }}>
      <Tooltip title={`Approuver ${selectedServices.length} service(s)`}>
        <Button
          variant="contained"
          size="small"
          startIcon={<ApproveIcon />}
          onClick={handleApprove}
          color="success"
        >
          Approuver ({selectedServices.length})
        </Button>
      </Tooltip>

      <Tooltip title={`Rejeter ${selectedServices.length} service(s)`}>
        <Button
          variant="outlined"
          size="small"
          startIcon={<RejectIcon />}
          onClick={handleReject}
          color="error"
        >
          Rejeter
        </Button>
      </Tooltip>

      <Tooltip title={`Suspendre ${selectedServices.length} service(s)`}>
        <Button
          variant="outlined"
          size="small"
          startIcon={<SuspendIcon />}
          onClick={onBulkSuspend}
          color="warning"
        >
          Suspendre
        </Button>
      </Tooltip>

      <Tooltip title={`Exporter ${selectedServices.length} service(s)`}>
        <Button
          variant="outlined"
          size="small"
          startIcon={<DownloadIcon />}
          onClick={onBulkExport}
        >
          Exporter
        </Button>
      </Tooltip>
    </Box>
  );
};

// Filters component intégré
const ServiceFiltersComponent: React.FC<{
  filters: ServiceFilters;
  onUpdateFilter: (key: keyof ServiceFilters, value: string) => void;
  simplified?: boolean;
}> = ({ filters, onUpdateFilter, simplified = false }) => {
  return (
    <GenericFilters
      filters={filters}
      onUpdateFilter={onUpdateFilter}
      searchConfig={{
        placeholder: "Rechercher des services...",
        minWidth: 200,
      }}
      filterConfigs={serviceFilterConfigs}
      simplified={simplified}
    />
  );
};

// Tabs component intégré
const ServiceTabsComponent: React.FC<{
  activeTab: number;
  services: ServiceWithDetails[];
  onTabChange: (
    event: React.MouseEvent<HTMLElement>,
    newValue: number | null
  ) => void;
}> = ({ activeTab, services, onTabChange }) => {
  return (
    <GenericTabs<ServiceWithDetails, "all" | "active" | "inactive" | "vip">
      activeTab={activeTab}
      items={services}
      tabConfigs={serviceTabConfigs}
      onTabChange={onTabChange}
      getItemCount={getServiceCount}
      ariaLabel="service status filter"
    />
  );
};

export const ServiceFiltersSection: React.FC<ServiceFiltersSectionProps> = ({
  // Filters
  filters,
  onUpdateFilter,
  simplified = false,

  // Tabs
  activeTab,
  services,
  onTabChange,

  // Actions
  selectedServices,
  onBulkApprove,
  onBulkReject,
  onBulkSuspend,
  onBulkExport,
  // Nouvelles actions avec mutations réelles
  bulkActivateServices,
  bulkDeactivateServices,
  deleteManyServices,
}) => {
  return (
    <Box sx={{ mb: 3 }}>
      {/* Filtres de recherche */}
      <Box sx={{ mb: 2 }}>
        <ServiceFiltersComponent
          filters={filters}
          onUpdateFilter={onUpdateFilter}
          simplified={simplified}
        />
      </Box>

      {/* Onglets de statut et actions groupées */}
      <Box
        sx={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          flexWrap: "wrap",
          gap: 2,
        }}
      >
        <ServiceTabsComponent
          activeTab={activeTab}
          services={services}
          onTabChange={onTabChange}
        />

        <ServiceBulkActions
          selectedServices={selectedServices}
          onBulkApprove={onBulkApprove}
          onBulkReject={onBulkReject}
          onBulkSuspend={onBulkSuspend}
          onBulkExport={onBulkExport}
          bulkActivateServices={bulkActivateServices}
          bulkDeactivateServices={bulkDeactivateServices}
          deleteManyServices={deleteManyServices}
        />
      </Box>
    </Box>
  );
};
