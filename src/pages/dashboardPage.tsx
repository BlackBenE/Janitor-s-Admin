import Box from "@mui/material/Box";
import Grid from "@mui/material/Grid";
import EuroOutlinedIcon from "@mui/icons-material/EuroOutlined";
import GroupOutlinedIcon from "@mui/icons-material/GroupOutlined";
import ApartmentOutlinedIcon from "@mui/icons-material/ApartmentOutlined";
import HowToRegOutlinedIcon from "@mui/icons-material/HowToRegOutlined";
import NotificationsIcon from "@mui/icons-material/Notifications";
import EmailIcon from "@mui/icons-material/Email";
import SmsIcon from "@mui/icons-material/Sms";
import CampaignIcon from "@mui/icons-material/Campaign";

import AdminLayout from "../components/AdminLayout";
import InfoCard from "../components/InfoCard";
import BarCharts from "../components/BarCharts";
import DashboardItem from "../components/DashboardItem";
import { useNotifications } from "../hooks/useNotifications";

function DashboardPage() {
  const { useNotificationStats } = useNotifications();
  const { data: notificationStats } = useNotificationStats();

  // Mock data pour les communications (en production, cela viendrait d'un hook)
  const communicationStats = {
    emailsSent: 1247,
    emailsThisWeek: 89,
    smsSent: 234,
    smsThisWeek: 12,
    campaignsActive: 3,
  };

  return (
    <AdminLayout>
      <Box>
        <h2>Dashboard Overview</h2>
        <p>
          Welcome back! Here`&apos;`s what`&apos;`s happening with your platform
          today.
        </p>
      </Box>
      <Grid container spacing={3} sx={{ width: "100%", display: "flex" }}>
        <Grid
          size={{ xs: 12, sm: 6, md: 3 }}
          sx={{ display: "flex", flex: 1, minWidth: 0 }}
        >
          <DashboardItem>
            <InfoCard
              title="Pending Property Validations"
              icon={ApartmentOutlinedIcon}
              value={1200}
              bottomLeft="Active this month"
              progressText="75% growth"
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
              title="Provider Moderation Cases"
              icon={HowToRegOutlinedIcon}
              value={1200}
              bottomLeft="Active this month"
              progressText="75% growth"
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
              title="Active Users"
              icon={GroupOutlinedIcon}
              value={1200}
              bottomLeft="Active this month"
              progressText="75% growth"
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
              title="Monthly Revenue"
              icon={EuroOutlinedIcon}
              value={1200}
              bottomLeft="Active this month"
              progressText="75% growth"
              showTrending={false}
              progressTextColor="text.secondary"
            />
          </DashboardItem>
        </Grid>
      </Grid>

      {/* Section Communications */}
      <Box sx={{ mt: 4, mb: 3 }}>
        <h2>Communications Overview</h2>
        <p>Monitor notifications, messages, and communication metrics</p>
      </Box>

      <Grid
        container
        spacing={3}
        sx={{ width: "100%", display: "flex", mb: 4 }}
      >
        <Grid
          size={{ xs: 12, sm: 6, md: 3 }}
          sx={{ display: "flex", flex: 1, minWidth: 0 }}
        >
          <DashboardItem>
            <InfoCard
              title="Total Notifications"
              icon={NotificationsIcon}
              value={notificationStats?.total || 0}
              bottomLeft={`${notificationStats?.unread || 0} non lues`}
              progressText={`${Math.round(
                ((notificationStats?.read || 0) /
                  (notificationStats?.total || 1)) *
                  100
              )}% lues`}
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
              title="Emails Envoyés"
              icon={EmailIcon}
              value={communicationStats.emailsSent}
              bottomLeft="Ce mois-ci"
              progressText={`+${communicationStats.emailsThisWeek} cette semaine`}
              showTrending={true}
              progressTextColor="success.main"
            />
          </DashboardItem>
        </Grid>

        <Grid
          size={{ xs: 12, sm: 6, md: 3 }}
          sx={{ display: "flex", flex: 1, minWidth: 220 }}
        >
          <DashboardItem>
            <InfoCard
              title="SMS Envoyés"
              icon={SmsIcon}
              value={communicationStats.smsSent}
              bottomLeft="Ce mois-ci"
              progressText={`+${communicationStats.smsThisWeek} cette semaine`}
              showTrending={true}
              progressTextColor="success.main"
            />
          </DashboardItem>
        </Grid>

        <Grid
          size={{ xs: 12, sm: 6, md: 3 }}
          sx={{ display: "flex", flex: 1, minWidth: 220 }}
        >
          <DashboardItem>
            <InfoCard
              title="Campagnes Actives"
              icon={CampaignIcon}
              value={communicationStats.campaignsActive}
              bottomLeft="En cours"
              progressText="3 programmées"
              showTrending={false}
              progressTextColor="info.main"
            />
          </DashboardItem>
        </Grid>
      </Grid>

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
                  dataset={[
                    { month: "Jan", sales: 4000 },
                    { month: "Feb", sales: 3000 },
                    { month: "Mar", sales: 5000 },
                    { month: "Apr", sales: 4000 },
                    { month: "May", sales: 3000 },
                    { month: "Jun", sales: 5000 },
                  ]}
                  xAxisKey="month"
                  series={[
                    {
                      dataKey: "sales",
                      label: "Monthly Sales",
                    },
                  ]}
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
                  dataset={[
                    { month: "Jan", sales: 4000 },
                    { month: "Feb", sales: 3000 },
                    { month: "Mar", sales: 5000 },
                    { month: "Apr", sales: 4000 },
                    { month: "May", sales: 3000 },
                    { month: "Jun", sales: 5000 },
                  ]}
                  xAxisKey="month"
                  series={[
                    {
                      dataKey: "sales",
                      label: "Monthly Sales",
                    },
                  ]}
                />
              </Box>
            </Box>
          </DashboardItem>
        </Grid>
      </Grid>
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
