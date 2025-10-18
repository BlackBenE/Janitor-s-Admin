import React from "react";
import { Box, Card, CardContent, Typography } from "@mui/material";
import Grid from "@mui/material/Grid";
import { Build, Assignment, CheckCircle, Euro } from "@mui/icons-material";

interface ServiceStatsCardsProps {
  activeServices: any[];
  serviceRequests: any[];
  completedInterventions: any[];
  totalEarnings: number;
  formatCurrency: (amount: number) => string;
}

export const ServiceStatsCards: React.FC<ServiceStatsCardsProps> = ({
  activeServices,
  serviceRequests,
  completedInterventions,
  totalEarnings,
  formatCurrency,
}) => {
  return (
    <Grid container spacing={3} sx={{ mb: 3 }}>
      <Grid size={{ xs: 12, sm: 6, md: 3 }}>
        <Card>
          <CardContent>
            <Box display="flex" alignItems="center" gap={1}>
              <Build color="primary" />
              <Typography variant="h6">{activeServices.length}</Typography>
            </Box>
            <Typography variant="body2" color="text.secondary">
              Services actifs
            </Typography>
          </CardContent>
        </Card>
      </Grid>

      <Grid size={{ xs: 12, sm: 6, md: 3 }}>
        <Card>
          <CardContent>
            <Box display="flex" alignItems="center" gap={1}>
              <Assignment color="primary" />
              <Typography variant="h6">{serviceRequests.length}</Typography>
            </Box>
            <Typography variant="body2" color="text.secondary">
              Demandes reçues
            </Typography>
          </CardContent>
        </Card>
      </Grid>

      <Grid size={{ xs: 12, sm: 6, md: 3 }}>
        <Card>
          <CardContent>
            <Box display="flex" alignItems="center" gap={1}>
              <CheckCircle color="primary" />
              <Typography variant="h6">
                {completedInterventions.length}
              </Typography>
            </Box>
            <Typography variant="body2" color="text.secondary">
              Interventions terminées
            </Typography>
          </CardContent>
        </Card>
      </Grid>

      <Grid size={{ xs: 12, sm: 6, md: 3 }}>
        <Card>
          <CardContent>
            <Box display="flex" alignItems="center" gap={1}>
              <Euro color="primary" />
              <Typography variant="h6">
                {formatCurrency(totalEarnings)}
              </Typography>
            </Box>
            <Typography variant="body2" color="text.secondary">
              Revenus totaux
            </Typography>
          </CardContent>
        </Card>
      </Grid>
    </Grid>
  );
};
