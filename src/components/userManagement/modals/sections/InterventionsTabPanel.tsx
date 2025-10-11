import React from "react";
import {
  Box,
  Card,
  CardContent,
  Typography,
  Chip,
  ImageList,
  ImageListItem,
  ImageListItemBar,
} from "@mui/material";
import Grid from "@mui/material/Grid";

interface InterventionsTabPanelProps {
  interventions: any[];
  formatCurrency: (amount: number) => string;
  formatDate: (dateString: string) => string;
  getStatusColor: (
    status: string
  ) => "primary" | "success" | "error" | "warning" | "default";
}

export const InterventionsTabPanel: React.FC<InterventionsTabPanelProps> = ({
  interventions,
  formatCurrency,
  formatDate,
  getStatusColor,
}) => {
  if (interventions.length === 0) {
    return (
      <Typography color="text.secondary" sx={{ textAlign: "center", py: 4 }}>
        Aucune intervention trouvée
      </Typography>
    );
  }

  return (
    <Box sx={{ display: "flex", flexDirection: "column", gap: 2 }}>
      {interventions.map((intervention) => (
        <Card key={intervention.id} variant="outlined">
          <CardContent>
            {/* En-tête */}
            <Box mb={2}>
              <Box
                display="flex"
                justifyContent="space-between"
                alignItems="start"
                mb={1}
              >
                <Typography variant="h6" gutterBottom>
                  {intervention.service_requests?.services?.name ||
                    "Service inconnu"}
                </Typography>
                <Chip
                  label={intervention.status || "Inconnu"}
                  color={getStatusColor(intervention.status)}
                  size="small"
                />
              </Box>

              <Typography variant="body2" color="text.secondary" gutterBottom>
                Propriété:{" "}
                {intervention.service_requests?.properties?.title ||
                  "Propriété inconnue"}
              </Typography>

              {intervention.description && (
                <Typography variant="body2" sx={{ mt: 1 }}>
                  {intervention.description}
                </Typography>
              )}

              {intervention.cost && (
                <Typography
                  variant="body2"
                  color="primary"
                  sx={{ mt: 1, fontWeight: 500 }}
                >
                  Coût: {formatCurrency(intervention.cost)}
                </Typography>
              )}
            </Box>

            {/* Photos */}
            {(intervention.before_photos || intervention.after_photos) && (
              <Box mb={2}>
                <Typography variant="subtitle2" gutterBottom>
                  Photos de l'intervention
                </Typography>
                <Grid container spacing={2}>
                  {intervention.before_photos && (
                    <Grid size={{ xs: 12, md: 6 }}>
                      <Typography
                        variant="body2"
                        color="text.secondary"
                        gutterBottom
                      >
                        Avant ({intervention.before_photos.length} photos)
                      </Typography>
                      <ImageList cols={2} rowHeight={100}>
                        {intervention.before_photos
                          .slice(0, 4)
                          .map((photo: string, index: number) => (
                            <ImageListItem key={`before-${index}`}>
                              <img
                                src={photo}
                                alt={`Avant ${index + 1}`}
                                loading="lazy"
                              />
                              <ImageListItemBar title="Avant" />
                            </ImageListItem>
                          ))}
                      </ImageList>
                    </Grid>
                  )}
                  {intervention.after_photos && (
                    <Grid size={{ xs: 12, md: 6 }}>
                      <Typography
                        variant="body2"
                        color="text.secondary"
                        gutterBottom
                      >
                        Après ({intervention.after_photos.length} photos)
                      </Typography>
                      <ImageList cols={2} rowHeight={100}>
                        {intervention.after_photos
                          .slice(0, 4)
                          .map((photo: string, index: number) => (
                            <ImageListItem key={`after-${index}`}>
                              <img
                                src={photo}
                                alt={`Après ${index + 1}`}
                                loading="lazy"
                              />
                              <ImageListItemBar title="Après" />
                            </ImageListItem>
                          ))}
                      </ImageList>
                    </Grid>
                  )}
                </Grid>
              </Box>
            )}

            {/* Dates */}
            <Box mt={2}>
              <Grid container spacing={2}>
                {intervention.started_at && (
                  <Grid size={{ xs: 12, sm: 4 }}>
                    <Typography variant="caption" color="text.secondary">
                      Démarrée le
                    </Typography>
                    <Typography variant="body2">
                      {formatDate(intervention.started_at)}
                    </Typography>
                  </Grid>
                )}
                {intervention.completed_at && (
                  <Grid size={{ xs: 12, sm: 4 }}>
                    <Typography variant="caption" color="text.secondary">
                      Terminée le
                    </Typography>
                    <Typography variant="body2">
                      {formatDate(intervention.completed_at)}
                    </Typography>
                  </Grid>
                )}
              </Grid>
            </Box>
          </CardContent>
        </Card>
      ))}
    </Box>
  );
};
