import React from "react";
import {
  Card,
  CardContent,
  CardHeader,
  Typography,
  TextField,
  Button,
  Box,
  CircularProgress,
  Stack,
  Divider,
  List,
  ListItem,
  ListItemText,
} from "@mui/material";
import {
  Edit as EditIcon,
  Save as SaveIcon,
  Cancel as CancelIcon,
} from "@mui/icons-material";
import { ProfileFormData } from "../../types/profile";

interface ProfileDetailsCardProps {
  formData: ProfileFormData;
  isLoading: boolean;
  isEditMode: boolean;
  onInputChange: (field: keyof ProfileFormData, value: string) => void;
  onSave: () => Promise<boolean>;
  onToggleEdit: () => void;
  onCancel: () => void;
  hasChanges: boolean;
  isFormValid: boolean;
  userEmail: string;
  userRole: string;
}

export const ProfileDetailsCard: React.FC<ProfileDetailsCardProps> = ({
  formData,
  isLoading,
  isEditMode,
  onInputChange,
  onSave,
  onToggleEdit,
  onCancel,
  hasChanges,
  isFormValid,
  userEmail,
  userRole,
}) => {
  const handleSave = async () => {
    await onSave();
  };

  return (
    <Card sx={{ mb: 3 }}>
      <CardHeader
        title="Profile Details"
        action={
          !isEditMode ? (
            <Button
              variant="outlined"
              startIcon={<EditIcon />}
              onClick={onToggleEdit}
              disabled={isLoading}
            >
              Edit Profile
            </Button>
          ) : (
            <Stack direction="row" spacing={1}>
              <Button
                variant="contained"
                startIcon={
                  isLoading ? <CircularProgress size={16} /> : <SaveIcon />
                }
                onClick={handleSave}
                disabled={isLoading || !isFormValid || !hasChanges}
              >
                Save
              </Button>
              <Button
                variant="outlined"
                startIcon={<CancelIcon />}
                onClick={onCancel}
                disabled={isLoading}
              >
                Cancel
              </Button>
            </Stack>
          )
        }
      />
      <CardContent>
        {isEditMode ? (
          <Stack spacing={3}>
            <TextField
              fullWidth
              label="Full Name"
              value={formData.full_name}
              onChange={(e) => onInputChange("full_name", e.target.value)}
              disabled={isLoading}
              required
              error={!formData.full_name.trim()}
              helperText={
                !formData.full_name.trim() ? "Full name is required" : ""
              }
            />
            <TextField
              fullWidth
              label="Phone"
              value={formData.phone}
              onChange={(e) => onInputChange("phone", e.target.value)}
              disabled={isLoading}
              type="tel"
              placeholder="+1 (555) 123-4567"
            />
          </Stack>
        ) : (
          <List>
            <ListItem disablePadding>
              <ListItemText
                primary="Full Name"
                secondary={formData.full_name || "Not provided"}
              />
            </ListItem>

            <Divider sx={{ my: 1 }} />

            <ListItem disablePadding>
              <ListItemText primary="Email" secondary={userEmail} />
            </ListItem>

            <Divider sx={{ my: 1 }} />

            <ListItem disablePadding>
              <ListItemText
                primary="Phone"
                secondary={formData.phone || "Not provided"}
              />
            </ListItem>

            <Divider sx={{ my: 1 }} />

            <ListItem disablePadding>
              <ListItemText
                primary="Role"
                secondary={userRole.charAt(0).toUpperCase() + userRole.slice(1)}
              />
            </ListItem>
          </List>
        )}

        {hasChanges && isEditMode && (
          <Box sx={{ mt: 2, p: 2, bgcolor: "warning.light", borderRadius: 1 }}>
            <Typography variant="body2" color="warning.contrastText">
              You have unsaved changes. Don&apos;t forget to save your profile.
            </Typography>
          </Box>
        )}
      </CardContent>
    </Card>
  );
};
