import { useState } from 'react';
import type {
  FinancialOverview,
  MonthlyFinancialData,
  RevenueByCategory,
  FinancialTransaction,
  OwnerFinancialReport,
} from '@/types/financial';

/**
 * Hook principal pour la page Financial Overview
 * Pour l'instant avec des données mockées
 */
export const useFinancialOverview = () => {
  // Données mockées pour commencer
  const [overview] = useState<FinancialOverview>({
    totalRevenue: 125000,
    totalExpenses: 45000,
    netProfit: 80000,
    activeSubscriptions: 150,
    revenueGrowth: 15.5,
    expensesGrowth: 8.2,
    profitGrowth: 20.1,
    subscriptionsGrowth: 5.5,
  });

  const [monthlyData] = useState<MonthlyFinancialData[]>([
    { month: 'Jan', revenue: 15000, expenses: 5000, profit: 10000 },
    { month: 'Fév', revenue: 18000, expenses: 6000, profit: 12000 },
    { month: 'Mar', revenue: 22000, expenses: 7000, profit: 15000 },
    { month: 'Avr', revenue: 20000, expenses: 6500, profit: 13500 },
    { month: 'Mai', revenue: 25000, expenses: 8000, profit: 17000 },
    { month: 'Jun', revenue: 25000, expenses: 7500, profit: 17500 },
  ]);

  const [revenueByCategory] = useState<RevenueByCategory[]>([
    { category: 'Locations', amount: 50000, percentage: 40 },
    { category: 'Abonnements', amount: 15000, percentage: 12 },
    { category: 'Services VIP', amount: 35000, percentage: 28 },
    { category: 'Prestations', amount: 25000, percentage: 20 },
  ]);

  const [transactions] = useState<FinancialTransaction[]>([
    {
      id: 'TXN-001',
      type: 'revenue',
      user_id: 'user-1',
      user_name: 'Jean Dupont',
      amount: 1500,
      status: 'completed',
      payment_method: 'card',
      created_at: '2024-10-20T10:30:00Z',
      description: 'Location appartement Paris 15e',
    },
    {
      id: 'TXN-002',
      type: 'subscription',
      user_id: 'user-2',
      user_name: 'Marie Martin',
      amount: 100,
      status: 'completed',
      payment_method: 'bank_transfer',
      created_at: '2024-10-19T14:20:00Z',
      description: 'Abonnement annuel',
    },
    {
      id: 'TXN-003',
      type: 'expense',
      user_id: 'user-3',
      user_name: 'Service Nettoyage Pro',
      amount: 250,
      status: 'completed',
      payment_method: 'bank_transfer',
      created_at: '2024-10-18T09:15:00Z',
      description: 'Prestation de ménage',
    },
    {
      id: 'TXN-004',
      type: 'commission',
      user_id: 'user-1',
      user_name: 'Jean Dupont',
      amount: 300,
      status: 'completed',
      payment_method: 'card',
      created_at: '2024-10-17T16:45:00Z',
      description: 'Commission 20% sur location',
    },
    {
      id: 'TXN-005',
      type: 'revenue',
      user_id: 'user-4',
      user_name: 'Sophie Bernard',
      amount: 2000,
      status: 'pending',
      payment_method: 'card',
      created_at: '2024-10-16T11:30:00Z',
      description: 'Location appartement Paris 8e',
    },
  ]);

  const [ownersReport] = useState<OwnerFinancialReport[]>([
    {
      owner_id: 'owner-1',
      owner_name: 'Jean Dupont',
      properties_count: 3,
      total_revenue: 15000,
      total_expenses: 3500,
      net_balance: 11500,
      commission_earned: 3000,
      subscription_fee: 100,
    },
    {
      owner_id: 'owner-2',
      owner_name: 'Marie Martin',
      properties_count: 5,
      total_revenue: 28000,
      total_expenses: 6200,
      net_balance: 21800,
      commission_earned: 5600,
      subscription_fee: 100,
    },
    {
      owner_id: 'owner-3',
      owner_name: 'Sophie Bernard',
      properties_count: 2,
      total_revenue: 12000,
      total_expenses: 2800,
      net_balance: 9200,
      commission_earned: 2400,
      subscription_fee: 100,
    },
    {
      owner_id: 'owner-4',
      owner_name: 'Pierre Leroy',
      properties_count: 4,
      total_revenue: 22000,
      total_expenses: 5100,
      net_balance: 16900,
      commission_earned: 4400,
      subscription_fee: 100,
    },
  ]);

  const [isLoading] = useState(false);

  const refetch = async () => {
    console.log('Refresh financial data');
    // TODO: Implémenter l'appel API
  };

  const exportData = async (format?: 'csv' | 'pdf' | 'excel') => {
    console.log(`Export financial data as ${format || 'csv'}`);
    // TODO: Implémenter l'export
  };

  return {
    overview,
    monthlyData,
    revenueByCategory,
    transactions,
    ownersReport,
    isLoading,
    refetch,
    exportData,
  };
};
