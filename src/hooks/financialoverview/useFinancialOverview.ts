import { useState, useEffect, useCallback } from "react";
import {
  FinancialOverviewData,
  FinancialOverviewState,
  FinancialFilters,
  Transaction,
  FinancialChartData,
} from "../../types/financialoverview";
import { useUINotifications } from "../shared";

export const useFinancialOverview = () => {
  const { showNotification } = useUINotifications();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // État de la page
  const [state, setState] = useState<FinancialOverviewState>({
    selectedPeriod: "30d",
    viewMode: "overview",
    filters: {
      search: "",
      dateRange: {
        from: new Date(new Date().setMonth(new Date().getMonth() - 1)),
        to: new Date(),
      },
    },
  });

  // Données financières
  const [data, setData] = useState<FinancialOverviewData>({
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
    transactions: [],
    chartData: [],
    transactionSummary: [],
  });

  // Générer des données mockées
  const generateMockData = useCallback((): FinancialOverviewData => {
    const months = ["Jan", "Fév", "Mar", "Avr", "Mai", "Jun"];

    // Transactions mockées
    const mockTransactions: Transaction[] = Array.from(
      { length: 20 },
      (_, i) => ({
        id: `txn-${i + 1}`,
        transactionId: `TXN-${String(i + 1).padStart(5, "0")}`,
        type: ["revenue", "expense", "subscription", "commission"][
          Math.floor(Math.random() * 4)
        ] as any,
        user: {
          id: `user-${i + 1}`,
          name: `Utilisateur ${i + 1}`,
          email: `user${i + 1}@example.com`,
        },
        amount: Math.floor(Math.random() * 1000) + 50,
        currency: "EUR",
        status: ["pending", "completed", "failed"][
          Math.floor(Math.random() * 3)
        ] as any,
        method: ["card", "bank_transfer", "paypal"][
          Math.floor(Math.random() * 3)
        ] as any,
        date: new Date(
          Date.now() - Math.floor(Math.random() * 30) * 24 * 60 * 60 * 1000
        ),
        description: `Transaction ${i + 1}`,
        reference: `REF-${i + 1}`,
      })
    );

    // Données de graphiques
    const chartData: FinancialChartData[] = months.map((month) => ({
      month,
      revenue: Math.floor(Math.random() * 50000) + 20000,
      expenses: Math.floor(Math.random() * 30000) + 10000,
      profit: Math.floor(Math.random() * 20000) + 5000,
      subscriptions: Math.floor(Math.random() * 200) + 50,
    }));

    return {
      revenueMetrics: {
        totalRevenue: 485000,
        monthlyRevenue: 85000,
        yearlyRevenue: 980000,
        revenueGrowth: 12.5,
        averageTransactionValue: 245.8,
      },
      expenseMetrics: {
        totalExpenses: 280000,
        monthlyExpenses: 48000,
        yearlyExpenses: 560000,
        expenseGrowth: 8.2,
        operationalCosts: 35000,
      },
      profitMetrics: {
        netProfit: 205000,
        grossProfit: 320000,
        profitMargin: 42.3,
        profitGrowth: 15.8,
        monthlyProfit: 37000,
      },
      subscriptionMetrics: {
        activeSubscriptions: 1250,
        totalSubscriptionRevenue: 125000,
        averageSubscriptionValue: 100,
        churnRate: 5.2,
        newSubscriptions: 87,
      },
      transactions: mockTransactions,
      chartData,
      transactionSummary: [
        {
          period: "Aujourd'hui",
          totalTransactions: 24,
          totalAmount: 5680,
          successRate: 94.2,
        },
        {
          period: "Cette semaine",
          totalTransactions: 168,
          totalAmount: 38900,
          successRate: 96.1,
        },
        {
          period: "Ce mois",
          totalTransactions: 654,
          totalAmount: 142300,
          successRate: 95.8,
        },
      ],
    };
  }, []);

  // Charger les données financières
  const fetchFinancialData = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);

      // TODO: Remplacer par de vrais appels API
      await new Promise((resolve) => setTimeout(resolve, 1000));

      const mockData = generateMockData();
      setData(mockData);
    } catch (err) {
      const errorMessage =
        err instanceof Error
          ? err.message
          : "Erreur lors du chargement des données financières";
      setError(errorMessage);
      showNotification(errorMessage, "error");
    } finally {
      setLoading(false);
    }
  }, [generateMockData, showNotification]);

  // Handlers pour l'état
  const updatePeriod = useCallback(
    (period: "7d" | "30d" | "90d" | "1y") => {
      setState((prev) => ({ ...prev, selectedPeriod: period }));
      fetchFinancialData();
    },
    [fetchFinancialData]
  );

  const updateViewMode = useCallback(
    (mode: "overview" | "transactions" | "analytics") => {
      setState((prev) => ({ ...prev, viewMode: mode }));
    },
    []
  );

  const updateFilters = useCallback(
    (filters: Partial<FinancialFilters>) => {
      setState((prev) => ({
        ...prev,
        filters: { ...prev.filters, ...filters },
      }));
      fetchFinancialData();
    },
    [fetchFinancialData]
  );

  // Export des données
  const exportFinancialData = useCallback(
    async (format: "csv" | "excel" | "pdf") => {
      try {
        setLoading(true);

        // TODO: Implémenter la vraie logique d'export
        await new Promise((resolve) => setTimeout(resolve, 1500));

        showNotification(
          `Données financières exportées en ${format.toUpperCase()}`,
          "success"
        );
      } catch (err) {
        const errorMessage =
          err instanceof Error ? err.message : "Erreur lors de l'export";
        showNotification(errorMessage, "error");
      } finally {
        setLoading(false);
      }
    },
    [showNotification]
  );

  // Refresh des données
  const refreshData = useCallback(() => {
    fetchFinancialData();
  }, [fetchFinancialData]);

  // Chargement initial
  useEffect(() => {
    fetchFinancialData();
  }, [fetchFinancialData]);

  return {
    // État
    state,
    data,
    loading,
    error,

    // Actions
    updatePeriod,
    updateViewMode,
    updateFilters,
    exportFinancialData,
    refreshData,

    // Données spécifiques pour faciliter l'accès
    revenueMetrics: data.revenueMetrics,
    expenseMetrics: data.expenseMetrics,
    profitMetrics: data.profitMetrics,
    subscriptionMetrics: data.subscriptionMetrics,
    transactions: data.transactions,
    chartData: data.chartData,
    transactionSummary: data.transactionSummary,
  };
};

export default useFinancialOverview;
