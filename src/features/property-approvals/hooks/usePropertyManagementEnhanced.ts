import { useState } from "react";
import {
  PropertyFilters,
  PropertyNotificationState,
  PropertyWithOwner,
} from "@/types/propertyApprovals";

const initialFilters: PropertyFilters = {
  search: "",
  status: "",
  city: "",
  country: "",
  minPrice: "",
  maxPrice: "",
};

const initialNotification: PropertyNotificationState = {
  open: false,
  message: "",
  severity: "success",
};

/**
 * Hook principal pour la gestion de l'état de la page Property Approvals
 */
export const usePropertyManagementEnhanced = () => {
  // États principaux
  const [selectedProperty, setSelectedProperty] =
    useState<PropertyWithOwner | null>(null);
  const [selectedProperties, setSelectedProperties] = useState<string[]>([]);
  const [editForm, setEditForm] = useState<Partial<PropertyWithOwner>>({});

  // Filtres
  const [filters, setFilters] = useState<PropertyFilters>(initialFilters);

  // Notifications
  const [notification, setNotification] =
    useState<PropertyNotificationState>(initialNotification);

  // Modal states
  const [isModalOpen, setIsModalOpen] = useState(false);

  // Gestion des propriétés sélectionnées
  const togglePropertySelection = (propertyId: string) => {
    setSelectedProperties((prev) =>
      prev.includes(propertyId)
        ? prev.filter((id) => id !== propertyId)
        : [...prev, propertyId]
    );
  };

  const clearPropertySelection = () => setSelectedProperties([]);

  const selectAllProperties = (propertyIds: string[]) => {
    setSelectedProperties(propertyIds);
  };

  // Gestion des filtres
  const updateFilter = (key: keyof PropertyFilters, value: string) => {
    setFilters((prev) => ({
      ...prev,
      [key]: value,
    }));
  };

  const resetFilters = () => setFilters(initialFilters);

  // Gestion du formulaire d'édition
  const updateEditForm = (field: string, value: any) => {
    setEditForm((prev) => ({
      ...prev,
      [field]: value,
    }));
  };

  const resetEditForm = () => setEditForm({});

  // Gestion des notifications
  const showNotification = (
    message: string,
    severity: PropertyNotificationState["severity"] = "success"
  ) => {
    setNotification({
      open: true,
      message,
      severity,
    });
  };

  const hideNotification = () => {
    setNotification((prev) => ({ ...prev, open: false }));
  };

  // Gestion de la modal
  const openModal = (property?: PropertyWithOwner) => {
    if (property) setSelectedProperty(property);
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setSelectedProperty(null);
  };

  // Action pour ouvrir le modal de création
  const openCreatePropertyModal = () => {
    setSelectedProperty(null);
    setEditForm({});
    setIsModalOpen(true);
  };

  // Action pour exporter les données en CSV
  const exportPropertiesToCSV = (properties: any[]) => {
    try {
      if (!properties || properties.length === 0) {
        showNotification("No properties to export", "warning");
        return;
      }

      const csvHeaders = [
        "ID",
        "Title",
        "Address",
        "City",
        "Country",
        "Price",
        "Status",
        "Created Date",
      ];

      const csvContent = [
        csvHeaders.join(","),
        ...properties.map((property) =>
          [
            property.id || "",
            `"${(property.title || "").replace(/"/g, '""')}"`,
            `"${(property.address || "").replace(/"/g, '""')}"`,
            `"${(property.city || "").replace(/"/g, '""')}"`,
            `"${(property.country || "").replace(/"/g, '""')}"`,
            property.price || "",
            property.status || "",
            property.created_at
              ? new Date(property.created_at).toLocaleDateString()
              : "",
          ].join(",")
        ),
      ].join("\n");

      const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
      const link = document.createElement("a");
      const url = URL.createObjectURL(blob);
      link.setAttribute("href", url);
      link.setAttribute(
        "download",
        `properties_export_${new Date().toISOString().split("T")[0]}.csv`
      );
      link.style.visibility = "hidden";
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      URL.revokeObjectURL(url);

      showNotification(
        `Successfully exported ${properties.length} properties to CSV`,
        "success"
      );
    } catch (error) {
      console.error("Error exporting properties:", error);
      showNotification("Error exporting properties to CSV", "error");
    }
  };

  return {
    // État
    selectedProperty,
    selectedProperties,
    editForm,
    filters,
    notification,
    isModalOpen,

    // Actions de sélection
    togglePropertySelection,
    clearPropertySelection,
    selectAllProperties,
    setSelectedProperty,

    // Actions de filtres
    updateFilter,
    resetFilters,

    // Actions de formulaire
    updateEditForm,
    resetEditForm,

    // Actions de notifications
    showNotification,
    hideNotification,

    // Actions de modal
    openModal,
    closeModal,
    setIsModalOpen,
    openCreatePropertyModal,

    // Actions d'export
    exportPropertiesToCSV,
  };
};
