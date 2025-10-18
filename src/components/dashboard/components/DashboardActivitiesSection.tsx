import React from "react";
import { Box, Typography } from "@mui/material";
import ActivityItem from "../../ActivityItem";
import { RecentActivity } from "../../../types/dashboard";

interface DashboardActivitiesSectionProps {
  activities: RecentActivity[];
}

// Fonction pour convertir les statuts de Supabase en statuts d'affichage
const mapStatusToDisplay = (
  status: string
): "Pending" | "Review Required" | "Completed" => {
  switch (status) {
    case "pending":
      return "Pending";
    case "approved":
    case "accepted":
      return "Completed";
    case "rejected":
    case "cancelled":
      return "Review Required";
    case "completed":
      return "Completed";
    default:
      return "Pending";
  }
};

export const DashboardActivitiesSection: React.FC<
  DashboardActivitiesSectionProps
> = ({ activities }) => {
  return (
    <Box
      sx={{
        mt: 2,
        border: "1px solid #ddd",
        borderRadius: 4,
        p: 2,
        flex: 1,
        minWidth: 0,
        display: "flex",
        flexDirection: "column",
      }}
    >
      <Box sx={{ mb: 2 }}>
        <Typography variant="h6">Recent Activity</Typography>
        <Typography variant="body2" color="text.secondary">
          Latest actions requiring your attention
        </Typography>
      </Box>
      <Box sx={{ display: "flex", flexDirection: "column" }}>
        {activities && activities.length > 0 ? (
          activities.map((activity) => (
            <ActivityItem
              key={activity.id}
              status={mapStatusToDisplay(activity.status)}
              title={activity.title}
              description={activity.description}
              actionLabel={activity.actionLabel}
            />
          ))
        ) : (
          <Typography>No recent activities</Typography>
        )}
      </Box>
    </Box>
  );
};
