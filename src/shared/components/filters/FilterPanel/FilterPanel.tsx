import React from "react";
import {
  Box,
  TextField,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Button,
  Chip,
  IconButton,
  Tooltip,
} from "@mui/material";
import {
  Clear as ClearIcon,
  FilterList as FilterListIcon,
} from "@mui/icons-material";
import { FilterState } from "@/shared/hooks";

export interface FilterOption {
  value: string | number;
  label: string;
}

export interface FilterConfig {
  key: string;
  label: string;
  type: "text" | "select" | "multiselect";
  options?: FilterOption[];
  placeholder?: string;
}

interface FilterPanelProps<T extends FilterState> {
  filters: T;
  filterConfigs: FilterConfig[];
  onUpdateFilter: <K extends keyof T>(key: K, value: T[K]) => void;
  onResetFilters: () => void;
  onClearSearch: () => void;
  hasActiveFilters: boolean;
  activeFiltersCount: number;
}

export const FilterPanel = <T extends FilterState>({
  filters,
  filterConfigs,
  onUpdateFilter,
  onResetFilters,
  onClearSearch,
  hasActiveFilters,
  activeFiltersCount,
}: FilterPanelProps<T>) => {
  const renderFilter = (config: FilterConfig) => {
    const value = filters[config.key as keyof T];

    switch (config.type) {
      case "text":
        return (
          <TextField
            key={config.key}
            size="small"
            label={config.label}
            placeholder={config.placeholder}
            value={value || ""}
            onChange={(e) =>
              onUpdateFilter(
                config.key as keyof T,
                e.target.value as T[keyof T]
              )
            }
            sx={{ minWidth: 200 }}
            InputProps={
              config.key === "search" && value
                ? {
                    endAdornment: (
                      <IconButton size="small" onClick={onClearSearch}>
                        <ClearIcon fontSize="small" />
                      </IconButton>
                    ),
                  }
                : undefined
            }
          />
        );

      case "select":
        return (
          <FormControl key={config.key} size="small" sx={{ minWidth: 150 }}>
            <InputLabel>{config.label}</InputLabel>
            <Select
              value={value || ""}
              label={config.label}
              onChange={(e) =>
                onUpdateFilter(
                  config.key as keyof T,
                  e.target.value as T[keyof T]
                )
              }
            >
              <MenuItem value="">
                <em>Tous</em>
              </MenuItem>
              {config.options?.map((option) => (
                <MenuItem key={option.value} value={option.value}>
                  {option.label}
                </MenuItem>
              ))}
            </Select>
          </FormControl>
        );

      default:
        return null;
    }
  };

  return (
    <Box>
      {/* Ligne des filtres */}
      <Box
        sx={{
          display: "flex",
          gap: 2,
          flexWrap: "wrap",
          alignItems: "center",
          mb: 2,
        }}
      >
        {filterConfigs.map(renderFilter)}

        {/* Bouton de reset */}
        {hasActiveFilters && (
          <Tooltip title="Réinitialiser les filtres">
            <Button
              variant="outlined"
              size="small"
              onClick={onResetFilters}
              startIcon={<ClearIcon />}
            >
              Reset
            </Button>
          </Tooltip>
        )}
      </Box>

      {/* Indicateur de filtres actifs */}
      {hasActiveFilters && (
        <Box sx={{ display: "flex", alignItems: "center", gap: 1, mb: 2 }}>
          <FilterListIcon fontSize="small" color="primary" />
          <Chip
            label={`${activeFiltersCount} filtre${
              activeFiltersCount > 1 ? "s" : ""
            } actif${activeFiltersCount > 1 ? "s" : ""}`}
            size="small"
            color="primary"
            variant="outlined"
          />
        </Box>
      )}
    </Box>
  );
};

export default FilterPanel;
