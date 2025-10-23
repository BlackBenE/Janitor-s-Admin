import React from "react";
import { Alert, Grid } from "@mui/material";
import InfoCard from "../../InfoCard";
import DashboardItem from "../../DashboardItem";
import { ServiceStats } from "../../../types/services";

interface ServicesStatsSectionProps {
  stats: ServiceStats;
  error?: Error | null;
}

const ServicesStatsCards: React.FC<{
  stats: ServiceStats;
  formatCurrency: (amount: number) => string;
}> = ({ stats, formatCurrency }) => {
  const {
    totalServices,
    activeServices,
    totalProviders,
    totalCategories,
    averagePrice,
  } = stats;

  const activePercentage =
    totalServices > 0 ? Math.round((activeServices / totalServices) * 100) : 0;

  return (
    <Grid container spacing={3} sx={{ width: "100%", display: "flex", mb: 3 }}>
      <Grid size={{ xs: 12, sm: 6, md: 3 }}>
        <DashboardItem>
          <InfoCard
            title="Total Services"
            value={totalServices}
            progressText={`${activeServices} actifs`}
            showTrending={false}
          />
        </DashboardItem>
      </Grid>

      <Grid size={{ xs: 12, sm: 6, md: 3 }}>
        <DashboardItem>
          <InfoCard
            title="Services Actifs"
            value={activeServices}
            progressText={`${activePercentage}% actifs`}
            showTrending={false}
          />
        </DashboardItem>
      </Grid>

      <Grid size={{ xs: 12, sm: 6, md: 3 }}>
        <DashboardItem>
          <InfoCard
            title="Prestataires"
            value={totalProviders}
            progressText="Total prestataires"
            showTrending={false}
          />
        </DashboardItem>
      </Grid>

      <Grid size={{ xs: 12, sm: 6, md: 3 }}>
        <DashboardItem>
          <InfoCard
            title="Prix Moyen"
            value={formatCurrency(averagePrice)}
            progressText={`${totalCategories} catégories`}
            showTrending={false}
          />
        </DashboardItem>
      </Grid>
    </Grid>
  );
};

export const ServicesStatsSection: React.FC<ServicesStatsSectionProps> = ({
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
      <ServicesStatsCards stats={stats} formatCurrency={formatCurrency} />

      {/* Message d'erreur */}
      {error && (
        <Alert severity="error" sx={{ mb: 2 }}>
          Erreur lors du chargement des services :{" "}
          {error instanceof Error ? error.message : "Unknown error"}
        </Alert>
      )}
    </>
  );
};
