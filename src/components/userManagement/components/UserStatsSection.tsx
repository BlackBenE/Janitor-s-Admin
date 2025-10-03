import React from "react";
import { Alert, Box, Grid } from "@mui/material";
import {
  People as PeopleIcon,
  CheckCircle as CheckCircleIcon,
  AccessTime as AccessTimeIcon,
  AttachMoney as AttachMoneyIcon,
} from "@mui/icons-material";
import InfoCard from "../../InfoCard";
import { UserProfile } from "../../../types/userManagement";

interface UserActivityData {
  userId: string;
  totalBookings: number;
  lastBookingDate: string | null;
  totalSpent: number;
  completedBookings: number;
  pendingBookings: number;
}

interface UserStatsSectionProps {
  allUsers: UserProfile[];
  activityData: Record<string, UserActivityData> | undefined;
  error?: Error | null;
}

const UserStatsCards: React.FC<{
  filteredUsers: UserProfile[];
  activityData: Record<string, UserActivityData> | undefined;
}> = ({ filteredUsers, activityData }) => {
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
        <InfoCard
          title="Total Users"
          value={totalUsers.toString()}
          progressText={monthlyGrowth}
          icon={PeopleIcon}
        />
      </Grid>

      <Grid
        size={{ xs: 12, sm: 6, md: 3 }}
        sx={{ display: "flex", flex: 1, minWidth: 220 }}
      >
        <InfoCard
          title="Active Users"
          value={activeUsers.toString()}
          progressText={activeGrowth}
          icon={CheckCircleIcon}
        />
      </Grid>

      <Grid
        size={{ xs: 12, sm: 6, md: 3 }}
        sx={{ display: "flex", flex: 1, minWidth: 220 }}
      >
        <InfoCard
          title="Pending Validations"
          value={pendingValidations.toString()}
          icon={AccessTimeIcon}
        />
      </Grid>

      <Grid
        size={{ xs: 12, sm: 6, md: 3 }}
        sx={{ display: "flex", flex: 1, minWidth: 220 }}
      >
        <InfoCard
          title="Total Revenue"
          value={formatCurrency(totalRevenue)}
          icon={AttachMoneyIcon}
        />
      </Grid>
    </Grid>
  );
};

export const UserStatsSection: React.FC<UserStatsSectionProps> = ({
  allUsers,
  activityData,
  error,
}) => {
  return (
    <>
      {/* Cartes de statistiques globales */}
      <UserStatsCards filteredUsers={allUsers} activityData={activityData} />

      {/* Message d'erreur */}
      {error && (
        <Alert severity="error" sx={{ mb: 2 }}>
          Erreur lors du chargement des utilisateurs :{" "}
          {error instanceof Error ? error.message : "Unknown error"}
        </Alert>
      )}
    </>
  );
};
