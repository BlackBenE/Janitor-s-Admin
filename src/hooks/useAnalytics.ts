import { useState, useEffect, useCallback } from "react";

export interface UserMetrics {
  totalUsers: number;
  activeUsers: number;
  newUsersThisMonth: number;
  retentionRate: number;
  growthRate: number;
}

export interface RevenueMetrics {
  totalRevenue: number;
  monthlyRevenue: number;
  averageOrderValue: number;
  revenueGrowth: number;
  vipSubscriptions: number;
}

export interface ActivityMetrics {
  totalBookings: number;
  monthlyBookings: number;
  averageBookingsPerUser: number;
  bookingGrowth: number;
  cancelationRate: number;
}

export interface AnalyticsData {
  userMetrics: UserMetrics;
  revenueMetrics: RevenueMetrics;
  activityMetrics: ActivityMetrics;
  userGrowthData: Array<{ month: string; users: number; revenue: number }>;
  topServices: Array<{ name: string; bookings: number; revenue: number }>;
  usersByRegion: Array<{ region: string; users: number; percentage: number }>;
  bookingTrends: Array<{ date: string; bookings: number; revenue: number }>;
}

export const useAnalytics = (dateRange: { from: Date; to: Date }) => {
  const [data, setData] = useState<AnalyticsData | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchAnalytics = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);

      // En production, ceci ferait des requêtes à Supabase avec des vues personnalisées
      // et des fonctions de calcul pour les métriques

      // Simuler un délai de chargement réaliste
      await new Promise((resolve) => setTimeout(resolve, 1000));

      // Mock data pour la démonstration
      const mockData: AnalyticsData = {
        userMetrics: {
          totalUsers: 2847,
          activeUsers: 1923,
          newUsersThisMonth: 245,
          retentionRate: 78.5,
          growthRate: 12.3,
        },
        revenueMetrics: {
          totalRevenue: 145780,
          monthlyRevenue: 18960,
          averageOrderValue: 85.5,
          revenueGrowth: 15.7,
          vipSubscriptions: 142,
        },
        activityMetrics: {
          totalBookings: 5674,
          monthlyBookings: 892,
          averageBookingsPerUser: 2.8,
          bookingGrowth: 8.9,
          cancelationRate: 5.2,
        },
        userGrowthData: [
          { month: "Jan", users: 1200, revenue: 12500 },
          { month: "Fév", users: 1350, revenue: 14200 },
          { month: "Mar", users: 1480, revenue: 15800 },
          { month: "Avr", users: 1620, revenue: 17100 },
          { month: "Mai", users: 1780, revenue: 18900 },
          { month: "Juin", users: 1940, revenue: 20400 },
          { month: "Juil", users: 2100, revenue: 22100 },
          { month: "Août", users: 2280, revenue: 24200 },
          { month: "Sep", users: 2450, revenue: 26500 },
        ],
        topServices: [
          { name: "Nettoyage Résidentiel", bookings: 1245, revenue: 52300 },
          { name: "Nettoyage de Bureaux", bookings: 892, revenue: 38700 },
          {
            name: "Nettoyage Post-Construction",
            bookings: 567,
            revenue: 28900,
          },
          { name: "Nettoyage de Vitres", bookings: 423, revenue: 18200 },
          { name: "Nettoyage de Fin de Bail", bookings: 334, revenue: 15600 },
        ],
        usersByRegion: [
          { region: "Île-de-France", users: 1024, percentage: 36.0 },
          { region: "Auvergne-Rhône-Alpes", users: 568, percentage: 20.0 },
          {
            region: "Provence-Alpes-Côte d'Azur",
            users: 398,
            percentage: 14.0,
          },
          { region: "Occitanie", users: 284, percentage: 10.0 },
          { region: "Nouvelle-Aquitaine", users: 227, percentage: 8.0 },
          { region: "Autres", users: 346, percentage: 12.0 },
        ],
        bookingTrends: generateBookingTrends(dateRange),
      };

      setData(mockData);
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : "Unknown error";
      setError(errorMessage);
    } finally {
      setLoading(false);
    }
  }, [dateRange]);

  // Générer des données de tendance basées sur la plage de dates
  function generateBookingTrends(range: { from: Date; to: Date }) {
    const days = Math.ceil(
      (range.to.getTime() - range.from.getTime()) / (1000 * 60 * 60 * 24)
    );
    const trends = [];

    for (let i = 0; i < days; i++) {
      const date = new Date(range.from);
      date.setDate(date.getDate() + i);

      // Simuler des données réalistes avec variation
      const baseBookings = 15 + Math.sin(i * 0.1) * 5;
      const randomVariation = (Math.random() - 0.5) * 10;
      const bookings = Math.max(0, Math.round(baseBookings + randomVariation));
      const revenue = bookings * (80 + Math.random() * 40);

      trends.push({
        date: date.toISOString().split("T")[0],
        bookings,
        revenue: Math.round(revenue),
      });
    }

    return trends;
  }

  // Calculer les métriques de comparaison (vs période précédente)
  const getComparisonMetrics = () => {
    if (!data) return null;

    return {
      userGrowth: data.userMetrics.growthRate,
      revenueGrowth: data.revenueMetrics.revenueGrowth,
      bookingGrowth: data.activityMetrics.bookingGrowth,
      retentionImprovement: 2.3, // Mock data
      conversionImprovement: 1.8, // Mock data
    };
  };

  // Obtenir les top performers
  const getTopPerformers = () => {
    if (!data) return null;

    return {
      topService: data.topServices[0],
      topRegion: data.usersByRegion[0],
      bestGrowthMonth: data.userGrowthData.reduce((prev, current) =>
        current.users > prev.users ? current : prev
      ),
    };
  };

  // Export des données analytics
  const exportAnalytics = (format: "csv" | "pdf" | "excel") => {
    if (!data) return;

    try {
      const exportData = {
        timestamp: new Date().toISOString(),
        dateRange: {
          from: dateRange.from.toISOString(),
          to: dateRange.to.toISOString(),
        },
        metrics: data,
        generated_by: "admin@example.com",
      };

      if (format === "csv") {
        const csvContent = generateCSVReport(data);
        downloadFile(
          csvContent,
          `analytics_report_${new Date().toISOString().split("T")[0]}.csv`,
          "text/csv"
        );
      } else if (format === "excel") {
        // En production, utiliser une librairie comme xlsx
        console.log("Excel export would be implemented with xlsx library");
      } else if (format === "pdf") {
        // En production, utiliser une librairie comme jsPDF
        console.log("PDF export would be implemented with jsPDF library");
      }

      return exportData;
    } catch (error) {
      throw new Error(`Erreur lors de l'export ${format}: ${error}`);
    }
  };

  // Générer un rapport CSV
  const generateCSVReport = (analyticsData: AnalyticsData): string => {
    const lines = [
      "Rapport Analytics - Aperçu Général",
      "",
      "Métriques Utilisateurs",
      "Total Utilisateurs,Utilisateurs Actifs,Nouveaux ce Mois,Taux de Rétention,Taux de Croissance",
      `${analyticsData.userMetrics.totalUsers},${analyticsData.userMetrics.activeUsers},${analyticsData.userMetrics.newUsersThisMonth},${analyticsData.userMetrics.retentionRate}%,${analyticsData.userMetrics.growthRate}%`,
      "",
      "Métriques Revenus",
      "Revenus Total,Revenus Mensuels,Panier Moyen,Croissance Revenus,Abonnements VIP",
      `${analyticsData.revenueMetrics.totalRevenue}€,${analyticsData.revenueMetrics.monthlyRevenue}€,${analyticsData.revenueMetrics.averageOrderValue}€,${analyticsData.revenueMetrics.revenueGrowth}%,${analyticsData.revenueMetrics.vipSubscriptions}`,
      "",
      "Top Services",
      "Service,Réservations,Revenus",
      ...analyticsData.topServices.map(
        (service) => `${service.name},${service.bookings},${service.revenue}€`
      ),
    ];

    return lines.join("\n");
  };

  // Télécharger un fichier
  const downloadFile = (
    content: string,
    filename: string,
    mimeType: string
  ) => {
    const blob = new Blob([content], { type: `${mimeType};charset=utf-8;` });
    const link = document.createElement("a");

    if (link.download !== undefined) {
      const url = URL.createObjectURL(blob);
      link.setAttribute("href", url);
      link.setAttribute("download", filename);
      link.style.visibility = "hidden";
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    }
  };

  useEffect(() => {
    fetchAnalytics();
  }, [dateRange.from, dateRange.to, fetchAnalytics]);

  return {
    data,
    loading,
    error,
    refetch: fetchAnalytics,
    getComparisonMetrics,
    getTopPerformers,
    exportAnalytics,
  };
};
