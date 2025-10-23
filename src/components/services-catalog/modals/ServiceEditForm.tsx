import React from "react";
import {
  Box,
  TextField,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  FormControlLabel,
  Switch,
  Chip,
  Typography,
  Paper,
  Divider,
} from "@mui/material";
import { ServiceWithDetails } from "../../../types/services";
import { SERVICE_CATEGORIES } from "../../../types/services";

interface ServiceEditFormProps {
  service: ServiceWithDetails;
  editForm: Partial<ServiceWithDetails>;
  onInputChange: (
    field: keyof ServiceWithDetails,
    value: string | number | boolean | null | string[]
  ) => void;
}

export const ServiceEditForm: React.FC<ServiceEditFormProps> = ({
  service,
  editForm,
  onInputChange,
}) => {
  const handleTagsChange = (newTags: string[]) => {
    onInputChange("tags", newTags);
  };

  const handleQualificationsChange = (newQualifications: string[]) => {
    onInputChange("qualifications_required", newQualifications);
  };

  return (
    <Box sx={{ display: "flex", flexDirection: "column", gap: 3 }}>
      {/* Informations de base */}
      <Paper sx={{ p: 3 }}>
        <Typography variant="h6" gutterBottom>
          Informations générales
        </Typography>

        <Box
          sx={{
            display: "grid",
            gridTemplateColumns: { xs: "1fr", md: "1fr 1fr" },
            gap: 2,
          }}
        >
          <TextField
            label="Nom du service"
            value={editForm.name ?? service.name ?? ""}
            onChange={(e) => onInputChange("name", e.target.value)}
            fullWidth
            required
          />

          <FormControl fullWidth>
            <InputLabel>Catégorie</InputLabel>
            <Select
              value={editForm.category ?? service.category ?? ""}
              onChange={(e) => onInputChange("category", e.target.value)}
              label="Catégorie"
            >
              {SERVICE_CATEGORIES.map((category) => (
                <MenuItem key={category} value={category}>
                  {category}
                </MenuItem>
              ))}
            </Select>
          </FormControl>
        </Box>

        <Box sx={{ mt: 2 }}>
          <TextField
            label="Description"
            value={editForm.description ?? service.description ?? ""}
            onChange={(e) => onInputChange("description", e.target.value)}
            multiline
            rows={4}
            fullWidth
          />
        </Box>
      </Paper>

      {/* Tarification */}
      <Paper sx={{ p: 3 }}>
        <Typography variant="h6" gutterBottom>
          Tarification
        </Typography>

        <Box
          sx={{
            display: "grid",
            gridTemplateColumns: { xs: "1fr", md: "2fr 1fr 1fr" },
            gap: 2,
          }}
        >
          <TextField
            label="Prix de base"
            type="number"
            value={editForm.base_price ?? service.base_price ?? ""}
            onChange={(e) =>
              onInputChange("base_price", parseFloat(e.target.value) || 0)
            }
            InputProps={{
              endAdornment: "€",
            }}
            fullWidth
            required
          />

          <FormControl fullWidth>
            <InputLabel>Type de prix</InputLabel>
            <Select
              value={editForm.price_type ?? service.price_type ?? "fixed"}
              onChange={(e) => onInputChange("price_type", e.target.value)}
              label="Type de prix"
            >
              <MenuItem value="fixed">Fixe</MenuItem>
              <MenuItem value="hourly">À l'heure</MenuItem>
              <MenuItem value="quote">Sur devis</MenuItem>
            </Select>
          </FormControl>

          <TextField
            label="Durée (minutes)"
            type="number"
            value={editForm.duration_minutes ?? service.duration_minutes ?? ""}
            onChange={(e) =>
              onInputChange(
                "duration_minutes",
                parseInt(e.target.value) || null
              )
            }
            fullWidth
          />
        </Box>
      </Paper>

      {/* Paramètres avancés */}
      <Paper sx={{ p: 3 }}>
        <Typography variant="h6" gutterBottom>
          Paramètres
        </Typography>

        <Box sx={{ display: "flex", flexDirection: "column", gap: 2 }}>
          <FormControlLabel
            control={
              <Switch
                checked={editForm.is_active ?? service.is_active ?? false}
                onChange={(e) => onInputChange("is_active", e.target.checked)}
              />
            }
            label="Service actif"
          />

          <FormControlLabel
            control={
              <Switch
                checked={editForm.is_vip_only ?? service.is_vip_only ?? false}
                onChange={(e) => onInputChange("is_vip_only", e.target.checked)}
              />
            }
            label="Réservé aux clients VIP"
          />

          <TextField
            label="URL de l'image"
            value={editForm.image_url ?? service.image_url ?? ""}
            onChange={(e) => onInputChange("image_url", e.target.value)}
            fullWidth
            placeholder="https://..."
          />
        </Box>
      </Paper>

      {/* Tags et qualifications */}
      <Paper sx={{ p: 3 }}>
        <Typography variant="h6" gutterBottom>
          Tags et qualifications
        </Typography>

        <Box sx={{ display: "flex", flexDirection: "column", gap: 2 }}>
          <Box>
            <Typography variant="subtitle2" color="text.secondary" gutterBottom>
              Tags (séparés par des virgules)
            </Typography>
            <TextField
              placeholder="nettoyage, rapide, écologique..."
              value={((editForm.tags ?? service.tags) || []).join(", ")}
              onChange={(e) => {
                const tags = e.target.value
                  .split(",")
                  .map((tag) => tag.trim())
                  .filter((tag) => tag.length > 0);
                handleTagsChange(tags);
              }}
              fullWidth
            />
            {((editForm.tags ?? service.tags) || []).length > 0 && (
              <Box sx={{ mt: 1, display: "flex", flexWrap: "wrap", gap: 0.5 }}>
                {((editForm.tags ?? service.tags) || []).map((tag, index) => (
                  <Chip
                    key={index}
                    label={tag}
                    size="small"
                    variant="outlined"
                  />
                ))}
              </Box>
            )}
          </Box>

          <Divider />

          <Box>
            <Typography variant="subtitle2" color="text.secondary" gutterBottom>
              Qualifications requises (séparées par des virgules)
            </Typography>
            <TextField
              placeholder="certificat, formation, expérience..."
              value={(
                (editForm.qualifications_required ??
                  service.qualifications_required) ||
                []
              ).join(", ")}
              onChange={(e) => {
                const qualifications = e.target.value
                  .split(",")
                  .map((q) => q.trim())
                  .filter((q) => q.length > 0);
                handleQualificationsChange(qualifications);
              }}
              fullWidth
            />
            {(
              (editForm.qualifications_required ??
                service.qualifications_required) ||
              []
            ).length > 0 && (
              <Box sx={{ mt: 1, display: "flex", flexWrap: "wrap", gap: 0.5 }}>
                {(
                  (editForm.qualifications_required ??
                    service.qualifications_required) ||
                  []
                ).map((qual, index) => (
                  <Chip
                    key={index}
                    label={qual}
                    size="small"
                    color="secondary"
                    variant="outlined"
                  />
                ))}
              </Box>
            )}
          </Box>
        </Box>
      </Paper>
    </Box>
  );
};
