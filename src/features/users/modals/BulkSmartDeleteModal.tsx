import React, { useState } from "react";
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  Box,
  Typography,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  TextField,
  Chip,
  Alert,
  Divider,
} from "@mui/material";
import {
  Shield as ShieldIcon,
  Warning as WarningIcon,
  Gavel as GavelIcon,
  Policy as PolicyIcon,
} from "@mui/icons-material";
import {
  DeletionReason,
  AnonymizationLevel,
} from "@/types/dataRetention";

interface BulkSmartDeleteModalProps {
  open: boolean;
  selectedUserIds: string[];
  selectedUserNames?: string[]; // Optionnel pour l'affichage
  onClose: () => void;
  onConfirm: (
    reason: DeletionReason,
    level: AnonymizationLevel,
    customReason?: string
  ) => Promise<void>;
  isDeleting?: boolean;
}

// Stratégies de suppression en lot simplifiées
const BULK_DELETION_STRATEGIES = [
  {
    reason: DeletionReason.GDPR_COMPLIANCE,
    level: AnonymizationLevel.PARTIAL,
    icon: <ShieldIcon />,
    title: "Suppression RGPD",
    description: "Droit à l'effacement - Anonymisation immédiate",
    color: "primary" as const,
    severity: "info" as const,
  },
  {
    reason: DeletionReason.ADMIN_ACTION,
    level: AnonymizationLevel.PARTIAL,
    icon: <GavelIcon />,
    title: "Suppression administrative",
    description:
      "Suppression par l'administrateur avec conservation pour audit",
    color: "warning" as const,
    severity: "info" as const,
  },
  {
    reason: DeletionReason.POLICY_VIOLATION,
    level: AnonymizationLevel.FULL,
    icon: <PolicyIcon />,
    title: "Suppression disciplinaire",
    description: "Suppression immédiate pour comportement inapproprié",
    color: "error" as const,
    severity: "error" as const,
  },
];

export const BulkSmartDeleteModal: React.FC<BulkSmartDeleteModalProps> = ({
  open,
  selectedUserIds,
  selectedUserNames,
  onClose,
  onConfirm,
  isDeleting = false,
}) => {
  const [selectedStrategy, setSelectedStrategy] = useState<number>(0);
  const [customReason, setCustomReason] = useState("");

  const handleConfirm = async () => {
    const strategy = BULK_DELETION_STRATEGIES[selectedStrategy];
    await onConfirm(strategy.reason, strategy.level, customReason || undefined);
    onClose();
  };

  const handleClose = () => {
    if (!isDeleting) {
      setSelectedStrategy(0);
      setCustomReason("");
      onClose();
    }
  };

  return (
    <Dialog open={open} onClose={handleClose} maxWidth="md" fullWidth>
      <DialogTitle>
        <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
          <ShieldIcon color="warning" />
          <Typography variant="h6">Suppression intelligente en lot</Typography>
        </Box>
      </DialogTitle>

      <DialogContent>
        <Box sx={{ mb: 3 }}>
          <Typography variant="body2" color="text.secondary" gutterBottom>
            Utilisateurs sélectionnés pour suppression :
          </Typography>
          <Chip
            label={`${selectedUserIds.length} utilisateur${
              selectedUserIds.length > 1 ? "s" : ""
            }`}
            color="warning"
            variant="outlined"
            size="small"
          />
        </Box>

        <Alert severity="warning" sx={{ mb: 3 }}>
          <Typography variant="body2">
            Cette action appliquera la stratégie de suppression sélectionnée à
            tous les utilisateurs choisis. L'anonymisation respectera les
            exigences légales et de conformité.
          </Typography>
        </Alert>

        <Typography variant="h6" gutterBottom sx={{ mt: 3 }}>
          Sélectionnez une stratégie de suppression :
        </Typography>

        <Box sx={{ display: "flex", flexDirection: "column", gap: 2 }}>
          {BULK_DELETION_STRATEGIES.map((strategy, index) => (
            <Box
              key={strategy.reason}
              sx={{
                p: 2,
                border: 2,
                borderColor:
                  selectedStrategy === index
                    ? `${strategy.color}.main`
                    : "grey.300",
                borderRadius: 1,
                cursor: "pointer",
                backgroundColor:
                  selectedStrategy === index
                    ? `${strategy.color}.50`
                    : "transparent",
                transition: "all 0.2s ease",
                "&:hover": {
                  borderColor: `${strategy.color}.main`,
                  backgroundColor: `${strategy.color}.50`,
                },
              }}
              onClick={() => setSelectedStrategy(index)}
            >
              <Box
                sx={{ display: "flex", alignItems: "center", gap: 1, mb: 1 }}
              >
                {React.cloneElement(strategy.icon, {
                  color: selectedStrategy === index ? strategy.color : "action",
                })}
                <Typography variant="subtitle1" fontWeight="medium">
                  {strategy.title}
                </Typography>
                <Chip
                  size="small"
                  label={strategy.level}
                  color={strategy.color}
                  variant={selectedStrategy === index ? "filled" : "outlined"}
                />
              </Box>
              <Typography variant="body2" color="text.secondary">
                {strategy.description}
              </Typography>
            </Box>
          ))}
        </Box>

        <Divider sx={{ my: 3 }} />

        <TextField
          fullWidth
          label="Raison personnalisée (optionnel)"
          multiline
          rows={2}
          value={customReason}
          onChange={(e) => setCustomReason(e.target.value)}
          placeholder="Ajoutez des détails spécifiques pour cette suppression en lot..."
          helperText="Cette information sera conservée dans les logs d'audit"
        />

        <Alert
          severity={BULK_DELETION_STRATEGIES[selectedStrategy].severity}
          sx={{ mt: 2 }}
        >
          <Typography variant="body2">
            <strong>Niveau d'anonymisation :</strong>{" "}
            {BULK_DELETION_STRATEGIES[selectedStrategy].level}
            <br />
            <strong>Impact :</strong>{" "}
            {BULK_DELETION_STRATEGIES[selectedStrategy].description}
          </Typography>
        </Alert>
      </DialogContent>

      <DialogActions sx={{ p: 3 }}>
        <Button onClick={handleClose} disabled={isDeleting} variant="outlined">
          Annuler
        </Button>
        <Button
          onClick={handleConfirm}
          disabled={isDeleting}
          variant="contained"
          color={BULK_DELETION_STRATEGIES[selectedStrategy].color}
          startIcon={<ShieldIcon />}
          sx={{ minWidth: 200 }}
        >
          {isDeleting
            ? "Suppression en cours..."
            : `Supprimer ${selectedUserIds.length} utilisateur${
                selectedUserIds.length > 1 ? "s" : ""
              }`}
        </Button>
      </DialogActions>
    </Dialog>
  );
};
