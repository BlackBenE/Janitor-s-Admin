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
  Star,
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

interface MetricsSummaryProps {
  userMetrics: {
    totalUsers: number;
    activeUsers: number;
    newUsersThisMonth: number;
    retentionRate: number;
    growthRate: number;
  };
  revenueMetrics: {
    totalRevenue: number;
    monthlyRevenue: number;
    averageOrderValue: number;
    revenueGrowth: number;
    vipSubscriptions: number;
  };
  activityMetrics: {
    totalBookings: number;
    monthlyBookings: number;
    averageBookingsPerUser: number;
    bookingGrowth: number;
    cancelationRate: number;
  };
  loading?: boolean;
}

const MetricsSummary: React.FC<MetricsSummaryProps> = ({
  userMetrics,
  revenueMetrics,
  activityMetrics,
  loading = false,
}) => {
  return (
    <Box
      sx={{
        display: "grid",
        gridTemplateColumns: "repeat(auto-fit, minmax(280px, 1fr))",
        gap: 3,
      }}
    >
      {/* Métriques Utilisateurs */}
      <MetricCard
        title="Total Utilisateurs"
        value={userMetrics.totalUsers}
        change={userMetrics.growthRate}
        changeLabel="ce mois"
        icon={<People />}
        loading={loading}
        color="primary"
      />

      <MetricCard
        title="Utilisateurs Actifs"
        value={userMetrics.activeUsers}
        change={8.5}
        changeLabel="vs mois dernier"
        icon={<People />}
        loading={loading}
        color="success"
      />

      <MetricCard
        title="Nouveaux Utilisateurs"
        value={userMetrics.newUsersThisMonth}
        change={userMetrics.growthRate}
        changeLabel="ce mois"
        icon={<People />}
        loading={loading}
        color="secondary"
      />

      <MetricCard
        title="Taux de Rétention"
        value={userMetrics.retentionRate}
        change={2.3}
        changeLabel="amélioration"
        icon={<Star />}
        loading={loading}
        format="percentage"
        color="warning"
      />

      {/* Métriques Revenus */}
      <MetricCard
        title="Revenus Total"
        value={revenueMetrics.totalRevenue}
        change={revenueMetrics.revenueGrowth}
        changeLabel="croissance"
        icon={<AttachMoney />}
        loading={loading}
        format="currency"
        color="success"
      />

      <MetricCard
        title="Revenus Mensuels"
        value={revenueMetrics.monthlyRevenue}
        change={revenueMetrics.revenueGrowth}
        changeLabel="vs mois dernier"
        icon={<AttachMoney />}
        loading={loading}
        format="currency"
        color="primary"
      />

      <MetricCard
        title="Panier Moyen"
        value={revenueMetrics.averageOrderValue}
        change={3.2}
        changeLabel="amélioration"
        icon={<AttachMoney />}
        loading={loading}
        format="currency"
        color="secondary"
      />

      <MetricCard
        title="Abonnements VIP"
        value={revenueMetrics.vipSubscriptions}
        change={18.7}
        changeLabel="nouveaux ce mois"
        icon={<Star />}
        loading={loading}
        color="warning"
      />

      {/* Métriques Activité */}
      <MetricCard
        title="Total Réservations"
        value={activityMetrics.totalBookings}
        change={activityMetrics.bookingGrowth}
        changeLabel="croissance"
        icon={<EventNote />}
        loading={loading}
        color="primary"
      />

      <MetricCard
        title="Réservations Mensuelles"
        value={activityMetrics.monthlyBookings}
        change={activityMetrics.bookingGrowth}
        changeLabel="vs mois dernier"
        icon={<EventNote />}
        loading={loading}
        color="success"
      />

      <MetricCard
        title="Réservations/Utilisateur"
        value={activityMetrics.averageBookingsPerUser.toFixed(1)}
        change={5.8}
        changeLabel="amélioration"
        icon={<EventNote />}
        loading={loading}
        color="secondary"
      />

      <MetricCard
        title="Taux d'Annulation"
        value={activityMetrics.cancelationRate}
        change={-1.2}
        changeLabel="amélioration"
        icon={<EventNote />}
        loading={loading}
        format="percentage"
        color="error"
      />
    </Box>
  );
};

export default MetricsSummary;
