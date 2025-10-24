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
import { useAuth } from "@/core/providers/auth.provider";
import { useNavigate } from "react-router-dom";
import { LABELS } from "../../../constants/labels";

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
            {LABELS.common.messages.deleteAccount}
          </Typography>
        </Box>
      </DialogTitle>

      <DialogContent>
        <Stack spacing={3} sx={{ mt: 1 }}>
          <Alert severity="error">
            <Typography variant="h6" gutterBottom>
              {LABELS.common.messages.thisActionCannotBeUndone}
            </Typography>
            <Typography variant="body2">
              {LABELS.common.messages.deleteAccountWarning}
            </Typography>
          </Alert>

          <Box>
            <Typography variant="body1" gutterBottom>
              {LABELS.common.messages.youAreAboutToDelete}:{" "}
              <strong>{userEmail}</strong>
            </Typography>
            <Typography variant="body2" color="text.secondary">
              {LABELS.common.messages.deleteAccountInfo}
            </Typography>
          </Box>

          <Box>
            <Typography variant="body2" gutterBottom>
              {LABELS.common.messages.reasonForDeletion}:
            </Typography>
            <TextField
              fullWidth
              multiline
              rows={2}
              value={deleteReason}
              onChange={(e) => setDeleteReason(e.target.value)}
              placeholder={LABELS.common.messages.tellUsWhyLeaving}
              disabled={isDeleting}
            />
          </Box>

          <Box>
            <Typography variant="body2" gutterBottom>
              {LABELS.common.messages.pleaseType} <strong>DELETE</strong>{" "}
              {LABELS.common.messages.toConfirm}:
            </Typography>
            <TextField
              fullWidth
              value={confirmationText}
              onChange={(e) => setConfirmationText(e.target.value)}
              placeholder={LABELS.common.messages.typeDeleteToConfirm}
              disabled={isDeleting}
              error={confirmationText.length > 0 && !isConfirmed}
              helperText={
                confirmationText.length > 0 && !isConfirmed
                  ? LABELS.common.messages.pleaseTypeExactly.replace(
                      "{{text}}",
                      expectedText
                    )
                  : ""
              }
            />
          </Box>
        </Stack>
      </DialogContent>

      <DialogActions>
        <Button onClick={handleClose} variant="outlined" disabled={isDeleting}>
          {LABELS.common.actions.cancel}
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
          {isDeleting
            ? LABELS.common.messages.deleting
            : LABELS.common.messages.deleteAccount}
        </Button>
      </DialogActions>
    </Dialog>
  );
};
