import React, { useState } from "react";
import {
  Box,
  Card,
  CardContent,
  Typography,
  Divider,
  Chip,
  Avatar,
  List,
  ListItem,
  ListItemText,
  ListItemIcon,
  Tabs,
  Tab,
  Rating,
  CircularProgress,
} from "@mui/material";
import {
  Person as PersonIcon,
  Email as EmailIcon,
  Phone as PhoneIcon,
  Category as CategoryIcon,
  AccessTime as TimeIcon,
  Star as StarIcon,
  Description as DescriptionIcon,
  BusinessCenter as BusinessIcon,
  Assignment as AssignmentIcon,
  TrendingUp as TrendingUpIcon,
} from "@mui/icons-material";
import { ServiceWithDetails } from "../../../types/services";
import {
  useProviderStats,
  useProviderServices,
  useServiceHistory,
  useServicePerformance,
} from "../hooks";

interface ServiceInfoSectionsProps {
  service: ServiceWithDetails;
  layoutMode: "main" | "sidebar";
}

const formatCurrency = (amount: number): string => {
  return new Intl.NumberFormat("fr-FR", {
    style: "currency",
    currency: "EUR",
  }).format(amount);
};

const formatDate = (dateString: string | null): string => {
  if (!dateString) return "N/A";
  return new Date(dateString).toLocaleDateString("fr-FR", {
    year: "numeric",
    month: "long",
    day: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });
};

const formatDuration = (minutes: number | null): string => {
  if (!minutes) return "Non spécifié";
  const hours = Math.floor(minutes / 60);
  const remainingMinutes = minutes % 60;

  if (hours === 0) return `${remainingMinutes} min`;
  if (remainingMinutes === 0) return `${hours}h`;
  return `${hours}h ${remainingMinutes}min`;
};

// Composant pour l'onglet détails du service
const ServiceDetailsTab: React.FC<{ service: ServiceWithDetails }> = ({
  service,
}) => (
  <Box sx={{ display: "flex", flexDirection: "column", gap: 3 }}>
    {/* Description du service */}
    <Card variant="outlined">
      <CardContent>
        <Typography
          variant="h6"
          gutterBottom
          sx={{ display: "flex", alignItems: "center", gap: 1 }}
        >
          <DescriptionIcon color="primary" />
          Description du service
        </Typography>
        {service.description ? (
          <Typography variant="body1" sx={{ lineHeight: 1.6 }}>
            {service.description}
          </Typography>
        ) : (
          <Typography variant="body2" color="text.secondary" fontStyle="italic">
            Aucune description disponible
          </Typography>
        )}
      </CardContent>
    </Card>

    {/* Détails techniques */}
    <Card variant="outlined">
      <CardContent>
        <Typography variant="h6" gutterBottom>
          Détails du service
        </Typography>

        <Box
          sx={{
            display: "grid",
            gridTemplateColumns: { xs: "1fr", md: "1fr 1fr" },
            gap: 2,
          }}
        >
          <Box>
            <Typography variant="subtitle2" color="text.secondary" gutterBottom>
              <CategoryIcon
                sx={{ fontSize: 16, mr: 1, verticalAlign: "middle" }}
              />
              Catégorie
            </Typography>
            <Chip label={service.category} color="primary" variant="outlined" />
          </Box>

          <Box>
            <Typography variant="subtitle2" color="text.secondary" gutterBottom>
              <TimeIcon sx={{ fontSize: 16, mr: 1, verticalAlign: "middle" }} />
              Durée estimée
            </Typography>
            <Typography variant="body1">
              {formatDuration(service.duration_minutes)}
            </Typography>
          </Box>
        </Box>

        {service.tags && service.tags.length > 0 && (
          <>
            <Divider sx={{ my: 2 }} />
            <Box>
              <Typography
                variant="subtitle2"
                color="text.secondary"
                gutterBottom
              >
                Tags
              </Typography>
              <Box sx={{ display: "flex", flexWrap: "wrap", gap: 1 }}>
                {service.tags.map((tag, index) => (
                  <Chip
                    key={index}
                    label={tag}
                    size="small"
                    variant="outlined"
                  />
                ))}
              </Box>
            </Box>
          </>
        )}

        {service.qualifications_required &&
          service.qualifications_required.length > 0 && (
            <>
              <Divider sx={{ my: 2 }} />
              <Box>
                <Typography
                  variant="subtitle2"
                  color="text.secondary"
                  gutterBottom
                >
                  <StarIcon
                    sx={{ fontSize: 16, mr: 1, verticalAlign: "middle" }}
                  />
                  Qualifications requises
                </Typography>
                <Box sx={{ display: "flex", flexWrap: "wrap", gap: 1 }}>
                  {service.qualifications_required.map((qual, index) => (
                    <Chip
                      key={index}
                      label={qual}
                      size="small"
                      color="secondary"
                      variant="outlined"
                    />
                  ))}
                </Box>
              </Box>
            </>
          )}
      </CardContent>
    </Card>

    {/* Informations système */}
    <Card variant="outlined">
      <CardContent>
        <Typography variant="h6" gutterBottom>
          Informations système
        </Typography>

        <Box
          sx={{
            display: "grid",
            gridTemplateColumns: { xs: "1fr", md: "1fr 1fr" },
            gap: 2,
          }}
        >
          <Box>
            <Typography variant="subtitle2" color="text.secondary">
              Date de création
            </Typography>
            <Typography variant="body2">
              {formatDate(service.created_at)}
            </Typography>
          </Box>

          <Box>
            <Typography variant="subtitle2" color="text.secondary">
              Dernière modification
            </Typography>
            <Typography variant="body2">
              {formatDate(service.updated_at)}
            </Typography>
          </Box>
        </Box>
      </CardContent>
    </Card>
  </Box>
);

