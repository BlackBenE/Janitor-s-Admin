/**
 * Labels du domaine Financial Overview
 *
 * Labels et textes pour la vue d'ensemble financière.
 *
 * @example
 * import { FINANCIAL_LABELS } from '@/features/financial-overview/constants';
 * <Typography>{FINANCIAL_LABELS.title}</Typography>
 */

export const FINANCIAL_LABELS = {
  title: "Vue d'ensemble financière",
  subtitle: 'Analyse complète des revenus, dépenses et transactions',

  actions: {
    refresh: 'Actualiser',
    export: 'Exporter',
  },

  cards: {
    totalRevenue: {
      title: 'Revenus totaux',
    },
    totalExpenses: {
      title: 'Dépenses totales',
    },
    netProfit: {
      title: 'Bénéfice net',
    },
    activeSubscriptions: {
      title: 'Abonnements actifs',
    },
  },

  charts: {
    revenueVsExpenses: {
      title: 'Revenus vs Dépenses',
      subtitle: 'Évolution mensuelle des revenus et dépenses',
    },
    revenueByCategory: {
      title: 'Répartition des revenus',
      subtitle: 'Distribution des revenus par catégorie',
    },
  },

  owners: {
    title: 'Rapport par propriétaire',
    columns: {
      name: 'Propriétaire',
      properties: 'Propriétés',
      revenue: 'Revenus',
      expenses: 'Dépenses',
      balance: 'Solde',
    },
  },

  transactions: {
    title: 'Transactions récentes',
    columns: {
      id: 'ID Transaction',
      type: 'Type',
      user: 'Utilisateur',
      amount: 'Montant',
      status: 'Statut',
      date: 'Date',
      paymentMethod: 'Moyen de paiement',
    },
    types: {
      revenue: 'Revenu',
      expense: 'Dépense',
      commission: 'Commission',
      subscription: 'Abonnement',
    },
    status: {
      completed: 'Complété',
      pending: 'En attente',
      failed: 'Échoué',
      cancelled: 'Annulé',
    },
    paymentMethods: {
      card: 'Carte bancaire',
      bank_transfer: 'Virement bancaire',
      paypal: 'PayPal',
      cash: 'Espèces',
      other: 'Autre',
    },
  },

  stats: {
    totalRevenue: 'Revenus totaux',
    totalExpenses: 'Dépenses totales',
    netProfit: 'Bénéfice net',
    avgTransactionValue: 'Valeur moyenne transaction',
  },

  export: {
    button: 'Exporter',
    formats: {
      csv: 'Export CSV',
      pdf: 'Export PDF',
      excel: 'Export Excel',
    },
  },

  messages: {
    loadingError: 'Erreur lors du chargement des données financières',
    exportSuccess: 'Données exportées avec succès',
    exportError: "Erreur lors de l'export",
  },
} as const;

export type FinancialLabels = typeof FINANCIAL_LABELS;
