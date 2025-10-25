/**
 * Service pour calculer les données financières
 *
 * Il reçoit les données en paramètres et fait uniquement les calculs
 *
 * Les données sont récupérées via les hooks partagés :
 * - usePayments() → payments
 * - useBookings() → bookings
 * - useProfiles() → profiles
 * - etc.
 */

import type {
  FinancialOverview,
  MonthlyFinancialData,
  RevenueByCategory,
  FinancialTransaction,
  OwnerFinancialReport,
} from '@/types/financial';

const COMMISSION_RATE = 0.2; // 20%
const SUBSCRIPTION_FEE = 100; // 100€

/**
 * Calculer l'overview financier global
 * @param payments - Tous les paiements (depuis usePayments)
 * @param bookings - Toutes les réservations (depuis useBookings)
 * @param subscriptions - Tous les abonnements actifs
 * @param serviceRequests - Toutes les demandes de service complétées
 */
export const calculateFinancialOverview = (
  payments: any[] = [],
  bookings: any[] = [],
  subscriptions: any[] = [],
  serviceRequests: any[] = []
): FinancialOverview => {
  // Filtrer uniquement les paiements complétés (succeeded ou paid)
  const succeededPayments = payments.filter((p) => ['succeeded', 'paid'].includes(p.status || ''));

  // Filtrer uniquement les bookings payés
  const paidBookings = bookings.filter((b) => b.payment_status === 'paid');

  // Filtrer uniquement les abonnements actifs
  const activeSubscriptions = subscriptions.filter((s) => s.status === 'active');

  // Filtrer uniquement les service requests complétés
  const completedServices = serviceRequests.filter((sr) => sr.status === 'completed');

  // Calculer les revenus totaux
  // 1. Commissions sur les bookings
  const bookingRevenue = paidBookings.reduce(
    (sum: number, booking: any) => sum + (booking.commission_amount || 0),
    0
  );

  // 2. Revenus des abonnements
  const subscriptionRevenue = activeSubscriptions.reduce(
    (sum: number, sub: any) => sum + (sub.amount || 0),
    0
  );

  // 3. Revenus des prestations
  const serviceRevenue = completedServices.reduce(
    (sum: number, service: any) => sum + (service.total_amount || 0),
    0
  );

  const totalRevenue = bookingRevenue + subscriptionRevenue + serviceRevenue;

  // Calculer les dépenses
  // 1. Paiements aux prestataires (85% du total_amount des service_requests)
  const providerPayments = serviceRevenue * 0.85;

  // 2. Remboursements aux clients
  const refunds = succeededPayments
    .filter((p: any) => p.payment_type === 'refund')
    .reduce((sum: number, p: any) => sum + (p.amount || 0), 0);

  // 3. Paiements directs aux prestataires
  const directProviderPayments = succeededPayments
    .filter((p: any) => p.payment_type === 'provider_payment')
    .reduce((sum: number, p: any) => sum + (p.amount || 0), 0);

  // Total des dépenses
  const totalExpenses = providerPayments + refunds + directProviderPayments;

  // Bénéfice net
  const netProfit = totalRevenue - totalExpenses;

  // TODO: Calculer les croissances (comparer avec le mois précédent)
  const revenueGrowth = 15.5;
  const expensesGrowth = 8.2;
  const profitGrowth = 20.1;
  const subscriptionsGrowth = 5.5;

  return {
    totalRevenue,
    totalExpenses,
    netProfit,
    activeSubscriptions: activeSubscriptions.length,
    revenueGrowth,
    expensesGrowth,
    profitGrowth,
    subscriptionsGrowth,
  };
};

/**
 * Calculer les données mensuelles
 * @param bookings - Toutes les réservations (depuis useBookings)
 * @param serviceRequests - Toutes les demandes de service
 * @param subscriptions - Tous les abonnements
 * @param payments - Tous les paiements
 */
