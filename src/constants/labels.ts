/**
 * 🌍 Labels et textes de l'application - Version française
 *
 * Ce fichier centralise tous les textes visibles de l'application.
 * Best practice : Séparer le contenu du code pour faciliter la maintenance.
 *
 * Structure : LABELS.domaine.section.element
 *
 * @example
 * import { LABELS } from '@/constants/labels';
 * <Button>{LABELS.common.actions.save}</Button>
 */

export const LABELS = {
  // ======================== COMMUN ========================
  common: {
    actions: {
      save: "Enregistrer",
      cancel: "Annuler",
      delete: "Supprimer",
      edit: "Modifier",
      view: "Voir",
      search: "Rechercher",
      filter: "Filtrer",
      export: "Exporter",
      import: "Importer",
      create: "Créer",
      update: "Mettre à jour",
      close: "Fermer",
      back: "Retour",
      next: "Suivant",
      previous: "Précédent",
      confirm: "Confirmer",
      submit: "Soumettre",
      reset: "Réinitialiser",
      refresh: "Actualiser",
      open: "Ouvrir",
      select: "Sélectionner",
    },
    status: {
      active: "Actif",
      inactive: "Inactif",
      pending: "En attente",
      completed: "Terminé",
      cancelled: "Annulé",
      rejected: "Rejeté",
      approved: "Approuvé",
      locked: "Verrouillé",
      deleted: "Supprimé",
      archived: "Archivé",
    },
    fields: {
      email: "Email",
      phone: "Téléphone",
      name: "Nom",
      firstName: "Prénom",
      lastName: "Nom de famille",
      fullName: "Nom complet",
      date: "Date",
      amount: "Montant",
      description: "Description",
      address: "Adresse",
      city: "Ville",
      country: "Pays",
      postalCode: "Code postal",
      role: "Rôle",
      status: "Statut",
    },
    messages: {
      noData: "Aucune donnée disponible",
      loading: "Chargement...",
      error: "Une erreur est survenue",
      success: "Opération réussie",
      confirmDelete: "Êtes-vous sûr de vouloir supprimer ?",
      saved: "Enregistré avec succès",
      deleted: "Supprimé avec succès",
      updated: "Mis à jour avec succès",
      noResults: "Aucun résultat trouvé",
      noAddress: "Pas d'adresse",
      downloadPdf: "Télécharger le PDF",
      uploadInProgress: "Upload en cours...",
      enterFullName: "Entrez le nom complet de l'utilisateur",
      typeToConfirm: "Tapez {{text}} pour confirmer",
      pleaseType: "Veuillez taper",
      toConfirm: "pour confirmer",
      activeUsers: "Utilisateurs actifs",
      pendingValidations: "Validations en attente",
      activeSubscription: "Actif",
      noActiveSubscription: "Aucun abonnement actif",
      currentStatus: "Statut actuel",
      activeUntil: "Actif jusqu'au",
      subscriptionsCount: "Nombre d'abonnements",
      subscriptionInfo: "Informations d'abonnement",
      subscription: "abonnement",
      subscriptions: "abonnements",
      unknown: "Inconnu",
      lastUpdated: "Dernière mise à jour",
      fullName: "Nom complet",
      profileValidated: "Profil validé",
      vipSubscription: "Abonnement VIP",
      temporaryPasswordInfo:
        "💡 Un mot de passe temporaire sera généré et envoyé à l'adresse e-mail de l'utilisateur. L'utilisateur sera invité à le changer lors de la première connexion.",
      createUser: "Créer l'utilisateur",
      totalUsers: "Utilisateurs totaux",
      totalRevenue: "Revenu total",
      unknownError: "Erreur inconnue",
      loadingUsersError: "Erreur lors du chargement des utilisateurs",
      markAsPaid: "Marquer comme payé",
      refundPayment: "Rembourser le paiement",
      retryPayment: "Relancer le paiement",
      viewDetails: "Voir les détails",
      moreActions: "Plus d'actions",
      deleteAccount: "Supprimer le compte",
      thisActionCannotBeUndone: "Cette action ne peut pas être annulée !",
      deleteAccountWarning:
        "Cela supprimera définitivement votre compte et toutes les données associées. Vous ne pourrez pas récupérer votre compte ni aucune de vos données.",
      youAreAboutToDelete: "Vous êtes sur le point de supprimer le compte",
      deleteAccountInfo:
        "Cela supprimera toutes vos informations personnelles, paramètres et tout contenu associé à votre compte.",
      reasonForDeletion: "Raison de la suppression (optionnel)",
      tellUsWhyLeaving: "Dites-nous pourquoi vous partez (optionnel)",
      typeDeleteToConfirm: "Tapez DELETE pour confirmer",
      pleaseTypeExactly: 'Veuillez taper "{{text}}" exactement',
      deleting: "Suppression...",
      profileDetails: "Détails du profil",
      fullNameRequired: "Le nom complet est requis",
      notProvided: "Non renseigné",
      unsavedChanges:
        "Vous avez des modifications non enregistrées. N'oubliez pas de sauvegarder votre profil.",
      validated: "Validé",
      notValidated: "Non validé",
      available: "Disponible",
      unavailable: "Indisponible",
      submitted: "Soumis",
      editAmenities: "Modifier les équipements",
      activateService: "Activer le service",
      serviceName: "Nom du service",
      priceType: "Type de prix",
      paymentType: "Type de paiement",
      messageType: "Type de message",
      newNotification: "Nouvelle notification",
      viewProfile: "Voir le profil",
      editProfile: "Modifier le profil",
      createNewUser: "Créer un nouvel utilisateur",
    },
  },

  // ======================== GESTION UTILISATEURS ========================
  users: {
    title: "Gestion des utilisateurs",
    unnamedUser: "Utilisateur sans nom",

    table: {
      headers: {
        name: "Nom",
        email: "Email",
        phone: "Téléphone",
        role: "Rôle",
        status: "Statut",
        activity: "Activité",
        actions: "Actions",
        createdAt: "Créé le",
        lastConnection: "Dernière connexion",
        subscription: "Abonnement",
        spending: "Dépenses",
      },
    },

    roles: {
      admin: "Administrateur",
      property_owner: "Propriétaire",
      service_provider: "Prestataire",
      traveler: "Voyageur",
    },

    tabs: {
      all: "Tous les utilisateurs",
      travelers: "Voyageurs",
      propertyOwners: "Propriétaires",
      serviceProviders: "Prestataires",
      admins: "Administrateurs",
      deleted: "Utilisateurs supprimés",
      allDescription: "Vue d'ensemble de tous les utilisateurs",
      travelersDescription:
        "Gestion des comptes voyageurs et leurs réservations",
      propertyOwnersDescription:
        "Gestion des propriétaires et leurs abonnements (100€/an)",
      serviceProvidersDescription:
        "Modération des prestataires de services et vérifications",
      adminsDescription: "Gestion des comptes administrateurs et permissions",
      deletedDescription: "Utilisateurs supprimés - Restauration possible",
    },

    modals: {
      create: {
        title: "Créer un utilisateur",
        success: "Utilisateur créé avec succès",
      },
      edit: {
        title: "Modifier l'utilisateur",
        success: "Utilisateur modifié avec succès",
      },
      delete: {
        title: "Supprimer l'utilisateur",
        confirm: "Êtes-vous sûr de vouloir supprimer {{name}} ?",
        success: "Utilisateur supprimé avec succès",
      },
      lock: {
        title: "Verrouiller le compte",
        reason: "Raison du verrouillage",
        duration: "Durée",
        success: "Compte verrouillé avec succès",
        warning:
          "L'utilisateur ne pourra pas se connecter pendant la durée spécifiée.",
        userToLock: "Utilisateur à verrouiller",
        reasonPlaceholder: "Décrivez la raison du verrouillage du compte...",
        warningTitle: "Attention",
        confirmButton: "Verrouiller le compte",
      },
      unlock: {
        title: "Déverrouiller le compte",
        success: "Compte déverrouillé avec succès",
      },
      basicInfo: "Informations de base",
      accountInfo: "Informations du compte",
      name: "Nom",
      created: "Créé le",
      notSpecified: "Non spécifié",
      unknown: "Inconnu",
      vipMember: "Membre VIP",
      details: {
        title: "Détails de l'utilisateur",
        sections: {
          personal: "Informations personnelles",
          contact: "Contact",
          account: "Compte",
          activity: "Activité",
          subscription: "Abonnement",
          security: "Sécurité",
        },
      },
    },

    activity: {
      bookings: "Réservations",
      properties: "Propriétés",
      services: "Services",
      interventions: "Interventions",
      noActivity: "Aucune activité",
      lastBooking: "Dernier",
      earnings: "Gains",
    },

    subscription: {
      standard: "Standard",
      vip: "VIP",
    },

    status: {
      validated: "Validé",
      pending: "En attente",
      locked: "Verrouillé",
      unlockAt: "Déverrouillage",
      permanent: "Permanent",
      expired: "Expiré",
      active: "Actif",
      deleted: "Supprimé",
      unverified: "Non vérifié",
      verified: "Vérifié",
    },

    stats: {
      rolePermissions: "Rôle & Permissions",
      accountStatus: "Statut du compte",
      locked: "Verrouillé",
      active: "Actif",
      verified: "Vérifié",
      unverified: "Non vérifié",
    },

    chips: {
      verified: "Vérifié",
      vip: "VIP",
      locked: "Verrouillé",
    },

    tooltips: {
      validatedProfile: "Profil validé",
      vipSubscription: "Abonnement VIP",
      accountLocked: "Compte verrouillé",
    },

    details: {
      userId: "ID",
      joined: "Inscrit le",
      unknown: "Inconnu",
    },

    deletion: {
      strategies: {
        gdpr: {
          label: "Suppression RGPD",
          description: "Droit à l'effacement - Anonymisation immédiate",
        },
        userRequest: {
          label: "Demande utilisateur",
          description: "Suppression à la demande de l'utilisateur",
        },
        admin: {
          label: "Suppression administrative",
          description:
            "Suppression par l'administrateur avec conservation pour audit",
        },
        policy: {
          label: "Suppression disciplinaire",
          description: "Violation des conditions d'utilisation",
        },
      },
      customReason: "Raison personnalisée (optionnel)",
      customReasonPlaceholder: "Précisez la raison de cette suppression...",
      helperText: "Cette raison sera conservée dans les logs d'audit",
    },
  },

  // ======================== AUTHENTIFICATION ========================
  auth: {
    title: "Authentification",
    login: {
      title: "Connexion",
      email: "Adresse email",
      password: "Mot de passe",
      forgotPassword: "Mot de passe oublié ?",
      submit: "Se connecter",
      success: "Connexion réussie",
      error: "Identifiants incorrects",
    },
    register: {
      title: "Inscription",
      confirmPassword: "Confirmer le mot de passe",
      submit: "S'inscrire",
      success: "Inscription réussie",
    },
    resetPassword: {
      title: "Réinitialiser le mot de passe",
      submit: "Envoyer le lien",
      success: "Email de réinitialisation envoyé",
    },
    twoFactor: {
      title: "Activer l'authentification à deux facteurs",
      steps: {
        setup: "Configuration",
        verify: "Vérification",
        complete: "Terminé",
      },
      cancel: "Annuler",
      back: "Retour",
      next: "Suivant",
      complete: "Terminer",
    },
  },

  // ======================== PAIEMENTS ========================
  payments: {
    title: "Gestion des paiements",

    table: {
      headers: {
        reference: "Référence",
        user: "Utilisateur",
        amount: "Montant",
        type: "Type",
        status: "Statut",
        date: "Date",
        actions: "Actions",
      },
    },

    types: {
      booking: "Réservation",
      subscription: "Abonnement",
      service: "Service",
      vip: "VIP",
      quote: "Devis",
    },

    status: {
      paid: "Payé",
      pending: "En attente",
      processing: "En cours",
      refunded: "Remboursé",
      failed: "Échoué",
      cancelled: "Annulé",
      overdue: "En retard",
    },

    tabs: {
      all: "Tous les paiements",
      paid: "Payés",
      pending: "En attente",
      refunded: "Remboursés",
    },

    details: {
      title: "Détails du paiement",
      reference: "Référence",
      amount: "Montant",
      fees: "Frais",
      netAmount: "Montant net",
      paymentMethod: "Moyen de paiement",
      transactionId: "ID de transaction",
    },
  },

  // ======================== SERVICES ========================
  services: {
    title: "Catalogue de services",

    table: {
      headers: {
        name: "Nom",
        category: "Catégorie",
        provider: "Prestataire",
        price: "Prix",
        status: "Statut",
        actions: "Actions",
      },
    },

    categories: {
      cleaning: "Ménage",
      maintenance: "Maintenance",
      security: "Sécurité",
      concierge: "Conciergerie",
    },

    status: {
      active: "Actif",
      inactive: "Inactif",
      pending: "En attente",
      completed: "Terminé",
      cancelled: "Annulé",
    },

    tabs: {
      all: "Tous les services",
      active: "Actifs",
      inactive: "Inactifs",
      archived: "Archivés",
    },
  },

  // ======================== DASHBOARD ========================
  dashboard: {
    title: "Tableau de bord",

    stats: {
      propertyValidations: "Validations de propriété",
      providerModeration: "Modération des fournisseurs",
      activeUsers: "Utilisateurs actifs",
      monthlyRevenue: "Revenu mensuel",
      pendingTotal: "Total en attente",
      toValidate: "À valider",
      last30Days: "Les 30 derniers jours",
      thisMonth: "Ce mois-ci",
    },

    charts: {
      monthlyRevenue: "Revenu mensuel",
      revenueSubtitle: "Tendances du revenu sur les 6 derniers mois",
      revenueLabel: "Revenu (€)",
      userGrowth: "Croissance des utilisateurs",
      userGrowthSubtitle: "Croissance des utilisateurs actifs",
      activeUsersLabel: "Utilisateurs actifs",
    },

    activities: {
      title: "Activité récente",
      subtitle: "Dernières actions nécessitant votre attention",
      subtitleScroll: " - Faites défiler pour voir plus",
      noActivities: "Aucune activité récente",
      status: {
        pending: "En attente",
        reviewRequired: "Révision requise",
        completed: "Terminé",
      },
      types: {
        property: {
          title: "Nouvelle soumission de propriété",
          description:
            'Propriété "{{title}}" à {{city}} en attente de validation',
          action: "Examiner la propriété",
        },
        provider: {
          title: "Inscription prestataire de services",
          description: "{{name}} en attente de vérification du profil",
          action: "Vérifier le prestataire",
        },
        serviceCancelled: {
          title: "Service annulé",
          description: "{{reason}}",
          action: "Examiner le service",
        },
        serviceIssue: {
          title: "Problème de service",
          description:
            "La demande de service nécessite l'attention de l'administrateur",
          action: "Examiner le service",
        },
        payment: {
          title: "Vérification de paiement",
          description: "Paiement de {{amount}}€ nécessite une vérification",
          action: "Examiner le paiement",
        },
        chatReport: {
          title: "Signalement de chat",
          description: "Utilisateur signalé pour : {{reason}}",
          action: "Examiner le signalement",
        },
        paymentFailed: {
          title: "Paiement échoué",
          description: "Paiement échoué : {{reason}}",
          action: "Enquêter",
        },
        paymentOverdue: {
          title: "Paiement en retard",
          description:
            "Paiement de {{amount}}€ en attente depuis {{days}} jour(s)",
          action: "Examiner le paiement",
        },
        refund: {
          title: "Traitement de remboursement",
          description: "Remboursement de {{amount}}€ nécessite un traitement",
          action: "Traiter le remboursement",
        },
        userRegistration: {
          propertyOwner: "Inscription propriétaire",
          traveler: "Inscription voyageur",
          admin: "Inscription admin",
          user: "Inscription utilisateur",
          description: "{{name}} ({{role}}) en attente de validation du compte",
          action: "Valider le compte",
        },
        accountLocked: {
          title: "Compte verrouillé",
          description: "Compte {{name}} verrouillé : {{reason}}",
          action: "Examiner le verrouillage",
        },
      },
      roles: {
        propertyOwner: "Propriétaire",
        traveler: "Voyageur",
        admin: "Admin",
        user: "Utilisateur",
      },
    },
  },

  // ======================== DEMANDES DE DEVIS ========================
  quoteRequests: {
    title: "Demandes de devis",
    subtitle:
      "Surveillez et gérez les demandes de devis de service et les interventions en cours.",

    table: {
      title: "Gestion des demandes de devis",
      subtitle:
        "Suivre les demandes de service et les réponses des fournisseurs",
      headers: {
        requestId: "ID Demande",
        clientId: "ID Client",
        serviceId: "ID Service",
        status: "Statut",
        amount: "Montant",
        createdAt: "Date création",
        actions: "Actions",
      },
    },

    stats: {
      totalRequests: "Total des demandes",
      pendingRequests: "Devis en attente",
      inProgressJobs: "Emplois actifs",
      completionRate: "Taux d'achèvement",
      totalRevenue: "Revenus totaux",
      averageAmount: "Montant moyen",
      pendingCount: "en attente",
      ofTotal: "du total",
      inProgress: "En cours",
      completed: "terminés",
      completedRequests: "Demandes terminées",
      perRequest: "Par demande",
      loading: "Chargement...",
    },

    actions: {
      addRequest: "Ajouter une demande",
      refresh: "Actualiser les données",
      export: "Exporter les demandes sélectionnées",
      edit: "Modifier",
      approve: "Approuver",
      reject: "Rejeter",
      delete: "Supprimer",
    },

    messages: {
      requestsCount: "demandes",
      exportInProgress: "Export en cours...",
      addToImplement: "Ajout de demande - À implémenter",
      deleteSuccess: "Demande supprimée avec succès",
      deleteError: "Erreur lors de la suppression",
      approveSuccess: "Demande approuvée avec succès",
      approveError: "Erreur lors de l'approbation",
      rejectSuccess: "Demande rejetée avec succès",
      rejectError: "Erreur lors du rejet",
      rejectedByAdmin: "Rejetée par l'admin",
      loadError: "Impossible de charger les demandes de devis",
      statsLoadError: "Erreur lors du chargement des statistiques",
    },
  },

  // ======================== APPROBATIONS PROPRIÉTÉS ========================
  propertyApprovals: {
    title: "Approbations de propriétés",
    subtitle:
      "Réviser et modérer les annonces immobilières soumises par les propriétaires.",

    table: {
      title: "Toutes les propriétés",
      subtitle:
        "Gérer les propriétés de toutes catégories avec des vues spécialisées",
      headers: {
        property: "Propriété",
        owner: "Propriétaire",
        location: "Localisation",
        status: "Statut",
        price: "Prix",
        images: "Images",
        createdAt: "Créé le",
        actions: "Actions",
      },
      unknownProperty: "Propriété inconnue",
      untitled: "Sans titre",
      status: {
        approved: "Approuvé",
        rejected: "Rejeté",
        pending: "En attente",
      },
    },

    status: {
      all: "Toutes",
      pending: "En attente",
      approved: "Approuvé",
      rejected: "Rejeté",
    },

    tabs: {
      all: "Toutes les propriétés",
      pending: "En attente",
      approved: "Approuvées",
      rejected: "Rejetées",
    },

    actions: {
      view: "Voir détails",
      approve: "Approuver",
      reject: "Rejeter",
      setPending: "Mettre en attente",
      delete: "Supprimer",
      edit: "Modifier",
      export: "Exporter vers CSV",
      addProperty: "Ajouter une propriété",
      deleteProperty: "Supprimer la propriété",
      viewDetails: "Voir les détails",
      moreActions: "Plus d'actions",
    },

    bulk: {
      selected: "{{count}} propriété(s) sélectionnée(s)",
      tooltips: {
        approve: "Approuver {{count}} propriété(s)",
        setPending: "Mettre {{count}} propriété(s) en attente",
        reject: "Rejeter {{count}} propriété(s)",
        clear: "Effacer la sélection",
      },
      actions: {
        approveAll: "Tout approuver",
        setPending: "Mettre en attente",
        rejectAll: "Tout rejeter",
        clear: "Effacer",
      },
    },

    search: {
      placeholder: "Rechercher des propriétés...",
      ariaLabel: "filtre de statut des propriétés",
    },

    emptyState: {
      title: "Aucune propriété trouvée",
      noMatch: "Aucune propriété ne correspond à vos critères de recherche.",
      noProperties: "Il n'y a pas encore de propriétés dans le système.",
    },

    modals: {
      title: "Détails de la propriété",
      ownerInfo: "Informations propriétaire",
      ownerName: "Nom du propriétaire",
      unknownOwner: "Propriétaire inconnu",
      unknownAdmin: "Administrateur inconnu",
      noEmail: "Pas d'email",
      ownerId: "ID Propriétaire",
      basicInfo: "Informations de base",
      amenities: "Équipements",
      rules: "Règles",
      availability: "Disponibilité",
      moderationNotes: "Notes de modération",
      sections: {
        basicInfo: "Informations de base",
        location: "Localisation",
        amenities: "Équipements et fonctionnalités",
        validation: "Statut de validation",
        availability: "Calendrier de disponibilité",
      },
      fields: {
        propertyId: "ID de la propriété",
        propertyTitle: "Titre de la propriété",
        title: "Titre",
        city: "Ville",
        description: "Description",
        nightlyRate: "Tarif par nuit",
        maxCapacity: "Capacité maximale",
        imagesCount: "Nombre d'images",
        ownerId: "ID du propriétaire",
        createdAt: "Créé le",
        createdDate: "Date de création",
        updatedAt: "Mis à jour le",
        lastUpdated: "Dernière mise à jour",
        validationStatus: "Statut de validation",
        validatedBy: "Validé par",
        validatedDate: "Date de validation",
        moderationNotes: "Notes de modération",
        bedrooms: "Chambres",
        bathrooms: "Salles de bain",
        address: "Adresse",
        postalCode: "Code postal",
        availableAmenities: "Équipements disponibles",
        status: "Statut",
      },
      placeholders: {
        noTitle: "Aucun titre fourni",
        noDescription: "Aucune description fournie",
        priceNotSet: "Prix non défini",
        noImages: "Aucune image téléchargée",
        notValidated: "Non validé",
        noModerationNotes: "Aucune note de modération",
        noAmenitiesListed: "Aucun équipement listé",
      },
      units: {
        perNight: "/nuit",
        guests: "invités",
        images: "image(s)",
      },
      calendar: {
        noPeriods: "Aucune période de disponibilité configurée",
        periodsConfigured:
          "{{count}} période(s) de disponibilité configurée(s)",
        period: "Période",
        status: "Statut",
        reason: "Raison",
        available: "Disponible",
        unavailable: "Indisponible",
        noReason: "Aucune raison fournie",
        parseError: "Erreur lors de l'analyse des données du calendrier",
        rawData: "Données brutes :",
        noCalendar: "Aucun calendrier de disponibilité configuré",
      },
    },

    edit: {
      titles: {
        propertyInfo: "Modifier les informations de la propriété",
        location: "Modifier l'emplacement",
        amenities: "Modifier les équipements",
        adminNotes: "Notes d'administration",
      },
      fields: {
        propertyTitle: "Titre de la propriété",
        description: "Description",
        nightlyRate: "Tarif par nuit (€)",
        maxCapacity: "Capacité maximale",
        bedrooms: "Chambres",
        bathrooms: "Salles de bain",
        address: "Adresse",
        city: "Ville",
        postalCode: "Code postal",
        addAmenity: "Ajouter un équipement",
        moderationNotes: "Notes de modération",
      },
      helpers: {
        title: "Titre clair et descriptif sans majuscules excessives",
        description: "Description précise sans coordonnées ni liens externes",
        pricing: "Tarification adaptée au marché",
        capacity: "Limite d'occupation sécurisée",
        bedrooms: "Chambres réelles avec intimité",
        bathrooms: "Utiliser 0,5 pour les demi-salles de bain",
        address:
          "Adresse générale (éviter les numéros d'unité spécifiques pour la confidentialité)",
        city: "Nom de ville standardisé",
        postalCode: "Format correct pour le pays",
        moderationNotes:
          "Documenter les modifications effectuées et les raisons...",
        internalNotes: "Notes internes sur les modifications et communications",
      },
      messages: {
        noAmenities: "Aucun équipement listé",
      },
    },

    moderation: {
      title: "Notes de modération",
      placeholder: "Ajouter des notes pour votre décision (optionnel)...",
      actions: {
        close: "Fermer",
        cancel: "Annuler",
        saveChanges: "Enregistrer les modifications",
        saving: "Enregistrement...",
        editProperty: "Modifier la propriété",
        reject: "Rejeter",
        rejecting: "Rejet en cours...",
        setPending: "Mettre en attente",
        settingPending: "Mise en attente...",
        approve: "Approuver",
        approving: "Approbation en cours...",
      },
    },

    filters: {
      search: "Rechercher...",
      city: "Ville",
      country: "Pays",
      minPrice: "Prix minimum",
      maxPrice: "Prix maximum",
      status: "Statut",
    },

    messages: {
      approveSuccess: "Propriété approuvée avec succès",
      approveError: "Erreur lors de l'approbation",
      rejectSuccess: "Propriété rejetée avec succès",
      rejectError: "Erreur lors du rejet",
      setPendingSuccess: "Statut mis en attente avec succès",
      setPendingError: "Erreur lors du changement de statut",
      deleteSuccess: "Propriété supprimée avec succès",
      deleteError: "Erreur lors de la suppression",
      updateSuccess: "Propriété mise à jour avec succès",
      updateError: "Erreur lors de la mise à jour",
      noSelection: "Aucune propriété sélectionnée",
      confirmDelete: "Êtes-vous sûr de vouloir supprimer cette propriété ?",
      exportInProgress: "Export en cours...",
      reviewSubtitle:
        "Réviser et modérer les annonces immobilières soumises par les propriétaires.",
      loadError: "Erreur lors du chargement des propriétés",
      noImagesAvailable: "Aucune image disponible pour cette propriété",
    },
  },

  // ======================== ANALYTICS ========================
  analytics: {
    title: "Analytiques & Rapports",
    subtitle:
      "Tableau de bord analytique avec métriques de performance et insights business",

    filters: {
      startDate: "Date de début",
      endDate: "Date de fin",
      refreshData: "Actualiser les données",
    },

    tabs: {
      trends: "Tendances",
      performance: "Performance",
      distribution: "Répartition",
    },

    charts: {
      userGrowth: {
        title: "Croissance des Utilisateurs",
        subtitle:
          "Évolution des inscriptions et revenus sur la période sélectionnée",
      },
      bookingTrends: {
        title: "Tendance des Réservations",
        subtitle: "Évolution des réservations sur la période sélectionnée",
      },
      topServices: {
        title: "Top Services",
        subtitle: "Services les plus demandés sur la période sélectionnée",
      },
      monthlyRevenue: {
        title: "Revenus par Mois",
        subtitle: "Évolution des revenus sur la période sélectionnée",
      },
      bookingsByStatus: {
        title: "Réservations par Statut",
        subtitle:
          "Répartition des réservations par statut sur la période sélectionnée",
      },
      revenueByService: {
        title: "Revenus par Service",
        subtitle: "Contribution des services sur la période sélectionnée",
      },
    },

    messages: {
      loadingError: "Erreur lors du chargement des analytics",
      retry: "Réessayer",
      noDataToExport: "Aucune donnée à exporter",
      exportSuccess: "Données exportées en {{format}} avec succès",
      exportError: "Erreur lors de l'export",
    },

    metrics: {
      users: {
        total: "Total Utilisateurs",
        active: "Utilisateurs Actifs",
        new: "Nouveaux Utilisateurs",
        growth: "Taux de Croissance",
      },
      revenue: {
        total: "Revenus Total",
        monthly: "Revenus Mensuels",
        average: "Panier Moyen",
        growth: "Taux de Croissance",
      },
      activity: {
        bookings: "Réservations Totales",
        completed: "Réservations Terminées",
        cancelled: "Réservations Annulées",
        services: "Services Actifs",
      },
    },

    export: {
      button: "Exporter",
      formats: {
        csv: "Export CSV",
        pdf: "Export PDF",
        excel: "Export Excel",
      },
      success: "Export généré avec succès",
    },

    dateRange: {
      today: "Aujourd'hui",
      yesterday: "Hier",
      lastWeek: "7 derniers jours",
      lastMonth: "30 derniers jours",
      lastYear: "12 derniers mois",
      custom: "Personnalisé",
    },
  },

  // ======================== PROFIL ========================
  profile: {
    title: "Mon profil",

    sections: {
      personal: "Informations personnelles",
      security: "Sécurité",
      preferences: "Préférences",
    },

    settings: {
      language: "Langue",
      theme: "Thème",
      timezone: "Fuseau horaire",
    },

    security: {
      title: "Paramètres de sécurité",
      password: {
        title: "Mot de passe",
        description: "Changer le mot de passe de votre compte",
        changeButton: "Changer le mot de passe",
        lastChange: "Dernier changement de mot de passe",
        never: "Jamais",
      },
      twoFactor: {
        title: "Authentification à deux facteurs",
        description: "Ajouter une couche de sécurité supplémentaire",
        enabled: "Activée",
        disabled: "Désactivée",
        enableButton: "Activer 2FA",
        disableButton: "Désactiver 2FA",
      },
      accountSecurity: {
        title: "Sécurité du compte",
        accountCreated: "Compte créé le",
      },
      dangerZone: {
        title: "Zone dangereuse",
        deleteAccount: "Supprimer le compte",
        deleteDescription:
          "Supprimer définitivement votre compte et toutes les données associées. Cette action ne peut pas être annulée.",
        deleteButton: "Supprimer le compte",
      },
      recommendation:
        "💡 Nous recommandons d'activer l'authentification à deux facteurs et de mettre à jour votre mot de passe régulièrement.",
      changePassword: "Changer le mot de passe",
      twoFactorAuth: "Authentification à deux facteurs",
      sessions: "Sessions actives",
    },

    placeholders: {
      phone: "+33 6 12 34 56 78",
    },
  },

  // ======================== VALIDATION ========================
  validation: {
    required: "{{field}} est requis",
    invalid: "{{field}} invalide",
    minLength: "Minimum {{min}} caractères",
    maxLength: "Maximum {{max}} caractères",
    minCharsRequired: "Minimum {{min}} caractères requis",
    maxCharsAllowed: "Maximum {{max}} caractères autorisés",
    email: "Adresse email invalide",
    emailInvalid: "Veuillez entrer une adresse email valide",
    phone: "Numéro de téléphone invalide",
    password: {
      minLength: "Le mot de passe doit contenir au moins 8 caractères",
      match: "Les mots de passe ne correspondent pas",
      weak: "Mot de passe trop faible",
    },
  },

  // ======================== FORMULAIRES ========================
  forms: {
    submissionError: "Erreur lors de la soumission du formulaire",
    resetAfterSuccess: "Formulaire réinitialisé après succès",
  },

  // ======================== MENU PROFIL ========================
  profileMenu: {
    adminUser: "Utilisateur Admin",
    adminEmail: "admin@example.com",
    adminRole: "admin",
    roleLabel: "Rôle",
    profile: "Profil",
    signOut: "Se déconnecter",
    signingOut: "Déconnexion...",
    logoutError: "Erreur de déconnexion",
    logoutFailed: "Échec de la déconnexion",
    userMenu: "Menu utilisateur",
  },

  // ======================== SIDEBAR / NAVIGATION ========================
  navigation: {
    adminDashboard: "Tableau de bord Admin",
    dashboard: "Tableau de bord",
    userManagement: "Gestion Utilisateurs",
    payments: "Paiements",
    analytics: "Analytique",
    services: "Services",
    propertyApprovals: "Approbations Propriétés",
    quoteRequests: "Demandes Devis",
    servicesCatalog: "Catalogue Services",
  },

  // ======================== COMPOSANTS GÉNÉRIQUES ========================
  table: {
    toolbar: {
      columns: "Colonnes",
      filters: "Filtres",
    },
    actions: "Actions",
    noData: "Aucune donnée disponible",
  },

  searchBar: {
    placeholder: "Rechercher...",
    ariaLabel: "rechercher",
    noResults: "Aucun résultat",
  },

  modal: {
    close: "Fermer",
    ariaLabel: "fermer",
  },

  // ======================== COMMUNICATION ========================
  communication: {
    title: "Communication",
    tabs: {
      compose: "Composer",
      templates: "Modèles",
      inbox: "Boîte de réception",
      sent: "Envoyés",
    },
    compose: {
      to: "À",
      subject: "Sujet",
      message: "Message",
      send: "Envoyer",
      sending: "Envoi...",
      selectRecipient: "Sélectionner un destinataire",
      enterSubject: "Entrer un sujet",
      typeMessage: "Taper votre message...",
    },
    messages: {
      sent: "Message envoyé avec succès",
      error: "Erreur lors de l'envoi du message",
      noMessages: "Aucun message",
      from: "De",
      date: "Date",
    },
  },
} as const;

/**
 * Type helper pour l'autocomplétion
 */
export type Labels = typeof LABELS;

/**
 * Helper pour interpoler des variables dans les messages
 * @example formatMessage(LABELS.validation.required, { field: 'Email' })
 */
export const formatMessage = (
  template: string,
  vars: Record<string, string | number>
): string => {
  return template.replace(/\{\{(\w+)\}\}/g, (_, key) =>
    String(vars[key] || "")
  );
};
