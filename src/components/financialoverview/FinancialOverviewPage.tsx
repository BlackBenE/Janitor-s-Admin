import React from "react";
import Box from "@mui/material/Box";
import { Grid } from "@mui/material";

import AdminLayout from "../AdminLayout";
import BarCharts from "../BarCharts";
import DashboardItem from "../DashboardItem";
import InfoCard from "../InfoCard";
import DataTable from "../Table";

import EuroOutlinedIcon from "@mui/icons-material/EuroOutlined";
import GroupOutlinedIcon from "@mui/icons-material/GroupOutlined";
import ApartmentOutlinedIcon from "@mui/icons-material/ApartmentOutlined";
import HowToRegOutlinedIcon from "@mui/icons-material/HowToRegOutlined";

import { useFinancialOverview } from "../../hooks/financialoverview/useFinancialOverview";

/**
 * Page Financial Overview - MÊME DESIGN que l'original, juste refactorisé
 */
export const FinancialOverviewPage: React.FC = () => {
  const {
    revenueMetrics,
    expenseMetrics,
    profitMetrics,
    subscriptionMetrics,
    transactions,
    chartData,
  } = useFinancialOverview();

  // Colonnes exactement comme l'original
  const columns = [
    { field: "Transaction ID", headerName: "Transaction ID" },
    { field: "Type", headerName: "Type" },
    { field: "User", headerName: "User" },
    { field: "Amount", headerName: "Amount" },
    { field: "Status", headerName: "Status" },
    { field: "Method", headerName: "Method" },
    { field: "Date", headerName: "Date" },
  ];

  // Transformer les données pour le tableau (même format que l'original)
  const tableData = transactions.slice(0, 10).map((transaction) => ({
    "Transaction ID": transaction.transactionId,
    Type: transaction.type.charAt(0).toUpperCase() + transaction.type.slice(1),
    User: transaction.user.name,
    Amount: `${transaction.amount.toLocaleString()} €`,
    Status:
      transaction.status.charAt(0).toUpperCase() + transaction.status.slice(1),
    Method:
      transaction.method.replace("_", " ").charAt(0).toUpperCase() +
      transaction.method.replace("_", " ").slice(1),
    Date: transaction.date.toLocaleDateString("fr-FR"),
  }));

  // Données pour les graphiques (même format que l'original)
  const revenueChartData = chartData.map((item) => ({
    month: item.month,
    sales: item.revenue,
  }));

  const profitChartData = chartData.map((item) => ({
    month: item.month,
    sales: item.profit,
  }));

  return (
    <AdminLayout>
      {/* En-tête - EXACT comme l'original */}
      <Box>
        <h2>Financial Management</h2>
        <p>
          Monitor revenue, expenses, and payment transactions across the
          platform.
        </p>
      </Box>

      {/* Métriques - MÊME structure Grid et InfoCard que l'original */}
      <Grid container spacing={3} sx={{ width: "100%", display: "flex" }}>
        <Grid
          size={{ xs: 12, sm: 6, md: 3 }}
          sx={{ display: "flex", flex: 1, minWidth: 230 }}
        >
          <DashboardItem>
            <InfoCard
              title="Total Revenue"
              icon={ApartmentOutlinedIcon}
              value={revenueMetrics.totalRevenue}
              progressText={`${revenueMetrics.revenueGrowth}% growth`}
              showTrending={true}
              trendingType={revenueMetrics.revenueGrowth >= 0 ? "up" : "down"}
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
              title="Monthly Expenses"
              icon={HowToRegOutlinedIcon}
              value={expenseMetrics.monthlyExpenses}
              progressText={`${expenseMetrics.expenseGrowth}% growth`}
              showTrending={true}
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
              title="Net Profit"
              icon={GroupOutlinedIcon}
              value={profitMetrics.netProfit}
              progressText={`${profitMetrics.profitGrowth}% growth`}
              showTrending={true}
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
              title="Active Subscriptions"
              icon={EuroOutlinedIcon}
              value={subscriptionMetrics.activeSubscriptions}
              progressText={`${subscriptionMetrics.newSubscriptions} new`}
              showTrending={true}
              progressTextColor="text.secondary"
            />
          </DashboardItem>
        </Grid>
      </Grid>

      {/* Graphiques - MÊME structure que l'original */}
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
                  dataset={revenueChartData}
                  xAxisKey="month"
                  series={[
                    {
                      dataKey: "sales",
                      label: "Monthly Revenue",
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
                <h3>Profit Growth</h3>
                <p>Net profit evolution over time</p>
              </Box>
              <Box sx={{ width: "100%" }}>
                <BarCharts
                  dataset={profitChartData}
                  xAxisKey="month"
                  series={[
                    {
                      dataKey: "sales",
                      label: "Monthly Profit",
                    },
                  ]}
                />
              </Box>
            </Box>
          </DashboardItem>
        </Grid>
      </Grid>

      {/* Tableau - MÊME structure que l'original */}
      <Box sx={{ mt: 2, border: "1px solid #ddd", borderRadius: 4, p: 2 }}>
        <h3>Recent Transactions</h3>
        <p>Latest payment activities and transactions</p>
        <DataTable
          columns={columns}
          data={tableData}
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
};

export default FinancialOverviewPage;
