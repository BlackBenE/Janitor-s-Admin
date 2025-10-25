import React from 'react';
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
} from '@mui/material';
import { LockAccountState } from '@/types/userManagement';
import { USERS_LABELS } from '@/features/users/constants';
import { COMMON_LABELS } from '@/shared/constants';

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
    { value: 60, label: '1 heure' },
    { value: 360, label: '6 heures' },
    { value: 720, label: '12 heures' },
    { value: 1440, label: '24 heures' },
    { value: 4320, label: '3 jours' },
    { value: 10080, label: '7 jours' },
    { value: 43200, label: '30 jours' },
  ];

  return (
    <Dialog open={open} onClose={onClose} maxWidth="sm" fullWidth>
      <DialogTitle>
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
          {USERS_LABELS.modals.lock.title}
        </Box>
      </DialogTitle>

      <DialogContent>
        <Box sx={{ mt: 1 }}>
          {userEmail && (
            <>
              <Typography variant="body2" color="text.secondary" gutterBottom>
                {USERS_LABELS.modals.lock.userToLock}:
              </Typography>
              <Typography variant="body1" sx={{ mb: 2, fontWeight: 500 }}>
                {userEmail}
              </Typography>
              <Divider sx={{ mb: 3 }} />
            </>
          )}

          <FormControl fullWidth sx={{ mb: 3 }}>
            <InputLabel>{USERS_LABELS.modals.lock.duration}</InputLabel>
            <Select
              value={lockAccount.duration}
              label={USERS_LABELS.modals.lock.duration}
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
            label={USERS_LABELS.modals.lock.reason}
            multiline
            rows={3}
            value={lockAccount.reason}
            onChange={(e) => onUpdateReason(e.target.value)}
            placeholder={USERS_LABELS.modals.lock.reasonPlaceholder}
            required
          />

          <Box
            sx={{
              mt: 3,
              p: 2,
              backgroundColor: 'warning.light',
              borderRadius: 1,
              color: 'warning.contrastText',
            }}
          >
            <Typography variant="body2" sx={{ fontWeight: 500 }}>
              ⚠️ {USERS_LABELS.modals.lock.warningTitle}
            </Typography>
            <Typography variant="body2">{USERS_LABELS.modals.lock.warning}</Typography>
          </Box>
        </Box>
      </DialogContent>

      <DialogActions sx={{ p: 3, justifyContent: 'flex-end' }}>
        <Button onClick={onClose} color="inherit">
          {COMMON_LABELS.actions.cancel}
        </Button>
        <Button
          onClick={() => {
            onConfirm();
          }}
          variant="contained"
          color="warning"
          disabled={!lockAccount.reason.trim()}
        >
          {USERS_LABELS.modals.lock.confirmButton}
        </Button>
      </DialogActions>
    </Dialog>
  );
};
