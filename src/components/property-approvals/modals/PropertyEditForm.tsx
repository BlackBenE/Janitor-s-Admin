import React, { useState } from "react";
import {
  Accordion,
  AccordionSummary,
  AccordionDetails,
  Typography,
  Stack,
  Box,
  TextField,
  Chip,
  IconButton,
  InputAdornment,
} from "@mui/material";
import {
  ExpandMore as ExpandMoreIcon,
  Edit as EditIcon,
  LocationOn as LocationIcon,
  Add as AddIcon,
  Close as CloseIcon,
} from "@mui/icons-material";

import { Property } from "../../../types";

interface PropertyEditFormProps {
  property: Property;
  onSave: (updates: Partial<Property>) => void;
  onCancel: () => void;
  isLoading?: boolean;
}

export const PropertyEditForm: React.FC<PropertyEditFormProps> = ({
  property,
  onSave,
  onCancel,
  isLoading = false,
}) => {
  const [formData, setFormData] = useState({
    title: property.title || "",
    description: property.description || "",
    nightly_rate: property.nightly_rate || 0,
    address: property.address || "",
    city: property.city || "",
    postal_code: property.postal_code || "",
    capacity: property.capacity || 1,
    bedrooms: property.bedrooms || 0,
    bathrooms: property.bathrooms || 0,
    amenities: property.amenities || [],
    moderation_notes: property.moderation_notes || "",
  });

  const [newAmenity, setNewAmenity] = useState("");

  const handleInputChange =
    (field: keyof typeof formData) =>
    (event: React.ChangeEvent<HTMLInputElement>) => {
      const value = event.target.value;
      setFormData((prev) => ({
        ...prev,
        [field]:
          field.includes("rate") ||
          field.includes("capacity") ||
          field.includes("rooms")
            ? Number(value) || 0
            : value,
      }));
    };

  const handleAddAmenity = () => {
    if (newAmenity.trim() && !formData.amenities.includes(newAmenity.trim())) {
      setFormData((prev) => ({
        ...prev,
        amenities: [...prev.amenities, newAmenity.trim()],
      }));
      setNewAmenity("");
    }
  };

  const handleRemoveAmenity = (amenity: string) => {
    setFormData((prev) => ({
      ...prev,
      amenities: prev.amenities.filter((a) => a !== amenity),
    }));
  };

  const handleSubmit = (event: React.FormEvent) => {
    event.preventDefault();

    // Only send fields that have actually changed
    const updates: Partial<Property> = {};
    Object.entries(formData).forEach(([key, value]) => {
      const originalValue = property[key as keyof Property];
      if (JSON.stringify(value) !== JSON.stringify(originalValue)) {
        (updates as any)[key] = value;
      }
    });

    onSave(updates);
  };

  return (
    <Box component="form" id="property-edit-form" onSubmit={handleSubmit}>
      {/* Basic Information - Editable */}
      <Accordion defaultExpanded>
        <AccordionSummary expandIcon={<ExpandMoreIcon />}>
          <Typography
            variant="h6"
            sx={{ display: "flex", alignItems: "center", gap: 1 }}
          >
            <EditIcon /> Edit Property Information
          </Typography>
        </AccordionSummary>
        <AccordionDetails>
          <Stack spacing={3}>
            {/* Title */}
            <TextField
              fullWidth
              label="Property Title"
              value={formData.title}
              onChange={handleInputChange("title")}
              required
              disabled={isLoading}
              helperText="Clear, descriptive title without excessive capitalization"
            />

            {/* Description */}
            <TextField
              fullWidth
              multiline
              rows={4}
              label="Description"
              value={formData.description}
              onChange={handleInputChange("description")}
              disabled={isLoading}
              helperText="Accurate description without contact information or external links"
            />

            {/* Pricing and Capacity */}
            <Box
              sx={{
                display: "flex",
                gap: 2,
                flexDirection: { xs: "column", sm: "row" },
              }}
            >
              <TextField
                sx={{ flex: 1 }}
                label="Nightly Rate (€)"
                type="number"
                value={formData.nightly_rate}
                onChange={handleInputChange("nightly_rate")}
                required
                disabled={isLoading}
                inputProps={{ min: 0, step: 0.01 }}
                helperText="Market-appropriate pricing"
              />
              <TextField
                sx={{ flex: 1 }}
                label="Maximum Capacity"
                type="number"
                value={formData.capacity}
                onChange={handleInputChange("capacity")}
                required
                disabled={isLoading}
                inputProps={{ min: 1, max: 20 }}
                helperText="Safe occupancy limit"
              />
            </Box>

            {/* Bedrooms and Bathrooms */}
            <Box
              sx={{
                display: "flex",
                gap: 2,
                flexDirection: { xs: "column", sm: "row" },
              }}
            >
              <TextField
                sx={{ flex: 1 }}
                label="Bedrooms"
                type="number"
                value={formData.bedrooms}
                onChange={handleInputChange("bedrooms")}
                disabled={isLoading}
                inputProps={{ min: 0, max: 20 }}
                helperText="Actual bedrooms with privacy"
              />
              <TextField
                sx={{ flex: 1 }}
                label="Bathrooms"
                type="number"
                value={formData.bathrooms}
                onChange={handleInputChange("bathrooms")}
                disabled={isLoading}
                inputProps={{ min: 0, max: 20, step: 0.5 }}
                helperText="Use 0.5 for half baths"
              />
            </Box>
          </Stack>
        </AccordionDetails>
      </Accordion>

      {/* Location Details - Editable */}
      <Accordion defaultExpanded>
        <AccordionSummary expandIcon={<ExpandMoreIcon />}>
          <Typography
            variant="h6"
            sx={{ display: "flex", alignItems: "center", gap: 1 }}
          >
            <LocationIcon /> Edit Location
          </Typography>
        </AccordionSummary>
        <AccordionDetails>
          <Stack spacing={3}>
            {/* Address */}
            <TextField
              fullWidth
              label="Address"
              value={formData.address}
              onChange={handleInputChange("address")}
              required
              disabled={isLoading}
              helperText="General address (avoid specific unit numbers for privacy)"
            />

            {/* City and Postal Code */}
            <Box
              sx={{
                display: "flex",
                gap: 2,
                flexDirection: { xs: "column", sm: "row" },
              }}
            >
              <TextField
                sx={{ flex: 2 }}
                label="City"
                value={formData.city}
                onChange={handleInputChange("city")}
                required
                disabled={isLoading}
                helperText="Standardized city name"
              />
              <TextField
                sx={{ flex: 1 }}
                label="Postal Code"
                value={formData.postal_code}
                onChange={handleInputChange("postal_code")}
                disabled={isLoading}
                helperText="Correct format for country"
              />
            </Box>
          </Stack>
        </AccordionDetails>
      </Accordion>

      {/* Amenities - Editable */}
      <Accordion>
        <AccordionSummary expandIcon={<ExpandMoreIcon />}>
          <Typography variant="h6">Edit Amenities</Typography>
        </AccordionSummary>
        <AccordionDetails>
          <Stack spacing={2}>
            {/* Add new amenity */}
            <Box sx={{ display: "flex", gap: 1 }}>
              <TextField
                size="small"
                label="Add amenity"
                value={newAmenity}
                onChange={(e) => setNewAmenity(e.target.value)}
                disabled={isLoading}
                onKeyPress={(e) => {
                  if (e.key === "Enter") {
                    e.preventDefault();
                    handleAddAmenity();
                  }
                }}
                InputProps={{
                  endAdornment: (
                    <InputAdornment position="end">
                      <IconButton
                        size="small"
                        onClick={handleAddAmenity}
                        disabled={!newAmenity.trim() || isLoading}
                      >
                        <AddIcon />
                      </IconButton>
                    </InputAdornment>
                  ),
                }}
              />
            </Box>

            {/* Current amenities */}
            <Box sx={{ display: "flex", flexWrap: "wrap", gap: 1 }}>
              {formData.amenities.map((amenity, index) => (
                <Chip
                  key={index}
                  label={amenity}
                  variant="outlined"
                  onDelete={
                    isLoading ? undefined : () => handleRemoveAmenity(amenity)
                  }
                  deleteIcon={<CloseIcon />}
                />
              ))}
              {formData.amenities.length === 0 && (
                <Typography variant="body2" color="text.secondary">
                  No amenities listed
                </Typography>
              )}
            </Box>
          </Stack>
        </AccordionDetails>
      </Accordion>

      {/* Moderation Notes */}
      <Accordion>
        <AccordionSummary expandIcon={<ExpandMoreIcon />}>
          <Typography variant="h6">Admin Notes</Typography>
        </AccordionSummary>
        <AccordionDetails>
          <TextField
            fullWidth
            multiline
            rows={3}
            label="Moderation Notes"
            value={formData.moderation_notes}
            onChange={handleInputChange("moderation_notes")}
            disabled={isLoading}
            placeholder="Document changes made and reasons..."
            helperText="Internal notes about modifications and communications"
          />
        </AccordionDetails>
      </Accordion>
    </Box>
  );
};
