import React from "react";
import { Alert, Grid } from "@mui/material";
import { InfoCard, DashboardItem } from "@/shared/components/data-display";
import { QuoteRequestStats } from "@/types/quoteRequests";
import { formatCurrency } from "@/shared/utils";
import { LABELS } from "@/core/config/labels";

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
            title={LABELS.quoteRequests.stats.totalRequests}
            value={totalRequests}
            progressText={`${pendingRequests} ${LABELS.quoteRequests.stats.pendingCount}`}
            showTrending={false}
            progressTextColor="text.secondary"
          />
        </DashboardItem>
      </Grid>

      <Grid size={{ xs: 12, sm: 6, md: 3 }}>
        <DashboardItem>
          <InfoCard
            title={LABELS.quoteRequests.stats.pendingRequests}
            value={pendingRequests}
            progressText={`${pendingPercentage}% ${LABELS.quoteRequests.stats.ofTotal}`}
            showTrending={false}
            progressTextColor="warning.main"
          />
        </DashboardItem>
      </Grid>

      <Grid size={{ xs: 12, sm: 6, md: 3 }}>
        <DashboardItem>
          <InfoCard
            title={LABELS.quoteRequests.stats.inProgressJobs}
            value={inProgressRequests}
            progressText={LABELS.quoteRequests.stats.inProgress}
            showTrending={false}
            progressTextColor="info.main"
          />
        </DashboardItem>
      </Grid>

      <Grid size={{ xs: 12, sm: 6, md: 3 }}>
        <DashboardItem>
          <InfoCard
            title={LABELS.quoteRequests.stats.completionRate}
            value={completedRequests}
            progressText={`${completedPercentage}% ${LABELS.quoteRequests.stats.completed}`}
            showTrending={false}
            progressTextColor="success.main"
          />
        </DashboardItem>
      </Grid>

      {/* Deuxième ligne pour les stats financières */}
      <Grid size={{ xs: 12, sm: 6, md: 6 }}>
        <DashboardItem>
          <InfoCard
            title={LABELS.quoteRequests.stats.totalRevenue}
            value={formatCurrency(totalRevenue)}
            progressText={LABELS.quoteRequests.stats.completedRequests}
            showTrending={false}
            progressTextColor="success.main"
          />
        </DashboardItem>
      </Grid>

      <Grid size={{ xs: 12, sm: 6, md: 6 }}>
        <DashboardItem>
          <InfoCard
            title={LABELS.quoteRequests.stats.averageAmount}
            value={formatCurrency(averageAmount)}
            progressText={LABELS.quoteRequests.stats.perRequest}
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
  if (error) {
    return (
      <Alert severity="error" sx={{ mb: 3 }}>
        {LABELS.quoteRequests.messages.statsLoadError}: {error.message}
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
                title={LABELS.quoteRequests.stats.loading}
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
