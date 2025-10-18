import React from "react";
import {
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Chip,
  Typography,
} from "@mui/material";
import { formatDate, getActionColor } from "../utils/auditUtils";

interface AdminActionsTableProps {
  auditLogs: any[];
}

interface UserActionsTableProps {
  userActions: any[];
}

export const AdminActionsTable: React.FC<AdminActionsTableProps> = ({
  auditLogs,
}) => {
  if (auditLogs.length === 0) {
    return (
      <Typography variant="body2" color="text.secondary" sx={{ py: 2 }}>
        Aucune action d'audit trouvée pour cet utilisateur.
      </Typography>
    );
  }

  return (
    <TableContainer component={Paper} variant="outlined">
      <Table size="small">
        <TableHead>
          <TableRow>
            <TableCell>Action</TableCell>
            <TableCell>Description</TableCell>
            <TableCell>Date</TableCell>
            <TableCell>Administrateur</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {auditLogs.map((log: any) => (
            <TableRow key={log.id}>
              <TableCell>
                <Chip
                  label={log.action}
                  size="small"
                  color={getActionColor(log.action)}
                />
              </TableCell>
              <TableCell>{log.details || "N/A"}</TableCell>
              <TableCell>{formatDate(log.created_at)}</TableCell>
              <TableCell>{log.performed_by_email || "Système"}</TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </TableContainer>
  );
};

export const UserActionsTable: React.FC<UserActionsTableProps> = ({
  userActions,
}) => {
  if (userActions.length === 0) {
    return (
      <Typography variant="body2" color="text.secondary" sx={{ py: 2 }}>
        Aucune action utilisateur trouvée.
      </Typography>
    );
  }

  return (
    <TableContainer component={Paper} variant="outlined">
      <Table size="small">
        <TableHead>
          <TableRow>
            <TableCell>Type</TableCell>
            <TableCell>Action</TableCell>
            <TableCell>Description</TableCell>
            <TableCell>Date</TableCell>
            <TableCell>Statut</TableCell>
            <TableCell>Détails</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {userActions.map((action: any) => (
            <TableRow key={`${action.type}-${action.id}`}>
              <TableCell>
                <Chip
                  label={
                    action.type === "booking"
                      ? "Réservation"
                      : action.type === "property"
                      ? "Propriété"
                      : action.type === "intervention"
                      ? "Intervention"
                      : "Autre"
                  }
                  size="small"
                  color={
                    action.type === "booking"
                      ? "primary"
                      : action.type === "property"
                      ? "secondary"
                      : action.type === "intervention"
                      ? "info"
                      : "default"
                  }
                />
              </TableCell>
              <TableCell>
                <Chip
                  label={action.action}
                  size="small"
                  color={getActionColor(action.action)}
                />
              </TableCell>
              <TableCell>{action.description || "N/A"}</TableCell>
              <TableCell>{formatDate(action.created_at)}</TableCell>
              <TableCell>
                <Chip
                  label={action.status || "N/A"}
                  size="small"
                  color={
                    action.status === "completed"
                      ? "success"
                      : action.status === "pending"
                      ? "warning"
                      : action.status === "failed"
                      ? "error"
                      : "default"
                  }
                />
              </TableCell>
              <TableCell>{action.metadata || "N/A"}</TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </TableContainer>
  );
};
