import React, { useState } from "react";
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  TextField,
  FormControl,
  FormLabel,
  RadioGroup,
  FormControlLabel,
  Radio,
  Typography,
  Box,
  Chip,
  Alert,
  CircularProgress,
  Tooltip,
  IconButton,
} from "@mui/material";
import {
  DeleteForever as DeleteIcon,
  Security as GdprIcon,
  Person as UserIcon,
  AdminPanelSettings as AdminIcon,
  Warning as WarningIcon,
  InfoOutlined as InfoIcon,
} from "@mui/icons-material";
import {
  DeletionReason,
  AnonymizationLevel,
} from "../../../types/dataRetention";
import { UserProfile } from "../../../types/userManagement";

// Types pour la configuration des stratégies
interface DeletionStrategy {
  id: string;
  reason: DeletionReason;
  level: AnonymizationLevel;
  label: string;
  description: string;
  icon: React.ReactNode;
  color: "primary" | "warning" | "error" | "info";
  details: string[];
  legalBasis?: string;
}

// Stratégies simplifiées
const DELETION_STRATEGIES: DeletionStrategy[] = [
  {
    id: "gdpr",
    reason: DeletionReason.GDPR_COMPLIANCE,
    level: AnonymizationLevel.PARTIAL,
    label: "Suppression RGPD",
    description: "Droit à l'effacement - Anonymisation immédiate",
    icon: <GdprIcon />,
    color: "primary",
    details: [
      "Anonymisation immédiate des données personnelles",
      "Conservation des données métier anonymisées",
      "Purge finale automatique selon les durées légales",
    ],
    legalBasis: "Droit à l'effacement",
  },
  {
    id: "admin_action",
    reason: DeletionReason.ADMIN_ACTION,
    level: AnonymizationLevel.PARTIAL,
    label: "Suppression administrative",
    description:
      "Suppression par l'administrateur avec conservation pour audit",
    icon: <AdminIcon />,
    color: "warning",
    details: [
      "Anonymisation des données personnelles",
      "Conservation pour audit (3 ans)",
      "Traçabilité administrative maintenue",
      "Données conservées pour conformité légale",
    ],
  },
  {
    id: "policy_violation",
    reason: DeletionReason.POLICY_VIOLATION,
    level: AnonymizationLevel.FULL,
    label: "Suppression disciplinaire",
    description: "Suppression immédiate des données",
    icon: <WarningIcon />,
    color: "error",
    details: [
      "Suppression immédiate de toutes les données personnelles",
      "Suppression des données métier non-légales",
      "Conservation minimale des données financières (obligation légale)",
      "Action irréversible - Aucune restauration possible",
    ],
  },
];

interface SmartDeleteModalProps {
  open: boolean;
  user: UserProfile | null;
  onClose: () => void;
  onConfirm: (
    userId: string,
    reason: DeletionReason,
    level: AnonymizationLevel,
    customReason?: string
  ) => Promise<void>;
  isDeleting: boolean;
}

