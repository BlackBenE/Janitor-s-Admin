import { AuthFormField } from "../../../types/auth";

export const signinFields: AuthFormField[] = [
  {
    name: "email",
    label: "Email",
    type: "email",
    required: true,
  },
  {
    name: "password",
    label: "Mot de passe",
    type: "password",
    required: true,
    minLength: 6,
  },
];

export const signupFields: AuthFormField[] = [
  {
    name: "email",
    label: "Email",
    type: "email",
    required: true,
  },
  {
    name: "password",
    label: "Mot de passe",
    type: "password",
    required: true,
    minLength: 8,
  },
  {
    name: "confirmPassword",
    label: "Confirmer le mot de passe",
    type: "password",
    required: true,
    minLength: 8,
  },
  {
    name: "fullName",
    label: "Nom complet",
    type: "text",
    required: true,
  },
  {
    name: "phone",
    label: "Numéro de téléphone",
    type: "tel",
    required: true,
  },
];

export const forgotPasswordFields: AuthFormField[] = [
  {
    name: "email",
    label: "Email",
    type: "email",
    required: true,
  },
];
