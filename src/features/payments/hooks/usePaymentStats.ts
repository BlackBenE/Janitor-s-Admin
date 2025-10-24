import { useMemo } from "react";
import { PaymentWithDetails, PaymentStats } from "../../../types/payments";

import { supabase } from "@/core/config/supabase";
import { formatCurrency } from "../../../utils";

/**
 * Hook pour calculer les statistiques des paiements
 */
export const usePaymentStats = (
  payments: PaymentWithDetails[]
): PaymentStats => {
  return useMemo(() => {
    if (!payments || payments.length === 0) {
      return {
        totalPayments: 0,
        paidPayments: 0,
        pendingPayments: 0,
        refundedPayments: 0,
        failedPayments: 0,
        monthlyRevenue: 0,
        averageAmount: 0,
      };
    }

    // Calculs de base
    const totalTransactions = payments.length;
    const totalAmount = payments.reduce(
      (sum, payment) => sum + (payment.amount || 0),
      0
    );

    // Montants par statut
    const pendingPayments = payments.filter((p) => p.status === "pending");
    const paidPayments = payments.filter((p) => p.status === "paid");
    const refundedPayments = payments.filter((p) => p.status === "refunded");
    const failedPayments = payments.filter((p) => p.status === "failed");

    const pendingAmount = pendingPayments.reduce(
      (sum, payment) => sum + (payment.amount || 0),
      0
    );
    const paidAmount = paidPayments.reduce(
      (sum, payment) => sum + (payment.amount || 0),
      0
    );
    const refundedAmount = refundedPayments.reduce(
      (sum, payment) => sum + (payment.amount || 0),
      0
    );

    // Montant moyen
    const averageAmount =
      totalTransactions > 0 ? totalAmount / totalTransactions : 0;

    // Taux de succès (pourcentage de paiements réussis)
    const successRate =
      totalTransactions > 0
        ? (paidPayments.length / totalTransactions) * 100
        : 0;

    // Calcul de la croissance mensuelle (approximative)
    // Compare les 30 derniers jours aux 30 jours précédents
    const now = new Date();
    const thirtyDaysAgo = new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000);
    const sixtyDaysAgo = new Date(now.getTime() - 60 * 24 * 60 * 60 * 1000);

    const recentPayments = payments.filter(
      (p) => p.created_at && new Date(p.created_at) >= thirtyDaysAgo
    );
    const previousPeriodPayments = payments.filter(
      (p) =>
        p.created_at &&
        new Date(p.created_at) >= sixtyDaysAgo &&
        new Date(p.created_at) < thirtyDaysAgo
    );

    const recentAmount = recentPayments.reduce(
      (sum, payment) => sum + (payment.amount || 0),
      0
    );
    const previousAmount = previousPeriodPayments.reduce(
      (sum, payment) => sum + (payment.amount || 0),
      0
    );

    const monthlyGrowth =
      previousAmount > 0
        ? ((recentAmount - previousAmount) / previousAmount) * 100
        : 0;

    return {
      totalPayments: totalTransactions,
      paidPayments: paidPayments.length,
      pendingPayments: pendingPayments.length,
      refundedPayments: refundedPayments.length,
      failedPayments: failedPayments.length,
      monthlyRevenue: recentAmount,
      averageAmount,
    };
  }, [payments]);
};
