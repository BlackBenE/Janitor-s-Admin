/**
 * Labels du domaine Analytics
 *
 * Labels et textes pour les analytics et rapports.
 *
 * @example
 * import { ANALYTICS_LABELS } from '@/features/analytics/constants';
 * <Typography>{ANALYTICS_LABELS.title}</Typography>
 */

export const ANALYTICS_LABELS = {
  title: 'Analytiques & Rapports',
  subtitle: 'Tableau de bord analytique avec métriques de performance et insights business',

  filters: {
    startDate: 'Date de début',
    endDate: 'Date de fin',
    refreshData: 'Actualiser les données',
  },

  tabs: {
    trends: 'Tendances',
    performance: 'Performance',
    distribution: 'Répartition',
  },

  charts: {
    userGrowth: {
      title: 'Croissance des Utilisateurs',
      subtitle: 'Évolution des inscriptions et revenus sur la période sélectionnée',
    },
    bookingTrends: {
      title: 'Tendance des Réservations',
      subtitle: 'Évolution des réservations sur la période sélectionnée',
    },
    topServices: {
      title: 'Top Services',
      subtitle: 'Services les plus demandés sur la période sélectionnée',
    },
    monthlyRevenue: {
      title: 'Revenus par Mois',
      subtitle: 'Évolution des revenus sur la période sélectionnée',
    },
    bookingsByStatus: {
      title: 'Réservations par Statut',
      subtitle: 'Répartition des réservations par statut sur la période sélectionnée',
    },
    revenueByService: {
      title: 'Revenus par Service',
      subtitle: 'Contribution des services sur la période sélectionnée',
    },
  },

  messages: {
    loadingError: 'Erreur lors du chargement des analytics',
    retry: 'Réessayer',
    noDataToExport: 'Aucune donnée à exporter',
    exportSuccess: 'Données exportées en {{format}} avec succès',
    exportError: "Erreur lors de l'export",
  },

  metrics: {
    users: {
      total: 'Total Utilisateurs',
      active: 'Utilisateurs Actifs',
      new: 'Nouveaux Utilisateurs',
      growth: 'Taux de Croissance',
    },
    revenue: {
      total: 'Revenus Total',
      monthly: 'Revenus Mensuels',
      average: 'Panier Moyen',
      growth: 'Taux de Croissance',
    },
    activity: {
      bookings: 'Réservations Totales',
      completed: 'Réservations Terminées',
      cancelled: 'Réservations Annulées',
      services: 'Services Actifs',
    },
  },

  export: {
    button: 'Exporter',
    formats: {
      csv: 'Export CSV',
      pdf: 'Export PDF',
      excel: 'Export Excel',
    },
    success: 'Export généré avec succès',
  },

  dateRange: {
    today: "Aujourd'hui",
    yesterday: 'Hier',
    lastWeek: '7 derniers jours',
    lastMonth: '30 derniers jours',
    lastYear: '12 derniers mois',
    custom: 'Personnalisé',
  },
} as const;

export type AnalyticsLabels = typeof ANALYTICS_LABELS;