export const SmartDeleteModal: React.FC<SmartDeleteModalProps> = ({
  open,
  user,
  onClose,
  onConfirm,
  isDeleting,
}) => {
  const [selectedStrategy, setSelectedStrategy] = useState<string>("gdpr");
  const [customReason, setCustomReason] = useState<string>("");
  const [error, setError] = useState<string>("");

  const selectedStrategyConfig = DELETION_STRATEGIES.find(
    (s) => s.id === selectedStrategy
  );

  const handleConfirm = async () => {
    if (!user || !selectedStrategyConfig) return;

    try {
      setError("");
      await onConfirm(
        user.id,
        selectedStrategyConfig.reason,
        selectedStrategyConfig.level,
        customReason || undefined
      );
      onClose();
      // Reset form
      setSelectedStrategy("gdpr");
      setCustomReason("");
    } catch (err) {
      setError(
        err instanceof Error ? err.message : "Erreur lors de la suppression"
      );
    }
  };

  const handleClose = () => {
    if (!isDeleting) {
      onClose();
      setError("");
    }
  };

  return (
    <Dialog open={open} onClose={handleClose} maxWidth="md" fullWidth>
      <DialogTitle sx={{ display: "flex", alignItems: "center", gap: 1 }}>
        <DeleteIcon color="error" />
        Suppression intelligente d'utilisateur
      </DialogTitle>

      <DialogContent>
        {user && (
          <Box sx={{ mb: 3 }}>
            <Alert severity="warning" sx={{ mb: 2 }}>
              <Typography variant="body2">
                Vous êtes sur le point de supprimer l'utilisateur{" "}
                <strong>{user.full_name || user.email}</strong>. Cette action
                déclenchera une anonymisation selon la stratégie sélectionnée.
              </Typography>
            </Alert>

            <Box
              sx={{
                p: 2,
                bgcolor: "background.paper",
                borderRadius: 1,
                border: 1,
                borderColor: "divider",
              }}
            >
              <Typography variant="subtitle2" gutterBottom>
                Informations utilisateur :
              </Typography>
              <Typography variant="body2">Email : {user.email}</Typography>
              <Typography variant="body2">Rôle : {user.role}</Typography>
              <Typography variant="body2">
                Créé le : {new Date(user.created_at || "").toLocaleDateString()}
              </Typography>
            </Box>
          </Box>
        )}

        <FormControl component="fieldset" fullWidth sx={{ mb: 3 }}>
          <FormLabel component="legend">
            <Typography variant="h6" gutterBottom>
              Stratégie de suppression
            </Typography>
          </FormLabel>

          <RadioGroup
            value={selectedStrategy}
            onChange={(e) => setSelectedStrategy(e.target.value)}
          >
            {DELETION_STRATEGIES.map((strategy) => (
              <Box key={strategy.id} sx={{ mb: 2 }}>
                <FormControlLabel
                  value={strategy.id}
                  control={<Radio />}
                  label={
                    <Box sx={{ ml: 1 }}>
                      <Box
                        sx={{
                          display: "flex",
                          alignItems: "center",
                          gap: 1,
                          mb: 0.5,
                        }}
                      >
                        {strategy.icon}
                        <Typography variant="subtitle1" fontWeight="medium">
                          {strategy.label}
                        </Typography>
                        <Chip
                          size="small"
                          label={
                            strategy.level === AnonymizationLevel.PARTIAL
                              ? "Partielle"
                              : "Complète"
                          }
                          color={strategy.color}
                        />
                        <Tooltip
                          title={
                            <Box>
                              {strategy.details.map((detail, index) => (
                                <Typography
                                  key={index}
                                  variant="caption"
                                  display="block"
                                  sx={{ mb: 0.5 }}
                                >
                                  • {detail}
                                </Typography>
                              ))}
                              {strategy.legalBasis && (
                                <Typography
                                  variant="caption"
                                  display="block"
                                  sx={{ mt: 1, fontStyle: "italic" }}
                                >
                                  Base légale : {strategy.legalBasis}
                                </Typography>
                              )}
                            </Box>
                          }
                          placement="top"
                        >
                          <IconButton size="small" sx={{ ml: 0.5 }}>
                            <InfoIcon fontSize="small" />
                          </IconButton>
                        </Tooltip>
                      </Box>
                      <Typography
                        variant="body2"
                        color="text.secondary"
                        sx={{ ml: 4 }}
                      >
                        {strategy.description}
                      </Typography>
                    </Box>
                  }
                />
              </Box>
            ))}
          </RadioGroup>
        </FormControl>

        <TextField
          label="Raison personnalisée (optionnel)"
          placeholder="Précisez la raison de cette suppression..."
          multiline
          rows={3}
          fullWidth
          value={customReason}
          onChange={(e) => setCustomReason(e.target.value)}
          helperText="Cette raison sera conservée dans les logs d'audit"
          sx={{ mb: 2 }}
        />

        {error && (
          <Alert severity="error" sx={{ mb: 2 }}>
            {error}
          </Alert>
        )}

        {selectedStrategyConfig && (
          <Alert
            severity={
              selectedStrategyConfig.id === "policy_violation"
                ? "error"
                : "info"
            }
            sx={{ mb: 2 }}
          >
            <Typography variant="body2">
              <strong>Attention :</strong> Cette action est{" "}
              {selectedStrategyConfig.id === "policy_violation"
                ? "irréversible"
                : "partiellement réversible"}
              .
              {selectedStrategyConfig.id !== "policy_violation" &&
                " Vous pourrez restaurer les données depuis l'onglet 'Utilisateurs supprimés' avant la purge finale."}
            </Typography>
          </Alert>
        )}
      </DialogContent>

      <DialogActions>
        <Button onClick={handleClose} disabled={isDeleting}>
          Annuler
        </Button>
        <Button
          variant="contained"
          color={selectedStrategyConfig?.color || "primary"}
          onClick={handleConfirm}
          disabled={isDeleting || !user}
          startIcon={
            isDeleting ? <CircularProgress size={16} /> : <DeleteIcon />
          }
        >
          {isDeleting ? "Suppression..." : "Confirmer la suppression"}
        </Button>
      </DialogActions>
    </Dialog>
  );
};
