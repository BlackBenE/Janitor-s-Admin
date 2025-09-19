import React from "react";
import {
  AuthView,
  SignInFormData,
  SignUpFormData,
  ForgotPasswordFormData,
} from "../../types/auth";
import {
  signinFields,
  signupFields,
  forgotPasswordFields,
} from "../../hooks/auth/useAuthForms";
import Form, { FormField } from "../Form";

interface AuthFormRendererProps {
  currentView: AuthView;
  isSubmitting: boolean;
  onSignIn: (data: SignInFormData) => Promise<boolean>;
  onSignUp: (data: SignUpFormData) => Promise<boolean>;
  onForgotPassword: (data: ForgotPasswordFormData) => Promise<boolean>;
}

export const AuthFormRenderer: React.FC<AuthFormRendererProps> = ({
  currentView,
  isSubmitting,
  onSignIn,
  onSignUp,
  onForgotPassword,
}) => {
  // Convertir nos types vers les types Form attendus
  const convertFields = (fields: typeof signinFields): FormField[] => {
    return fields.map((field) => ({
      ...field,
      type: field.type === "tel" ? "number" : field.type,
    }));
  };

  // Wrappers pour adapter les types de retour
  const handleSignInSubmit = async (
    data: Record<string, string>
  ): Promise<void> => {
    await onSignIn(data as unknown as SignInFormData);
  };

  const handleSignUpSubmit = async (
    data: Record<string, string>
  ): Promise<void> => {
    await onSignUp(data as unknown as SignUpFormData);
  };

  const handleForgotPasswordSubmit = async (
    data: Record<string, string>
  ): Promise<void> => {
    await onForgotPassword(data as unknown as ForgotPasswordFormData);
  };

  switch (currentView) {
    case "signin":
      return (
        <Form
          title="Admin Sign In"
          fields={convertFields(signinFields)}
          onSubmit={handleSignInSubmit}
          submitButtonText={isSubmitting ? "Signing In..." : "Sign In"}
        />
      );
    case "signup":
      return (
        <Form
          title="Create Admin Account"
          fields={convertFields(signupFields)}
          onSubmit={handleSignUpSubmit}
          submitButtonText={
            isSubmitting ? "Creating Account..." : "Create Account"
          }
        />
      );
    case "forgot-password":
      return (
        <Form
          title="Reset Password"
          fields={convertFields(forgotPasswordFields)}
          onSubmit={handleForgotPasswordSubmit}
          submitButtonText={isSubmitting ? "Sending..." : "Send Reset Email"}
        />
      );
    default:
      return null;
  }
};
