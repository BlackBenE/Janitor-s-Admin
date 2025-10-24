import React from "react";
import { SignUpFormData } from "../../../types/auth";
import { signupFields } from "../hooks/useAuthForms";
import Form, { FormField } from "../../Form";

interface SignUpFormProps {
  isSubmitting: boolean;
  onSubmit: (data: SignUpFormData) => Promise<boolean>;
}

/**
 * Formulaire de création de compte admin
 */
export const SignUpForm: React.FC<SignUpFormProps> = ({
  isSubmitting,
  onSubmit,
}) => {
  // Convertir les champs vers le format Form
  const convertFields = (fields: typeof signupFields): FormField[] => {
    return fields.map((field) => ({
      ...field,
      type: field.type === "tel" ? "number" : field.type,
    }));
  };

  // Wrapper pour adapter les types
  const handleSubmit = async (data: Record<string, string>): Promise<void> => {
    await onSubmit(data as unknown as SignUpFormData);
  };

  return (
    <Form
      title="Créer un compte Admin"
      fields={convertFields(signupFields)}
      onSubmit={handleSubmit}
      submitButtonText={isSubmitting ? "Création..." : "Créer le compte"}
    />
  );
};
