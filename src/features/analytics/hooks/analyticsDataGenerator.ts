import { useCallback } from 'react';
import { useQueryClient } from '@tanstack/react-query';
import { AnalyticsData, DateRange } from '../../../types/analytics';
import { useAnalyticsQueries } from './analyticsQueries';
import { useAnalyticsCalculations } from './analyticsCalculations';
import { useAnalyticsCharts } from './analyticsCharts';
import {
  PROFILES_QUERY_KEYS,
  BOOKINGS_QUERY_KEYS,
  PAYMENTS_QUERY_KEYS,
  SERVICES_QUERY_KEYS,
  SERVICE_REQUESTS_QUERY_KEYS,
} from '@/shared/hooks/data';

/**
 * Hook principal pour récupérer et générer les données analytics depuis Supabase
 *
 */
export const useAnalyticsData = (dateRange: DateRange) => {
  const queryClient = useQueryClient();

  // Récupérer les données depuis les hooks partagés (cache global)
  const { profiles, bookings, payments, services, serviceRequests, isLoading } =
    useAnalyticsQueries(dateRange);

  // Hooks pour les calculs
  const { calculateUserMetrics, calculateRevenueMetrics, calculateActivityMetrics } =
    useAnalyticsCalculations();
  const {
    generateUserGrowthData,
    generateBookingTrends,
    generateTopServices,
    generateBookingsByStatus,
  } = useAnalyticsCharts();

  // Générer les données analytiques
  const generateAnalyticsData = useCallback((): AnalyticsData => {
    if (!profiles?.length || !bookings || !payments || !services || !serviceRequests) {
      return {
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
        usersByStatus: [],
      };
    }

    const input = {
      profiles,
      bookings,
      payments,
      services,
      serviceRequests,
      dateRange,
    };

    // Calculer les métriques
    const userMetrics = calculateUserMetrics(input);
    const revenueMetrics = calculateRevenueMetrics(input, userMetrics);
    const activityMetrics = calculateActivityMetrics(input, userMetrics);

    // Générer les données des graphiques
    const userGrowthData = generateUserGrowthData(input);
    const bookingTrends = generateBookingTrends(input);
    const topServices = generateTopServices(input);
    const usersByStatus = generateBookingsByStatus(input);

    return {
      userMetrics: {
        totalUsers: userMetrics.totalUsers,
        activeUsers: userMetrics.activeUsers,
        newUsers: userMetrics.newUsers,
        userGrowthRate: userMetrics.userGrowthRate,
      },
      revenueMetrics,
      activityMetrics,
      userGrowthData,
      bookingTrends,
      topServices,
      usersByStatus,
    };
  }, [
    profiles,
    bookings,
    payments,
    services,
    serviceRequests,
    dateRange,
    calculateUserMetrics,
    calculateRevenueMetrics,
    calculateActivityMetrics,
    generateUserGrowthData,
    generateBookingTrends,
    generateTopServices,
    generateBookingsByStatus,
  ]);

  return {
    data: generateAnalyticsData(),
    isLoading,
    refetch: () => {
      // Invalider toutes les queries des hooks partagés
      queryClient.invalidateQueries({ queryKey: PROFILES_QUERY_KEYS.all });
      queryClient.invalidateQueries({ queryKey: BOOKINGS_QUERY_KEYS.all });
      queryClient.invalidateQueries({ queryKey: PAYMENTS_QUERY_KEYS.all });
      queryClient.invalidateQueries({ queryKey: SERVICES_QUERY_KEYS.all });
      queryClient.invalidateQueries({ queryKey: SERVICE_REQUESTS_QUERY_KEYS.all });
    },
  };
};