// Composant pour l'onglet prestataire
const ProviderDetailsTab: React.FC<{ service: ServiceWithDetails }> = ({
  service,
}) => {
  // Récupérer les vraies données du prestataire
  const { data: providerStats, isLoading: statsLoading } = useProviderStats(
    service.provider?.id || ""
  );

  const { data: otherServices, isLoading: servicesLoading } =
    useProviderServices(
      service.provider?.id || "",
      service.id // Exclure le service actuel
    );

  if (!service.provider) {
    return (
      <Card variant="outlined">
        <CardContent>
          <Typography variant="h6" color="text.secondary" textAlign="center">
            Aucun prestataire assigné à ce service
          </Typography>
        </CardContent>
      </Card>
    );
  }

  return (
    <Box sx={{ display: "flex", flexDirection: "column", gap: 3 }}>
      {/* Informations principales du prestataire */}
      <Card variant="outlined">
        <CardContent>
          <Typography
            variant="h6"
            gutterBottom
            sx={{ display: "flex", alignItems: "center", gap: 1 }}
          >
            <PersonIcon color="primary" />
            Informations du prestataire
          </Typography>

          <Box sx={{ display: "flex", alignItems: "center", gap: 3, mb: 3 }}>
            <Avatar
              sx={{ width: 80, height: 80 }}
              src={service.provider.avatar_url || undefined}
            >
              {service.provider.first_name?.charAt(0) ||
                service.provider.full_name?.charAt(0) ||
                "P"}
            </Avatar>
            <Box sx={{ flex: 1 }}>
              <Typography variant="h5" fontWeight="medium">
                {service.provider.first_name && service.provider.last_name
                  ? `${service.provider.first_name} ${service.provider.last_name}`
                  : service.provider.full_name || "N/A"}
              </Typography>
              <Typography variant="body1" color="text.secondary" gutterBottom>
                {service.provider.role || "Prestataire"}
              </Typography>
              <Box sx={{ display: "flex", gap: 2, mt: 1 }}>
                <Chip label="Professionnel" color="primary" size="small" />
              </Box>
            </Box>
          </Box>

          <Box sx={{ display: "flex", gap: 3, flexWrap: "wrap" }}>
            <Box sx={{ flex: 1, minWidth: 200 }}>
              <Typography
                variant="subtitle2"
                color="text.secondary"
                gutterBottom
              >
                <EmailIcon
                  sx={{ fontSize: 16, mr: 1, verticalAlign: "middle" }}
                />
                Email
              </Typography>
              <Typography variant="body1">{service.provider.email}</Typography>
            </Box>

            {service.provider.phone && (
              <Box sx={{ flex: 1, minWidth: 200 }}>
                <Typography
                  variant="subtitle2"
                  color="text.secondary"
                  gutterBottom
                >
                  <PhoneIcon
                    sx={{ fontSize: 16, mr: 1, verticalAlign: "middle" }}
                  />
                  Téléphone
                </Typography>
                <Typography variant="body1">
                  {service.provider.phone}
                </Typography>
              </Box>
            )}
          </Box>
        </CardContent>
      </Card>

      {/* Statistiques du prestataire */}
      <Card variant="outlined">
        <CardContent>
          <Typography
            variant="h6"
            gutterBottom
            sx={{ display: "flex", alignItems: "center", gap: 1 }}
          >
            <TrendingUpIcon color="primary" />
            Statistiques
          </Typography>

          {statsLoading ? (
            <Box sx={{ textAlign: "center", py: 2 }}>
              <CircularProgress size={24} />
            </Box>
          ) : providerStats ? (
            <Box sx={{ display: "flex", gap: 2, flexWrap: "wrap" }}>
              <Box sx={{ flex: 1, minWidth: 120 }}>
                <Box
                  sx={{
                    textAlign: "center",
                    p: 1,
                    bgcolor: "primary.light",
                    borderRadius: 1,
                  }}
                >
                  <Typography variant="h4" color="primary.main">
                    {providerStats.activeServices}
                  </Typography>
                  <Typography variant="caption">Services actifs</Typography>
                </Box>
              </Box>
              <Box sx={{ flex: 1, minWidth: 120 }}>
                <Box
                  sx={{
                    textAlign: "center",
                    p: 1,
                    bgcolor: "success.light",
                    borderRadius: 1,
                  }}
                >
                  <Typography variant="h4" color="success.main">
                    {providerStats.completedRequests}
                  </Typography>
                  <Typography variant="caption">Demandes traitées</Typography>
                </Box>
              </Box>
              <Box sx={{ flex: 1, minWidth: 120 }}>
                <Box
                  sx={{
                    textAlign: "center",
                    p: 1,
                    bgcolor: "warning.light",
                    borderRadius: 1,
                  }}
                >
                  <Box
                    sx={{
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                    }}
                  >
                    <Typography variant="h4" color="warning.main">
                      {providerStats.averageRating.toFixed(1)}
                    </Typography>
                    <StarIcon sx={{ color: "warning.main", ml: 0.5 }} />
                  </Box>
                  <Typography variant="caption">Note moyenne</Typography>
                </Box>
              </Box>
              <Box sx={{ flex: 1, minWidth: 120 }}>
                <Box
                  sx={{
                    textAlign: "center",
                    p: 1,
                    bgcolor: "info.light",
                    borderRadius: 1,
                  }}
                >
                  <Typography variant="h4" color="info.main">
                    {providerStats.totalRevenue.toLocaleString("fr-FR", {
                      style: "currency",
                      currency: "EUR",
                      maximumFractionDigits: 0,
                    })}
                  </Typography>
                  <Typography variant="caption">CA Total</Typography>
                </Box>
              </Box>
            </Box>
          ) : (
            <Typography
              variant="body2"
              color="text.secondary"
              textAlign="center"
            >
              Aucune statistique disponible
            </Typography>
          )}
        </CardContent>
      </Card>

      {/* Autres services du prestataire */}
      <Card variant="outlined">
        <CardContent>
          <Typography
            variant="h6"
            gutterBottom
            sx={{ display: "flex", alignItems: "center", gap: 1 }}
          >
            <BusinessIcon color="primary" />
            Autres services de ce prestataire
          </Typography>

          <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
            Services proposés par{" "}
            {service.provider.first_name || "ce prestataire"}
          </Typography>

          {servicesLoading ? (
            <Box sx={{ textAlign: "center", py: 2 }}>
              <CircularProgress size={20} />
            </Box>
          ) : otherServices && otherServices.length > 0 ? (
            <Box sx={{ display: "flex", flexWrap: "wrap", gap: 1 }}>
              {otherServices.map((otherService) => (
                <Chip
                  key={otherService.id}
                  label={`${otherService.name} (${formatCurrency(
                    otherService.base_price
                  )})`}
                  color={otherService.is_active ? "primary" : "default"}
                  size="small"
                  variant={otherService.is_active ? "filled" : "outlined"}
                />
              ))}
            </Box>
          ) : (
            <Typography
              variant="body2"
              color="text.secondary"
              fontStyle="italic"
            >
              Aucun autre service trouvé pour ce prestataire
            </Typography>
          )}
        </CardContent>
      </Card>
    </Box>
  );
};

