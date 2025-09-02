import Box from "@mui/material/Box";

import AdminLayout from "../components/AdminLayout";

function UserManagementPage() {
  return (
    <AdminLayout>
      <Box>
        <h2>User Management</h2>
        <p>
          Manage users, subscriptions, and account activities across the
          platform.
        </p>
      </Box>
    </AdminLayout>
  );
}

export default UserManagementPage;
