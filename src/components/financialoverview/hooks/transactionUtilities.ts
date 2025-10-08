/**
 * Utilitaires pour la gestion des transactions
 * Fonctions pour filtrer et traiter les transactions
 */

import { Payment } from "../../../types";

/**
 * Récupère les transactions d'aujourd'hui
 */
export function getTodayTransactions(payments: Payment[]): Payment[] {
  const today = new Date();
  const startOfDay = new Date(
    today.getFullYear(),
    today.getMonth(),
    today.getDate()
  );
  const endOfDay = new Date(
    today.getFullYear(),
    today.getMonth(),
    today.getDate(),
    23,
    59,
    59
  );

  return payments.filter((payment) => {
    if (!payment.created_at) return false;
    const paymentDate = new Date(payment.created_at);
    return paymentDate >= startOfDay && paymentDate <= endOfDay;
  });
}

/**
 * Récupère les transactions de cette semaine
 */
export function getThisWeekTransactions(payments: Payment[]): Payment[] {
  const now = new Date();
  const startOfWeek = new Date(now.setDate(now.getDate() - now.getDay()));

  return payments.filter(
    (p) => p.created_at && new Date(p.created_at) >= startOfWeek
  );
}

/**
 * Récupère les transactions de ce mois
 */
export function getThisMonthTransactions(payments: Payment[]): Payment[] {
  const now = new Date();
  const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1);

  return payments.filter((payment) => {
    if (!payment.created_at) return false;
    const paymentDate = new Date(payment.created_at);
    return paymentDate >= startOfMonth;
  });
}
