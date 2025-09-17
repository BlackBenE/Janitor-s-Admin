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
import AdminLayout from "../components/AdminLayout";
import MetricsSummary from "../components/MetricsSummary";
import AnalyticsChart from "../components/AnalyticsChart";
import { useAnalytics } from "../hooks/useAnalytics";

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

function AnalyticsPage() {
  const [tabValue, setTabValue] = useState(0);
  const [dateRange, setDateRange] = useState({
    from: new Date(new Date().setDate(new Date().getDate() - 30)),
    to: new Date(),
  });
  const [reportType, setReportType] = useState("overview");

  const { data, loading, error, refetch, exportAnalytics } =
    useAnalytics(dateRange);

  const handleExport = (format: "csv" | "pdf" | "excel") => {
    try {
      exportAnalytics(format);
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
          <Button onClick={refetch} sx={{ mt: 2 }}>
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
          {/* Header */}
          <Box sx={{ mb: 4 }}>
            <Typography variant="h4" component="h1" gutterBottom>
              Analytics & Reporting
            </Typography>
            <Typography variant="body1" color="text.secondary">
              Tableau de bord analytique avec métriques de performance et
              insights business
            </Typography>
          </Box>

          {/* Controls */}
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
                  <IconButton onClick={refetch} disabled={loading}>
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

          {/* Metrics Summary */}
          {data && (
            <Box sx={{ mb: 4 }}>
              <MetricsSummary
                userMetrics={data.userMetrics}
                revenueMetrics={data.revenueMetrics}
                activityMetrics={data.activityMetrics}
                loading={loading}
              />
            </Box>
          )}

          {/* Charts Tabs */}
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
                  data={data?.userGrowthData || []}
                  type="area"
                  dataKey="users"
                  xAxisKey="month"
                  height={350}
                  loading={loading}
                />

                <AnalyticsChart
                  title="Tendance des Réservations"
                  subtitle="Évolution quotidienne des réservations"
                  data={data?.bookingTrends.slice(-30) || []}
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
                  data={data?.topServices || []}
                  type="bar"
                  dataKey="bookings"
                  xAxisKey="name"
                  height={350}
                  loading={loading}
                />

                <AnalyticsChart
                  title="Revenus par Mois"
                  subtitle="Évolution mensuelle des revenus générés"
                  data={data?.userGrowthData || []}
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
                  data={data?.usersByRegion || []}
                  type="pie"
                  dataKey="users"
                  xAxisKey="region"
                  height={350}
                  loading={loading}
                />

                <AnalyticsChart
                  title="Revenus par Service"
                  subtitle="Contribution de chaque service au chiffre d'affaires"
                  data={data?.topServices || []}
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
}

export default AnalyticsPage;
