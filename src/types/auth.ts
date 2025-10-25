// Types pour la page Auth
import { FilterState } from '@/shared/hooks';

// Type pour les vues d'authentification
export type AuthView = 'signIn' | 'signUp' | 'forgotPassword';

// eslint-disable-next-line @typescript-eslint/no-empty-object-type
export interface AuthFilters extends FilterState {
  // Pas de filtres nécessaires pour la page auth
}

// Données de formulaire de connexion
export interface SignInFormData {
  email: string;
  password: string;
}

// Message d'état pour les notifications
export interface AuthMessage {
  type: 'success' | 'error';
  text: string;
}

// Configuration des champs de formulaire
export interface AuthFormField {
  name: string;
  label: string;
  type: 'email' | 'password' | 'text' | 'tel';
  required: boolean;
  minLength?: number;
}
