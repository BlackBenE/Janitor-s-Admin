import React from 'react';
import {
  Accordion,
  AccordionSummary,
  AccordionDetails,
  Typography,
  Stack,
  Box,
} from '@mui/material';
import { ExpandMore as ExpandMoreIcon, Info as InfoIcon } from '@mui/icons-material';

import { PropertyWithOwner } from '@/types';
import { LABELS } from '@/core/config/labels';
import { getStatusLabel } from '@/utils/statusHelpers';

interface PropertyGeneralInfoProps {
  property: PropertyWithOwner;
}

export const PropertyGeneralInfo: React.FC<PropertyGeneralInfoProps> = ({ property }) => {
  return (
    <Accordion defaultExpanded>
      <AccordionSummary expandIcon={<ExpandMoreIcon />}>
        <Typography variant="h6" sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
          <InfoIcon /> {LABELS.propertyApprovals.modals.sections.basicInfo}
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
                {LABELS.propertyApprovals.modals.fields.propertyTitle}
              </Typography>
              <Typography variant="body1" gutterBottom>
                {property?.title || LABELS.propertyApprovals.modals.placeholders.noTitle}
              </Typography>
            </Box>
            <Box sx={{ flex: 1 }}>
              <Typography variant="subtitle2" color="text.secondary">
                {LABELS.propertyApprovals.modals.fields.city}
              </Typography>
              <Typography variant="body1" gutterBottom>
                {property?.city || 'N/A'}
              </Typography>
            </Box>
          </Box>

          <Box>
            <Typography variant="subtitle2" color="text.secondary">
              {LABELS.propertyApprovals.modals.fields.description}
            </Typography>
            <Typography variant="body1" gutterBottom>
              {property?.description || LABELS.propertyApprovals.modals.placeholders.noDescription}
            </Typography>
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
                {LABELS.propertyApprovals.modals.fields.nightlyRate}
              </Typography>
              <Typography variant="body1" gutterBottom>
                {property?.nightly_rate
                  ? `$${property.nightly_rate}${LABELS.propertyApprovals.modals.units.perNight}`
                  : LABELS.propertyApprovals.modals.placeholders.priceNotSet}
              </Typography>
            </Box>
            <Box sx={{ flex: 1 }}>
              <Typography variant="subtitle2" color="text.secondary">
                {LABELS.propertyApprovals.modals.fields.maxCapacity}
              </Typography>
              <Typography variant="body1" gutterBottom>
                {property?.capacity
                  ? `${property.capacity} ${LABELS.propertyApprovals.modals.units.guests}`
                  : 'N/A'}
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
                {LABELS.propertyApprovals.modals.fields.imagesCount}
              </Typography>
              <Typography variant="body1" gutterBottom>
                {property?.images && property.images.length > 0
                  ? `${property.images.length} ${LABELS.propertyApprovals.modals.units.images}`
                  : LABELS.propertyApprovals.modals.placeholders.noImages}
              </Typography>
            </Box>
            <Box sx={{ flex: 1 }}>
              <Typography variant="subtitle2" color="text.secondary">
                {LABELS.propertyApprovals.modals.fields.ownerId}
              </Typography>
              <Typography
                variant="body2"
                gutterBottom
                sx={{
                  fontFamily: 'monospace',
                  fontSize: '0.8rem',
                  color: 'text.secondary',
                }}
              >
                {property?.owner_id || 'N/A'}
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
                {LABELS.propertyApprovals.modals.fields.createdAt}
              </Typography>
              <Typography variant="body2" gutterBottom>
                {property?.created_at ? new Date(property.created_at).toLocaleDateString() : 'N/A'}
              </Typography>
            </Box>
            <Box sx={{ flex: 1 }}>
              <Typography variant="subtitle2" color="text.secondary">
                {LABELS.propertyApprovals.modals.fields.updatedAt}
              </Typography>
              <Typography variant="body2" gutterBottom>
                {property?.updated_at ? new Date(property.updated_at).toLocaleDateString() : 'N/A'}
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
                {LABELS.propertyApprovals.modals.fields.validationStatus}
              </Typography>
              <Typography
                variant="body1"
                gutterBottom
                sx={{
                  color:
                    property?.validation_status === 'approved'
                      ? 'success.main'
                      : property?.validation_status === 'rejected'
                        ? 'error.main'
                        : property?.validation_status === 'pending'
                          ? 'warning.main'
                          : 'text.primary',
                  fontWeight: 500,
                }}
              >
                {getStatusLabel(property?.validation_status, 'property')}
              </Typography>
            </Box>
            <Box sx={{ flex: 1 }}>
              <Typography variant="subtitle2" color="text.secondary">
                {LABELS.propertyApprovals.modals.fields.validatedBy}
              </Typography>
              <Typography variant="body2" gutterBottom>
                {property?.validated_by ||
                  LABELS.propertyApprovals.modals.placeholders.notValidated}
              </Typography>
            </Box>
          </Box>

          <Box>
            <Typography variant="subtitle2" color="text.secondary">
              {LABELS.propertyApprovals.modals.fields.moderationNotes}
            </Typography>
            <Typography variant="body2" gutterBottom>
              {property?.moderation_notes ||
                LABELS.propertyApprovals.modals.placeholders.noModerationNotes}
            </Typography>
          </Box>
        </Stack>
      </AccordionDetails>
    </Accordion>
  );
};
