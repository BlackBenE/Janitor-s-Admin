import React, { useState } from "react";
import {
  Box,
  Card,
  CardContent,
  Typography,
  Chip,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  TextField,
  Button,
  Alert,
  CircularProgress,
} from "@mui/material";
import {
  useServiceRequests,
  useServiceRequestStats,
  useServiceRequestMutations,
  type ServiceRequestFilters,
} from "../hooks";
import { getStatusColor } from "../../../utils";

const getStatusLabel = (status: string | null) => {
  switch (status?.toLowerCase()) {
    case "pending":
      return "En attente";
    case "accepted":
      return "Acceptée";
    case "rejected":
      return "Rejetée";
    case "completed":
      return "Terminée";
    case "cancelled":
      return "Annulée";
    default:
      return status || "Inconnu";
  }
};

export const ServiceRequestsSection: React.FC = () => {
  const [filters, setFilters] = useState<ServiceRequestFilters>({});

  // Hooks pour les données
  const {
    data: serviceRequests = [],
    isLoading,
    error,
    refetch,
  } = useServiceRequests({ filters });

  const { data: stats, isLoading: statsLoading } = useServiceRequestStats();

  // Hooks pour les mutations
  const {
    acceptServiceRequest,
    rejectServiceRequest,
    completeServiceRequest,
    cancelServiceRequest,
  } = useServiceRequestMutations();

  const handleStatusFilter = (status: string) => {
    setFilters((prev) => ({
      ...prev,
      status: status === "all" ? undefined : status,
    }));
  };

  const handleSearchChange = (search: string) => {
    setFilters((prev) => ({
      ...prev,
      search: search || undefined,
    }));
  };

  const handleAcceptRequest = async (id: string) => {
    try {
      await acceptServiceRequest.mutateAsync({ id });
      console.log("✅ Demande acceptée");
    } catch (error) {
      console.error("❌ Erreur:", error);
    }
  };

  const handleRejectRequest = async (id: string) => {
    try {
      await rejectServiceRequest.mutateAsync(id);
      console.log("❌ Demande rejetée");
    } catch (error) {
      console.error("❌ Erreur:", error);
    }
  };

  if (error) {
    return (
      <Alert severity="error" sx={{ mb: 2 }}>
        Erreur lors du chargement des demandes de service: {error.message}
      </Alert>
    );
  }

  return (
    <Box sx={{ mt: 3 }}>
      <Typography variant="h6" gutterBottom>
        Demandes de Service
      </Typography>

      {/* Statistiques */}
      {stats && !statsLoading && (
        <Box sx={{ display: "flex", gap: 2, mb: 3, flexWrap: "wrap" }}>
          <Card variant="outlined" sx={{ flex: 1, minWidth: 120 }}>
            <CardContent sx={{ textAlign: "center", py: 1.5 }}>
              <Typography variant="h5" color="primary">
                {stats.total}
              </Typography>
              <Typography variant="caption">Total</Typography>
            </CardContent>
          </Card>
          <Card variant="outlined" sx={{ flex: 1, minWidth: 120 }}>
            <CardContent sx={{ textAlign: "center", py: 1.5 }}>
              <Typography variant="h5" color="warning.main">
                {stats.pending}
              </Typography>
              <Typography variant="caption">En attente</Typography>
            </CardContent>
          </Card>
          <Card variant="outlined" sx={{ flex: 1, minWidth: 120 }}>
            <CardContent sx={{ textAlign: "center", py: 1.5 }}>
              <Typography variant="h5" color="success.main">
                {stats.completed}
              </Typography>
              <Typography variant="caption">Terminées</Typography>
            </CardContent>
          </Card>
          <Card variant="outlined" sx={{ flex: 1, minWidth: 120 }}>
            <CardContent sx={{ textAlign: "center", py: 1.5 }}>
              <Typography variant="h5" color="info.main">
                {Math.round(stats.averageAmount)}€
              </Typography>
              <Typography variant="caption">Prix moyen</Typography>
            </CardContent>
          </Card>
        </Box>
      )}

      {/* Filtres */}
      <Box sx={{ display: "flex", gap: 2, mb: 3, flexWrap: "wrap" }}>
        <FormControl size="small" sx={{ minWidth: 120 }}>
          <InputLabel>Statut</InputLabel>
          <Select
            value={filters.status || "all"}
            onChange={(e) => handleStatusFilter(e.target.value)}
            label="Statut"
          >
            <MenuItem value="all">Tous</MenuItem>
            <MenuItem value="pending">En attente</MenuItem>
            <MenuItem value="accepted">Acceptée</MenuItem>
            <MenuItem value="rejected">Rejetée</MenuItem>
            <MenuItem value="completed">Terminée</MenuItem>
            <MenuItem value="cancelled">Annulée</MenuItem>
          </Select>
        </FormControl>

        <TextField
          size="small"
          placeholder="Rechercher..."
          value={filters.search || ""}
          onChange={(e) => handleSearchChange(e.target.value)}
          sx={{ minWidth: 200 }}
        />

        <Button variant="outlined" onClick={() => refetch()} size="small">
          Actualiser
        </Button>
      </Box>

      {/* Liste des demandes avec scroll */}
      {isLoading ? (
        <Box sx={{ display: "flex", justifyContent: "center", py: 4 }}>
          <CircularProgress />
        </Box>
      ) : error ? (
        <Alert severity="error" sx={{ mb: 2 }}>
          Erreur lors du chargement des demandes: {String(error)}
        </Alert>
      ) : serviceRequests.length === 0 ? (
        <Alert severity="info">
          Aucune demande de service trouvée avec les filtres actuels.
        </Alert>
      ) : (
        <Box
          sx={{
            height: 600,
            overflow: "auto",
            pr: 1,
          }}
        >
          <Box
            sx={{
              display: "grid",
              gridTemplateColumns: {
                xs: "1fr",
                md: "1fr 1fr",
                lg: "1fr 1fr 1fr",
              },
              gap: 2,
            }}
          >
            {serviceRequests.map((request) => (
              <Card key={request.id} variant="outlined">
                <CardContent>
                  <Box
                    sx={{
                      display: "flex",
                      justifyContent: "space-between",
                      alignItems: "flex-start",
                      mb: 2,
                    }}
                  >
                    <Typography variant="subtitle1" fontWeight="medium">
                      {request.service?.name || "Service inconnu"}
                    </Typography>
                    <Chip
                      label={getStatusLabel(request.status)}
                      color={getStatusColor(request.status, "quote_request")}
                      size="small"
                    />
                  </Box>

                  <Typography
                    variant="body2"
                    color="text.secondary"
                    gutterBottom
                  >
                    <strong>Client:</strong>{" "}
                    {request.requester?.full_name || request.requester?.email}
                  </Typography>

                  {request.provider && (
                    <Typography
                      variant="body2"
                      color="text.secondary"
                      gutterBottom
                    >
                      <strong>Prestataire:</strong>{" "}
                      {request.provider.full_name || request.provider.email}
                    </Typography>
                  )}

                  <Typography
                    variant="body2"
                    color="text.secondary"
                    gutterBottom
                  >
                    <strong>Montant:</strong> {request.total_amount}€
                  </Typography>

                  <Typography
                    variant="body2"
                    color="text.secondary"
                    gutterBottom
                  >
                    <strong>Date demandée:</strong>{" "}
                    {new Date(request.requested_date).toLocaleDateString(
                      "fr-FR"
                    )}
                  </Typography>

                  {request.notes && (
                    <Typography
                      variant="body2"
                      color="text.secondary"
                      sx={{ mt: 1 }}
                    >
                      <strong>Notes:</strong> {request.notes}
                    </Typography>
                  )}

                  {/* Actions rapides */}
                  {request.status === "pending" && (
                    <Box sx={{ display: "flex", gap: 1, mt: 2 }}>
                      <Button
                        size="small"
                        variant="contained"
                        color="success"
                        onClick={() => handleAcceptRequest(request.id)}
                        disabled={acceptServiceRequest.isPending}
                      >
                        Accepter
                      </Button>
                      <Button
                        size="small"
                        variant="outlined"
                        color="error"
                        onClick={() => handleRejectRequest(request.id)}
                        disabled={rejectServiceRequest.isPending}
                      >
                        Rejeter
                      </Button>
                    </Box>
                  )}
                </CardContent>
              </Card>
            ))}
          </Box>

          {/* Indicateur du nombre total */}
          <Box
            sx={{
              textAlign: "center",
              mt: 2,
              mb: 2,
              position: "sticky",
              bottom: 0,
              bgcolor: "background.default",
              py: 1,
            }}
          >
            <Typography variant="body2" color="text.secondary">
              {serviceRequests.length} demande
              {serviceRequests.length > 1 ? "s" : ""} au total
            </Typography>
          </Box>
        </Box>
      )}
    </Box>
  );
};

export default ServiceRequestsSection;
