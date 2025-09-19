import React from "react";
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  Button,
  Stack,
  Typography,
  Box,
  Alert,
} from "@mui/material";
import { Lock as LockIcon } from "@mui/icons-material";
import { ChangePasswordData } from "../../../types/profile";

interface ChangePasswordModalProps {
  open: boolean;
  data: ChangePasswordData;
  onClose: () => void;
  onChange: (field: keyof ChangePasswordData, value: string) => void;
  isValid: boolean;
}

export const ChangePasswordModal: React.FC<ChangePasswordModalProps> = ({
  open,
  data,
  onClose,
  onChange,
  isValid,
}) => {
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (isValid) {
      // TODO: Implement password change logic
      console.log("Changing password...", data);
      onClose();
    }
  };

  const passwordsMatch = data.newPassword === data.confirmPassword;
  const isNewPasswordValid = data.newPassword.length >= 8;

  return (
    <Dialog open={open} onClose={onClose} maxWidth="sm" fullWidth>
      <form onSubmit={handleSubmit}>
        <DialogTitle>
          <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
            <LockIcon color="primary" />
            <Typography variant="h6">Change Password</Typography>
          </Box>
        </DialogTitle>

        <DialogContent>
          <Stack spacing={3} sx={{ mt: 1 }}>
            <Alert severity="info">
              Your new password must be at least 8 characters long and contain a
              mix of letters, numbers, and symbols.
            </Alert>

            <TextField
              fullWidth
              label="Current Password"
              type="password"
              value={data.currentPassword}
              onChange={(e) => onChange("currentPassword", e.target.value)}
              required
              autoComplete="current-password"
            />

            <TextField
              fullWidth
              label="New Password"
              type="password"
              value={data.newPassword}
              onChange={(e) => onChange("newPassword", e.target.value)}
              required
              error={data.newPassword.length > 0 && !isNewPasswordValid}
              helperText={
                data.newPassword.length > 0 && !isNewPasswordValid
                  ? "Password must be at least 8 characters long"
                  : ""
              }
              autoComplete="new-password"
            />

            <TextField
              fullWidth
              label="Confirm New Password"
              type="password"
              value={data.confirmPassword}
              onChange={(e) => onChange("confirmPassword", e.target.value)}
              required
              error={data.confirmPassword.length > 0 && !passwordsMatch}
              helperText={
                data.confirmPassword.length > 0 && !passwordsMatch
                  ? "Passwords do not match"
                  : ""
              }
              autoComplete="new-password"
            />
          </Stack>
        </DialogContent>

        <DialogActions>
          <Button onClick={onClose} variant="outlined">
            Cancel
          </Button>
          <Button type="submit" variant="contained" disabled={!isValid}>
            Change Password
          </Button>
        </DialogActions>
      </form>
    </Dialog>
  );
};
