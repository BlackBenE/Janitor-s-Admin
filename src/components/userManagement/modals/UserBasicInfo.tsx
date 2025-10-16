import React from "react";
import { Card, CardContent, Typography, Box } from "@mui/material";
import {
  Email as EmailIcon,
  Phone as PhoneIcon,
  Person as PersonIcon,
  CalendarToday as CalendarIcon,
} from "@mui/icons-material";
import { UserProfile } from "../../../types/userManagement";

interface UserBasicInfoProps {
  user: UserProfile;
}

export const UserBasicInfo: React.FC<UserBasicInfoProps> = ({ user }) => {
  const InfoItem: React.FC<{
    icon: React.ReactNode;
    label: string;
    value: string | null | undefined;
  }> = ({ icon, label, value }) => (
    <Box sx={{ display: "flex", alignItems: "center", gap: 1, mb: 2 }}>
      {icon}
      <Box>
        <Typography variant="caption" color="text.secondary" display="block">
          {label}
        </Typography>
        <Typography variant="body2">{value || "Not provided"}</Typography>
      </Box>
    </Box>
  );

  return (
    <Card>
      <CardContent>
        <Typography variant="h6" gutterBottom>
          Basic Information
        </Typography>

        <Box sx={{ display: "flex", flexDirection: "column", gap: 1 }}>
          <InfoItem
            icon={<PersonIcon color="action" />}
            label="Full Name"
            value={user.full_name}
          />
          <InfoItem
            icon={<EmailIcon color="action" />}
            label="Email Address"
            value={user.email}
          />
          <InfoItem
            icon={<PhoneIcon color="action" />}
            label="Phone Number"
            value={user.phone}
          />
          <InfoItem
            icon={<CalendarIcon color="action" />}
            label="Member Since"
            value={
              user.created_at
                ? new Date(user.created_at).toLocaleDateString()
                : null
            }
          />
        </Box>
      </CardContent>
    </Card>
  );
};
