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
  Person as PersonIcon,
  AdminPanelSettings as AdminIcon,
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
  // Récupérer les logs d'audit et les actions utilisateur
  const {
    auditLogs,
    userActions,
    isLoadingLogs,
    isLoadingActivity,
    auditError,
    activityError,
    refetchLogs,
    refetchActivity,
  } = useAuditLog(audit.userId || undefined);

  const isLoadingData = isLoadingLogs || isLoadingActivity;
  const combinedError = auditError || activityError;

  const refetch = () => {
    refetchLogs();
    refetchActivity();
  };

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
      // Actions administratives
      USER_UPDATED: "info",
      USER_VALIDATED: "success",
      USER_SUSPENDED: "error",
      LOGIN_SUCCESS: "success",
      LOGIN_FAILED: "error",
      PASSWORD_RESET: "warning",
      PROFILE_UPDATED: "info",

      // Actions utilisateur
      BOOKING_CREATED: "primary",
      PROPERTY_CREATED: "secondary",
      INTERVENTION_CREATED: "info",
      NOTIFICATION_CREATED: "default",
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
                onClick={() => refetch()}
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

        {combinedError && (
          <Box sx={{ p: 3 }}>
            <Alert severity="error">
              Erreur lors du chargement des données d'audit:{" "}
              {combinedError &&
              typeof combinedError === "object" &&
              "message" in combinedError
                ? (combinedError as Error).message
                : "Erreur inconnue"}
            </Alert>
          </Box>
        )}

        {!isLoadingData && !combinedError && (
          <>
            <Box sx={{ borderBottom: 1, borderColor: "divider" }}>
              <Tabs
                value={audit.tabValue}
                onChange={(_, newValue) => onUpdateTab(newValue)}
                sx={{ px: 3 }}
              >
                <Tab
                  icon={<AdminIcon />}
                  iconPosition="start"
                  label={`Actions Admin (${auditLogs.length})`}
                  id="audit-tab-0"
                />
                <Tab
                  icon={<PersonIcon />}
                  iconPosition="start"
                  label={`Actions Utilisateur (${userActions.length})`}
                  id="audit-tab-1"
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

              {/* Tab 1: Actions Utilisateur */}
              <TabPanel value={audit.tabValue} index={1}>
                <Typography variant="h6" gutterBottom>
                  Actions de l'utilisateur
                </Typography>
                {userActions.length === 0 ? (
                  <Typography
                    variant="body2"
                    color="text.secondary"
                    sx={{ py: 2 }}
                  >
                    Aucune action utilisateur trouvée.
                  </Typography>
                ) : (
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
                        {userActions.map((action) => (
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
                            <TableCell>{action.description}</TableCell>
                            <TableCell>
                              {formatDate(action.created_at)}
                            </TableCell>
                            <TableCell>
                              <Chip
                                label={action.status || "N/A"}
                                size="small"
                                color={
                                  action.status === "completed" ||
                                  action.status === "confirmed"
                                    ? "success"
                                    : action.status === "pending"
                                    ? "warning"
                                    : action.status === "active"
                                    ? "info"
                                    : "default"
                                }
                              />
                            </TableCell>
                            <TableCell>
                              {action.metadata && (
                                <Typography
                                  variant="caption"
                                  component="div"
                                  sx={{ color: "text.secondary" }}
                                >
                                  {action.type === "booking" &&
                                    action.metadata.total_amount &&
                                    `Montant: ${action.metadata.total_amount}€`}
                                  {action.type === "property" &&
                                    action.metadata.price &&
                                    `Prix: ${action.metadata.price}€/nuit`}
                                  {action.type === "intervention" &&
                                    action.metadata.service_request_id &&
                                    `Demande: ${action.metadata.service_request_id.substring(
                                      0,
                                      8
                                    )}...`}
                                </Typography>
                              )}
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
