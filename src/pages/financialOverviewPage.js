import Box from "@mui/material/Box";

import AdminLayout from "../components/AdminLayout";

function FinancialOverviewPage() {
  return (
    <AdminLayout>
      <Box>
        <h2>Financial Management</h2>
        <p>
          Monitor revenue, expenses, and payment transactions across the
          platform.
        </p>
      </Box>
    </AdminLayout>
  );
}

export default FinancialOverviewPage;
