import React from "react";
import { AuthNavigation } from "../AuthNavigation";
import { AuthView } from "../../../types/auth";

interface AuthBackNavigationSectionProps {
  currentView: AuthView;
  onBackToSignIn: () => void;
}

/**
 * Section de navigation de retour vers la connexion
 */
export const AuthBackNavigationSection: React.FC<
  AuthBackNavigationSectionProps
> = ({ currentView, onBackToSignIn }) => {
  return (
    <AuthNavigation currentView={currentView} onBackToSignIn={onBackToSignIn} />
  );
};