export const calculateMonthlyData = (
  bookings: any[] = [],
  serviceRequests: any[] = [],
  subscriptions: any[] = [],
  payments: any[] = []
): MonthlyFinancialData[] => {
  // Filtrer les 6 derniers mois
  const sixMonthsAgo = new Date();
  sixMonthsAgo.setMonth(sixMonthsAgo.getMonth() - 6);

  const recentBookings = bookings.filter(
    (b) => b.payment_status === 'paid' && new Date(b.created_at || '') >= sixMonthsAgo
  );

  const recentServices = serviceRequests.filter(
    (sr) => sr.status === 'completed' && new Date(sr.created_at || '') >= sixMonthsAgo
  );

  const recentSubscriptions = subscriptions.filter(
    (s) => s.status === 'active' && new Date(s.created_at || '') >= sixMonthsAgo
  );

  const recentPayments = payments.filter(
    (p) =>
      ['succeeded', 'paid'].includes(p.status || '') &&
      ['provider_payment', 'refund'].includes(p.payment_type) &&
      new Date(p.created_at || '') >= sixMonthsAgo
  );

  // Grouper par mois
  const monthlyMap = new Map<string, { revenue: number; expenses: number }>();

  // Commissions bookings
  recentBookings.forEach((booking: any) => {
    const month = new Date(booking.created_at || '').toLocaleDateString('fr-FR', {
      month: 'short',
    });
    const current = monthlyMap.get(month) || { revenue: 0, expenses: 0 };
    current.revenue += booking.commission_amount || 0;
    monthlyMap.set(month, current);
  });

  // Revenus des prestations
  recentServices.forEach((service: any) => {
    const month = new Date(service.created_at || '').toLocaleDateString('fr-FR', {
      month: 'short',
    });
    const current = monthlyMap.get(month) || { revenue: 0, expenses: 0 };
    current.revenue += service.total_amount;
    current.expenses += service.total_amount * 0.85;
    monthlyMap.set(month, current);
  });

  // Revenus des abonnements
  recentSubscriptions.forEach((sub: any) => {
    const month = new Date(sub.created_at || '').toLocaleDateString('fr-FR', { month: 'short' });
    const current = monthlyMap.get(month) || { revenue: 0, expenses: 0 };
    current.revenue += sub.amount || 0;
    monthlyMap.set(month, current);
  });

  // Dépenses supplémentaires
  recentPayments.forEach((payment: any) => {
    const month = new Date(payment.created_at || '').toLocaleDateString('fr-FR', {
      month: 'short',
    });
    const current = monthlyMap.get(month) || { revenue: 0, expenses: 0 };
    current.expenses += payment.amount || 0;
    monthlyMap.set(month, current);
  });

  // Convertir en tableau
  const monthlyData: MonthlyFinancialData[] = [];
  monthlyMap.forEach((value, month) => {
    monthlyData.push({
      month,
      revenue: value.revenue,
      expenses: value.expenses,
      profit: value.revenue - value.expenses,
    });
  });

  return monthlyData.slice(0, 6);
};

/**
 * Calculer la répartition des revenus par catégorie
 * @param bookings - Toutes les réservations payées
 * @param subscriptions - Tous les abonnements actifs
 * @param serviceRequests - Toutes les demandes de service avec services liés
 */
export const calculateRevenueByCategory = (
  bookings: any[] = [],
  subscriptions: any[] = [],
  serviceRequests: any[] = []
): RevenueByCategory[] => {
  // 1. Revenus des locations (commissions sur bookings)
  const paidBookings = bookings.filter((b) => b.payment_status === 'paid');
  const locationsRevenue = paidBookings.reduce(
    (sum: number, b: any) => sum + (b.commission_amount || 0),
    0
  );

  // 2. Revenus des abonnements
  const activeSubscriptions = subscriptions.filter((s) => s.status === 'active');
  const subscriptionsRevenue = activeSubscriptions.reduce(
    (sum: number, sub: any) => sum + (sub.amount || 0),
    0
  );

  // 3. Services VIP et prestations normales
  const completedServices = serviceRequests.filter((sr) => sr.status === 'completed');

  const servicesVipRevenue = completedServices
    .filter((sr: any) => sr.service?.is_vip_only === true)
    .reduce((sum: number, sr: any) => sum + (sr.total_amount || 0), 0);

  const prestationsRevenue = completedServices
    .filter((sr: any) => sr.service?.is_vip_only !== true)
    .reduce((sum: number, sr: any) => sum + (sr.total_amount || 0), 0);

  const total = locationsRevenue + subscriptionsRevenue + servicesVipRevenue + prestationsRevenue;

  return [
    {
      category: 'Locations',
      amount: locationsRevenue,
      percentage: total > 0 ? Math.round((locationsRevenue / total) * 100) : 0,
    },
    {
      category: 'Abonnements',
      amount: subscriptionsRevenue,
      percentage: total > 0 ? Math.round((subscriptionsRevenue / total) * 100) : 0,
    },
    {
      category: 'Services VIP',
      amount: servicesVipRevenue,
      percentage: total > 0 ? Math.round((servicesVipRevenue / total) * 100) : 0,
    },
    {
      category: 'Prestations',
      amount: prestationsRevenue,
      percentage: total > 0 ? Math.round((prestationsRevenue / total) * 100) : 0,
    },
  ];
};

