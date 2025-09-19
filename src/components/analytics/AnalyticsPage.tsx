import React, { useState } from "react";
import {
  Box,
  Typography,
  Paper,
  Button,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Tabs,
  Tab,
  Tooltip,
  IconButton,
} from "@mui/material";
import {
  GetApp,
  Refresh,
  TrendingUp,
  Assessment,
  PieChart,
} from "@mui/icons-material";
import { DatePicker } from "@mui/x-date-pickers/DatePicker";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { AdapterDateFns } from "@mui/x-date-pickers/AdapterDateFns";
import { fr } from "date-fns/locale";
import AdminLayout from "../AdminLayout";
import MetricsSummary from "../MetricsSummary";
import AnalyticsChart from "../AnalyticsChart";
import { useAnalytics } from "../../hooks/analytics/useAnalytics";

interface TabPanelProps {
  children?: React.ReactNode;
  index: number;
  value: number;
}

function TabPanel({ children, value, index }: TabPanelProps) {
  return (
    <div
      role="tabpanel"
      hidden={value !== index}
      id={`analytics-tabpanel-${index}`}
      aria-labelledby={`analytics-tab-${index}`}
    >
      {value === index && <Box sx={{ py: 3 }}>{children}</Box>}
    </div>
  );
}

/**
 * Page Analytics - MÊME DESIGN que l'original, juste refactorisé
 */
