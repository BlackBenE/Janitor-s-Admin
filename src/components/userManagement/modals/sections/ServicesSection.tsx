import React, { useMemo } from "react";
import {
  Alert,
  Box,
  Card,
  CardContent,
  Chip,
  CircularProgress,
  Grid,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Typography,
} from "@mui/material";
import { Build, CheckCircle, Euro, Work } from "@mui/icons-material";
import {
  useUserServiceRequests,
  useUserProviderServiceRequests,
} from "../../hooks/useUserQueries";

interface ServicesSectionProps {
  userId: string;
  userName: string;
  userRole: string;
  isVisible?: boolean;
}

/**
 * Section Services pour UserDetailsModal
 * Affiche les demandes de service d'un utilisateur (client ou prestataire)
 */
export const ServicesSection: React.FC<ServicesSectionProps> = ({
  userId,
  userName,
  userRole,
  isVisible = true,
}) => {
  // Hook selon le rôle
  const isProvider = userRole === "service_provider" || userRole === "provider";

  // Hook pour les demandes faites PAR l'utilisateur (en tant que client)
  const {
    data: clientRequests = [],
    isLoading: clientLoading,
    error: clientError,
  } = useUserServiceRequests(userId, {
    enabled: isVisible && !!userId && !isProvider,
  });

  // Hook pour les demandes où l'utilisateur est le PROVIDER
  const {
    data: providerRequests = [],
    isLoading: providerLoading,
    error: providerError,
  } = useUserProviderServiceRequests(userId, {
    enabled: isVisible && !!userId && isProvider,
  });

  const loading = clientLoading || providerLoading;
  const error = clientError || providerError;
  const serviceRequests = isProvider ? providerRequests : clientRequests;

  // Calculs des statistiques
  const roleStats = useMemo(() => {
    if (isProvider) {
      // Pour les prestataires : revenus générés
      const totalEarnings = serviceRequests
        .filter((r: any) => r.status === "completed")
        .reduce(
          (sum: number, request: any) => sum + (request.total_amount || 0),
          0
        );

      const completedRequests = serviceRequests.filter(
        (r: any) => r.status === "completed"
      ).length;

      return {
        primary: totalEarnings,
        primaryLabel: "Revenus générés",
        primaryIcon: Euro,
        secondary: completedRequests,
        secondaryLabel: "Services terminés",
      };
    } else {
      // Pour les clients : montant dépensé
      const totalSpent = serviceRequests
        .filter((r: any) => r.status === "completed")
        .reduce(
          (sum: number, request: any) => sum + (request.total_amount || 0),
          0
        );

      const completedRequests = serviceRequests.filter(
        (r: any) => r.status === "completed"
      ).length;

      return {
        primary: totalSpent,
        primaryLabel: "Total dépensé en services",
        primaryIcon: Euro,
        secondary: completedRequests,
        secondaryLabel: "Services reçus",
      };
    }
  }, [serviceRequests, isProvider]);

  // Fonctions utilitaires
  const getStatusColor = (status: string) => {
    switch (status?.toLowerCase()) {
      case "completed":
        return "success";
      case "pending":
      case "in_progress":
        return "warning";
      case "cancelled":
        return "error";
      default:
        return "default";
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("fr-FR");
  };

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat("fr-FR", {
      style: "currency",
      currency: "EUR",
    }).format(amount);
  };

  // États de chargement et d'erreur
  if (loading) {
    return (
      <Box sx={{ display: "flex", justifyContent: "center", p: 3 }}>
        <CircularProgress size={24} />
        <Typography variant="body2" sx={{ ml: 2 }}>
          Chargement des services...
        </Typography>
      </Box>
    );
  }

  if (error) {
    return (
      <Alert severity="error" sx={{ m: 2 }}>
        Erreur lors du chargement des services: {error.message}
      </Alert>
    );
  }

  return (
    <Box sx={{ mt: 2 }}>
      {/* En-tête de la section */}
      <Box sx={{ display: "flex", alignItems: "center", gap: 1, mb: 3 }}>
        <Build color="primary" />
        <Typography variant="h6" color="primary">
          {isProvider ? "Services fournis" : "Services demandés"} par {userName}
        </Typography>
        <Chip
          label={`${serviceRequests.length} demande${
            serviceRequests.length > 1 ? "s" : ""
          }`}
          size="small"
          color="primary"
          variant="outlined"
        />
      </Box>

      {/* Statistiques */}
      {roleStats && (
        <Grid container spacing={2} sx={{ mb: 3 }}>
          {/* Stat principale */}
          <Grid size={{ xs: 12, sm: 6, md: 4 }}>
            <Card variant="outlined" sx={{ height: "100%" }}>
              <CardContent>
                <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                  <roleStats.primaryIcon color="primary" />
                  <Typography variant="h6">
                    {formatCurrency(roleStats.primary)}
                  </Typography>
                </Box>
                <Typography variant="body2" color="text.secondary">
                  {roleStats.primaryLabel}
                </Typography>
              </CardContent>
            </Card>
          </Grid>

          {/* Total des demandes */}
          <Grid size={{ xs: 12, sm: 6, md: 4 }}>
            <Card variant="outlined" sx={{ height: "100%" }}>
              <CardContent>
                <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                  <Work color="info" />
                  <Typography variant="h6">{serviceRequests.length}</Typography>
                </Box>
                <Typography variant="body2" color="text.secondary">
                  {isProvider ? "Services fournis" : "Services demandés"}
                </Typography>
              </CardContent>
            </Card>
          </Grid>

          {/* Services terminés */}
          <Grid size={{ xs: 12, sm: 6, md: 4 }}>
            <Card variant="outlined" sx={{ height: "100%" }}>
              <CardContent>
                <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                  <CheckCircle color="success" />
                  <Typography variant="h6">{roleStats.secondary}</Typography>
                </Box>
                <Typography variant="body2" color="text.secondary">
                  {roleStats.secondaryLabel}
                </Typography>
              </CardContent>
            </Card>
          </Grid>
        </Grid>
      )}

      {/* Tableau des demandes de service */}
      {serviceRequests.length > 0 ? (
        <TableContainer component={Paper} variant="outlined">
          <Table size="small">
            <TableHead>
              <TableRow>
                <TableCell>Service</TableCell>
                <TableCell>{isProvider ? "Client" : "Prestataire"}</TableCell>
                <TableCell>Statut</TableCell>
                <TableCell>Montant</TableCell>
                <TableCell>Date</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {serviceRequests.slice(0, 5).map((request: any) => (
                <TableRow key={request.id} hover>
                  <TableCell>
                    <Typography variant="body2" fontWeight="medium">
                      {request.services?.name ||
                        request.service?.name ||
                        "Service inconnu"}
                    </Typography>
                    <Typography variant="caption" color="text.secondary">
                      {request.address || "Adresse non précisée"}
                    </Typography>
                  </TableCell>
                  <TableCell>
                    {isProvider ? (
                      // Pour les providers : afficher le client
                      <Typography variant="body2">
                        {request.profiles?.full_name || "Client inconnu"}
                      </Typography>
                    ) : (
                      // Pour les clients : afficher le provider
                      <Typography variant="body2">
                        {request.provider?.full_name || "En attente"}
                      </Typography>
                    )}
                  </TableCell>
                  <TableCell>
                    <Chip
                      label={request.status || "Unknown"}
                      color={getStatusColor(request.status)}
                      size="small"
                    />
                  </TableCell>
                  <TableCell>
                    <Typography variant="body2" fontWeight="medium">
                      {request.total_amount
                        ? formatCurrency(request.total_amount)
                        : "N/A"}
                    </Typography>
                  </TableCell>
                  <TableCell>
                    <Typography variant="caption" color="text.secondary">
                      {request.created_at
                        ? formatDate(request.created_at)
                        : "N/A"}
                    </Typography>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>

          {serviceRequests.length > 5 && (
            <Box sx={{ p: 2, textAlign: "center" }}>
              <Typography variant="caption" color="text.secondary">
                {serviceRequests.length - 5} demande(s) supplémentaire(s) non
                affichée(s)
              </Typography>
            </Box>
          )}
        </TableContainer>
      ) : (
        <Paper variant="outlined" sx={{ p: 3, textAlign: "center" }}>
          <Build sx={{ fontSize: 48, color: "text.disabled", mb: 2 }} />
          <Typography variant="body1" color="text.secondary">
            {isProvider ? "Aucun service fourni" : "Aucune demande de service"}
          </Typography>
        </Paper>
      )}
    </Box>
  );
};
