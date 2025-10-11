import React from "react";
import {
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Typography,
  Chip,
} from "@mui/material";

interface ServicesTabPanelProps {
  services: any[];
  formatCurrency: (amount: number) => string;
  getStatusColor: (
    status: string
  ) => "primary" | "success" | "error" | "warning" | "default";
}

export const ServicesTabPanel: React.FC<ServicesTabPanelProps> = ({
  services,
  formatCurrency,
  getStatusColor,
}) => {
  if (services.length === 0) {
    return (
      <Typography color="text.secondary" sx={{ textAlign: "center", py: 4 }}>
        Aucun service trouvé
      </Typography>
    );
  }

  return (
    <TableContainer component={Paper}>
      <Table>
        <TableHead>
          <TableRow>
            <TableCell>Service</TableCell>
            <TableCell>Catégorie</TableCell>
            <TableCell>Prix de base</TableCell>
            <TableCell>Durée</TableCell>
            <TableCell>Statut</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {services.map((service) => (
            <TableRow key={service.id}>
              <TableCell>
                <Typography variant="body2" fontWeight="medium">
                  {service.name}
                </Typography>
                <Typography variant="caption" color="text.secondary">
                  {service.description}
                </Typography>
              </TableCell>
              <TableCell>{service.category}</TableCell>
              <TableCell>
                {formatCurrency(service.base_price)}
                <Typography variant="caption" display="block">
                  {service.price_type}
                </Typography>
              </TableCell>
              <TableCell>
                {service.duration_minutes
                  ? `${service.duration_minutes} min`
                  : "N/A"}
              </TableCell>
              <TableCell>
                <Chip
                  label={service.is_active ? "Actif" : "Inactif"}
                  color={service.is_active ? "success" : "default"}
                  size="small"
                />
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </TableContainer>
  );
};
