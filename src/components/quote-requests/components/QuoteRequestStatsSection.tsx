import React from "react";
import { Alert, Grid } from "@mui/material";
import InfoCard from "../../InfoCard";
import DashboardItem from "../../DashboardItem";
import { QuoteRequestStats } from "../../../types/quoteRequests";

interface QuoteRequestStatsSectionProps {
  stats: QuoteRequestStats;
  error?: Error | null;
  isLoading?: boolean;
}

const QuoteRequestStatsCards: React.FC<{
  stats: QuoteRequestStats;
  formatCurrency: (amount: number) => string;
}> = ({ stats, formatCurrency }) => {
  const {
    totalRequests,
    pendingRequests,
    inProgressRequests,
    completedRequests,
    totalRevenue,
    averageAmount,
  } = stats;

  const completedPercentage =
    totalRequests > 0
      ? Math.round((completedRequests / totalRequests) * 100)
      : 0;
  const pendingPercentage =
    totalRequests > 0 ? Math.round((pendingRequests / totalRequests) * 100) : 0;

  return (
    <Grid container spacing={3} sx={{ width: "100%", display: "flex", mb: 3 }}>
      <Grid size={{ xs: 12, sm: 6, md: 3 }}>
        <DashboardItem>
          <InfoCard
            title="Total des demandes"
            value={totalRequests}
            progressText={`${pendingRequests} en attente`}
            showTrending={false}
            progressTextColor="text.secondary"
          />
        </DashboardItem>
      </Grid>

      <Grid size={{ xs: 12, sm: 6, md: 3 }}>
        <DashboardItem>
          <InfoCard
            title="Devis en attente"
            value={pendingRequests}
            progressText={`${pendingPercentage}% du total`}
            showTrending={false}
            progressTextColor="warning.main"
          />
        </DashboardItem>
      </Grid>

      <Grid size={{ xs: 12, sm: 6, md: 3 }}>
        <DashboardItem>
          <InfoCard
            title="Emplois actifs"
            value={inProgressRequests}
            progressText="En cours"
            showTrending={false}
            progressTextColor="info.main"
          />
        </DashboardItem>
      </Grid>

      <Grid size={{ xs: 12, sm: 6, md: 3 }}>
        <DashboardItem>
          <InfoCard
            title="Taux d'achèvement"
            value={completedRequests}
            progressText={`${completedPercentage}% terminés`}
            showTrending={false}
            progressTextColor="success.main"
          />
        </DashboardItem>
      </Grid>

      {/* Deuxième ligne pour les stats financières */}
      <Grid size={{ xs: 12, sm: 6, md: 6 }}>
        <DashboardItem>
          <InfoCard
            title="Revenus totaux"
            value={formatCurrency(totalRevenue)}
            progressText="Demandes terminées"
            showTrending={false}
            progressTextColor="success.main"
          />
        </DashboardItem>
      </Grid>

      <Grid size={{ xs: 12, sm: 6, md: 6 }}>
        <DashboardItem>
          <InfoCard
            title="Montant moyen"
            value={formatCurrency(averageAmount)}
            progressText="Par demande"
            showTrending={false}
            progressTextColor="text.secondary"
          />
        </DashboardItem>
      </Grid>
    </Grid>
  );
};

export const QuoteRequestStatsSection: React.FC<
  QuoteRequestStatsSectionProps
> = ({ stats, error, isLoading = false }) => {
  const formatCurrency = (amount: number): string => {
    return new Intl.NumberFormat("fr-FR", {
      style: "currency",
      currency: "EUR",
    }).format(amount);
  };

  if (error) {
    return (
      <Alert severity="error" sx={{ mb: 3 }}>
        Erreur lors du chargement des statistiques: {error.message}
      </Alert>
    );
  }

  if (isLoading) {
    return (
      <Grid
        container
        spacing={3}
        sx={{ width: "100%", display: "flex", mb: 3 }}
      >
        {[...Array(4)].map((_, index) => (
          <Grid key={index} size={{ xs: 12, sm: 6, md: 3 }}>
            <DashboardItem>
              <InfoCard
                title="Chargement..."
                value="--"
                progressText="--"
                showTrending={false}
              />
            </DashboardItem>
          </Grid>
        ))}
      </Grid>
    );
  }

  return (
    <QuoteRequestStatsCards stats={stats} formatCurrency={formatCurrency} />
  );
};
