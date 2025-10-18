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
      <DialogTitle>Create New User</DialogTitle>
      <DialogContent>
        <Box sx={{ pt: 2, display: "flex", flexDirection: "column", gap: 2 }}>
          <TextField
            fullWidth
            label="Full Name"
            value={editForm.full_name || ""}
            onChange={(e) => onInputChange("full_name", e.target.value)}
            placeholder="Enter user's full name"
          />

          <TextField
            fullWidth
            label="Email"
            value={editForm.email || ""}
            onChange={(e) => onInputChange("email", e.target.value)}
            type="email"
            required
            placeholder="user@example.com"
          />

          <TextField
            fullWidth
            label="Phone"
            value={editForm.phone || ""}
            onChange={(e) => onInputChange("phone", e.target.value)}
            placeholder="+1234567890"
          />

          <FormControl fullWidth required>
            <InputLabel>Role</InputLabel>
            <Select
              value={editForm.role || ""}
              label="Role"
              onChange={(e) => onInputChange("role", e.target.value)}
            >
              <MenuItem value="traveler">Traveler</MenuItem>
              <MenuItem value="property_owner">Property Owner</MenuItem>
              <MenuItem value="service_provider">Service Provider</MenuItem>
              <MenuItem value="admin">Admin</MenuItem>
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
            label="Profile Validated"
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
            label="VIP Subscription"
          />

          <Box sx={{ mt: 2, p: 2, bgcolor: "info.50", borderRadius: 1 }}>
            <Typography variant="body2" color="info.main">
              💡 A temporary password will be generated and sent to the
              user&apos;s email address. The user will be prompted to change it
              on first login.
            </Typography>
          </Box>
        </Box>
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose}>Cancel</Button>
        <Button
          onClick={onCreate}
          variant="contained"
          disabled={!editForm.email || !editForm.role}
        >
          Create User
        </Button>
      </DialogActions>
    </Dialog>
  );
};
