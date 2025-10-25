/**
 * 🏷️ Labels du domaine Services Catalog
 */

export const SERVICES_CATALOG_LABELS = {
  title: 'Catalogue de services',

  table: {
    headers: {
      name: 'Nom',
      category: 'Catégorie',
      provider: 'Prestataire',
      price: 'Prix',
      status: 'Statut',
      actions: 'Actions',
    },
  },

  categories: {
    cleaning: 'Ménage',
    maintenance: 'Maintenance',
    security: 'Sécurité',
    concierge: 'Conciergerie',
  },

  status: {
    active: 'Actif',
    inactive: 'Inactif',
    pending: 'En attente',
    completed: 'Terminé',
    cancelled: 'Annulé',
  },

  tabs: {
    all: 'Tous les services',
    active: 'Actifs',
    inactive: 'Inactifs',
    archived: 'Archivés',
  },
} as const;

export type ServicesCatalogLabels = typeof SERVICES_CATALOG_LABELS;
