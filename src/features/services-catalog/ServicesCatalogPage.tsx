import React from 'react';
import { Box, Tabs, Tab, Typography } from '@mui/material';

import { AdminLayout } from '@/shared/components/layout';

// Hooks
import { useServiceCatalog, useServiceManagement } from './hooks';

// Components
import { ServicesHeader, ServicesStatsSection, ServiceRequestsSection } from './components';
import { ServicesTableSection } from './components/ServicesTableSection';
import { createServiceTableColumns } from './components/ServiceTableColumns';
import { ServiceDetailsModal, ServiceCreateModal } from './modals';
import { LoadingIndicator } from '@/shared/components/feedback';

// Configuration
import { serviceTabConfigs } from '@/shared/config';
import { formatCurrency } from '@/shared/utils';

// Types
import { ServiceWithDetails, ServiceStatusFilter } from '@/types/services';

export const ServicesCatalogPage: React.FC = () => {
  const [activeTab, setActiveTab] = React.useState(0);
  const [mainTab, setMainTab] = React.useState(0); // 0: Prestataires, 1: Demandes

  const {
    services,
    stats,
    isLoading,
    isFetching,
    error,
    refetch,
    createService,
    updateService,
    deleteManyServices,
    bulkActivateServices,
    bulkDeactivateServices,
  } = useServiceCatalog();

  const serviceManagement = useServiceManagement();

  // =====================================================
  // LOGIQUE DE FILTRAGE (même pattern que Payments)
  // =====================================================

  // Configuration de l'onglet actuel
  const currentTabConfig = serviceTabConfigs[activeTab];

  // Application des filtres
  let filteredServices = [...services];

  // Filtre par recherche
  if (serviceManagement.filters.search) {
    const searchTerm = serviceManagement.filters.search.toLowerCase();
    filteredServices = filteredServices.filter(
      (service) =>
        service.name?.toLowerCase().includes(searchTerm) ||
        service.description?.toLowerCase().includes(searchTerm) ||
        service.category?.toLowerCase().includes(searchTerm)
    );
  }

  // Filtre par statut
  if (serviceManagement.filters.status) {
    if (serviceManagement.filters.status === 'active') {
      filteredServices = filteredServices.filter((service) => service.is_active === true);
    } else if (serviceManagement.filters.status === 'inactive') {
      filteredServices = filteredServices.filter((service) => service.is_active === false);
    }
  }

  // Filtre par catégorie
  if (serviceManagement.filters.category) {
    filteredServices = filteredServices.filter(
      (service) => service.category === serviceManagement.filters.category
    );
  }

  // Filtre par prix minimum
  if (serviceManagement.filters.priceFrom) {
    const minPrice = parseFloat(serviceManagement.filters.priceFrom);
    filteredServices = filteredServices.filter((service) => service.base_price >= minPrice);
  }

  // Filtre par prix maximum
  if (serviceManagement.filters.priceTo) {
    const maxPrice = parseFloat(serviceManagement.filters.priceTo);
    filteredServices = filteredServices.filter((service) => service.base_price <= maxPrice);
  }

  // Filtrer par onglet actuel (si différent des filtres de statut)
  if (currentTabConfig && currentTabConfig.key !== 'all' && !serviceManagement.filters.status) {
    if (currentTabConfig.key === 'active') {
      filteredServices = filteredServices.filter((s) => s.is_active === true);
    } else if (currentTabConfig.key === 'inactive') {
      filteredServices = filteredServices.filter((s) => s.is_active === false);
    } else if (currentTabConfig.key === 'vip') {
      filteredServices = filteredServices.filter((s) => s.is_vip_only === true);
    }
  }

  // Configuration des colonnes du tableau (comme PaymentManagement)
  const columns = createServiceTableColumns({
    selectedServices: serviceManagement.selectedServices || [],
    onToggleServiceSelection: serviceManagement.toggleServiceSelection || (() => {}),
    onViewDetails: (service: ServiceWithDetails) => {
      serviceManagement.openModal(service);
    },
    onApproveService: async (serviceId: string) => {
      try {
        await updateService(serviceId, { is_active: true });
        serviceManagement.showNotification('Service approuvé avec succès', 'success');
      } catch (error) {
        console.error('Error approving service:', error);
        serviceManagement.showNotification("Erreur lors de l'approbation", 'error');
      }
    },
    onRejectService: async (serviceId: string) => {
      try {
        await updateService(serviceId, { is_active: false });
        serviceManagement.showNotification('Service rejeté avec succès', 'success');
      } catch (error) {
        console.error('Error rejecting service:', error);
        serviceManagement.showNotification('Erreur lors du rejet', 'error');
      }
    },
    onDeleteService: async (serviceId: string) => {
      // TODO: Implémenter la suppression
      serviceManagement.showNotification('Suppression non implémentée', 'warning');
    },
  });

  // =====================================================
  // GESTION DES ÉVÉNEMENTS
  // =====================================================

  const handleRefresh = () => {
    refetch();
  };

  const handleExportServices = async () => {
    // Export les services sélectionnés s'il y en a, sinon tous les services filtrés
    if (serviceManagement.selectedServices && serviceManagement.selectedServices.length > 0) {
      serviceManagement.exportSelectedToCSV(filteredServices);
    } else {
      serviceManagement.exportAllToCSV(filteredServices);
    }
  };

  const handleTabChange = (event: React.MouseEvent<HTMLElement>, newValue: number | null) => {
    if (newValue !== null) {
      setActiveTab(newValue);
    }
  };

  // =====================================================
  // GESTION DES ERREURS
  // =====================================================

  if (error) {
    return (
      <LoadingIndicator
        error={error}
        onRefresh={handleRefresh}
        errorTitle="Erreur lors du chargement des services"
        withLayout={true}
      />
    );
  }

  // =====================================================
  // RENDU
  // =====================================================

  return (
    <AdminLayout>
      <Box sx={{ height: '100%', display: 'flex', flexDirection: 'column' }}>
        {/* En-tête de la page */}
        <ServicesHeader
          onRefresh={handleRefresh}
          onExport={handleExportServices}
          onAddService={() => serviceManagement.openCreateModal()}
          isLoading={isLoading}
        />

        {/* Cartes de statistiques */}
        <ServicesStatsSection stats={stats} error={error} />

        {/* Onglets principaux */}
        <Box sx={{ borderBottom: 1, borderColor: 'divider', mb: 2 }}>
          <Tabs
            value={mainTab}
            onChange={(event, newValue) => setMainTab(newValue)}
            aria-label="Services catalog tabs"
          >
            <Tab label="Services" />
            <Tab label="Demandes de Service" />
          </Tabs>
        </Box>

        {/* Contenu selon l'onglet sélectionné */}
        {mainTab === 0 && (
          <Box sx={{ flex: 1 }}>
            {/* Section tableau avec filtres et onglets - DESIGN ORIGINAL */}
            <ServicesTableSection
              services={services}
              activeTab={activeTab}
              serviceManagement={serviceManagement}
              onTabChange={handleTabChange}
              columns={columns}
              transformedData={filteredServices}
              isLoading={isLoading}
              bulkActivateServices={bulkActivateServices}
              bulkDeactivateServices={bulkDeactivateServices}
              deleteManyServices={deleteManyServices}
            />
          </Box>
        )}

        {mainTab === 1 && (
          <Box sx={{ flex: 1 }}>
            <ServiceRequestsSection />
          </Box>
        )}
      </Box>

      {/* Modal de détails du service */}
      <ServiceDetailsModal
        open={serviceManagement.isModalOpen}
        service={serviceManagement.selectedService}
        editForm={serviceManagement.editForm}
        onClose={serviceManagement.closeModal}
        onSave={async () => {
          if (!serviceManagement.selectedService?.id) {
            serviceManagement.showNotification('Aucun service sélectionné', 'error');
            return;
          }

          try {
              '💾 Saving service:',
              serviceManagement.selectedService.id,
              serviceManagement.editForm
            );
            await updateService(serviceManagement.selectedService.id, serviceManagement.editForm);
            serviceManagement.showNotification('Service modifié avec succès', 'success');
            serviceManagement.closeModal();
          } catch (error) {
            console.error('Error saving service:', error);
            serviceManagement.showNotification('Erreur lors de la sauvegarde', 'error');
          }
        }}
        onApproveService={async (serviceId: string) => {
          try {
            await updateService(serviceId, { is_active: true });
            serviceManagement.showNotification('Service approuvé avec succès', 'success');
            serviceManagement.closeModal();
          } catch (error) {
            console.error('Error approving service:', error);
            serviceManagement.showNotification("Erreur lors de l'approbation", 'error');
          }
        }}
        onRejectService={async (serviceId: string) => {
          try {
            await updateService(serviceId, { is_active: false });
            serviceManagement.showNotification('Service rejeté avec succès', 'success');
            serviceManagement.closeModal();
          } catch (error) {
            console.error('Error rejecting service:', error);
            serviceManagement.showNotification('Erreur lors du rejet', 'error');
          }
        }}
        onDeleteService={async (serviceId: string) => {
          try {
            await deleteManyServices([serviceId]);
            serviceManagement.showNotification('Service supprimé avec succès', 'success');
            serviceManagement.closeModal();
          } catch (error) {
            console.error('Error deleting service:', error);
            serviceManagement.showNotification('Erreur lors de la suppression', 'error');
          }
        }}
        onInputChange={serviceManagement.updateEditForm}
        isLoading={isLoading}
      />

      {/* Modal de création de service */}
      <ServiceCreateModal
        open={serviceManagement.isCreateModalOpen}
        onClose={serviceManagement.closeCreateModal}
        onCreate={async (serviceData) => {
          try {
            await createService(serviceData);
            serviceManagement.showNotification('Service créé avec succès', 'success');
            serviceManagement.closeCreateModal();
          } catch (error) {
            console.error('Error creating service:', error);
            serviceManagement.showNotification('Erreur lors de la création', 'error');
          }
        }}
        isLoading={isLoading}
      />
    </AdminLayout>
  );
};

export default ServicesCatalogPage;
