import React, { useState } from 'react';
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
  Card,
  CardMedia,
  CardActions,
  Button,
  CircularProgress,
  Alert,
} from '@mui/material';
import {
  ExpandMore as ExpandMoreIcon,
  Edit as EditIcon,
  LocationOn as LocationIcon,
  Add as AddIcon,
  Close as CloseIcon,
  Image as ImageIcon,
  Delete as DeleteIcon,
  CloudUpload as UploadIcon,
} from '@mui/icons-material';

import { Property } from '@/types';
import { COMMON_LABELS } from "@/shared/constants";
import { PROPERTY_APPROVALS_LABELS } from "../constants";
import { PropertyImageService } from '@/core/services/property-image.service';

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
    title: property.title || '',
    description: property.description || '',
    nightly_rate: property.nightly_rate || 0,
    address: property.address || '',
    city: property.city || '',
    postal_code: property.postal_code || '',
    capacity: property.capacity || 1,
    bedrooms: property.bedrooms || 0,
    bathrooms: property.bathrooms || 0,
    amenities: property.amenities || [],
    images: property.images || [],
  });

  const [newAmenity, setNewAmenity] = useState('');
  const [isUploadingImage, setIsUploadingImage] = useState(false);
  const [uploadError, setUploadError] = useState<string | null>(null);

  const handleInputChange =
    (field: keyof typeof formData) => (event: React.ChangeEvent<HTMLInputElement>) => {
      const value = event.target.value;
      setFormData((prev) => ({
        ...prev,
        [field]:
          field.includes('rate') || field.includes('capacity') || field.includes('rooms')
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
      setNewAmenity('');
    }
  };

  const handleRemoveAmenity = (amenity: string) => {
    setFormData((prev) => ({
      ...prev,
      amenities: prev.amenities.filter((a) => a !== amenity),
    }));
  };

  const handleImageFileChange = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const files = event.target.files;
    if (!files || files.length === 0) return;

    setIsUploadingImage(true);
    setUploadError(null);

    try {
      const file = files[0];
      
      // Validation du fichier
      const validation = PropertyImageService.validateFile(file);
      if (!validation.isValid) {
        setUploadError(validation.error || 'Fichier invalide');
        return;
      }

      // Upload vers Supabase Storage
      const result = await PropertyImageService.uploadPropertyImage(property.id, file);
      
      if (!result.success || !result.url) {
        setUploadError(result.error || "Erreur lors de l'upload");
        return;
      }

      // Ajouter l'URL aux images
      setFormData((prev) => ({
        ...prev,
        images: [...prev.images, result.url!],
      }));

      // Reset input
      event.target.value = '';
    } catch (error) {
      console.error('Image upload error:', error);
      setUploadError("Une erreur inattendue s'est produite");
    } finally {
      setIsUploadingImage(false);
    }
  };

  const handleRemoveImage = async (imageUrl: string) => {
    // Supprimer du formulaire immédiatement
    setFormData((prev) => ({
      ...prev,
      images: prev.images.filter((img) => img !== imageUrl),
    }));

    // Supprimer de Supabase Storage en arrière-plan
    try {
      await PropertyImageService.deletePropertyImage(imageUrl);
    } catch (error) {
      console.error('Error deleting image from storage:', error);
      // On continue même si la suppression échoue
    }
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
          <Typography variant="h6" sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
            <EditIcon /> {PROPERTY_APPROVALS_LABELS.edit.titles.propertyInfo}
          </Typography>
        </AccordionSummary>
        <AccordionDetails>
          <Stack spacing={3}>
            {/* Title */}
            <TextField
              fullWidth
              label={PROPERTY_APPROVALS_LABELS.edit.fields.propertyTitle}
              value={formData.title}
              onChange={handleInputChange('title')}
              required
              disabled={isLoading}
              helperText={PROPERTY_APPROVALS_LABELS.edit.helpers.title}
            />

            {/* Description */}
            <TextField
              fullWidth
              multiline
              rows={4}
              label={PROPERTY_APPROVALS_LABELS.edit.fields.description}
              value={formData.description}
              onChange={handleInputChange('description')}
              disabled={isLoading}
              helperText={PROPERTY_APPROVALS_LABELS.edit.helpers.description}
            />

            {/* Pricing and Capacity */}
            <Box
              sx={{
                display: 'flex',
                gap: 2,
                flexDirection: { xs: 'column', sm: 'row' },
              }}
            >
              <TextField
                sx={{ flex: 1 }}
                label={PROPERTY_APPROVALS_LABELS.edit.fields.nightlyRate}
                type="number"
                value={formData.nightly_rate}
                onChange={handleInputChange('nightly_rate')}
                required
                disabled={isLoading}
                inputProps={{ min: 0, step: 0.01 }}
                helperText={PROPERTY_APPROVALS_LABELS.edit.helpers.pricing}
              />
              <TextField
                sx={{ flex: 1 }}
                label={PROPERTY_APPROVALS_LABELS.edit.fields.maxCapacity}
                type="number"
                value={formData.capacity}
                onChange={handleInputChange('capacity')}
                required
                disabled={isLoading}
                inputProps={{ min: 1, max: 20 }}
                helperText={PROPERTY_APPROVALS_LABELS.edit.helpers.capacity}
              />
            </Box>

            {/* Bedrooms and Bathrooms */}
            <Box
              sx={{
                display: 'flex',
                gap: 2,
                flexDirection: { xs: 'column', sm: 'row' },
              }}
            >
              <TextField
                sx={{ flex: 1 }}
                label={PROPERTY_APPROVALS_LABELS.edit.fields.bedrooms}
                type="number"
                value={formData.bedrooms}
                onChange={handleInputChange('bedrooms')}
                disabled={isLoading}
                inputProps={{ min: 0, max: 20 }}
                helperText={PROPERTY_APPROVALS_LABELS.edit.helpers.bedrooms}
              />
              <TextField
                sx={{ flex: 1 }}
                label={PROPERTY_APPROVALS_LABELS.edit.fields.bathrooms}
                type="number"
                value={formData.bathrooms}
                onChange={handleInputChange('bathrooms')}
                disabled={isLoading}
                inputProps={{ min: 0, max: 20, step: 0.5 }}
                helperText={PROPERTY_APPROVALS_LABELS.edit.helpers.bathrooms}
              />
            </Box>
          </Stack>
        </AccordionDetails>
      </Accordion>

      {/* Location Details - Editable */}
      <Accordion defaultExpanded>
        <AccordionSummary expandIcon={<ExpandMoreIcon />}>
          <Typography variant="h6" sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
            <LocationIcon /> {PROPERTY_APPROVALS_LABELS.edit.titles.location}
          </Typography>
        </AccordionSummary>
        <AccordionDetails>
          <Stack spacing={3}>
            {/* Address */}
            <TextField
              fullWidth
              label={PROPERTY_APPROVALS_LABELS.edit.fields.address}
              value={formData.address}
              onChange={handleInputChange('address')}
              required
              disabled={isLoading}
              helperText={PROPERTY_APPROVALS_LABELS.edit.helpers.address}
            />

            {/* City and Postal Code */}
            <Box
              sx={{
                display: 'flex',
                gap: 2,
                flexDirection: { xs: 'column', sm: 'row' },
              }}
            >
              <TextField
                sx={{ flex: 2 }}
                label={PROPERTY_APPROVALS_LABELS.edit.fields.city}
                value={formData.city}
                onChange={handleInputChange('city')}
                required
                disabled={isLoading}
                helperText={PROPERTY_APPROVALS_LABELS.edit.helpers.city}
              />
              <TextField
                sx={{ flex: 1 }}
                label={PROPERTY_APPROVALS_LABELS.edit.fields.postalCode}
                value={formData.postal_code}
                onChange={handleInputChange('postal_code')}
                disabled={isLoading}
                helperText={PROPERTY_APPROVALS_LABELS.edit.helpers.postalCode}
              />
            </Box>
          </Stack>
        </AccordionDetails>
      </Accordion>

      {/* Amenities - Editable */}
      <Accordion>
        <AccordionSummary expandIcon={<ExpandMoreIcon />}>
          <Typography variant="h6">{PROPERTY_APPROVALS_LABELS.edit.titles.amenities}</Typography>
        </AccordionSummary>
        <AccordionDetails>
          <Stack spacing={2}>
            {/* Add new amenity */}
            <Box sx={{ display: 'flex', gap: 1 }}>
              <TextField
                size="small"
                label={PROPERTY_APPROVALS_LABELS.edit.fields.addAmenity}
                value={newAmenity}
                onChange={(e) => setNewAmenity(e.target.value)}
                disabled={isLoading}
                onKeyPress={(e) => {
                  if (e.key === 'Enter') {
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
            <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1 }}>
              {formData.amenities.map((amenity, index) => (
                <Chip
                  key={index}
                  label={amenity}
                  variant="outlined"
                  onDelete={isLoading ? undefined : () => handleRemoveAmenity(amenity)}
                  deleteIcon={<CloseIcon />}
                />
              ))}
              {formData.amenities.length === 0 && (
                <Typography variant="body2" color="text.secondary">
                  {PROPERTY_APPROVALS_LABELS.edit.messages.noAmenities}
                </Typography>
              )}
            </Box>
          </Stack>
        </AccordionDetails>
      </Accordion>

      {/* Images - NEW SECTION */}
      <Accordion>
        <AccordionSummary expandIcon={<ExpandMoreIcon />}>
          <Typography variant="h6" sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
            <ImageIcon /> Images ({formData.images.length})
          </Typography>
        </AccordionSummary>
        <AccordionDetails>
          <Stack spacing={3}>
            {/* Upload error message */}
            {uploadError && (
              <Alert severity="error" onClose={() => setUploadError(null)}>
                {uploadError}
              </Alert>
            )}

            {/* Upload button */}
            <Box>
              <input
                accept="image/jpeg,image/png,image/webp"
                style={{ display: 'none' }}
                id="property-image-upload"
                type="file"
                onChange={handleImageFileChange}
                disabled={isLoading || isUploadingImage}
              />
              <label htmlFor="property-image-upload">
                <Button
                  variant="contained"
                  component="span"
                  startIcon={isUploadingImage ? <CircularProgress size={20} /> : <UploadIcon />}
                  disabled={isLoading || isUploadingImage}
                  fullWidth
                >
                  {isUploadingImage ? 'Upload en cours...' : 'Ajouter une image'}
                </Button>
              </label>
              <Typography variant="caption" display="block" sx={{ mt: 1, color: 'text.secondary' }}>
                Formats acceptés : JPG, PNG, WebP • Taille max : 10MB
              </Typography>
            </Box>

            {/* Current images */}
            {formData.images.length > 0 ? (
              <Box
                sx={{
                  display: 'grid',
                  gridTemplateColumns: {
                    xs: '1fr',
                    sm: 'repeat(2, 1fr)',
                    md: 'repeat(3, 1fr)',
                  },
                  gap: 2,
                }}
              >
                {formData.images.map((imageUrl, index) => (
                  <Card key={index} sx={{ position: 'relative' }}>
                    <CardMedia
                      component="img"
                      height="200"
                      image={imageUrl}
                      alt={`Image ${index + 1}`}
                      sx={{
                        objectFit: 'cover',
                        backgroundColor: 'grey.200',
                      }}
                      onError={(e) => {
                        (e.target as HTMLImageElement).src =
                          'https://via.placeholder.com/400x300?text=Image+non+disponible';
                      }}
                    />
                    <CardActions sx={{ justifyContent: 'flex-end', p: 1 }}>
                      <IconButton
                        size="small"
                        color="error"
                        onClick={() => handleRemoveImage(imageUrl)}
                        disabled={isLoading}
                        sx={{
                          backgroundColor: 'rgba(255, 255, 255, 0.9)',
                          '&:hover': {
                            backgroundColor: 'rgba(255, 255, 255, 1)',
                          },
                        }}
                      >
                        <DeleteIcon />
                      </IconButton>
                    </CardActions>
                  </Card>
                ))}
              </Box>
            ) : (
              <Box
                sx={{
                  p: 4,
                  textAlign: 'center',
                  border: '2px dashed',
                  borderColor: 'grey.300',
                  borderRadius: 1,
                  backgroundColor: 'grey.50',
                }}
              >
                <ImageIcon sx={{ fontSize: 48, color: 'grey.400', mb: 1 }} />
                <Typography variant="body2" color="text.secondary">
                  Aucune image ajoutée
                </Typography>
                <Typography variant="caption" color="text.secondary">
                  Cliquez sur "Ajouter une image" pour commencer
                </Typography>
              </Box>
            )}
          </Stack>
        </AccordionDetails>
      </Accordion>
    </Box>
  );
};
