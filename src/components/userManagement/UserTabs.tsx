import React from "react";
import { Box, ToggleButton, ToggleButtonGroup, Chip } from "@mui/material";
import { USER_TABS, UserRole } from "./config/userTabs";
import { UserProfile } from "../../types/userManagement";

interface UserTabsProps {
  activeTab: number;
  users: UserProfile[];
  onTabChange: (
    event: React.MouseEvent<HTMLElement>,
    newValue: number | null
  ) => void;
}

export const UserTabs: React.FC<UserTabsProps> = ({
  activeTab,
  users,
  onTabChange,
}) => {
  return (
    <ToggleButtonGroup
      value={activeTab}
      exclusive
      onChange={onTabChange}
      aria-label="user type filter"
      size="small"
      sx={{
        "& .MuiToggleButton-root": {
          textTransform: "none",
          px: 2,
          py: 0.5,
          fontSize: "0.875rem",
          fontWeight: 500,
          border: "1px solid #e0e0e0",
          "&.Mui-selected": {
            backgroundColor: "primary.main",
            color: "white",
            "&:hover": {
              backgroundColor: "primary.dark",
            },
          },
        },
      }}
    >
      {USER_TABS.map((tab, index) => {
        const IconComponent = tab.icon;
        return (
          <ToggleButton key={index} value={index}>
            <Box sx={{ display: "flex", alignItems: "center", gap: 0.5 }}>
              {tab.label}
              <Chip
                label={
                  tab.role === null
                    ? users.length
                    : users.filter((u) => u.role === tab.role).length
                }
                size="small"
                sx={{
                  ml: 0.5,
                  height: 16,
                  "& .MuiChip-label": { px: 0.5, fontSize: "0.75rem" },
                }}
              />
            </Box>
          </ToggleButton>
        );
      })}
    </ToggleButtonGroup>
  );
};
