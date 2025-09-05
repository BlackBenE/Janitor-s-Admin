import Box from "@mui/material/Box";

import AdminLayout from "../components/AdminLayout";
import BarCharts from "../components/BarCharts";
import DashboardItem from "../components/DashboardItem";
import { Grid } from "@mui/material";

import EuroOutlinedIcon from "@mui/icons-material/EuroOutlined";
import GroupOutlinedIcon from "@mui/icons-material/GroupOutlined";
import ApartmentOutlinedIcon from "@mui/icons-material/ApartmentOutlined";
import HowToRegOutlinedIcon from "@mui/icons-material/HowToRegOutlined";

import InfoCard from "../components/InfoCard";
import DataTable from "../components/Table";

function FinancialOverviewPage() {
  const columns = [
    { field: "Property", headerName: "Property" },
    { field: "Owner", headerName: "Owner" },
    { field: "Location", headerName: "Location" },
    { field: "Price", headerName: "Price" },
    { field: "Status", headerName: "Status" },
    { field: "Submitted", headerName: "Submitted" },
    { field: "Actions", headerName: "Actions" },
    // ...other columns
  ];

  const data = [
    {
      Property: "Luxury Apartment",
      Owner: "John Doe",
      Location: "New York",
      Price: "$3,000",
      Status: "Pending",
      Submitted: "2023-10-01",
      Actions: "Edit | Delete",
    },
    {
      Property: "Cozy Cottage",
      Owner: "Jane Smith",
      Location: "California",
      Price: "$2,500",
      Status: "Approved",
      Submitted: "2023-09-15",
      Actions: "Edit | Delete",
    },
    {
      Property: "Luxury Apartment",
      Owner: "John Doe",
      Location: "New York",
      Price: "$3,000",
      Status: "Pending",
      Submitted: "2023-10-01",
      Actions: "Edit | Delete",
    },
    {
      Property: "Cozy Cottage",
      Owner: "Jane Smith",
      Location: "California",
      Price: "$2,500",
      Status: "Approved",
      Submitted: "2023-09-15",
      Actions: "Edit | Delete",
    },
    {
      Property: "Luxury Apartment",
      Owner: "John Doe",
      Location: "New York",
      Price: "$3,000",
      Status: "Pending",
      Submitted: "2023-10-01",
      Actions: "Edit | Delete",
    },
    {
      Property: "Cozy Cottage",
      Owner: "Jane Smith",
      Location: "California",
      Price: "$2,500",
      Status: "Approved",
      Submitted: "2023-09-15",
      Actions: "Edit | Delete",
    },
    {
      Property: "Luxury Apartment",
      Owner: "John Doe",
      Location: "New York",
      Price: "$3,000",
      Status: "Pending",
      Submitted: "2023-10-01",
      Actions: "Edit | Delete",
    },
    {
      Property: "Cozy Cottage",
      Owner: "Jane Smith",
      Location: "California",
      Price: "$2,500",
      Status: "Approved",
      Submitted: "2023-09-15",
      Actions: "Edit | Delete",
    },
    {
      Property: "Luxury Apartment",
      Owner: "John Doe",
      Location: "New York",
      Price: "$3,000",
      Status: "Pending",
      Submitted: "2023-10-01",
      Actions: "Edit | Delete",
    },
    {
      Property: "Cozy Cottage",
      Owner: "Jane Smith",
      Location: "California",
      Price: "$2,500",
      Status: "Approved",
      Submitted: "2023-09-15",
      Actions: "Edit | Delete",
    },
  ];

  return (
    <AdminLayout>
      <Box>
        <h2>Financial Management</h2>
        <p>
          Monitor revenue, expenses, and payment transactions across the
          platform.
        </p>
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

      <Box sx={{ mt: 2, border: "1px solid #ddd", borderRadius: 4, p: 2 }}>
        <h3>Property Listings</h3>
        <p>Manage property submissions and approvals</p>
        <DataTable
          columns={columns}
          data={data}
          renderActions={(row) => (
            <>
              <button>Edit</button>
              <button>Delete</button>
            </>
          )}
        />
      </Box>
    </AdminLayout>
  );
}

export default FinancialOverviewPage;
