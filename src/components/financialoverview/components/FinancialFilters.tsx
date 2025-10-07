import React from "react";
import {
  Box,
  TextField,
  Select,
  MenuItem,
  FormControl,
  InputLabel,
  Button,
  Stack,
} from "@mui/material";
import SearchIcon from "@mui/icons-material/Search";
import FilterListIcon from "@mui/icons-material/FilterList";
import GetAppIcon from "@mui/icons-material/GetApp";

interface FinancialFiltersProps {
  searchValue: string;
  onSearchChange: (value: string) => void;
  selectedPeriod: "7d" | "30d" | "90d" | "1y";
  onPeriodChange: (period: "7d" | "30d" | "90d" | "1y") => void;
  onExportExcel?: () => void;
  onExportPDF?: () => void;
  onRefresh?: () => void;
}

/**
 * Composant de filtres pour la page Financial Overview
 */
export const FinancialFilters: React.FC<FinancialFiltersProps> = ({
  searchValue,
  onSearchChange,
  selectedPeriod,
  onPeriodChange,
  onExportExcel,
  onExportPDF,
  onRefresh,
}) => {
  return (
    <Box sx={{ mb: 3, p: 2, border: "1px solid #ddd", borderRadius: 2 }}>
      <Stack
        direction={{ xs: "column", sm: "row" }}
        spacing={2}
        alignItems="center"
      >
        {/* Recherche */}
        <TextField
          size="small"
          placeholder="Rechercher des transactions..."
          value={searchValue}
          onChange={(e) => onSearchChange(e.target.value)}
          InputProps={{
            startAdornment: (
              <SearchIcon sx={{ mr: 1, color: "text.secondary" }} />
            ),
          }}
          sx={{ minWidth: 250 }}
        />

        {/* Filtre par période */}
        <FormControl size="small" sx={{ minWidth: 150 }}>
          <InputLabel>Période</InputLabel>
          <Select
            value={selectedPeriod}
            label="Période"
            onChange={(e) => onPeriodChange(e.target.value)}
            startAdornment={
              <FilterListIcon sx={{ mr: 1, color: "text.secondary" }} />
            }
          >
            <MenuItem value="7d">7 derniers jours</MenuItem>
            <MenuItem value="30d">30 derniers jours</MenuItem>
            <MenuItem value="90d">3 derniers mois</MenuItem>
            <MenuItem value="1y">1 an</MenuItem>
          </Select>
        </FormControl>

        {/* Boutons d'action */}
        <Stack direction="row" spacing={1} sx={{ ml: "auto" }}>
          {onRefresh && (
            <Button variant="outlined" size="small" onClick={onRefresh}>
              Actualiser
            </Button>
          )}

          {onExportExcel && (
            <Button
              variant="outlined"
              size="small"
              startIcon={<GetAppIcon />}
              onClick={onExportExcel}
            >
              Excel
            </Button>
          )}

          {onExportPDF && (
            <Button
              variant="outlined"
              size="small"
              startIcon={<GetAppIcon />}
              onClick={onExportPDF}
            >
              PDF
            </Button>
          )}
        </Stack>
      </Stack>
    </Box>
  );
};
