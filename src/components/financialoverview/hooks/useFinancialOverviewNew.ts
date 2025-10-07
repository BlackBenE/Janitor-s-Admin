import { useEffect, useCallback } from "react";
import { useQueryClient } from "@tanstack/react-query";
import { useUINotifications } from "../../../hooks/shared";
import { FinancialOverviewData } from "../../../types/financialoverview";
import {
  useFinancialQueries,
  calculateFinancialMetrics,
  useFinancialState,
} from "./index";

/**
 * Hook principal pour la gestion des données financières
 * Orchestre les requêtes, calculs et état de la page
 */
export const useFinancialOverview = () => {
  const { showNotification } = useUINotifications();
  const queryClient = useQueryClient();

  // État de la page
  const {
    state,
    loading,
    error,
    updatePeriod,
    updateViewMode,
    updateFilters,
    updateSearch,
    updateDateRange,
    resetFilters,
    setLoading,
    setError,
  } = useFinancialState();

  // Requêtes de données
  const {
    bookings,
    payments,
    subscriptions,
    isLoading: queriesLoading,
    error: queriesError,
  } = useFinancialQueries(state.filters.dateRange!);

  // Debug - Afficher les données récupérées
  console.log("Debug Financial Data:", {
    bookingsCount: bookings.length,
    paymentsCount: payments.length,
    subscriptionsCount: subscriptions.length,
    sampleBooking: bookings[0],
    samplePayment: payments[0],
  });

  // Calculer les métriques à partir des données réelles avec fallback
  let financialData;
  try {
    financialData = calculateFinancialMetrics(
      bookings,
      payments,
      subscriptions
    );

    // Debug - Afficher les métriques calculées
    console.log("Métriques calculées:", {
      totalRevenue: financialData.revenueMetrics.totalRevenue,
      netProfit: financialData.profitMetrics.netProfit,
      profitGrowth: financialData.profitMetrics.profitGrowth,
      revenueGrowth: financialData.revenueMetrics.revenueGrowth,
    });
  } catch (error) {
    console.error("Erreur lors du calcul des métriques:", error);
    // Données de fallback si le calcul échoue
    financialData = getDefaultFinancialData();
  }

  // Gestion des erreurs
  useEffect(() => {
    if (queriesError) {
      const errorMessage =
        queriesError instanceof Error
          ? queriesError.message
          : "Erreur lors du chargement des données financières";

      console.error("Erreur financialoverview:", queriesError);
      // Ne pas afficher l'erreur à l'utilisateur si on a des données de fallback
      if (bookings.length === 0 && payments.length === 0) {
        setError(errorMessage);
        showNotification("Utilisation des données de démonstration", "info");
      }
    } else {
      setError(null);
    }
  }, [
    queriesError,
    setError,
    showNotification,
    bookings.length,
    payments.length,
  ]);

  // Gérer le loading
  useEffect(() => {
    setLoading(queriesLoading);
  }, [queriesLoading, setLoading]);

  // Fonction pour rafraîchir les données
  const refreshData = useCallback(() => {
    setLoading(true);
    queryClient.invalidateQueries({ queryKey: ["financial-bookings"] });
    queryClient.invalidateQueries({ queryKey: ["financial-payments"] });
    queryClient.invalidateQueries({ queryKey: ["financial-subscriptions"] });
  }, [queryClient, setLoading]);

  // Fonctions d'export (simplifiées pour le moment)
  const exportToExcel = useCallback(() => {
    showNotification("Export Excel en cours de développement", "info");
  }, [showNotification]);

  const exportToPDF = useCallback(() => {
    showNotification("Export PDF en cours de développement", "info");
  }, [showNotification]);

  // Actions pour les transactions
  const handleEditTransaction = useCallback(
    (transaction: any) => {
      showNotification(
        `Modification de la transaction ${transaction.transactionId}`,
        "info"
      );
      // TODO: Ouvrir un modal d'édition
    },
    [showNotification]
  );

  const handleDeleteTransaction = useCallback(
    (transactionId: string) => {
      showNotification(
        `Suppression de la transaction ${transactionId}`,
        "warning"
      );
      // TODO: Confirmer et supprimer la transaction
    },
    [showNotification]
  );

  const handleViewTransaction = useCallback(
    (transaction: any) => {
      showNotification(
        `Affichage des détails de ${transaction.transactionId}`,
        "info"
      );
      // TODO: Ouvrir un modal de détails
    },
    [showNotification]
  );

  return {
    // État de la page
    state,
    loading,
    error,

    // Données financières calculées
    ...financialData,

    // Actions d'état
    updatePeriod,
    updateViewMode,
    updateFilters,
    updateSearch,
    updateDateRange,
    resetFilters,
    refreshData,

    // Actions d'export
    exportToExcel,
    exportToPDF,

    // Actions de transaction
    handleEditTransaction,
    handleDeleteTransaction,
    handleViewTransaction,

    // Données brutes (pour debug ou usage avancé)
    rawData: {
      bookings,
      payments,
      subscriptions,
    },
  };
};

