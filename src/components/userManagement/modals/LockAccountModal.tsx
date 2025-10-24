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
import { LABELS } from "../../../constants";

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
          {LABELS.users.modals.lock.title}
        </Box>
      </DialogTitle>

      <DialogContent>
        <Box sx={{ mt: 1 }}>
          {userEmail && (
            <>
              <Typography variant="body2" color="text.secondary" gutterBottom>
                {LABELS.users.modals.lock.userToLock}:
              </Typography>
              <Typography variant="body1" sx={{ mb: 2, fontWeight: 500 }}>
                {userEmail}
              </Typography>
              <Divider sx={{ mb: 3 }} />
            </>
          )}

          <FormControl fullWidth sx={{ mb: 3 }}>
            <InputLabel>{LABELS.users.modals.lock.duration}</InputLabel>
            <Select
              value={lockAccount.duration}
              label={LABELS.users.modals.lock.duration}
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
            label={LABELS.users.modals.lock.reason}
            multiline
            rows={3}
            value={lockAccount.reason}
            onChange={(e) => onUpdateReason(e.target.value)}
            placeholder={LABELS.users.modals.lock.reasonPlaceholder}
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
              ⚠️ {LABELS.users.modals.lock.warningTitle}
            </Typography>
            <Typography variant="body2">
              {LABELS.users.modals.lock.warning}
            </Typography>
          </Box>
        </Box>
      </DialogContent>

      <DialogActions sx={{ px: 3, pb: 2 }}>
        <Button onClick={onClose} color="inherit">
          {LABELS.common.actions.cancel}
        </Button>
        <Button
          onClick={() => {
            console.log("Lock button clicked!", lockAccount);
            onConfirm();
          }}
          variant="contained"
          color="warning"
          disabled={!lockAccount.reason.trim()}
        >
          {LABELS.users.modals.lock.confirmButton}
        </Button>
      </DialogActions>
    </Dialog>
  );
};
