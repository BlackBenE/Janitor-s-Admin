import Box from "@mui/material/Box";
import Grid from "@mui/material/Grid";
import EuroOutlinedIcon from "@mui/icons-material/EuroOutlined";
import GroupOutlinedIcon from "@mui/icons-material/GroupOutlined";
import ApartmentOutlinedIcon from "@mui/icons-material/ApartmentOutlined";
import HowToRegOutlinedIcon from "@mui/icons-material/HowToRegOutlined";

import AdminLayout from "../components/AdminLayout";
import InfoCard from "../components/InfoCard";
import DataTable from "../components/Table";

function UserManagementPage() {
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
        <h2>User Management</h2>
        <p>
          Manage users, subscriptions, and account activities across the
          platform.
        </p>
      </Box>
      <Grid container spacing={3} alignItems="stretch">
        <Grid item xs={12} sm={6} md={3} sx={{ display: "flex" }}>
          <InfoCard
            title="Pending Property Validations"
            icon={ApartmentOutlinedIcon}
            value={1200}
            bottomLeft="Active this month"
            progressText="75% growth"
            showTrending={false}
            progressTextColor="text.secondary"
            sx={{ flex: 1 }}
          />
        </Grid>
        <Grid item xs={12} sm={6} md={3} sx={{ display: "flex" }}>
          <InfoCard
            title="Provider Moderation Cases"
            icon={HowToRegOutlinedIcon}
            value={1200}
            bottomLeft="Active this month"
            progressText="75% growth"
            showTrending={false}
            progressTextColor="text.secondary"
            sx={{ flex: 1 }}
          />
        </Grid>
        <Grid item xs={12} sm={6} md={3} sx={{ display: "flex" }}>
          <InfoCard
            title="Active Users"
            icon={GroupOutlinedIcon}
            value={1200}
            bottomLeft="Active this month"
            progressText="75% growth"
            showTrending={false}
            progressTextColor="text.secondary"
            sx={{ flex: 1 }}
          />
        </Grid>
        <Grid item xs={12} sm={6} md={3} sx={{ display: "flex" }}>
          <InfoCard
            title="Monthly Revenue"
            icon={EuroOutlinedIcon}
            value={1200}
            bottomLeft="Active this month"
            progressText="75% growth"
            showTrending={false}
            progressTextColor="text.secondary"
            sx={{ flex: 1 }}
          />
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

export default UserManagementPage;
