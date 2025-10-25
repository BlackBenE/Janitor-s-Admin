import React, { useState } from "react";
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  TextField,
  MenuItem,
  FormControlLabel,
  Switch,
  Box,
  IconButton,
  Typography,
  CircularProgress,
  Stack,
  Autocomplete,
  Chip,
  Alert,
} from "@mui/material";
import {
  Close as CloseIcon,
  Save as SaveIcon,
  CloudUpload as UploadIcon,
  Delete as DeleteIcon,
} from "@mui/icons-material";
import { useProviders } from "../hooks";
import { ServiceImageService } from "@/core/services/service-image.service";

interface ServiceCreateModalProps {
  open: boolean;
  onClose: () => void;
  onCreate: (serviceData: any) => Promise<void>;
  isLoading?: boolean;
}

const SERVICE_CATEGORIES = [
  "Ménage",
  "Conciergerie",
  "Maintenance",
  "Jardinage",
  "Plomberie",
  "Électricité",
  "Peinture",
  "Déménagement",
  "Autre",
];

const PRICE_TYPES = [
  { value: "fixed", label: "Prix fixe" },
  { value: "hourly", label: "Prix horaire" },
  { value: "per_service", label: "Prix par prestation" },
];

const COMMON_TAGS = [
  "Urgent",
  "Disponible week-end",
  "Eco-responsable",
  "Premium",
  "Équipement fourni",
  "Garantie qualité",
];

