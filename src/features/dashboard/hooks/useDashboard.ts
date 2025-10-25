import { useQuery, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/core/config/supabase';
import { ChartDataPoint, DashboardStats, RecentActivity } from '@/types/dashboard';
import { useUINotifications } from '@/shared/hooks';
import { useEffect, useCallback, useMemo } from 'react';
import { fetchRecentActivities, ChartData } from './dashboardQueries';
import { useProfiles, usePayments, useBookings } from '@/shared/hooks/data';
import { calculateRevenue } from '@/core/services/financialCalculations.service';
import { ACTIVE_USER_FILTERS } from '@/utils/userMetrics';

// Query keys for cache management
const DASHBOARD_QUERY_KEYS = {
  all: ['dashboard'] as const,
  stats: () => [...DASHBOARD_QUERY_KEYS.all, 'stats'] as const,
  activities: () => [...DASHBOARD_QUERY_KEYS.all, 'activities'] as const,
  charts: () => [...DASHBOARD_QUERY_KEYS.all, 'charts'] as const,
};

export const useDashboard = () => {
  const queryClient = useQueryClient();
  const { showNotification } = useUINotifications();

  // Set up real-time subscriptions
  useEffect(() => {
    const setupSubscriptions = () => {
      const channels = [
        supabase
          .channel('properties_changes')
          .on('postgres_changes', { event: '*', schema: 'public', table: 'properties' }, () =>
            queryClient.invalidateQueries({
              queryKey: DASHBOARD_QUERY_KEYS.stats(),
            })
          ),
        supabase
          .channel('profiles_changes')
          .on('postgres_changes', { event: '*', schema: 'public', table: 'profiles' }, () =>
            queryClient.invalidateQueries({
              queryKey: DASHBOARD_QUERY_KEYS.stats(),
            })
          ),
        supabase
          .channel('payments_changes')
          .on('postgres_changes', { event: '*', schema: 'public', table: 'payments' }, () => {
            queryClient.invalidateQueries({
              queryKey: DASHBOARD_QUERY_KEYS.stats(),
            });
            queryClient.invalidateQueries({
              queryKey: DASHBOARD_QUERY_KEYS.charts(),
            });
          }),
        supabase
          .channel('service_requests_changes')
          .on('postgres_changes', { event: '*', schema: 'public', table: 'service_requests' }, () =>
            queryClient.invalidateQueries({
              queryKey: DASHBOARD_QUERY_KEYS.activities(),
            })
          ),
      ];

      channels.forEach((channel) => channel.subscribe());

      return () => {
        channels.forEach((channel) => channel.unsubscribe());
      };
    };

    return setupSubscriptions();
  }, [queryClient]);

  // ====== UTILISER LES HOOKS PARTAGÉS (cache global) ======
  const { data: profiles = [], isLoading: profilesLoading } = useProfiles();
  const { data: payments = [], isLoading: paymentsLoading } = usePayments();

  // Calculer les stats à partir des données partagées (useMemo pour performance)
  const stats = useMemo((): DashboardStats => {
    // Calculer le début du mois en cours
    const startOfCurrentMonth = new Date();
    startOfCurrentMonth.setDate(1);
    startOfCurrentMonth.setHours(0, 0, 0, 0);

    // Utilisateurs actifs (non-admins, validés, non verrouillés, non supprimés)
    const activeUsers = profiles.filter(
      (p) =>
        p.profile_validated === ACTIVE_USER_FILTERS.profile_validated &&
        p.account_locked === ACTIVE_USER_FILTERS.account_locked &&
        p.deleted_at === ACTIVE_USER_FILTERS.deleted_at &&
        p.role !== 'admin'
    ).length;

    // Revenu mensuel avec les règles de commission
    const currentMonthPayments = payments.filter((p) => {
      if (!['succeeded', 'paid'].includes(p.status || '') || !p.created_at) return false;
      const paymentDate = new Date(p.created_at);
      return paymentDate >= startOfCurrentMonth;
    });

    const monthlyRevenue = currentMonthPayments.reduce((sum, p) => {
      const paymentType = (p.payment_type as any) || 'other';
      return sum + calculateRevenue(p.amount, paymentType);
    }, 0);

    return {
      pendingValidations: 0, // À calculer via une requête spécifique properties
      pendingDiff: '',
      moderationCases: 0, // À calculer via une requête spécifique profiles
      moderationDiff: '',
      activeUsers,
      monthlyRevenue,
    };
  }, [profiles, payments]);

  // Queries pour les données spécifiques (pas disponibles dans hooks partagés)
  const {
    data: specificStats,
    isLoading: specificStatsLoading,
    isFetching: specificStatsIsFetching,
    error: specificStatsError,
  } = useQuery({
    queryKey: DASHBOARD_QUERY_KEYS.stats(),
    queryFn: async () => {
      // Récupérer uniquement les données non disponibles via hooks partagés
      const [pendingProps, moderationCases] = await Promise.all([
        supabase.from('properties').select('*', { count: 'exact' }).is('validated_at', null),
        supabase
          .from('profiles')
          .select('*', { count: 'exact' })
          .eq('role', 'service_provider')
          .eq('profile_validated', false)
          .is('deleted_at', null),
      ]);

      if (pendingProps.error) throw pendingProps.error;
      if (moderationCases.error) throw moderationCases.error;

      return {
        pendingValidations: pendingProps.count || 0,
        moderationCases: moderationCases.count || 0,
      };
    },
    staleTime: 2 * 60 * 1000, // 2 minutes
    retry: 2,
  });

  // Combiner les stats calculées avec les stats spécifiques
  const combinedStats = useMemo(
    (): DashboardStats => ({
      ...stats,
      pendingValidations: specificStats?.pendingValidations ?? 0,
      moderationCases: specificStats?.moderationCases ?? 0,
    }),
    [stats, specificStats]
  );

  const {
    data: activities,
    isLoading: activitiesLoading,
    isFetching: activitiesIsFetching,
    error: activitiesError,
  } = useQuery({
    queryKey: DASHBOARD_QUERY_KEYS.activities(),
    queryFn: fetchRecentActivities,
    staleTime: 1 * 60 * 1000, // 1 minute - activités changent plus souvent
    retry: 2,
  });

  // Calculer les données de charts à partir des hooks partagés
  const chartData = useMemo((): ChartData => {
    const endDate = new Date();
    const startDate = new Date();
    startDate.setMonth(startDate.getMonth() - 6);

    // Process data by month
    const revenueByMonth = new Map<string, number>();
    const usersByMonth = new Map<string, number>();

    // Filtrer et calculer les revenus par mois
    payments
      .filter((p) => {
        if (!['succeeded', 'paid'].includes(p.status || '') || !p.created_at) return false;
        const paymentDate = new Date(p.created_at);
        return paymentDate >= startDate && paymentDate <= endDate;
      })
      .forEach((p) => {
        if (!p.created_at) return;
        const date = new Date(p.created_at);
        const monthKey = date.toLocaleString('default', { month: 'short' });
        const paymentType = (p.payment_type as any) || 'other';
        const revenue = calculateRevenue(p.amount, paymentType);
        revenueByMonth.set(monthKey, (revenueByMonth.get(monthKey) || 0) + revenue);
      });

    // Calculer les utilisateurs validés par mois
    profiles
      .filter((p) => {
        if (!p.profile_validated || !p.created_at) return false;
        const createdAt = new Date(p.created_at);
        return createdAt >= startDate && createdAt <= endDate;
      })
      .forEach((p) => {
        if (!p.created_at) return;
        const date = new Date(p.created_at);
        const monthKey = date.toLocaleString('default', { month: 'short' });
        usersByMonth.set(monthKey, (usersByMonth.get(monthKey) || 0) + 1);
      });

    // Get last 6 months
    const months = Array.from({ length: 6 }, (_, i) => {
      const d = new Date();
      d.setMonth(d.getMonth() - i);
      return d.toLocaleString('default', { month: 'short' });
    }).reverse();

    return {
      recentActivityData: months.map((month) => ({
        month,
        sales: revenueByMonth.get(month) || 0,
      })),
      userGrowthData: months.map((month) => ({
        month,
        sales: usersByMonth.get(month) || 0,
      })),
    };
  }, [payments, profiles]);

  // Manual refresh function
  const refreshDashboard = useCallback(async () => {
    try {
      await Promise.all([
        queryClient.invalidateQueries({
          queryKey: DASHBOARD_QUERY_KEYS.stats(),
        }),
        queryClient.invalidateQueries({
          queryKey: DASHBOARD_QUERY_KEYS.activities(),
        }),
      ]);
      showNotification('Dashboard mis à jour', 'success');
    } catch (error) {
      showNotification('Erreur lors de la mise à jour', 'error');
    }
  }, [queryClient, showNotification]);

  // Détermine si on doit afficher le loading state
  const isLoading = profilesLoading || paymentsLoading || specificStatsLoading || activitiesLoading;

  // Gestion des erreurs
  const hasError = specificStatsError || activitiesError;
  const errorMessage = hasError ? 'Erreur lors du chargement des données du dashboard' : null;

  return {
    stats: combinedStats,
    recentActivities: activities || [],
    recentActivityData: chartData.recentActivityData,
    userGrowthData: chartData.userGrowthData,
    // Simple loading state comme userManagement
    loading: isLoading,
    // isFetching pour indiquer le rafraîchissement en cours
    isFetching: {
      stats: specificStatsIsFetching,
      activities: activitiesIsFetching,
      charts: false, // Calculé côté client, pas de fetching
    },
    error: errorMessage,
    chartSeries: [{ dataKey: 'sales', label: 'Actions' }],
    refreshDashboard,
  };
};
