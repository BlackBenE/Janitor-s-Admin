import React from "react";
import { Box, Typography } from "@mui/material";
import ActivityItem from "../../ActivityItem";
import { RecentActivity } from "../../../types/dashboard";
import { LABELS } from "../../../constants";

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
    case "completed":
      return "Completed";
    case "rejected":
    case "cancelled":
    case "review_required":
    case "failed":
      return "Review Required";
    default:
      return "Pending";
  }
};

// Note: Cette fonction retourne toujours des valeurs en anglais car elles sont utilisées
// comme clés pour récupérer les traductions depuis LABELS.dashboard.activities.status
const getStatusTranslation = (
  status: "Pending" | "Review Required" | "Completed"
): string => {
  switch (status) {
    case "Pending":
      return LABELS.dashboard.activities.status.pending;
    case "Review Required":
      return LABELS.dashboard.activities.status.reviewRequired;
    case "Completed":
      return LABELS.dashboard.activities.status.completed;
    default:
      return status;
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
        <Typography variant="h6">
          {LABELS.dashboard.activities.title}{" "}
          {activities.length > 0 && `(${activities.length})`}
        </Typography>
        <Typography variant="body2" color="text.secondary">
          {LABELS.dashboard.activities.subtitle}
          {activities.length > 5 && LABELS.dashboard.activities.subtitleScroll}
        </Typography>
      </Box>
      <Box sx={{ position: "relative", flex: 1 }}>
        <Box
          sx={{
            display: "flex",
            flexDirection: "column",
            maxHeight: "400px", // Hauteur maximale pour déclencher le scroll
            overflowY: "auto", // Scroll vertical
            overflowX: "hidden", // Pas de scroll horizontal
            pr: 1, // Padding right pour éviter que le contenu touche le scrollbar
            // Style du scrollbar
            "&::-webkit-scrollbar": {
              width: "6px",
            },
            "&::-webkit-scrollbar-track": {
              backgroundColor: "#f1f1f1",
              borderRadius: "3px",
            },
            "&::-webkit-scrollbar-thumb": {
              backgroundColor: "#c1c1c1",
              borderRadius: "3px",
              "&:hover": {
                backgroundColor: "#a8a8a8",
              },
            },
          }}
        >
          {activities && activities.length > 0 ? (
            activities.map((activity) => (
              <ActivityItem
                key={activity.id}
                status={mapStatusToDisplay(activity.status)}
                title={activity.title}
                description={activity.description}
                actionLabel={activity.actionLabel}
                activityId={activity.id}
                activityType={activity.type}
              />
            ))
          ) : (
            <Typography>{LABELS.dashboard.activities.noActivities}</Typography>
          )}
        </Box>

        {/* Gradient fade-out en bas si beaucoup d'éléments */}
        {activities.length > 5 && (
          <Box
            sx={{
              position: "absolute",
              bottom: 0,
              left: 0,
              right: 0,
              height: "30px",
              background:
                "linear-gradient(transparent, rgba(255, 255, 255, 0.9))",
              pointerEvents: "none",
              borderRadius: "0 0 16px 16px",
            }}
          />
        )}
      </Box>
    </Box>
  );
};
