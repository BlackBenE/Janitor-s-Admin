import React from "react";
import { Box, ToggleButton, ToggleButtonGroup, Chip } from "@mui/material";

// Interface générique pour les configurations de tabs
export interface TabConfig<T = any> {
  key: string | number | null;
  label: string;
  icon?: React.ComponentType;
  color?:
    | "default"
    | "primary"
    | "secondary"
    | "error"
    | "info"
    | "success"
    | "warning";
  description?: string;
}

// Props du composant générique
export interface GenericTabsProps<T, K> {
  activeTab: number;
  items: T[];
  tabConfigs: TabConfig<K>[];
  onTabChange: (
    event: React.MouseEvent<HTMLElement>,
    newValue: number | null
  ) => void;
  getItemCount: (tabKey: K, items: T[]) => number;
  ariaLabel?: string;
}

export function GenericTabs<T, K>({
  activeTab,
  items,
  tabConfigs,
  onTabChange,
  getItemCount,
  ariaLabel = "tab filter",
}: GenericTabsProps<T, K>) {
  return (
    <ToggleButtonGroup
      value={activeTab}
      exclusive
      onChange={onTabChange}
      aria-label={ariaLabel}
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
      {tabConfigs.map((tab, index) => {
        const IconComponent = tab.icon;
        const count = getItemCount(tab.key as K, items);

        return (
          <ToggleButton key={index} value={index}>
            <Box sx={{ display: "flex", alignItems: "center", gap: 0.5 }}>
              {IconComponent && (
                <Box component={IconComponent} sx={{ fontSize: "1rem" }} />
              )}
              {tab.label}
              <Chip
                label={count}
                size="small"
                color={tab.color || "default"}
                variant="outlined"
                sx={{
                  height: "18px",
                  fontSize: "0.75rem",
                  "& .MuiChip-label": {
                    px: 0.5,
                  },
                }}
              />
            </Box>
          </ToggleButton>
        );
      })}
    </ToggleButtonGroup>
  );
}
