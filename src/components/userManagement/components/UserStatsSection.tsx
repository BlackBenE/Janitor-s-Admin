import React from "react";
import { Alert } from "@mui/material";
import { UserStatsCards } from "../UserStatsCards";

interface UserStatsSectionProps {
  allUsers: any[];
  activityData: any;
  error?: Error | null;
}

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
