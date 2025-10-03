import React from "react";
import { Grid } from "@mui/material";
import InfoCard from "../../InfoCard";
import DashboardItem from "../../DashboardItem";

interface PaymentStatsCardsProps {
  stats: {
    totalPayments: number;
    paidPayments: number;
    pendingPayments: number;
    monthlyRevenue: number;
  };
  formatCurrency: (amount: number) => string;
}

export const PaymentStatsCards: React.FC<PaymentStatsCardsProps> = ({
  stats,
  formatCurrency,
}) => {
  return (
    <Grid container spacing={3} sx={{ width: "100%", display: "flex", mb: 3 }}>
      <Grid size={{ xs: 12, sm: 6, md: 3 }}>
        <DashboardItem>
          <InfoCard
            title="Total des paiements"
            value={stats.totalPayments}
            progressText="Tous paiements"
            showTrending={false}
          />
        </DashboardItem>
      </Grid>
      <Grid size={{ xs: 12, sm: 6, md: 3 }}>
        <DashboardItem>
          <InfoCard
            title="Paiements payés"
            value={stats.paidPayments}
            progressText={`${Math.round(
              (stats.paidPayments / stats.totalPayments) * 100
            )}% payés`}
            showTrending={false}
          />
        </DashboardItem>
      </Grid>
      <Grid size={{ xs: 12, sm: 6, md: 3 }}>
        <DashboardItem>
          <InfoCard
            title="En attente"
            value={stats.pendingPayments}
            progressText={`${Math.round(
              (stats.pendingPayments / stats.totalPayments) * 100
            )}% en attente`}
            showTrending={false}
          />
        </DashboardItem>
      </Grid>
      <Grid size={{ xs: 12, sm: 6, md: 3 }}>
        <DashboardItem>
          <InfoCard
            title="Revenus mensuels"
            value={formatCurrency(stats.monthlyRevenue)}
            progressText="Ce mois"
            showTrending={false}
          />
        </DashboardItem>
      </Grid>
    </Grid>
  );
};