export const ServiceCreateModal: React.FC<ServiceCreateModalProps> = ({
  open,
  onClose,
  onCreate,
  isLoading = false,
}) => {
  // Récupérer la liste des prestataires
  const { data: providers = [], isLoading: isLoadingProviders } = useProviders({
    enabled: open, // Charger uniquement quand la modale est ouverte
  });

  // Filtrer uniquement les prestataires (role = service_provider)
  const serviceProviders = providers.filter(
    (provider) => provider.id // Tous les providers retournés sont déjà des service_provider
  );

  const [formData, setFormData] = useState({
    name: "",
    description: "",
    category: "",
    base_price: "",
    provider_id: "",
    duration_minutes: "",
    price_type: "",
    image_url: "",
    tags: [] as string[],
    is_active: true,
    is_vip_only: false,
  });

  const [errors, setErrors] = useState<Record<string, string>>({});
  const [isUploadingImage, setIsUploadingImage] = useState(false);
  const [uploadError, setUploadError] = useState<string | null>(null);

  const handleChange = (field: string, value: any) => {
    setFormData((prev) => ({
      ...prev,
      [field]: value,
    }));
    // Clear error when user starts typing
    if (errors[field]) {
      setErrors((prev) => {
        const newErrors = { ...prev };
        delete newErrors[field];
        return newErrors;
      });
    }
  };

  const handleImageUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const files = event.target.files;
    if (!files || files.length === 0) return;

    setIsUploadingImage(true);
    setUploadError(null);

    try {
      const file = files[0];
      
      // Validation du fichier
      const validation = ServiceImageService.validateFile(file);
      if (!validation.isValid) {
        setUploadError(validation.error || 'Fichier invalide');
        return;
      }

      // Upload vers Supabase Storage
      const result = await ServiceImageService.uploadServiceImage(file);
      
      if (!result.success || !result.url) {
        setUploadError(result.error || "Erreur lors de l'upload");
        return;
      }

      // Mettre à jour l'URL de l'image
      handleChange("image_url", result.url);

      // Reset input
      event.target.value = '';
    } catch (error) {
      console.error('Image upload error:', error);
      setUploadError("Une erreur inattendue s'est produite");
    } finally {
      setIsUploadingImage(false);
    }
  };

  const handleRemoveImage = async () => {
    if (!formData.image_url) return;

    // Supprimer de Supabase Storage
    try {
      await ServiceImageService.deleteServiceImage(formData.image_url);
    } catch (error) {
      console.error('Error deleting image:', error);
    }

    // Supprimer du formulaire
    handleChange("image_url", "");
    setUploadError(null);
  };

  const validateForm = () => {
    const newErrors: Record<string, string> = {};

    if (!formData.name.trim()) {
      newErrors.name = "Le nom du service est requis";
    }

    if (!formData.provider_id) {
      newErrors.provider_id = "Le prestataire est requis";
    }

    if (!formData.category) {
      newErrors.category = "La catégorie est requise";
    }

    if (!formData.base_price || parseFloat(formData.base_price) <= 0) {
      newErrors.base_price = "Le prix doit être supérieur à 0";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleCreate = async () => {
    if (!validateForm()) {
      return;
    }

    const serviceData = {
      name: formData.name.trim(),
      description: formData.description.trim() || null,
      category: formData.category,
      base_price: parseFloat(formData.base_price),
      provider_id: formData.provider_id,
      duration_minutes: formData.duration_minutes ? parseInt(formData.duration_minutes) : null,
      price_type: formData.price_type || null,
      image_url: formData.image_url.trim() || null,
      tags: formData.tags.length > 0 ? formData.tags : null,
      is_active: formData.is_active,
      is_vip_only: formData.is_vip_only,
    };

    await onCreate(serviceData);
  };

  const handleClose = () => {
    // Reset form
    setFormData({
      name: "",
      description: "",
      category: "",
      base_price: "",
      provider_id: "",
      duration_minutes: "",
      price_type: "",
      image_url: "",
      tags: [],
      is_active: true,
      is_vip_only: false,
    });
    setErrors({});
    onClose();
  };

  return (
    <Dialog
      open={open}
      onClose={handleClose}
      maxWidth="md"
      fullWidth
      sx={{ "& .MuiDialog-paper": { maxHeight: "90vh" } }}
    >
      <DialogTitle
        sx={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          borderBottom: 1,
          borderColor: "divider",
          pb: 2,
        }}
      >
        <Typography variant="h6" component="div">
          Créer un nouveau service
        </Typography>
        <IconButton
          onClick={handleClose}
          disabled={isLoading}
          size="small"
          sx={{ color: "text.secondary" }}
        >
          <CloseIcon />
        </IconButton>
      </DialogTitle>

      <DialogContent dividers sx={{ pt: 3 }}>
        <Stack spacing={3}>
          {/* Nom du service */}
          <TextField
            fullWidth
            label="Nom du service"
            value={formData.name}
            onChange={(e) => handleChange("name", e.target.value)}
            error={!!errors.name}
            helperText={errors.name}
            required
            disabled={isLoading}
          />

          {/* Description */}
          <TextField
            fullWidth
            label="Description"
            value={formData.description}
            onChange={(e) => handleChange("description", e.target.value)}
            multiline
            rows={4}
            disabled={isLoading}
          />

          {/* Sélection du prestataire */}
          <TextField
            fullWidth
            select
            label="Prestataire"
            value={formData.provider_id}
            onChange={(e) => handleChange("provider_id", e.target.value)}
            error={!!errors.provider_id}
            helperText={errors.provider_id || "Sélectionnez le prestataire qui fournira ce service"}
            required
            disabled={isLoading || isLoadingProviders}
          >
            {isLoadingProviders ? (
              <MenuItem disabled>
                <CircularProgress size={20} sx={{ mr: 1 }} />
                Chargement des prestataires...
              </MenuItem>
            ) : serviceProviders.length === 0 ? (
              <MenuItem disabled>Aucun prestataire disponible</MenuItem>
            ) : (
              serviceProviders.map((provider) => (
                <MenuItem key={provider.id} value={provider.id}>
                  <Box>
                    <Typography variant="body2" fontWeight="medium">
                      {provider.full_name || `${provider.first_name || ''} ${provider.last_name || ''}`.trim() || "Sans nom"}
                    </Typography>
                    <Typography variant="caption" color="text.secondary">
                      {provider.email}
                    </Typography>
                  </Box>
                </MenuItem>
              ))
            )}
          </TextField>

          {/* Catégorie et Prix sur la même ligne */}
          <Box sx={{ display: "flex", gap: 2 }}>
            <TextField
              fullWidth
              select
              label="Catégorie"
              value={formData.category}
              onChange={(e) => handleChange("category", e.target.value)}
              error={!!errors.category}
              helperText={errors.category}
              required
              disabled={isLoading}
            >
              {SERVICE_CATEGORIES.map((cat) => (
                <MenuItem key={cat} value={cat}>
                  {cat}
                </MenuItem>
              ))}
            </TextField>

            <TextField
              fullWidth
              label="Prix de base (€)"
              type="number"
              value={formData.base_price}
              onChange={(e) => handleChange("base_price", e.target.value)}
              error={!!errors.base_price}
              helperText={errors.base_price}
              required
              disabled={isLoading}
              inputProps={{ min: 0, step: 0.01 }}
            />
          </Box>

          {/* Type de prix et Durée sur la même ligne */}
          <Box sx={{ display: "flex", gap: 2 }}>
            <TextField
              fullWidth
              select
              label="Type de prix"
              value={formData.price_type}
              onChange={(e) => handleChange("price_type", e.target.value)}
              helperText="Optionnel - Comment le prix est calculé"
              disabled={isLoading}
            >
              <MenuItem value="">
                <em>Non spécifié</em>
              </MenuItem>
              {PRICE_TYPES.map((type) => (
                <MenuItem key={type.value} value={type.value}>
                  {type.label}
                </MenuItem>
              ))}
            </TextField>

            <TextField
              fullWidth
              label="Durée (minutes)"
              type="number"
              value={formData.duration_minutes}
              onChange={(e) => handleChange("duration_minutes", e.target.value)}
              helperText="Optionnel - Durée estimée du service"
              disabled={isLoading}
              inputProps={{ min: 0, step: 15 }}
            />
          </Box>

          {/* Image Upload */}
          <Box>
            <Typography variant="body2" color="text.secondary" sx={{ mb: 1 }}>
              Image du service (optionnel)
            </Typography>
            
            <input
              accept="image/jpeg,image/png,image/webp"
              style={{ display: 'none' }}
              id="service-image-upload"
              type="file"
              onChange={handleImageUpload}
              disabled={isLoading || isUploadingImage}
            />
            
            <label htmlFor="service-image-upload">
              <Button
                variant="outlined"
                component="span"
                startIcon={isUploadingImage ? <CircularProgress size={20} /> : <UploadIcon />}
                disabled={isLoading || isUploadingImage}
                fullWidth
              >
                {isUploadingImage
                  ? "Upload en cours..."
                  : formData.image_url
                  ? "Changer l'image"
                  : "Ajouter une image"}
              </Button>
            </label>

            <Typography variant="caption" color="text.secondary" sx={{ mt: 0.5, display: 'block' }}>
              Formats acceptés: JPG, PNG, WebP (max 5 MB)
            </Typography>

            {uploadError && (
              <Alert severity="error" sx={{ mt: 1 }}>
                {uploadError}
              </Alert>
            )}

            {formData.image_url && !uploadError && (
              <Box
                sx={{
                  mt: 2,
                  p: 2,
                  border: 1,
                  borderColor: 'divider',
                  borderRadius: 1,
                  display: 'flex',
                  alignItems: 'center',
                  gap: 2,
                }}
              >
                <Box
                  component="img"
                  src={formData.image_url}
                  alt="Aperçu du service"
                  sx={{
                    maxWidth: 200,
                    maxHeight: 150,
                    borderRadius: 1,
                    objectFit: 'cover',
                  }}
                />
                <Box sx={{ flex: 1 }}>
                  <Typography variant="caption" color="text.secondary">
                    Image uploadée avec succès
                  </Typography>
                </Box>
                <IconButton
                  onClick={handleRemoveImage}
                  disabled={isLoading || isUploadingImage}
                  color="error"
                  size="small"
                >
                  <DeleteIcon />
                </IconButton>
              </Box>
            )}
          </Box>

          {/* Tags */}
          <Autocomplete
            multiple
            freeSolo
            options={COMMON_TAGS}
            value={formData.tags}
            onChange={(_, newValue) => handleChange("tags", newValue)}
            disabled={isLoading}
            renderTags={(value, getTagProps) =>
              value.map((option, index) => (
                <Chip
                  label={option}
                  {...getTagProps({ index })}
                  size="small"
                />
              ))
            }
            renderInput={(params) => (
              <TextField
                {...params}
                label="Tags"
                helperText="Optionnel - Ajoutez des tags pour catégoriser le service"
                placeholder="Ajoutez un tag..."
              />
            )}
          />

          {/* Switches */}
          <Box sx={{ display: "flex", flexDirection: "column", gap: 1 }}>
            <FormControlLabel
              control={
                <Switch
                  checked={formData.is_active}
                  onChange={(e) => handleChange("is_active", e.target.checked)}
                  disabled={isLoading}
                />
              }
              label="Service actif"
            />
            <FormControlLabel
              control={
                <Switch
                  checked={formData.is_vip_only}
                  onChange={(e) => handleChange("is_vip_only", e.target.checked)}
                  disabled={isLoading}
                />
              }
              label="Réservé aux membres VIP"
            />
          </Box>
        </Stack>
      </DialogContent>

      <DialogActions sx={{ p: 3, gap: 1, justifyContent: "flex-end" }}>
        <Button
          onClick={handleClose}
          disabled={isLoading}
          color="inherit"
        >
          Annuler
        </Button>
        <Button
          onClick={handleCreate}
          variant="contained"
          startIcon={isLoading ? <CircularProgress size={16} /> : <SaveIcon />}
          disabled={isLoading}
        >
          {isLoading ? "Création..." : "Créer le service"}
        </Button>
      </DialogActions>
    </Dialog>
  );
};
