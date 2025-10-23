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
        title="Security Settings"
        avatar={<ShieldIcon color="primary" />}
      />
      <CardContent>
        <List>
          <ListItem>
            <ListItemText
              primary="Password"
              secondary="Change your account password"
            />
            <ListItemSecondaryAction>
              <Button
                variant="outlined"
                startIcon={<LockIcon />}
                onClick={onChangePassword}
                size="small"
              >
                Change Password
              </Button>
            </ListItemSecondaryAction>
          </ListItem>

          <Divider sx={{ my: 2 }} />

          <ListItem>
            <ListItemText
              primary={
                <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                  <Typography variant="body1">
                    Two-Factor Authentication
                  </Typography>
                  <Chip
                    label={twoFactorEnabled ? "Enabled" : "Disabled"}
                    color={twoFactorEnabled ? "success" : "warning"}
                    size="small"
                    variant="outlined"
                  />
                </Box>
              }
              secondary="Add an extra layer of security to your account"
            />
            <ListItemSecondaryAction>
              <Button
                variant="outlined"
                startIcon={<SecurityIcon />}
                onClick={onToggleTwoFactor}
                size="small"
                color={twoFactorEnabled ? "error" : "primary"}
              >
                {twoFactorEnabled ? "Disable" : "Enable"} 2FA
              </Button>
            </ListItemSecondaryAction>
          </ListItem>

          <Divider sx={{ my: 2 }} />

          <ListItem>
            <ListItemText
              primary="Account Security"
              secondary={
                <Typography variant="body2" color="text.secondary">
                  Last password change: Never
                  <br />
                  Account created: {new Date().toLocaleDateString()}
                </Typography>
              }
            />
          </ListItem>
        </List>

        {/* Danger Zone */}
        <Divider sx={{ my: 3 }} />

        <Box sx={{ mt: 3 }}>
          <Typography variant="h6" color="error" gutterBottom>
            Danger Zone
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
                  Delete Account
                </Typography>
                <Typography variant="body2" color="error.contrastText">
                  Permanently delete your account and all associated data. This
                  action cannot be undone.
                </Typography>
              </Box>
              <Button
                variant="outlined"
                color="error"
                startIcon={<DeleteIcon />}
                onClick={onDeleteAccount}
                size="small"
              >
                Delete Account
              </Button>
            </Box>
          </Box>
        </Box>

        <Box sx={{ mt: 3, p: 2, bgcolor: "info.light", borderRadius: 1 }}>
          <Typography variant="body2" color="info.contrastText">
            💡 We recommend enabling two-factor authentication and updating your
            password regularly.
          </Typography>
        </Box>
      </CardContent>
    </Card>
  );
};
