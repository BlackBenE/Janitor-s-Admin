import { AuthFormField } from '@/types/auth';

/**
 * 🔐 Constantes du domaine Auth
 *
 * Ce fichier centralise toutes les configurations et constantes
 * liées à l'authentification.
 */

/**
 * Configuration des champs du formulaire de connexion
 */
export const SIGNIN_FORM_FIELDS: AuthFormField[] = [
  {
    name: 'email',
    label: 'Email',
    type: 'email',
    required: true,
  },
  {
    name: 'password',
    label: 'Mot de passe',
    type: 'password',
    required: true,
    minLength: 6,
  },
];

/**
 * Messages d'authentification
 */
export const AUTH_MESSAGES = {
  errors: {
    invalidCredentials: 'Email ou mot de passe incorrect',
    sessionExpired: 'Votre session a expiré. Veuillez vous reconnecter.',
    unauthorized: "Vous n'êtes pas autorisé à accéder à cette ressource",
    twoFactorRequired: 'Authentification à deux facteurs requise',
    twoFactorInvalid: 'Code invalide ou expiré',
    networkError: 'Erreur de connexion. Vérifiez votre connexion internet.',
  },
  success: {
    signInSuccess: 'Connexion réussie ! Redirection...',
    twoFactorVerified: 'Code 2FA vérifié avec succès',
  },
  info: {
    checkingSession: 'Vérification de la session...',
    signingIn: 'Connexion en cours...',
    verifying2FA: 'Vérification du code 2FA...',
  },
};

/**
 * Configuration 2FA
 */
export const TWO_FACTOR_CONFIG = {
  codeLength: 6,
  codeRefreshInterval: 30, // secondes
  challengeTimeout: 300, // 5 minutes
};

/**
 * Routes d'authentification
 */
export const AUTH_ROUTES = {
  signin: '/auth',
  dashboard: '/dashboard',
  resetPassword: '/reset-password',
} as const;
