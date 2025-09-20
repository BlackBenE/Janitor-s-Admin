import React, { useState, useEffect } from "react";
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  Typography,
  Box,
  Chip,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  CircularProgress,
  Card,
  CardContent,
  Tabs,
  Tab,
  ImageList,
  ImageListItem,
  ImageListItemBar,
} from "@mui/material";
import Grid from "@mui/material/Grid";
import {
  Build,
  Assignment,
  Photo,
  Euro,
  CheckCircle,
  Cancel,
  Pending,
} from "@mui/icons-material";
import { useServices } from "../hooks/useServices";

interface ServicesModalProps {
  open: boolean;
  onClose: () => void;
  userId: string;
  userName: string;
}

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

  const getStatusColor = (status: string) => {
    switch (status?.toLowerCase()) {
      case "active":
      case "completed":
        return "success";
      case "pending":
        return "warning";
      case "cancelled":
      case "inactive":
        return "error";
      default:
        return "default";
    }
  };

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat("fr-FR", {
      style: "currency",
      currency: "EUR",
    }).format(amount);
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("fr-FR");
  };

  const activeServices = services.filter((s) => s.is_active);
  const totalEarnings = serviceRequests.reduce(
    (sum, req) => sum + (req.total_amount || 0),
    0
  );
  const completedInterventions = interventions.filter(
    (i) => i.status === "completed"
  );

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
            <Grid container spacing={3} sx={{ mb: 3 }}>
              <Grid size={{ xs: 12, sm: 6, md: 3 }}>
                <Card>
                  <CardContent>
                    <Box display="flex" alignItems="center" gap={1}>
                      <Build color="primary" />
                      <Typography variant="h6">
                        {activeServices.length}
                      </Typography>
                    </Box>
                    <Typography variant="body2" color="text.secondary">
                      Services actifs
                    </Typography>
                  </CardContent>
                </Card>
              </Grid>

              <Grid size={{ xs: 12, sm: 6, md: 3 }}>
                <Card>
                  <CardContent>
                    <Box display="flex" alignItems="center" gap={1}>
                      <Assignment color="primary" />
                      <Typography variant="h6">
                        {serviceRequests.length}
                      </Typography>
                    </Box>
                    <Typography variant="body2" color="text.secondary">
                      Demandes reçues
                    </Typography>
                  </CardContent>
                </Card>
              </Grid>

              <Grid size={{ xs: 12, sm: 6, md: 3 }}>
                <Card>
                  <CardContent>
                    <Box display="flex" alignItems="center" gap={1}>
                      <CheckCircle color="primary" />
                      <Typography variant="h6">
                        {completedInterventions.length}
                      </Typography>
                    </Box>
                    <Typography variant="body2" color="text.secondary">
                      Interventions terminées
                    </Typography>
                  </CardContent>
                </Card>
              </Grid>

              <Grid size={{ xs: 12, sm: 6, md: 3 }}>
                <Card>
                  <CardContent>
                    <Box display="flex" alignItems="center" gap={1}>
                      <Euro color="primary" />
                      <Typography variant="h6">
                        {formatCurrency(totalEarnings)}
                      </Typography>
                    </Box>
                    <Typography variant="body2" color="text.secondary">
                      Revenus potentiels
                    </Typography>
                  </CardContent>
                </Card>
              </Grid>
            </Grid>

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
              {services.length === 0 ? (
                <Typography
                  color="text.secondary"
                  sx={{ textAlign: "center", py: 4 }}
                >
                  Aucun service trouvé
                </Typography>
              ) : (
                <TableContainer component={Paper}>
                  <Table>
                    <TableHead>
                      <TableRow>
                        <TableCell>Service</TableCell>
                        <TableCell>Catégorie</TableCell>
                        <TableCell>Prix de base</TableCell>
                        <TableCell>Durée</TableCell>
                        <TableCell>Statut</TableCell>
                      </TableRow>
                    </TableHead>
                    <TableBody>
                      {services.map((service) => (
                        <TableRow key={service.id}>
                          <TableCell>
                            <Typography variant="body2" fontWeight="medium">
                              {service.name}
                            </Typography>
                            <Typography
                              variant="caption"
                              color="text.secondary"
                            >
                              {service.description}
                            </Typography>
                          </TableCell>
                          <TableCell>{service.category}</TableCell>
                          <TableCell>
                            {formatCurrency(service.base_price)}
                            <Typography variant="caption" display="block">
                              {service.price_type}
                            </Typography>
                          </TableCell>
                          <TableCell>
                            {service.duration_minutes
                              ? `${service.duration_minutes} min`
                              : "N/A"}
                          </TableCell>
                          <TableCell>
                            <Chip
                              label={service.is_active ? "Actif" : "Inactif"}
                              color={service.is_active ? "success" : "default"}
                              size="small"
                            />
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </TableContainer>
              )}
            </TabPanel>

            {/* Onglet Demandes de service */}
            <TabPanel value={tabValue} index={1}>
              {serviceRequests.length === 0 ? (
                <Typography
                  color="text.secondary"
                  sx={{ textAlign: "center", py: 4 }}
                >
                  Aucune demande trouvée
                </Typography>
              ) : (
                <TableContainer component={Paper}>
                  <Table>
                    <TableHead>
                      <TableRow>
                        <TableCell>Service</TableCell>
                        <TableCell>Propriété</TableCell>
                        <TableCell>Date demandée</TableCell>
                        <TableCell>Montant</TableCell>
                        <TableCell>Statut</TableCell>
                      </TableRow>
                    </TableHead>
                    <TableBody>
                      {serviceRequests.map((request) => (
                        <TableRow key={request.id}>
                          <TableCell>
                            <Typography variant="body2" fontWeight="medium">
                              {request.services?.name || "Service inconnu"}
                            </Typography>
                            <Typography
                              variant="caption"
                              color="text.secondary"
                            >
                              {request.services?.category}
                            </Typography>
                          </TableCell>
                          <TableCell>
                            <Typography variant="body2">
                              {request.properties?.title ||
                                "Propriété inconnue"}
                            </Typography>
                            <Typography
                              variant="caption"
                              color="text.secondary"
                            >
                              {request.properties?.city}
                            </Typography>
                          </TableCell>
                          <TableCell>
                            {formatDate(request.requested_date)}
                          </TableCell>
                          <TableCell>
                            {formatCurrency(request.total_amount)}
                          </TableCell>
                          <TableCell>
                            <Chip
                              label={request.status || "Inconnu"}
                              color={getStatusColor(request.status)}
                              size="small"
                            />
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </TableContainer>
              )}
            </TabPanel>

            {/* Onglet Interventions */}
            <TabPanel value={tabValue} index={2}>
              {interventions.length === 0 ? (
                <Typography
                  color="text.secondary"
                  sx={{ textAlign: "center", py: 4 }}
                >
                  Aucune intervention trouvée
                </Typography>
              ) : (
                <Box>
                  {interventions.map((intervention) => (
                    <Card key={intervention.id} sx={{ mb: 2 }}>
                      <CardContent>
                        <Box
                          display="flex"
                          justifyContent="space-between"
                          alignItems="start"
                          mb={2}
                        >
                          <Box>
                            <Typography variant="h6">
                              Intervention #{intervention.id.slice(-8)}
                            </Typography>
                            <Typography variant="body2" color="text.secondary">
                              {intervention.work_description ||
                                "Description non fournie"}
                            </Typography>
                          </Box>
                          <Chip
                            label={intervention.status || "Inconnu"}
                            color={getStatusColor(intervention.status)}
                            size="small"
                          />
                        </Box>

                        {/* Photos avant/après */}
                        {(intervention.before_photos ||
                          intervention.after_photos) && (
                          <Box>
                            <Typography variant="subtitle2" gutterBottom>
                              Photos d'intervention
                            </Typography>
                            <Grid container spacing={2}>
                              {intervention.before_photos && (
                                <Grid size={{ xs: 12, md: 6 }}>
                                  <Typography
                                    variant="body2"
                                    color="text.secondary"
                                    gutterBottom
                                  >
                                    Avant ({intervention.before_photos.length}{" "}
                                    photos)
                                  </Typography>
                                  <ImageList cols={2} rowHeight={100}>
                                    {intervention.before_photos
                                      .slice(0, 4)
                                      .map((photo: string, index: number) => (
                                        <ImageListItem key={`before-${index}`}>
                                          <img
                                            src={photo}
                                            alt={`Avant ${index + 1}`}
                                            loading="lazy"
                                          />
                                          <ImageListItemBar title="Avant" />
                                        </ImageListItem>
                                      ))}
                                  </ImageList>
                                </Grid>
                              )}
                              {intervention.after_photos && (
                                <Grid size={{ xs: 12, md: 6 }}>
                                  <Typography
                                    variant="body2"
                                    color="text.secondary"
                                    gutterBottom
                                  >
                                    Après ({intervention.after_photos.length}{" "}
                                    photos)
                                  </Typography>
                                  <ImageList cols={2} rowHeight={100}>
                                    {intervention.after_photos
                                      .slice(0, 4)
                                      .map((photo: string, index: number) => (
                                        <ImageListItem key={`after-${index}`}>
                                          <img
                                            src={photo}
                                            alt={`Après ${index + 1}`}
                                            loading="lazy"
                                          />
                                          <ImageListItemBar title="Après" />
                                        </ImageListItem>
                                      ))}
                                  </ImageList>
                                </Grid>
                              )}
                            </Grid>
                          </Box>
                        )}

                        {/* Dates */}
                        <Box mt={2}>
                          <Grid container spacing={2}>
                            {intervention.started_at && (
                              <Grid size={{ xs: 12, sm: 4 }}>
                                <Typography
                                  variant="caption"
                                  color="text.secondary"
                                >
                                  Démarrée le
                                </Typography>
                                <Typography variant="body2">
                                  {formatDate(intervention.started_at)}
                                </Typography>
                              </Grid>
                            )}
                            {intervention.completed_at && (
                              <Grid size={{ xs: 12, sm: 4 }}>
                                <Typography
                                  variant="caption"
                                  color="text.secondary"
                                >
                                  Terminée le
                                </Typography>
                                <Typography variant="body2">
                                  {formatDate(intervention.completed_at)}
                                </Typography>
                              </Grid>
                            )}
                          </Grid>
                        </Box>
                      </CardContent>
                    </Card>
                  ))}
                </Box>
              )}
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
