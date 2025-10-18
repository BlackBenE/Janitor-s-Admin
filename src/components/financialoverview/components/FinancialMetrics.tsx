import React from "react";
import { Grid } from "@mui/material";
import DashboardItem from "../../DashboardItem";
import InfoCard from "../../InfoCard";

import EuroOutlinedIcon from "@mui/icons-material/EuroOutlined";
import GroupOutlinedIcon from "@mui/icons-material/GroupOutlined";
import ApartmentOutlinedIcon from "@mui/icons-material/ApartmentOutlined";
import HowToRegOutlinedIcon from "@mui/icons-material/HowToRegOutlined";

import {
  RevenueMetrics,
  ExpenseMetrics,
  ProfitMetrics,
  SubscriptionMetrics,
} from "../../../types/financialoverview";

interface FinancialMetricsProps {
  revenueMetrics: RevenueMetrics;
  expenseMetrics: ExpenseMetrics;
  profitMetrics: ProfitMetrics;
  subscriptionMetrics: SubscriptionMetrics;
}

/**
 * Section des métriques financières (cartes KPI)
 */
export const FinancialMetrics: React.FC<FinancialMetricsProps> = ({
  revenueMetrics,
  expenseMetrics,
  profitMetrics,
  subscriptionMetrics,
}) => {
  return (
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
            progressText={`${revenueMetrics.revenueGrowth >= 0 ? "+" : ""}${
              revenueMetrics.revenueGrowth
            }% growth`}
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
            progressText={`${expenseMetrics.expenseGrowth >= 0 ? "+" : ""}${
              expenseMetrics.expenseGrowth
            }% growth`}
            showTrending={true}
            trendingType={expenseMetrics.expenseGrowth >= 0 ? "up" : "down"}
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
            progressText={`${profitMetrics.profitGrowth >= 0 ? "+" : ""}${
              profitMetrics.profitGrowth
            }% growth`}
            showTrending={true}
            trendingType={profitMetrics.profitGrowth >= 0 ? "up" : "down"}
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
            trendingType="up"
            progressTextColor="text.secondary"
          />
        </DashboardItem>
      </Grid>
    </Grid>
  );
};
