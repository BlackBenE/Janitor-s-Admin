import React from "react";
import {
  Accordion,
  AccordionSummary,
  AccordionDetails,
  Typography,
  Stack,
  Box,
  Chip,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
} from "@mui/material";
import {
  ExpandMore as ExpandMoreIcon,
  Info as InfoIcon,
  LocationOn as LocationIcon,
  CalendarToday as CalendarIcon,
  Hotel as HotelIcon,
  People as PeopleIcon,
  Star as StarIcon,
  Verified as VerifiedIcon,
} from "@mui/icons-material";

import { PropertyWithOwner } from "../../../types";
import { LABELS } from "../../../constants/labels";
import { getStatusLabel } from "../../../utils/statusHelpers";

interface PropertyBasicInfoProps {
  property: PropertyWithOwner;
}

export const PropertyBasicInfo: React.FC<PropertyBasicInfoProps> = ({
  property,
}) => {
  return (
    <>
      {/* Basic Information */}
      <Accordion defaultExpanded>
        <AccordionSummary expandIcon={<ExpandMoreIcon />}>
          <Typography
            variant="h6"
            sx={{ display: "flex", alignItems: "center", gap: 1 }}
          >
            <InfoIcon /> {LABELS.propertyApprovals.modals.sections.basicInfo}
          </Typography>
        </AccordionSummary>
        <AccordionDetails>
          <Stack spacing={2}>
            <Box
              sx={{
                display: "flex",
                gap: 2,
                flexDirection: { xs: "column", sm: "row" },
              }}
            >
              <Box sx={{ flex: 1 }}>
                <Typography variant="subtitle2" color="text.secondary">
                  {LABELS.propertyApprovals.modals.fields.propertyId}
                </Typography>
                <Typography variant="body1" gutterBottom>
                  {property?.id}
                </Typography>
              </Box>
              <Box sx={{ flex: 1 }}>
                <Typography variant="subtitle2" color="text.secondary">
                  {LABELS.propertyApprovals.modals.fields.title}
                </Typography>
                <Typography variant="body1" gutterBottom>
                  {property?.title || "N/A"}
                </Typography>
              </Box>
            </Box>
            <Box>
              <Typography variant="subtitle2" color="text.secondary">
                {LABELS.propertyApprovals.modals.fields.description}
              </Typography>
              <Typography variant="body1" gutterBottom>
                {property?.description ||
                  LABELS.propertyApprovals.modals.placeholders.noDescription}
              </Typography>
            </Box>
            <Box
              sx={{
                display: "flex",
                gap: 2,
                flexDirection: { xs: "column", sm: "row" },
              }}
            >
              <Box sx={{ flex: 1 }}>
                <Typography variant="subtitle2" color="text.secondary">
                  {LABELS.propertyApprovals.modals.fields.nightlyRate}
                </Typography>
                <Typography variant="body1" gutterBottom>
                  {property?.nightly_rate ? `€${property.nightly_rate}` : "N/A"}
                </Typography>
              </Box>
              <Box sx={{ flex: 1 }}>
                <Typography variant="subtitle2" color="text.secondary">
                  {LABELS.propertyApprovals.modals.fields.maxCapacity}
                </Typography>
                <Typography variant="body1" gutterBottom>
                  {property?.capacity
                    ? `${property.capacity} ${LABELS.propertyApprovals.modals.units.guests}`
                    : "N/A"}
                </Typography>
              </Box>
            </Box>
            <Box
              sx={{
                display: "flex",
                gap: 2,
                flexDirection: { xs: "column", sm: "row" },
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
                    fontFamily: "monospace",
                    fontSize: "0.8rem",
                    color: "text.secondary",
                  }}
                >
                  {property?.owner_id || "N/A"}
                </Typography>
              </Box>
            </Box>
            <Box
              sx={{
                display: "flex",
                gap: 2,
                flexDirection: { xs: "column", sm: "row" },
              }}
            >
              <Box sx={{ flex: 1 }}>
                <Typography variant="subtitle2" color="text.secondary">
                  {LABELS.propertyApprovals.modals.fields.bedrooms}
                </Typography>
                <Typography variant="body1" gutterBottom>
                  {property?.bedrooms !== null ? property.bedrooms : "N/A"}
                </Typography>
              </Box>
              <Box sx={{ flex: 1 }}>
                <Typography variant="subtitle2" color="text.secondary">
                  {LABELS.propertyApprovals.modals.fields.bathrooms}
                </Typography>
                <Typography variant="body1" gutterBottom>
                  {property?.bathrooms !== null ? property.bathrooms : "N/A"}
                </Typography>
              </Box>
            </Box>
            <Box
              sx={{
                display: "flex",
                gap: 2,
                flexDirection: { xs: "column", sm: "row" },
              }}
            >
              <Box sx={{ flex: 1 }}>
                <Typography variant="subtitle2" color="text.secondary">
                  {LABELS.propertyApprovals.modals.fields.createdDate}
                </Typography>
                <Typography variant="body1" gutterBottom>
                  {property?.created_at
                    ? new Date(property.created_at).toLocaleDateString()
                    : "N/A"}
                </Typography>
              </Box>
              <Box sx={{ flex: 1 }}>
                <Typography variant="subtitle2" color="text.secondary">
                  {LABELS.propertyApprovals.modals.fields.lastUpdated}
                </Typography>
                <Typography variant="body1" gutterBottom>
                  {property?.updated_at
                    ? new Date(property.updated_at).toLocaleDateString()
                    : "N/A"}
                </Typography>
              </Box>
            </Box>
          </Stack>
        </AccordionDetails>
      </Accordion>

      {/* Location Details */}
      <Accordion defaultExpanded>
        <AccordionSummary expandIcon={<ExpandMoreIcon />}>
          <Typography
            variant="h6"
            sx={{ display: "flex", alignItems: "center", gap: 1 }}
          >
            <LocationIcon /> {LABELS.propertyApprovals.modals.sections.location}
          </Typography>
        </AccordionSummary>
        <AccordionDetails>
          <Stack spacing={2}>
            <Box
              sx={{
                display: "flex",
                gap: 2,
                flexDirection: { xs: "column", sm: "row" },
              }}
            >
              <Box sx={{ flex: 1 }}>
                <Typography variant="subtitle2" color="text.secondary">
                  {LABELS.propertyApprovals.modals.fields.address}
                </Typography>
                <Typography variant="body1" gutterBottom>
                  {property?.address || LABELS.common.messages.noAddress}
                </Typography>
              </Box>
              <Box sx={{ flex: 1 }}>
                <Typography variant="subtitle2" color="text.secondary">
                  {LABELS.propertyApprovals.modals.fields.city}
                </Typography>
                <Typography variant="body1" gutterBottom>
                  {property?.city || "N/A"}
                </Typography>
              </Box>
            </Box>
            <Box
              sx={{
                display: "flex",
                gap: 2,
                flexDirection: { xs: "column", sm: "row" },
              }}
            >
              {/* Country field supprimé - n'existe pas dans le schéma Supabase */}
              <Box sx={{ flex: 1 }}>
                <Typography variant="subtitle2" color="text.secondary">
                  {LABELS.propertyApprovals.modals.fields.postalCode}
                </Typography>
                <Typography variant="body1" gutterBottom>
                  {property?.postal_code || "N/A"}
                </Typography>
              </Box>
            </Box>
          </Stack>
        </AccordionDetails>
      </Accordion>

      {/* Property Amenities */}
      <Accordion>
        <AccordionSummary expandIcon={<ExpandMoreIcon />}>
          <Typography
            variant="h6"
            sx={{ display: "flex", alignItems: "center", gap: 1 }}
          >
            <StarIcon /> {LABELS.propertyApprovals.modals.sections.amenities}
          </Typography>
        </AccordionSummary>
        <AccordionDetails>
          <Stack spacing={2}>
            <Box>
              <Typography variant="subtitle2" color="text.secondary">
                {LABELS.propertyApprovals.modals.fields.availableAmenities}
              </Typography>
              <Box sx={{ display: "flex", flexWrap: "wrap", gap: 1, mt: 1 }}>
                {property?.amenities && property.amenities.length > 0 ? (
                  property.amenities.map((amenity, index) => (
                    <Chip
                      key={index}
                      label={amenity}
                      variant="outlined"
                      size="small"
                      color="primary"
                    />
                  ))
                ) : (
                  <Typography variant="body2" color="text.secondary">
                    {
                      LABELS.propertyApprovals.modals.placeholders
                        .noAmenitiesListed
                    }
                  </Typography>
                )}
              </Box>
            </Box>
          </Stack>
        </AccordionDetails>
      </Accordion>

      {/* Validation & Status Information */}
      <Accordion>
        <AccordionSummary expandIcon={<ExpandMoreIcon />}>
          <Typography
            variant="h6"
            sx={{ display: "flex", alignItems: "center", gap: 1 }}
          >
            <VerifiedIcon />{" "}
            {LABELS.propertyApprovals.modals.sections.validation}
          </Typography>
        </AccordionSummary>
        <AccordionDetails>
          <Stack spacing={2}>
            <Box
              sx={{
                display: "flex",
                gap: 2,
                flexDirection: { xs: "column", sm: "row" },
              }}
            >
              <Box sx={{ flex: 1 }}>
                <Typography variant="subtitle2" color="text.secondary">
                  {LABELS.propertyApprovals.modals.fields.status}
                </Typography>
                <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                  <Typography
                    variant="body1"
                    sx={{
                      px: 1.5,
                      py: 0.5,
                      borderRadius: 1,
                      bgcolor:
                        property?.validation_status === "approved"
                          ? "success.100"
                          : property?.validation_status === "rejected"
                          ? "error.100"
                          : "warning.100",
                      color:
                        property?.validation_status === "approved"
                          ? "success.800"
                          : property?.validation_status === "rejected"
                          ? "error.800"
                          : "warning.800",
                      fontWeight: 500,
                      textTransform: "capitalize",
                    }}
                  >
                    {getStatusLabel(property?.validation_status, "property")}
                  </Typography>
                </Box>
              </Box>
              <Box sx={{ flex: 1 }}>
                <Typography variant="subtitle2" color="text.secondary">
                  {LABELS.propertyApprovals.modals.fields.validatedDate}
                </Typography>
                <Typography variant="body1" gutterBottom>
                  {property?.validated_at
                    ? new Date(property.validated_at).toLocaleDateString()
                    : LABELS.propertyApprovals.modals.placeholders.notValidated}
                </Typography>
              </Box>
            </Box>

            {property?.validator && (
              <Box>
                <Typography variant="subtitle2" color="text.secondary">
                  {LABELS.propertyApprovals.modals.fields.validatedBy}
                </Typography>
                <Typography variant="body1">
                  {`${property.validator.first_name || ""} ${
                    property.validator.last_name || ""
                  }`.trim() || LABELS.propertyApprovals.modals.unknownAdmin}
                </Typography>
                <Typography variant="caption" color="text.secondary">
                  {property.validator.email}
                </Typography>
              </Box>
            )}

            {property?.moderation_notes && (
              <Box>
                <Typography variant="subtitle2" color="text.secondary">
                  {LABELS.propertyApprovals.modals.fields.moderationNotes}
                </Typography>
                <Typography
                  variant="body2"
                  sx={{
                    bgcolor: "grey.50",
                    p: 2,
                    borderRadius: 1,
                    border: 1,
                    borderColor: "grey.200",
                    fontStyle: "italic",
                  }}
                >
                  {property.moderation_notes}
                </Typography>
              </Box>
            )}
          </Stack>
        </AccordionDetails>
      </Accordion>

      {/* Availability Calendar Information */}
      <Accordion>
        <AccordionSummary expandIcon={<ExpandMoreIcon />}>
          <Typography
            variant="h6"
            sx={{ display: "flex", alignItems: "center", gap: 1 }}
          >
            <CalendarIcon />{" "}
            {LABELS.propertyApprovals.modals.sections.availability}
          </Typography>
        </AccordionSummary>
        <AccordionDetails>
          {property?.availability_calendar ? (
            (() => {
              try {
                // Parse the availability calendar data
                const calendarData = Array.isArray(
                  property.availability_calendar
                )
                  ? property.availability_calendar
                  : JSON.parse(property.availability_calendar as string);

                if (!Array.isArray(calendarData) || calendarData.length === 0) {
                  return (
                    <Typography variant="body2" color="text.secondary">
                      {LABELS.propertyApprovals.modals.calendar.noPeriods}
                    </Typography>
                  );
                }

                return (
                  <Stack spacing={2}>
                    <Typography variant="body2" color="text.secondary">
                      {LABELS.propertyApprovals.modals.calendar.periodsConfigured.replace(
                        "{{count}}",
                        calendarData.length.toString()
                      )}
                    </Typography>

                    <TableContainer component={Paper} variant="outlined">
                      <Table size="small">
                        <TableHead>
                          <TableRow>
                            <TableCell>
                              <strong>
                                {
                                  LABELS.propertyApprovals.modals.calendar
                                    .period
                                }
                              </strong>
                            </TableCell>
                            <TableCell>
                              <strong>
                                {
                                  LABELS.propertyApprovals.modals.calendar
                                    .status
                                }
                              </strong>
                            </TableCell>
                            <TableCell>
                              <strong>
                                {
                                  LABELS.propertyApprovals.modals.calendar
                                    .reason
                                }
                              </strong>
                            </TableCell>
                          </TableRow>
                        </TableHead>
                        <TableBody>
                          {calendarData.map((period: any, index: number) => {
                            const startDate = period.start
                              ? new Date(period.start).toLocaleDateString()
                              : "N/A";
                            const endDate = period.end
                              ? new Date(period.end).toLocaleDateString()
                              : "N/A";

                            return (
                              <TableRow key={index}>
                                <TableCell>
                                  <Typography variant="body2">
                                    {startDate} - {endDate}
                                  </Typography>
                                </TableCell>
                                <TableCell>
                                  <Chip
                                    size="small"
                                    label={
                                      period.available
                                        ? LABELS.propertyApprovals.modals
                                            .calendar.available
                                        : LABELS.propertyApprovals.modals
                                            .calendar.unavailable
                                    }
                                    color={
                                      period.available ? "success" : "error"
                                    }
                                    variant="outlined"
                                  />
                                </TableCell>
                                <TableCell>
                                  <Typography
                                    variant="body2"
                                    color="text.secondary"
                                  >
                                    {period.reason ||
                                      LABELS.propertyApprovals.modals.calendar
                                        .noReason}
                                  </Typography>
                                </TableCell>
                              </TableRow>
                            );
                          })}
                        </TableBody>
                      </Table>
                    </TableContainer>
                  </Stack>
                );
              } catch (error) {
                return (
                  <Stack spacing={1}>
                    <Typography variant="body2" color="error">
                      {LABELS.propertyApprovals.modals.calendar.parseError}
                    </Typography>
                    <Typography variant="caption" color="text.secondary">
                      {LABELS.propertyApprovals.modals.calendar.rawData}{" "}
                      {JSON.stringify(property.availability_calendar).substring(
                        0,
                        100
                      )}
                      ...
                    </Typography>
                  </Stack>
                );
              }
            })()
          ) : (
            <Typography variant="body2" color="text.secondary">
              {LABELS.propertyApprovals.modals.calendar.noCalendar}
            </Typography>
          )}
        </AccordionDetails>
      </Accordion>
    </>
  );
};
