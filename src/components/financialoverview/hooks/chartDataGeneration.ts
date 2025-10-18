/**
 * Génération des données de graphiques
 * Fonctions pour créer les données des graphiques financiers
 */

import { Payment } from "../../../types";
import { FinancialChartData } from "../../../types/financialoverview";
import { COMMISSION_RATE } from "./financialConstants";

/**
 * Génère les données pour les graphiques financiers
 */
export function generateChartData(
  payments: Payment[],
  period: "7d" | "30d" | "90d" | "1y"
): FinancialChartData[] {
  const days = getPeriodDays(period);
  const endDate = new Date();
  const startDate = new Date();
  startDate.setDate(endDate.getDate() - days);

  const chartData: FinancialChartData[] = [];

  for (let i = 0; i < days; i++) {
    const date = new Date(startDate);
    date.setDate(startDate.getDate() + i);

    const dayStart = new Date(
      date.getFullYear(),
      date.getMonth(),
      date.getDate()
    );
    const dayEnd = new Date(
      date.getFullYear(),
      date.getMonth(),
      date.getDate(),
      23,
      59,
      59
    );

    const dayPayments = payments.filter((payment) => {
      if (!payment.created_at) return false;
      const paymentDate = new Date(payment.created_at);
      return (
        paymentDate >= dayStart &&
        paymentDate <= dayEnd &&
        payment.status === "completed"
      );
    });

    const revenue = dayPayments.reduce((sum, p) => sum + (p.amount || 0), 0);
    const expenses = Math.round(revenue * COMMISSION_RATE);
    const profit = revenue - expenses;

    chartData.push({
      month: date.toISOString().split("T")[0],
      revenue,
      expenses,
      profit,
      subscriptions: dayPayments.length,
    });
  }

  return chartData;
}

/**
 * Convertit la période en nombre de jours
 */
function getPeriodDays(period: "7d" | "30d" | "90d" | "1y"): number {
  switch (period) {
    case "7d":
      return 7;
    case "30d":
      return 30;
    case "90d":
      return 90;
    case "1y":
      return 365;
    default:
      return 30;
  }
}
