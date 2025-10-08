import React from "react";
import {
  Accordion,
  AccordionSummary,
  AccordionDetails,
  Typography,
  Stack,
  Box,
} from "@mui/material";
import {
  ExpandMore as ExpandMoreIcon,
  Info as InfoIcon,
} from "@mui/icons-material";

import { PropertyWithOwner } from "../../../../types";

interface PropertyGeneralInfoProps {
  property: PropertyWithOwner;
}

export const PropertyGeneralInfo: React.FC<PropertyGeneralInfoProps> = ({
  property,
}) => {
  return (
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
                Property Title
              </Typography>
              <Typography variant="body1" gutterBottom>
                {property?.title || "No title provided"}
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
                {property?.nightly_rate
                  ? `$${property.nightly_rate}/night`
                  : "Price not set"}
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
                Created At
              </Typography>
              <Typography variant="body2" gutterBottom>
                {property?.created_at
                  ? new Date(property.created_at).toLocaleDateString()
                  : "N/A"}
              </Typography>
            </Box>
            <Box sx={{ flex: 1 }}>
              <Typography variant="subtitle2" color="text.secondary">
                Updated At
              </Typography>
              <Typography variant="body2" gutterBottom>
                {property?.updated_at
                  ? new Date(property.updated_at).toLocaleDateString()
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
                Validation Status
              </Typography>
              <Typography
                variant="body1"
                gutterBottom
                sx={{
                  color:
                    property?.validation_status === "approved"
                      ? "success.main"
                      : property?.validation_status === "rejected"
                      ? "error.main"
                      : property?.validation_status === "pending"
                      ? "warning.main"
                      : "text.primary",
                  fontWeight: 500,
                }}
              >
                {property?.validation_status || "N/A"}
              </Typography>
            </Box>
            <Box sx={{ flex: 1 }}>
              <Typography variant="subtitle2" color="text.secondary">
                Validated By
              </Typography>
              <Typography variant="body2" gutterBottom>
                {property?.validated_by || "Not validated"}
              </Typography>
            </Box>
          </Box>

          <Box>
            <Typography variant="subtitle2" color="text.secondary">
              Moderation Notes
            </Typography>
            <Typography variant="body2" gutterBottom>
              {property?.moderation_notes || "No moderation notes"}
            </Typography>
          </Box>
        </Stack>
      </AccordionDetails>
    </Accordion>
  );
};
