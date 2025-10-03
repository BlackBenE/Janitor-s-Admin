import React from "react";
import Box from "@mui/material/Box";
import DashboardItem from "../../DashboardItem";
import InfoCard from "../../InfoCard";
import { DashboardStats as DashboardStatsType } from "../../../types/dashboard";

interface DashboardStatsCardsProps {
  stats: DashboardStatsType;
}

export const DashboardStatsCards: React.FC<DashboardStatsCardsProps> = ({
  stats,
}) => {
  const statCards = [
    {
      title: "Validations de propriété",
      value: stats.pendingValidations,
      bottomLeft: "Total en attente",
    },
    {
      title: "Modération des fournisseurs",
      value: stats.moderationCases,
      bottomLeft: "À valider",
    },
    {
      title: "Utilisateurs actifs",
      value: stats.activeUsers,
      bottomLeft: "Les 30 derniers jours",
    },
    {
      title: "Revenu mensuel",
      value: `${stats.monthlyRevenue}€`,
      bottomLeft: "Ce mois-ci",
    },
  ];

  return (
    <Box sx={{ display: "flex", flexWrap: "wrap", gap: 3 }}>
      {statCards.map((card, index) => (
        <Box key={index} sx={{ flex: "1 1 220px" }}>
          <DashboardItem>
            <InfoCard
              title={card.title}
              value={card.value}
              progressText={card.bottomLeft}
              showTrending={false}
            />
          </DashboardItem>
        </Box>
      ))}
    </Box>
  );
};
