import React, { useState } from "react";
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  Box,
  Typography,
  Chip,
  TextField,
  Card,
  CardMedia,
  Tooltip,
  IconButton,
  Accordion,
  AccordionSummary,
  AccordionDetails,
  Stack,
} from "@mui/material";
import {
  ExpandMore as ExpandMoreIcon,
  Home as HomeIcon,
  LocationOn as LocationIcon,
  Person as PersonIcon,
  CalendarToday as CalendarIcon,
  Info as InfoIcon,
  Image as ImageIcon,
  Check as CheckIcon,
  Close as CloseIcon,
  ZoomIn as ZoomInIcon,
} from "@mui/icons-material";

interface PropertyDetailsModalProps {
  open: boolean;
  property: any | null;
  onClose: () => void;
  onApprove: (propertyId: string, notes?: string) => void;
  onReject: (propertyId: string, notes?: string) => void;
  isApprovePending?: boolean;
  isRejectPending?: boolean;
}

export const PropertyDetailsModal: React.FC<PropertyDetailsModalProps> = ({
  open,
  property,
  onClose,
  onApprove,
  onReject,
  isApprovePending = false,
  isRejectPending = false,
}) => {
  const [moderationNotes, setModerationNotes] = useState("");
  const [selectedImage, setSelectedImage] = useState<string | null>(null);

  if (!property) return null;

  const formatDate = (dateString: string | null) => {
    if (!dateString) return "N/A";
    return new Date(dateString).toLocaleString();
  };

  const formatCurrency = (amount: number | null) => {
    if (!amount) return "N/A";
    return new Intl.NumberFormat("fr-FR", {
      style: "currency",
      currency: "EUR",
    }).format(amount);
  };

  const getStatusColor = (status: string) => {
    switch (status?.toLowerCase()) {
      case "approved":
        return "success";
      case "rejected":
        return "error";
      case "under_review":
        return "info";
      case "pending":
      default:
        return "warning";
    }
  };

  const images = property.images || [];
  const amenities = property.amenities || [];

  const handleApprove = () => {
    onApprove(property.id, moderationNotes);
    setModerationNotes("");
    onClose();
  };

  const handleReject = () => {
    onReject(property.id, moderationNotes);
    setModerationNotes("");
    onClose();
  };

  return (
    <>
      <Dialog
        open={open}
        onClose={onClose}
        maxWidth="lg"
        fullWidth
        sx={{ "& .MuiDialog-paper": { maxHeight: "90vh" } }}
      >
        <DialogTitle>
          <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
            <HomeIcon color="primary" />
            <Typography variant="h6">Property Details</Typography>
            <Chip
              label={property.validation_status || "Pending"}
              color={getStatusColor(property.validation_status) as any}
              size="small"
            />
          </Box>
        </DialogTitle>

        <DialogContent dividers>
          <Box sx={{ display: "flex", flexDirection: "column", gap: 3 }}>
            {/* Two-column layout */}
            <Box
              sx={{
                display: "flex",
                gap: 3,
                flexDirection: { xs: "column", md: "row" },
              }}
            >
              {/* Left column - Main details */}
              <Box
                sx={{
                  flex: 2,
                  display: "flex",
                  flexDirection: "column",
                  gap: 2,
                }}
              >
                {/* Basic Information */}
                <Accordion defaultExpanded>
                  <AccordionSummary expandIcon={<ExpandMoreIcon />}>
                    <Typography
                      variant="h6"
                      sx={{ display: "flex", alignItems: "center", gap: 1 }}
                    >
                      <InfoIcon /> Basic Information
                    </Typography>
                  </AccordionSummary>
                  <AccordionDetails>
                    <Stack spacing={2}>
                      <Box
                        sx={{
                          display: "flex",
                          gap: 2,
                          flexDirection: { xs: "column", sm: "row" },
                        }}
                      >
                        <Box sx={{ flex: 1 }}>
                          <Typography
                            variant="subtitle2"
                            color="text.secondary"
                          >
                            Property ID
                          </Typography>
                          <Typography variant="body1" gutterBottom>
                            {property.id}
                          </Typography>
                        </Box>
                        <Box sx={{ flex: 1 }}>
                          <Typography
                            variant="subtitle2"
                            color="text.secondary"
                          >
                            Title
                          </Typography>
                          <Typography variant="body1" gutterBottom>
                            {property.title || "N/A"}
                          </Typography>
                        </Box>
                      </Box>
                      <Box>
                        <Typography variant="subtitle2" color="text.secondary">
                          Description
                        </Typography>
                        <Typography variant="body1" gutterBottom>
                          {property.description || "No description provided"}
                        </Typography>
                      </Box>
                    </Stack>
                  </AccordionDetails>
                </Accordion>

                {/* Location Details */}
                <Accordion defaultExpanded>
                  <AccordionSummary expandIcon={<ExpandMoreIcon />}>
                    <Typography
                      variant="h6"
                      sx={{ display: "flex", alignItems: "center", gap: 1 }}
                    >
                      <LocationIcon /> Location
                    </Typography>
                  </AccordionSummary>
                  <AccordionDetails>
                    <Stack spacing={2}>
                      <Box
                        sx={{
                          display: "flex",
                          gap: 2,
                          flexDirection: { xs: "column", sm: "row" },
                        }}
                      >
                        <Box sx={{ flex: 1 }}>
                          <Typography
                            variant="subtitle2"
                            color="text.secondary"
                          >
                            Address
                          </Typography>
                          <Typography variant="body1" gutterBottom>
                            {property.address || "No address"}
                          </Typography>
                        </Box>
                        <Box sx={{ flex: 1 }}>
                          <Typography
                            variant="subtitle2"
                            color="text.secondary"
                          >
                            City
                          </Typography>
                          <Typography variant="body1" gutterBottom>
                            {property.city || "N/A"}
                          </Typography>
                        </Box>
                      </Box>
                      <Box
                        sx={{
                          display: "flex",
                          gap: 2,
                          flexDirection: { xs: "column", sm: "row" },
                        }}
                      >
                        <Box sx={{ flex: 1 }}>
                          <Typography
                            variant="subtitle2"
                            color="text.secondary"
                          >
                            Country
                          </Typography>
                          <Typography variant="body1" gutterBottom>
                            {property.country || "N/A"}
                          </Typography>
                        </Box>
                        <Box sx={{ flex: 1 }}>
                          <Typography
                            variant="subtitle2"
                            color="text.secondary"
                          >
                            Postal Code
                          </Typography>
                          <Typography variant="body1" gutterBottom>
                            {property.postal_code || "N/A"}
                          </Typography>
                        </Box>
                      </Box>
                    </Stack>
                  </AccordionDetails>
                </Accordion>

                {/* Property Details */}
                <Accordion defaultExpanded>
                  <AccordionSummary expandIcon={<ExpandMoreIcon />}>
                    <Typography
                      variant="h6"
                      sx={{ display: "flex", alignItems: "center", gap: 1 }}
                    >
                      <HomeIcon /> Property Details
                    </Typography>
                  </AccordionSummary>
                  <AccordionDetails>
                    <Stack spacing={2}>
                      <Box
                        sx={{
                          display: "flex",
                          gap: 2,
                          flexDirection: { xs: "column", sm: "row" },
                        }}
                      >
                        <Box sx={{ flex: 1 }}>
                          <Typography
                            variant="subtitle2"
                            color="text.secondary"
                          >
                            Nightly Rate
                          </Typography>
                          <Typography
                            variant="body1"
                            gutterBottom
                            sx={{ color: "primary.main", fontWeight: 500 }}
                          >
                            {formatCurrency(property.nightly_rate)}
                          </Typography>
                        </Box>
                        <Box sx={{ flex: 1 }}>
                          <Typography
                            variant="subtitle2"
                            color="text.secondary"
                          >
                            Capacity
                          </Typography>
                          <Typography variant="body1" gutterBottom>
                            {property.capacity || "N/A"} guests
                          </Typography>
                        </Box>
                      </Box>
                      <Box
                        sx={{
                          display: "flex",
                          gap: 2,
                          flexDirection: { xs: "column", sm: "row" },
                        }}
                      >
                        <Box sx={{ flex: 1 }}>
                          <Typography
                            variant="subtitle2"
                            color="text.secondary"
                          >
                            Bedrooms
                          </Typography>
                          <Typography variant="body1" gutterBottom>
                            {property.bedrooms || "N/A"}
                          </Typography>
                        </Box>
                        <Box sx={{ flex: 1 }}>
                          <Typography
                            variant="subtitle2"
                            color="text.secondary"
                          >
                            Bathrooms
                          </Typography>
                          <Typography variant="body1" gutterBottom>
                            {property.bathrooms || "N/A"}
                          </Typography>
                        </Box>
                      </Box>
                      <Box
                        sx={{
                          display: "flex",
                          gap: 2,
                          flexDirection: { xs: "column", sm: "row" },
                        }}
                      >
                        <Box sx={{ flex: 1 }}>
                          <Typography
                            variant="subtitle2"
                            color="text.secondary"
                          >
                            Property Type
                          </Typography>
                          <Typography variant="body1" gutterBottom>
                            {property.property_type || "N/A"}
                          </Typography>
                        </Box>
                        <Box sx={{ flex: 1 }}>
                          <Typography
                            variant="subtitle2"
                            color="text.secondary"
                          >
                            Listing Type
                          </Typography>
                          <Typography variant="body1" gutterBottom>
                            {property.listing_type || "N/A"}
                          </Typography>
                        </Box>
                      </Box>
                    </Stack>
                  </AccordionDetails>
                </Accordion>

                {/* Amenities */}
                {amenities.length > 0 && (
                  <Accordion>
                    <AccordionSummary expandIcon={<ExpandMoreIcon />}>
                      <Typography variant="h6">
                        Amenities ({amenities.length})
                      </Typography>
                    </AccordionSummary>
                    <AccordionDetails>
                      <Box sx={{ display: "flex", flexWrap: "wrap", gap: 1 }}>
                        {amenities.map((amenity: string, index: number) => (
                          <Chip
                            key={index}
                            label={amenity}
                            variant="outlined"
                            size="small"
                          />
                        ))}
                      </Box>
                    </AccordionDetails>
                  </Accordion>
                )}

                {/* Owner Information */}
                <Accordion>
                  <AccordionSummary expandIcon={<ExpandMoreIcon />}>
                    <Typography
                      variant="h6"
                      sx={{ display: "flex", alignItems: "center", gap: 1 }}
                    >
                      <PersonIcon /> Owner Information
                    </Typography>
                  </AccordionSummary>
                  <AccordionDetails>
                    <Stack spacing={2}>
                      <Box
                        sx={{
                          display: "flex",
                          gap: 2,
                          flexDirection: { xs: "column", sm: "row" },
                        }}
                      >
                        <Box sx={{ flex: 1 }}>
                          <Typography
                            variant="subtitle2"
                            color="text.secondary"
                          >
                            Owner Name
                          </Typography>
                          <Typography variant="body1" gutterBottom>
                            {property.profiles?.full_name || "Unknown Owner"}
                          </Typography>
                        </Box>
                        <Box sx={{ flex: 1 }}>
                          <Typography
                            variant="subtitle2"
                            color="text.secondary"
                          >
                            Owner Email
                          </Typography>
                          <Typography variant="body1" gutterBottom>
                            {property.profiles?.email || "No email"}
                          </Typography>
                        </Box>
                      </Box>
                      <Box>
                        <Typography variant="subtitle2" color="text.secondary">
                          Owner ID
                        </Typography>
                        <Typography variant="body1" gutterBottom>
                          {property.owner_id || "N/A"}
                        </Typography>
                      </Box>
                    </Stack>
                  </AccordionDetails>
                </Accordion>

                {/* System Information */}
                <Accordion>
                  <AccordionSummary expandIcon={<ExpandMoreIcon />}>
                    <Typography
                      variant="h6"
                      sx={{ display: "flex", alignItems: "center", gap: 1 }}
                    >
                      <CalendarIcon /> System Information
                    </Typography>
                  </AccordionSummary>
                  <AccordionDetails>
                    <Stack spacing={2}>
                      <Box
                        sx={{
                          display: "flex",
                          gap: 2,
                          flexDirection: { xs: "column", sm: "row" },
                        }}
                      >
                        <Box sx={{ flex: 1 }}>
                          <Typography
                            variant="subtitle2"
                            color="text.secondary"
                          >
                            Created At
                          </Typography>
                          <Typography variant="body1" gutterBottom>
                            {formatDate(property.created_at)}
                          </Typography>
                        </Box>
                        <Box sx={{ flex: 1 }}>
                          <Typography
                            variant="subtitle2"
                            color="text.secondary"
                          >
                            Updated At
                          </Typography>
                          <Typography variant="body1" gutterBottom>
                            {formatDate(property.updated_at)}
                          </Typography>
                        </Box>
                      </Box>
                      <Box
                        sx={{
                          display: "flex",
                          gap: 2,
                          flexDirection: { xs: "column", sm: "row" },
                        }}
                      >
                        <Box sx={{ flex: 1 }}>
                          <Typography
                            variant="subtitle2"
                            color="text.secondary"
                          >
                            Validation Status
                          </Typography>
                          <Typography variant="body1" gutterBottom>
                            {property.validation_status || "pending"}
                          </Typography>
                        </Box>
                        <Box sx={{ flex: 1 }}>
                          <Typography
                            variant="subtitle2"
                            color="text.secondary"
                          >
                            Validated By
                          </Typography>
                          <Typography variant="body1" gutterBottom>
                            {property.validated_by || "Not validated"}
                          </Typography>
                        </Box>
                      </Box>
                    </Stack>
                  </AccordionDetails>
                </Accordion>
              </Box>

              {/* Right column - Images */}
              <Box sx={{ flex: 1, minWidth: { md: 300 } }}>
                <Card>
                  <Box sx={{ p: 2 }}>
                    <Typography
                      variant="h6"
                      sx={{
                        display: "flex",
                        alignItems: "center",
                        gap: 1,
                        mb: 2,
                      }}
                    >
                      <ImageIcon /> Images ({images.length})
                    </Typography>
                    {images.length > 0 ? (
                      <Stack spacing={2}>
                        {images.map((image: string, index: number) => (
                          <Box key={index} sx={{ position: "relative" }}>
                            <CardMedia
                              component="img"
                              image={image}
                              alt={`Property image ${index + 1}`}
                              sx={{
                                borderRadius: 1,
                                cursor: "pointer",
                                "&:hover": { opacity: 0.8 },
                                maxHeight: 200,
                                objectFit: "cover",
                              }}
                              onClick={() => setSelectedImage(image)}
                            />
                            <Tooltip title="View full size">
                              <IconButton
                                sx={{
                                  position: "absolute",
                                  top: 8,
                                  right: 8,
                                  bgcolor: "rgba(0,0,0,0.5)",
                                  color: "white",
                                  "&:hover": { bgcolor: "rgba(0,0,0,0.7)" },
                                }}
                                size="small"
                                onClick={() => setSelectedImage(image)}
                              >
                                <ZoomInIcon fontSize="small" />
                              </IconButton>
                            </Tooltip>
                          </Box>
                        ))}
                      </Stack>
                    ) : (
                      <Typography color="text.secondary">
                        No images available
                      </Typography>
                    )}
                  </Box>
                </Card>
              </Box>
            </Box>

            {/* Moderation Notes - Full width at bottom */}
            <Card sx={{ p: 2 }}>
              <Typography variant="h6" gutterBottom>
                Moderation Notes
              </Typography>
              <TextField
                fullWidth
                multiline
                rows={4}
                value={moderationNotes}
                onChange={(e) => setModerationNotes(e.target.value)}
                placeholder="Enter moderation notes here..."
                variant="outlined"
                helperText="These notes will be saved with the approval/rejection decision"
              />
            </Card>
          </Box>
        </DialogContent>

        <DialogActions sx={{ p: 2, gap: 1 }}>
          <Button onClick={onClose} variant="outlined">
            Close
          </Button>
          <Button
            variant="contained"
            color="error"
            startIcon={<CloseIcon />}
            onClick={handleReject}
            disabled={isRejectPending}
          >
            Reject
          </Button>
          <Button
            variant="contained"
            color="success"
            startIcon={<CheckIcon />}
            onClick={handleApprove}
            disabled={isApprovePending}
          >
            Approve
          </Button>
        </DialogActions>
      </Dialog>

      {/* Full Size Image Modal */}
      <Dialog
        open={!!selectedImage}
        onClose={() => setSelectedImage(null)}
        maxWidth="lg"
        fullWidth
      >
        <DialogContent sx={{ p: 0 }}>
          {selectedImage && (
            <CardMedia
              component="img"
              image={selectedImage}
              alt="Property image full size"
              sx={{ width: "100%", height: "auto" }}
            />
          )}
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setSelectedImage(null)}>Close</Button>
        </DialogActions>
      </Dialog>
    </>
  );
};
