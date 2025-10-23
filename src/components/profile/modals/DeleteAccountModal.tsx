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
  CircularProgress,
} from "@mui/material";
import {
  Warning as WarningIcon,
  Delete as DeleteIcon,
} from "@mui/icons-material";
import { ProfileService } from "../../../services/profileService";
import { useUINotifications } from "../../../hooks/shared";
import { useAuth } from "../../../providers/authProvider";
import { useNavigate } from "react-router-dom";

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
  const [isDeleting, setIsDeleting] = useState(false);
  const [deleteReason, setDeleteReason] = useState("");

  const expectedText = "DELETE";
  const isConfirmed = confirmationText === expectedText;

  const { user } = useAuth();
  const { showSuccess, showError } = useUINotifications();
  const navigate = useNavigate();

  const handleSubmit = async () => {
    if (!isConfirmed || !user?.id || isDeleting) return;

    setIsDeleting(true);
    try {
      const result = await ProfileService.deleteAccount(
        user.id,
        deleteReason || "User requested account deletion"
      );

      if (result.success) {
        showSuccess(
          "Account deleted successfully. You will be redirected to the login page."
        );
        // Rediriger vers la page de connexion après 2 secondes
        setTimeout(() => {
          navigate("/auth/login");
        }, 2000);
      } else {
        showError(result.error || "Failed to delete account");
      }
    } catch (error) {
      console.error("Delete account error:", error);
      showError("An unexpected error occurred");
    } finally {
      setIsDeleting(false);
    }
  };

  const handleClose = () => {
    if (!isDeleting) {
      setConfirmationText("");
      setDeleteReason("");
      onClose();
    }
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
              Reason for deletion (optional):
            </Typography>
            <TextField
              fullWidth
              multiline
              rows={2}
              value={deleteReason}
              onChange={(e) => setDeleteReason(e.target.value)}
              placeholder="Tell us why you're leaving (optional)"
              disabled={isDeleting}
            />
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
              disabled={isDeleting}
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
        <Button onClick={handleClose} variant="outlined" disabled={isDeleting}>
          Cancel
        </Button>
        <Button
          onClick={handleSubmit}
          variant="contained"
          color="error"
          disabled={!isConfirmed || isDeleting}
          startIcon={
            isDeleting ? <CircularProgress size={16} /> : <DeleteIcon />
          }
        >
          {isDeleting ? "Deleting..." : "Delete Account"}
        </Button>
      </DialogActions>
    </Dialog>
  );
};
