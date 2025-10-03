import React, { useState } from "react";
import {
  DialogActions,
  Button,
  TextField,
  Box,
  Typography,
} from "@mui/material";
import { Check as CheckIcon, Close as CloseIcon } from "@mui/icons-material";

interface PropertyModerationActionsProps {
  property: any;
  onClose: () => void;
  onApprove: (propertyId: string, notes?: string) => void;
  onReject: (propertyId: string, notes?: string) => void;
  isApprovePending?: boolean;
  isRejectPending?: boolean;
}

export const PropertyModerationActions: React.FC<
  PropertyModerationActionsProps
> = ({
  property,
  onClose,
  onApprove,
  onReject,
  isApprovePending = false,
  isRejectPending = false,
}) => {
  const [moderationNotes, setModerationNotes] = useState("");

  const handleApprove = () => {
    if (property?.id) {
      onApprove(property.id, moderationNotes);
    }
  };

  const handleReject = () => {
    if (property?.id) {
      onReject(property.id, moderationNotes);
    }
  };

  return (
    <>
      {/* Moderation Notes - Toujours visible */}
      <Box sx={{ p: 3, borderTop: 1, borderColor: "divider" }}>
        <Typography variant="h6" gutterBottom>
          Moderation Notes
        </Typography>
        <TextField
          fullWidth
          multiline
          rows={3}
          variant="outlined"
          placeholder="Add notes for your decision (optional)..."
          value={moderationNotes}
          onChange={(e) => setModerationNotes(e.target.value)}
        />
      </Box>

      <DialogActions sx={{ p: 3 }}>
        <Button
          onClick={onClose}
          disabled={isApprovePending || isRejectPending}
        >
          Close
        </Button>

        {/* Boutons toujours disponibles pour permettre de changer le statut */}
        <Box sx={{ display: "flex", gap: 1 }}>
          <Button
            variant="contained"
            color="error"
            startIcon={<CloseIcon />}
            onClick={handleReject}
            disabled={isRejectPending || isApprovePending}
          >
            {isRejectPending ? "Rejecting..." : "Reject"}
          </Button>
          <Button
            variant="contained"
            color="success"
            startIcon={<CheckIcon />}
            onClick={handleApprove}
            disabled={isApprovePending || isRejectPending}
          >
            {isApprovePending ? "Approving..." : "Approve"}
          </Button>
        </Box>
      </DialogActions>
    </>
  );
};
