import Box from "@mui/material/Box";
import Grid from "@mui/material/Grid";
import EuroOutlinedIcon from "@mui/icons-material/EuroOutlined";
import GroupOutlinedIcon from "@mui/icons-material/GroupOutlined";
import ApartmentOutlinedIcon from "@mui/icons-material/ApartmentOutlined";
import HowToRegOutlinedIcon from "@mui/icons-material/HowToRegOutlined";

import AdminLayout from "../AdminLayout";
import InfoCard from "../InfoCard";
import DataTable from "../Table";
import DashboardItem from "../DashboardItem";
import { useServicesCatalog } from "../../hooks/services-catalog/useServicesCatalog";

/**
 * ServicesCatalogPage Component
 *
 * Manages available services, categories, and pricing across the platform.
 * Displays statistics cards and property listings table.
 *
 * Features:
 * - Service statistics overview (4 metric cards)
 * - Property listings management table
 * - Edit/Delete actions for properties
 */
function ServicesCatalogPage() {
  const { columns, data, stats } = useServicesCatalog();

  return (
    <AdminLayout>
      {/* Page Header - EXACT comme l'original */}
      <Box>
        <h2>Services Catalog</h2>
        <p>
          Manage available services, categories, and pricing across the
          platform.
        </p>
      </Box>

      {/* Statistics Cards Grid - EXACT comme l'original */}
      <Grid container spacing={3} sx={{ width: "100%", display: "flex" }}>
        <Grid
          size={{ xs: 12, sm: 6, md: 3 }}
          sx={{ display: "flex", flex: 1, minWidth: 230 }}
        >
          <DashboardItem>
            <InfoCard
              title="Pending Property Validations"
              icon={ApartmentOutlinedIcon}
              value={stats.pendingValidations}
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
              value={stats.moderationCases}
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
              value={stats.activeUsers}
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
              value={stats.monthlyRevenue}
              bottomLeft="Active this month"
              progressText="75% growth"
              showTrending={false}
              progressTextColor="text.secondary"
            />
          </DashboardItem>
        </Grid>
      </Grid>

      {/* Property Listings Table - EXACT comme l'original */}
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

export default ServicesCatalogPage;
