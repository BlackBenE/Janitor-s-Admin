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
            <InfoIcon /> Basic Information
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
                  Property ID
                </Typography>
                <Typography variant="body1" gutterBottom>
                  {property?.id}
                </Typography>
              </Box>
              <Box sx={{ flex: 1 }}>
                <Typography variant="subtitle2" color="text.secondary">
                  Title
                </Typography>
                <Typography variant="body1" gutterBottom>
                  {property?.title || "N/A"}
                </Typography>
              </Box>
            </Box>
            <Box>
              <Typography variant="subtitle2" color="text.secondary">
                Description
              </Typography>
              <Typography variant="body1" gutterBottom>
                {property?.description || "No description provided"}
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
                  Nightly Rate
                </Typography>
                <Typography variant="body1" gutterBottom>
                  {property?.nightly_rate ? `€${property.nightly_rate}` : "N/A"}
                </Typography>
              </Box>
              <Box sx={{ flex: 1 }}>
                <Typography variant="subtitle2" color="text.secondary">
                  Maximum Capacity
                </Typography>
                <Typography variant="body1" gutterBottom>
                  {property?.capacity ? `${property.capacity} guests` : "N/A"}
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
                  Images Count
                </Typography>
                <Typography variant="body1" gutterBottom>
                  {property?.images && property.images.length > 0
                    ? `${property.images.length} image(s)`
                    : "No images uploaded"}
                </Typography>
              </Box>
              <Box sx={{ flex: 1 }}>
                <Typography variant="subtitle2" color="text.secondary">
                  Owner ID
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
                  Bedrooms
                </Typography>
                <Typography variant="body1" gutterBottom>
                  {property?.bedrooms !== null ? property.bedrooms : "N/A"}
                </Typography>
              </Box>
              <Box sx={{ flex: 1 }}>
                <Typography variant="subtitle2" color="text.secondary">
                  Bathrooms
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
                  Created Date
                </Typography>
                <Typography variant="body1" gutterBottom>
                  {property?.created_at
                    ? new Date(property.created_at).toLocaleDateString()
                    : "N/A"}
                </Typography>
              </Box>
              <Box sx={{ flex: 1 }}>
                <Typography variant="subtitle2" color="text.secondary">
                  Last Updated
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
            <LocationIcon /> Location
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
                  Address
                </Typography>
                <Typography variant="body1" gutterBottom>
                  {property?.address || LABELS.common.messages.noAddress}
                </Typography>
              </Box>
              <Box sx={{ flex: 1 }}>
                <Typography variant="subtitle2" color="text.secondary">
                  City
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
                  Postal Code
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
            <StarIcon /> Amenities & Features
          </Typography>
        </AccordionSummary>
        <AccordionDetails>
          <Stack spacing={2}>
            <Box>
              <Typography variant="subtitle2" color="text.secondary">
                Available Amenities
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
                    No amenities listed
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
            <VerifiedIcon /> Validation Status
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
                  Status
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
                    {property?.validation_status || "Pending"}
                  </Typography>
                </Box>
              </Box>
              <Box sx={{ flex: 1 }}>
                <Typography variant="subtitle2" color="text.secondary">
                  Validated Date
                </Typography>
                <Typography variant="body1" gutterBottom>
                  {property?.validated_at
                    ? new Date(property.validated_at).toLocaleDateString()
                    : "Not validated"}
                </Typography>
              </Box>
            </Box>

            {property?.validator && (
              <Box>
                <Typography variant="subtitle2" color="text.secondary">
                  Validated By
                </Typography>
                <Typography variant="body1">
                  {`${property.validator.first_name || ""} ${
                    property.validator.last_name || ""
                  }`.trim() || "Unknown Admin"}
                </Typography>
                <Typography variant="caption" color="text.secondary">
                  {property.validator.email}
                </Typography>
              </Box>
            )}

            {property?.moderation_notes && (
              <Box>
                <Typography variant="subtitle2" color="text.secondary">
                  Moderation Notes
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
            <CalendarIcon /> Availability Calendar
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
                      No availability periods configured
                    </Typography>
                  );
                }

                return (
                  <Stack spacing={2}>
                    <Typography variant="body2" color="text.secondary">
                      {calendarData.length} availability period(s) configured
                    </Typography>

                    <TableContainer component={Paper} variant="outlined">
                      <Table size="small">
                        <TableHead>
                          <TableRow>
                            <TableCell>
                              <strong>Period</strong>
                            </TableCell>
                            <TableCell>
                              <strong>Status</strong>
                            </TableCell>
                            <TableCell>
                              <strong>Reason</strong>
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
                                        ? "Available"
                                        : "Unavailable"
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
                                    {period.reason || "No reason provided"}
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
                      Error parsing calendar data
                    </Typography>
                    <Typography variant="caption" color="text.secondary">
                      Raw data:{" "}
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
              No availability calendar configured
            </Typography>
          )}
        </AccordionDetails>
      </Accordion>
    </>
  );
};
