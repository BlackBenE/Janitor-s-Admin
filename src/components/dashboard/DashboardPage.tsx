import Box from "@mui/material/Box";
import AdminLayout from "../AdminLayout";
import { useDashboard } from "../../hooks/dashboard/useDashboard";
import DashboardItem from "../DashboardItem";
import InfoCard from "../InfoCard";
import { Typography } from "@mui/material";
import BarCharts from "../BarCharts";
import ActivityItem from "../ActivityItem";

import EuroOutlinedIcon from "@mui/icons-material/EuroOutlined";
import GroupOutlinedIcon from "@mui/icons-material/GroupOutlined";
import ApartmentOutlinedIcon from "@mui/icons-material/ApartmentOutlined";
import HowToRegOutlinedIcon from "@mui/icons-material/HowToRegOutlined";

// Fonction pour convertir les statuts de Supabase en statuts d'affichage
const mapStatusToDisplay = (
  status: string
): "Pending" | "Review Required" | "Completed" => {
  switch (status) {
    case "pending":
      return "Pending";
    case "approved":
    case "accepted":
      return "Completed";
    case "rejected":
    case "cancelled":
      return "Review Required";
    case "completed":
      return "Completed";
    default:
      return "Pending";
  }
};

function DashboardPage() {
  const {
    stats,
    recentActivityData,
    userGrowthData,
    chartSeries,
    loading,
    error,
    recentActivities,
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
      <Box
        sx={{
          mb: 8,
          width: "100%",
          display: "flex",
          flexWrap: "wrap",
          gap: 2,
        }}
      >
        {[
          {
            title: "Monthly Revenue",
            subtitle: "Revenue trends over the last 6 months",
            data: recentActivityData,
            label: "Revenue (€)",
          },
          {
            title: "User Growth",
            subtitle: "Active user growth over time",
            data: userGrowthData,
            label: "Active Users",
          },
        ].map((chart, index) => (
          <Box
            key={index}
            sx={{
              flex: {
                xs: "1 1 100%",
                sm: "1 1 calc(50% - 8px)",
              },
              display: "flex",
            }}
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
                  <Typography variant="h6">{chart.title}</Typography>
                  <Typography variant="body2" color="text.secondary">
                    {chart.subtitle}
                  </Typography>
                </Box>
                <Box sx={{ width: "100%" }}>
                  <BarCharts
                    dataset={chart.data}
                    xAxisKey="month"
                    series={[{ dataKey: "sales", label: chart.label }]}
                  />
                </Box>
              </Box>
            </DashboardItem>
          </Box>
        ))}
      </Box>

      {/* Recent Activity Section - EXACT comme l'original */}
      <Box
        sx={{
          mt: 2,
          border: "1px solid #ddd",
          borderRadius: 4,
          p: 2,
          flex: 1,
          minWidth: 0,
          display: "flex",
          flexDirection: "column",
        }}
      >
        <Box sx={{ mb: 2 }}>
          <Typography variant="h6">Recent Activity</Typography>
          <Typography variant="body2" color="text.secondary">
            Latest actions requiring your attention
          </Typography>
        </Box>
        <Box sx={{ display: "flex", flexDirection: "column" }}>
          {loading ? (
            <Typography>Loading activities...</Typography>
          ) : recentActivities && recentActivities.length > 0 ? (
            recentActivities.map((activity) => (
              <ActivityItem
                key={activity.id}
                status={mapStatusToDisplay(activity.status)}
                title={activity.title}
                description={activity.description}
                actionLabel={activity.actionLabel}
              />
            ))
          ) : (
            <Typography>No recent activities</Typography>
          )}
        </Box>
      </Box>
    </AdminLayout>
  );
}
export default DashboardPage;