// Composant pour l'onglet historique
const ServiceHistoryTab: React.FC<{ service: ServiceWithDetails }> = ({
  service,
}) => {
  const { data: history, isLoading: historyLoading } = useServiceHistory(
    service.id
  );
  const { data: performance, isLoading: performanceLoading } =
    useServicePerformance(service.id);

  return (
    <Box sx={{ display: "flex", flexDirection: "column", gap: 3 }}>
      {/* Demandes récentes pour ce service */}
      <Card variant="outlined">
        <CardContent>
          <Typography
            variant="h6"
            gutterBottom
            sx={{ display: "flex", alignItems: "center", gap: 1 }}
          >
            <AssignmentIcon color="primary" />
            Demandes récentes
          </Typography>

          {historyLoading ? (
            <Box sx={{ textAlign: "center", py: 2 }}>
              <CircularProgress size={24} />
            </Box>
          ) : history && history.length > 0 ? (
            <Box sx={{ display: "flex", flexDirection: "column", gap: 2 }}>
              {history.map((request) => (
                <Box
                  key={request.id}
                  sx={{
                    p: 2,
                    border: 1,
                    borderColor: "divider",
                    borderRadius: 1,
                    display: "flex",
                    justifyContent: "space-between",
                    alignItems: "center",
                  }}
                >
                  <Box>
                    <Typography variant="body1" fontWeight="medium">
                      Demande #{request.id.slice(0, 8)}
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                      Client:{" "}
                      {request.requester?.full_name ||
                        request.requester?.email ||
                        "Inconnu"}{" "}
                      •{" "}
                      {new Date(request.requested_date).toLocaleDateString(
                        "fr-FR"
                      )}
                      {request.total_amount &&
                        ` • ${formatCurrency(request.total_amount)}`}
                    </Typography>
                  </Box>
                  <Chip
                    label={
                      request.status === "completed"
                        ? "Terminée"
                        : request.status === "pending"
                        ? "En attente"
                        : request.status === "accepted"
                        ? "Acceptée"
                        : request.status === "rejected"
                        ? "Rejetée"
                        : request.status
                    }
                    color={
                      request.status === "completed"
                        ? "success"
                        : request.status === "accepted"
                        ? "info"
                        : request.status === "pending"
                        ? "warning"
                        : "error"
                    }
                    size="small"
                  />
                </Box>
              ))}
            </Box>
          ) : (
            <Typography
              variant="body2"
              color="text.secondary"
              textAlign="center"
              fontStyle="italic"
            >
              Aucune demande trouvée pour ce service
            </Typography>
          )}
        </CardContent>
      </Card>

      {/* Évolution des performances */}
      <Card variant="outlined">
        <CardContent>
          <Typography variant="h6" gutterBottom>
            Performances du service
          </Typography>

          {performanceLoading ? (
            <Box sx={{ textAlign: "center", py: 2 }}>
              <CircularProgress size={24} />
            </Box>
          ) : performance ? (
            <Box sx={{ display: "flex", gap: 2, flexWrap: "wrap" }}>
              <Box sx={{ flex: 1, minWidth: 200 }}>
                <Box
                  sx={{ p: 2, bgcolor: "background.default", borderRadius: 1 }}
                >
                  <Typography variant="h4" color="primary">
                    {performance.thisMonthRequests}
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    Demandes ce mois
                  </Typography>
                </Box>
              </Box>
              <Box sx={{ flex: 1, minWidth: 200 }}>
                <Box
                  sx={{ p: 2, bgcolor: "background.default", borderRadius: 1 }}
                >
                  <Typography variant="h4" color="success.main">
                    {performance.satisfactionRate}%
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    Taux de satisfaction
                  </Typography>
                </Box>
              </Box>
            </Box>
          ) : (
            <Typography
              variant="body2"
              color="text.secondary"
              textAlign="center"
            >
              Aucune statistique disponible
            </Typography>
          )}
        </CardContent>
      </Card>
    </Box>
  );
};