export const AnalyticsPage: React.FC = () => {
  const [tabValue, setTabValue] = useState(0);
  const [dateRange, setDateRange] = useState({
    from: new Date(new Date().setDate(new Date().getDate() - 30)),
    to: new Date(),
  });
  const [reportType, setReportType] = useState("overview");

  const {
    data,
    loading,
    error,
    userMetrics,
    revenueMetrics,
    activityMetrics,
    chartData,
    exportData,
    refreshData,
  } = useAnalytics();

  const handleExport = (format: "csv" | "pdf" | "excel") => {
    try {
      exportData(format);
    } catch (error) {
      console.error("Export error:", error);
    }
  };

  const handleTabChange = (_: React.SyntheticEvent, newValue: number) => {
    setTabValue(newValue);
  };

  if (error) {
    return (
      <AdminLayout>
        <Box sx={{ p: 3 }}>
          <Typography color="error">
            Erreur lors du chargement des analytics: {error}
          </Typography>
          <Button onClick={refreshData} sx={{ mt: 2 }}>
            Réessayer
          </Button>
        </Box>
      </AdminLayout>
    );
  }

  return (
    <AdminLayout>
      <LocalizationProvider dateAdapter={AdapterDateFns} adapterLocale={fr}>
        <Box sx={{ p: 3 }}>
          {/* Header - EXACT comme l'original */}
          <Box sx={{ mb: 4 }}>
            <Typography variant="h4" component="h1" gutterBottom>
              Analytics & Reporting
            </Typography>
            <Typography variant="body1" color="text.secondary">
              Tableau de bord analytique avec métriques de performance et
              insights business
            </Typography>
          </Box>

          {/* Controls - MÊME structure que l'original */}
          <Paper elevation={1} sx={{ p: 3, mb: 3 }}>
            <Box
              sx={{
                display: "flex",
                gap: 2,
                alignItems: "center",
                flexWrap: "wrap",
              }}
            >
              <DatePicker
                label="Date de début"
                value={dateRange.from}
                onChange={(newValue: Date | null) =>
                  newValue &&
                  setDateRange((prev) => ({ ...prev, from: newValue }))
                }
                slotProps={{
                  textField: { size: "small", sx: { minWidth: 150 } },
                }}
              />

              <DatePicker
                label="Date de fin"
                value={dateRange.to}
                onChange={(newValue: Date | null) =>
                  newValue &&
                  setDateRange((prev) => ({ ...prev, to: newValue }))
                }
                slotProps={{
                  textField: { size: "small", sx: { minWidth: 150 } },
                }}
              />

              <FormControl size="small" sx={{ minWidth: 150 }}>
                <InputLabel>Type de rapport</InputLabel>
                <Select
                  value={reportType}
                  label="Type de rapport"
                  onChange={(e) => setReportType(e.target.value)}
                >
                  <MenuItem value="overview">Vue d&apos;ensemble</MenuItem>
                  <MenuItem value="users">Utilisateurs</MenuItem>
                  <MenuItem value="revenue">Revenus</MenuItem>
                  <MenuItem value="activity">Activité</MenuItem>
                </Select>
              </FormControl>

              <Box sx={{ ml: "auto", display: "flex", gap: 1 }}>
                <Tooltip title="Actualiser les données">
                  <IconButton onClick={refreshData} disabled={loading}>
                    <Refresh />
                  </IconButton>
                </Tooltip>

                <Button
                  variant="outlined"
                  size="small"
                  startIcon={<GetApp />}
                  onClick={() => handleExport("csv")}
                  disabled={loading || !data}
                >
                  CSV
                </Button>

                <Button
                  variant="outlined"
                  size="small"
                  startIcon={<GetApp />}
                  onClick={() => handleExport("excel")}
                  disabled={loading || !data}
                >
                  Excel
                </Button>

                <Button
                  variant="outlined"
                  size="small"
                  startIcon={<GetApp />}
                  onClick={() => handleExport("pdf")}
                  disabled={loading || !data}
                >
                  PDF
                </Button>
              </Box>
            </Box>
          </Paper>

          {/* Metrics Summary - EXACT comme l'original */}
          {data && (
            <Box sx={{ mb: 4 }}>
              <MetricsSummary
                userMetrics={{
                  totalUsers: userMetrics.totalUsers,
                  activeUsers: userMetrics.activeUsers,
                  newUsersThisMonth: userMetrics.newUsers,
                  retentionRate: 85, // Valeur fixe pour le moment
                  growthRate: userMetrics.userGrowthRate,
                }}
                revenueMetrics={{
                  totalRevenue: revenueMetrics.totalRevenue,
                  monthlyRevenue: revenueMetrics.monthlyRevenue,
                  averageOrderValue: revenueMetrics.averageOrderValue,
                  revenueGrowth: revenueMetrics.revenueGrowthRate,
                  vipSubscriptions: 125, // Valeur fixe pour le moment
                }}
                activityMetrics={{
                  totalBookings: activityMetrics.totalBookings,
                  monthlyBookings: 850, // Valeur fixe pour le moment
                  averageBookingsPerUser: 2.5, // Valeur fixe pour le moment
                  bookingGrowth: 15.2, // Valeur fixe pour le moment
                  cancelationRate:
                    (activityMetrics.cancelledBookings /
                      activityMetrics.totalBookings) *
                    100,
                }}
                loading={loading}
              />
            </Box>
          )}

          {/* Charts Tabs - MÊME structure que l'original */}
          <Paper elevation={1}>
            <Tabs
              value={tabValue}
              onChange={handleTabChange}
              variant="scrollable"
              scrollButtons="auto"
            >
              <Tab
                icon={<TrendingUp />}
                label="Tendances"
                iconPosition="start"
              />
              <Tab
                icon={<Assessment />}
                label="Performance"
                iconPosition="start"
              />
              <Tab
                icon={<PieChart />}
                label="Répartition"
                iconPosition="start"
              />
            </Tabs>

            <TabPanel value={tabValue} index={0}>
              <Box
                sx={{
                  display: "grid",
                  gridTemplateColumns: { xs: "1fr", lg: "1fr 1fr" },
                  gap: 3,
                }}
              >
                <AnalyticsChart
                  title="Croissance des Utilisateurs"
                  subtitle="Évolution mensuelle des inscriptions et revenus"
                  data={chartData.userGrowth || []}
                  type="area"
                  dataKey="users"
                  xAxisKey="month"
                  height={350}
                  loading={loading}
                />

                <AnalyticsChart
                  title="Tendance des Réservations"
                  subtitle="Évolution quotidienne des réservations"
                  data={chartData.bookingTrends.slice(-30) || []}
                  type="line"
                  dataKey="bookings"
                  xAxisKey="date"
                  height={350}
                  loading={loading}
                />
              </Box>
            </TabPanel>

            <TabPanel value={tabValue} index={1}>
              <Box
                sx={{
                  display: "grid",
                  gridTemplateColumns: { xs: "1fr", lg: "1fr 1fr" },
                  gap: 3,
                }}
              >
                <AnalyticsChart
                  title="Top Services"
                  subtitle="Services les plus demandés par nombre de réservations"
                  data={chartData.topServices || []}
                  type="bar"
                  dataKey="bookings"
                  xAxisKey="name"
                  height={350}
                  loading={loading}
                />

                <AnalyticsChart
                  title="Revenus par Mois"
                  subtitle="Évolution mensuelle des revenus générés"
                  data={chartData.userGrowth || []}
                  type="bar"
                  dataKey="revenue"
                  xAxisKey="month"
                  height={350}
                  loading={loading}
                />
              </Box>
            </TabPanel>

            <TabPanel value={tabValue} index={2}>
              <Box
                sx={{
                  display: "grid",
                  gridTemplateColumns: { xs: "1fr", lg: "1fr 1fr" },
                  gap: 3,
                }}
              >
                <AnalyticsChart
                  title="Utilisateurs par Région"
                  subtitle="Répartition géographique de la base utilisateurs"
                  data={chartData.usersByRegion || []}
                  type="pie"
                  dataKey="users"
                  xAxisKey="region"
                  height={350}
                  loading={loading}
                />

                <AnalyticsChart
                  title="Revenus par Service"
                  subtitle="Contribution de chaque service au chiffre d'affaires"
                  data={chartData.topServices || []}
                  type="pie"
                  dataKey="revenue"
                  xAxisKey="name"
                  height={350}
                  loading={loading}
                />
              </Box>
            </TabPanel>
          </Paper>
        </Box>
      </LocalizationProvider>
    </AdminLayout>
  );
};

export default AnalyticsPage;
