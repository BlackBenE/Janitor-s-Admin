import React from "react";
import {
  TextField,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  FormControlLabel,
  Switch,
  Box,
  Card,
  CardContent,
  Typography,
  Button,
} from "@mui/material";
import { UserProfile } from "../../../types/userManagement";

interface UserEditFormProps {
  user: UserProfile;
  editForm: Partial<UserProfile>;
  onInputChange: (
    field: keyof UserProfile,
    value: string | boolean | null
  ) => void;
  isLoading?: boolean;
}

export const UserEditForm: React.FC<UserEditFormProps> = ({
  user,
  editForm,
  onInputChange,
  isLoading = false,
}) => {
  return (
    <Card>
      <CardContent>
        <Typography variant="h6" gutterBottom>
          Edit User Information
        </Typography>

        <Box sx={{ display: "flex", flexDirection: "column", gap: 2 }}>
          <TextField
            fullWidth
            label="Full Name"
            value={editForm.full_name || ""}
            onChange={(e) => onInputChange("full_name", e.target.value)}
            disabled={isLoading}
          />

          <TextField
            fullWidth
            label="Email"
            value={editForm.email || ""}
            onChange={(e) => onInputChange("email", e.target.value)}
            type="email"
            disabled={isLoading}
          />

          <TextField
            fullWidth
            label="Phone"
            value={editForm.phone || ""}
            onChange={(e) => onInputChange("phone", e.target.value)}
            disabled={isLoading}
          />

          <FormControl fullWidth disabled={isLoading}>
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

          <Box sx={{ display: "flex", flexDirection: "column", gap: 1 }}>
            <FormControlLabel
              control={
                <Switch
                  checked={editForm.profile_validated || false}
                  onChange={(e) =>
                    onInputChange("profile_validated", e.target.checked)
                  }
                  disabled={isLoading}
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
                  disabled={isLoading}
                />
              }
              label="VIP Subscription"
            />
          </Box>
        </Box>
      </CardContent>
    </Card>
  );
};
