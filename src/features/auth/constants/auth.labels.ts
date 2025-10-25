/**
 * 🔐 Labels du domaine Auth
 *
 * Labels et textes pour l'authentification et la gestion de session.
 *
 * @example
 * import { AUTH_LABELS } from '@/features/auth/constants';
 * <Typography>{AUTH_LABELS.login.title}</Typography>
 */

export const AUTH_LABELS = {
  title: 'Authentification',

  login: {
    title: 'Connexion',
    email: 'Adresse email',
    password: 'Mot de passe',
    forgotPassword: 'Mot de passe oublié ?',
    submit: 'Se connecter',
    success: 'Connexion réussie',
    error: 'Identifiants incorrects',
  },

  register: {
    title: 'Inscription',
    confirmPassword: 'Confirmer le mot de passe',
    submit: "S'inscrire",
    success: 'Inscription réussie',
  },

  resetPassword: {
    title: 'Réinitialiser le mot de passe',
    submit: 'Envoyer le lien',
    success: 'Email de réinitialisation envoyé',
  },

  twoFactor: {
    title: "Activer l'authentification à deux facteurs",
    steps: {
      setup: 'Configuration',
      verify: 'Vérification',
      complete: 'Terminé',
    },
    cancel: 'Annuler',
    back: 'Retour',
    next: 'Suivant',
    complete: 'Terminer',
  },
} as const;

export type AuthLabels = typeof AUTH_LABELS;
