import Box from "@mui/material/Box";
import Grid from "@mui/material/Grid";
import EuroOutlinedIcon from "@mui/icons-material/EuroOutlined";
import GroupOutlinedIcon from "@mui/icons-material/GroupOutlined";
import ApartmentOutlinedIcon from "@mui/icons-material/ApartmentOutlined";
import HowToRegOutlinedIcon from "@mui/icons-material/HowToRegOutlined";

import AdminLayout from "../components/AdminLayout";
import InfoCard from "../components/InfoCard";
import DashboardItem from "../components/DashboardItem";
import DataTable from "../components/Table";

function DashboardPage() {
  const columns = [
    { field: "Provider", headerName: "Provider" },
    { field: "Service", headerName: "Service" },
    { field: "Location", headerName: "Location" },
    { field: "Rating", headerName: "Rating" },
    { field: "Status", headerName: "Status" },
    { field: "Documents", headerName: "Submitted" },

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

      <Box sx={{ mt: 2, border: "1px solid #ddd", borderRadius: 4, p: 2 }}>
        <h3>Property Listings</h3>
        <p>Manage property submissions and approvals</p>
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
