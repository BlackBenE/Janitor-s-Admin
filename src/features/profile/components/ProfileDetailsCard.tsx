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
import { ProfileFormData } from "@/types/profile";
import { LABELS } from "@/core/config/labels";

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
        title={LABELS.common.messages.profileDetails}
        action={
          !isEditMode ? (
            <Button
              variant="outlined"
              startIcon={<EditIcon />}
              onClick={onToggleEdit}
              disabled={isLoading}
            >
              {LABELS.common.messages.editProfile}
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
                {LABELS.common.actions.save}
              </Button>
              <Button
                variant="outlined"
                startIcon={<CancelIcon />}
                onClick={onCancel}
                disabled={isLoading}
              >
                {LABELS.common.actions.cancel}
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
              label={LABELS.common.messages.fullName}
              value={formData.full_name}
              onChange={(e) => onInputChange("full_name", e.target.value)}
              disabled={isLoading}
              required
              error={!formData.full_name.trim()}
              helperText={
                !formData.full_name.trim()
                  ? LABELS.common.messages.fullNameRequired
                  : ""
              }
            />
            <TextField
              fullWidth
              label={LABELS.common.fields.phone}
              value={formData.phone}
              onChange={(e) => onInputChange("phone", e.target.value)}
              disabled={isLoading}
              type="tel"
              placeholder={LABELS.profile.placeholders.phone}
            />
          </Stack>
        ) : (
          <List>
            <ListItem disablePadding>
              <ListItemText
                primary={LABELS.common.messages.fullName}
                secondary={
                  formData.full_name || LABELS.common.messages.notProvided
                }
              />
            </ListItem>

            <Divider sx={{ my: 1 }} />

            <ListItem disablePadding>
              <ListItemText
                primary={LABELS.common.fields.email}
                secondary={userEmail}
              />
            </ListItem>

            <Divider sx={{ my: 1 }} />

            <ListItem disablePadding>
              <ListItemText
                primary={LABELS.common.fields.phone}
                secondary={formData.phone || LABELS.common.messages.notProvided}
              />
            </ListItem>

            <Divider sx={{ my: 1 }} />

            <ListItem disablePadding>
              <ListItemText
                primary={LABELS.common.fields.role}
                secondary={userRole.charAt(0).toUpperCase() + userRole.slice(1)}
              />
            </ListItem>
          </List>
        )}

        {hasChanges && isEditMode && (
          <Box sx={{ mt: 2, p: 2, bgcolor: "warning.light", borderRadius: 1 }}>
            <Typography variant="body2" color="warning.contrastText">
              {LABELS.common.messages.unsavedChanges}
            </Typography>
          </Box>
        )}
      </CardContent>
    </Card>
  );
};
