import React from "react";
import { Box, Grid } from "@mui/material";

import { AdminLayout } from "@/shared/components/layout";
import { DashboardItem, InfoCard } from "@/shared/components/data-display";
import { LoadingIndicator } from "@/shared/components/feedback";

// Hooks
import { useQuoteRequestStats } from "./hooks";

/**
 * QuoteRequestsPage Component - Version Debug Simple
 */
export const QuoteRequestsPageDebug: React.FC = () => {
  const {
    data: stats,
    isLoading: statsLoading,
    error: statsError,
  } = useQuoteRequestStats();

  console.log("📊 Stats in component:", { stats, statsLoading, statsError });

  if (statsLoading) {
    return (
      <AdminLayout>
        <LoadingIndicator />
      </AdminLayout>
    );
  }

  if (statsError) {
    return (
      <AdminLayout>
        <Box>
          <h2>Erreur Statistics</h2>
          <p>Erreur: {statsError.message}</p>
        </Box>
      </AdminLayout>
    );
  }

  return (
    <AdminLayout>
      {/* Page Header */}
      <Box>
        <h2>Demandes de devis (Debug)</h2>
        <p>Test basique des statistiques</p>
      </Box>

      {/* Statistics Cards Grid */}
      <Grid container spacing={3} sx={{ width: "100%", display: "flex" }}>
        <Grid
          size={{ xs: 12, sm: 6, md: 3 }}
          sx={{ display: "flex", flex: 1, minWidth: 0 }}
        >
          <DashboardItem>
            <InfoCard
              title="Total des demandes"
              value={stats?.totalRequests || 0}
              progressText="+170 this month"
              showTrending={false}
              progressTextColor="text.secondary"
            />
          </DashboardItem>
        </Grid>
        <Grid
          size={{ xs: 12, sm: 6, md: 3 }}
          sx={{ display: "flex", flex: 1, minWidth: 220 }}
        >
          <DashboardItem>
            <InfoCard
              title="Devis en attente"
              value={stats?.pendingRequests || 0}
              progressText="+95 this month"
              showTrending={false}
              progressTextColor="text.secondary"
            />
          </DashboardItem>
        </Grid>
        <Grid
          size={{ xs: 12, sm: 6, md: 3 }}
          sx={{ display: "flex", flex: 1, minWidth: 220 }}
        >
          <DashboardItem>
            <InfoCard
              title="Emplois actifs"
              value={stats?.inProgressRequests || 0}
              progressText="+15.3% from last month"
              showTrending={false}
              progressTextColor="text.secondary"
            />
          </DashboardItem>
        </Grid>
        <Grid
          size={{ xs: 12, sm: 6, md: 3 }}
          sx={{ display: "flex", flex: 1, minWidth: 220 }}
        >
          <DashboardItem>
            <InfoCard
              title="Taux d'achèvement"
              value={stats?.completedRequests || 0}
              progressText="-5 from yesterday"
              showTrending={false}
              progressTextColor="text.secondary"
            />
          </DashboardItem>
        </Grid>
      </Grid>

      {/* Debug Info */}
      <Box sx={{ mt: 2, p: 2, bgcolor: "grey.100", borderRadius: 1 }}>
        <h3>Debug Info:</h3>
        <pre>{JSON.stringify(stats, null, 2)}</pre>
      </Box>
    </AdminLayout>
  );
};

export default QuoteRequestsPageDebug;
