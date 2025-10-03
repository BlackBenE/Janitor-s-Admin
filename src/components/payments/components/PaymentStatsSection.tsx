import React from "react";
import { Alert, Grid } from "@mui/material";
import InfoCard from "../../InfoCard";
import DashboardItem from "../../DashboardItem";
import { PaymentWithDetails } from "../../../types/payments";

interface PaymentStatsSectionProps {
  allPayments: PaymentWithDetails[];
  error?: Error | null;
}

const PaymentStatsCards: React.FC<{
  payments: PaymentWithDetails[];
  formatCurrency: (amount: number) => string;
}> = ({ payments, formatCurrency }) => {
  // Calcul des statistiques
  const totalPayments = payments.length;
  const paidPayments = payments.filter((p) => p.status === "paid").length;
  const pendingPayments = payments.filter((p) => p.status === "pending").length;
  const failedPayments = payments.filter((p) => p.status === "failed").length;

  const monthlyRevenue = payments
    .filter((p) => p.status === "paid")
    .reduce((sum, p) => sum + (p.amount || 0), 0);

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
            title="Paiements payés"
            value={paidPayments}
            progressText={`${paidPercentage}% payés`}
            showTrending={false}
          />
        </DashboardItem>
      </Grid>

      <Grid size={{ xs: 12, sm: 6, md: 3 }}>
        <DashboardItem>
          <InfoCard
            title="En attente"
            value={pendingPayments}
            progressText={`${pendingPercentage}% en attente`}
            showTrending={false}
          />
        </DashboardItem>
      </Grid>

      <Grid size={{ xs: 12, sm: 6, md: 3 }}>
        <DashboardItem>
          <InfoCard
            title="Revenus mensuels"
            value={formatCurrency(monthlyRevenue)}
            progressText="Ce mois"
            showTrending={false}
          />
        </DashboardItem>
      </Grid>
    </Grid>
  );
};

export const PaymentStatsSection: React.FC<PaymentStatsSectionProps> = ({
  allPayments,
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
      <PaymentStatsCards
        payments={allPayments}
        formatCurrency={formatCurrency}
      />

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
