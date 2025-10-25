/**
 * 🌍 Labels communs partagés dans toute l'application
 *
 * Ces labels sont utilisés dans plusieurs domaines et composants partagés.
 *
 * @example
 * import { COMMON_LABELS } from '@/shared/constants';
 * <Button>{COMMON_LABELS.actions.save}</Button>
 */

export const COMMON_LABELS = {
  actions: {
    save: 'Enregistrer',
    cancel: 'Annuler',
    delete: 'Supprimer',
    edit: 'Modifier',
    view: 'Voir',
    search: 'Rechercher',
    filter: 'Filtrer',
    export: 'Exporter',
    import: 'Importer',
    create: 'Créer',
    update: 'Mettre à jour',
    close: 'Fermer',
    back: 'Retour',
    next: 'Suivant',
    previous: 'Précédent',
    confirm: 'Confirmer',
    submit: 'Soumettre',
    reset: 'Réinitialiser',
    refresh: 'Actualiser',
    open: 'Ouvrir',
    select: 'Sélectionner',
  },

  status: {
    active: 'Actif',
    inactive: 'Inactif',
    pending: 'En attente',
    completed: 'Terminé',
    cancelled: 'Annulé',
    rejected: 'Rejeté',
    approved: 'Approuvé',
    locked: 'Verrouillé',
    deleted: 'Supprimé',
    archived: 'Archivé',
  },

  fields: {
    email: 'Email',
    phone: 'Téléphone',
    name: 'Nom',
    firstName: 'Prénom',
    lastName: 'Nom de famille',
    fullName: 'Nom complet',
    date: 'Date',
    amount: 'Montant',
    description: 'Description',
    address: 'Adresse',
    city: 'Ville',
    country: 'Pays',
    postalCode: 'Code postal',
    role: 'Rôle',
    status: 'Statut',
  },

  messages: {
    noData: 'Aucune donnée disponible',
    loading: 'Chargement...',
    error: 'Une erreur est survenue',
    success: 'Opération réussie',
    confirmDelete: 'Êtes-vous sûr de vouloir supprimer ?',
    saved: 'Enregistré avec succès',
    deleted: 'Supprimé avec succès',
    updated: 'Mis à jour avec succès',
    noResults: 'Aucun résultat trouvé',
    unknown: 'Inconnu',
    unknownError: 'Erreur inconnue',
    viewDetails: 'Voir les détails',
    moreActions: "Plus d'actions",
    notProvided: 'Non renseigné',
    validated: 'Validé',
    notValidated: 'Non validé',
    available: 'Disponible',
    unavailable: 'Indisponible',
    submitted: 'Soumis',
    noAddress: 'Aucune adresse',
  },

  validation: {
    required: '{{field}} est requis',
    invalid: '{{field}} invalide',
    minLength: 'Minimum {{min}} caractères',
    maxLength: 'Maximum {{max}} caractères',
    minCharsRequired: 'Minimum {{min}} caractères requis',
    maxCharsAllowed: 'Maximum {{max}} caractères autorisés',
    email: 'Adresse email invalide',
    emailInvalid: 'Veuillez entrer une adresse email valide',
    phone: 'Numéro de téléphone invalide',
    password: {
      minLength: 'Le mot de passe doit contenir au moins 8 caractères',
      match: 'Les mots de passe ne correspondent pas',
      weak: 'Mot de passe trop faible',
    },
  },

  table: {
    toolbar: {
      columns: 'Colonnes',
      filters: 'Filtres',
    },
    actions: 'Actions',
    noData: 'Aucune donnée disponible',
  },

  searchBar: {
    placeholder: 'Rechercher...',
    ariaLabel: 'rechercher',
    noResults: 'Aucun résultat',
  },

  modal: {
    close: 'Fermer',
    ariaLabel: 'fermer',
  },

  forms: {
    submissionError: 'Erreur lors de la soumission du formulaire',
    resetAfterSuccess: 'Formulaire réinitialisé après succès',
  },

  profileMenu: {
    adminUser: 'Utilisateur Admin',
    adminEmail: 'admin@example.com',
    adminRole: 'admin',
    roleLabel: 'Rôle',
    profile: 'Profil',
    signOut: 'Se déconnecter',
    signingOut: 'Déconnexion...',
    logoutError: 'Erreur de déconnexion',
    logoutFailed: 'Échec de la déconnexion',
    userMenu: 'Menu utilisateur',
  },

  navigation: {
    adminDashboard: 'Tableau de bord Admin',
    dashboard: 'Tableau de bord',
    userManagement: 'Gestion Utilisateurs',
    payments: 'Paiements',
    analytics: 'Analytique',
    services: 'Services',
    propertyApprovals: 'Approbations Propriétés',
    quoteRequests: 'Demandes Devis',
    servicesCatalog: 'Catalogue Services',
    financialOverview: 'Vue Financière',
  },

  activities: {
    status: {
      pending: 'En attente',
      reviewRequired: 'Révision requise',
      completed: 'Terminé',
    },
  },
} as const;

/**
 * Helper pour interpoler des variables dans les messages
 * @example formatMessage(COMMON_LABELS.validation.required, { field: 'Email' })
 */
export const formatMessage = (template: string, vars: Record<string, string | number>): string => {
  return template.replace(/\{\{(\w+)\}\}/g, (_, key) => String(vars[key] || ''));
};

export type CommonLabels = typeof COMMON_LABELS;
