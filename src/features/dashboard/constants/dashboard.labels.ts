/**
 * 🏷️ Labels du domaine Dashboard
 */

export const DASHBOARD_LABELS = {
  title: 'Tableau de bord',

  stats: {
    propertyValidations: 'Validations de propriété',
    providerModeration: 'Modération des fournisseurs',
    activeUsers: 'Utilisateurs actifs',
    monthlyRevenue: 'Revenu mensuel',
    pendingTotal: 'Total en attente',
    toValidate: 'À valider',
    last30Days: 'Les 30 derniers jours',
    thisMonth: 'Ce mois-ci',
  },

  charts: {
    monthlyRevenue: 'Revenu mensuel',
    revenueSubtitle: 'Tendances du revenu sur les 6 derniers mois',
    revenueLabel: 'Revenu (€)',
    userGrowth: 'Croissance des utilisateurs',
    userGrowthSubtitle: 'Croissance des utilisateurs actifs',
    activeUsersLabel: 'Utilisateurs actifs',
  },

  activities: {
    title: 'Activité récente',
    subtitle: 'Dernières actions nécessitant votre attention',
    subtitleScroll: ' - Faites défiler pour voir plus',
    noActivities: 'Aucune activité récente',
    status: {
      pending: 'En attente',
      reviewRequired: 'Révision requise',
      completed: 'Terminé',
    },
    types: {
      property: {
        title: 'Nouvelle soumission de propriété',
        description: 'Propriété "{{title}}" à {{city}} en attente de validation',
        action: 'Examiner la propriété',
      },
      provider: {
        title: 'Inscription prestataire de services',
        description: '{{name}} en attente de vérification du profil',
        action: 'Vérifier le prestataire',
      },
      serviceCancelled: {
        title: 'Service annulé',
        description: '{{reason}}',
        action: 'Examiner le service',
      },
      serviceIssue: {
        title: 'Problème de service',
        description: "La demande de service nécessite l'attention de l'administrateur",
        action: 'Examiner le service',
      },
      payment: {
        title: 'Vérification de paiement',
        description: 'Paiement de {{amount}}€ nécessite une vérification',
        action: 'Examiner le paiement',
      },
      chatReport: {
        title: 'Signalement de chat',
        description: 'Utilisateur signalé pour : {{reason}}',
        action: 'Examiner le signalement',
      },
      paymentFailed: {
        title: 'Paiement échoué',
        description: 'Paiement échoué : {{reason}}',
        action: 'Enquêter',
      },
      paymentOverdue: {
        title: 'Paiement en retard',
        description: 'Paiement de {{amount}}€ en attente depuis {{days}} jour(s)',
        action: 'Examiner le paiement',
      },
      refund: {
        title: 'Traitement de remboursement',
        description: 'Remboursement de {{amount}}€ nécessite un traitement',
        action: 'Traiter le remboursement',
      },
      userRegistration: {
        propertyOwner: 'Inscription propriétaire',
        traveler: 'Inscription voyageur',
        admin: 'Inscription admin',
        user: 'Inscription utilisateur',
        description: '{{name}} ({{role}}) en attente de validation du compte',
        action: 'Valider le compte',
      },
      accountLocked: {
        title: 'Compte verrouillé',
        description: 'Compte {{name}} verrouillé : {{reason}}',
        action: 'Examiner le verrouillage',
      },
    },
    roles: {
      propertyOwner: 'Propriétaire',
      traveler: 'Voyageur',
      admin: 'Admin',
      user: 'Utilisateur',
    },
  },
} as const;

export type DashboardLabels = typeof DASHBOARD_LABELS;
