import React from "react";
import { Alert, Grid } from "@mui/material";
import { InfoCard, DashboardItem } from "@/shared/components/data-display";
import { PaymentStats } from "@/types/payments";
import { formatCurrency } from "@/shared/utils";
import { LABELS } from "@/core/config/labels";

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
  return (
    <>
      {/* Cartes de statistiques globales */}
      <PaymentStatsCards stats={stats} formatCurrency={formatCurrency} />

      {/* Message d'erreur */}
      {error && (
        <Alert severity="error" sx={{ mb: 2 }}>
          Erreur lors du chargement des paiements :{" "}
          {error instanceof Error
            ? error.message
            : LABELS.common.messages.unknownError}
        </Alert>
      )}
    </>
  );
};
