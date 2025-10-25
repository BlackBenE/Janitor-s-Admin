import React from 'react';
import { SignInFormData } from '@/types/auth';
import { Form, FormField } from '@/shared/components/forms';
import { SIGNIN_FORM_FIELDS } from '../constants';

interface SignInFormProps {
  isSubmitting: boolean;
  onSubmit: (data: SignInFormData) => Promise<boolean>;
}

/**
 * Formulaire de connexion admin
 */
export const SignInForm: React.FC<SignInFormProps> = ({ isSubmitting, onSubmit }) => {
  // Convertir les champs vers le format Form
  const convertFields = (fields: typeof SIGNIN_FORM_FIELDS): FormField[] => {
    return fields.map((field) => ({
      ...field,
      type: field.type === 'tel' ? 'number' : field.type,
    }));
  };

  // Wrapper pour adapter les types
  const handleSubmit = async (data: Record<string, string>): Promise<void> => {
    await onSubmit(data as unknown as SignInFormData);
  };

  return (
    <Form
      title="Connexion Admin"
      fields={convertFields(SIGNIN_FORM_FIELDS)}
      onSubmit={handleSubmit}
      submitButtonText={isSubmitting ? 'Connexion...' : 'Se connecter'}
    />
  );
};
