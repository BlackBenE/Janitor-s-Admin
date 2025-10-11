import { useQuery } from "@tanstack/react-query";
import { dataProvider } from "../../../providers/dataProvider";
import { Database } from "../../../types/database.types";
import {
  UserPreferences,
  UserActivity,
  UserStats,
  UserAdditionalData,
} from "../../../types/userManagement";

type Booking = Database["public"]["Tables"]["bookings"]["Row"];
type Payment = Database["public"]["Tables"]["payments"]["Row"];

// Hook pour récupérer les données additionnelles d'un utilisateur
export const useUserAdditionalData = (userId?: string) => {
  return useQuery({
    queryKey: ["user-additional-data", userId],
    queryFn: async (): Promise<UserAdditionalData> => {
      if (!userId) {
        throw new Error("User ID is required");
      }

      // Récupération des données avec les propriétés pour les services dynamiques
      const [
        bookingsResponse,
        paymentsResponse,
        profileResponse,
        propertiesResponse,
      ] = await Promise.all([
        dataProvider.getList("bookings", {}),
        dataProvider.getList("payments", {}),
        dataProvider.getOne("profiles", userId),
        dataProvider.getList("properties", {}), // Pour récupérer les services via les propriétés
      ]);

      // Filtrer les réservations pour cet utilisateur
      const allBookings =
        bookingsResponse.success && bookingsResponse.data
          ? bookingsResponse.data
          : [];
      const userBookings = allBookings.filter(
        (booking: Booking) => booking.traveler_id === userId
      );

      const payments =
        paymentsResponse.success && paymentsResponse.data
          ? paymentsResponse.data
          : [];
      const profile =
        profileResponse.success && profileResponse.data
          ? profileResponse.data
          : null;
      const properties =
        propertiesResponse.success && propertiesResponse.data
          ? propertiesResponse.data
          : [];

      // Récupérer les services favoris DYNAMIQUEMENT via les propriétés réservées
      const serviceFrequency: Record<string, number> = {};
      userBookings.forEach((booking: Booking) => {
        // Trouver la propriété correspondante pour récupérer le service
        const property = properties.find((p) => p.id === booking.property_id);
        if (property && property.title) {
          // Utiliser le titre de la propriété comme service (plus dynamique)
          const serviceName = property.title.toLowerCase();
          serviceFrequency[serviceName] =
            (serviceFrequency[serviceName] || 0) + 1;
        }
      });

      const favoriteServices = Object.entries(serviceFrequency)
        .sort(([, a], [, b]) => b - a)
        .slice(0, 3)
        .map(([service]) => service);

      return {
        preferences: {
          notifications: true, // Valeur par défaut, pourrait être stockée dans une table user_preferences
          language: "fr", // Valeur par défaut ou depuis le profile
          timezone: "Europe/Paris", // Valeur par défaut ou depuis le profile
        },
        activity: {
          lastLogin: profile?.updated_at || null,
          totalBookings: userBookings.length,
          favoriteServices,
        },
      };
    },
    enabled: !!userId,
    staleTime: 5 * 60 * 1000, // 5 minutes
  });
};

// Hook pour récupérer les statistiques détaillées d'un utilisateur
export const useUserStats = (userId?: string) => {
  return useQuery({
    queryKey: ["user-stats", userId],
    queryFn: async (): Promise<UserStats> => {
      if (!userId) {
        throw new Error("User ID is required");
      }

      const [bookingsResponse, paymentsResponse] = await Promise.all([
        dataProvider.getList("bookings", {}),
        dataProvider.getList("payments", {}),
      ]);

      const bookings =
        bookingsResponse.success && bookingsResponse.data
          ? bookingsResponse.data
          : [];
      const payments =
        paymentsResponse.success && paymentsResponse.data
          ? paymentsResponse.data
          : [];

      // Filtrer les réservations pour cet utilisateur
      const userBookings = bookings.filter(
        (booking: Booking) => booking.traveler_id === userId
      );

      // Calculer les statistiques
      const completedBookings = userBookings.filter(
        (booking: Booking) =>
          booking.status === "completed" || booking.status === "confirmed"
      ).length;

      const cancelledBookings = userBookings.filter(
        (booking: Booking) => booking.status === "cancelled"
      ).length;

      // Calculer le montant total dépensé
      const bookingIds = userBookings.map((booking: Booking) => booking.id);
      const userPayments = payments.filter(
        (payment: Payment) =>
          bookingIds.includes(payment.booking_id || "") &&
          (payment.status === "completed" || payment.status === "success")
      );

      const totalSpent = userPayments.reduce(
        (sum: number, payment: Payment) => sum + (payment.amount || 0),
        0
      );

      // Récupérer les propriétés pour les services dynamiques dans useUserStats
      const propertiesStatsResponse = await dataProvider.getList(
        "properties",
        {}
      );
      const propertiesStats =
        propertiesStatsResponse.success && propertiesStatsResponse.data
          ? propertiesStatsResponse.data
          : [];

      // Services favoris DYNAMIQUES
      const serviceFrequency: Record<string, number> = {};
      userBookings.forEach((booking: Booking) => {
        const property = propertiesStats.find(
          (p) => p.id === booking.property_id
        );
        if (property && property.title) {
          const serviceName = property.title.toLowerCase();
          serviceFrequency[serviceName] =
            (serviceFrequency[serviceName] || 0) + 1;
        }
      });

      const favoriteServices = Object.entries(serviceFrequency)
        .sort(([, a], [, b]) => b - a)
        .slice(0, 3)
        .map(([service]) => service);

      const lastActivity =
        userBookings.length > 0
          ? userBookings.sort(
              (a: Booking, b: Booking) =>
                new Date(b.created_at || "").getTime() -
                new Date(a.created_at || "").getTime()
            )[0]?.created_at || null
          : null;

      return {
        totalBookings: userBookings.length,
        completedBookings,
        cancelledBookings,
        totalSpent,
        favoriteServices,
        lastActivity,
      };
    },
    enabled: !!userId,
    staleTime: 5 * 60 * 1000, // 5 minutes
  });
};

// Hook legacy pour compatibilité avec l'ancien code
export const useUserAdditionalDataLegacy = () => {
  const getUserAdditionalData = async (userId: string) => {
    // Cette fonction est maintenant dépréciée, utiliser useUserAdditionalData à la place
    console.warn(
      "useUserAdditionalDataLegacy.getUserAdditionalData est déprécié, utilisez useUserAdditionalData"
    );
    return { preferences: {}, activity: {} };
  };

  const getUserStats = async (userId: string) => {
    // Cette fonction est maintenant dépréciée, utiliser useUserStats à la place
    console.warn(
      "useUserAdditionalDataLegacy.getUserStats est déprécié, utilisez useUserStats"
    );
    const { data } = useUserStats(userId);
    return (
      data || {
        totalBookings: 0,
        completedBookings: 0,
        cancelledBookings: 0,
        totalSpent: 0,
        favoriteServices: [],
        lastActivity: null,
      }
    );
  };

  return {
    additionalData: {},
    loading: false,
    error: null,
    getUserAdditionalData,
    getUserStats,
  };
};
