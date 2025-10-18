import React from "react";
import {
  Card,
  CardContent,
  Avatar,
  Typography,
  Button,
  Box,
  Chip,
  Stack,
} from "@mui/material";
import {
  CameraAlt as CameraAltIcon,
  Verified as VerifiedIcon,
  AdminPanelSettings as AdminIcon,
} from "@mui/icons-material";

interface ProfileCardProps {
  avatarInitials: string;
  fullName: string;
  email: string;
  isAdmin: boolean;
  isVerified: boolean;
  onUploadAvatar: () => void;
}

export const ProfileCard: React.FC<ProfileCardProps> = ({
  avatarInitials,
  fullName,
  email,
  isAdmin,
  isVerified,
  onUploadAvatar,
}) => {
  return (
    <Card sx={{ mb: 3 }}>
      <CardContent sx={{ textAlign: "center" }}>
        {/* Avatar avec bouton upload */}
        <Box sx={{ position: "relative", display: "inline-block", mb: 2 }}>
          <Avatar
            sx={{
              width: 120,
              height: 120,
              fontSize: "3rem",
              bgcolor: "primary.main",
            }}
          >
            {avatarInitials}
          </Avatar>
          <Button
            variant="contained"
            size="small"
            sx={{
              position: "absolute",
              bottom: -8,
              right: -8,
              minWidth: "auto",
              width: 40,
              height: 40,
              borderRadius: "50%",
              p: 0,
            }}
            onClick={onUploadAvatar}
          >
            <CameraAltIcon fontSize="small" />
          </Button>
        </Box>

        {/* Nom et email */}
        <Typography variant="h5" component="h2" gutterBottom>
          {fullName || "User Profile"}
        </Typography>
        <Typography variant="body2" color="text.secondary" gutterBottom>
          {email}
        </Typography>

        {/* Badges de statut */}
        <Stack
          direction="row"
          spacing={1}
          justifyContent="center"
          sx={{ mt: 2 }}
        >
          {isAdmin && (
            <Chip
              icon={<AdminIcon />}
              label="Administrator"
              color="error"
              size="small"
              variant="outlined"
            />
          )}
          {isVerified && (
            <Chip
              icon={<VerifiedIcon />}
              label="Verified"
              color="success"
              size="small"
              variant="outlined"
            />
          )}
        </Stack>
      </CardContent>
    </Card>
  );
};
