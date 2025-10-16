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
      <Tab label="Connexion" value="signin" />
      <Tab label="Créer Admin" value="signup" />
      <Tab label="Mot de passe" value="forgot-password" />
    </Tabs>
  );
};
