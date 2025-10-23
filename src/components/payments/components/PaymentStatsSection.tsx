import React from "react";
import { Alert, Grid } from "@mui/material";
import InfoCard from "../../InfoCard";
import DashboardItem from "../../DashboardItem";
import { PaymentStats } from "../../../types/payments";

interface PaymentStatsSectionProps {
  stats: PaymentStats;
  error?: Error | null;
}

const PaymentStatsCards: React.FC<{
  stats: PaymentStats;
  formatCurrency: (amount: number) => string;
}> = ({ stats, formatCurrency }) => {
  // Utilisation des stats pré-calculées
  const { totalPayments, paidPayments, pendingPayments, monthlyRevenue } =
    stats;

  const paidPercentage =
    totalPayments > 0 ? Math.round((paidPayments / totalPayments) * 100) : 0;
  const pendingPercentage =
    totalPayments > 0 ? Math.round((pendingPayments / totalPayments) * 100) : 0;

  return (
    <Grid container spacing={3} sx={{ width: "100%", display: "flex", mb: 3 }}>
      <Grid size={{ xs: 12, sm: 6, md: 3 }}>
        <DashboardItem>
          <InfoCard
            title="Total des paiements"
            value={totalPayments}
            progressText="Tous paiements"
            showTrending={false}
          />
        </DashboardItem>
      </Grid>

      <Grid size={{ xs: 12, sm: 6, md: 3 }}>
        <DashboardItem>
          <InfoCard
            title="Payés & Réussis"
            value={paidPayments}
            progressText={`${paidPercentage}% terminés`}
            showTrending={false}
          />
        </DashboardItem>
      </Grid>

      <Grid size={{ xs: 12, sm: 6, md: 3 }}>
        <DashboardItem>
          <InfoCard
            title="En attente"
            value={pendingPayments}
            progressText={`${pendingPercentage}% à traiter`}
            showTrending={false}
          />
        </DashboardItem>
      </Grid>

      <Grid size={{ xs: 12, sm: 6, md: 3 }}>
        <DashboardItem>
          <InfoCard
            title="Revenus mensuels"
            value={formatCurrency(monthlyRevenue)}
            progressText="20% bookings + 100% subscriptions"
            showTrending={false}
          />
        </DashboardItem>
      </Grid>

      {stats.failedPayments > 0 && (
        <Grid size={{ xs: 12, sm: 6, md: 3 }}>
          <DashboardItem>
            <InfoCard
              title="Paiements échoués"
              value={stats.failedPayments}
              progressText={`${Math.round(
                (stats.failedPayments / totalPayments) * 100
              )}% échoués`}
              showTrending={false}
            />
          </DashboardItem>
        </Grid>
      )}
    </Grid>
  );
};

export const PaymentStatsSection: React.FC<PaymentStatsSectionProps> = ({
  stats,
  error,
}) => {
  // Helper function to format currency
  const formatCurrency = (amount: number): string => {
    return new Intl.NumberFormat("fr-FR", {
      style: "currency",
      currency: "EUR",
    }).format(amount);
  };

  return (
    <>
      {/* Cartes de statistiques globales */}
      <PaymentStatsCards stats={stats} formatCurrency={formatCurrency} />

      {/* Message d'erreur */}
      {error && (
        <Alert severity="error" sx={{ mb: 2 }}>
          Erreur lors du chargement des paiements :{" "}
          {error instanceof Error ? error.message : "Unknown error"}
        </Alert>
      )}
    </>
  );
};
