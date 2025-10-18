import React from "react";
import Box from "@mui/material/Box";
import AdminLayout from "../AdminLayout";
import { useDashboard } from "./hooks/useDashboard";
import {
  DashboardHeader,
  DashboardStatsCards,
  DashboardChartsSection,
  DashboardActivitiesSection,
  DashboardLoadingIndicator,
  DashboardStatsSkeleton,
  DashboardChartsSkeleton,
  DashboardActivitiesSkeleton,
} from "./components";

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
          <h2>Error</h2>
          <p>{error}</p>
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
      <DashboardLoadingIndicator isRefreshing={isRefreshing} />
    </AdminLayout>
  );
}
export default DashboardPage;
