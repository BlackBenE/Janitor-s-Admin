import { AuthFormField } from "../../types/auth";

export const signinFields: AuthFormField[] = [
  {
    name: "email",
    label: "Email",
    type: "email",
    required: true,
  },
  {
    name: "password",
    label: "Password",
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
    label: "Password",
    type: "password",
    required: true,
    minLength: 8,
  },
  {
    name: "confirmPassword",
    label: "Confirm Password",
    type: "password",
    required: true,
    minLength: 8,
  },
  {
    name: "fullName",
    label: "Full Name",
    type: "text",
    required: true,
  },
  {
    name: "phone",
    label: "Phone number",
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
