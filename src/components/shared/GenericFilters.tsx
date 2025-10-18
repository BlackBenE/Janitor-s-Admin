import React from "react";
import {
  Box,
  TextField,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
} from "@mui/material";

// Types génériques pour les filtres
export interface FilterConfig {
  key: string;
  label: string;
  type: "text" | "select" | "number";
  placeholder?: string;
  options?: Array<{ value: string; label: string }>;
  minWidth?: number;
  hidden?: boolean;
}

export interface GenericFiltersProps<T extends Record<string, any>> {
  filters: T;
  onUpdateFilter: (key: keyof T, value: string) => void;
  searchConfig?: {
    placeholder: string;
    minWidth?: number;
  };
  filterConfigs: FilterConfig[];
  simplified?: boolean;
}

export function GenericFilters<T extends Record<string, any>>({
  filters,
  onUpdateFilter,
  searchConfig = {
    placeholder: "Search...",
    minWidth: 200,
  },
  filterConfigs,
  simplified = false,
}: GenericFiltersProps<T>) {
  // Filtrer les configs selon le mode simplifié
  const visibleConfigs = simplified
    ? filterConfigs.filter((config) => !config.hidden)
    : filterConfigs;

  const renderFilter = (config: FilterConfig) => {
    const value = filters[config.key as keyof T] || "";

    switch (config.type) {
      case "select":
        return (
          <FormControl
            key={config.key}
            size="small"
            sx={{ minWidth: config.minWidth || 120 }}
          >
            <InputLabel>{config.label}</InputLabel>
            <Select
              value={value}
              label={config.label}
              onChange={(e) =>
                onUpdateFilter(config.key as keyof T, e.target.value)
              }
            >
              <MenuItem value="">All</MenuItem>
              {config.options?.map((option) => (
                <MenuItem key={option.value} value={option.value}>
                  {option.label}
                </MenuItem>
              ))}
            </Select>
          </FormControl>
        );

      case "number":
        return (
          <TextField
            key={config.key}
            size="small"
            type="number"
            placeholder={config.placeholder || config.label}
            value={value}
            onChange={(e) =>
              onUpdateFilter(config.key as keyof T, e.target.value)
            }
            sx={{ minWidth: config.minWidth || 100 }}
          />
        );

      case "text":
      default:
        return (
          <TextField
            key={config.key}
            size="small"
            placeholder={config.placeholder || config.label}
            value={value}
            onChange={(e) =>
              onUpdateFilter(config.key as keyof T, e.target.value)
            }
            sx={{ minWidth: config.minWidth || 120 }}
          />
        );
    }
  };

  return (
    <Box
      sx={{
        mb: 3,
        display: "flex",
        gap: 2,
        flexWrap: "wrap",
        alignItems: "center",
      }}
    >
      {/* Champ de recherche */}
      <TextField
        size="small"
        placeholder={searchConfig.placeholder}
        value={filters.search || ""}
        onChange={(e) => onUpdateFilter("search" as keyof T, e.target.value)}
        sx={{ minWidth: searchConfig.minWidth }}
      />

      {/* Filtres configurables */}
      {visibleConfigs.map((config) => renderFilter(config))}
    </Box>
  );
}
