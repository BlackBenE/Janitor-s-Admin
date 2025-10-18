import React, { useState } from "react";
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  Typography,
  Box,
  TextField,
  Alert,
  Stack,
} from "@mui/material";
import { Warning as WarningIcon } from "@mui/icons-material";

interface DeleteAccountModalProps {
  open: boolean;
  onClose: () => void;
  userEmail: string;
}

export const DeleteAccountModal: React.FC<DeleteAccountModalProps> = ({
  open,
  onClose,
  userEmail,
}) => {
  const [confirmationText, setConfirmationText] = useState("");
  const expectedText = "DELETE";
  const isConfirmed = confirmationText === expectedText;

  const handleSubmit = () => {
    if (isConfirmed) {
      // TODO: Implement account deletion logic
      console.log("Deleting account...");
      onClose();
    }
  };

  const handleClose = () => {
    setConfirmationText("");
    onClose();
  };

  return (
    <Dialog open={open} onClose={handleClose} maxWidth="sm" fullWidth>
      <DialogTitle>
        <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
          <WarningIcon color="error" />
          <Typography variant="h6" color="error">
            Delete Account
          </Typography>
        </Box>
      </DialogTitle>

      <DialogContent>
        <Stack spacing={3} sx={{ mt: 1 }}>
          <Alert severity="error">
            <Typography variant="h6" gutterBottom>
              This action cannot be undone!
            </Typography>
            <Typography variant="body2">
              This will permanently delete your account and all associated data.
              You will not be able to recover your account or any of your data.
            </Typography>
          </Alert>

          <Box>
            <Typography variant="body1" gutterBottom>
              You are about to delete the account: <strong>{userEmail}</strong>
            </Typography>
            <Typography variant="body2" color="text.secondary">
              This will remove all your personal information, settings, and any
              content associated with your account.
            </Typography>
          </Box>

          <Box>
            <Typography variant="body2" gutterBottom>
              Please type <strong>DELETE</strong> to confirm:
            </Typography>
            <TextField
              fullWidth
              value={confirmationText}
              onChange={(e) => setConfirmationText(e.target.value)}
              placeholder="Type DELETE to confirm"
              error={confirmationText.length > 0 && !isConfirmed}
              helperText={
                confirmationText.length > 0 && !isConfirmed
                  ? `Please type "${expectedText}" exactly`
                  : ""
              }
            />
          </Box>
        </Stack>
      </DialogContent>

      <DialogActions>
        <Button onClick={handleClose} variant="outlined">
          Cancel
        </Button>
        <Button
          onClick={handleSubmit}
          variant="contained"
          color="error"
          disabled={!isConfirmed}
        >
          Delete Account
        </Button>
      </DialogActions>
    </Dialog>
  );
};
