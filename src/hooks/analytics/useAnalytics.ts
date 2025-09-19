import { useState, useEffect, useCallback } from "react";
import {
  AnalyticsData,
  AnalyticsState,
  DateRange,
  ReportType,
  ExportFormat,
} from "../../types/analytics";
import { useUINotifications } from "../shared";

export const useAnalytics = () => {
  const { showNotification } = useUINotifications();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // État de base
  const [state, setState] = useState<AnalyticsState>({
    tabValue: 0,
    dateRange: {
      from: new Date(new Date().setMonth(new Date().getMonth() - 3)),
      to: new Date(),
    },
    reportType: "overview",
  });

  // Données analytics
  const [data, setData] = useState<AnalyticsData>({
    userMetrics: {
      totalUsers: 0,
      activeUsers: 0,
      newUsers: 0,
      userGrowthRate: 0,
    },
    revenueMetrics: {
      totalRevenue: 0,
      monthlyRevenue: 0,
      averageOrderValue: 0,
      revenueGrowthRate: 0,
    },
    activityMetrics: {
      totalBookings: 0,
      completedBookings: 0,
      cancelledBookings: 0,
      activeServices: 0,
    },
    userGrowthData: [],
    bookingTrends: [],
    topServices: [],
    usersByRegion: [],
  });

  // Mock data - À remplacer par de vraies données API
  const generateMockData = useCallback((): AnalyticsData => {
    const months = [
      "Janvier",
      "Février",
      "Mars",
      "Avril",
      "Mai",
      "Juin",
      "Juillet",
      "Août",
      "Septembre",
      "Octobre",
      "Novembre",
      "Décembre",
    ];

    return {
      userMetrics: {
        totalUsers: 15324,
        activeUsers: 12890,
        newUsers: 1234,
        userGrowthRate: 12.5,
      },
      revenueMetrics: {
        totalRevenue: 87500,
        monthlyRevenue: 12300,
        averageOrderValue: 125.5,
        revenueGrowthRate: 8.7,
      },
      activityMetrics: {
        totalBookings: 8932,
        completedBookings: 7845,
        cancelledBookings: 567,
        activeServices: 234,
      },
      userGrowthData: months.map((month) => ({
        month,
        users: Math.floor(Math.random() * 2000) + 1000,
        revenue: Math.floor(Math.random() * 15000) + 5000,
      })),
      bookingTrends: Array.from({ length: 30 }, (_, i) => ({
        date: new Date(
          Date.now() - (29 - i) * 24 * 60 * 60 * 1000
        ).toLocaleDateString(),
        bookings: Math.floor(Math.random() * 50) + 10,
      })),
      topServices: [
        { name: "Nettoyage", bookings: 1234, revenue: 15600 },
        { name: "Jardinage", bookings: 987, revenue: 12400 },
        { name: "Plomberie", bookings: 756, revenue: 18900 },
        { name: "Électricité", bookings: 654, revenue: 16700 },
        { name: "Peinture", bookings: 543, revenue: 13200 },
      ],
      usersByRegion: [
        { region: "Île-de-France", users: 4532 },
        { region: "Rhône-Alpes", users: 2341 },
        { region: "Provence-Alpes-Côte d'Azur", users: 1987 },
        { region: "Nouvelle-Aquitaine", users: 1654 },
        { region: "Occitanie", users: 1432 },
      ],
    };
  }, []);

  // Charger les données
  const fetchAnalyticsData = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);

      // TODO: Remplacer par un vrai appel API
      await new Promise((resolve) => setTimeout(resolve, 1000));

      const mockData = generateMockData();
      setData(mockData);
    } catch (err) {
      const errorMessage =
        err instanceof Error
          ? err.message
          : "Erreur lors du chargement des données";
      setError(errorMessage);
      showNotification(errorMessage, "error");
    } finally {
      setLoading(false);
    }
  }, [generateMockData, showNotification]);

  // Handlers pour l'état
  const handleTabChange = useCallback((newValue: number) => {
    setState((prev) => ({ ...prev, tabValue: newValue }));
  }, []);

  const handleDateRangeChange = useCallback(
    (dateRange: DateRange) => {
      setState((prev) => ({ ...prev, dateRange }));
      // Recharger les données avec la nouvelle plage de dates
      fetchAnalyticsData();
    },
    [fetchAnalyticsData]
  );

  const handleReportTypeChange = useCallback(
    (reportType: ReportType) => {
      setState((prev) => ({ ...prev, reportType }));
      // Recharger les données avec le nouveau type de rapport
      fetchAnalyticsData();
    },
    [fetchAnalyticsData]
  );

  // Export des données
  const exportData = useCallback(
    async (format: ExportFormat) => {
      try {
        setLoading(true);

        // TODO: Implémenter la vraie logique d'export
        await new Promise((resolve) => setTimeout(resolve, 1500));

        showNotification(
          `Données exportées en ${format.toUpperCase()}`,
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
    fetchAnalyticsData();
  }, [fetchAnalyticsData]);

  // Chargement initial
  useEffect(() => {
    fetchAnalyticsData();
  }, [fetchAnalyticsData]);

  return {
    // État
    state,
    data,
    loading,
    error,

    // Actions
    handleTabChange,
    handleDateRangeChange,
    handleReportTypeChange,
    exportData,
    refreshData,

    // Données spécifiques pour faciliter l'accès
    userMetrics: data.userMetrics,
    revenueMetrics: data.revenueMetrics,
    activityMetrics: data.activityMetrics,
    chartData: {
      userGrowth: data.userGrowthData,
      bookingTrends: data.bookingTrends,
      topServices: data.topServices,
      usersByRegion: data.usersByRegion,
    },
  };
};

export default useAnalytics;
