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
  Grid,
  Card,
  CardContent,
} from "@mui/material";
import { CalendarToday, Payment, Star, TrendingUp } from "@mui/icons-material";
import { useBookings } from "../hooks/useBookings";
import { useUserAdditionalData } from "../hooks/useUserAdditionalData";

interface BookingsModalProps {
  open: boolean;
  onClose: () => void;
  userId: string;
  userName: string;
}

const BookingsModal: React.FC<BookingsModalProps> = ({
  open,
  onClose,
  userId,
  userName,
}) => {
  const [loading, setLoading] = useState(false);
  const [bookings, setBookings] = useState<any[]>([]);
  const [stats, setStats] = useState<any>(null);

  const { getUserBookings } = useBookings();
  const { getUserStats } = useUserAdditionalData();

  useEffect(() => {
    if (open && userId) {
      loadData();
    }
  }, [open, userId]);

  const loadData = async () => {
    setLoading(true);
    try {
      const [bookingsData, statsData] = await Promise.all([
        getUserBookings(userId),
        getUserStats(userId),
      ]);
      setBookings(bookingsData);
      setStats(statsData);
    } catch (error) {
      console.error("Erreur lors du chargement des données:", error);
    } finally {
      setLoading(false);
    }
  };

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

  return (
    <Dialog open={open} onClose={onClose} maxWidth="lg" fullWidth>
      <DialogTitle>
        <Box display="flex" alignItems="center" gap={2}>
          <CalendarToday />
          <Typography variant="h6">Réservations de {userName}</Typography>
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
            {stats && (
              <Grid container spacing={3} sx={{ mb: 3 }}>
                <Grid size={{ xs: 12, sm: 6, md: 3 }}>
                  <Card>
                    <CardContent>
                      <Box display="flex" alignItems="center" gap={1}>
                        <Payment color="primary" />
                        <Typography variant="h6">
                          {formatCurrency(stats.totalSpent)}
                        </Typography>
                      </Box>
                      <Typography variant="body2" color="text.secondary">
                        Total dépensé
                      </Typography>
                    </CardContent>
                  </Card>
                </Grid>

                <Grid size={{ xs: 12, sm: 6, md: 3 }}>
                  <Card>
                    <CardContent>
                      <Box display="flex" alignItems="center" gap={1}>
                        <CalendarToday color="primary" />
                        <Typography variant="h6">
                          {stats.totalPayments}
                        </Typography>
                      </Box>
                      <Typography variant="body2" color="text.secondary">
                        Réservations
                      </Typography>
                    </CardContent>
                  </Card>
                </Grid>

                <Grid size={{ xs: 12, sm: 6, md: 3 }}>
                  <Card>
                    <CardContent>
                      <Box display="flex" alignItems="center" gap={1}>
                        <Star color="primary" />
                        <Typography variant="h6">
                          {stats.averageRatingGiven}/5
                        </Typography>
                      </Box>
                      <Typography variant="body2" color="text.secondary">
                        Note moyenne donnée
                      </Typography>
                    </CardContent>
                  </Card>
                </Grid>

                <Grid size={{ xs: 12, sm: 6, md: 3 }}>
                  <Card>
                    <CardContent>
                      <Box display="flex" alignItems="center" gap={1}>
                        <TrendingUp color="primary" />
                        <Typography variant="h6">
                          {stats.reviewsGiven}
                        </Typography>
                      </Box>
                      <Typography variant="body2" color="text.secondary">
                        Avis donnés
                      </Typography>
                    </CardContent>
                  </Card>
                </Grid>
              </Grid>
            )}

            {/* Liste des réservations */}
            <Typography variant="h6" gutterBottom>
              Historique des réservations ({bookings.length})
            </Typography>

            {bookings.length === 0 ? (
              <Typography
                color="text.secondary"
                sx={{ textAlign: "center", py: 4 }}
              >
                Aucune réservation trouvée
              </Typography>
            ) : (
              <TableContainer component={Paper}>
                <Table>
                  <TableHead>
                    <TableRow>
                      <TableCell>Propriété</TableCell>
                      <TableCell>Dates</TableCell>
                      <TableCell>Montant</TableCell>
                      <TableCell>Statut</TableCell>
                      <TableCell>Paiement</TableCell>
                      <TableCell>Commission</TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {bookings.map((booking) => (
                      <TableRow key={booking.id}>
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
                            {formatDate(booking.check_in)} -{" "}
                            {formatDate(booking.check_out)}
                          </Typography>
                        </TableCell>
                        <TableCell>
                          <Typography variant="body2" fontWeight="medium">
                            {formatCurrency(booking.total_amount)}
                          </Typography>
                        </TableCell>
                        <TableCell>
                          <Chip
                            label={booking.status || "Inconnu"}
                            color={getStatusColor(booking.status)}
                            size="small"
                          />
                        </TableCell>
                        <TableCell>
                          <Chip
                            label={booking.payment_status || "Inconnu"}
                            color={getPaymentStatusColor(
                              booking.payment_status
                            )}
                            size="small"
                          />
                        </TableCell>
                        <TableCell>
                          <Typography variant="body2">
                            {formatCurrency(booking.commission_amount)}
                          </Typography>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </TableContainer>
            )}
          </>
        )}
      </DialogContent>

      <DialogActions>
        <Button onClick={onClose}>Fermer</Button>
      </DialogActions>
    </Dialog>
  );
};

export default BookingsModal;
