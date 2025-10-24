/**
 * Types pour le domaine Financial Overview
 */

export interface FinancialOverview {
  totalRevenue: number;
  totalExpenses: number;
  netProfit: number;
  activeSubscriptions: number;
  revenueGrowth: number;
  expensesGrowth: number;
  profitGrowth: number;
  subscriptionsGrowth: number;
}

export interface RevenueByCategory {
  category: string;
  amount: number;
  percentage: number;
}

export interface MonthlyFinancialData {
  month: string;
  revenue: number;
  expenses: number;
  profit: number;
}

export interface FinancialTransaction {
  id: string;
  type: 'revenue' | 'expense' | 'commission' | 'subscription';
  user_id: string;
  user_name?: string;
  amount: number;
  status: 'completed' | 'pending' | 'failed' | 'cancelled';
  payment_method: 'card' | 'bank_transfer' | 'cash' | 'other';
  created_at: string;
  description?: string;
}

export interface OwnerFinancialReport {
  owner_id: string;
  owner_name: string;
  properties_count: number;
  total_revenue: number;
  total_expenses: number;
  net_balance: number;
  commission_earned: number;
  subscription_fee: number;
}

export interface FinancialDateRange {
  from: Date;
  to: Date;
}

export interface FinancialFilters {
  dateRange: FinancialDateRange;
  transactionType?: FinancialTransaction['type'];
  status?: FinancialTransaction['status'];
  search?: string;
}

export interface FinancialStats {
  overview: FinancialOverview;
  revenueByCategory: RevenueByCategory[];
  monthlyData: MonthlyFinancialData[];
  transactions: FinancialTransaction[];
  ownersReport: OwnerFinancialReport[];
}

// Constantes de calcul
export const FINANCIAL_CONSTANTS = {
  COMMISSION_RATE: 0.2, // 20%
  ANNUAL_SUBSCRIPTION_FEE: 100, // 100€
} as const;
