import React, { useMemo } from "react";
import {
  Alert,
  Avatar,
  Box,
  Card,
  CardContent,
  Chip,
  CircularProgress,
  Divider,
  Grid,
  Paper,
  Skeleton,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Typography,
} from "@mui/material";
import {
  CalendarToday,
  Cancel,
  CheckCircle,
  Payment,
  Pending,
  Person,
  TrendingUp,
} from "@mui/icons-material";
import {
  useUserStatsIndividual,
  useUserBookings,
} from "../../hooks/useUserQueries";

interface BookingsSectionProps {
  userId: string;
  userName: string;
  userRole: string; // 'traveler' ou 'property_owner'
  isVisible?: boolean;
}

/**
 * 📅 Section Bookings pour UserDetailsModal
 * Affiche les statistiques et réservations d'un utilisateur
 */
export const BookingsSection: React.FC<BookingsSectionProps> = ({
  userId,
  userName,
  userRole,
  isVisible = true,
}) => {
  // Hooks pour les données - adaptés selon le rôle
  const {
    data: stats,
    isLoading: statsLoading,
    error: statsError,
  } = useUserStatsIndividual(userId, {
    enabled: isVisible && !!userId, // Maintenant activé pour tous les rôles
  });

  const {
    data: bookings = [],
    isLoading: bookingsLoading,
    error: bookingsError,
  } = useUserBookings(userId, { enabled: isVisible && !!userId });

  const loading = bookingsLoading || statsLoading;
  const error = statsError || bookingsError;

  // Calculs spécifiques selon le rôle - maintenant les hooks gèrent les bonnes données
  const calculateRoleSpecificStats = () => {
    if (!stats) return null;

    if (userRole === "property_owner") {
      // stats.totalSpent contient maintenant les revenus reçus (via payee_id)
      const totalReceived = stats.totalSpent || 0;

      // Calculer commission depuis les bookings
      const platformCommission = bookings.reduce(
        (sum, booking) => sum + (booking.commission_amount || 0),
        0
      );

      const netRevenue = totalReceived - platformCommission;

      return {
        primary: netRevenue,
        primaryLabel: "Revenus nets (après commission)",
        primaryIcon: Payment,
        secondary: platformCommission,
        secondaryLabel: "Commission plateforme",
      };
    } else {
      // Pour les travelers : totalSpent est correct (paiements effectués via payer_id)
      return {
        primary: stats.totalSpent,
        primaryLabel: "Total dépensé",
        primaryIcon: Payment,
        secondary: stats.averageBookingValue,
        secondaryLabel: "Valeur moyenne par réservation",
      };
    }
  };

  const roleStats = calculateRoleSpecificStats();

  // 🔍 Debug temporaire pour comprendre l'incohérence des données
  console.group("🔍 Debug BookingsSection - Incohérence des données");
  console.log("Stats from useUserStatsIndividual:", {
    totalSpent: stats?.totalSpent,
    totalBookings: stats?.totalBookings,
    averageBookingValue: stats?.averageBookingValue,
    completedBookings: stats?.completedBookings,
  });
  console.log("Bookings from useUserBookings:", {
    count: bookings.length,
    bookings: bookings.map((b) => ({
      id: b.id,
      total_amount: b.total_amount,
      status: b.status,
      payment_status: b.payment_status,
      property_title: b.properties?.title,
    })),
  });

  // Calcul manuel basé sur le tableau
  const manualTotal = bookings.reduce(
    (sum, booking) => sum + (booking.total_amount || 0),
    0
  );
  const completedBookingsFromTable = bookings.filter(
    (b) => b.status === "completed" || b.status === "confirmed"
  );
  const manualTotalCompleted = completedBookingsFromTable.reduce(
    (sum, booking) => sum + (booking.total_amount || 0),
    0
  );

  console.log("Calcul manuel depuis le tableau:", {
    manualTotal,
    manualTotalCompleted,
    completedBookingsCount: completedBookingsFromTable.length,
    manualAverage:
      completedBookingsFromTable.length > 0
        ? manualTotalCompleted / completedBookingsFromTable.length
        : 0,
  });
  console.groupEnd();

  // Fonctions utilitaires
  const getStatusColor = (status: string) => {
    switch (status?.toLowerCase()) {
      case "confirmed":
        return "success";
      case "pending":
        return "warning";
      case "cancelled":
        return "error";
      default:
        return "default";
    }
  };

  const getPaymentStatusColor = (status: string) => {
    switch (status?.toLowerCase()) {
      case "paid":
        return "success";
      case "pending":
        return "warning";
      case "failed":
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

  const getStatusIcon = (status: string) => {
    switch (status?.toLowerCase()) {
      case "confirmed":
        return <CheckCircle fontSize="small" />;
      case "pending":
        return <Pending fontSize="small" />;
      case "cancelled":
        return <Cancel fontSize="small" />;
      default:
        return null;
    }
  };

  // États de chargement et d'erreur
  if (loading) {
    return (
      <Box sx={{ display: "flex", justifyContent: "center", p: 3 }}>
        <CircularProgress size={24} />
        <Typography variant="body2" sx={{ ml: 2 }}>
          Chargement des réservations...
        </Typography>
      </Box>
    );
  }

  if (error) {
    return (
      <Alert severity="error" sx={{ m: 2 }}>
        Erreur lors du chargement des réservations: {error.message}
      </Alert>
    );
  }

  return (
    <Box sx={{ mt: 2 }}>
      {/* En-tête de la section */}
      <Box sx={{ display: "flex", alignItems: "center", gap: 1, mb: 3 }}>
        <CalendarToday color="primary" />
        <Typography variant="h6" color="primary">
          {userRole === "property_owner"
            ? "Propriétés & Réservations"
            : "Réservations"}{" "}
          de {userName}
        </Typography>
        <Chip
          label={`${bookings.length} réservation${
            bookings.length > 1 ? "s" : ""
          }`}
          size="small"
          color="primary"
          variant="outlined"
        />
      </Box>

      {/* Statistiques adaptées au rôle */}
      {stats && roleStats && (
        <Grid container spacing={2} sx={{ mb: 3 }}>
          {/* Stat principale (Revenus nets ou Total dépensé) */}
          <Grid size={{ xs: 12, sm: 6, md: 3 }}>
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

          {/* Réservations totales */}
          <Grid size={{ xs: 12, sm: 6, md: 3 }}>
            <Card variant="outlined" sx={{ height: "100%" }}>
              <CardContent>
                <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                  <CalendarToday color="success" />
                  <Typography variant="h6">{stats.totalBookings}</Typography>
                </Box>
                <Typography variant="body2" color="text.secondary">
                  Réservations totales
                </Typography>
              </CardContent>
            </Card>
          </Grid>

          {/* Réservations terminées */}
          <Grid size={{ xs: 12, sm: 6, md: 3 }}>
            <Card variant="outlined" sx={{ height: "100%" }}>
              <CardContent>
                <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                  <CheckCircle color="success" />
                  <Typography variant="h6">
                    {stats.completedBookings}
                  </Typography>
                </Box>
                <Typography variant="body2" color="text.secondary">
                  Terminées
                </Typography>
              </CardContent>
            </Card>
          </Grid>

          {/* Stat secondaire (Commission ou Valeur moyenne) */}
          <Grid size={{ xs: 12, sm: 6, md: 3 }}>
            <Card variant="outlined" sx={{ height: "100%" }}>
              <CardContent>
                <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                  <TrendingUp
                    color={userRole === "property_owner" ? "warning" : "info"}
                  />
                  <Typography variant="h6">
                    {formatCurrency(roleStats.secondary)}
                  </Typography>
                </Box>
                <Typography variant="body2" color="text.secondary">
                  {roleStats.secondaryLabel}
                </Typography>
              </CardContent>
            </Card>
          </Grid>
        </Grid>
      )}

      {/* Tableau des réservations */}
      {bookings.length > 0 ? (
        <TableContainer component={Paper} variant="outlined">
          <Table size="small">
            <TableHead>
              <TableRow>
                <TableCell>Propriété</TableCell>
                <TableCell>Dates</TableCell>
                <TableCell>Statut</TableCell>
                <TableCell>Montant</TableCell>
                <TableCell>Paiement</TableCell>
                <TableCell>Créée</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {bookings.slice(0, 5).map((booking: any) => (
                <TableRow key={booking.id} hover>
                  <TableCell>
                    <Typography variant="body2" fontWeight="medium">
                      {booking.properties?.title || "Propriété inconnue"}
                    </Typography>
                    <Typography variant="caption" color="text.secondary">
                      {booking.properties?.city}
                    </Typography>
                  </TableCell>
                  <TableCell>
                    <Typography variant="body2">
                      {booking.check_in && formatDate(booking.check_in)}
                      {booking.check_out && (
                        <> - {formatDate(booking.check_out)}</>
                      )}
                    </Typography>
                  </TableCell>
                  <TableCell>
                    <Chip
                      label={booking.status || "Unknown"}
                      color={getStatusColor(booking.status)}
                      size="small"
                    />
                  </TableCell>
                  <TableCell>
                    <Typography variant="body2" fontWeight="medium">
                      {booking.total_amount
                        ? formatCurrency(booking.total_amount)
                        : "N/A"}
                    </Typography>
                  </TableCell>
                  <TableCell>
                    <Chip
                      label={booking.payment_status || "N/A"}
                      color={getPaymentStatusColor(booking.payment_status)}
                      size="small"
                      variant="outlined"
                    />
                  </TableCell>
                  <TableCell>
                    <Typography variant="caption" color="text.secondary">
                      {formatDate(booking.created_at)}
                    </Typography>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>

          {bookings.length > 5 && (
            <Box sx={{ p: 2, textAlign: "center" }}>
              <Typography variant="caption" color="text.secondary">
                {bookings.length - 5} réservation(s) supplémentaire(s) non
                affichée(s)
              </Typography>
            </Box>
          )}
        </TableContainer>
      ) : (
        <Paper variant="outlined" sx={{ p: 3, textAlign: "center" }}>
          <CalendarToday sx={{ fontSize: 48, color: "text.disabled", mb: 2 }} />
          <Typography variant="body1" color="text.secondary">
            Aucune réservation trouvée
          </Typography>
        </Paper>
      )}
    </Box>
  );
};

export default BookingsSection;
