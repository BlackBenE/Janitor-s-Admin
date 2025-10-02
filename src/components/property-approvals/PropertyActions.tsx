import React from "react";
import { Box, Button, Tooltip, Typography, Divider } from "@mui/material";
import {
  Check as CheckIcon,
  Close as CloseIcon,
  Delete as DeleteIcon,
} from "@mui/icons-material";

export interface PropertyActionsProps {
  selectedProperties: string[];
  onApproveSelected: () => void;
  onRejectSelected: () => void;
  onClearSelection: () => void;
  isApprovePending?: boolean;
  isRejectPending?: boolean;
}

export const PropertyActions: React.FC<PropertyActionsProps> = ({
  selectedProperties,
  onApproveSelected,
  onRejectSelected,
  onClearSelection,
  isApprovePending = false,
  isRejectPending = false,
}) => {
  const selectedCount = selectedProperties.length;

  if (selectedCount === 0) return null;

  return (
    <Box
      sx={{
        display: "flex",
        alignItems: "center",
        gap: 2,
        p: 2,
        backgroundColor: "action.hover",
        borderRadius: 1,
        mb: 2,
      }}
    >
      <Typography variant="body2" sx={{ fontWeight: 500 }}>
        {selectedCount} propert{selectedCount === 1 ? "y" : "ies"} selected
      </Typography>

      <Divider orientation="vertical" flexItem />

      <Box sx={{ display: "flex", gap: 1 }}>
        <Tooltip
          title={`Approve ${selectedCount} propert${
            selectedCount === 1 ? "y" : "ies"
          }`}
        >
          <Button
            variant="contained"
            color="success"
            size="small"
            startIcon={<CheckIcon />}
            onClick={onApproveSelected}
            disabled={isApprovePending}
          >
            Approve All
          </Button>
        </Tooltip>

        <Tooltip
          title={`Reject ${selectedCount} propert${
            selectedCount === 1 ? "y" : "ies"
          }`}
        >
          <Button
            variant="contained"
            color="error"
            size="small"
            startIcon={<CloseIcon />}
            onClick={onRejectSelected}
            disabled={isRejectPending}
          >
            Reject All
          </Button>
        </Tooltip>

        <Tooltip title="Clear selection">
          <Button
            variant="outlined"
            size="small"
            startIcon={<DeleteIcon />}
            onClick={onClearSelection}
          >
            Clear
          </Button>
        </Tooltip>
      </Box>
    </Box>
  );
};
