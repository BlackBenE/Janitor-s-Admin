import React from "react";
import {
  AuthView,
  SignInFormData,
  SignUpFormData,
  ForgotPasswordFormData,
} from "../../types/auth";
import { SignInForm } from "./components/SignInForm";
import { SignUpForm } from "./components/SignUpForm";
import { ForgotPasswordForm } from "./components/ForgotPasswordForm";

interface AuthFormRendererProps {
  currentView: AuthView;
  isSubmitting: boolean;
  onSignIn: (data: SignInFormData) => Promise<boolean>;
  onSignUp: (data: SignUpFormData) => Promise<boolean>;
  onForgotPassword: (data: ForgotPasswordFormData) => Promise<boolean>;
}

/**
 * Renderer des formulaires d'authentification - Version modulaire
 * Respecte le pattern des autres domaines avec des composants spécialisés
 */
export const AuthFormRenderer: React.FC<AuthFormRendererProps> = ({
  currentView,
  isSubmitting,
  onSignIn,
  onSignUp,
  onForgotPassword,
}) => {
  switch (currentView) {
    case "signin":
      return <SignInForm isSubmitting={isSubmitting} onSubmit={onSignIn} />;
    case "signup":
      return <SignUpForm isSubmitting={isSubmitting} onSubmit={onSignUp} />;
    case "forgot-password":
      return (
        <ForgotPasswordForm
          isSubmitting={isSubmitting}
          onSubmit={onForgotPassword}
        />
      );
    default:
      return null;
  }
};
