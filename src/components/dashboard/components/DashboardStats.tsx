import React from "react";
import Box from "@mui/material/Box";
import EuroOutlinedIcon from "@mui/icons-material/EuroOutlined";
import GroupOutlinedIcon from "@mui/icons-material/GroupOutlined";
import ApartmentOutlinedIcon from "@mui/icons-material/ApartmentOutlined";
import HowToRegOutlinedIcon from "@mui/icons-material/HowToRegOutlined";
import DashboardItem from "../../DashboardItem";
import InfoCard from "../../InfoCard";
import { DashboardStats as DashboardStatsType } from "../../../types/dashboard";

interface DashboardStatsProps {
  stats: DashboardStatsType;
}

export const DashboardStats: React.FC<DashboardStatsProps> = ({ stats }) => {
  return (
    <Box sx={{ display: "flex", flexWrap: "wrap", gap: 3 }}>
      <Box sx={{ flex: "1 1 220px" }}>
        <DashboardItem>
          <InfoCard
            title="Pending Property Validations"
            icon={ApartmentOutlinedIcon}
            value={stats.pendingValidations}
            bottomLeft="Total pending"
            showTrending={false}
          />
        </DashboardItem>
      </Box>

      <Box sx={{ flex: "1 1 220px" }}>
        <DashboardItem>
          <InfoCard
            title="Provider Moderation Cases"
            icon={HowToRegOutlinedIcon}
            value={stats.moderationCases}
            bottomLeft="To review"
            showTrending={false}
          />
        </DashboardItem>
      </Box>

      <Box sx={{ flex: "1 1 220px" }}>
        <DashboardItem>
          <InfoCard
            title="Active Users"
            icon={GroupOutlinedIcon}
            value={stats.activeUsers}
            bottomLeft="Last 30 days"
            showTrending={false}
          />
        </DashboardItem>
      </Box>

      <Box sx={{ flex: "1 1 220px" }}>
        <DashboardItem>
          <InfoCard
            title="Monthly Revenue"
            icon={EuroOutlinedIcon}
            value={`${stats.monthlyRevenue}€`}
            bottomLeft="This month"
            showTrending={false}
          />
        </DashboardItem>
      </Box>
    </Box>
  );
};
