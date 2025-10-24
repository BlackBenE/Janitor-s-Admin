import React from "react";
import {
  Box,
  Paper,
  Typography,
  Chip,
  useTheme,
  CircularProgress,
} from "@mui/material";
import {
  TrendingUp,
  TrendingDown,
  TrendingFlat,
  People,
  AttachMoney,
  EventNote,
} from "@mui/icons-material";

interface MetricCardProps {
  title: string;
  value: string | number;
  change?: number;
  changeLabel?: string;
  icon?: React.ReactNode;
  loading?: boolean;
  format?: "number" | "currency" | "percentage";
  color?: "primary" | "secondary" | "success" | "warning" | "error";
}

const MetricCard: React.FC<MetricCardProps> = ({
  title,
  value,
  change,
  changeLabel,
  icon,
  loading = false,
  format = "number",
  color = "primary",
}) => {
  const theme = useTheme();

  const formatValue = (val: string | number): string => {
    if (typeof val === "string") return val;

    switch (format) {
      case "currency":
        return new Intl.NumberFormat("fr-FR", {
          style: "currency",
          currency: "EUR",
        }).format(val);
      case "percentage":
        return `${val.toFixed(1)}%`;
      default:
        return new Intl.NumberFormat("fr-FR").format(val);
    }
  };

  const getTrendIcon = (): React.ReactElement | undefined => {
    if (change === undefined) return undefined;
    if (change > 0) return <TrendingUp fontSize="small" />;
    if (change < 0) return <TrendingDown fontSize="small" />;
    return <TrendingFlat fontSize="small" />;
  };

  const getTrendColor = () => {
    if (change === undefined) return "default";
    if (change > 0) return "success";
    if (change < 0) return "error";
    return "default";
  };

  if (loading) {
    return (
      <Paper
        elevation={2}
        sx={{
          p: 3,
          height: "100%",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
        }}
      >
        <CircularProgress size={40} />
      </Paper>
    );
  }

  return (
    <Paper
      elevation={2}
      sx={{
        p: 3,
        height: "100%",
        transition: "all 0.3s ease",
        "&:hover": {
          elevation: 4,
          transform: "translateY(-2px)",
        },
      }}
    >
      <Box
        display="flex"
        alignItems="flex-start"
        justifyContent="space-between"
        mb={2}
      >
        <Typography
          variant="body2"
          color="text.secondary"
          sx={{ fontWeight: 500 }}
        >
          {title}
        </Typography>
        {icon && (
          <Box
            sx={{
              color: theme.palette[color].main,
              opacity: 0.7,
            }}
          >
            {icon}
          </Box>
        )}
      </Box>

      <Typography
        variant="h4"
        component="div"
        sx={{
          fontWeight: 700,
          color: theme.palette.text.primary,
          mb: 1,
        }}
      >
        {formatValue(value)}
      </Typography>

      {change !== undefined && (
        <Box display="flex" alignItems="center" gap={1}>
          <Chip
            icon={getTrendIcon()}
            label={`${change > 0 ? "+" : ""}${change.toFixed(1)}%`}
            size="small"
            color={getTrendColor()}
            variant="outlined"
            sx={{ fontSize: "0.75rem" }}
          />
          {changeLabel && (
            <Typography variant="caption" color="text.secondary">
              {changeLabel}
            </Typography>
          )}
        </Box>
      )}
    </Paper>
  );
};

interface MetricsSummarySimplifiedProps {
  userMetrics: {
    totalUsers: number;
    activeUsers: number;
    newUsers: number;
    growthRate: number;
  };
  revenueMetrics: {
    totalRevenue: number;
    monthlyRevenue: number;
    averageOrderValue: number;
    revenueGrowthRate: number;
  };
  activityMetrics: {
    totalBookings: number;
    completedBookings: number;
    cancelledBookings: number;
    activeServices: number;
    activeUsersGrowthRate?: number;
    bookingsGrowthRate?: number;
    cancellationRateChange?: number;
    currentCancellationRate?: number;
  };
  loading?: boolean;
}

/**
 * Version simplifiée avec seulement les 6 métriques essentielles
 */
const MetricsSummarySimplified: React.FC<MetricsSummarySimplifiedProps> = ({
  userMetrics,
  revenueMetrics,
  activityMetrics,
  loading = false,
}) => {
  const cancelationRate =
    activityMetrics.totalBookings > 0
      ? (activityMetrics.cancelledBookings / activityMetrics.totalBookings) *
        100
      : 0;

  return (
    <Box
      sx={{
        display: "grid",
        gridTemplateColumns: "repeat(auto-fit, minmax(280px, 1fr))",
        gap: 3,
        mb: 4,
      }}
    >
      {/* KPIs Essentiels */}
      <MetricCard
        title="Utilisateurs Total"
        value={userMetrics.totalUsers}
        change={userMetrics.growthRate}
        changeLabel="croissance"
        icon={<People />}
        loading={loading}
        color="primary"
      />

      <MetricCard
        title="Utilisateurs Actifs"
        value={userMetrics.activeUsers}
        change={activityMetrics.activeUsersGrowthRate}
        changeLabel="vs période précédente"
        icon={<People />}
        loading={loading}
        color="success"
      />

      <MetricCard
        title="Revenus Total"
        value={revenueMetrics.totalRevenue}
        change={revenueMetrics.revenueGrowthRate}
        changeLabel="croissance"
        icon={<AttachMoney />}
        loading={loading}
        format="currency"
        color="success"
      />

      <MetricCard
        title="Revenus Mensuels"
        value={revenueMetrics.monthlyRevenue}
        change={revenueMetrics.revenueGrowthRate}
        changeLabel="vs période précédente"
        icon={<AttachMoney />}
        loading={loading}
        format="currency"
        color="primary"
      />

      <MetricCard
        title="Réservations Total"
        value={activityMetrics.totalBookings}
        change={activityMetrics.bookingsGrowthRate}
        changeLabel="croissance"
        icon={<EventNote />}
        loading={loading}
        color="primary"
      />

      <MetricCard
        title="Taux d'Annulation"
        value={activityMetrics.currentCancellationRate || cancelationRate}
        change={activityMetrics.cancellationRateChange}
        changeLabel="évolution"
        icon={<EventNote />}
        loading={loading}
        format="percentage"
        color="error"
      />
    </Box>
  );
};

export default MetricsSummarySimplified;
