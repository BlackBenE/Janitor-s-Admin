import React from "react";
import { AuthTabs } from "../AuthTabs";
import { AuthView } from "../../../types/auth";

interface AuthNavigationSectionProps {
  currentView: AuthView;
  onViewChange: (view: AuthView) => void;
}

/**
 * Section de navigation avec les onglets d'authentification
 */
export const AuthNavigationSection: React.FC<AuthNavigationSectionProps> = ({
  currentView,
  onViewChange,
}) => {
  return <AuthTabs currentView={currentView} onViewChange={onViewChange} />;
};
