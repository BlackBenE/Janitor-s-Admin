import Box from "@mui/material/Box";

import AdminLayout from "../components/AdminLayout";

function InvoicesPage() {
  return (
    <AdminLayout>
      <Box>
        <h2>Invoice Management</h2>
        <p>
          Track and manage provider invoices, payments, and billing activities.
        </p>
      </Box>
    </AdminLayout>
  );
}

export default InvoicesPage;
