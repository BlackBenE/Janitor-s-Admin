import { useCallback } from 'react';
import { DateRange } from '../../../types/analytics';
import { Database } from '../../../types';
import { isActiveUser } from '@/utils/userMetrics';

type Profile = Database['public']['Tables']['profiles']['Row'];
type Booking = Database['public']['Tables']['bookings']['Row'];
type Payment = Database['public']['Tables']['payments']['Row'];
type Service = Database['public']['Tables']['services']['Row'];
type ServiceRequest = Database['public']['Tables']['service_requests']['Row'];

interface AnalyticsCalculationsInput {
  profiles: Profile[];
  bookings: Booking[];
  payments: Payment[];
  services: Service[];
  serviceRequests: ServiceRequest[];
  dateRange: DateRange;
}

/**
 * Fonctions utilitaires pour calculer les métriques analytics
 */
export const useAnalyticsCalculations = () => {
  const calculateUserMetrics = useCallback((input: AnalyticsCalculationsInput) => {
    const { profiles, dateRange } = input;

    // Utilisateurs créés dans la période actuelle (nouveaux utilisateurs)
    // EXCLUT les admins pour cohérence avec les autres métriques
    const newUsers = profiles.filter((p) => {
      if (!p.created_at || p.role === 'admin') return false;
      const createdAt = new Date(p.created_at);
      return createdAt >= dateRange.from && createdAt <= dateRange.to;
    }).length;

    // Total des utilisateurs créés jusqu'à la fin de la période sélectionnée
    // EXCLUT les admins (comptés séparément)
    const totalUsers = profiles.filter((p) => {
      if (!p.created_at || p.role === 'admin') return false;
      const createdAt = new Date(p.created_at);
      return createdAt <= dateRange.to;
    }).length;

    // UTILISATEURS ACTIFS - Utiliser la définition standardisée (voir userMetrics.ts)
    // Profil validé + compte non verrouillé + non supprimé
    const activeUsers = profiles.filter((p) => {
      if (!p.created_at) return false;
      const createdAt = new Date(p.created_at);
      return createdAt <= dateRange.to && isActiveUser(p);
    }).length;

    // Calculer la croissance des utilisateurs (période précédente vs actuelle)
    const periodDuration = dateRange.to.getTime() - dateRange.from.getTime();
    const previousPeriodStart = new Date(dateRange.from.getTime() - periodDuration);
    const previousPeriodEnd = dateRange.from;

    const previousPeriodUsers = profiles.filter((p) => {
      if (!p.created_at || p.role === 'admin') return false; // Exclure les admins
      const createdAt = new Date(p.created_at);
      return createdAt >= previousPeriodStart && createdAt < previousPeriodEnd;
    }).length;

    // Taux de croissance des utilisateurs : seulement si on a des données dans la période actuelle
    const userGrowthRate =
      newUsers === 0
        ? 0 // Pas d'activité dans la période = 0% de croissance
        : previousPeriodUsers > 0
          ? ((newUsers - previousPeriodUsers) / previousPeriodUsers) * 100
          : 100; // Première période avec activité = 100% de croissance

    return {
      totalUsers,
      activeUsers,
      newUsers,
      userGrowthRate: Number(userGrowthRate.toFixed(1)),
      previousPeriodUsers,
      periodDuration,
      previousPeriodStart,
      previousPeriodEnd,
    };
  }, []);

  const calculateRevenueMetrics = useCallback(
    (input: AnalyticsCalculationsInput, userMetrics: any) => {
      const { payments, dateRange } = input;
      const { previousPeriodStart, previousPeriodEnd } = userMetrics;

      // Calculer les métriques revenus pour la période actuelle
      const currentPeriodPayments = payments.filter((p) => {
        if (p.status !== 'paid' || !p.created_at) return false;
        const paymentDate = new Date(p.created_at);
        return paymentDate >= dateRange.from && paymentDate <= dateRange.to;
      });

      const totalRevenue = currentPeriodPayments.reduce((sum, p) => sum + p.amount, 0);

      // Revenus du mois en cours
      const currentMonth = new Date().getMonth();
      const currentYear = new Date().getFullYear();
      const monthlyRevenue = payments
        .filter((p) => {
          if (p.status !== 'paid' || !p.created_at) return false;
          const paymentDate = new Date(p.created_at);
          return (
            paymentDate.getMonth() === currentMonth && paymentDate.getFullYear() === currentYear
          );
        })
        .reduce((sum, p) => sum + p.amount, 0);

      const averageOrderValue =
        currentPeriodPayments.length > 0 ? totalRevenue / currentPeriodPayments.length : 0;

      // Calculer la croissance des revenus (période précédente vs actuelle)
      const previousPeriodPayments = payments.filter((p) => {
        if (p.status !== 'paid' || !p.created_at) return false;
        const paymentDate = new Date(p.created_at);
        return paymentDate >= previousPeriodStart && paymentDate < previousPeriodEnd;
      });

      const previousRevenue = previousPeriodPayments.reduce((sum, p) => sum + p.amount, 0);

      // Taux de croissance des revenus : seulement si on a des revenus dans la période actuelle
      const revenueGrowthRate =
        totalRevenue === 0
          ? 0 // Pas de revenus dans la période = 0% de croissance
          : previousRevenue > 0
            ? ((totalRevenue - previousRevenue) / previousRevenue) * 100
            : 100; // Première période avec revenus = 100% de croissance

      return {
        totalRevenue: Number(totalRevenue.toFixed(2)),
        monthlyRevenue: Number(monthlyRevenue.toFixed(2)),
        averageOrderValue: Number(averageOrderValue.toFixed(2)),
        revenueGrowthRate: Number(revenueGrowthRate.toFixed(1)),
      };
    },
    []
  );

  const calculateActivityMetrics = useCallback(
    (input: AnalyticsCalculationsInput, userMetrics: any) => {
      const { bookings, services, profiles, dateRange } = input;
      const { previousPeriodStart, previousPeriodEnd } = userMetrics;

      // Calculer les métriques d'activité pour la période sélectionnée
      const totalBookings = bookings.length;
      const completedBookings = bookings.filter((b) => b.status === 'completed').length;
      const cancelledBookings = bookings.filter((b) => b.status === 'cancelled').length;

      // Services actifs créés jusqu'à la fin de la période sélectionnée
      const activeServices = services.filter((s) => {
        if (!s.is_active || !s.created_at) return s.is_active;
        const createdAt = new Date(s.created_at);
        return createdAt <= dateRange.to;
      }).length;

      // Calculer les métriques de croissance d'activité (période précédente vs actuelle)
      const previousPeriodBookings = bookings.filter((b) => {
        if (!b.created_at) return false;
        const bookingDate = new Date(b.created_at);
        return bookingDate >= previousPeriodStart && bookingDate < previousPeriodEnd;
      }).length;

      const previousActiveUsers = profiles.filter((p) => {
        if (!p.created_at || p.account_locked) return false;
        const createdAt = new Date(p.created_at);
        return createdAt >= previousPeriodStart && createdAt < previousPeriodEnd;
      }).length;

      const previousCancelledBookings = bookings.filter((b) => {
        if (!b.created_at || b.status !== 'cancelled') return false;
        const bookingDate = new Date(b.created_at);
        return bookingDate >= previousPeriodStart && bookingDate < previousPeriodEnd;
      }).length;

      // Calculs des taux de croissance
      const activeUsersGrowthRate =
        previousActiveUsers > 0
          ? ((userMetrics.activeUsers - previousActiveUsers) / previousActiveUsers) * 100
          : userMetrics.activeUsers > 0
            ? 100
            : 0;

      const bookingsGrowthRate =
        previousPeriodBookings > 0
          ? ((totalBookings - previousPeriodBookings) / previousPeriodBookings) * 100
          : totalBookings > 0
            ? 100
            : 0;

      // Calcul du taux d'annulation actuel et précédent
      const currentCancellationRate =
        totalBookings > 0 ? (cancelledBookings / totalBookings) * 100 : 0;
      const previousCancellationRate =
        previousPeriodBookings > 0 ? (previousCancelledBookings / previousPeriodBookings) * 100 : 0;

      const cancellationRateChange =
        previousCancellationRate > 0 ? currentCancellationRate - previousCancellationRate : 0;

      return {
        totalBookings,
        completedBookings,
        cancelledBookings,
        activeServices,
        activeUsersGrowthRate: Number(activeUsersGrowthRate.toFixed(1)),
        bookingsGrowthRate: Number(bookingsGrowthRate.toFixed(1)),
        cancellationRateChange: Number(cancellationRateChange.toFixed(1)),
        currentCancellationRate: Number(currentCancellationRate.toFixed(1)),
      };
    },
    []
  );

  return {
    calculateUserMetrics,
    calculateRevenueMetrics,
    calculateActivityMetrics,
  };
};
