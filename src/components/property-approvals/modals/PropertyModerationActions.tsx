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
import { LABELS } from "../../../constants/labels";

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
          {LABELS.propertyApprovals.moderation.title}
        </Typography>
        <TextField
          fullWidth
          multiline
          rows={3}
          variant="outlined"
          placeholder={LABELS.propertyApprovals.moderation.placeholder}
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
          {LABELS.propertyApprovals.moderation.actions.close}
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
              {LABELS.propertyApprovals.moderation.actions.cancel}
            </Button>
            <Button
              type="submit"
              form="property-edit-form"
              variant="contained"
              color="primary"
              startIcon={<SaveIcon />}
              disabled={isUpdatePending}
            >
              {isUpdatePending
                ? LABELS.propertyApprovals.moderation.actions.saving
                : LABELS.propertyApprovals.moderation.actions.saveChanges}
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
                {LABELS.propertyApprovals.moderation.actions.editProperty}
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
              {isRejectPending
                ? LABELS.propertyApprovals.moderation.actions.rejecting
                : LABELS.propertyApprovals.moderation.actions.reject}
            </Button>
            <Button
              variant="contained"
              color="warning"
              startIcon={<ScheduleIcon />}
              onClick={handleSetPending}
              disabled={isPendingPending || isApprovePending || isRejectPending}
            >
              {isPendingPending
                ? LABELS.propertyApprovals.moderation.actions.settingPending
                : LABELS.propertyApprovals.moderation.actions.setPending}
            </Button>
            <Button
              variant="contained"
              color="success"
              startIcon={<CheckIcon />}
              onClick={handleApprove}
              disabled={isApprovePending || isRejectPending || isPendingPending}
            >
              {isApprovePending
                ? LABELS.propertyApprovals.moderation.actions.approving
                : LABELS.propertyApprovals.moderation.actions.approve}
            </Button>
          </Box>
        )}
      </DialogActions>
    </>
  );
};
