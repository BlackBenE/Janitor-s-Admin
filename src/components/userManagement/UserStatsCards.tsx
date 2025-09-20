import React from "react";
import { Grid } from "@mui/material";
import DashboardItem from "../DashboardItem";
import InfoCard from "../InfoCard";
import { UserProfile, UserActivityData } from "../../types/userManagement";

interface UserStatsCardsProps {
  filteredUsers: UserProfile[];
  activityData: Record<string, UserActivityData> | undefined;
}

export const UserStatsCards: React.FC<UserStatsCardsProps> = ({
  filteredUsers,
  activityData,
}) => {
  const totalUsers = filteredUsers.length;
  const activeUsers = filteredUsers.filter(
    (user: UserProfile) => user.profile_validated
  ).length;
  const pendingValidations = filteredUsers.filter(
    (user: UserProfile) => !user.profile_validated
  ).length;

  const totalRevenue = activityData
    ? Object.values(activityData).reduce(
        (sum: number, activity: UserActivityData) => sum + activity.totalSpent,
        0
      )
    : 0;
  const totalBookings = activityData
    ? Object.values(activityData).reduce(
        (sum: number, activity: UserActivityData) =>
          sum + activity.totalBookings,
        0
      )
    : 0;

  const monthlyGrowth = "+12.5%";
  const activeGrowth = "+8.3%";

  // Helper function to format currency
  const formatCurrency = (amount: number): string => {
    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: "USD",
    }).format(amount);
  };

  return (
    <Grid container spacing={3} sx={{ width: "100%", display: "flex" }}>
      <Grid
        size={{ xs: 12, sm: 6, md: 3 }}
        sx={{ display: "flex", flex: 1, minWidth: 0 }}
      >
        <DashboardItem>
          <InfoCard
            title="Total Users"
            value={totalUsers}
            progressText={`${monthlyGrowth} this month`}
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
            title="Pending Validations"
            value={pendingValidations}
            progressText={`${pendingValidations} requiring review`}
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
            value={activeUsers}
            progressText={`${activeGrowth} from last month`}
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
            title="Total Revenue"
            value={formatCurrency(totalRevenue)}
            progressText={`${totalBookings} total bookings`}
            showTrending={false}
            progressTextColor="text.secondary"
          />
        </DashboardItem>
      </Grid>
    </Grid>
  );
};
