import React from "react";
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  Box,
  Typography,
  TextField,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Divider,
} from "@mui/material";
import { LockAccountState } from "../../../types/userManagement";

interface LockAccountModalProps {
  open: boolean;
  lockAccount: LockAccountState;
  userEmail?: string;
  onClose: () => void;
  onConfirm: () => void;
  onUpdateDuration: (duration: number) => void;
  onUpdateReason: (reason: string) => void;
}

export const LockAccountModal: React.FC<LockAccountModalProps> = ({
  open,
  lockAccount,
  userEmail,
  onClose,
  onConfirm,
  onUpdateDuration,
  onUpdateReason,
}) => {
  const durations = [
    { value: 60, label: "1 heure" },
    { value: 360, label: "6 heures" },
    { value: 720, label: "12 heures" },
    { value: 1440, label: "24 heures" },
    { value: 4320, label: "3 jours" },
    { value: 10080, label: "7 jours" },
    { value: 43200, label: "30 jours" },
  ];

  return (
    <Dialog open={open} onClose={onClose} maxWidth="sm" fullWidth>
      <DialogTitle>
        <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
          🔒 Verrouiller le compte
        </Box>
      </DialogTitle>

      <DialogContent>
        <Box sx={{ mt: 1 }}>
          {userEmail && (
            <>
              <Typography variant="body2" color="text.secondary" gutterBottom>
                Utilisateur à verrouiller :
              </Typography>
              <Typography variant="body1" sx={{ mb: 2, fontWeight: 500 }}>
                {userEmail}
              </Typography>
              <Divider sx={{ mb: 3 }} />
            </>
          )}

          <FormControl fullWidth sx={{ mb: 3 }}>
            <InputLabel>Durée du verrouillage</InputLabel>
            <Select
              value={lockAccount.duration}
              label="Durée du verrouillage"
              onChange={(e) => onUpdateDuration(Number(e.target.value))}
            >
              {durations.map((duration) => (
                <MenuItem key={duration.value} value={duration.value}>
                  {duration.label}
                </MenuItem>
              ))}
            </Select>
          </FormControl>

          <TextField
            fullWidth
            label="Raison du verrouillage"
            multiline
            rows={3}
            value={lockAccount.reason}
            onChange={(e) => onUpdateReason(e.target.value)}
            placeholder="Décrivez la raison du verrouillage du compte..."
            required
          />

          <Box
            sx={{
              mt: 3,
              p: 2,
              backgroundColor: "warning.light",
              borderRadius: 1,
              color: "warning.contrastText",
            }}
          >
            <Typography variant="body2" sx={{ fontWeight: 500 }}>
              ⚠️ Attention
            </Typography>
            <Typography variant="body2">
              L'utilisateur ne pourra pas se connecter pendant la durée
              sélectionnée. Cette action sera enregistrée dans l'audit.
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
          color="warning"
          disabled={!lockAccount.reason.trim()}
        >
          Verrouiller le compte
        </Button>
      </DialogActions>
    </Dialog>
  );
};
