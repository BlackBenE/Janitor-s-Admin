/**
 * 🏷️ Labels du domaine Users
 *
 * Labels et textes pour la gestion des utilisateurs.
 *
 * @example
 * import { USERS_LABELS } from '@/features/users/constants';
 * <Typography>{USERS_LABELS.title}</Typography>
 */

export const USERS_LABELS = {
  title: 'Gestion des utilisateurs',
  unnamedUser: 'Utilisateur sans nom',

  table: {
    headers: {
      name: 'Nom',
      email: 'Email',
      phone: 'Téléphone',
      role: 'Rôle',
      status: 'Statut',
      activity: 'Activité',
      actions: 'Actions',
      createdAt: 'Créé le',
      lastConnection: 'Dernière connexion',
      subscription: 'Abonnement',
      spending: 'Dépenses',
    },
  },

  roles: {
    admin: 'Administrateur',
    property_owner: 'Propriétaire',
    service_provider: 'Prestataire',
    traveler: 'Voyageur',
  },

  tabs: {
    all: 'Tous les utilisateurs',
    travelers: 'Voyageurs',
    propertyOwners: 'Propriétaires',
    serviceProviders: 'Prestataires',
    admins: 'Administrateurs',
    deleted: 'Utilisateurs supprimés',
    allDescription: "Vue d'ensemble de tous les utilisateurs",
    travelersDescription: 'Gestion des comptes voyageurs et leurs réservations',
    propertyOwnersDescription: 'Gestion des propriétaires et leurs abonnements (100€/an)',
    serviceProvidersDescription: 'Modération des prestataires de services et vérifications',
    adminsDescription: 'Gestion des comptes administrateurs et permissions',
    deletedDescription: 'Utilisateurs supprimés - Restauration possible',
  },

  modals: {
    create: {
      title: 'Créer un utilisateur',
      success: 'Utilisateur créé avec succès',
    },
    edit: {
      title: "Modifier l'utilisateur",
      success: 'Utilisateur modifié avec succès',
    },
    delete: {
      title: "Supprimer l'utilisateur",
      confirm: 'Êtes-vous sûr de vouloir supprimer {{name}} ?',
      success: 'Utilisateur supprimé avec succès',
    },
    lock: {
      title: 'Verrouiller le compte',
      reason: 'Raison du verrouillage',
      duration: 'Durée',
      success: 'Compte verrouillé avec succès',
      warning: "L'utilisateur ne pourra pas se connecter pendant la durée spécifiée.",
      userToLock: 'Utilisateur à verrouiller',
      reasonPlaceholder: 'Décrivez la raison du verrouillage du compte...',
      warningTitle: 'Attention',
      confirmButton: 'Verrouiller le compte',
    },
    unlock: {
      title: 'Déverrouiller le compte',
      success: 'Compte déverrouillé avec succès',
    },
    basicInfo: 'Informations de base',
    accountInfo: 'Informations du compte',
    name: 'Nom',
    created: 'Créé le',
    notSpecified: 'Non spécifié',
    unknown: 'Inconnu',
    vipMember: 'Membre VIP',
    details: {
      title: "Détails de l'utilisateur",
      sections: {
        personal: 'Informations personnelles',
        contact: 'Contact',
        account: 'Compte',
        activity: 'Activité',
        subscription: 'Abonnement',
        security: 'Sécurité',
      },
    },
  },

  activity: {
    bookings: 'Réservations',
    properties: 'Propriétés',
    services: 'Services',
    interventions: 'Interventions',
    noActivity: 'Aucune activité',
    lastBooking: 'Dernier',
    earnings: 'Gains',
  },

  subscription: {
    standard: 'Standard',
    vip: 'VIP',
  },

  status: {
    validated: 'Validé',
    pending: 'En attente',
    locked: 'Verrouillé',
    unlockAt: 'Déverrouillage',
    permanent: 'Permanent',
    expired: 'Expiré',
    active: 'Actif',
    deleted: 'Supprimé',
    unverified: 'Non vérifié',
    verified: 'Vérifié',
  },

  stats: {
    rolePermissions: 'Rôle & Permissions',
    accountStatus: 'Statut du compte',
    locked: 'Verrouillé',
    active: 'Actif',
    verified: 'Vérifié',
    unverified: 'Non vérifié',
  },

  chips: {
    verified: 'Vérifié',
    vip: 'VIP',
    locked: 'Verrouillé',
  },

  tooltips: {
    validatedProfile: 'Profil validé',
    vipSubscription: 'Abonnement VIP',
    accountLocked: 'Compte verrouillé',
  },

  details: {
    userId: 'ID',
    joined: 'Inscrit le',
    unknown: 'Inconnu',
  },

  deletion: {
    strategies: {
      gdpr: {
        label: 'Suppression RGPD',
        description: "Droit à l'effacement - Anonymisation immédiate",
      },
      userRequest: {
        label: 'Demande utilisateur',
        description: "Suppression à la demande de l'utilisateur",
      },
      admin: {
        label: 'Suppression administrative',
        description: "Suppression par l'administrateur avec conservation pour audit",
      },
      policy: {
        label: 'Suppression disciplinaire',
        description: "Violation des conditions d'utilisation",
      },
    },
    customReason: 'Raison personnalisée (optionnel)',
    customReasonPlaceholder: 'Précisez la raison de cette suppression...',
    helperText: "Cette raison sera conservée dans les logs d'audit",
  },

  messages: {
    totalUsers: 'Total utilisateurs',
    activeUsers: 'Utilisateurs actifs',
    pendingValidations: 'Validations en attente',
    totalRevenue: 'Revenu total',
    vipUsers: 'Utilisateurs VIP',
    loadingUsersError: 'Erreur lors du chargement des utilisateurs',
    createNewUser: 'Créer un nouvel utilisateur',
    fullName: 'Nom complet',
    enterFullName: 'Entrez le nom complet',
    profileValidated: 'Profil validé',
    vipSubscription: 'Abonnement VIP',
    temporaryPasswordInfo: 'Un mot de passe temporaire sera envoyé par email',
    createUser: "Créer l'utilisateur",
    lastUpdated: 'Dernière mise à jour',
    subscriptionInfo: "Informations d'abonnement",
    currentStatus: 'Statut actuel',
    activeSubscription: 'Abonnement actif',
    noActiveSubscription: 'Aucun abonnement actif',
    subscriptionsCount: "Nombre d'abonnements",
    subscriptions: 'abonnements',
    subscription: 'abonnement',
    activeUntil: "Actif jusqu'au",
    
    // 🔒 Messages de sécurité
    securityAdminCreationBlocked: '🔒 Sécurité: La création de comptes administrateurs est interdite via cette interface.',
    securityAdminRoleChangeBlocked: '🔒 Sécurité: Impossible de modifier le rôle d\'un administrateur via cette interface.',
    securityAdminDeletionBlocked: '🔒 Sécurité: La suppression de comptes administrateurs est interdite via cette interface.',
  },
} as const;

export type UsersLabels = typeof USERS_LABELS;
