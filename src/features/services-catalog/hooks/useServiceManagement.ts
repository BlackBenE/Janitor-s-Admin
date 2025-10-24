import { useState } from "react";
import {
  ServiceWithDetails,
  ServiceFilters,
  ServiceNotificationState,
} from "@/types/services";
import { useExport } from "../../../hooks/shared/useExport";

const initialFilters: ServiceFilters = {
  search: "",
  status: "",
  category: "",
  priceFrom: "",
  priceTo: "",
  provider: "",
  isVipOnly: false,
};

const initialNotification: ServiceNotificationState = {
  open: false,
  message: "",
  severity: "success",
};

/**
 * Hook principal pour la gestion de l'état de la page Services Management
 */
export const useServiceManagement = () => {
  // Hook d'export
  const { exportToCSV, commonColumns, formatters } = useExport();

  // États principaux
  const [selectedService, setSelectedService] =
    useState<ServiceWithDetails | null>(null);
  const [selectedServices, setSelectedServices] = useState<string[]>([]);
  const [editForm, setEditForm] = useState<Partial<ServiceWithDetails>>({});

  // États de l'interface
  const [filters, setFilters] = useState<ServiceFilters>(initialFilters);
  const [notification, setNotification] =
    useState<ServiceNotificationState>(initialNotification);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);

  // =====================================================
  // GESTION DES SERVICES SÉLECTIONNÉS
  // =====================================================

  const toggleServiceSelection = (serviceId: string) => {
    setSelectedServices((prev) =>
      prev.includes(serviceId)
        ? prev.filter((id) => id !== serviceId)
        : [...prev, serviceId]
    );
  };

  const selectAllServices = (serviceIds: string[]) => {
    setSelectedServices(serviceIds);
  };

  const clearSelection = () => setSelectedServices([]);

  // =====================================================
  // GESTION DES FILTRES
  // =====================================================

  const updateFilters = (newFilters: Partial<ServiceFilters>) => {
    setFilters((prev) => ({ ...prev, ...newFilters }));
  };

  const updateFilter = (key: keyof ServiceFilters, value: string) => {
    setFilters((prev) => ({
      ...prev,
      [key]: value,
    }));
  };

  const resetFilters = () => {
    setFilters(initialFilters);
  };

  const applyStatusFilter = (status: string) => {
    setFilters((prev) => ({ ...prev, status }));
  };

  // Fonction de filtrage
  const filterServices = (services: ServiceWithDetails[]) => {
    return services.filter((service) => {
      const matchesSearch =
        !filters.search ||
        service.name.toLowerCase().includes(filters.search.toLowerCase()) ||
        service.description
          ?.toLowerCase()
          .includes(filters.search.toLowerCase()) ||
        service.provider?.email
          ?.toLowerCase()
          .includes(filters.search.toLowerCase()) ||
        service.provider?.first_name
          ?.toLowerCase()
          .includes(filters.search.toLowerCase()) ||
        service.provider?.last_name
          ?.toLowerCase()
          .includes(filters.search.toLowerCase());

      const matchesStatus =
        !filters.status ||
        (filters.status === "active" && service.is_active) ||
        (filters.status === "inactive" && !service.is_active);

      const matchesCategory =
        !filters.category || service.category === filters.category;

      const matchesPrice =
        (!filters.priceFrom ||
          service.base_price >= parseFloat(filters.priceFrom)) &&
        (!filters.priceTo || service.base_price <= parseFloat(filters.priceTo));

      const matchesProvider =
        !filters.provider || service.provider_id === filters.provider;

      const matchesVipFilter = !filters.isVipOnly || service.is_vip_only;

      return (
        matchesSearch &&
        matchesStatus &&
        matchesCategory &&
        matchesPrice &&
        matchesProvider &&
        matchesVipFilter
      );
    });
  };

  // =====================================================
  // GESTION DES MODALS
  // =====================================================

  const openModal = (service?: ServiceWithDetails) => {
    if (service) setSelectedService(service);
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setSelectedService(null);
    setIsModalOpen(false);
  };

  const openEditModal = (service: ServiceWithDetails) => {
    setSelectedService(service);
    setEditForm(service);
    setIsEditModalOpen(true);
  };

  const closeEditModal = () => {
    setSelectedService(null);
    setEditForm({});
    setIsEditModalOpen(false);
  };

  const openCreateModal = () => {
    setEditForm({});
    setIsCreateModalOpen(true);
  };

  const closeCreateModal = () => {
    setEditForm({});
    setIsCreateModalOpen(false);
  };

  // =====================================================
  // GESTION DES NOTIFICATIONS
  // =====================================================

  const showNotification = (
    message: string,
    severity: "success" | "error" | "warning" | "info" = "success"
  ) => {
    setNotification({ open: true, message, severity });
  };

  const hideNotification = () => {
    setNotification((prev) => ({ ...prev, open: false }));
  };

  // =====================================================
  // GESTION DU FORMULAIRE
  // =====================================================

  const updateEditForm = (field: string, value: any) => {
    setEditForm((prev) => ({
      ...prev,
      [field]: value,
    }));
  };

  const resetEditForm = () => {
    setEditForm({});
  };

  // =====================================================
  // ACTIONS GROUPÉES
  // =====================================================

  const exportSelectedToCSV = (allServices: ServiceWithDetails[]) => {
    const selectedServiceDetails = allServices.filter((service) =>
      selectedServices.includes(service.id)
    );

    if (selectedServiceDetails.length === 0) {
      showNotification("Aucun service sélectionné à exporter", "warning");
      return;
    }

    // Transformer les données pour inclure les propriétés calculées
    const transformedData = selectedServiceDetails.map((service) => ({
      ...service,
      provider_name: service.provider
        ? `${service.provider.first_name || ""} ${
            service.provider.last_name || ""
          }`.trim()
        : "N/A",
      provider_email: service.provider?.email || "N/A",
    }));

    const columns = [
      { key: "id", label: "ID" },
      { key: "name", label: "Nom" },
      { key: "category", label: "Catégorie" },
      commonColumns.currency("base_price", "Prix"),
      { key: "is_active", label: "Actif" },
      { key: "provider_name", label: "Prestataire" },
      { key: "provider_email", label: "Email prestataire" },
      commonColumns.date("created_at", "Date de création"),
    ];

    exportToCSV(transformedData, columns, {
      filename: `services_selection_${
        new Date().toISOString().split("T")[0]
      }.csv`,
    });

    showNotification(
      `${selectedServiceDetails.length} services exportés`,
      "success"
    );
  };

  const exportAllToCSV = (allServices: ServiceWithDetails[]) => {
    if (!allServices || allServices.length === 0) {
      showNotification("Aucun service à exporter", "warning");
      return;
    }

    // Transformer les données pour inclure les propriétés calculées
    const transformedData = allServices.map((service) => ({
      ...service,
      provider_name: service.provider
        ? `${service.provider.first_name || ""} ${
            service.provider.last_name || ""
          }`.trim()
        : "N/A",
      provider_email: service.provider?.email || "N/A",
    }));

    const columns = [
      { key: "id", label: "ID" },
      { key: "name", label: "Nom" },
      { key: "category", label: "Catégorie" },
      commonColumns.currency("base_price", "Prix"),
      { key: "is_active", label: "Actif" },
      { key: "provider_name", label: "Prestataire" },
      { key: "provider_email", label: "Email prestataire" },
      commonColumns.date("created_at", "Date de création"),
    ];

    exportToCSV(transformedData, columns, {
      filename: `tous_services_${new Date().toISOString().split("T")[0]}.csv`,
    });

    showNotification(`${allServices.length} services exportés`, "success");
  };

  const approveSelectedServices = () => {
    console.log("Approve selected services:", selectedServices);
    showNotification(
      `${selectedServices.length} services approuvés`,
      "success"
    );
    clearSelection();
  };

  const rejectSelectedServices = () => {
    console.log("Reject selected services:", selectedServices);
    showNotification(`${selectedServices.length} services rejetés`, "success");
    clearSelection();
  };

  // Bulk actions avec vraies mutations
  const approveSelectedServicesReal = async (
    bulkActivateServices: (ids: string[]) => Promise<any>
  ) => {
    try {
      await bulkActivateServices(selectedServices);
      showNotification(
        `${selectedServices.length} services activés avec succès`,
        "success"
      );
      clearSelection();
    } catch (error) {
      console.error("Error activating services:", error);
      showNotification("Erreur lors de l'activation des services", "error");
    }
  };

  const rejectSelectedServicesReal = async (
    bulkDeactivateServices: (ids: string[]) => Promise<any>
  ) => {
    try {
      await bulkDeactivateServices(selectedServices);
      showNotification(
        `${selectedServices.length} services désactivés avec succès`,
        "success"
      );
      clearSelection();
    } catch (error) {
      console.error("Error deactivating services:", error);
      showNotification("Erreur lors de la désactivation des services", "error");
    }
  };

  const deleteSelectedServicesReal = async (
    deleteManyServices: (ids: string[]) => Promise<any>
  ) => {
    try {
      await deleteManyServices(selectedServices);
      showNotification(
        `${selectedServices.length} services supprimés avec succès`,
        "success"
      );
      clearSelection();
    } catch (error) {
      console.error("Error deleting services:", error);
      showNotification("Erreur lors de la suppression des services", "error");
    }
  };

  // =====================================================
  // PROPRIÉTÉS CALCULÉES
  // =====================================================

  const hasSelection = selectedServices.length > 0;
  const hasActiveFilters = Object.entries(filters).some(
    ([key, value]) => value !== initialFilters[key as keyof ServiceFilters]
  );

  return {
    // États principaux
    selectedService,
    selectedServices,
    editForm,
    filters,
    notification,
    isModalOpen,
    isEditModalOpen,
    isCreateModalOpen,

    // Actions de sélection
    toggleServiceSelection,
    selectAllServices,
    clearSelection,

    // Actions de filtrage
    updateFilters,
    updateFilter,
    resetFilters,
    applyStatusFilter,
    filterServices,

    // Actions de modal
    openModal,
    closeModal,
    openEditModal,
    closeEditModal,
    openCreateModal,
    closeCreateModal,

    // Actions de notification
    showNotification,
    hideNotification,

    // Actions de formulaire
    updateEditForm,
    resetEditForm,

    // Actions d'export et actions groupées
    exportSelectedToCSV,
    exportAllToCSV,
    approveSelectedServices,
    rejectSelectedServices,
    // Actions groupées avec vraies mutations
    approveSelectedServicesReal,
    rejectSelectedServicesReal,
    deleteSelectedServicesReal,

    // Propriétés calculées
    hasSelection,
    hasActiveFilters,
  };
};
