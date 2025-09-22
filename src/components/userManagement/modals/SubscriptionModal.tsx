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
  Select,
  MenuItem,
  FormControl,
  InputLabel,
} from "@mui/material";
import Grid from "@mui/material/Grid";
import {
  Payment,
  Subscriptions,
  CheckCircle,
  Cancel,
} from "@mui/icons-material";
import { useSubscriptions } from "../hooks/useSubscriptions";
import {
  SubscriptionModalProps,
  Subscription,
} from "../../../types/userManagement";

const SubscriptionModal: React.FC<SubscriptionModalProps> = ({
  open,
  onClose,
  userId,
  userName,
}) => {
  const [loading, setLoading] = useState(false);
  const [subscriptions, setSubscriptions] = useState<any[]>([]);
  const [renewalType, setRenewalType] = useState<"monthly" | "annual">(
    "annual"
  );

  const { getUserSubscriptions, renewSubscription } = useSubscriptions();

  useEffect(() => {
    if (open && userId) {
      loadSubscriptions();
    }
  }, [open, userId]);

  const loadSubscriptions = async () => {
    setLoading(true);
    try {
      const subscriptionsData = await getUserSubscriptions(userId);
      setSubscriptions(subscriptionsData);
    } catch (error) {
      console.error("Erreur lors du chargement des abonnements:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleRenewSubscription = async () => {
    try {
      await renewSubscription.mutateAsync({
        userId,
        subscriptionType: renewalType,
        amount: renewalType === "annual" ? 100 : 10,
      });

      // Recharger les données
      loadSubscriptions();
    } catch (error) {
      console.error("Erreur lors du renouvellement:", error);
    }
  };

  const getStatusColor = (status: string) => {
    switch (status?.toLowerCase()) {
      case "active":
        return "success";
      case "expired":
        return "error";
      case "pending":
        return "warning";
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

  const activeSubscription = subscriptions.find((s) => s.status === "active");
  const totalSpent = subscriptions.reduce((sum, sub) => sum + sub.amount, 0);

  return (
    <Dialog open={open} onClose={onClose} maxWidth="md" fullWidth>
      <DialogTitle>
        <Box display="flex" alignItems="center" gap={2}>
          <Subscriptions />
          <Typography variant="h6">Abonnements de {userName}</Typography>
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
              <Grid size={{ xs: 12, sm: 6, md: 4 }}>
                <Card>
                  <CardContent>
                    <Box display="flex" alignItems="center" gap={1}>
                      <Payment color="primary" />
                      <Typography variant="h6">
                        {formatCurrency(totalSpent)}
                      </Typography>
                    </Box>
                    <Typography variant="body2" color="text.secondary">
                      Total dépensé en abonnements
                    </Typography>
                  </CardContent>
                </Card>
              </Grid>

              <Grid size={{ xs: 12, sm: 6, md: 4 }}>
                <Card>
                  <CardContent>
                    <Box display="flex" alignItems="center" gap={1}>
                      <Subscriptions color="primary" />
                      <Typography variant="h6">
                        {subscriptions.length}
                      </Typography>
                    </Box>
                    <Typography variant="body2" color="text.secondary">
                      Abonnements au total
                    </Typography>
                  </CardContent>
                </Card>
              </Grid>

              <Grid size={{ xs: 12, sm: 6, md: 4 }}>
                <Card>
                  <CardContent>
                    <Box display="flex" alignItems="center" gap={1}>
                      {activeSubscription ? (
                        <CheckCircle color="success" />
                      ) : (
                        <Cancel color="error" />
                      )}
                      <Typography variant="h6">
                        {activeSubscription ? "Actif" : "Inactif"}
                      </Typography>
                    </Box>
                    <Typography variant="body2" color="text.secondary">
                      Statut actuel
                    </Typography>
                  </CardContent>
                </Card>
              </Grid>
            </Grid>

            {/* Actions de renouvellement */}
            <Card sx={{ mb: 3 }}>
              <CardContent>
                <Typography variant="h6" gutterBottom>
                  Renouveler l'abonnement
                </Typography>
                <Box display="flex" gap={2} alignItems="center">
                  <FormControl size="small" sx={{ minWidth: 120 }}>
                    <InputLabel>Type</InputLabel>
                    <Select
                      value={renewalType}
                      label="Type"
                      onChange={(e) =>
                        setRenewalType(e.target.value as "monthly" | "annual")
                      }
                    >
                      <MenuItem value="monthly">Mensuel (10€)</MenuItem>
                      <MenuItem value="annual">Annuel (100€)</MenuItem>
                    </Select>
                  </FormControl>
                  <Button
                    variant="contained"
                    onClick={handleRenewSubscription}
                    disabled={renewSubscription.isPending}
                  >
                    {renewSubscription.isPending
                      ? "Renouvellement..."
                      : "Renouveler"}
                  </Button>
                </Box>
              </CardContent>
            </Card>

            {/* Historique des abonnements */}
            <Typography variant="h6" gutterBottom>
              Historique des abonnements ({subscriptions.length})
            </Typography>

            {subscriptions.length === 0 ? (
              <Typography
                color="text.secondary"
                sx={{ textAlign: "center", py: 4 }}
              >
                Aucun abonnement trouvé
              </Typography>
            ) : (
              <TableContainer component={Paper}>
                <Table>
                  <TableHead>
                    <TableRow>
                      <TableCell>Type</TableCell>
                      <TableCell>Montant</TableCell>
                      <TableCell>Période</TableCell>
                      <TableCell>Statut</TableCell>
                      <TableCell>Stripe ID</TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {subscriptions.map((subscription) => (
                      <TableRow key={subscription.id}>
                        <TableCell>
                          <Typography variant="body2" fontWeight="medium">
                            {subscription.subscription_type}
                          </Typography>
                        </TableCell>
                        <TableCell>
                          <Typography variant="body2" fontWeight="medium">
                            {formatCurrency(subscription.amount)}
                          </Typography>
                        </TableCell>
                        <TableCell>
                          <Typography variant="body2">
                            {formatDate(subscription.current_period_start)} -{" "}
                            {formatDate(subscription.current_period_end)}
                          </Typography>
                        </TableCell>
                        <TableCell>
                          <Chip
                            label={subscription.status || "Inconnu"}
                            color={getStatusColor(subscription.status)}
                            size="small"
                          />
                        </TableCell>
                        <TableCell>
                          <Typography variant="caption">
                            {subscription.stripe_subscription_id || "N/A"}
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

export default SubscriptionModal;