/**
 * Récupérer les transactions récentes
 * @param payments - Tous les paiements (depuis usePayments)
 */
export const fetchRecentTransactions = (payments: any[] = []): FinancialTransaction[] => {
  return payments
    .slice(0, 50)
    .sort((a, b) => new Date(b.created_at || '').getTime() - new Date(a.created_at || '').getTime())
    .map((payment: any) => ({
      id: payment.id,
      type: mapPaymentTypeToTransactionType(payment.payment_type),
      user_id: payment.payer_id,
      user_name: payment.payer?.full_name || payment.payer?.email || 'Utilisateur inconnu',
      amount: payment.amount,
      status: mapPaymentStatusToTransactionStatus(payment.status),
      payment_method: payment.stripe_payment_intent_id ? 'card' : 'bank_transfer',
      created_at: payment.created_at || new Date().toISOString(),
      description: getPaymentDescription(
        payment.payment_type,
        payment.booking_id,
        payment.service_request_id
      ),
    }));
};

/**
 * Calculer le rapport par propriétaire
 * @param profiles - Tous les profils (depuis useProfiles)
 * @param bookings - Toutes les réservations (depuis useBookings)
 */
export const calculateOwnersReport = (
  profiles: any[] = [],
  bookings: any[] = []
): OwnerFinancialReport[] => {
  // Filtrer uniquement les propriétaires non-anonymisés
  const owners = profiles.filter((p) => p.role === 'property_owner' && !p.anonymized_at);

  if (owners.length === 0) {
    console.warn('No owners found in profiles');
    return [];
  }

  const ownersReport: OwnerFinancialReport[] = [];

  for (const owner of owners) {
    const propertyIds = owner.properties?.map((p: any) => p.id) || [];

    // Ignorer les propriétaires sans propriétés
    if (propertyIds.length === 0) {
      continue;
    }

    // Filtrer les bookings pour les propriétés de ce propriétaire
    const ownerBookings = bookings.filter(
      (b) => propertyIds.includes(b.property_id) && b.payment_status === 'paid'
    );

    const totalRevenue = ownerBookings.reduce(
      (sum: number, b: any) => sum + (b.total_amount || 0),
      0
    );
    const commissionEarned = ownerBookings.reduce(
      (sum: number, b: any) => sum + (b.commission_amount || 0),
      0
    );

    // Note: Les dépenses réelles du propriétaire ne sont pas trackées dans Supabase
    const totalExpenses = 0;

    // Revenus nets = Ce que le propriétaire reçoit vraiment (Revenue - Commission PJ)
    const netBalance = totalRevenue - commissionEarned;

    ownersReport.push({
      owner_id: owner.id,
      owner_name: owner.full_name || owner.email,
      properties_count: owner.properties?.length || 0,
      total_revenue: totalRevenue,
      total_expenses: totalExpenses,
      net_balance: netBalance,
      commission_earned: commissionEarned,
      subscription_fee: SUBSCRIPTION_FEE,
    });
  }

  // Trier par revenus décroissants
  return ownersReport.sort((a, b) => b.total_revenue - a.total_revenue);
};

// Helpers
function mapPaymentTypeToTransactionType(paymentType: string): FinancialTransaction['type'] {
  switch (paymentType) {
    case 'booking':
      return 'revenue';
    case 'provider_payment':
      return 'expense';
    case 'subscription':
      return 'subscription';
    case 'commission':
      return 'commission';
    default:
      return 'revenue';
  }
}

function mapPaymentStatusToTransactionStatus(
  status: string | null
): FinancialTransaction['status'] {
  switch (status) {
    case 'succeeded':
    case 'paid':
      return 'completed';
    case 'pending':
    case 'processing':
      return 'pending';
    case 'failed':
      return 'failed';
    case 'cancelled':
    case 'refunded':
      return 'cancelled';
    default:
      return 'pending';
  }
}

function getPaymentDescription(
  paymentType: string,
  bookingId?: string | null,
  serviceRequestId?: string | null
): string {
  switch (paymentType) {
    case 'booking':
      return bookingId
        ? `Paiement réservation ${bookingId.substring(0, 8)}`
        : 'Paiement de réservation';
    case 'provider_payment':
      return 'Paiement prestataire';
    case 'subscription':
      return 'Abonnement annuel';
    case 'commission':
      return 'Commission Paris Janitor';
    case 'refund':
      return bookingId ? `Remboursement ${bookingId.substring(0, 8)}` : 'Remboursement';
    default:
      return serviceRequestId
        ? `Transaction service ${serviceRequestId.substring(0, 8)}`
        : 'Transaction';
  }
}
