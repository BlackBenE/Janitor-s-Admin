import React from "react";
import AdminLayout from "../AdminLayout";
import {
  Box,
  Typography,
  IconButton,
  Tooltip,
  CircularProgress,
  Snackbar,
  Alert,
} from "@mui/material";
import {
  Refresh as RefreshIcon,
  Add as AddIcon,
  Download as DownloadIcon,
} from "@mui/icons-material";
import DataTable from "../Table";
import { useProperties } from "../../hooks/property-approvals/useProperties";
import { useAuth } from "../../providers/authProvider";
import { usePropertyManagementEnhanced } from "../../hooks/property-approvals/usePropertyManagementEnhanced";
import { createGenericTableColumns } from "../shared/GenericTableColumns";
import { createPropertyTableConfig } from "./PropertyTableConfig";
import { PropertyActions } from "./PropertyActions";
import { PropertyFiltersComponent } from "./PropertyFilters";
import { PropertyDetailsModal } from "./PropertyDetailsModal";
import { PropertyTabs } from "./propertyTabs";
import { PROPERTY_TABS, PropertyStatus } from "../../types/propertyApprovals";

const PropertyApprovalsPage: React.FC = () => {
  const { user } = useAuth();

  // State pour les onglets
  const [activeTab, setActiveTab] = React.useState(0);
  const [selectedStatus, setSelectedStatus] = React.useState<PropertyStatus>(
    PropertyStatus.ALL
  );

  // Hook de gestion amélioré
  const propertyManagement = usePropertyManagementEnhanced();

  // Hook pour récupérer toutes les propriétés
  const {
    properties: allProperties,
    isLoading,
    isFetching,
    error,
    refetch,
    approveProperty,
    rejectProperty,
  } = useProperties({
    filters: {}, // Pas de filtre pour avoir toutes les propriétés
    includeOwnerInfo: true,
    orderBy: "created_at",
  });

  // Filtrage côté client par statut
  const properties =
    selectedStatus === PropertyStatus.ALL
      ? allProperties
      : allProperties.filter((property) => {
          const statusMapping: Record<PropertyStatus, string> = {
            [PropertyStatus.ALL]: "",
            [PropertyStatus.PENDING]: "pending",
            [PropertyStatus.APPROVED]: "approved",
            [PropertyStatus.REJECTED]: "rejected",
          };
          return property.validation_status === statusMapping[selectedStatus];
        });

  // Handler pour changer d'onglet
  const handleTabChange = (
    event: React.MouseEvent<HTMLElement>,
    newValue: number | null
  ) => {
    if (newValue !== null) {
      setActiveTab(newValue);
      setSelectedStatus(PROPERTY_TABS[newValue].status);
    }
  };

  // Filtrage des propriétés basé sur les filtres de recherche
  const filteredProperties =
    properties?.filter((property: any) => {
      const matchesSearch =
        !propertyManagement.filters.search ||
        property.title
          ?.toLowerCase()
          .includes(propertyManagement.filters.search.toLowerCase()) ||
        property.owner?.full_name
          ?.toLowerCase()
          .includes(propertyManagement.filters.search.toLowerCase()) ||
        property.city
          ?.toLowerCase()
          .includes(propertyManagement.filters.search.toLowerCase());

      const matchesCity =
        !propertyManagement.filters.city ||
        property.city
          ?.toLowerCase()
          .includes(propertyManagement.filters.city.toLowerCase());

      const matchesCountry =
        !propertyManagement.filters.country ||
        property.country
          ?.toLowerCase()
          .includes(propertyManagement.filters.country.toLowerCase());

      const matchesMinPrice =
        !propertyManagement.filters.minPrice ||
        (property.rent_amount &&
          property.rent_amount >=
            parseInt(propertyManagement.filters.minPrice));

      const matchesMaxPrice =
        !propertyManagement.filters.maxPrice ||
        (property.rent_amount &&
          property.rent_amount <=
            parseInt(propertyManagement.filters.maxPrice));

      return (
        matchesSearch &&
        matchesCity &&
        matchesCountry &&
        matchesMinPrice &&
        matchesMaxPrice
      );
    }) || [];

  const handleApprove = async (
    propertyId: string,
    moderationNotes?: string
  ) => {
    if (!user?.id) return;
    try {
      await approveProperty.mutateAsync({
        id: propertyId,
        validatedBy: user.id,
        moderationNotes: moderationNotes || undefined,
      });
      propertyManagement.showNotification(
        "Property approved successfully",
        "success"
      );
    } catch (error) {
      console.error("Error approving property:", error);
      propertyManagement.showNotification("Error approving property", "error");
    }
  };

  const handleReject = async (propertyId: string, moderationNotes?: string) => {
    if (!user?.id) return;
    try {
      await rejectProperty.mutateAsync({
        id: propertyId,
        validatedBy: user.id,
        moderationNotes: moderationNotes || undefined,
      });
      propertyManagement.showNotification(
        "Property rejected successfully",
        "success"
      );
    } catch (error) {
      console.error("Error rejecting property:", error);
      propertyManagement.showNotification("Error rejecting property", "error");
    }
  };

  const handleApproveSelected = async () => {
    if (!user?.id) return;
    try {
      await Promise.all(
        propertyManagement.selectedProperties.map((propertyId: string) =>
          approveProperty.mutateAsync({
            id: propertyId,
            validatedBy: user.id,
          })
        )
      );
      propertyManagement.clearPropertySelection();
      propertyManagement.showNotification(
        "Properties approved successfully",
        "success"
      );
    } catch (error) {
      console.error("Error approving properties:", error);
      propertyManagement.showNotification(
        "Error approving properties",
        "error"
      );
    }
  };

  const handleRejectSelected = async () => {
    if (!user?.id) return;
    try {
      await Promise.all(
        propertyManagement.selectedProperties.map((propertyId: string) =>
          rejectProperty.mutateAsync({
            id: propertyId,
            validatedBy: user.id,
          })
        )
      );
      propertyManagement.clearPropertySelection();
      propertyManagement.showNotification(
        "Properties rejected successfully",
        "success"
      );
    } catch (error) {
      console.error("Error rejecting properties:", error);
      propertyManagement.showNotification(
        "Error rejecting properties",
        "error"
      );
    }
  };

  // Debug: Log the first property to see the structure
  if (filteredProperties && filteredProperties.length > 0) {
    console.log("First property structure:", filteredProperties[0]);
  }

  const transformedData =
    filteredProperties?.map((property: any) => ({
      id: property.id,
      title: property.title || "N/A",
      owner_name: property.profiles?.full_name || "Unknown Owner",
      owner_email: property.profiles?.email || "No email",
      location:
        `${property.city || ""}, ${property.country || ""}`.trim() || "N/A",
      address: property.address || "No address",
      rent_amount: property.nightly_rate || null,
      created_at: property.created_at
        ? new Date(property.created_at).toLocaleDateString()
        : "N/A",
      ...property,
    })) || [];

  const tableConfig = createPropertyTableConfig({
    selectedProperties: propertyManagement.selectedProperties,
    onTogglePropertySelection: propertyManagement.togglePropertySelection,
    onApproveProperty: handleApprove,
    onRejectProperty: handleReject,
    onViewProperty: propertyManagement.openModal,
    isApprovePending: approveProperty.isPending,
    isRejectPending: rejectProperty.isPending,
  });

  const columns = createGenericTableColumns(tableConfig);

  return (
    <AdminLayout>
      {/* Header with refresh button */}
      <Box
        sx={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          mb: 3,
        }}
      >
        <Box>
          <Typography variant="h4" component="h1" gutterBottom>
            Property Approvals
          </Typography>
          <Typography variant="body1" color="text.secondary">
            Review and moderate property listings submitted by landlords.
          </Typography>
        </Box>
        <Box sx={{ display: "flex", gap: 1 }}>
          <Tooltip title={`Add New Property`}>
            <IconButton
              size="large"
              onClick={() => propertyManagement.openCreatePropertyModal()}
            >
              <AddIcon />
            </IconButton>
          </Tooltip>
          <Tooltip
            title={`Export ${
              filteredProperties?.length || 0
            } Properties to CSV`}
          >
            <IconButton
              size="large"
              onClick={() =>
                propertyManagement.exportPropertiesToCSV(
                  filteredProperties || []
                )
              }
              disabled={!filteredProperties || filteredProperties.length === 0}
            >
              <DownloadIcon />
            </IconButton>
          </Tooltip>
          <Tooltip title="Refresh Properties">
            <IconButton
              onClick={() => refetch()}
              disabled={isFetching}
              size="large"
            >
              {isFetching ? <CircularProgress size={24} /> : <RefreshIcon />}
            </IconButton>
          </Tooltip>
        </Box>
      </Box>

      {/* Properties Table */}
      <Box
        sx={{
          mt: 2,
          border: "1px solid #ddd",
          borderRadius: 4,
          p: 2,
        }}
      >
        <h3>All Properties</h3>
        <p>Manage properties across all categories with specialized views</p>
        {/* Filters */}
        <PropertyFiltersComponent
          filters={propertyManagement.filters}
          onUpdateFilter={propertyManagement.updateFilter}
          simplified={true}
        />

        {/* Tabs for property status */}
        <Box sx={{ mb: 3 }}>
          <PropertyTabs
            activeTab={activeTab}
            properties={allProperties || []}
            onTabChange={handleTabChange}
          />
        </Box>

        {/* Bulk Actions */}
        <PropertyActions
          selectedProperties={propertyManagement.selectedProperties}
          onApproveSelected={handleApproveSelected}
          onRejectSelected={handleRejectSelected}
          onClearSelection={propertyManagement.clearPropertySelection}
          isApprovePending={approveProperty.isPending}
          isRejectPending={rejectProperty.isPending}
        />

        {isLoading ? (
          <Box sx={{ display: "flex", justifyContent: "center", p: 3 }}>
            <CircularProgress />
          </Box>
        ) : error ? (
          <Box sx={{ p: 3, textAlign: "center" }}>
            <Typography color="error">Error loading properties</Typography>
          </Box>
        ) : (
          <DataTable columns={columns} data={transformedData} />
        )}
      </Box>

      {/* Property Details Modal */}
      <PropertyDetailsModal
        open={propertyManagement.isModalOpen}
        property={propertyManagement.selectedProperty}
        onClose={propertyManagement.closeModal}
        onApprove={handleApprove}
        onReject={handleReject}
        isApprovePending={approveProperty.isPending}
        isRejectPending={rejectProperty.isPending}
      />

      {/* Notification Snackbar */}
      <Snackbar
        open={propertyManagement.notification.open}
        autoHideDuration={6000}
        onClose={propertyManagement.hideNotification}
      >
        <Alert
          onClose={propertyManagement.hideNotification}
          severity={propertyManagement.notification.severity}
          sx={{ width: "100%" }}
        >
          {propertyManagement.notification.message}
        </Alert>
      </Snackbar>
    </AdminLayout>
  );
};

export default PropertyApprovalsPage;
