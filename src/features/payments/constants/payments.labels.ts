/**
 * 🏷️ Labels du domaine Payments
 */

export const PAYMENTS_LABELS = {
  title: 'Gestion des paiements',

  table: {
    headers: {
      reference: 'Référence',
      user: 'Utilisateur',
      amount: 'Montant',
      type: 'Type',
      status: 'Statut',
      date: 'Date',
      actions: 'Actions',
    },
  },

  types: {
    booking: 'Réservation',
    subscription: 'Abonnement',
    service: 'Service',
    vip: 'VIP',
    quote: 'Devis',
  },

  status: {
    paid: 'Payé',
    pending: 'En attente',
    processing: 'En cours',
    refunded: 'Remboursé',
    failed: 'Échoué',
    cancelled: 'Annulé',
    overdue: 'En retard',
  },

  tabs: {
    all: 'Tous les paiements',
    paid: 'Payés',
    pending: 'En attente',
    refunded: 'Remboursés',
  },

  details: {
    title: 'Détails du paiement',
    reference: 'Référence',
    amount: 'Montant',
    fees: 'Frais',
    netAmount: 'Montant net',
    paymentMethod: 'Moyen de paiement',
    transactionId: 'ID de transaction',
  },

  actions: {
    downloadPdf: 'Télécharger le PDF',
    markAsPaid: 'Marquer comme payé',
    refundPayment: 'Rembourser le paiement',
    retryPayment: 'Réessayer le paiement',
    viewDetails: 'Voir les détails',
    moreActions: "Plus d'actions",
  },
} as const;

export type PaymentsLabels = typeof PAYMENTS_LABELS;
