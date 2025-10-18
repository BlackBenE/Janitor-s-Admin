// Types pour la page Auth
import { FilterState } from "../hooks/shared";

// eslint-disable-next-line @typescript-eslint/no-empty-object-type
export interface AuthFilters extends FilterState {
  // Pas de filtres nécessaires pour la page auth
}

// Types pour les vues d'authentification
export type AuthView = "signin" | "signup" | "forgot-password";

// Données de formulaire pour chaque vue
export interface SignInFormData {
  email: string;
  password: string;
}

export interface SignUpFormData {
  email: string;
  password: string;
  confirmPassword: string;
  fullName: string;
  phone: string;
}

export interface ForgotPasswordFormData {
  email: string;
}

// État de l'authentification
export interface AuthState {
  currentView: AuthView;
  isSubmitting: boolean;
  message: AuthMessage | null;
}

// Message d'état pour les notifications
export interface AuthMessage {
  type: "success" | "error";
  text: string;
}

// Configuration des champs de formulaire
export interface AuthFormField {
  name: string;
  label: string;
  type: "email" | "password" | "text" | "tel";
  required: boolean;
  minLength?: number;
}
