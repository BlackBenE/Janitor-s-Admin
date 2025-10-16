import React from "react";
import { Box, Button, Divider } from "@mui/material";
import {
  Edit as EditIcon,
  Lock as LockIcon,
  Delete as DeleteIcon,
  Security as SecurityIcon,
} from "@mui/icons-material";
import { UserProfile } from "../../../types/userManagement";

interface UserActionsProps {
  user: UserProfile;
  onClose: () => void;
  onEditUser?: () => void;
  onSuspend?: () => void;
  onDelete?: () => void;
  onSecurityActions?: () => void;
  onSaveEdit?: () => void;
  onCancelEdit?: () => void;
  isEditMode?: boolean;
  isLoading?: boolean;
}

export const UserActions: React.FC<UserActionsProps> = ({
  user,
  onClose,
  onEditUser,
  onSuspend,
  onDelete,
  onSecurityActions,
  onSaveEdit,
  onCancelEdit,
  isEditMode = false,
  isLoading = false,
}) => {
  if (isEditMode) {
    return (
      <Box
        sx={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          p: 2,
          borderTop: 1,
          borderColor: "divider",
          bgcolor: "grey.50",
        }}
      >
        <Box sx={{ display: "flex", gap: 1 }}>
          <Button onClick={onCancelEdit} disabled={isLoading}>
            Cancel
          </Button>
          <Button onClick={onSaveEdit} variant="contained" disabled={isLoading}>
            {isLoading ? "Saving..." : "Save Changes"}
          </Button>
        </Box>
      </Box>
    );
  }

  return (
    <Box
      sx={{
        display: "flex",
        justifyContent: "space-between",
        alignItems: "center",
        p: 2,
        borderTop: 1,
        borderColor: "divider",
        bgcolor: "grey.50",
      }}
    >
      <Button onClick={onClose}>Close</Button>

      <Box sx={{ display: "flex", gap: 1 }}>
        {onSecurityActions && (
          <Button
            startIcon={<SecurityIcon />}
            onClick={onSecurityActions}
            color="primary"
            variant="outlined"
            size="small"
          >
            Security
          </Button>
        )}

        {onEditUser && (
          <Button
            startIcon={<EditIcon />}
            onClick={onEditUser}
            color="primary"
            variant="outlined"
            size="small"
          >
            Edit
          </Button>
        )}

        {onSuspend && (
          <Button
            startIcon={<LockIcon />}
            onClick={onSuspend}
            color="warning"
            variant="outlined"
            size="small"
          >
            {user.account_locked ? "Unlock" : "Lock"}
          </Button>
        )}

        {onDelete && (
          <Button
            startIcon={<DeleteIcon />}
            onClick={onDelete}
            color="error"
            variant="outlined"
            size="small"
          >
            Delete
          </Button>
        )}
      </Box>
    </Box>
  );
};
