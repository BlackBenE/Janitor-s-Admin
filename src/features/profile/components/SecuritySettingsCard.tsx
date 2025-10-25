import React from 'react';
import {
  Card,
  CardContent,
  CardHeader,
  Button,
  List,
  ListItem,
  ListItemText,
  ListItemSecondaryAction,
  Divider,
  Chip,
  Box,
  Typography,
} from '@mui/material';
import {
  Lock as LockIcon,
  Security as SecurityIcon,
  Shield as ShieldIcon,
  Delete as DeleteIcon,
} from '@mui/icons-material';
import { PROFILE_LABELS } from '../constants';

interface SecuritySettingsCardProps {
  onChangePassword: () => void;
  onToggleTwoFactor: () => void;
  onDeleteAccount: () => void;
  twoFactorEnabled: boolean;
}

export const SecuritySettingsCard: React.FC<SecuritySettingsCardProps> = ({
  onChangePassword,
  onToggleTwoFactor,
  onDeleteAccount,
  twoFactorEnabled,
}) => {
  return (
    <Card>
      <CardHeader title={PROFILE_LABELS.security.title} avatar={<ShieldIcon color="primary" />} />
      <CardContent>
        <List>
          <ListItem>
            <ListItemText
              primary={PROFILE_LABELS.security.password.title}
              secondary={PROFILE_LABELS.security.password.description}
            />
            <ListItemSecondaryAction>
              <Button
                variant="outlined"
                startIcon={<LockIcon />}
                onClick={onChangePassword}
                size="small"
              >
                {PROFILE_LABELS.security.password.changeButton}
              </Button>
            </ListItemSecondaryAction>
          </ListItem>

          <Divider sx={{ my: 2 }} />

          <ListItem>
            <ListItemText
              primary={
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                  <Typography variant="body1">{PROFILE_LABELS.security.twoFactor.title}</Typography>
                  <Chip
                    label={
                      twoFactorEnabled
                        ? PROFILE_LABELS.security.twoFactor.enabled
                        : PROFILE_LABELS.security.twoFactor.disabled
                    }
                    color={twoFactorEnabled ? 'success' : 'warning'}
                    size="small"
                    variant="outlined"
                  />
                </Box>
              }
              secondary={PROFILE_LABELS.security.twoFactor.description}
            />
            <ListItemSecondaryAction>
              <Button
                variant="outlined"
                startIcon={<SecurityIcon />}
                onClick={onToggleTwoFactor}
                size="small"
                color={twoFactorEnabled ? 'error' : 'primary'}
              >
                {twoFactorEnabled
                  ? PROFILE_LABELS.security.twoFactor.disableButton
                  : PROFILE_LABELS.security.twoFactor.enableButton}
              </Button>
            </ListItemSecondaryAction>
          </ListItem>

          <Divider sx={{ my: 2 }} />

          <ListItem>
            <ListItemText
              primary={PROFILE_LABELS.security.accountSecurity.title}
              secondary={
                <Typography variant="body2" color="text.secondary">
                  {PROFILE_LABELS.security.password.lastChange}:{' '}
                  {PROFILE_LABELS.security.password.never}
                  <br />
                  {PROFILE_LABELS.security.accountSecurity.accountCreated}:{' '}
                  {new Date().toLocaleDateString('fr-FR')}
                </Typography>
              }
            />
          </ListItem>
        </List>

        {/* Danger Zone - Caché */}
        {/* <Divider sx={{ my: 3 }} />

        <Box sx={{ mt: 3 }}>
          <Typography variant="h6" color="error" gutterBottom>
            {PROFILE_LABELS.security.dangerZone.title}
          </Typography>
          <Box
            sx={{
              p: 2,
              border: "1px solid",
              borderColor: "error.main",
              borderRadius: 1,
              bgcolor: "error.light",
            }}
          >
            <Box
              sx={{
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
              }}
            >
              <Box>
                <Typography
                  variant="body1"
                  color="error.contrastText"
                  fontWeight="bold"
                >
                  {PROFILE_LABELS.security.dangerZone.deleteAccount}
                </Typography>
                <Typography variant="body2" color="error.contrastText">
                  {PROFILE_LABELS.security.dangerZone.deleteDescription}
                </Typography>
              </Box>
              <Button
                variant="outlined"
                color="error"
                startIcon={<DeleteIcon />}
                onClick={onDeleteAccount}
                size="small"
              >
                {PROFILE_LABELS.security.dangerZone.deleteButton}
              </Button>
            </Box>
          </Box>
        </Box> */}

        <Box sx={{ mt: 3, p: 2, bgcolor: 'info.light', borderRadius: 1 }}>
          <Typography variant="body2" color="info.contrastText">
            {PROFILE_LABELS.security.recommendation}
          </Typography>
        </Box>
      </CardContent>
    </Card>
  );
};
