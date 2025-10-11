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

interface RequestsTabPanelProps {
  serviceRequests: any[];
  formatCurrency: (amount: number) => string;
  formatDate: (dateString: string) => string;
  getStatusColor: (
    status: string
  ) => "primary" | "success" | "error" | "warning" | "default";
}

export const RequestsTabPanel: React.FC<RequestsTabPanelProps> = ({
  serviceRequests,
  formatCurrency,
  formatDate,
  getStatusColor,
}) => {
  if (serviceRequests.length === 0) {
    return (
      <Typography color="text.secondary" sx={{ textAlign: "center", py: 4 }}>
        Aucune demande trouvée
      </Typography>
    );
  }

  return (
    <TableContainer component={Paper}>
      <Table>
        <TableHead>
          <TableRow>
            <TableCell>Service</TableCell>
            <TableCell>Propriété</TableCell>
            <TableCell>Date demandée</TableCell>
            <TableCell>Montant</TableCell>
            <TableCell>Statut</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {serviceRequests.map((request) => (
            <TableRow key={request.id}>
              <TableCell>
                <Typography variant="body2" fontWeight="medium">
                  {request.services?.name || "Service inconnu"}
                </Typography>
                <Typography variant="caption" color="text.secondary">
                  {request.services?.category}
                </Typography>
              </TableCell>
              <TableCell>
                <Typography variant="body2">
                  {request.properties?.title || "Propriété inconnue"}
                </Typography>
                <Typography variant="caption" color="text.secondary">
                  {request.properties?.city}
                </Typography>
              </TableCell>
              <TableCell>{formatDate(request.requested_date)}</TableCell>
              <TableCell>{formatCurrency(request.total_amount)}</TableCell>
              <TableCell>
                <Chip
                  label={request.status || "Inconnu"}
                  color={getStatusColor(request.status)}
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
