/**
 * 🏷️ Labels du domaine Password Reset
 */

export const PASSWORD_RESET_LABELS = {
  title: 'Réinitialisation du mot de passe',

  form: {
    title: 'Nouveau mot de passe',
    accountLabel: 'Compte :',
    description: 'Choisissez un nouveau mot de passe sécurisé pour votre compte.',
    newPasswordLabel: 'Nouveau mot de passe',
    newPasswordHelper: 'Au moins 6 caractères',
    confirmPasswordLabel: 'Confirmer le mot de passe',
    submitButton: 'Réinitialiser le mot de passe',
    backToLogin: 'Retour à la connexion',
  },

  loading: {
    title: 'Validation du lien...',
    message: 'Vérification de votre lien de réinitialisation en cours...',
  },

  success: {
    title: 'Mot de passe modifié !',
    message: 'Le mot de passe pour {{email}} a été mis à jour avec succès.',
    congratulations: '🎉 Félicitations ! Votre mot de passe a été changé avec succès.',
    securityNotice: 'Pour votre sécurité, vous avez été automatiquement déconnecté.',
    redirecting: {
      admin: 'Redirection vers le portail administrateur...',
      client: "Redirection vers l'application client...",
    },
    redirectMessage: {
      admin: 'Vous serez redirigé vers la page de connexion admin',
      client: "Vous serez redirigé vers l'application client",
    },
  },

  errors: {
    linkExpired: 'Le lien de réinitialisation a expiré. Veuillez demander un nouveau lien.',
    linkInvalid: 'Lien de réinitialisation invalide ou expiré.',
    validationError: 'Erreur lors de la validation du lien de réinitialisation.',
    genericError: 'Erreur : {{description}}',
    tip: {
      title: '💡 Conseil :',
      message:
        "Les liens de réinitialisation expirent rapidement. Demandez un nouveau lien et cliquez dessus immédiatement après l'avoir reçu.",
    },
  },
} as const;

export type PasswordResetLabels = typeof PASSWORD_RESET_LABELS;
