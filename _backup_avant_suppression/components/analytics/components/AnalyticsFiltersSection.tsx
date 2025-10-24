import React from "react";
import { Box, Paper, Button, Tooltip, IconButton } from "@mui/material";
import { GetApp, Refresh } from "@mui/icons-material";
import { DatePicker } from "@mui/x-date-pickers/DatePicker";
import { DateRange } from "../../../types/analytics";
import { LABELS } from "../../../constants/labels";

interface AnalyticsFiltersSectionProps {
  // Date range
  dateRange: DateRange;
  onDateRangeChange: (range: { from?: Date; to?: Date }) => void;

  // Actions
  onRefresh: () => void;
  onExport: (format: "csv" | "pdf") => void;

  // State
  isLoading?: boolean;
  hasData?: boolean;
}

export const AnalyticsFiltersSection: React.FC<
  AnalyticsFiltersSectionProps
> = ({
  dateRange,
  onDateRangeChange,
  onRefresh,
  onExport,
  isLoading = false,
  hasData = false,
}) => {
  return (
    <Paper elevation={1} sx={{ p: 3, mb: 3 }}>
      <Box
        sx={{
          display: "flex",
          gap: 2,
          alignItems: "center",
          flexWrap: "wrap",
          justifyContent: "space-between",
        }}
      >
        {/* Section des dates */}
        <Box sx={{ display: "flex", gap: 2, alignItems: "center" }}>
          <DatePicker
            label={LABELS.analytics.filters.startDate}
            value={dateRange.from}
            onChange={(newValue: Date | null) =>
              newValue && onDateRangeChange({ from: newValue })
            }
            slotProps={{
              textField: { size: "small", sx: { minWidth: 150 } },
            }}
          />

          <DatePicker
            label={LABELS.analytics.filters.endDate}
            value={dateRange.to}
            onChange={(newValue: Date | null) =>
              newValue && onDateRangeChange({ to: newValue })
            }
            slotProps={{
              textField: { size: "small", sx: { minWidth: 150 } },
            }}
          />
        </Box>

        {/* Section des exports */}
        <Box sx={{ display: "flex", gap: 1, alignItems: "center" }}>
          <Tooltip title={LABELS.analytics.filters.refreshData}>
            <IconButton onClick={onRefresh} disabled={isLoading}>
              <Refresh />
            </IconButton>
          </Tooltip>

          <Button
            variant="outlined"
            size="small"
            startIcon={<GetApp />}
            onClick={() => onExport("csv")}
            disabled={isLoading || !hasData}
          >
            {LABELS.analytics.export.formats.csv}
          </Button>

          <Button
            variant="outlined"
            size="small"
            startIcon={<GetApp />}
            onClick={() => onExport("pdf")}
            disabled={isLoading || !hasData}
          >
            {LABELS.analytics.export.formats.pdf}
          </Button>
        </Box>
      </Box>
    </Paper>
  );
};
