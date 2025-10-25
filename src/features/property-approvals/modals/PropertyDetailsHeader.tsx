import React from 'react';
import { DialogTitle, Box, Typography, Chip } from '@mui/material';
import { Home as HomeIcon } from '@mui/icons-material';

import { Property } from '@/types';
import { getStatusColor } from '@/utils';
import { COMMON_LABELS } from "@/shared/constants";
import { PROPERTY_APPROVALS_LABELS } from "../constants";

interface PropertyDetailsHeaderProps {
  property: Property;
}

export const PropertyDetailsHeader: React.FC<PropertyDetailsHeaderProps> = ({ property }) => {
  return (
    <DialogTitle>
      <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
        <HomeIcon color="primary" />
        <Typography variant="h6">{PROPERTY_APPROVALS_LABELS.modals.title}</Typography>
        <Chip
          label={property?.validation_status || PROPERTY_APPROVALS_LABELS.status.pending}
          color={getStatusColor(property?.validation_status, 'property')}
          size="small"
        />
      </Box>
    </DialogTitle>
  );
};
