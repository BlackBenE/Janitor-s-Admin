/**
 * DataTableSearch Component
 *
 * Barre de recherche avec filtres avancés optionnels.
 * Peut afficher un TextField simple ou inclure un panneau de filtres avancés.
 *
 * @example
 * ```tsx
 * // Recherche simple
 * <DataTableSearch
 *   searchValue={search}
 *   onSearchChange={setSearch}
 *   searchPlaceholder="Rechercher un utilisateur..."
 * />
 *
 * // Avec filtres avancés
 * <DataTableSearch
 *   searchValue={search}
 *   onSearchChange={setSearch}
 *   filters={[
 *     { key: 'role', label: 'Rôle', type: 'select', value: role, options: roleOptions },
 *     { key: 'status', label: 'Statut', type: 'select', value: status, options: statusOptions }
 *   ]}
 *   onFilterChange={(key, value) => updateFilter(key, value)}
 *   showAdvancedFilters={true}
 * />
 * ```
 */

import React, { useState } from 'react';
import {
  Box,
  TextField,
  InputAdornment,
  IconButton,
  Collapse,
  Button,
  MenuItem,
} from '@mui/material';
import {
  Search as SearchIcon,
  FilterList as FilterListIcon,
  Clear as ClearIcon,
} from '@mui/icons-material';
import { DataTableSearchProps, DataTableFilter } from '../data-table.types';

/**
 * Rendu d'un filtre individuel selon son type
 */
const FilterField: React.FC<{
  filter: DataTableFilter;
  onChange: (value: any) => void;
}> = ({ filter, onChange }) => {
  switch (filter.type) {
    case 'select':
      return (
        <TextField
          select
          fullWidth
          size="small"
          label={filter.label}
          value={filter.value || ''}
          onChange={(e) => onChange(e.target.value)}
          placeholder={filter.placeholder}
        >
          <MenuItem value="">
            <em>Tous</em>
          </MenuItem>
          {filter.options?.map((option) => (
            <MenuItem key={option.value} value={option.value}>
              {option.label}
            </MenuItem>
          ))}
        </TextField>
      );

    case 'text':
      return (
        <TextField
          fullWidth
          size="small"
          label={filter.label}
          value={filter.value || ''}
          onChange={(e) => onChange(e.target.value)}
          placeholder={filter.placeholder}
        />
      );

    case 'number':
      return (
        <TextField
          fullWidth
          size="small"
          type="number"
          label={filter.label}
          value={filter.value || ''}
          onChange={(e) => onChange(e.target.value)}
          placeholder={filter.placeholder}
        />
      );

    case 'date':
      return (
        <TextField
          fullWidth
          size="small"
          type="date"
          label={filter.label}
          value={filter.value || ''}
          onChange={(e) => onChange(e.target.value)}
          InputLabelProps={{ shrink: true }}
        />
      );

    default:
      return (
        <TextField
          fullWidth
          size="small"
          label={filter.label}
          value={filter.value || ''}
          onChange={(e) => onChange(e.target.value)}
          placeholder={filter.placeholder}
        />
      );
  }
};

export const DataTableSearch: React.FC<DataTableSearchProps> = ({
  searchValue,
  onSearchChange,
  searchPlaceholder = 'Rechercher...',
  filters = [],
  onFilterChange,
  showAdvancedFilters = false,
  onResetFilters,
  sx,
  className,
}) => {
  const [filtersOpen, setFiltersOpen] = useState(false);

  const hasActiveFilters = filters.some((f) => f.value && f.value !== '');
  const hasFilters = filters.length > 0;

  const handleResetFilters = () => {
    onResetFilters?.();
    filters.forEach((filter) => {
      onFilterChange?.(filter.key, '');
    });
  };

  return (
    <Box className={className} sx={{ mb: 2, ...sx }}>
      {/* Search Bar */}
      <Box sx={{ display: 'flex', gap: 1, alignItems: 'center' }}>
        <TextField
          fullWidth
          size="small"
          placeholder={searchPlaceholder}
          value={searchValue}
          onChange={(e) => onSearchChange(e.target.value)}
          InputProps={{
            startAdornment: (
              <InputAdornment position="start">
                <SearchIcon />
              </InputAdornment>
            ),
            endAdornment: searchValue && (
              <InputAdornment position="end">
                <IconButton size="small" onClick={() => onSearchChange('')} edge="end">
                  <ClearIcon fontSize="small" />
                </IconButton>
              </InputAdornment>
            ),
          }}
        />

        {/* Toggle Advanced Filters Button */}
        {hasFilters && showAdvancedFilters && (
          <IconButton
            color={filtersOpen || hasActiveFilters ? 'primary' : 'default'}
            onClick={() => setFiltersOpen(!filtersOpen)}
            sx={{
              border: '1px solid',
              borderColor: filtersOpen || hasActiveFilters ? 'primary.main' : 'divider',
              borderRadius: 1,
            }}
          >
            <FilterListIcon />
          </IconButton>
        )}

        {/* Reset Filters Button */}
        {hasActiveFilters && (
          <Button
            size="small"
            variant="outlined"
            color="secondary"
            onClick={handleResetFilters}
            startIcon={<ClearIcon />}
          >
            Réinitialiser
          </Button>
        )}
      </Box>

      {/* Advanced Filters Panel */}
      {hasFilters && showAdvancedFilters && (
        <Collapse in={filtersOpen}>
          <Box
            sx={{
              mt: 2,
              p: 2,
              border: '1px solid',
              borderColor: 'divider',
              borderRadius: 2,
              backgroundColor: 'background.default',
            }}
          >
            <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 2 }}>
              {filters.map((filter) => (
                <Box key={filter.key} sx={{ minWidth: 200, flex: '1 1 200px' }}>
                  <FilterField
                    filter={filter}
                    onChange={(value) => onFilterChange?.(filter.key, value)}
                  />
                </Box>
              ))}
            </Box>
          </Box>
        </Collapse>
      )}
    </Box>
  );
};
