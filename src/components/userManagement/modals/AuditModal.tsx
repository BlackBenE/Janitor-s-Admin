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
  IconButton,
  Tooltip,
  CircularProgress,
  Alert,
} from "@mui/material";
import {
  Close as CloseIcon,
  Person as PersonIcon,
  AdminPanelSettings as AdminIcon,
  Refresh as RefreshIcon,
} from "@mui/icons-material";
import { AuditModalState } from "../../../types/userManagement";
import { useUserAuditLog } from "../hooks/useUserQueries";
import { TabPanel } from "./sections/AuditTabPanel";
import { AdminActionsTable, UserActionsTable } from "./sections/AuditTables";

interface AuditModalProps {
  open: boolean;
  audit: AuditModalState;
  userEmail?: string;
  onClose: () => void;
  onUpdateTab: (tabValue: number) => void;
}

export const AuditModal: React.FC<AuditModalProps> = ({
  open,
  audit,
  userEmail,
  onClose,
  onUpdateTab,
}) => {
  // 🎯 Hook migration - React Query intégré
  const {
    data: auditLogs = [],
    isLoading: isLoadingData,
    error: combinedError,
    refetch,
  } = useUserAuditLog(audit.userId || undefined);

  // Pour compatibilité avec l'ancien code, créer userActions vide
  // (peut être remplacé par un autre hook si nécessaire)
  const userActions: any[] = [];

  const handleRefetch = () => {
    refetch();
  };

  return (
    <Dialog open={open} onClose={onClose} maxWidth="lg" fullWidth>
      <DialogTitle>
        <Box sx={{ display: "flex", alignItems: "center", gap: 2 }}>
          <Typography variant="h6">Audit & Historique</Typography>
          {userEmail && (
            <Typography variant="body2" color="text.secondary">
              • {userEmail}
            </Typography>
          )}
          <Box sx={{ ml: "auto" }}>
            <Tooltip title="Actualiser">
              <IconButton onClick={handleRefetch} size="small">
                <RefreshIcon />
              </IconButton>
            </Tooltip>
            <IconButton onClick={onClose} size="small">
              <CloseIcon />
            </IconButton>
          </Box>
        </Box>
      </DialogTitle>

      <DialogContent>
        {isLoadingData && (
          <Box sx={{ display: "flex", justifyContent: "center", p: 3 }}>
            <CircularProgress />
          </Box>
        )}

        {combinedError && (
          <Alert severity="error">
            Erreur lors du chargement: {String(combinedError)}
          </Alert>
        )}

        {!isLoadingData && !combinedError && (
          <>
            <Tabs
              value={audit.tabValue}
              onChange={(_, newValue) => onUpdateTab(newValue)}
            >
              <Tab
                icon={<AdminIcon />}
                label={`Actions Admin (${auditLogs.length})`}
              />
              <Tab
                icon={<PersonIcon />}
                label={`Actions User (${userActions.length})`}
              />
            </Tabs>

            <TabPanel value={audit.tabValue} index={0}>
              <Typography variant="h6" gutterBottom>
                Actions effectuées par les administrateurs
              </Typography>
              <AdminActionsTable auditLogs={auditLogs} />
            </TabPanel>

            <TabPanel value={audit.tabValue} index={1}>
              <Typography variant="h6" gutterBottom>
                Actions de l'utilisateur
              </Typography>
              <UserActionsTable userActions={userActions} />
            </TabPanel>
          </>
        )}
      </DialogContent>

      <DialogActions>
        <Button onClick={onClose} variant="outlined">
          Fermer
        </Button>
      </DialogActions>
    </Dialog>
  );
};