// Cette fonction sera remplacée par la nouvelle version plus bas

function generateDefaultTransactions() {
  const transactions = [];
  const users = [
    "Jean Dupont",
    "Marie Martin",
    "Pierre Durand",
    "Sophie Leblanc",
    "Antoine Moreau",
  ];
  const types = ["revenue", "subscription"] as const;
  const statuses = ["completed", "pending"] as const;
  const methods = ["card", "paypal", "bank_transfer"] as const;

  for (let i = 0; i < 15; i++) {
    transactions.push({
      id: `default_${i}`,
      transactionId: `TXN${String(i + 1).padStart(6, "0")}`,
      type: types[Math.floor(Math.random() * types.length)],
      user: {
        id: `user_${i}`,
        name: users[Math.floor(Math.random() * users.length)],
        email: "demo@example.com",
      },
      amount: Math.floor(Math.random() * 500) + 50,
      currency: "EUR",
      status: statuses[Math.random() > 0.1 ? 0 : 1],
      method: methods[Math.floor(Math.random() * methods.length)],
      date: new Date(
        Date.now() - Math.floor(Math.random() * 30) * 24 * 60 * 60 * 1000
      ),
      description: "Transaction de démonstration",
      reference: `REF_${i}`,
    });
  }

  return transactions;
}

function getDefaultFinancialData() {
  return {
    revenueMetrics: {
      totalRevenue: 0,
      monthlyRevenue: 0,
      yearlyRevenue: 0,
      revenueGrowth: 0,
      averageTransactionValue: 0,
    },
    expenseMetrics: {
      totalExpenses: 0,
      monthlyExpenses: 0,
      yearlyExpenses: 0,
      expenseGrowth: 0,
      operationalCosts: 0,
    },
    profitMetrics: {
      netProfit: 0,
      grossProfit: 0,
      profitMargin: 0,
      profitGrowth: 0,
      monthlyProfit: 0,
    },
    subscriptionMetrics: {
      activeSubscriptions: 0,
      totalSubscriptionRevenue: 0,
      averageSubscriptionValue: 0,
      churnRate: 0,
      newSubscriptions: 0,
    },
    transactions: generateDefaultTransactions(),
    chartData: generateDefaultChartData(),
    transactionSummary: [
      {
        period: "Aujourd'hui",
        totalTransactions: 0,
        totalAmount: 0,
        successRate: 0,
      },
      {
        period: "Cette semaine",
        totalTransactions: 0,
        totalAmount: 0,
        successRate: 0,
      },
      {
        period: "Ce mois",
        totalTransactions: 0,
        totalAmount: 0,
        successRate: 0,
      },
    ],
  };
}

function generateDefaultChartData() {
  const chartData = [];
  const months = [
    "Sep 2024",
    "Oct 2024",
    "Nov 2024",
    "Dec 2024",
    "Jan 2025",
    "Feb 2025",
  ];

  for (const month of months) {
    chartData.push({
      month,
      revenue: Math.floor(Math.random() * 30000) + 15000,
      expenses: Math.floor(Math.random() * 15000) + 8000,
      profit: Math.floor(Math.random() * 15000) + 5000,
      subscriptions: Math.floor(Math.random() * 100) + 50,
    });
  }

  return chartData;
}
