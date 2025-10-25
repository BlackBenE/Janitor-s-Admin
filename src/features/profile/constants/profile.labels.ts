/**
 * 🏷️ Labels du domaine Profile
 */

export const PROFILE_LABELS = {
  title: 'Mon profil',

  sections: {
    personal: 'Informations personnelles',
    security: 'Sécurité',
    preferences: 'Préférences',
  },

  settings: {
    language: 'Langue',
    theme: 'Thème',
    timezone: 'Fuseau horaire',
  },

  security: {
    title: 'Paramètres de sécurité',
    password: {
      title: 'Mot de passe',
      description: 'Changer le mot de passe de votre compte',
      changeButton: 'Changer le mot de passe',
      lastChange: 'Dernier changement de mot de passe',
      never: 'Jamais',
    },
    twoFactor: {
      title: 'Authentification à deux facteurs',
      description: 'Ajouter une couche de sécurité supplémentaire',
      enabled: 'Activée',
      disabled: 'Désactivée',
      enableButton: 'Activer 2FA',
      disableButton: 'Désactiver 2FA',
    },
    accountSecurity: {
      title: 'Sécurité du compte',
      accountCreated: 'Compte créé le',
    },
    dangerZone: {
      title: 'Zone dangereuse',
      deleteAccount: 'Supprimer le compte',
      deleteDescription:
        'Supprimer définitivement votre compte et toutes les données associées. Cette action ne peut pas être annulée.',
      deleteButton: 'Supprimer le compte',
    },
    recommendation:
      "💡 Nous recommandons d'activer l'authentification à deux facteurs et de mettre à jour votre mot de passe régulièrement.",
    changePassword: 'Changer le mot de passe',
    twoFactorAuth: 'Authentification à deux facteurs',
    sessions: 'Sessions actives',
  },

  placeholders: {
    phone: '+33 6 12 34 56 78',
  },

  messages: {
    profileDetails: 'Détails du profil',
    editProfile: 'Modifier le profil',
    fullName: 'Nom complet',
    fullNameRequired: 'Le nom complet est requis',
    unsavedChanges: 'Vous avez des modifications non sauvegardées',
  },

  deleteAccount: {
    title: 'Supprimer le compte',
    warning: 'Cette action ne peut pas être annulée',
    description:
      'La suppression de votre compte entraînera la perte définitive de toutes vos données.',
    aboutToDelete: 'Vous êtes sur le point de supprimer',
    info: 'Toutes vos données personnelles, réservations et historiques seront définitivement supprimés.',
    reason: 'Raison de la suppression',
    tellUsWhy: 'Dites-nous pourquoi vous partez (optionnel)',
    pleaseType: 'Veuillez taper',
    toConfirm: 'pour confirmer',
    typeDelete: 'Tapez DELETE pour confirmer',
    pleaseTypeExactly: 'Veuillez taper exactement "{{text}}"',
    deleting: 'Suppression en cours...',
  },
} as const;

export type ProfileLabels = typeof PROFILE_LABELS;
