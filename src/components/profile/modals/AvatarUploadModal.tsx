import React, { useRef } from "react";
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
} from "@mui/material";
import {
  CameraAlt as CameraIcon,
  CloudUpload as UploadIcon,
} from "@mui/icons-material";
import { AvatarUploadData } from "../../../types/profile";

interface AvatarUploadModalProps {
  open: boolean;
  data: AvatarUploadData;
  onClose: () => void;
  onFileSelect: (file: File) => void;
}

export const AvatarUploadModal: React.FC<AvatarUploadModalProps> = ({
  open,
  data,
  onClose,
  onFileSelect,
}) => {
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileSelect = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      onFileSelect(file);
    }
  };

  const handleUploadClick = () => {
    fileInputRef.current?.click();
  };

  const handleSubmit = () => {
    if (data.file) {
      // TODO: Implement avatar upload logic
      console.log("Uploading avatar...", data.file);
      onClose();
    }
  };

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
            size: 5MB.
          </Alert>

          {/* Preview de l'avatar */}
          <Box sx={{ position: "relative" }}>
            <Avatar
              src={data.preview || undefined}
              sx={{
                width: 120,
                height: 120,
                bgcolor: "primary.main",
                fontSize: "3rem",
              }}
            >
              {!data.preview && <CameraIcon fontSize="large" />}
            </Avatar>
          </Box>

          {/* Bouton de sélection de fichier */}
          <Button
            variant="outlined"
            startIcon={<UploadIcon />}
            onClick={handleUploadClick}
            size="large"
          >
            {data.file ? "Change Image" : "Select Image"}
          </Button>

          <input
            ref={fileInputRef}
            type="file"
            accept="image/*"
            onChange={handleFileSelect}
            style={{ display: "none" }}
          />

          {/* Informations du fichier sélectionné */}
          {data.file && (
            <Box sx={{ textAlign: "center" }}>
              <Typography variant="body2" color="text.secondary">
                Selected: {data.file.name}
              </Typography>
              <Typography variant="body2" color="text.secondary">
                Size: {(data.file.size / 1024 / 1024).toFixed(2)} MB
              </Typography>
            </Box>
          )}
        </Stack>
      </DialogContent>

      <DialogActions>
        <Button onClick={onClose} variant="outlined">
          Cancel
        </Button>
        <Button
          onClick={handleSubmit}
          variant="contained"
          disabled={!data.file}
        >
          Upload Avatar
        </Button>
      </DialogActions>
    </Dialog>
  );
};
