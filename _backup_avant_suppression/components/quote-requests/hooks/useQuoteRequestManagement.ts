/**
 * 🎛️ Quote Request Management Hook
 *
 * Hook principal pour la gestion de l'état de la page Quote Requests Management
 * Inspiré du pattern useServiceManagement.ts et usePaymentManagement.ts
 */

import { useState } from "react";
import {
  QuoteRequestWithDetails,
  QuoteRequestFilters,
  QuoteRequestNotificationState,
  QuoteRequestStatusFilter,
  QuoteRequestActionConfig,
  QUOTE_REQUEST_ACTIONS,
} from "../../../types/quoteRequests";
import { useExport } from "../../../hooks/shared/useExport";

const initialFilters: QuoteRequestFilters = {
  search: "",
  status: "all" as QuoteRequestStatusFilter,
  service: "",
  provider: "",
  requester: "",
  dateFrom: "",
  dateTo: "",
  minAmount: "",
  maxAmount: "",
};

const initialNotification: QuoteRequestNotificationState = {
  open: false,
  message: "",
  severity: "success",
};

/**
 * Hook principal pour la gestion de l'état de la page Quote Requests Management
 */
export const useQuoteRequestManagement = () => {
  // Hook d'export
  const { exportToCSV, commonColumns, formatters } = useExport();

  // États principaux
  const [selectedQuoteRequest, setSelectedQuoteRequest] =
    useState<QuoteRequestWithDetails | null>(null);
  const [selectedQuoteRequests, setSelectedQuoteRequests] = useState<string[]>(
    []
  );
  const [editForm, setEditForm] = useState<Partial<QuoteRequestWithDetails>>(
    {}
  );

  // États de l'interface
  const [filters, setFilters] = useState<QuoteRequestFilters>(initialFilters);
  const [notification, setNotification] =
    useState<QuoteRequestNotificationState>(initialNotification);

  // États des modales et drawers
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [isDetailDrawerOpen, setIsDetailDrawerOpen] = useState(false);
  const [isAssignModalOpen, setIsAssignModalOpen] = useState(false);
  const [isBulkActionModalOpen, setIsBulkActionModalOpen] = useState(false);
  const [currentBulkAction, setCurrentBulkAction] =
    useState<QuoteRequestActionConfig | null>(null);

  // États de pagination et tri
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(25);
  const [orderBy, setOrderBy] =
    useState<keyof QuoteRequestWithDetails>("created_at");
  const [orderDirection, setOrderDirection] = useState<"asc" | "desc">("desc");

  // Gestion des filtres
  const updateFilters = (newFilters: Partial<QuoteRequestFilters>) => {
    setFilters((prev) => ({ ...prev, ...newFilters }));
    setPage(0); // Reset pagination
  };

  const resetFilters = () => {
    setFilters(initialFilters);
    setPage(0);
  };

  const hasActiveFilters = () => {
    return Object.entries(filters).some(([key, value]) => {
      if (key === "status") return value !== "all";
      return (
        value !== "" &&
        value !== initialFilters[key as keyof QuoteRequestFilters]
      );
    });
  };

  // Gestion de la sélection
  const handleSelectQuoteRequest = (id: string) => {
    setSelectedQuoteRequests((prev) =>
      prev.includes(id)
        ? prev.filter((selectedId) => selectedId !== id)
        : [...prev, id]
    );
  };

  const handleSelectAllQuoteRequests = (quoteRequestIds: string[]) => {
    setSelectedQuoteRequests(
      selectedQuoteRequests.length === quoteRequestIds.length
        ? []
        : quoteRequestIds
    );
  };

  const clearSelection = () => {
    setSelectedQuoteRequests([]);
  };

  // Gestion du tri
  const handleSort = (property: keyof QuoteRequestWithDetails) => {
    const isAsc = orderBy === property && orderDirection === "asc";
    setOrderDirection(isAsc ? "desc" : "asc");
    setOrderBy(property);
  };

  // Gestion de la pagination
  const handlePageChange = (newPage: number) => {
    setPage(newPage);
  };

  const handleRowsPerPageChange = (newRowsPerPage: number) => {
    setRowsPerPage(newRowsPerPage);
    setPage(0);
  };

  // Gestion des modales
  const openEditModal = (quoteRequest: QuoteRequestWithDetails) => {
    setSelectedQuoteRequest(quoteRequest);
    setEditForm(quoteRequest);
    setIsEditModalOpen(true);
  };

  const closeEditModal = () => {
    setIsEditModalOpen(false);
    setSelectedQuoteRequest(null);
    setEditForm({});
  };

  const openDetailDrawer = (quoteRequest: QuoteRequestWithDetails) => {
    setSelectedQuoteRequest(quoteRequest);
    setIsDetailDrawerOpen(true);
  };

  const closeDetailDrawer = () => {
    setIsDetailDrawerOpen(false);
    setSelectedQuoteRequest(null);
  };

  const openAssignModal = (quoteRequest: QuoteRequestWithDetails) => {
    setSelectedQuoteRequest(quoteRequest);
    setIsAssignModalOpen(true);
  };

  const closeAssignModal = () => {
    setIsAssignModalOpen(false);
    setSelectedQuoteRequest(null);
  };

  // Gestion des actions en lot
  const openBulkActionModal = (action: QuoteRequestActionConfig) => {
    setCurrentBulkAction(action);
    setIsBulkActionModalOpen(true);
  };

  const closeBulkActionModal = () => {
    setIsBulkActionModalOpen(false);
    setCurrentBulkAction(null);
  };

  // Gestion des notifications
  const showNotification = (
    message: string,
    severity: "success" | "error" | "warning" | "info" = "success"
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

  // Gestion de l'export
  const handleExportQuoteRequests = (
    quoteRequests: QuoteRequestWithDetails[]
  ) => {
    const transformedData = quoteRequests.map((qr) => ({
      ...qr,
      requester_name: qr.requester?.full_name || "N/A",
      requester_email: qr.requester?.email || "N/A",
      service_name: qr.service?.name || "N/A",
      service_category: qr.service?.category || "N/A",
      provider_name: qr.provider?.full_name || "Non assigné",
      provider_email: qr.provider?.email || "N/A",
      property_title: qr.property?.title || "N/A",
      property_address: qr.property?.address || "N/A",
      property_city: qr.property?.city || "N/A",
    }));

    const columns = [
      { key: "id", label: "ID" },
      { key: "requester_name", label: "Client" },
      { key: "requester_email", label: "Email Client" },
      { key: "service_name", label: "Service" },
      { key: "service_category", label: "Catégorie" },
      { key: "provider_name", label: "Prestataire" },
      { key: "provider_email", label: "Email Prestataire" },
      { key: "property_title", label: "Propriété" },
      { key: "property_address", label: "Adresse" },
      { key: "property_city", label: "Ville" },
      { key: "status", label: "Statut" },
      commonColumns.currency("total_amount", "Montant"),
      commonColumns.date("requested_date", "Date Demande"),
      commonColumns.date("created_at", "Date Création"),
      commonColumns.date("updated_at", "Date Mise à jour"),
      commonColumns.date("completed_at", "Date Complétion"),
      { key: "cancellation_reason", label: "Raison Annulation" },
    ];

    exportToCSV(transformedData, columns, {
      filename: `demandes-devis-${new Date().toISOString().split("T")[0]}`,
    });
    showNotification(
      `${transformedData.length} demandes exportées avec succès`
    );
  };

  const handleExportSelected = (quoteRequests: QuoteRequestWithDetails[]) => {
    const selectedQuoteRequestsData = quoteRequests.filter((qr) =>
      selectedQuoteRequests.includes(qr.id)
    );
    handleExportQuoteRequests(selectedQuoteRequestsData);
  };

  // Actions disponibles
  const availableActions = QUOTE_REQUEST_ACTIONS.filter((action) => {
    // Logique pour filtrer les actions selon le contexte
    if (selectedQuoteRequests.length === 0) {
      return action.type === "export";
    }
    return true;
  });

  // Validation des actions
  const canPerformAction = (action: QuoteRequestActionConfig): boolean => {
    if (selectedQuoteRequests.length === 0) {
      return action.type === "export";
    }

    // Logique spécifique selon le type d'action
    switch (action.type) {
      case "approve":
      case "reject":
      case "assign":
        return selectedQuoteRequests.length > 0;
      case "delete":
        return selectedQuoteRequests.length > 0;
      case "export":
        return true;
      default:
        return false;
    }
  };

  return {
    // États principaux
    selectedQuoteRequest,
    selectedQuoteRequests,
    editForm,
    setEditForm,

    // États de l'interface
    filters,
    updateFilters,
    resetFilters,
    hasActiveFilters,
    notification,
    showNotification,
    hideNotification,

    // États des modales
    isEditModalOpen,
    openEditModal,
    closeEditModal,
    isDetailDrawerOpen,
    openDetailDrawer,
    closeDetailDrawer,
    isAssignModalOpen,
    openAssignModal,
    closeAssignModal,
    isBulkActionModalOpen,
    openBulkActionModal,
    closeBulkActionModal,
    currentBulkAction,

    // Gestion de la sélection
    handleSelectQuoteRequest,
    handleSelectAllQuoteRequests,
    clearSelection,

    // Pagination et tri
    page,
    rowsPerPage,
    orderBy,
    orderDirection,
    handlePageChange,
    handleRowsPerPageChange,
    handleSort,

    // Export
    handleExportQuoteRequests,
    handleExportSelected,

    // Actions
    availableActions,
    canPerformAction,

    // Utilitaires
    formatters,
  };
};
