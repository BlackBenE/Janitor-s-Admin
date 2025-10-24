import React from "react";
import { ForgotPasswordFormData } from "@/types/auth";
import { forgotPasswordFields } from "../hooks/useAuthForms";
import { Form, FormField } from "@/shared/components/forms";

interface ForgotPasswordFormProps {
  isSubmitting: boolean;
  onSubmit: (data: ForgotPasswordFormData) => Promise<boolean>;
}

/**
 * Formulaire de réinitialisation de mot de passe
 */
export const ForgotPasswordForm: React.FC<ForgotPasswordFormProps> = ({
  isSubmitting,
  onSubmit,
}) => {
  // Convertir les champs vers le format Form
  const convertFields = (fields: typeof forgotPasswordFields): FormField[] => {
    return fields.map((field) => ({
      ...field,
      type: field.type === "tel" ? "number" : field.type,
    }));
  };

  // Wrapper pour adapter les types
  const handleSubmit = async (data: Record<string, string>): Promise<void> => {
    await onSubmit(data as unknown as ForgotPasswordFormData);
  };

  return (
    <Form
      title="Réinitialiser le mot de passe"
      fields={convertFields(forgotPasswordFields)}
      onSubmit={handleSubmit}
      submitButtonText={
        isSubmitting ? "Envoi..." : "Envoyer l'email de réinitialisation"
      }
    />
  );
};
