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

import { Property } from "@/types";
import { LABELS } from "@/core/config/labels";

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
            <EditIcon /> {LABELS.propertyApprovals.edit.titles.propertyInfo}
          </Typography>
        </AccordionSummary>
        <AccordionDetails>
          <Stack spacing={3}>
            {/* Title */}
            <TextField
              fullWidth
              label={LABELS.propertyApprovals.edit.fields.propertyTitle}
              value={formData.title}
              onChange={handleInputChange("title")}
              required
              disabled={isLoading}
              helperText={LABELS.propertyApprovals.edit.helpers.title}
            />

            {/* Description */}
            <TextField
              fullWidth
              multiline
              rows={4}
              label={LABELS.propertyApprovals.edit.fields.description}
              value={formData.description}
              onChange={handleInputChange("description")}
              disabled={isLoading}
              helperText={LABELS.propertyApprovals.edit.helpers.description}
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
                label={LABELS.propertyApprovals.edit.fields.nightlyRate}
                type="number"
                value={formData.nightly_rate}
                onChange={handleInputChange("nightly_rate")}
                required
                disabled={isLoading}
                inputProps={{ min: 0, step: 0.01 }}
                helperText={LABELS.propertyApprovals.edit.helpers.pricing}
              />
              <TextField
                sx={{ flex: 1 }}
                label={LABELS.propertyApprovals.edit.fields.maxCapacity}
                type="number"
                value={formData.capacity}
                onChange={handleInputChange("capacity")}
                required
                disabled={isLoading}
                inputProps={{ min: 1, max: 20 }}
                helperText={LABELS.propertyApprovals.edit.helpers.capacity}
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
                label={LABELS.propertyApprovals.edit.fields.bedrooms}
                type="number"
                value={formData.bedrooms}
                onChange={handleInputChange("bedrooms")}
                disabled={isLoading}
                inputProps={{ min: 0, max: 20 }}
                helperText={LABELS.propertyApprovals.edit.helpers.bedrooms}
              />
              <TextField
                sx={{ flex: 1 }}
                label={LABELS.propertyApprovals.edit.fields.bathrooms}
                type="number"
                value={formData.bathrooms}
                onChange={handleInputChange("bathrooms")}
                disabled={isLoading}
                inputProps={{ min: 0, max: 20, step: 0.5 }}
                helperText={LABELS.propertyApprovals.edit.helpers.bathrooms}
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
            <LocationIcon /> {LABELS.propertyApprovals.edit.titles.location}
          </Typography>
        </AccordionSummary>
        <AccordionDetails>
          <Stack spacing={3}>
            {/* Address */}
            <TextField
              fullWidth
              label={LABELS.propertyApprovals.edit.fields.address}
              value={formData.address}
              onChange={handleInputChange("address")}
              required
              disabled={isLoading}
              helperText={LABELS.propertyApprovals.edit.helpers.address}
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
                label={LABELS.propertyApprovals.edit.fields.city}
                value={formData.city}
                onChange={handleInputChange("city")}
                required
                disabled={isLoading}
                helperText={LABELS.propertyApprovals.edit.helpers.city}
              />
              <TextField
                sx={{ flex: 1 }}
                label={LABELS.propertyApprovals.edit.fields.postalCode}
                value={formData.postal_code}
                onChange={handleInputChange("postal_code")}
                disabled={isLoading}
                helperText={LABELS.propertyApprovals.edit.helpers.postalCode}
              />
            </Box>
          </Stack>
        </AccordionDetails>
      </Accordion>

      {/* Amenities - Editable */}
      <Accordion>
        <AccordionSummary expandIcon={<ExpandMoreIcon />}>
          <Typography variant="h6">
            {LABELS.propertyApprovals.edit.titles.amenities}
          </Typography>
        </AccordionSummary>
        <AccordionDetails>
          <Stack spacing={2}>
            {/* Add new amenity */}
            <Box sx={{ display: "flex", gap: 1 }}>
              <TextField
                size="small"
                label={LABELS.propertyApprovals.edit.fields.addAmenity}
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
                  {LABELS.propertyApprovals.edit.messages.noAmenities}
                </Typography>
              )}
            </Box>
          </Stack>
        </AccordionDetails>
      </Accordion>

      {/* Moderation Notes */}
      <Accordion>
        <AccordionSummary expandIcon={<ExpandMoreIcon />}>
          <Typography variant="h6">
            {LABELS.propertyApprovals.edit.titles.adminNotes}
          </Typography>
        </AccordionSummary>
        <AccordionDetails>
          <TextField
            fullWidth
            multiline
            rows={3}
            label={LABELS.propertyApprovals.edit.fields.moderationNotes}
            value={formData.moderation_notes}
            onChange={handleInputChange("moderation_notes")}
            disabled={isLoading}
            placeholder={LABELS.propertyApprovals.edit.helpers.moderationNotes}
            helperText={LABELS.propertyApprovals.edit.helpers.internalNotes}
          />
        </AccordionDetails>
      </Accordion>
    </Box>
  );
};
