import React, { useState } from "react";
import {
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
  Button,
  Alert,
} from "@mui/material";
import Grid from "@mui/material/Grid";
import {
  Payment,
  Subscriptions,
  CheckCircle,
  Cancel,
  Refresh,
} from "@mui/icons-material";
import { useUserSubscriptions } from "../hooks/useUserQueries";
import { useUserActions } from "../hooks/useUserActions";
import { formatCurrency, formatDate, getStatusColor } from "../../../utils";

interface SubscriptionSectionProps {
  userId: string;
  userRole: string;
}

const SubscriptionSection: React.FC<SubscriptionSectionProps> = ({
  userId,
  userRole,
}) => {
  const [renewalType, setRenewalType] = useState<"monthly" | "annual">(
    "annual"
  );

  const {
    data: subscriptions = [],
    isLoading: loading,
    refetch: refetchSubscriptions,
  } = useUserSubscriptions(userId, { enabled: !!userId });

  const { renewSubscription } = useUserActions();

  const handleRenewSubscription = async () => {
    try {
      // Trouver la première subscription active à renouveler
      const activeSubscription = subscriptions.find(
        (s) => s.status === "active"
      );
      if (!activeSubscription) return;

      const newPeriodEnd =
        renewalType === "annual"
          ? new Date(Date.now() + 365 * 24 * 60 * 60 * 1000).toISOString()
          : new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString();

      await renewSubscription.mutateAsync({
        subscriptionId: activeSubscription.id,
        newPeriodEnd,
        amount: renewalType === "annual" ? 100 : 10,
      });

      // Recharger les données avec React Query
      refetchSubscriptions();
    } catch (error) {
      console.error("Erreur lors du renouvellement:", error);
    }
  };

  const activeSubscription = subscriptions.find((s) => s.status === "active");
  const totalSpent = subscriptions.reduce((sum, sub) => sum + sub.amount, 0);

  if (loading) {
    return (
      <Box display="flex" justifyContent="center" p={4}>
        <CircularProgress />
      </Box>
    );
  }

  return (
    <Box>
      <Typography
        variant="h6"
        gutterBottom
        sx={{ display: "flex", alignItems: "center", gap: 1 }}
      >
        <Subscriptions />
        Abonnements
      </Typography>

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
                <Typography variant="h6">{subscriptions.length}</Typography>
              </Box>
              <Typography variant="body2" color="text.secondary">
                Nombre d'abonnements
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

      {/* Actions de renouvellement (seulement pour admin) */}
      {userRole === "admin" && activeSubscription && (
        <Card sx={{ mb: 3 }}>
          <CardContent>
            <Typography variant="h6" gutterBottom>
              Renouvellement d'abonnement
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
                startIcon={<Refresh />}
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
      )}

      {/* Liste des abonnements */}
      {subscriptions.length === 0 ? (
        <Alert severity="info">
          Aucun abonnement trouvé pour cet utilisateur.
        </Alert>
      ) : (
        <TableContainer component={Paper}>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell>ID</TableCell>
                <TableCell>Type</TableCell>
                <TableCell>Statut</TableCell>
                <TableCell>Date de début</TableCell>
                <TableCell>Date de fin</TableCell>
                <TableCell>Montant</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {subscriptions.map((subscription) => (
                <TableRow key={subscription.id}>
                  <TableCell>
                    <Typography variant="body2" fontFamily="monospace">
                      {subscription.id.slice(0, 8)}...
                    </Typography>
                  </TableCell>
                  <TableCell>
                    <Chip
                      label={subscription.type || "Standard"}
                      size="small"
                      variant="outlined"
                    />
                  </TableCell>
                  <TableCell>
                    <Chip
                      label={subscription.status}
                      color={getStatusColor(subscription.status, "subscription")}
                      size="small"
                    />
                  </TableCell>
                  <TableCell>
                    {subscription.period_start
                      ? formatDate(subscription.period_start)
                      : "-"}
                  </TableCell>
                  <TableCell>
                    {subscription.period_end
                      ? formatDate(subscription.period_end)
                      : "-"}
                  </TableCell>
                  <TableCell>
                    <Typography variant="body2" fontWeight="medium">
                      {formatCurrency(subscription.amount)}
                    </Typography>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      )}
    </Box>
  );
};

export default SubscriptionSection;
