import React, { useState, useEffect } from "react";
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  Typography,
  Box,
  CircularProgress,
  Tabs,
  Tab,
} from "@mui/material";
import { Build } from "@mui/icons-material";
import {
  ServicesModalProps,
  Service,
  ServiceRequest,
  Intervention,
} from "../../../types/userManagement";
import { useServices } from "../hooks/useServices";
import { ServiceStatsCards } from "./sections/ServiceStatsCards";
import { ServicesTabPanel } from "./sections/ServicesTabPanel";
import { RequestsTabPanel } from "./sections/RequestsTabPanel";
import { InterventionsTabPanel } from "./sections/InterventionsTabPanel";
import {
  getStatusColor,
  formatCurrency,
  formatDate,
  calculateServiceStats,
} from "./sections/ServicesModalUtils";

const ServicesModal: React.FC<ServicesModalProps> = ({
  open,
  onClose,
  userId,
  userName,
}) => {
  const [loading, setLoading] = useState(false);
  const [services, setServices] = useState<any[]>([]);
  const [serviceRequests, setServiceRequests] = useState<any[]>([]);
  const [interventions, setInterventions] = useState<any[]>([]);
  const [tabValue, setTabValue] = useState(0);

  // Destructure du hook useServices pour accéder aux fonctions
  const {
    getProviderServices,
    getProviderServiceRequests,
    getProviderInterventions,
  } = useServices();

  useEffect(() => {
    if (open && userId) {
      loadData();
    }
  }, [open, userId]);

  const loadData = async () => {
    setLoading(true);
    try {
      const [servicesData, requestsData, interventionsData] = await Promise.all(
        [
          getProviderServices(userId),
          getProviderServiceRequests(userId),
          getProviderInterventions(userId),
        ]
      );
      setServices(servicesData);
      setServiceRequests(requestsData);
      setInterventions(interventionsData);
    } catch (error) {
      console.error("Erreur lors du chargement des données:", error);
    } finally {
      setLoading(false);
    }
  };

  // Calculer les statistiques
  const { activeServices, totalEarnings, completedInterventions } =
    calculateServiceStats(services, serviceRequests, interventions);

  const TabPanel = ({ children, value, index }: any) => (
    <div hidden={value !== index}>
      {value === index && <Box sx={{ pt: 3 }}>{children}</Box>}
    </div>
  );

  return (
    <Dialog open={open} onClose={onClose} maxWidth="lg" fullWidth>
      <DialogTitle>
        <Box display="flex" alignItems="center" gap={2}>
          <Build />
          <Typography variant="h6">Services de {userName}</Typography>
        </Box>
      </DialogTitle>

      <DialogContent>
        {loading ? (
          <Box display="flex" justifyContent="center" p={4}>
            <CircularProgress />
          </Box>
        ) : (
          <>
            {/* Statistiques */}
            <ServiceStatsCards
              activeServices={activeServices}
              serviceRequests={serviceRequests}
              completedInterventions={completedInterventions}
              totalEarnings={totalEarnings}
              formatCurrency={formatCurrency}
            />

            {/* Onglets */}
            <Box sx={{ borderBottom: 1, borderColor: "divider" }}>
              <Tabs
                value={tabValue}
                onChange={(e, newValue) => setTabValue(newValue)}
              >
                <Tab label={`Services (${services.length})`} />
                <Tab label={`Demandes (${serviceRequests.length})`} />
                <Tab label={`Interventions (${interventions.length})`} />
              </Tabs>
            </Box>

            {/* Onglet Services */}
            <TabPanel value={tabValue} index={0}>
              <ServicesTabPanel
                services={services}
                formatCurrency={formatCurrency}
                getStatusColor={getStatusColor}
              />
            </TabPanel>

            {/* Onglet Demandes de service */}
            <TabPanel value={tabValue} index={1}>
              <RequestsTabPanel
                serviceRequests={serviceRequests}
                formatCurrency={formatCurrency}
                formatDate={formatDate}
                getStatusColor={getStatusColor}
              />
            </TabPanel>

            {/* Onglet Interventions */}
            <TabPanel value={tabValue} index={2}>
              <InterventionsTabPanel
                interventions={interventions}
                formatCurrency={formatCurrency}
                formatDate={formatDate}
                getStatusColor={getStatusColor}
              />
            </TabPanel>
          </>
        )}
      </DialogContent>

      <DialogActions>
        <Button onClick={onClose}>Fermer</Button>
      </DialogActions>
    </Dialog>
  );
};

export default ServicesModal;
