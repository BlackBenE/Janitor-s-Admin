import React, { useState } from "react";
import {
  DialogActions,
  Button,
  TextField,
  Box,
  Typography,
} from "@mui/material";
import {
  Check as CheckIcon,
  Close as CloseIcon,
  Schedule as ScheduleIcon,
  Edit as EditIcon,
  Save as SaveIcon,
  Cancel as CancelIcon,
} from "@mui/icons-material";

import { Property } from "../../../types";

interface PropertyModerationActionsProps {
  property: Property;
  onClose: () => void;
  onApprove: (propertyId: string, notes?: string) => Promise<void>;
  onReject: (propertyId: string, notes?: string) => Promise<void>;
  onSetPending: (propertyId: string, notes?: string) => Promise<void>;
  onEditProperty?: () => void;
  onSaveEdit?: (updates: Partial<Property>) => void;
  onCancelEdit?: () => void;
  isEditMode?: boolean;
  isApprovePending?: boolean;
  isRejectPending?: boolean;
  isPendingPending?: boolean;
  isUpdatePending?: boolean;
}

export const PropertyModerationActions: React.FC<
  PropertyModerationActionsProps
> = ({
  property,
  onClose,
  onApprove,
  onReject,
  onSetPending,
  onEditProperty,
  onSaveEdit,
  onCancelEdit,
  isEditMode = false,
  isApprovePending = false,
  isRejectPending = false,
  isPendingPending = false,
  isUpdatePending = false,
}) => {
  const [moderationNotes, setModerationNotes] = useState("");

  const handleApprove = async () => {
    if (property?.id) {
      try {
        await onApprove(property.id, moderationNotes);
        onClose(); // Auto-close modal on success
      } catch (error) {
        // Error will be handled by parent component
        console.error("Error in approve action:", error);
      }
    }
  };

  const handleReject = async () => {
    if (property?.id) {
      try {
        await onReject(property.id, moderationNotes);
        onClose(); // Auto-close modal on success
      } catch (error) {
        // Error will be handled by parent component
        console.error("Error in reject action:", error);
      }
    }
  };

  const handleSetPending = async () => {
    if (property?.id) {
      try {
        await onSetPending(property.id, moderationNotes);
        onClose(); // Auto-close modal on success
      } catch (error) {
        // Error will be handled by parent component
        console.error("Error in set pending action:", error);
      }
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
          disabled={
            isApprovePending ||
            isRejectPending ||
            isPendingPending ||
            isUpdatePending
          }
        >
          Close
        </Button>

        {isEditMode ? (
          /* Edit Mode Actions */
          <Box sx={{ display: "flex", gap: 1 }}>
            <Button
              variant="outlined"
              startIcon={<CancelIcon />}
              onClick={onCancelEdit}
              disabled={isUpdatePending}
            >
              Cancel
            </Button>
            <Button
              type="submit"
              form="property-edit-form"
              variant="contained"
              color="primary"
              startIcon={<SaveIcon />}
              disabled={isUpdatePending}
            >
              {isUpdatePending ? "Saving..." : "Save Changes"}
            </Button>
          </Box>
        ) : (
          /* View Mode Actions */
          <Box sx={{ display: "flex", gap: 1, flexWrap: "wrap" }}>
            {/* Edit button - if edit functionality is available */}
            {onEditProperty && (
              <Button
                variant="outlined"
                startIcon={<EditIcon />}
                onClick={onEditProperty}
                disabled={
                  isApprovePending || isRejectPending || isPendingPending
                }
              >
                Edit Property
              </Button>
            )}

            {/* Moderation actions */}
            <Button
              variant="contained"
              color="error"
              startIcon={<CloseIcon />}
              onClick={handleReject}
              disabled={isRejectPending || isApprovePending || isPendingPending}
            >
              {isRejectPending ? "Rejecting..." : "Reject"}
            </Button>
            <Button
              variant="contained"
              color="warning"
              startIcon={<ScheduleIcon />}
              onClick={handleSetPending}
              disabled={isPendingPending || isApprovePending || isRejectPending}
            >
              {isPendingPending ? "Setting Pending..." : "Set Pending"}
            </Button>
            <Button
              variant="contained"
              color="success"
              startIcon={<CheckIcon />}
              onClick={handleApprove}
              disabled={isApprovePending || isRejectPending || isPendingPending}
            >
              {isApprovePending ? "Approving..." : "Approve"}
            </Button>
          </Box>
        )}
      </DialogActions>
    </>
  );
};
