/**
 * Composant modal pour visualiser les images en plein écran
 * Extrait de PropertyImageGallery pour respecter la limite de lignes
 */

import React from "react";
import { Dialog, DialogContent, IconButton, Box } from "@mui/material";
import {
  ArrowBack as ArrowBackIcon,
  ArrowForward as ArrowForwardIcon,
  Close as CloseIcon,
} from "@mui/icons-material";

interface ImageViewerModalProps {
  open: boolean;
  onClose: () => void;
  images: string[];
  selectedIndex: number;
  onNavigate: (index: number) => void;
}

export const ImageViewerModal: React.FC<ImageViewerModalProps> = ({
  open,
  onClose,
  images,
  selectedIndex,
  onNavigate,
}) => {
  const handlePrevious = () => {
    const newIndex = selectedIndex > 0 ? selectedIndex - 1 : images.length - 1;
    onNavigate(newIndex);
  };

  const handleNext = () => {
    const newIndex = selectedIndex < images.length - 1 ? selectedIndex + 1 : 0;
    onNavigate(newIndex);
  };

  const handleKeyPress = (event: React.KeyboardEvent) => {
    if (event.key === "ArrowLeft") {
      handlePrevious();
    } else if (event.key === "ArrowRight") {
      handleNext();
    } else if (event.key === "Escape") {
      onClose();
    }
  };

  if (!images || images.length === 0) {
    return null;
  }

  return (
    <Dialog
      open={open}
      onClose={onClose}
      maxWidth={false}
      fullWidth
      PaperProps={{
        sx: {
          backgroundColor: "rgba(0, 0, 0, 0.9)",
          boxShadow: "none",
          maxWidth: "95vw",
          maxHeight: "95vh",
        },
      }}
      onKeyDown={handleKeyPress}
    >
      <DialogContent
        sx={{
          p: 2,
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          position: "relative",
        }}
      >
        {/* Close button */}
        <IconButton
          onClick={onClose}
          sx={{
            position: "absolute",
            top: 16,
            right: 16,
            color: "white",
            backgroundColor: "rgba(0, 0, 0, 0.5)",
            "&:hover": {
              backgroundColor: "rgba(0, 0, 0, 0.7)",
            },
          }}
        >
          <CloseIcon />
        </IconButton>

        {/* Previous button */}
        {images.length > 1 && (
          <IconButton
            onClick={handlePrevious}
            sx={{
              position: "absolute",
              left: 16,
              color: "white",
              backgroundColor: "rgba(0, 0, 0, 0.5)",
              "&:hover": {
                backgroundColor: "rgba(0, 0, 0, 0.7)",
              },
            }}
          >
            <ArrowBackIcon />
          </IconButton>
        )}

        {/* Image */}
        <Box
          component="img"
          src={images[selectedIndex]}
          alt={`Image ${selectedIndex + 1}`}
          sx={{
            maxWidth: "100%",
            maxHeight: "80vh",
            objectFit: "contain",
            borderRadius: 1,
          }}
        />

        {/* Next button */}
        {images.length > 1 && (
          <IconButton
            onClick={handleNext}
            sx={{
              position: "absolute",
              right: 16,
              color: "white",
              backgroundColor: "rgba(0, 0, 0, 0.5)",
              "&:hover": {
                backgroundColor: "rgba(0, 0, 0, 0.7)",
              },
            }}
          >
            <ArrowForwardIcon />
          </IconButton>
        )}

        {/* Image counter */}
        {images.length > 1 && (
          <Box
            sx={{
              position: "absolute",
              bottom: 16,
              left: "50%",
              transform: "translateX(-50%)",
              color: "white",
              backgroundColor: "rgba(0, 0, 0, 0.7)",
              px: 2,
              py: 1,
              borderRadius: 1,
              fontSize: "0.875rem",
            }}
          >
            {selectedIndex + 1} / {images.length}
          </Box>
        )}
      </DialogContent>
    </Dialog>
  );
};
