import React from "react";
import { AuthFormRenderer } from "../AuthFormRenderer";
import {
  AuthView,
  SignInFormData,
  SignUpFormData,
  ForgotPasswordFormData,
} from "../../../types/auth";

interface AuthFormSectionProps {
  currentView: AuthView;
  isSubmitting: boolean;
  onSignIn: (data: SignInFormData) => Promise<boolean>;
  onSignUp: (data: SignUpFormData) => Promise<boolean>;
  onForgotPassword: (data: ForgotPasswordFormData) => Promise<boolean>;
}

/**
 * Section contenant les formulaires d'authentification
 */
export const AuthFormSection: React.FC<AuthFormSectionProps> = ({
  currentView,
  isSubmitting,
  onSignIn,
  onSignUp,
  onForgotPassword,
}) => {
  return (
    <AuthFormRenderer
      currentView={currentView}
      isSubmitting={isSubmitting}
      onSignIn={onSignIn}
      onSignUp={onSignUp}
      onForgotPassword={onForgotPassword}
    />
  );
};
