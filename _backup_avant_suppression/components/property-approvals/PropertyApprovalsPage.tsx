import React from 'react';
import AdminLayout from '../AdminLayout';
import { useProperties } from './hooks/useProperties';
import { useAuth } from '@/core/providers/auth.provider';
import { usePropertyManagementEnhanced } from './hooks/usePropertyManagementEnhanced';
import { createGenericTableColumns } from '../shared/GenericTableColumns';
import { PropertyHeader, PropertyTableSection, createPropertyTableConfig } from './components';
import { PropertyDetailsModal } from './modals/PropertyDetailsModal';
import { PROPERTY_TABS, PropertyStatus, PropertyWithOwner } from '../../types/propertyApprovals';
import { Property } from '../../types';
import { LABELS } from '../../constants/labels';

const PropertyApprovalsPage: React.FC = () => {
  const { user } = useAuth();

  // State pour les onglets
  const [activeTab, setActiveTab] = React.useState(0);
  const [selectedStatus, setSelectedStatus] = React.useState<PropertyStatus>(PropertyStatus.ALL);

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
    setPendingProperty,
    updateProperty,
    deleteProperty,
  } = useProperties({
    filters: {}, // Pas de filtre pour avoir toutes les propriétés
    includeOwnerInfo: true,
    orderBy: 'created_at',
  });

  // Filtrage côté client par statut
  const properties =
    selectedStatus === PropertyStatus.ALL
      ? allProperties
      : allProperties.filter((property) => {
          const statusMapping: Record<PropertyStatus, string> = {
            [PropertyStatus.ALL]: '',
            [PropertyStatus.PENDING]: 'pending',
            [PropertyStatus.APPROVED]: 'approved',
            [PropertyStatus.REJECTED]: 'rejected',
          };
          return property.validation_status === statusMapping[selectedStatus];
        });

  // Handler pour changer d'onglet
  const handleTabChange = (event: React.MouseEvent<HTMLElement>, newValue: number | null) => {
    if (newValue !== null) {
      setActiveTab(newValue);
      setSelectedStatus(PROPERTY_TABS[newValue].status);
    }
  };

  // Filtrage des propriétés avec les filtres de recherche
  const filteredProperties =
    properties?.filter((property) => {
      const searchTerm = propertyManagement.filters.search?.toLowerCase() || '';
      const cityFilter = propertyManagement.filters.city?.toLowerCase() || '';
      const countryFilter = propertyManagement.filters.country?.toLowerCase() || '';
      const minPriceFilter = propertyManagement.filters.minPrice
        ? parseFloat(propertyManagement.filters.minPrice)
        : null;
      const maxPriceFilter = propertyManagement.filters.maxPrice
        ? parseFloat(propertyManagement.filters.maxPrice)
        : null;

      const matchesSearch =
        !searchTerm ||
        property.title?.toLowerCase().includes(searchTerm) ||
        property.description?.toLowerCase().includes(searchTerm) ||
        property.profiles?.full_name?.toLowerCase().includes(searchTerm);

      const matchesCity = !cityFilter || property.city?.toLowerCase().includes(cityFilter);
      const matchesCountry =
        !countryFilter || property.country?.toLowerCase().includes(countryFilter);

      const propertyPrice = property.nightly_rate || 0;
      const matchesMinPrice = !minPriceFilter || propertyPrice >= minPriceFilter;
      const matchesMaxPrice = !maxPriceFilter || propertyPrice <= maxPriceFilter;

      return matchesSearch && matchesCity && matchesCountry && matchesMinPrice && matchesMaxPrice;
    }) || [];

  const handleApprove = async (propertyId: string, moderationNotes?: string) => {
    if (!user?.id) return;
    try {
      await approveProperty.mutateAsync({
        id: propertyId,
        validatedBy: user.id,
        moderationNotes: moderationNotes || undefined,
      });
      propertyManagement.showNotification('Property approved successfully', 'success');
    } catch (error) {
      console.error('Error approving property:', error);
      propertyManagement.showNotification('Error approving property', 'error');
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
      propertyManagement.showNotification('Property rejected successfully', 'success');
    } catch (error) {
      console.error('Error rejecting property:', error);
      propertyManagement.showNotification('Error rejecting property', 'error');
    }
  };

  const handleSetPending = async (propertyId: string, moderationNotes?: string) => {
    if (!user?.id) return;
    try {
      await setPendingProperty.mutateAsync({
        id: propertyId,
        validatedBy: user.id,
        moderationNotes: moderationNotes || undefined,
      });
      propertyManagement.showNotification('Property set to pending successfully', 'success');
    } catch (error) {
      console.error('Error setting property to pending:', error);
      propertyManagement.showNotification('Error setting property to pending', 'error');
    }
  };

  const handleApproveSelected = async () => {
    if (!user?.id || !propertyManagement.selectedProperties.length) return;

    try {
      await Promise.all(
        propertyManagement.selectedProperties.map((id) =>
          approveProperty.mutateAsync({
            id,
            validatedBy: user.id,
          })
        )
      );
      propertyManagement.clearPropertySelection();
      propertyManagement.showNotification(
        `Successfully approved ${propertyManagement.selectedProperties.length} properties`,
        'success'
      );
    } catch (error) {
      console.error('Error approving properties:', error);
      propertyManagement.showNotification(
        `Failed to approve ${propertyManagement.selectedProperties.length} properties. Please try again.`,
        'error'
      );
    }
  };

  const handleRejectSelected = async () => {
    if (!user?.id || !propertyManagement.selectedProperties.length) return;

    try {
      await Promise.all(
        propertyManagement.selectedProperties.map((id) =>
          rejectProperty.mutateAsync({
            id,
            validatedBy: user.id,
          })
        )
      );
      propertyManagement.clearPropertySelection();
      propertyManagement.showNotification(
        `Successfully rejected ${propertyManagement.selectedProperties.length} properties`,
        'success'
      );
    } catch (error) {
      console.error('Error rejecting properties:', error);
      propertyManagement.showNotification(
        `Failed to reject ${propertyManagement.selectedProperties.length} properties. Please try again.`,
        'error'
      );
    }
  };

  const handleSetPendingSelected = async () => {
    if (!user?.id || !propertyManagement.selectedProperties.length) return;

    try {
      await Promise.all(
        propertyManagement.selectedProperties.map((id) =>
          setPendingProperty.mutateAsync({
            id,
            validatedBy: user.id,
          })
        )
      );
      propertyManagement.clearPropertySelection();
      propertyManagement.showNotification(
        `Successfully set ${propertyManagement.selectedProperties.length} properties to pending review`,
        'success'
      );
    } catch (error) {
      console.error('Error setting properties to pending:', error);
      propertyManagement.showNotification(
        `Failed to set ${propertyManagement.selectedProperties.length} properties to pending. Please try again.`,
        'error'
      );
    }
  };

  const handleDeleteProperty = async (propertyId: string) => {
    if (!confirm('Are you sure you want to delete this property? This action cannot be undone.')) {
      return;
    }

    try {
      await deleteProperty.mutateAsync(propertyId);
      propertyManagement.showNotification('Property deleted successfully', 'success');
    } catch (error) {
      console.error('Error deleting property:', error);
      propertyManagement.showNotification('Error deleting property', 'error');
    }
  };

  const handleUpdateProperty = async (propertyId: string, updates: Partial<Property>) => {
    if (!user?.id) return;

    try {
      await updateProperty.mutateAsync({
        id: propertyId,
        payload: {
          ...updates,
          // Add admin tracking
          validated_by: user.id,
        },
      });

      propertyManagement.showNotification('Property updated successfully', 'success');
    } catch (error) {
      console.error('Error updating property:', error);
      propertyManagement.showNotification('Error updating property', 'error');
      throw error; // Re-throw so the modal can handle it
    }
  };

  // Helper function to find original property from table row
  const findOriginalProperty = (tableRow: any): PropertyWithOwner | undefined => {
    return filteredProperties?.find((prop) => prop.id === tableRow.id);
  };

  const transformedData =
    filteredProperties?.map((property) => ({
      id: property.id,
      title: property.title || 'N/A',
      owner_name: property.profiles?.full_name || 'Unknown Owner',
      owner_email: property.profiles?.email || 'No email',
      location: `${property.city || ''}, ${property.country || ''}`.trim() || 'N/A',
      address: property.address || LABELS.common.messages.noAddress,
      rent_amount: property.nightly_rate || null,
      created_at: property.created_at ? new Date(property.created_at).toLocaleDateString() : 'N/A',
      ...property,
    })) || [];

  // Wrapper function to handle table row to original property mapping
  const handleViewProperty = (tableRow: any) => {
    const originalProperty = findOriginalProperty(tableRow);
    if (originalProperty) {
      propertyManagement.openModal(originalProperty);
    }
  };

  const tableConfig = createPropertyTableConfig({
    selectedProperties: propertyManagement.selectedProperties,
    onTogglePropertySelection: propertyManagement.togglePropertySelection,
    onApproveProperty: handleApprove,
    onRejectProperty: handleReject,
    onSetPendingProperty: handleSetPending,
    onViewProperty: handleViewProperty,
    onDeleteProperty: handleDeleteProperty,
    isApprovePending: approveProperty.isPending,
    isRejectPending: rejectProperty.isPending,
    isPendingPending: setPendingProperty.isPending,
    isDeletePending: deleteProperty.isPending,
  });

  const columns = createGenericTableColumns(tableConfig);

  return (
    <AdminLayout>
      {/* Header with refresh button */}
      <PropertyHeader
        propertiesCount={filteredProperties?.length || 0}
        onRefresh={() => refetch()}
        onAddProperty={() => propertyManagement.openCreatePropertyModal()}
        onExportProperties={() =>
          propertyManagement.exportPropertiesToCSV(filteredProperties || [])
        }
        isRefreshing={isFetching}
        isExportDisabled={!filteredProperties || filteredProperties.length === 0}
      />

      {/* Properties Table Section */}
      <PropertyTableSection
        // Data
        properties={allProperties || []}
        filteredProperties={filteredProperties}
        transformedData={transformedData}
        columns={columns}
        // State
        activeTab={activeTab}
        isLoading={isLoading}
        error={error}
        // Filters
        filters={propertyManagement.filters}
        onUpdateFilter={propertyManagement.updateFilter}
        // Tabs
        onTabChange={handleTabChange}
        // Actions
        selectedProperties={propertyManagement.selectedProperties}
        onApproveSelected={handleApproveSelected}
        onRejectSelected={handleRejectSelected}
        onSetPendingSelected={handleSetPendingSelected}
        onClearSelection={propertyManagement.clearPropertySelection}
        isApprovePending={approveProperty.isPending}
        isRejectPending={rejectProperty.isPending}
        isPendingPending={setPendingProperty.isPending}
        // Notifications
        notification={propertyManagement.notification}
        onHideNotification={propertyManagement.hideNotification}
      />

      {/* Property Details Modal */}
      <PropertyDetailsModal
        open={propertyManagement.isModalOpen}
        property={propertyManagement.selectedProperty}
        onClose={propertyManagement.closeModal}
        onApprove={handleApprove}
        onReject={handleReject}
        onSetPending={handleSetPending}
        onUpdateProperty={handleUpdateProperty}
        isApprovePending={approveProperty.isPending}
        isRejectPending={rejectProperty.isPending}
        isPendingPending={setPendingProperty.isPending}
        isUpdatePending={updateProperty.isPending}
      />
    </AdminLayout>
  );
};

export default PropertyApprovalsPage;
