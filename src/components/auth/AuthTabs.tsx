import React from "react";
import { Tabs, Tab } from "@mui/material";
import { AuthView } from "../../types/auth";

interface AuthTabsProps {
  currentView: AuthView;
  onViewChange: (view: AuthView) => void;
}

export const AuthTabs: React.FC<AuthTabsProps> = ({
  currentView,
  onViewChange,
}) => {
  return (
    <Tabs
      value={currentView}
      onChange={(_, newValue) => onViewChange(newValue)}
      centered
      sx={{ marginBottom: 3 }}
    >
      <Tab label="Sign In" value="signin" />
      <Tab label="Create Admin" value="signup" />
      <Tab label="Reset Password" value="forgot-password" />
    </Tabs>
  );
};
