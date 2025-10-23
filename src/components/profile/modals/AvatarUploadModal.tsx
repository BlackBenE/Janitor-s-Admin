import React, { useRef, useState } from "react";
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  Box,
  Typography,
  Avatar,
  Stack,
  Alert,
  CircularProgress,
} from "@mui/material";
import {
  CameraAlt as CameraIcon,
  CloudUpload as UploadIcon,
  Delete as DeleteIcon,
} from "@mui/icons-material";
import { AvatarUploadData } from "../../../types/profile";
import { AvatarService } from "../../../services/avatarService";
import { useAuth } from "../../../providers/authProvider";
import { useUINotifications } from "../../../hooks/shared";

interface AvatarUploadModalProps {
  open: boolean;
  data: AvatarUploadData;
  onClose: () => void;
  onFileSelect: (file: File) => void;
  onUploadSuccess?: () => void;
}

export const AvatarUploadModal: React.FC<AvatarUploadModalProps> = ({
  open,
  data,
  onClose,
  onFileSelect,
  onUploadSuccess,
}) => {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [isUploading, setIsUploading] = useState(false);
  const [isRemoving, setIsRemoving] = useState(false);

  const { user, userProfile } = useAuth();
  const { showSuccess, showError } = useUINotifications();

  const handleFileSelect = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      // Validation côté client
      const validation = AvatarService.validateFile(file);
      if (!validation.isValid) {
        showError(validation.error || "Fichier invalide");
        return;
      }
      onFileSelect(file);
    }
  };

  const handleUploadClick = () => {
    fileInputRef.current?.click();
  };

  const handleSubmit = async () => {
    if (!data.file || !user?.id) {
      showError("Aucun fichier sélectionné ou utilisateur non connecté");
      return;
    }

    setIsUploading(true);
    try {
      const result = await AvatarService.uploadAvatar(user.id, data.file);

      if (result.success) {
        showSuccess("Avatar mis à jour avec succès !");
        onUploadSuccess?.();
        onClose();
      } else {
        showError(result.error || "Erreur lors de l'upload");
      }
    } catch (error) {
      console.error("Upload error:", error);
      showError("Une erreur inattendue s'est produite");
    } finally {
      setIsUploading(false);
    }
  };

  const handleRemoveAvatar = async () => {
    if (!user?.id) {
      showError("Utilisateur non connecté");
      return;
    }

    setIsRemoving(true);
    try {
      const success = await AvatarService.removeUserAvatar(user.id);

      if (success) {
        showSuccess("Avatar supprimé avec succès !");
        onUploadSuccess?.();
        onClose();
      } else {
        showError("Erreur lors de la suppression de l'avatar");
      }
    } catch (error) {
      console.error("Remove avatar error:", error);
      showError("Une erreur inattendue s'est produite");
    } finally {
      setIsRemoving(false);
    }
  };

  // Vérifier si l'utilisateur a déjà un avatar
  const hasCurrentAvatar = Boolean(userProfile?.avatar_url);

  return (
    <Dialog open={open} onClose={onClose} maxWidth="sm" fullWidth>
      <DialogTitle>
        <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
          <CameraIcon color="primary" />
          <Typography variant="h6">Upload Avatar</Typography>
        </Box>
      </DialogTitle>

      <DialogContent>
        <Stack spacing={3} alignItems="center" sx={{ mt: 1 }}>
          <Alert severity="info" sx={{ width: "100%" }}>
            Upload a profile picture. Recommended size: 400x400px. Max file
            size: 5MB. Formats supportés : JPG, PNG, WebP.
          </Alert>

          {/* Preview de l'avatar */}
          <Box sx={{ position: "relative" }}>
            <Avatar
              src={data.preview || userProfile?.avatar_url || undefined}
              sx={{
                width: 120,
                height: 120,
                bgcolor: "primary.main",
                fontSize: "3rem",
              }}
            >
              {!data.preview && !userProfile?.avatar_url && (
                <CameraIcon fontSize="large" />
              )}
            </Avatar>
          </Box>

          {/* Boutons d'action */}
          <Stack direction="row" spacing={2}>
            <Button
              variant="outlined"
              startIcon={<UploadIcon />}
              onClick={handleUploadClick}
              disabled={isUploading || isRemoving}
            >
              {data.file ? "Changer l'image" : "Sélectionner une image"}
            </Button>

            {hasCurrentAvatar && (
              <Button
                variant="outlined"
                color="error"
                startIcon={
                  isRemoving ? <CircularProgress size={16} /> : <DeleteIcon />
                }
                onClick={handleRemoveAvatar}
                disabled={isUploading || isRemoving}
              >
                Supprimer
              </Button>
            )}
          </Stack>

          <input
            ref={fileInputRef}
            type="file"
            accept="image/jpeg,image/png,image/webp"
            onChange={handleFileSelect}
            style={{ display: "none" }}
          />

          {/* Informations du fichier sélectionné */}
          {data.file && (
            <Box sx={{ textAlign: "center" }}>
              <Typography variant="body2" color="text.secondary">
                Sélectionné : {data.file.name}
              </Typography>
              <Typography variant="body2" color="text.secondary">
                Taille : {(data.file.size / 1024 / 1024).toFixed(2)} MB
              </Typography>
            </Box>
          )}
        </Stack>
      </DialogContent>

      <DialogActions>
        <Button
          onClick={onClose}
          variant="outlined"
          disabled={isUploading || isRemoving}
        >
          Annuler
        </Button>
        <Button
          onClick={handleSubmit}
          variant="contained"
          disabled={!data.file || isUploading || isRemoving}
          startIcon={
            isUploading ? <CircularProgress size={16} /> : <UploadIcon />
          }
        >
          {isUploading ? "Upload en cours..." : "Mettre à jour l'avatar"}
        </Button>
      </DialogActions>
    </Dialog>
  );
};
