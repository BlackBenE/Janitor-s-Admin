import React from "react";
import Box from "@mui/material/Box";
import DashboardItem from "../../DashboardItem";
import InfoCard from "../../InfoCard";
import { DashboardStats as DashboardStatsType } from "../../../types/dashboard";
import { LABELS } from "../../../constants";

interface DashboardStatsCardsProps {
  stats: DashboardStatsType;
}

export const DashboardStatsCards: React.FC<DashboardStatsCardsProps> = ({
  stats,
}) => {
  const statCards = [
    {
      title: LABELS.dashboard.stats.propertyValidations,
      value: stats.pendingValidations,
      bottomLeft: LABELS.dashboard.stats.pendingTotal,
    },
    {
      title: LABELS.dashboard.stats.providerModeration,
      value: stats.moderationCases,
      bottomLeft: LABELS.dashboard.stats.toValidate,
    },
    {
      title: LABELS.dashboard.stats.activeUsers,
      value: stats.activeUsers,
      bottomLeft: LABELS.dashboard.stats.last30Days,
    },
    {
      title: LABELS.dashboard.stats.monthlyRevenue,
      value: `${stats.monthlyRevenue}€`,
      bottomLeft: LABELS.dashboard.stats.thisMonth,
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
