import React from 'react';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  TextField,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  FormControlLabel,
  Switch,
  Box,
  Typography,
} from '@mui/material';
import { UserProfile } from '@/types/userManagement';
import { COMMON_LABELS } from '@/shared/constants';
import { USERS_LABELS } from '../constants';

interface CreateUserModalProps {
  open: boolean;
  editForm: Partial<UserProfile>;
  onClose: () => void;
  onCreate: () => void;
  onInputChange: (field: keyof UserProfile, value: string | boolean | null) => void;
}

export const CreateUserModal: React.FC<CreateUserModalProps> = ({
  open,
  editForm,
  onClose,
  onCreate,
  onInputChange,
}) => {
  return (
    <Dialog open={open} onClose={onClose} maxWidth="sm" fullWidth>
      <DialogTitle>{USERS_LABELS.messages.createNewUser}</DialogTitle>
      <DialogContent>
        <Box sx={{ pt: 2, display: 'flex', flexDirection: 'column', gap: 2 }}>
          <TextField
            fullWidth
            label={USERS_LABELS.messages.fullName}
            value={editForm.full_name || ''}
            onChange={(e) => onInputChange('full_name', e.target.value)}
            placeholder={USERS_LABELS.messages.enterFullName}
          />

          <TextField
            fullWidth
            label={COMMON_LABELS.fields.email}
            value={editForm.email || ''}
            onChange={(e) => onInputChange('email', e.target.value)}
            type="email"
            required
            placeholder="user@example.com"
          />

          <TextField
            fullWidth
            label={COMMON_LABELS.fields.phone}
            value={editForm.phone || ''}
            onChange={(e) => onInputChange('phone', e.target.value)}
            placeholder="+1234567890"
          />

          <FormControl fullWidth required>
            <InputLabel>{COMMON_LABELS.fields.role}</InputLabel>
            <Select
              value={editForm.role || ''}
              label={COMMON_LABELS.fields.role}
              onChange={(e) => onInputChange('role', e.target.value)}
            >
              <MenuItem value="traveler">{USERS_LABELS.roles.traveler}</MenuItem>
              <MenuItem value="property_owner">{USERS_LABELS.roles.property_owner}</MenuItem>
              <MenuItem value="service_provider">{USERS_LABELS.roles.service_provider}</MenuItem>
              {/* 🔒 SÉCURITÉ: Création d'admin interdite via l'interface */}
              {/* <MenuItem value="admin">{USERS_LABELS.roles.admin}</MenuItem> */}
            </Select>
          </FormControl>

          <FormControlLabel
            control={
              <Switch
                checked={editForm.profile_validated || false}
                onChange={(e) => onInputChange('profile_validated', e.target.checked)}
              />
            }
            label={USERS_LABELS.messages.profileValidated}
          />

          <FormControlLabel
            control={
              <Switch
                checked={editForm.vip_subscription || false}
                onChange={(e) => onInputChange('vip_subscription', e.target.checked)}
              />
            }
            label={USERS_LABELS.messages.vipSubscription}
          />

          <Box sx={{ mt: 2, p: 2, bgcolor: 'info.50', borderRadius: 1 }}>
            <Typography variant="body2" color="info.main">
              {USERS_LABELS.messages.temporaryPasswordInfo}
            </Typography>
          </Box>
        </Box>
      </DialogContent>
      <DialogActions sx={{ p: 3, justifyContent: 'flex-end' }}>
        <Button onClick={onClose}>{COMMON_LABELS.actions.cancel}</Button>
        <Button onClick={onCreate} variant="contained" disabled={!editForm.email || !editForm.role}>
          {USERS_LABELS.messages.createUser}
        </Button>
      </DialogActions>
    </Dialog>
  );
};
