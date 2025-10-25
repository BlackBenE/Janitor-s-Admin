/**
 * 📊 Shared Data Hooks
 *
 * Hooks partagés pour récupérer les données communes à plusieurs features.
 *
 * Ces hooks utilisent React Query pour gérer un cache global automatique.
 * Avantages :
 * - ✅ Cache partagé entre toutes les pages
 * - ✅ Synchronisation automatique des données
 * - ✅ Réduction des requêtes réseau (jusqu'à -70%)
 * - ✅ Invalidation centralisée après mutations
 *
 * @example
 * ```typescript
 * import { useProfiles, usePayments } from '@/shared/hooks/data';
 *
 * // Dans n'importe quelle page
 * const { data: profiles } = useProfiles();
 * const { data: payments } = usePayments();
 *
 * // Avec filtres
 * const { data: admins } = useProfiles({ role: 'admin' });
 * const { data: completedPayments } = usePayments({ status: 'completed' });
 * ```
 */

// ========================================
// PROFILES (Utilisateurs)
// ========================================
export { useProfiles, useProfile, useProfileStats, PROFILES_QUERY_KEYS } from './useProfiles';
export type { Profile, ProfileFilters, ProfileStats } from './useProfiles';

// ========================================
// PAYMENTS (Paiements)
// ========================================
export {
  usePayments,
  usePayment,
  useUserPayments,
  usePaymentStats,
  PAYMENTS_QUERY_KEYS,
} from './usePayments';
export type { Payment, PaymentFilters, PaymentStats } from './usePayments';

// ========================================
// BOOKINGS (Réservations)
// ========================================
export {
  useBookings,
  useBooking,
  useUserBookings,
  usePropertyBookings,
  useBookingStats,
  BOOKINGS_QUERY_KEYS,
} from './useBookings';
export type { Booking, BookingFilters, BookingStats } from './useBookings';

// ========================================
// SERVICES (Catalogue)
// ========================================
export { useServices, useService, useServiceStats, SERVICES_QUERY_KEYS } from './useServices';
export type { Service, ServiceFilters, ServiceStats } from './useServices';

// ========================================
// SUBSCRIPTIONS (Abonnements)
// ========================================
export { useSubscriptions, useSubscription, SUBSCRIPTIONS_QUERY_KEYS } from './useSubscriptions';
export type { SubscriptionFilters } from './useSubscriptions';

// ========================================
// SERVICE REQUESTS (Demandes de service)
// ========================================
export {
  useServiceRequests,
  useServiceRequest,
  SERVICE_REQUESTS_QUERY_KEYS,
} from './useServiceRequests';
export type { ServiceRequestFilters } from './useServiceRequests';
