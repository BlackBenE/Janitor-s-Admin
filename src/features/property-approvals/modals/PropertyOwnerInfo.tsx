import React from 'react';
import {
  Accordion,
  AccordionSummary,
  AccordionDetails,
  Typography,
  Stack,
  Box,
} from '@mui/material';
import { ExpandMore as ExpandMoreIcon, Person as PersonIcon } from '@mui/icons-material';

import { PropertyWithOwner } from '@/types';
import { COMMON_LABELS } from "@/shared/constants";
import { PROPERTY_APPROVALS_LABELS } from "../constants";

interface PropertyOwnerInfoProps {
  property: PropertyWithOwner;
}

export const PropertyOwnerInfo: React.FC<PropertyOwnerInfoProps> = ({ property }) => {
  return (
    <Accordion>
      <AccordionSummary expandIcon={<ExpandMoreIcon />}>
        <Typography variant="h6" sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
          <PersonIcon /> {PROPERTY_APPROVALS_LABELS.modals.ownerInfo}
        </Typography>
      </AccordionSummary>
      <AccordionDetails>
        <Stack spacing={2}>
          <Box
            sx={{
              display: 'flex',
              gap: 2,
              flexDirection: { xs: 'column', sm: 'row' },
            }}
          >
            <Box sx={{ flex: 1 }}>
              <Typography variant="subtitle2" color="text.secondary">
                {PROPERTY_APPROVALS_LABELS.modals.ownerName}
              </Typography>
              <Typography variant="body1" gutterBottom>
                {property?.profiles?.full_name || PROPERTY_APPROVALS_LABELS.modals.unknownOwner}
              </Typography>
            </Box>
            <Box sx={{ flex: 1 }}>
              <Typography variant="subtitle2" color="text.secondary">
                {COMMON_LABELS.fields.email}
              </Typography>
              <Typography variant="body1" gutterBottom>
                {property?.profiles?.email || PROPERTY_APPROVALS_LABELS.modals.noEmail}
              </Typography>
            </Box>
          </Box>
          <Box
            sx={{
              display: 'flex',
              gap: 2,
              flexDirection: { xs: 'column', sm: 'row' },
            }}
          >
            <Box sx={{ flex: 1 }}>
              <Typography variant="subtitle2" color="text.secondary">
                {COMMON_LABELS.fields.phone}
              </Typography>
              <Typography variant="body1" gutterBottom>
                {property?.profiles?.phone ||
                  property?.owner?.phone ||
                  PROPERTY_APPROVALS_LABELS.modals.noEmail}
              </Typography>
            </Box>
            <Box sx={{ flex: 1 }}>
              <Typography variant="subtitle2" color="text.secondary">
                {PROPERTY_APPROVALS_LABELS.modals.ownerId}
              </Typography>
              <Typography variant="body1" gutterBottom>
                {property?.owner_id || 'N/A'}
              </Typography>
            </Box>
          </Box>
        </Stack>
      </AccordionDetails>
    </Accordion>
  );
};
