import React, { useState } from "react";
import {
  Box,
  Card,
  CardMedia,
  Typography,
  IconButton,
  Dialog,
  DialogContent,
  Accordion,
  AccordionSummary,
  AccordionDetails,
} from "@mui/material";
import {
  ExpandMore as ExpandMoreIcon,
  Image as ImageIcon,
  ZoomIn as ZoomInIcon,
} from "@mui/icons-material";

interface PropertyImageGalleryProps {
  property: any;
}

export const PropertyImageGallery: React.FC<PropertyImageGalleryProps> = ({
  property,
}) => {
  const [selectedImage, setSelectedImage] = useState<string | null>(null);
  const [imageViewerOpen, setImageViewerOpen] = useState(false);

  const images = property?.images || [];

  const handleImageClick = (imageUrl: string) => {
    setSelectedImage(imageUrl);
    setImageViewerOpen(true);
  };

  const handleCloseImageViewer = () => {
    setImageViewerOpen(false);
    setSelectedImage(null);
  };

  return (
    <>
      <Accordion>
        <AccordionSummary expandIcon={<ExpandMoreIcon />}>
          <Typography
            variant="h6"
            sx={{ display: "flex", alignItems: "center", gap: 1 }}
          >
            <ImageIcon /> Images ({images.length})
          </Typography>
        </AccordionSummary>
        <AccordionDetails>
          {images.length > 0 ? (
            <Box
              sx={{
                display: "grid",
                gridTemplateColumns: "repeat(auto-fit, minmax(150px, 1fr))",
                gap: 2,
              }}
            >
              {images.map((image: any, index: number) => (
                <Card
                  key={index}
                  sx={{
                    position: "relative",
                    cursor: "pointer",
                    "&:hover .zoom-icon": {
                      opacity: 1,
                    },
                  }}
                  onClick={() => handleImageClick(image.url || image)}
                >
                  <CardMedia
                    component="img"
                    height="120"
                    image={image.url || image}
                    alt={`Property image ${index + 1}`}
                    sx={{
                      objectFit: "cover",
                    }}
                  />
                  <IconButton
                    className="zoom-icon"
                    sx={{
                      position: "absolute",
                      top: 4,
                      right: 4,
                      backgroundColor: "rgba(0,0,0,0.5)",
                      color: "white",
                      opacity: 0,
                      transition: "opacity 0.3s",
                      "&:hover": {
                        backgroundColor: "rgba(0,0,0,0.7)",
                      },
                    }}
                    size="small"
                  >
                    <ZoomInIcon />
                  </IconButton>
                </Card>
              ))}
            </Box>
          ) : (
            <Box
              sx={{
                textAlign: "center",
                py: 4,
                color: "text.secondary",
              }}
            >
              <ImageIcon sx={{ fontSize: 48, mb: 1 }} />
              <Typography variant="body2">No images available</Typography>
            </Box>
          )}
        </AccordionDetails>
      </Accordion>

      {/* Image Viewer Dialog */}
      <Dialog
        open={imageViewerOpen}
        onClose={handleCloseImageViewer}
        maxWidth="md"
        fullWidth
      >
        <DialogContent sx={{ p: 0 }}>
          {selectedImage && (
            <img
              src={selectedImage}
              alt="Property image full view"
              style={{
                width: "100%",
                height: "auto",
                display: "block",
              }}
            />
          )}
        </DialogContent>
      </Dialog>
    </>
  );
};
