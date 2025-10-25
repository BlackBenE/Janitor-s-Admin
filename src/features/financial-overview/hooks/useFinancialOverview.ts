import { useMemo } from 'react';
import { useQueryClient } from '@tanstack/react-query';
import {
  usePayments,
  useBookings,
  useProfiles,
  useSubscriptions,
  useServiceRequests,
} from '@/shared/hooks';
import {
  PAYMENTS_QUERY_KEYS,
  BOOKINGS_QUERY_KEYS,
  PROFILES_QUERY_KEYS,
  SUBSCRIPTIONS_QUERY_KEYS,
  SERVICE_REQUESTS_QUERY_KEYS,
} from '@/shared/hooks/data';
import type {
  FinancialOverview,
  MonthlyFinancialData,
  RevenueByCategory,
  FinancialTransaction,
  OwnerFinancialReport,
} from '@/types/financial';
import {
  calculateFinancialOverview,
  calculateMonthlyData,
  calculateRevenueByCategory,
  fetchRecentTransactions,
  calculateOwnersReport,
} from '../services/financialService';

/**
 * Hook principal pour la page Financial Overview
 *
 * ✅ REFACTORÉ : Utilise les hooks partagés au lieu de faire des fetch directs
 *
 * Avantages :
 * - Cache global React Query partagé entre toutes les pages
 * - Pas de duplications de requêtes réseau
 * - Synchronisation automatique des données
 * - Navigation instantanée vers Analytics (cache déjà chaud)
 */
export const useFinancialOverview = () => {
  const queryClient = useQueryClient();

  // 🔥 Récupération des données via hooks partagés (cache global)
  const { data: payments = [], isLoading: paymentsLoading } = usePayments();
  const { data: bookings = [], isLoading: bookingsLoading } = useBookings();
  const { data: profiles = [], isLoading: profilesLoading } = useProfiles();
  const { data: subscriptions = [], isLoading: subscriptionsLoading } = useSubscriptions();
  const { data: serviceRequests = [], isLoading: serviceRequestsLoading } = useServiceRequests();

  const isLoading =
    paymentsLoading ||
    bookingsLoading ||
    profilesLoading ||
    subscriptionsLoading ||
    serviceRequestsLoading;

  // Debug: Vérifier ce qu'on reçoit
    payments: payments.length,
    bookings: bookings.length,
    profiles: profiles.length,
    subscriptions: subscriptions.length,
    serviceRequests: serviceRequests.length,
    isLoading,
  });

  // 🧮 Calculs des données financières (en mémoire, pas de fetch)
  const overview: FinancialOverview | null = useMemo(() => {
    if (isLoading) return null;
    const result = calculateFinancialOverview(payments, bookings, subscriptions, serviceRequests);
    return result;
  }, [payments, bookings, subscriptions, serviceRequests, isLoading]);

  const monthlyData: MonthlyFinancialData[] = useMemo(() => {
    if (isLoading) return [];
    return calculateMonthlyData(bookings, serviceRequests, subscriptions, payments);
  }, [bookings, serviceRequests, subscriptions, payments, isLoading]);

  const revenueByCategory: RevenueByCategory[] = useMemo(() => {
    if (isLoading) return [];
    return calculateRevenueByCategory(bookings, subscriptions, serviceRequests);
  }, [bookings, subscriptions, serviceRequests, isLoading]);

  const transactions: FinancialTransaction[] = useMemo(() => {
    if (isLoading) return [];
    return fetchRecentTransactions(payments);
  }, [payments, isLoading]);

  const ownersReport: OwnerFinancialReport[] = useMemo(() => {
    if (isLoading) return [];
    return calculateOwnersReport(profiles, bookings);
  }, [profiles, bookings, isLoading]);

  // ♻️ Rafraîchir toutes les données
  const refetch = async () => {
    await Promise.all([
      queryClient.invalidateQueries({ queryKey: PAYMENTS_QUERY_KEYS.all }),
      queryClient.invalidateQueries({ queryKey: BOOKINGS_QUERY_KEYS.all }),
      queryClient.invalidateQueries({ queryKey: PROFILES_QUERY_KEYS.all }),
      queryClient.invalidateQueries({ queryKey: SUBSCRIPTIONS_QUERY_KEYS.all }),
      queryClient.invalidateQueries({ queryKey: SERVICE_REQUESTS_QUERY_KEYS.all }),
    ]);
  };

  // 📤 Export des données
  const exportData = async (format?: 'csv' | 'pdf' | 'excel') => {
    // TODO: Implémenter l'export avec les données réelles
  };

  return {
    overview,
    monthlyData,
    revenueByCategory,
    transactions,
    ownersReport,
    isLoading,
    error: null, // Les erreurs sont gérées par React Query dans chaque hook
    refetch,
    exportData,
  };
};
