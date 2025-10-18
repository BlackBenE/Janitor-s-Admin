/**
 * Calculations spécifiques aux revenus
 * Fonctions pour calculer les revenus mensuels, annuels et la croissance
 */

import { Payment } from "../../../types";
import { PERCENTAGE_MULTIPLIER } from "./financialConstants";

/**
 * Calcule les revenus du mois en cours
 */
export function calculateMonthlyRevenue(payments: Payment[]): number {
  const now = new Date();
  const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1);

  return payments
    .filter(
      (payment) =>
        payment.status === "completed" &&
        payment.created_at &&
        new Date(payment.created_at) >= startOfMonth
    )
    .reduce((sum, payment) => sum + (payment.amount || 0), 0);
}

/**
 * Calcule les revenus de l'année en cours
 */
export function calculateYearlyRevenue(payments: Payment[]): number {
  const now = new Date();
  const startOfYear = new Date(now.getFullYear(), 0, 1);

  return payments
    .filter(
      (payment) =>
        payment.status === "completed" &&
        payment.created_at &&
        new Date(payment.created_at) >= startOfYear
    )
    .reduce((sum, payment) => sum + (payment.amount || 0), 0);
}

/**
 * Calcule la croissance des revenus (mois actuel vs mois précédent)
 */
export function calculateRevenueGrowth(payments: Payment[]): number {
  const now = new Date();

  // Revenus du mois actuel
  const startOfCurrentMonth = new Date(now.getFullYear(), now.getMonth(), 1);
  const currentMonthRevenue = payments
    .filter((p) => {
      if (!p.created_at) return false;
      const date = new Date(p.created_at);
      return date >= startOfCurrentMonth && p.status === "completed";
    })
    .reduce((sum, p) => sum + (p.amount || 0), 0);

  // Revenus du mois précédent
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

  if (lastMonthRevenue === 0) return 0;

  return (
    ((currentMonthRevenue - lastMonthRevenue) / lastMonthRevenue) *
    PERCENTAGE_MULTIPLIER
  );
}
