import Box from "@mui/material/Box";
import Grid from "@mui/material/Grid";
import EuroOutlinedIcon from "@mui/icons-material/EuroOutlined";
import GroupOutlinedIcon from "@mui/icons-material/GroupOutlined";
import ApartmentOutlinedIcon from "@mui/icons-material/ApartmentOutlined";
import HowToRegOutlinedIcon from "@mui/icons-material/HowToRegOutlined";

import AdminLayout from "../components/AdminLayout";
import InfoCard from "../components/InfoCard";
import BarCharts from "../components/BarCharts";
import DashboardItem from "../components/DashboardItem";

function DashboardPage() {
  return (
    <AdminLayout>
      <Box>
        <h2>Dashboard Overview</h2>
        <p>Welcome back! Here's what's happening with your platform today.</p>
      </Box>
      <Grid container spacing={3} sx={{ width: "100%", display: "flex" }}>
        <Grid
          size={{ xs: 12, sm: 6, md: 3 }}
          sx={{ display: "flex", flex: 1, minWidth: 230 }}
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
                <h3>Monthly Revenue</h3>
                <p>Revenue trends over the last 6 months</p>
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
