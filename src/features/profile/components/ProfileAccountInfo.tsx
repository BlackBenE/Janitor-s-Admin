import React from "react";
import {
  Card,
  CardContent,
  Typography,
  Box,
  List,
  ListItem,
  ListItemText,
  Divider,
  Chip,
} from "@mui/material";
import { ProfileStats } from "@/types/profile";
import { formatDate } from "@/shared/utils";

interface ProfileAccountInfoProps {
  userId: string;
  stats: ProfileStats;
  role: string;
}

export const ProfileAccountInfo: React.FC<ProfileAccountInfoProps> = ({
  userId,
  stats,
  role,
}) => {
  const getRoleColor = (role: string): "error" | "primary" | "default" => {
    switch (role) {
      case "admin":
        return "error";
      case "user":
        return "primary";
      default:
        return "default";
    }
  };

  return (
    <Card>
      <CardContent>
        <Typography variant="h6" component="h3" gutterBottom>
          Account Information
        </Typography>

        <List dense>
          <ListItem disablePadding>
            <ListItemText
              primary="User ID"
              secondary={
                <Typography
                  variant="body2"
                  sx={{
                    fontFamily: "monospace",
                    fontSize: "0.8rem",
                    wordBreak: "break-all",
                  }}
                >
                  {userId}
                </Typography>
              }
            />
          </ListItem>

          <Divider sx={{ my: 1 }} />

          <ListItem disablePadding>
            <ListItemText
              primary="Role"
              secondary={
                <Chip
                  label={role.charAt(0).toUpperCase() + role.slice(1)}
                  color={getRoleColor(role)}
                  size="small"
                  variant="outlined"
                />
              }
            />
          </ListItem>

          <Divider sx={{ my: 1 }} />

          <ListItem disablePadding>
            <ListItemText
              primary="Created"
              secondary={formatDate(stats.createdAt)}
            />
          </ListItem>

          <ListItem disablePadding>
            <ListItemText
              primary="Last Updated"
              secondary={formatDate(stats.updatedAt)}
            />
          </ListItem>

          <ListItem disablePadding>
            <ListItemText
              primary="Last Login"
              secondary={formatDate(stats.lastSignInAt)}
            />
          </ListItem>

          <Divider sx={{ my: 1 }} />

          <ListItem disablePadding>
            <ListItemText
              primary="Profile Status"
              secondary={
                <Box sx={{ display: "flex", gap: 1, mt: 0.5 }}>
                  <Chip
                    label={
                      stats.emailConfirmed
                        ? "Email Verified"
                        : "Email Unverified"
                    }
                    color={stats.emailConfirmed ? "success" : "warning"}
                    size="small"
                    variant="outlined"
                  />
                  <Chip
                    label={
                      stats.profileValidated
                        ? "Profile Validated"
                        : "Profile Pending"
                    }
                    color={stats.profileValidated ? "success" : "warning"}
                    size="small"
                    variant="outlined"
                  />
                </Box>
              }
            />
          </ListItem>
        </List>
      </CardContent>
    </Card>
  );
};