export const ServiceInfoSections: React.FC<ServiceInfoSectionsProps> = ({
  service,
  layoutMode,
}) => {
  const [activeTab, setActiveTab] = useState(0);

  if (layoutMode === "sidebar") {
    return (
      <Box sx={{ display: "flex", flexDirection: "column", gap: 2 }}>
        {/* Informations du prestataire */}
        <Card variant="outlined">
          <CardContent>
            <Typography
              variant="h6"
              gutterBottom
              sx={{ display: "flex", alignItems: "center", gap: 1 }}
            >
              <PersonIcon color="primary" />
              Prestataire
            </Typography>
            {service.provider ? (
              <Box>
                <Box
                  sx={{ display: "flex", alignItems: "center", gap: 2, mb: 2 }}
                >
                  <Avatar
                    sx={{ width: 40, height: 40 }}
                    src={service.provider.avatar_url || undefined}
                  >
                    {service.provider.first_name?.charAt(0) ||
                      service.provider.full_name?.charAt(0) ||
                      "P"}
                  </Avatar>
                  <Box>
                    <Typography variant="subtitle1" fontWeight="medium">
                      {service.provider.first_name && service.provider.last_name
                        ? `${service.provider.first_name} ${service.provider.last_name}`
                        : service.provider.full_name || "N/A"}
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                      {service.provider.role || "Prestataire"}
                    </Typography>
                  </Box>
                </Box>

                <List dense>
                  <ListItem disablePadding>
                    <ListItemIcon sx={{ minWidth: 36 }}>
                      <EmailIcon fontSize="small" />
                    </ListItemIcon>
                    <ListItemText
                      primary={service.provider.email}
                      primaryTypographyProps={{ variant: "body2" }}
                    />
                  </ListItem>
                  {service.provider.phone && (
                    <ListItem disablePadding>
                      <ListItemIcon sx={{ minWidth: 36 }}>
                        <PhoneIcon fontSize="small" />
                      </ListItemIcon>
                      <ListItemText
                        primary={service.provider.phone}
                        primaryTypographyProps={{ variant: "body2" }}
                      />
                    </ListItem>
                  )}
                </List>
              </Box>
            ) : (
              <Typography variant="body2" color="text.secondary">
                Aucun prestataire assigné
              </Typography>
            )}
          </CardContent>
        </Card>

        {/* Informations de tarification */}
        <Card variant="outlined">
          <CardContent>
            <Typography variant="h6" gutterBottom>
              Tarification
            </Typography>
            <Box sx={{ display: "flex", flexDirection: "column", gap: 1 }}>
              <Box
                sx={{
                  display: "flex",
                  justifyContent: "space-between",
                  alignItems: "center",
                }}
              >
                <Typography variant="body2" color="text.secondary">
                  Prix de base:
                </Typography>
                <Typography variant="h6" color="primary.main">
                  {formatCurrency(service.base_price)}
                </Typography>
              </Box>

              <Box
                sx={{
                  display: "flex",
                  justifyContent: "space-between",
                  alignItems: "center",
                }}
              >
                <Typography variant="body2" color="text.secondary">
                  Type de prix:
                </Typography>
                <Chip
                  label={service.price_type || "Fixe"}
                  size="small"
                  variant="outlined"
                />
              </Box>
            </Box>
          </CardContent>
        </Card>
      </Box>
    );
  }

  // Layout principal (main) - Avec onglets
  return (
    <Box>
      {/* Onglets */}
      <Box sx={{ borderBottom: 1, borderColor: "divider", mb: 3 }}>
        <Tabs
          value={activeTab}
          onChange={(_, newValue) => setActiveTab(newValue)}
        >
          <Tab label="Détails du Service" />
          <Tab label="Prestataire" />
          <Tab label="Historique" />
        </Tabs>
      </Box>

      {/* Contenu des onglets */}
      {activeTab === 0 && <ServiceDetailsTab service={service} />}

      {activeTab === 1 && <ProviderDetailsTab service={service} />}

      {activeTab === 2 && <ServiceHistoryTab service={service} />}
    </Box>
  );
};
