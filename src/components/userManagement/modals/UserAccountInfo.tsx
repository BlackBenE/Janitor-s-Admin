import React from "react";
import { Card, CardContent, Typography, Box, Chip } from "@mui/material";
import {
  AccountCircle as AccountIcon,
  Security as SecurityIcon,
  Star as VipIcon,
} from "@mui/icons-material";
import { UserProfile } from "../../../types/userManagement";

interface UserAccountInfoProps {
  user: UserProfile;
}

export const UserAccountInfo: React.FC<UserAccountInfoProps> = ({ user }) => {
  const getRoleColor = (role: string) => {
    switch (role) {
      case "admin":
        return "error";
      case "property_owner":
        return "primary";
      case "service_provider":
        return "secondary";
      case "traveler":
        return "info";
      default:
        return "default";
    }
  };

  const getRoleLabel = (role: string) => {
    switch (role) {
      case "admin":
        return "Administrator";
      case "property_owner":
        return "Property Owner";
      case "service_provider":
        return "Service Provider";
      case "traveler":
        return "Traveler";
      default:
        return role;
    }
  };

  return (
    <Card>
      <CardContent>
        <Typography variant="h6" gutterBottom>
          Account Information
        </Typography>

        <Box sx={{ display: "flex", flexDirection: "column", gap: 2 }}>
          <Box>
            <Typography
              variant="caption"
              color="text.secondary"
              display="block"
              gutterBottom
            >
              Role & Permissions
            </Typography>
            <Chip
              icon={<AccountIcon />}
              label={getRoleLabel(user.role)}
              color={getRoleColor(user.role)}
              sx={{ mb: 1 }}
            />
          </Box>

          <Box>
            <Typography
              variant="caption"
              color="text.secondary"
              display="block"
              gutterBottom
            >
              Account Status
            </Typography>
            <Box sx={{ display: "flex", gap: 1, flexWrap: "wrap" }}>
              <Chip
                label={user.account_locked ? "Locked" : "Active"}
                color={user.account_locked ? "error" : "success"}
                size="small"
              />
              <Chip
                label={user.profile_validated ? "Verified" : "Unverified"}
                color={user.profile_validated ? "success" : "warning"}
                size="small"
              />
              {user.vip_subscription && (
                <Chip
                  icon={<VipIcon />}
                  label="VIP Member"
                  color="primary"
                  size="small"
                />
              )}
            </Box>
          </Box>

          <Box>
            <Typography
              variant="caption"
              color="text.secondary"
              display="block"
              gutterBottom
            >
              Security Information
            </Typography>
            <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
              <SecurityIcon color="action" fontSize="small" />
              <Typography variant="body2">
                Last updated:{" "}
                {user.updated_at
                  ? new Date(user.updated_at).toLocaleDateString()
                  : "Unknown"}
              </Typography>
            </Box>
          </Box>
        </Box>
      </CardContent>
    </Card>
  );
};
