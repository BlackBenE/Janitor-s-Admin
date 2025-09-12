import Box from "@mui/material/Box";
import Grid from "@mui/material/Grid";
import AdminLayout from "../components/AdminLayout";
import InfoCard from "../components/InfoCard";
import DashboardItem from "../components/DashboardItem";
import DataTable from "../components/Table";

function DashboardPage() {
  const columns = [
    { field: "User", headerName: "User" },
    { field: "Role", headerName: "Role" },
    { field: "Subscription", headerName: "Subscription" },
    { field: "Status", headerName: "Status" },
    { field: "Activity", headerName: "Activity" },
    { field: "Spending", headerName: "Spending" },

    // ...other columns
  ];

  const data = [
    {
      Provider: "ABC Cleaning Services",
      Service: "Cleaning",
      Location: "New York",
      Rating: "4.8",
      Status: "Pending",
      Documents: "Uploaded",
    },
    {
      Provider: "ABC Cleaning Services",
      Service: "Cleaning",
      Location: "New York",
      Rating: "4.8",
      Status: "Pending",
      Documents: "Uploaded",
    },
    {
      Provider: "ABC Cleaning Services",
      Service: "Cleaning",
      Location: "New York",
      Rating: "4.8",
      Status: "Pending",
      Documents: "Uploaded",
    },
    {
      Provider: "ABC Cleaning Services",
      Service: "Cleaning",
      Location: "New York",
      Rating: "4.8",
      Status: "Pending",
      Documents: "Uploaded",
    },
    {
      Provider: "ABC Cleaning Services",
      Service: "Cleaning",
      Location: "New York",
      Rating: "4.8",
      Status: "Pending",
      Documents: "Uploaded",
    },
    {
      Provider: "ABC Cleaning Services",
      Service: "Cleaning",
      Location: "New York",
      Rating: "4.8",
      Status: "Pending",
      Documents: "Uploaded",
    },
    {
      Provider: "ABC Cleaning Services",
      Service: "Cleaning",
      Location: "New York",
      Rating: "4.8",
      Status: "Pending",
      Documents: "Uploaded",
    },
    {
      Provider: "ABC Cleaning Services",
      Service: "Cleaning",
      Location: "New York",
      Rating: "4.8",
      Status: "Pending",
      Documents: "Uploaded",
    },
  ];

  return (
    <AdminLayout>
      <Box>
        <h2>User Management</h2>
        <p>
          Manage users, subscriptions, and account activities across the
          platform.
        </p>
      </Box>
      <Grid container spacing={3} sx={{ width: "100%", display: "flex" }}>
        <Grid
          size={{ xs: 12, sm: 6, md: 3 }}
          sx={{ display: "flex", flex: 1, minWidth: 0 }}
        >
          <DashboardItem>
            <InfoCard
              title="Total Users"
              value={1200}
              progressText="+170 this month"
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
              value={1200}
              progressText="+95 this month"
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
              value={1200}
              progressText="+15.3% from last month"
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
              value={1200}
              progressText="-5 from yesterday"
              showTrending={false}
              progressTextColor="text.secondary"
            />
          </DashboardItem>
        </Grid>
      </Grid>

      <Box sx={{ mt: 2, border: "1px solid #ddd", borderRadius: 4, p: 2 }}>
        <h3>Users</h3>
        <p>Manage user accounts and subscriptions</p>
        <DataTable
          columns={columns}
          data={data}
          renderActions={() => (
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

export default DashboardPage;
