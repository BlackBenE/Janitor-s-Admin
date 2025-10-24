import React from "react";
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  Box,
  Typography,
  Alert,
} from "@mui/material";
import { LockReset as LockResetIcon } from "@mui/icons-material";

interface PasswordResetModalProps {
  open: boolean;
  userId: string | null;
  userEmail?: string;
  userRole?: string;
  onClose: () => void;
  onConfirm: () => void;
}

export const PasswordResetModal: React.FC<PasswordResetModalProps> = ({
  open,
  userId,
  userEmail,
  userRole,
  onClose,
  onConfirm,
}) => {
  const getDestinationInfo = () => {
    if (userRole?.toLowerCase() === "admin") {
      return "The link will redirect to the admin back-office.";
    } else {
      return "The link will redirect to the client application.";
    }
  };
  return (
    <Dialog open={open} onClose={onClose} maxWidth="sm" fullWidth>
      <DialogTitle sx={{ display: "flex", alignItems: "center", gap: 1 }}>
        <LockResetIcon />
        Reset Password
      </DialogTitle>
      <DialogContent>
        <Box sx={{ pt: 2 }}>
          <Alert severity="warning" sx={{ mb: 2 }}>
            This action will send a password reset email to the user.
          </Alert>

          <Typography variant="body1" sx={{ mb: 2 }}>
            Are you sure you want to send a password reset email to:
          </Typography>

          <Typography
            variant="body2"
            sx={{
              fontWeight: "bold",
              mb: 2,
              p: 2,
              bgcolor: "grey.100",
              borderRadius: 1,
            }}
          >
            {userEmail || `User ID: ${userId}`}
          </Typography>

          <Typography variant="body2" color="text.secondary">
            The user will receive an email with instructions to reset their
            password. This action will be logged in the audit trail.
          </Typography>

          <Alert severity="info" sx={{ mt: 2, mb: 1 }}>
            <strong>Destination:</strong> {getDestinationInfo()}
          </Alert>

          <Typography
            variant="body2"
            color="text.secondary"
            sx={{ mt: 1, fontSize: "0.75rem" }}
          >
            <strong>Note:</strong> If the email doesn't arrive, check:
            <br />• Spam/junk folder
            <br />• Email server configuration
            <br />• User's email verification status
          </Typography>
        </Box>
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose}>Cancel</Button>
        <Button onClick={onConfirm} variant="contained" color="warning">
          Send Reset Email
        </Button>
      </DialogActions>
    </Dialog>
  );
};
