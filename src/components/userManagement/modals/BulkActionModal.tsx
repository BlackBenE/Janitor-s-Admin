import React from "react";
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
  FormControlLabel,
  Switch,
  Divider,
  Chip,
} from "@mui/material";
import { BulkActionState } from "../../../types/userManagement";

interface BulkActionModalProps {
  open: boolean;
  bulkAction: BulkActionState;
  selectedUsers: string[];
  onClose: () => void;
  onConfirm: () => void;
  onUpdateRoleChange: (role: string) => void;
  onUpdateVipChange: (vip: boolean) => void;
}

export const BulkActionModal: React.FC<BulkActionModalProps> = ({
  open,
  bulkAction,
  selectedUsers,
  onClose,
  onConfirm,
  onUpdateRoleChange,
  onUpdateVipChange,
}) => {
  const roles = [
    { value: "user", label: "Utilisateur" },
    { value: "provider", label: "Prestataire" },
    { value: "admin", label: "Administrateur" },
  ];

  const getActionTitle = () => {
    switch (bulkAction.type) {
      case "delete":
        return "🗑️ Suppression en masse";
      case "role":
        return "👤 Changement de rôle en masse";
      case "vip":
        return "⭐ Modification VIP en masse";
      default:
        return "Action en masse";
    }
  };

  const getActionDescription = () => {
    switch (bulkAction.type) {
      case "delete":
        return "Supprimer définitivement les utilisateurs sélectionnés";
      case "role":
        return "Modifier le rôle des utilisateurs sélectionnés";
      case "vip":
        return "Modifier le statut VIP des utilisateurs sélectionnés";
      default:
        return "";
    }
  };

  const getConfirmButtonProps = () => {
    switch (bulkAction.type) {
      case "delete":
        return { color: "error" as const, text: "Supprimer" };
      case "role":
        return { color: "primary" as const, text: "Modifier les rôles" };
      case "vip":
        return { color: "secondary" as const, text: "Modifier le statut VIP" };
      default:
        return { color: "primary" as const, text: "Confirmer" };
    }
  };

  const buttonProps = getConfirmButtonProps();

  return (
    <Dialog open={open} onClose={onClose} maxWidth="sm" fullWidth>
      <DialogTitle>{getActionTitle()}</DialogTitle>

      <DialogContent>
        <Box sx={{ mt: 1 }}>
          <Box sx={{ mb: 3 }}>
            <Typography variant="body2" color="text.secondary" gutterBottom>
              Utilisateurs sélectionnés :
            </Typography>
            <Chip
              label={`${selectedUsers.length} utilisateur${
                selectedUsers.length > 1 ? "s" : ""
              }`}
              color="primary"
              variant="outlined"
            />
          </Box>

          <Typography variant="body1" sx={{ mb: 3 }}>
            {getActionDescription()}
          </Typography>

          <Divider sx={{ mb: 3 }} />

          {/* Configuration spécifique selon le type d'action */}
          {bulkAction.type === "role" && (
            <FormControl fullWidth sx={{ mb: 3 }}>
              <InputLabel>Nouveau rôle</InputLabel>
              <Select
                value={bulkAction.roleChange}
                label="Nouveau rôle"
                onChange={(e) => onUpdateRoleChange(e.target.value)}
              >
                {roles.map((role) => (
                  <MenuItem key={role.value} value={role.value}>
                    {role.label}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
          )}

          {bulkAction.type === "vip" && (
            <Box sx={{ mb: 3 }}>
              <FormControlLabel
                control={
                  <Switch
                    checked={bulkAction.vipChange}
                    onChange={(e) => onUpdateVipChange(e.target.checked)}
                  />
                }
                label={
                  bulkAction.vipChange
                    ? "Activer le statut VIP"
                    : "Désactiver le statut VIP"
                }
              />
            </Box>
          )}

          {/* Avertissement */}
          <Box
            sx={{
              p: 2,
              backgroundColor:
                bulkAction.type === "delete" ? "error.light" : "warning.light",
              borderRadius: 1,
              color:
                bulkAction.type === "delete"
                  ? "error.contrastText"
                  : "warning.contrastText",
            }}
          >
            <Typography variant="body2" sx={{ fontWeight: 500 }}>
              {bulkAction.type === "delete"
                ? "⚠️ Attention - Action irréversible"
                : "⚠️ Attention"}
            </Typography>
            <Typography variant="body2">
              {bulkAction.type === "delete"
                ? "Cette action supprimera définitivement les comptes utilisateurs. Cette opération ne peut pas être annulée."
                : "Cette action modifiera les données de tous les utilisateurs sélectionnés. L'opération sera enregistrée dans l'audit."}
            </Typography>
          </Box>
        </Box>
      </DialogContent>

      <DialogActions sx={{ px: 3, pb: 2 }}>
        <Button onClick={onClose} color="inherit">
          Annuler
        </Button>
        <Button
          onClick={onConfirm}
          variant="contained"
          color={buttonProps.color}
          disabled={
            (bulkAction.type === "role" && !bulkAction.roleChange) ||
            selectedUsers.length === 0
          }
        >
          {buttonProps.text}
        </Button>
      </DialogActions>
    </Dialog>
  );
};
