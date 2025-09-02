import Box from "@mui/material/Box";

import AdminLayout from "../components/AdminLayout";

function ServicesCatalogPage() {
  return (
    <AdminLayout>
      <Box>
        <h2>Services Catalog</h2>
        <p>
          Manage available services, categories, and pricing across the
          platform.
        </p>
      </Box>
    </AdminLayout>
  );
}

export default ServicesCatalogPage;
