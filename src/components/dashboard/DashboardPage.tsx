import Box from "@mui/material/Box";
import Grid from "@mui/material/Grid";
import EuroOutlinedIcon from "@mui/icons-material/EuroOutlined";
import GroupOutlinedIcon from "@mui/icons-material/GroupOutlined";
import ApartmentOutlinedIcon from "@mui/icons-material/ApartmentOutlined";
import HowToRegOutlinedIcon from "@mui/icons-material/HowToRegOutlined";

import AdminLayout from "../AdminLayout";
import InfoCard from "../InfoCard";
import BarCharts from "../BarCharts";
import DashboardItem from "../DashboardItem";
import { useDashboard } from "../../hooks/dashboard/useDashboard";

function DashboardPage() {
  const {
    stats,
    recentActivityData,
    userGrowthData,
    chartSeries,
    loading,
    error,
  } = useDashboard();

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
      <Box>
        <h2>Dashboard Overview</h2>
        <p>
          Welcome back! Here&apos;s what&apos;s happening with your platform
          today.
        </p>
      </Box>

      <Box sx={{ display: "flex", flexWrap: "wrap", gap: 3 }}>
        <Box sx={{ flex: "1 1 220px" }}>
          <DashboardItem>
            <InfoCard
              title="Pending Property Validations"
              icon={ApartmentOutlinedIcon}
              value={stats.pendingValidations}
              bottomLeft="Total pending"
              showTrending={false}
            />
          </DashboardItem>
        </Box>

        <Box sx={{ flex: "1 1 220px" }}>
          <DashboardItem>
            <InfoCard
              title="Provider Moderation Cases"
              icon={HowToRegOutlinedIcon}
              value={stats.moderationCases}
              bottomLeft="To review"
              showTrending={false}
            />
          </DashboardItem>
        </Box>

        <Box sx={{ flex: "1 1 220px" }}>
          <DashboardItem>
            <InfoCard
              title="Active Users"
              icon={GroupOutlinedIcon}
              value={stats.activeUsers}
              bottomLeft="Last 30 days"
              showTrending={false}
            />
          </DashboardItem>
        </Box>

        <Box sx={{ flex: "1 1 220px" }}>
          <DashboardItem>
            <InfoCard
              title="Monthly Revenue"
              icon={EuroOutlinedIcon}
              value={`${stats.monthlyRevenue}€`}
              bottomLeft="This month"
              showTrending={false}
            />
          </DashboardItem>
        </Box>
      </Box>

      {/* Charts Section - EXACT comme l'original */}
      <Grid
        container
        spacing={2}
        sx={{ width: "100%", display: "flex", mb: 8 }}
      >
        <Grid
          size={{ xs: 12, sm: 6 }}
          sx={{ display: "flex", flex: 1, minWidth: 300 }}
        >
          <DashboardItem>
            <Box
              sx={{
                mt: 2,
                border: "1px solid #ddd",
                borderRadius: 4,
                p: 2,
                flex: 1,
                minWidth: 0,
                height: "100%",
                alignItems: "stretch",
              }}
            >
              <Box sx={{ mb: 2, width: "100%" }}>
                <h3>Recent Activity</h3>
                <p>Latest actions requiring your attention</p>
              </Box>
              <Box sx={{ width: "100%" }}>
                <BarCharts
                  dataset={recentActivityData}
                  xAxisKey="month"
                  series={chartSeries}
                />
              </Box>
            </Box>
          </DashboardItem>
        </Grid>
        <Grid
          size={{ xs: 12, sm: 6 }}
          sx={{ display: "flex", flex: 1, minWidth: 300 }}
        >
          <DashboardItem>
            <Box
              sx={{
                mt: 2,
                border: "1px solid #ddd",
                borderRadius: 4,
                p: 2,
                flex: 1,
                minWidth: 0,
                height: "100%",
                alignItems: "stretch",
              }}
            >
              <Box sx={{ mb: 2, width: "100%" }}>
                <h3>User Growth</h3>
                <p>Active user growth over time</p>
              </Box>
              <Box sx={{ width: "100%" }}>
                <BarCharts
                  dataset={userGrowthData}
                  xAxisKey="month"
                  series={chartSeries}
                />
              </Box>
            </Box>
          </DashboardItem>
        </Grid>
      </Grid>

      {/* Recent Activity Section - EXACT comme l'original */}
      <Box
        sx={{
          mt: 2,
          border: "1px solid #ddd",
          borderRadius: 4,
          p: 2,
          flex: 1,
          minWidth: 0,
          height: "40%",
          display: "flex",
          alignItems: "stretch",
        }}
      >
        <Box>
          <h3>Recent Activity</h3>
          <p>Latest actions requiring your attention</p>
        </Box>
      </Box>
    </AdminLayout>
  );
}
export default DashboardPage;
