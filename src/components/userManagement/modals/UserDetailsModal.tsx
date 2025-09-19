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

interface UserDetailsModalProps {
  open: boolean;
  user: UserProfile | null;
  editForm: Partial<UserProfile>;
  onClose: () => void;
  onSave: () => void;
  onSuspend: () => void;
  onInputChange: (
    field: keyof UserProfile,
    value: string | boolean | null
  ) => void;
}

export const UserDetailsModal: React.FC<UserDetailsModalProps> = ({
  open,
  user,
  editForm,
  onClose,
  onSave,
  onSuspend,
  onInputChange,
}) => {
  if (!user) return null;

  return (
    <Dialog open={open} onClose={onClose} maxWidth="sm" fullWidth>
      <DialogTitle>
        User Details - {user.full_name || "Unnamed User"}
      </DialogTitle>
      <DialogContent>
        <Box sx={{ pt: 2, display: "flex", flexDirection: "column", gap: 2 }}>
          <TextField
            fullWidth
            label="Full Name"
            value={editForm.full_name || ""}
            onChange={(e) => onInputChange("full_name", e.target.value)}
          />

          <TextField
            fullWidth
            label="Email"
            value={editForm.email || ""}
            onChange={(e) => onInputChange("email", e.target.value)}
            type="email"
          />

          <TextField
            fullWidth
            label="Phone"
            value={editForm.phone || ""}
            onChange={(e) => onInputChange("phone", e.target.value)}
          />

          <FormControl fullWidth>
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

          <Box sx={{ mt: 2, p: 2, bgcolor: "grey.50", borderRadius: 1 }}>
            <Typography variant="subtitle2" gutterBottom>
              Account Information
            </Typography>
            <Typography variant="body2" color="text.secondary">
              Created:{" "}
              {user.created_at
                ? new Date(user.created_at).toLocaleDateString()
                : "Unknown"}
            </Typography>
            <Typography variant="body2" color="text.secondary">
              Status: {user.account_locked ? "Locked" : "Active"}
            </Typography>
          </Box>
        </Box>
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose}>Cancel</Button>
        <Button onClick={onSuspend} color="warning">
          Suspend User
        </Button>
        <Button onClick={onSave} variant="contained">
          Save Changes
        </Button>
      </DialogActions>
    </Dialog>
  );
};
