/**
 * Calculations spécifiques aux dépenses et profits
 * Fonctions pour calculer les dépenses, profits et leurs croissances
 */

import { Payment } from "../../../types";
import { COMMISSION_RATE, PERCENTAGE_MULTIPLIER } from "./financialConstants";

/**
 * Calcule la croissance des dépenses (basée sur les commissions)
 */
export function calculateExpenseGrowth(payments: Payment[]): number {
  const now = new Date();

  // Dépenses du mois actuel (basées sur les revenus)
  const startOfCurrentMonth = new Date(now.getFullYear(), now.getMonth(), 1);
  const currentMonthRevenue = payments
    .filter((p) => {
      if (!p.created_at) return false;
      const date = new Date(p.created_at);
      return date >= startOfCurrentMonth && p.status === "completed";
    })
    .reduce((sum, p) => sum + (p.amount || 0), 0);

  const currentMonthExpenses = currentMonthRevenue * COMMISSION_RATE;

  // Dépenses du mois précédent
  const startOfLastMonth = new Date(now.getFullYear(), now.getMonth() - 1, 1);
  const endOfLastMonth = new Date(now.getFullYear(), now.getMonth(), 0);
  const lastMonthRevenue = payments
    .filter((p) => {
      if (!p.created_at) return false;
      const date = new Date(p.created_at);
      return (
        date >= startOfLastMonth &&
        date <= endOfLastMonth &&
        p.status === "completed"
      );
    })
    .reduce((sum, p) => sum + (p.amount || 0), 0);

  const lastMonthExpenses = lastMonthRevenue * COMMISSION_RATE;

  if (lastMonthExpenses === 0) return 0;

  return (
    ((currentMonthExpenses - lastMonthExpenses) / lastMonthExpenses) *
    PERCENTAGE_MULTIPLIER
  );
}

/**
 * Calcule la croissance du profit
 */
export function calculateProfitGrowth(payments: Payment[]): number {
  const now = new Date();

  // Revenus et profits du mois actuel
  const startOfCurrentMonth = new Date(now.getFullYear(), now.getMonth(), 1);
  const currentMonthRevenue = payments
    .filter((p) => {
      if (!p.created_at) return false;
      const date = new Date(p.created_at);
      return date >= startOfCurrentMonth && p.status === "completed";
    })
    .reduce((sum, p) => sum + (p.amount || 0), 0);

  const currentMonthProfit = currentMonthRevenue * (1 - COMMISSION_RATE);

  // Revenus et profits du mois précédent
  const lastMonthTransactions = getLastMonthTransactions(payments);
  const lastMonthRevenue = lastMonthTransactions.reduce(
    (sum, p) => sum + (p.amount || 0),
    0
  );
  const lastMonthProfit = lastMonthRevenue * (1 - COMMISSION_RATE);

  if (lastMonthProfit === 0) return 0;

  return (
    ((currentMonthProfit - lastMonthProfit) / lastMonthProfit) *
    PERCENTAGE_MULTIPLIER
  );
}

/**
 * Obtient les transactions du mois précédent
 */
function getLastMonthTransactions(payments: Payment[]): Payment[] {
  const now = new Date();
  const startOfLastMonth = new Date(now.getFullYear(), now.getMonth() - 1, 1);
  const endOfLastMonth = new Date(now.getFullYear(), now.getMonth(), 0);

  return payments.filter((payment) => {
    if (!payment.created_at) return false;
    const paymentDate = new Date(payment.created_at);
    return (
      paymentDate >= startOfLastMonth &&
      paymentDate <= endOfLastMonth &&
      payment.status === "completed"
    );
  });
}

/**
 * Calcule le taux de réussite des transactions
 */
export function calculateSuccessRate(transactions: Payment[]): number {
  if (transactions.length === 0) return 0;

  const successfulTransactions = transactions.filter(
    (t) => t.status === "completed" || t.status === "success"
  ).length;

  return (successfulTransactions / transactions.length) * PERCENTAGE_MULTIPLIER;
}
