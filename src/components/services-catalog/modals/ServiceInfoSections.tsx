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
  Assignment as AssignmentIcon,
} from "@mui/icons-material";
import { ServiceWithDetails } from "../../../types/services";
import { useServiceHistory, useProviderServices } from "../hooks";
import { formatCurrency, formatDate, formatDuration } from "../../../utils";

interface ServiceInfoSectionsProps {
  service: ServiceWithDetails;
  layoutMode: "main" | "sidebar";
}

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

// Composant pour l'onglet historique
const ServiceHistoryTab: React.FC<{ service: ServiceWithDetails }> = ({
  service,
}) => {
  const { data: history, isLoading: historyLoading } = useServiceHistory(
    service.id
  );

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
    </Box>
  );
};

// Composant pour afficher les autres services du prestataire (utilisé dans la sidebar)
const ProviderServicesSection: React.FC<{ service: ServiceWithDetails }> = ({
  service,
}) => {
  const { data: otherServices, isLoading: servicesLoading } =
    useProviderServices(
      service.provider?.id || "",
      service.id // Exclure le service actuel
    );

  if (!service.provider) return null;

  return (
    <Card variant="outlined">
      <CardContent>
        <Typography variant="h6" gutterBottom>
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
          <Box sx={{ display: "flex", flexDirection: "column", gap: 1 }}>
            {otherServices.map((otherService) => (
              <Box
                key={otherService.id}
                sx={{
                  p: 2,
                  bgcolor: "grey.50",
                  borderRadius: 1,
                  border: "1px solid",
                  borderColor: "grey.200",
                }}
              >
                <Typography variant="subtitle2" fontWeight="medium">
                  {otherService.name}
                </Typography>
                <Box
                  sx={{
                    display: "flex",
                    justifyContent: "space-between",
                    alignItems: "center",
                    mt: 1,
                  }}
                >
                  <Typography variant="body2" color="text.secondary">
                    {formatCurrency(otherService.base_price)}
                  </Typography>
                  <Chip
                    label={otherService.is_active ? "Actif" : "Inactif"}
                    color={otherService.is_active ? "success" : "default"}
                    size="small"
                  />
                </Box>
              </Box>
            ))}
          </Box>
        ) : (
          <Typography variant="body2" color="text.secondary" fontStyle="italic">
            Aucun autre service trouvé pour ce prestataire
          </Typography>
        )}
      </CardContent>
    </Card>
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

        {/* Autres services de ce prestataire */}
        {service.provider && <ProviderServicesSection service={service} />}
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
          <Tab label="Historique" />
        </Tabs>
      </Box>

      {/* Contenu des onglets */}
      {activeTab === 0 && <ServiceDetailsTab service={service} />}

      {activeTab === 1 && <ServiceHistoryTab service={service} />}
    </Box>
  );
};
