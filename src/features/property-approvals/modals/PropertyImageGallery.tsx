import React, { useState, useEffect } from "react";
import {
  Box,
  Card,
  CardMedia,
  Typography,
  IconButton,
  Accordion,
  AccordionSummary,
  AccordionDetails,
} from "@mui/material";
import {
  Image as ImageIcon,
  ZoomIn as ZoomInIcon,
  ExpandMore as ExpandMoreIcon,
} from "@mui/icons-material";

import { Property } from "@/types";
import { ImageViewerModal } from "../components/ImageViewerModal";
import { hasExpiredTokens, refreshImageUrls } from "../utils/imageUtils";
import { LABELS } from "@/core/config/labels";

interface PropertyImageGalleryProps {
  property: Property;
}

export const PropertyImageGallery: React.FC<PropertyImageGalleryProps> = ({
  property,
}) => {
  const [selectedImageIndex, setSelectedImageIndex] = useState<number>(0);
  const [imageViewerOpen, setImageViewerOpen] = useState(false);
  const [refreshedImages, setRefreshedImages] = useState<string[]>([]);

  // Get images array directly from Supabase
  const originalImages = property?.images || [];

  // Use refreshed images if available, otherwise use original
  const images = refreshedImages.length > 0 ? refreshedImages : originalImages;

  // Silently refresh expired tokens without showing UI messages
  const handleRefreshImages = async () => {
    if (originalImages.length === 0) return;

    try {
      const newUrls = await refreshImageUrls(originalImages);
      setRefreshedImages(newUrls);
    } catch (error) {
      console.error("Error refreshing images:", error);
      // Silently fail - no UI feedback
    }
  };

  // Auto-refresh expired tokens silently when component mounts
  useEffect(() => {
    if (originalImages.length > 0 && hasExpiredTokens(originalImages)) {
      handleRefreshImages();
    }
  }, [originalImages]);

  const openImageViewer = (index: number) => {
    setSelectedImageIndex(index);
    setImageViewerOpen(true);
  };

  const closeImageViewer = () => {
    setImageViewerOpen(false);
  };

  const handleImageNavigation = (index: number) => {
    setSelectedImageIndex(index);
  };

  if (!images || images.length === 0) {
    return (
      <Card sx={{ p: 3, textAlign: "center" }}>
        <ImageIcon sx={{ fontSize: 48, color: "text.secondary", mb: 2 }} />
        <Typography variant="body1" color="text.secondary">
          {LABELS.propertyApprovals.messages.noImagesAvailable}
        </Typography>
      </Card>
    );
  }

  return (
    <Box>
      <Accordion defaultExpanded>
        <AccordionSummary expandIcon={<ExpandMoreIcon />}>
          <Typography variant="h6">
            {LABELS.propertyApprovals.table.headers.images} ({images.length})
          </Typography>
        </AccordionSummary>
        <AccordionDetails>
          <Box
            sx={{
              display: "grid",
              gridTemplateColumns: {
                xs: "1fr",
                sm: "repeat(2, 1fr)",
                md: "repeat(3, 1fr)",
                lg: "repeat(4, 1fr)",
              },
              gap: 2,
            }}
          >
            {images.map((imageUrl: string, index: number) => (
              <Card
                key={`${imageUrl}-${index}`}
                sx={{
                  position: "relative",
                  cursor: "pointer",
                  transition: "transform 0.2s",
                  "&:hover": {
                    transform: "scale(1.05)",
                  },
                }}
                onClick={() => openImageViewer(index)}
              >
                <CardMedia
                  component="img"
                  image={imageUrl}
                  alt={`Image ${index + 1}`}
                  sx={{
                    height: 200,
                    objectFit: "cover",
                  }}
                  onError={(e) => {
                    // Fallback en cas d'erreur de chargement
                    const target = e.target as HTMLImageElement;
                    target.style.display = "none";
                  }}
                />
                <IconButton
                  sx={{
                    position: "absolute",
                    top: 8,
                    right: 8,
                    backgroundColor: "rgba(0, 0, 0, 0.5)",
                    color: "white",
                    "&:hover": {
                      backgroundColor: "rgba(0, 0, 0, 0.7)",
                    },
                  }}
                  size="small"
                >
                  <ZoomInIcon />
                </IconButton>
              </Card>
            ))}
          </Box>
        </AccordionDetails>
      </Accordion>

      <ImageViewerModal
        open={imageViewerOpen}
        onClose={closeImageViewer}
        images={images}
        selectedIndex={selectedImageIndex}
        onNavigate={handleImageNavigation}
      />
    </Box>
  );
};
