import React from "react";
import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
import AdminLayout from "../AdminLayout";
import { useDashboard } from "./hooks/useDashboard";
import {
  DashboardHeader,
  DashboardStatsCards,
  DashboardChartsSection,
  DashboardActivitiesSection,
  DashboardStatsSkeleton,
  DashboardChartsSkeleton,
  DashboardActivitiesSkeleton,
} from "./components";
import { LoadingIndicator } from "../shared";
import { LABELS } from "../../constants/labels";

function DashboardPage() {
  const {
    stats,
    recentActivityData,
    userGrowthData,
    loading,
    error,
    recentActivities,
    isFetching,
    refreshDashboard,
  } = useDashboard();

  // State pour déterminer si le dashboard est en cours de rafraîchissement
  const isRefreshing =
    isFetching.stats || isFetching.activities || isFetching.charts;

  if (error) {
    return (
      <AdminLayout>
        <Box p={3}>
          <Typography variant="h2" color="error">
            {LABELS.common.messages.error}
          </Typography>
          <Typography>{error}</Typography>
        </Box>
      </AdminLayout>
    );
  }

  return (
    <AdminLayout>
      {/* En-tête du dashboard */}
      <DashboardHeader
        onRefresh={refreshDashboard}
        isRefreshing={isRefreshing}
      />

      {/* Section des statistiques */}
      {loading ? (
        <DashboardStatsSkeleton />
      ) : (
        <DashboardStatsCards stats={stats} />
      )}

      {/* Section des graphiques */}
      {loading ? (
        <DashboardChartsSkeleton />
      ) : (
        <DashboardChartsSection
          recentActivityData={recentActivityData}
          userGrowthData={userGrowthData}
        />
      )}

      {/* Section des activités récentes */}
      {loading ? (
        <DashboardActivitiesSkeleton />
      ) : (
        <DashboardActivitiesSection activities={recentActivities} />
      )}

      {/* Indicateur de chargement pendant le rafraîchissement */}
      {isRefreshing && (
        <LoadingIndicator
          loadingText="Mise à jour des données..."
          withLayout={false}
          minHeight="50px"
        />
      )}
    </AdminLayout>
  );
}
export default DashboardPage;
