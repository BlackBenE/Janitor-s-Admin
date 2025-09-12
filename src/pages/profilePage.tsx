import React, { useState } from "react";
import {
  Box,
  Card,
  CardContent,
  CardActions,
  Typography,
  Button,
  Avatar,
  Divider,
  Alert,
  Chip,
  Stack,
  TextField,
  Container,
} from "@mui/material";
import Grid from "@mui/material/Grid";
import {
  ArrowBack as ArrowBackIcon,
  AdminPanelSettings as AdminIcon,
  Verified as VerifiedIcon,
  Save as SaveIcon,
  PhotoCamera as PhotoCameraIcon,
} from "@mui/icons-material";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../providers/authProvider";
import { dataProvider } from "../providers/dataProvider";

function ProfilePage() {
  const navigate = useNavigate();
  const {
    user,
    userProfile,
    getUserFullName,
    getEmail,
    getUserPhone,
    getUserRole,
    isAdmin,
    isProfilValidated,
  } = useAuth();

  // State for alerts and form
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [formData, setFormData] = useState({
    full_name: getUserFullName() || "",
    phone: getUserPhone() || "",
  });

  // Generate avatar initials
  const getAvatarInitials = () => {
    const name = getUserFullName();
    if (!name) return "U";
    const names = name.split(" ");
    if (names.length >= 2) {
      return `${names[0][0]}${names[1][0]}`.toUpperCase();
    }
    return name[0].toUpperCase();
  };

  // Handle form field changes
  const handleInputChange =
    (field: string) => (event: React.ChangeEvent<HTMLInputElement>) => {
      setFormData((prev) => ({
        ...prev,
        [field]: event.target.value,
      }));
      // Clear messages when user starts typing
      if (error) setError(null);
      if (success) setSuccess(null);
    };

  // Handle form submission
  const handleSave = async () => {
    if (!user?.id) {
      setError("User not found");
      return;
    }

    try {
      setIsLoading(true);
      setError(null);
      setSuccess(null);

      // Validate required fields
      if (!formData.full_name.trim()) {
        setError("Full name is required");
        return;
      }

      // Update profile in database
      const response = await dataProvider.update("profiles", user.id, {
        full_name: formData.full_name.trim(),
        phone: formData.phone.trim() || null,
        updated_at: new Date().toISOString(),
      });

      if (!response.success) {
        throw new Error(response.error?.message || "Failed to update profile");
      }

      setSuccess("Profile updated successfully!");
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to update profile");
    } finally {
      setIsLoading(false);
    }
  };

  const handleReturnToDashboard = () => {
    navigate("/dashboard");
  };

  if (!user) {
    return (
      <Box
        display="flex"
        justifyContent="center"
        alignItems="center"
        minHeight="400px"
      >
        <Typography>Loading...</Typography>
      </Box>
    );
  }

  return (
    <Container maxWidth="lg">
      <Box sx={{ py: 4 }}>
        {/* Header */}
        <Box sx={{ mb: 4 }}>
          <Button
            startIcon={<ArrowBackIcon />}
            onClick={handleReturnToDashboard}
            sx={{ mb: 2 }}
          >
            Back to Dashboard
          </Button>
          <Typography variant="h4" gutterBottom>
            Account
          </Typography>
          <Typography variant="body1" color="text.secondary">
            Manage your account settings and preferences
          </Typography>
        </Box>

        {/* Success/Error Messages */}
        {success && (
          <Alert
            severity="success"
            sx={{ mb: 3 }}
            onClose={() => setSuccess(null)}
          >
            {success}
          </Alert>
        )}
        {error && (
          <Alert severity="error" sx={{ mb: 3 }} onClose={() => setError(null)}>
            {error}
          </Alert>
        )}

        {/* Two Column Layout */}
        <Grid container spacing={3}>
          {/* Left Column - Profile Card */}
          <Grid size={{ xs: 12, md: 4 }}>
            <Card>
              <CardContent>
                <Box
                  sx={{
                    display: "flex",
                    flexDirection: "column",
                    alignItems: "center",
                  }}
                >
                  <Avatar
                    sx={{
                      width: 120,
                      height: 120,
                      bgcolor: "primary.main",
                      fontSize: "3rem",
                      mb: 2,
                    }}
                  >
                    {getAvatarInitials()}
                  </Avatar>

                  <Typography variant="h5" gutterBottom align="center">
                    {getUserFullName() || "No name set"}
                  </Typography>

                  <Typography
                    variant="body2"
                    color="text.secondary"
                    align="center"
                    sx={{ mb: 2 }}
                  >
                    {getEmail()}
                  </Typography>

                  <Stack direction="row" spacing={1} sx={{ mb: 3 }}>
                    {isAdmin() && (
                      <Chip
                        icon={<AdminIcon />}
                        label="Admin"
                        color="primary"
                        size="small"
                      />
                    )}
                    {isProfilValidated() ? (
                      <Chip
                        icon={<VerifiedIcon />}
                        label="Verified"
                        color="success"
                        size="small"
                      />
                    ) : (
                      <Chip label="Pending" color="warning" size="small" />
                    )}
                  </Stack>

                  <Button
                    variant="outlined"
                    startIcon={<PhotoCameraIcon />}
                    fullWidth
                    disabled
                  >
                    Upload Picture
                  </Button>
                </Box>
              </CardContent>
            </Card>

            {/* Account Information Card */}
            <Card sx={{ mt: 3 }}>
              <CardContent>
                <Typography variant="h6" gutterBottom>
                  Account Information
                </Typography>
                <Divider sx={{ mb: 2 }} />

                <Box sx={{ display: "flex", flexDirection: "column", gap: 2 }}>
                  <Box>
                    <Typography variant="body2" color="text.secondary">
                      User ID
                    </Typography>
                    <Typography variant="body1">
                      {user.id.slice(0, 8)}...
                    </Typography>
                  </Box>

                  <Box>
                    <Typography variant="body2" color="text.secondary">
                      Account Created
                    </Typography>
                    <Typography variant="body1">
                      {new Date(user.created_at).toLocaleDateString()}
                    </Typography>
                  </Box>

                  {userProfile?.updated_at && (
                    <Box>
                      <Typography variant="body2" color="text.secondary">
                        Last Updated
                      </Typography>
                      <Typography variant="body1">
                        {new Date(userProfile.updated_at).toLocaleDateString()}
                      </Typography>
                    </Box>
                  )}

                  <Box>
                    <Typography variant="body2" color="text.secondary">
                      Role
                    </Typography>
                    <Typography variant="body1">
                      {getUserRole() || "No role assigned"}
                    </Typography>
                  </Box>
                </Box>
              </CardContent>
            </Card>
          </Grid>

          {/* Right Column - Profile Details */}
          <Grid size={{ xs: 12, md: 8 }}>
            <Card>
              <CardContent>
                <Typography variant="h6" gutterBottom>
                  Profile Details
                </Typography>
                <Typography
                  variant="body2"
                  color="text.secondary"
                  sx={{ mb: 3 }}
                >
                  Update your personal information
                </Typography>

                <Grid container spacing={3}>
                  <Grid size={{ xs: 12, sm: 6 }}>
                    <TextField
                      fullWidth
                      label="Full Name"
                      value={formData.full_name}
                      onChange={handleInputChange("full_name")}
                      required
                      error={!formData.full_name.trim() && error !== null}
                      helperText={
                        !formData.full_name.trim() && error !== null
                          ? "Full name is required"
                          : ""
                      }
                      disabled={isLoading}
                    />
                  </Grid>

                  <Grid size={{ xs: 12, sm: 6 }}>
                    <TextField
                      fullWidth
                      label="Email Address"
                      value={getEmail()}
                      disabled
                      helperText="Email cannot be changed"
                    />
                  </Grid>

                  <Grid size={{ xs: 12, sm: 6 }}>
                    <TextField
                      fullWidth
                      label="Phone Number"
                      value={formData.phone}
                      onChange={handleInputChange("phone")}
                      type="tel"
                      disabled={isLoading}
                    />
                  </Grid>

                  <Grid size={{ xs: 12, sm: 6 }}>
                    <TextField
                      fullWidth
                      label="Role"
                      value={getUserRole() || "No role assigned"}
                      disabled
                      helperText="Role is managed by administrators"
                    />
                  </Grid>
                </Grid>
              </CardContent>

              <CardActions sx={{ justifyContent: "flex-end", p: 2 }}>
                <Button
                  variant="contained"
                  startIcon={<SaveIcon />}
                  onClick={handleSave}
                  disabled={isLoading}
                >
                  Save Changes
                </Button>
              </CardActions>
            </Card>

            {/* Security Settings Card */}
            <Card sx={{ mt: 3 }}>
              <CardContent>
                <Typography variant="h6" gutterBottom>
                  Security Settings
                </Typography>
                <Typography
                  variant="body2"
                  color="text.secondary"
                  sx={{ mb: 3 }}
                >
                  Manage your account security and authentication
                </Typography>

                <Stack spacing={2}>
                  <Box
                    sx={{
                      display: "flex",
                      justifyContent: "space-between",
                      alignItems: "center",
                    }}
                  >
                    <Box>
                      <Typography variant="body1">Password</Typography>
                      <Typography variant="body2" color="text.secondary">
                        Last updated: Never
                      </Typography>
                    </Box>
                    <Button variant="outlined" disabled>
                      Change Password
                    </Button>
                  </Box>

                  <Divider />

                  <Box
                    sx={{
                      display: "flex",
                      justifyContent: "space-between",
                      alignItems: "center",
                    }}
                  >
                    <Box>
                      <Typography variant="body1">
                        Two-Factor Authentication
                      </Typography>
                      <Typography variant="body2" color="text.secondary">
                        Add an extra layer of security to your account
                      </Typography>
                    </Box>
                    <Button variant="outlined" disabled>
                      Enable 2FA
                    </Button>
                  </Box>
                </Stack>
              </CardContent>
            </Card>
          </Grid>
        </Grid>
      </Box>
    </Container>
  );
}

export default ProfilePage;
