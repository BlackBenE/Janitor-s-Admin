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
  Person as PersonIcon,
} from "@mui/icons-material";

import { PropertyWithOwner } from "../../../types";

interface PropertyOwnerInfoProps {
  property: PropertyWithOwner;
}

export const PropertyOwnerInfo: React.FC<PropertyOwnerInfoProps> = ({
  property,
}) => {
  return (
    <Accordion>
      <AccordionSummary expandIcon={<ExpandMoreIcon />}>
        <Typography
          variant="h6"
          sx={{ display: "flex", alignItems: "center", gap: 1 }}
        >
          <PersonIcon /> Owner Information
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
                Owner Name
              </Typography>
              <Typography variant="body1" gutterBottom>
                {property?.profiles?.full_name || "Unknown Owner"}
              </Typography>
            </Box>
            <Box sx={{ flex: 1 }}>
              <Typography variant="subtitle2" color="text.secondary">
                Email
              </Typography>
              <Typography variant="body1" gutterBottom>
                {property?.profiles?.email || "No email"}
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
                Phone
              </Typography>
              <Typography variant="body1" gutterBottom>
                {property?.profiles?.phone ||
                  property?.owner?.phone ||
                  "No phone"}
              </Typography>
            </Box>
            <Box sx={{ flex: 1 }}>
              <Typography variant="subtitle2" color="text.secondary">
                User ID
              </Typography>
              <Typography variant="body1" gutterBottom>
                {property?.owner_id || "N/A"}
              </Typography>
            </Box>
          </Box>
        </Stack>
      </AccordionDetails>
    </Accordion>
  );
};
