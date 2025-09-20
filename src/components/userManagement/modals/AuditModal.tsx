import React from "react";
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  Box,
  Typography,
  Tabs,
  Tab,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Chip,
  IconButton,
  Tooltip,
  CircularProgress,
  Alert,
} from "@mui/material";
import {
  Close as CloseIcon,
  History as HistoryIcon,
  Security as SecurityIcon,
  Person as PersonIcon,
  Refresh as RefreshIcon,
} from "@mui/icons-material";
import { AuditModalState } from "../../../types/userManagement";
import { useAuditLog } from "../../../hooks/userManagement/useAuditLog";

interface AuditModalProps {
  open: boolean;
  audit: AuditModalState;
  userEmail?: string;
  onClose: () => void;
  onUpdateTab: (tabValue: number) => void;
}

interface TabPanelProps {
  children?: React.ReactNode;
  index: number;
  value: number;
}

const TabPanel: React.FC<TabPanelProps> = ({ children, value, index }) => {
  return (
    <div hidden={value !== index}>
      {value === index && <Box sx={{ py: 2 }}>{children}</Box>}
    </div>
  );
};

export const AuditModal: React.FC<AuditModalProps> = ({
  open,
  audit,
  userEmail,
  onClose,
  onUpdateTab,
}) => {
  // Récupérer les vraies données depuis la base de données
  const {
    auditLogs,
    securityEvents,
    userActivity,
    isLoadingData,
    error,
    refetch,
  } = useAuditLog(audit.userId || undefined);

  const formatDate = (timestamp: string | null) => {
    if (!timestamp) return "N/A";
    return new Date(timestamp).toLocaleString("fr-FR");
  };

  const getActionColor = (action: string) => {
    const colors: Record<
      string,
      | "default"
      | "primary"
      | "secondary"
      | "error"
      | "info"
      | "success"
      | "warning"
    > = {
      USER_UPDATED: "info",
      USER_VALIDATED: "success",
      USER_SUSPENDED: "error",
      LOGIN_SUCCESS: "success",
      LOGIN_FAILED: "error",
      PASSWORD_RESET: "warning",
      BOOKING_CREATED: "primary",
      PROFILE_UPDATED: "info",
    };
    return colors[action] || "default";
  };

  return (
    <Dialog open={open} onClose={onClose} maxWidth="lg" fullWidth>
      <DialogTitle>
        <Box
          sx={{
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
          }}
        >
          <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
            <HistoryIcon />
            Audit & Historique
            {userEmail && (
              <Typography variant="body2" color="text.secondary">
                - {userEmail}
              </Typography>
            )}
          </Box>
          <Box sx={{ display: "flex", gap: 1 }}>
            <Tooltip title="Actualiser les données">
              <IconButton
                onClick={refetch}
                size="small"
                disabled={isLoadingData}
              >
                <RefreshIcon />
              </IconButton>
            </Tooltip>
            <IconButton onClick={onClose} size="small">
              <CloseIcon />
            </IconButton>
          </Box>
        </Box>
      </DialogTitle>

      <DialogContent sx={{ p: 0 }}>
        {/* Gestion du loading et des erreurs */}
        {isLoadingData && (
          <Box sx={{ display: "flex", justifyContent: "center", p: 3 }}>
            <CircularProgress />
          </Box>
        )}

        {error && (
          <Box sx={{ p: 3 }}>
            <Alert severity="error">
              Erreur lors du chargement des données d'audit:{" "}
              {error instanceof Error ? error.message : "Erreur inconnue"}
            </Alert>
          </Box>
        )}

        {!isLoadingData && !error && (
          <>
            <Box sx={{ borderBottom: 1, borderColor: "divider" }}>
              <Tabs
                value={audit.tabValue}
                onChange={(_, newValue) => onUpdateTab(newValue)}
                sx={{ px: 3 }}
              >
                <Tab
                  icon={<HistoryIcon />}
                  iconPosition="start"
                  label={`Actions Admin (${auditLogs.length})`}
                  id="audit-tab-0"
                />
                <Tab
                  icon={<SecurityIcon />}
                  iconPosition="start"
                  label={`Événements Sécurité (${securityEvents.length})`}
                  id="audit-tab-1"
                />
                <Tab
                  icon={<PersonIcon />}
                  iconPosition="start"
                  label={`Activité Utilisateur (${userActivity.length})`}
                  id="audit-tab-2"
                />
              </Tabs>
            </Box>

            <Box sx={{ px: 3 }}>
              {/* Tab 0: Actions Admin */}
              <TabPanel value={audit.tabValue} index={0}>
                <Typography variant="h6" gutterBottom>
                  Actions effectuées par les administrateurs
                </Typography>
                {auditLogs.length === 0 ? (
                  <Typography
                    variant="body2"
                    color="text.secondary"
                    sx={{ py: 2 }}
                  >
                    Aucune action d'audit trouvée pour cet utilisateur.
                  </Typography>
                ) : (
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
                        {auditLogs.map((log) => (
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
                            <TableCell>
                              {log.performed_by_email || "Système"}
                            </TableCell>
                          </TableRow>
                        ))}
                      </TableBody>
                    </Table>
                  </TableContainer>
                )}
              </TabPanel>

              {/* Tab 1: Événements Sécurité */}
              <TabPanel value={audit.tabValue} index={1}>
                <Typography variant="h6" gutterBottom>
                  Événements de sécurité et connexions
                </Typography>
                {securityEvents.length === 0 ? (
                  <Typography
                    variant="body2"
                    color="text.secondary"
                    sx={{ py: 2 }}
                  >
                    Aucun événement de sécurité trouvé pour cet utilisateur.
                  </Typography>
                ) : (
                  <TableContainer component={Paper} variant="outlined">
                    <Table size="small">
                      <TableHead>
                        <TableRow>
                          <TableCell>Session ID</TableCell>
                          <TableCell>Statut</TableCell>
                          <TableCell>Dernière activité</TableCell>
                          <TableCell>Adresse IP</TableCell>
                          <TableCell>User Agent</TableCell>
                        </TableRow>
                      </TableHead>
                      <TableBody>
                        {securityEvents.map((session) => (
                          <TableRow key={session.id}>
                            <TableCell>
                              <Typography
                                variant="body2"
                                sx={{ fontFamily: "monospace" }}
                              >
                                {session.id.substring(0, 8)}...
                              </Typography>
                            </TableCell>
                            <TableCell>
                              <Chip
                                label={
                                  session.is_active ? "Active" : "Terminée"
                                }
                                size="small"
                                color={
                                  session.is_active ? "success" : "default"
                                }
                              />
                            </TableCell>
                            <TableCell>
                              {formatDate(session.last_activity)}
                            </TableCell>
                            <TableCell>
                              {String(session.ip_address) || "N/A"}
                            </TableCell>
                            <TableCell>
                              <Tooltip title={session.user_agent || "N/A"}>
                                <Typography variant="body2" component="span">
                                  {session.device_type || "Inconnu"}
                                </Typography>
                              </Tooltip>
                            </TableCell>
                          </TableRow>
                        ))}
                      </TableBody>
                    </Table>
                  </TableContainer>
                )}
              </TabPanel>

              {/* Tab 2: Activité Utilisateur */}
              <TabPanel value={audit.tabValue} index={2}>
                <Typography variant="h6" gutterBottom>
                  Activité utilisateur récente
                </Typography>
                {userActivity.length === 0 ? (
                  <Typography
                    variant="body2"
                    color="text.secondary"
                    sx={{ py: 2 }}
                  >
                    Aucune activité récente trouvée pour cet utilisateur.
                  </Typography>
                ) : (
                  <TableContainer component={Paper} variant="outlined">
                    <Table size="small">
                      <TableHead>
                        <TableRow>
                          <TableCell>Type</TableCell>
                          <TableCell>Détails</TableCell>
                          <TableCell>Date</TableCell>
                          <TableCell>Statut</TableCell>
                        </TableRow>
                      </TableHead>
                      <TableBody>
                        {userActivity.map((booking) => (
                          <TableRow key={booking.id}>
                            <TableCell>
                              <Chip
                                label="Réservation"
                                size="small"
                                color="primary"
                              />
                            </TableCell>
                            <TableCell>
                              Propriété ID:{" "}
                              {booking.property_id.substring(0, 8)}...
                              <br />
                              Check-in:{" "}
                              {new Date(booking.check_in).toLocaleDateString(
                                "fr-FR"
                              )}
                              <br />
                              Check-out:{" "}
                              {new Date(booking.check_out).toLocaleDateString(
                                "fr-FR"
                              )}
                            </TableCell>
                            <TableCell>
                              {formatDate(booking.created_at)}
                            </TableCell>
                            <TableCell>
                              <Chip
                                label={booking.status || "N/A"}
                                size="small"
                                color={
                                  booking.status === "completed"
                                    ? "success"
                                    : booking.status === "pending"
                                    ? "warning"
                                    : "default"
                                }
                              />
                            </TableCell>
                          </TableRow>
                        ))}
                      </TableBody>
                    </Table>
                  </TableContainer>
                )}
              </TabPanel>
            </Box>
          </>
        )}
      </DialogContent>

      <DialogActions sx={{ px: 3, pb: 2 }}>
        <Button onClick={onClose} variant="outlined">
          Fermer
        </Button>
      </DialogActions>
    </Dialog>
  );
};
