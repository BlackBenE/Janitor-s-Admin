import React from "react";
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
} from "@mui/material";
import {
  Lock as LockIcon,
  Security as SecurityIcon,
  Shield as ShieldIcon,
  Delete as DeleteIcon,
} from "@mui/icons-material";
import { LABELS } from "@/core/config/labels";

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
      <CardHeader
        title={LABELS.profile.security.title}
        avatar={<ShieldIcon color="primary" />}
      />
      <CardContent>
        <List>
          <ListItem>
            <ListItemText
              primary={LABELS.profile.security.password.title}
              secondary={LABELS.profile.security.password.description}
            />
            <ListItemSecondaryAction>
              <Button
                variant="outlined"
                startIcon={<LockIcon />}
                onClick={onChangePassword}
                size="small"
              >
                {LABELS.profile.security.password.changeButton}
              </Button>
            </ListItemSecondaryAction>
          </ListItem>

          <Divider sx={{ my: 2 }} />

          <ListItem>
            <ListItemText
              primary={
                <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                  <Typography variant="body1">
                    {LABELS.profile.security.twoFactor.title}
                  </Typography>
                  <Chip
                    label={
                      twoFactorEnabled
                        ? LABELS.profile.security.twoFactor.enabled
                        : LABELS.profile.security.twoFactor.disabled
                    }
                    color={twoFactorEnabled ? "success" : "warning"}
                    size="small"
                    variant="outlined"
                  />
                </Box>
              }
              secondary={LABELS.profile.security.twoFactor.description}
            />
            <ListItemSecondaryAction>
              <Button
                variant="outlined"
                startIcon={<SecurityIcon />}
                onClick={onToggleTwoFactor}
                size="small"
                color={twoFactorEnabled ? "error" : "primary"}
              >
                {twoFactorEnabled
                  ? LABELS.profile.security.twoFactor.disableButton
                  : LABELS.profile.security.twoFactor.enableButton}
              </Button>
            </ListItemSecondaryAction>
          </ListItem>

          <Divider sx={{ my: 2 }} />

          <ListItem>
            <ListItemText
              primary={LABELS.profile.security.accountSecurity.title}
              secondary={
                <Typography variant="body2" color="text.secondary">
                  {LABELS.profile.security.password.lastChange}:{" "}
                  {LABELS.profile.security.password.never}
                  <br />
                  {LABELS.profile.security.accountSecurity.accountCreated}:{" "}
                  {new Date().toLocaleDateString("fr-FR")}
                </Typography>
              }
            />
          </ListItem>
        </List>

        {/* Danger Zone */}
        <Divider sx={{ my: 3 }} />

        <Box sx={{ mt: 3 }}>
          <Typography variant="h6" color="error" gutterBottom>
            {LABELS.profile.security.dangerZone.title}
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
                  {LABELS.profile.security.dangerZone.deleteAccount}
                </Typography>
                <Typography variant="body2" color="error.contrastText">
                  {LABELS.profile.security.dangerZone.deleteDescription}
                </Typography>
              </Box>
              <Button
                variant="outlined"
                color="error"
                startIcon={<DeleteIcon />}
                onClick={onDeleteAccount}
                size="small"
              >
                {LABELS.profile.security.dangerZone.deleteButton}
              </Button>
            </Box>
          </Box>
        </Box>

        <Box sx={{ mt: 3, p: 2, bgcolor: "info.light", borderRadius: 1 }}>
          <Typography variant="body2" color="info.contrastText">
            {LABELS.profile.security.recommendation}
          </Typography>
        </Box>
      </CardContent>
    </Card>
  );
};
