import React from "react";
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  TextField,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  FormControlLabel,
  Switch,
  Box,
  Typography,
} from "@mui/material";
import { UserProfile } from "../../../types/userManagement";
import { LABELS } from "../../../constants/labels";

interface CreateUserModalProps {
  open: boolean;
  editForm: Partial<UserProfile>;
  onClose: () => void;
  onCreate: () => void;
  onInputChange: (
    field: keyof UserProfile,
    value: string | boolean | null
  ) => void;
}

export const CreateUserModal: React.FC<CreateUserModalProps> = ({
  open,
  editForm,
  onClose,
  onCreate,
  onInputChange,
}) => {
  return (
    <Dialog open={open} onClose={onClose} maxWidth="sm" fullWidth>
      <DialogTitle>{LABELS.common.messages.createNewUser}</DialogTitle>
      <DialogContent>
        <Box sx={{ pt: 2, display: "flex", flexDirection: "column", gap: 2 }}>
          <TextField
            fullWidth
            label={LABELS.common.messages.fullName}
            value={editForm.full_name || ""}
            onChange={(e) => onInputChange("full_name", e.target.value)}
            placeholder={LABELS.common.messages.enterFullName}
          />

          <TextField
            fullWidth
            label={LABELS.common.fields.email}
            value={editForm.email || ""}
            onChange={(e) => onInputChange("email", e.target.value)}
            type="email"
            required
            placeholder="user@example.com"
          />

          <TextField
            fullWidth
            label={LABELS.common.fields.phone}
            value={editForm.phone || ""}
            onChange={(e) => onInputChange("phone", e.target.value)}
            placeholder="+1234567890"
          />

          <FormControl fullWidth required>
            <InputLabel>{LABELS.common.fields.role}</InputLabel>
            <Select
              value={editForm.role || ""}
              label={LABELS.common.fields.role}
              onChange={(e) => onInputChange("role", e.target.value)}
            >
              <MenuItem value="traveler">
                {LABELS.users.roles.traveler}
              </MenuItem>
              <MenuItem value="property_owner">
                {LABELS.users.roles.property_owner}
              </MenuItem>
              <MenuItem value="service_provider">
                {LABELS.users.roles.service_provider}
              </MenuItem>
              <MenuItem value="admin">{LABELS.users.roles.admin}</MenuItem>
            </Select>
          </FormControl>

          <FormControlLabel
            control={
              <Switch
                checked={editForm.profile_validated || false}
                onChange={(e) =>
                  onInputChange("profile_validated", e.target.checked)
                }
              />
            }
            label={LABELS.common.messages.profileValidated}
          />

          <FormControlLabel
            control={
              <Switch
                checked={editForm.vip_subscription || false}
                onChange={(e) =>
                  onInputChange("vip_subscription", e.target.checked)
                }
              />
            }
            label={LABELS.common.messages.vipSubscription}
          />

          <Box sx={{ mt: 2, p: 2, bgcolor: "info.50", borderRadius: 1 }}>
            <Typography variant="body2" color="info.main">
              {LABELS.common.messages.temporaryPasswordInfo}
            </Typography>
          </Box>
        </Box>
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose}>{LABELS.common.actions.cancel}</Button>
        <Button
          onClick={onCreate}
          variant="contained"
          disabled={!editForm.email || !editForm.role}
        >
          {LABELS.common.messages.createUser}
        </Button>
      </DialogActions>
    </Dialog>
  );
};
