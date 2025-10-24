import React from 'react';
import { Box, Typography, Button, Stack } from '@mui/material';
import { Refresh as RefreshIcon, FileDownload as ExportIcon } from '@mui/icons-material';
import { LABELS } from '@/constants/labels';

interface FinancialHeaderProps {
  onRefresh?: () => void;
  onExport?: (format?: 'csv' | 'pdf' | 'excel') => void;
}

export const FinancialHeader: React.FC<FinancialHeaderProps> = ({ onRefresh, onExport }) => {
  return (
    <Box
      sx={{
        mb: 3,
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'flex-start',
        flexWrap: 'wrap',
        gap: 2,
      }}
    >
      <Box>
        <Typography variant="h4" component="h1" gutterBottom>
          {LABELS.financial.title}
        </Typography>
        <Typography variant="body1" color="text.secondary">
          {LABELS.financial.subtitle}
        </Typography>
      </Box>

      <Stack direction="row" spacing={2}>
        {onRefresh && (
          <Button variant="outlined" startIcon={<RefreshIcon />} onClick={onRefresh}>
            {LABELS.financial.actions.refresh}
          </Button>
        )}
        {onExport && (
          <Button variant="contained" startIcon={<ExportIcon />} onClick={() => onExport('csv')}>
            {LABELS.financial.actions.export}
          </Button>
        )}
      </Stack>
    </Box>
  );
};
