import React from "react";
import { Box, Paper, Tabs, Tab } from "@mui/material";
import { TrendingUp, Assessment, PieChart } from "@mui/icons-material";
import AnalyticsChart from "../../AnalyticsChart";

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

interface ChartData {
  userGrowth: any[];
  bookingTrends: any[];
  topServices: any[];
  bookingsByStatus: any[];
}

interface AnalyticsTabsSectionProps {
  tabValue: number;
  onTabChange: (event: React.SyntheticEvent, newValue: number) => void;
  chartData: ChartData;
  loading: boolean;
}

export const AnalyticsTabsSection: React.FC<AnalyticsTabsSectionProps> = ({
  tabValue,
  onTabChange,
  chartData,
  loading,
}) => {
  return (
    <Paper elevation={1}>
      <Tabs
        value={tabValue}
        onChange={onTabChange}
        variant="scrollable"
        scrollButtons="auto"
      >
        <Tab icon={<TrendingUp />} label="Tendances" iconPosition="start" />
        <Tab icon={<Assessment />} label="Performance" iconPosition="start" />
        <Tab icon={<PieChart />} label="Répartition" iconPosition="start" />
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
            subtitle="Évolution des inscriptions et revenus sur la période sélectionnée"
            data={chartData.userGrowth || []}
            type="area"
            dataKey="users"
            xAxisKey="month"
            height={350}
            loading={loading}
          />

          <AnalyticsChart
            title="Tendance des Réservations"
            subtitle="Évolution des réservations sur la période sélectionnée"
            data={chartData.bookingTrends || []}
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
            subtitle="Services les plus demandés sur la période sélectionnée"
            data={chartData.topServices || []}
            type="bar"
            dataKey="bookings"
            xAxisKey="name"
            height={350}
            loading={loading}
          />

          <AnalyticsChart
            title="Revenus par Mois"
            subtitle="Évolution des revenus sur la période sélectionnée"
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
            title="Réservations par Statut"
            subtitle="Répartition des réservations par statut sur la période sélectionnée"
            data={chartData.bookingsByStatus || []}
            type="pie"
            dataKey="count"
            xAxisKey="status"
            height={350}
            loading={loading}
          />

          <AnalyticsChart
            title="Revenus par Service"
            subtitle="Contribution des services sur la période sélectionnée"
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
  );
};
