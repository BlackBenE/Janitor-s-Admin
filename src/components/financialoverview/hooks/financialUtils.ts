/**
 * Utilitaires pour les calculs financiers
 * Fonction principale qui orchestre tous les calculs
 */

import { Booking, Payment, Subscription } from "../../../types";
import { FinancialOverviewData } from "../../../types/financialoverview";
import {
  COMMISSION_RATE,
  OPERATIONAL_COST_RATE,
  GROSS_PROFIT_RATE,
  PERCENTAGE_MULTIPLIER,
} from "./financialConstants";

// Import des fonctions spécialisées
import {
  calculateMonthlyRevenue,
  calculateYearlyRevenue,
  calculateRevenueGrowth,
} from "./revenueCalculations";

import {
  calculateExpenseGrowth,
  calculateProfitGrowth,
} from "./expenseCalculations";

import {
  calculateTotalSubscriptionRevenue,
  calculateAverageSubscriptionValue,
  calculateNewSubscriptions,
  calculateChurnRate,
} from "./subscriptionCalculations";

// Export des utilitaires pour les transactions
export {
  getTodayTransactions,
  getThisWeekTransactions,
  getThisMonthTransactions,
} from "./transactionUtilities";

// Export des générateurs de données de graphiques
export { generateChartData } from "./chartDataGeneration";

// Export du calcul du taux de réussite
export { calculateSuccessRate } from "./expenseCalculations";

/**
 * Fonction principale de calcul des métriques financières
 */
export const calculateFinancialMetrics = (
  bookings: Booking[],
  payments: Payment[],
  subscriptions: Subscription[]
): FinancialOverviewData => {
  // Calculer les revenus à partir des paiements réussis
  const successfulPayments = payments.filter(
    (payment) => payment.status === "completed" || payment.status === "success"
  );

  const totalRevenue = successfulPayments.reduce(
    (sum, payment) => sum + (payment.amount || 0),
    0
  );
  const monthlyRevenue = calculateMonthlyRevenue(successfulPayments);
  const yearlyRevenue = calculateYearlyRevenue(successfulPayments);
  const revenueGrowth = calculateRevenueGrowth(successfulPayments);
  const averageTransactionValue =
    totalRevenue / Math.max(successfulPayments.length, 1);

  // Calculer les dépenses (estimées à partir des commissions et frais)
  const totalExpenses = Math.round(totalRevenue * COMMISSION_RATE);
  const monthlyExpenses = Math.round(monthlyRevenue * COMMISSION_RATE);
  const yearlyExpenses = Math.round(yearlyRevenue * COMMISSION_RATE);
  const operationalCosts = Math.round(monthlyExpenses * OPERATIONAL_COST_RATE);

  // Calculer la vraie croissance des dépenses basée sur les données
  const expenseGrowth = calculateExpenseGrowth(successfulPayments);

  // Calculer les profits
  const netProfit = totalRevenue - totalExpenses;
  const grossProfit = Math.round(totalRevenue * GROSS_PROFIT_RATE);
  const profitMargin =
    totalRevenue > 0 ? (netProfit / totalRevenue) * PERCENTAGE_MULTIPLIER : 0;
  const monthlyProfit = monthlyRevenue - monthlyExpenses;

  // Calculer la vraie croissance du profit basée sur les données historiques
  const profitGrowth = calculateProfitGrowth(successfulPayments);

  // Calculer les métriques d'abonnement
  const activeSubscriptions = subscriptions.filter(
    (sub) => sub.status === "active"
  ).length;

  return {
    revenueMetrics: {
      totalRevenue,
      monthlyRevenue,
      yearlyRevenue,
      revenueGrowth,
      averageTransactionValue,
    },
    expenseMetrics: {
      totalExpenses,
      monthlyExpenses,
      yearlyExpenses,
      expenseGrowth,
      operationalCosts,
    },
    profitMetrics: {
      netProfit,
      grossProfit,
      profitMargin,
      monthlyProfit,
      profitGrowth,
    },
    subscriptionMetrics: {
      activeSubscriptions,
      totalSubscriptionRevenue:
        calculateTotalSubscriptionRevenue(subscriptions),
      averageSubscriptionValue:
        calculateAverageSubscriptionValue(subscriptions),
      newSubscriptions: calculateNewSubscriptions(subscriptions),
      churnRate: calculateChurnRate(subscriptions),
    },
    // Propriétés optionnelles - seront assignées par le composant parent
    transactions: [],
    chartData: [],
    transactionSummary: [],
  };
};