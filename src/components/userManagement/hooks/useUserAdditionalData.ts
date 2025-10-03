import { useState } from "react";

// Hook simplifié pour les données additionnelles utilisateur
export const useUserAdditionalData = () => {
  const [additionalData, setAdditionalData] = useState<any>({});
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const getUserAdditionalData = async (userId: string) => {
    setLoading(true);
    setError(null);
    try {
      // TODO: Implémenter la récupération des données additionnelles depuis Supabase
      console.log("Fetching additional data for user:", userId);

      // Simulation de données pour le moment
      const mockData = {
        preferences: {
          notifications: true,
          language: "fr",
          timezone: "Europe/Paris",
        },
        activity: {
          lastLogin: "2025-10-03",
          totalBookings: 15,
          favoriteServices: ["nettoyage", "jardinage"],
        },
      };

      setAdditionalData(mockData);
    } catch (err) {
      setError("Erreur lors du chargement des données additionnelles");
      console.error("Error fetching additional data:", err);
    } finally {
      setLoading(false);
    }
  };

  const getUserStats = async (userId: string) => {
    console.log("Getting user stats for:", userId);
    // TODO: Implémenter la récupération des statistiques utilisateur
    return {
      totalBookings: 15,
      completedBookings: 12,
      cancelledBookings: 3,
      totalSpent: 450.5,
      favoriteServices: ["nettoyage", "jardinage"],
      lastActivity: "2025-10-03",
    };
  };

  return {
    additionalData,
    loading,
    error,
    getUserAdditionalData,
    getUserStats,
  };
};
