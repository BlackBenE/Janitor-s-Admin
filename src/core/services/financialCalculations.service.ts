/**
 * Service de calculs financiers pour Paris Janitor
 *
 * Centralise toutes les règles de calcul financier selon les spécifications :
 * - Commission PJ : 20% du prix de la nuitée (booking)
 * - Abonnement annuel : 100€ / propriétaire
 * - Revenus PJ = (Total locations × 20%) + (Abonnements × 100€)
 * - Dépenses PJ = Paiements prestataires + frais fixes
 * - Bénéfice net = Revenus PJ – Dépenses PJ
 */

import { FINANCIAL_CONSTANTS } from '@/types/financial';

export type PaymentType = 'booking' | 'subscription' | 'service' | 'other';

/**
 * Calcule le revenu Paris Janitor selon le type de paiement
 * @param amount - Montant du paiement
 * @param paymentType - Type de paiement (booking, subscription, etc.)
 * @returns Revenu pour Paris Janitor
 */
export const calculateRevenue = (amount: number, paymentType: PaymentType): number => {
  switch (paymentType) {
    case 'booking':
      // Commission de 20% sur les réservations/locations
      return amount * FINANCIAL_CONSTANTS.COMMISSION_RATE;

    case 'subscription':
      // 100% du montant pour les abonnements (100€/an)
      return amount;

    case 'service':
      // 100% du montant pour les services (pas de commission)
      return amount;

    case 'other':
    default:
      // Par défaut, commission de 20%
      return amount * FINANCIAL_CONSTANTS.COMMISSION_RATE;
  }
};

/**
 * Calcule le revenu total à partir d'une liste de paiements
 * @param payments - Liste des paiements avec amount et payment_type
 * @returns Revenu total calculé
 */
export const calculateTotalRevenue = (
  payments: Array<{ amount: number; payment_type: PaymentType }>
): number => {
  return payments.reduce((sum, payment) => {
    const amount = Number(payment.amount) || 0;
    return sum + calculateRevenue(amount, payment.payment_type);
  }, 0);
};

/**
 * Calcule le bénéfice net
 * @param totalRevenue - Revenus totaux
 * @param totalExpenses - Dépenses totales
 * @returns Bénéfice net (revenus - dépenses)
 */
export const calculateNetProfit = (totalRevenue: number, totalExpenses: number): number => {
  return totalRevenue - totalExpenses;
};

/**
 * Calcule le montant de la commission pour un booking
 * @param bookingAmount - Montant de la réservation
 * @returns Montant de la commission (20%)
 */
export const calculateBookingCommission = (bookingAmount: number): number => {
  return bookingAmount * FINANCIAL_CONSTANTS.COMMISSION_RATE;
};

/**
 * Calcule le revenu annuel des abonnements
 * @param numberOfSubscribers - Nombre de propriétaires abonnés
 * @returns Revenu total des abonnements
 */
export const calculateSubscriptionRevenue = (numberOfSubscribers: number): number => {
  return numberOfSubscribers * FINANCIAL_CONSTANTS.ANNUAL_SUBSCRIPTION_FEE;
};

/**
 * Calcule le taux de croissance entre deux périodes
 * @param current - Valeur actuelle
 * @param previous - Valeur précédente
 * @returns Taux de croissance en pourcentage
 */
export const calculateGrowthRate = (current: number, previous: number): number => {
  if (previous === 0) return current > 0 ? 100 : 0;
  return ((current - previous) / previous) * 100;
};

/**
 * Vérifie si un montant correspond au tarif d'abonnement standard
 * @param amount - Montant à vérifier
 * @returns true si c'est un abonnement standard
 */
export const isStandardSubscription = (amount: number): boolean => {
  return amount === FINANCIAL_CONSTANTS.ANNUAL_SUBSCRIPTION_FEE;
};
