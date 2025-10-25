import React from 'react';
import { Box, Paper } from '@mui/material';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import { DateRange } from '../../../types/analytics';
import { ANALYTICS_LABELS } from '../constants';

interface AnalyticsFiltersSectionProps {
  // Date range
  dateRange: DateRange;
  onDateRangeChange: (range: { from?: Date; to?: Date }) => void;

  // State
  isLoading?: boolean;
}

export const AnalyticsFiltersSection: React.FC<AnalyticsFiltersSectionProps> = ({
  dateRange,
  onDateRangeChange,
  isLoading = false,
}) => {
  return (
    <Paper elevation={1} sx={{ p: 3, mb: 3 }}>
      <Box
        sx={{
          display: 'flex',
          gap: 2,
          alignItems: 'center',
          flexWrap: 'wrap',
        }}
      >
        {/* Section des filtres de date */}
        <DatePicker
          label={ANALYTICS_LABELS.filters.startDate}
          value={dateRange.from}
          onChange={(newValue: Date | null) => newValue && onDateRangeChange({ from: newValue })}
          slotProps={{
            textField: { size: 'small', sx: { minWidth: 150 } },
          }}
          disabled={isLoading}
        />

        <DatePicker
          label={ANALYTICS_LABELS.filters.endDate}
          value={dateRange.to}
          onChange={(newValue: Date | null) => newValue && onDateRangeChange({ to: newValue })}
          slotProps={{
            textField: { size: 'small', sx: { minWidth: 150 } },
          }}
          disabled={isLoading}
        />
      </Box>
    </Paper>
  );
};
