/**
 * Calculations spécifiques aux abonnements
 * Fonctions pour calculer les métriques d'abonnement
 */

import { Subscription } from "../../../types";
import {
  DEFAULT_SUBSCRIPTION_AMOUNT,
  PERCENTAGE_MULTIPLIER,
} from "./financialConstants";

/**
 * Calcule les revenus totaux des abonnements
 */
export function calculateTotalSubscriptionRevenue(
  subscriptions: Subscription[]
): number {
  return subscriptions
    .filter((sub) => sub.status === "active")
    .reduce((sum, sub) => sum + (sub.amount || DEFAULT_SUBSCRIPTION_AMOUNT), 0);
}

/**
 * Calcule la valeur moyenne des abonnements
 */
export function calculateAverageSubscriptionValue(
  subscriptions: Subscription[]
): number {
  const activeSubscriptions = subscriptions.filter(
    (sub) => sub.status === "active"
  );
  if (activeSubscriptions.length === 0) return 0;

  const totalValue = activeSubscriptions.reduce(
    (sum, sub) => sum + (sub.amount || DEFAULT_SUBSCRIPTION_AMOUNT),
    0
  );
  return totalValue / activeSubscriptions.length;
}

/**
 * Calcule le nombre de nouveaux abonnements ce mois
 */
export function calculateNewSubscriptions(
  subscriptions: Subscription[]
): number {
  const now = new Date();
  const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1);

  return subscriptions.filter(
    (sub) =>
      sub.created_at &&
      new Date(sub.created_at) >= startOfMonth &&
      sub.status === "active"
  ).length;
}

/**
 * Calcule le taux de résiliation (churn rate)
 */
export function calculateChurnRate(subscriptions: Subscription[]): number {
  const totalSubscriptions = subscriptions.length;
  const cancelledSubscriptions = subscriptions.filter(
    (sub) => sub.status === "cancelled"
  ).length;

  if (totalSubscriptions === 0) return 0;
  return (cancelledSubscriptions / totalSubscriptions) * PERCENTAGE_MULTIPLIER;
}
