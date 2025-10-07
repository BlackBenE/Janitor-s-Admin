import React from "react";
import { Box, Grid } from "@mui/material";
import DashboardItem from "../../DashboardItem";
import BarCharts from "../../BarCharts";
import { FinancialChartData } from "../../../types/financialoverview";

interface FinancialChartsProps {
  chartData: FinancialChartData[];
}

/**
 * Section des graphiques financiers
 */
export const FinancialCharts: React.FC<FinancialChartsProps> = ({
  chartData,
}) => {
  // Données pour le graphique des revenus
  const revenueChartData = chartData.map((item) => ({
    month: item.month,
    sales: item.revenue,
  }));

  // Données pour le graphique des profits
  const profitChartData = chartData.map((item) => ({
    month: item.month,
    sales: item.profit,
  }));

  return (
    <Grid container spacing={2} sx={{ width: "100%", display: "flex", mb: 8 }}>
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
              <h3>Revenue vs Expenses</h3>
              <p>Monthly comparison over the last 6 months</p>
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
              <h3>Monthly Profit Trend</h3>
              <p>Profit evolution over time</p>
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
  );
};
