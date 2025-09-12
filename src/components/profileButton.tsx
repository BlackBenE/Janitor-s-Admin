import React from "react";
import { FC, useState } from "react";
import {
  Box,
  Avatar,
  Typography,
  IconButton,
  Menu,
  MenuItem,
  ListItemIcon,
  ListItemText,
  Divider,
  Chip,
} from "@mui/material";
import {
  MoreVert as MoreVertIcon,
  Person as PersonIcon,
  Settings as SettingsIcon,
  Logout as LogoutIcon,
  AdminPanelSettings as AdminIcon,
} from "@mui/icons-material";
import { useNavigate } from "react-router-dom";
import { SxProps, Theme } from "@mui/material/styles";
import { useAuth } from "../providers/authProvider";

interface ProfileButtonProps {
  className?: string;
  sx?: SxProps<Theme>;
  compact?: boolean;
}

const ProfileButton: FC<ProfileButtonProps> = ({
  className,
  sx,
  compact = false,
}) => {
  const navigate = useNavigate();
  const { getUserFullName, getEmail, getUserRole, signOut, isAdmin } =
    useAuth();
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const [isLoggingOut, setIsLoggingOut] = useState(false);

  // Get user data from auth context
  const userName = getUserFullName() || "Admin User";
  const userEmail = getEmail() || "admin@example.com";
  const userRole = getUserRole() || "admin";

  // Generate avatar initials
  const getInitials = (name: string) => {
    return name
      .split(" ")
      .map((n) => n[0])
      .join("")
      .toUpperCase()
      .slice(0, 2);
  };

  const handleMenuOpen = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorEl(event.currentTarget);
  };

  const handleMenuClose = () => {
    setAnchorEl(null);
  };

  const handleProfileClick = () => {
    handleMenuClose();
    navigate("/profile");
  };

  const handleSettingsClick = () => {
    handleMenuClose();
    navigate("/settings");
  };

  const handleLogout = async () => {
    setIsLoggingOut(true);
    handleMenuClose();

    try {
      const { error } = await signOut();
      if (error) {
        console.error("Logout error:", error);
        // Still navigate to auth even if there's an error
      }
      navigate("/auth", { replace: true });
    } catch (err) {
      console.error("Logout failed:", err);
      navigate("/auth", { replace: true });
    } finally {
      setIsLoggingOut(false);
    }
  };

  return (
    <Box
      sx={{
        display: "flex",
        alignItems: "center",
        p: compact ? 0.5 : 1,
        borderRadius: 2,
        transition: "background-color 0.2s",
        width: "100%",
        maxWidth: compact ? 200 : "none",
        "&:hover": {
          backgroundColor: "action.hover",
        },
        ...sx,
      }}
      className={className}
    >
      {/* User Avatar */}
      <Avatar
        sx={{
          width: compact ? 36 : 44,
          height: compact ? 36 : 44,
          bgcolor: "primary.main",
          fontSize: compact ? "0.875rem" : "1rem",
          fontWeight: 600,
        }}
      >
        {getInitials(userName)}
      </Avatar>

      {/* User Info - Conditional rendering based on compact mode */}
      {!compact ? (
        <Box sx={{ ml: 1.5, flexGrow: 1, minWidth: 0 }}>
          <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
            <Typography
              variant="body2"
              sx={{
                fontWeight: 600,
                color: "text.primary",
                overflow: "hidden",
                textOverflow: "ellipsis",
                whiteSpace: "nowrap",
              }}
            >
              {userName}
            </Typography>
            {isAdmin() && (
              <Chip
                icon={<AdminIcon />}
                label="Admin"
                size="small"
                color="primary"
                sx={{ height: 20, fontSize: "0.7rem" }}
              />
            )}
          </Box>
          <Typography
            variant="caption"
            sx={{
              color: "text.secondary",
              overflow: "hidden",
              textOverflow: "ellipsis",
              whiteSpace: "nowrap",
              display: "block",
            }}
          >
            {userEmail}
          </Typography>
        </Box>
      ) : (
        // Compact mode - show only name on hover via tooltip
        <Box sx={{ ml: 1, flexGrow: 1, minWidth: 0 }}>
          <Typography
            variant="body2"
            sx={{
              fontWeight: 600,
              color: "text.primary",
              overflow: "hidden",
              textOverflow: "ellipsis",
              whiteSpace: "nowrap",
              fontSize: "0.8rem",
            }}
          >
            {userName.split(" ")[0]} {/* Show only first name */}
          </Typography>
          {isAdmin() && (
            <Typography
              variant="caption"
              sx={{
                color: "primary.main",
                fontSize: "0.7rem",
                fontWeight: 500,
              }}
            >
              Admin
            </Typography>
          )}
        </Box>
      )}

      {/* Menu Button */}
      <IconButton
        onClick={handleMenuOpen}
        size="small"
        sx={{
          ml: compact ? 0.5 : 1,
          color: "text.secondary",
          width: compact ? 28 : 32,
          height: compact ? 28 : 32,
          "&:hover": {
            color: "primary.main",
          },
        }}
        aria-label="User menu"
        disabled={isLoggingOut}
      >
        <MoreVertIcon fontSize={compact ? "small" : "medium"} />
      </IconButton>

      {/* Dropdown Menu */}
      <Menu
        anchorEl={anchorEl}
        open={Boolean(anchorEl)}
        onClose={handleMenuClose}
        PaperProps={{
          sx: {
            mt: 1,
            minWidth: 200,
            boxShadow: 3,
          },
        }}
        transformOrigin={{ horizontal: "right", vertical: "top" }}
        anchorOrigin={{ horizontal: "right", vertical: "bottom" }}
      >
        {/* User Info Header */}
        <Box sx={{ px: 2, py: 1.5, borderBottom: 1, borderColor: "divider" }}>
          <Typography variant="subtitle2" sx={{ fontWeight: 600 }}>
            {userName}
          </Typography>
          <Typography variant="body2" color="text.secondary">
            {userEmail}
          </Typography>
          <Typography variant="caption" color="text.secondary">
            Role: {userRole}
          </Typography>
        </Box>

        <Divider />

        {/* Menu Items */}
        <MenuItem onClick={handleProfileClick}>
          <ListItemIcon>
            <PersonIcon fontSize="small" />
          </ListItemIcon>
          <ListItemText>Profile</ListItemText>
        </MenuItem>

        <MenuItem onClick={handleSettingsClick}>
          <ListItemIcon>
            <SettingsIcon fontSize="small" />
          </ListItemIcon>
          <ListItemText>Settings</ListItemText>
        </MenuItem>

        <Divider />

        <MenuItem
          onClick={handleLogout}
          disabled={isLoggingOut}
          sx={{
            color: "error.main",
            "&:hover": {
              backgroundColor: "error.light",
              color: "error.contrastText",
            },
          }}
        >
          <ListItemIcon>
            <LogoutIcon fontSize="small" sx={{ color: "inherit" }} />
          </ListItemIcon>
          <ListItemText>
            {isLoggingOut ? "Signing out..." : "Sign Out"}
          </ListItemText>
        </MenuItem>
      </Menu>
    </Box>
  );
};

export default ProfileButton;
