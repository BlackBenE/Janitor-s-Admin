import React from "react";
import { Box, Button, Tooltip } from "@mui/material";
import {
  SupervisorAccount as SupervisorAccountIcon,
  WorkspacePremium as WorkspacePremiumIcon,
  Delete as DeleteIcon,
} from "@mui/icons-material";

interface UserActionsProps {
  selectedUsers: string[];
  onBulkValidate: () => void;
  onBulkSuspend: () => void;
  onBulkAction: (actionType: "delete" | "role" | "vip") => void;
}

export const UserActions: React.FC<UserActionsProps> = ({
  selectedUsers,
  onBulkValidate,
  onBulkSuspend,
  onBulkAction,
}) => {
  if (selectedUsers.length === 0) {
    return null;
  }

  return (
    <Box sx={{ display: "flex", gap: 1, ml: "auto", flexWrap: "wrap" }}>
      <Button
        variant="outlined"
        color="success"
        size="small"
        onClick={onBulkValidate}
      >
        Validate Selected ({selectedUsers.length})
      </Button>

      <Button
        variant="outlined"
        color="error"
        size="small"
        onClick={onBulkSuspend}
      >
        Suspend Selected ({selectedUsers.length})
      </Button>

      <Tooltip title="Changer le rôle des utilisateurs sélectionnés">
        <Button
          variant="outlined"
          color="info"
          size="small"
          startIcon={<SupervisorAccountIcon />}
          onClick={() => onBulkAction("role")}
        >
          Change Role
        </Button>
      </Tooltip>

      <Tooltip title="Basculer le statut VIP des utilisateurs sélectionnés">
        <Button
          variant="outlined"
          color="warning"
          size="small"
          startIcon={<WorkspacePremiumIcon />}
          onClick={() => onBulkAction("vip")}
        >
          Toggle VIP
        </Button>
      </Tooltip>

      <Tooltip title="Supprimer les utilisateurs sélectionnés">
        <Button
          variant="outlined"
          color="error"
          size="small"
          startIcon={<DeleteIcon />}
          onClick={() => onBulkAction("delete")}
        >
          Delete Selected
        </Button>
      </Tooltip>
    </Box>
  );
};
