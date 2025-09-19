// Types pour la page Financial Overview
import React from "react";
import { FilterState } from "../hooks/shared";

// Filtres spécifiques aux finances
export interface FinancialOverviewFilters extends FilterState {
  period: string;
}

// Filtres étendus pour la logique métier
export interface FinancialFilters {
  search: string;
  dateRange?: {
    from: Date;
    to: Date;
  };
  transactionType?: TransactionType;
  status?: TransactionStatus;
}

// Types pour les transactions
export type TransactionType =
  | "revenue"
  | "expense"
  | "subscription"
  | "commission"
  | "refund";
export type TransactionStatus =
  | "pending"
  | "completed"
  | "failed"
  | "cancelled";
export type PaymentMethod =
  | "card"
  | "bank_transfer"
  | "paypal"
  | "stripe"
  | "cash";

// Interface pour une transaction
export interface Transaction {
  id: string;
  transactionId: string;
  type: TransactionType;
  user: {
    id: string;
    name: string;
    email: string;
  };
  amount: number;
  currency: string;
  status: TransactionStatus;
  method: PaymentMethod;
  date: Date;
  description?: string;
  reference?: string;
}

// Métriques financières
export interface RevenueMetrics {
  totalRevenue: number;
  monthlyRevenue: number;
  yearlyRevenue: number;
  revenueGrowth: number;
  averageTransactionValue: number;
}

export interface ExpenseMetrics {
  totalExpenses: number;
  monthlyExpenses: number;
  yearlyExpenses: number;
  expenseGrowth: number;
  operationalCosts: number;
}

export interface ProfitMetrics {
  netProfit: number;
  grossProfit: number;
  profitMargin: number;
  profitGrowth: number;
  monthlyProfit: number;
}

export interface SubscriptionMetrics {
  activeSubscriptions: number;
  totalSubscriptionRevenue: number;
  averageSubscriptionValue: number;
  churnRate: number;
  newSubscriptions: number;
}

// Données pour les graphiques
export interface FinancialChartData {
  month: string;
  revenue: number;
  expenses: number;
  profit: number;
  subscriptions: number;
}

export interface TransactionSummary {
  period: string;
  totalTransactions: number;
  totalAmount: number;
  successRate: number;
}

// État de la page Financial Overview
export interface FinancialOverviewState {
  selectedPeriod: "7d" | "30d" | "90d" | "1y";
  viewMode: "overview" | "transactions" | "analytics";
  filters: FinancialFilters;
}

// Données complètes de la page
export interface FinancialOverviewData {
  revenueMetrics: RevenueMetrics;
  expenseMetrics: ExpenseMetrics;
  profitMetrics: ProfitMetrics;
  subscriptionMetrics: SubscriptionMetrics;
  transactions: Transaction[];
  chartData: FinancialChartData[];
  transactionSummary: TransactionSummary[];
}

// Props pour les composants
export interface FinancialMetricsCardProps {
  title: string;
  value: number;
  currency?: string;
  growth?: number;
  icon: React.ComponentType;
  trend?: "up" | "down" | "stable";
  loading?: boolean;
}

export interface FinancialChartProps {
  title: string;
  subtitle: string;
  data: FinancialChartData[];
  height?: number;
  loading?: boolean;
  type?: "area" | "line" | "bar";
}

export interface TransactionTableProps {
  transactions: Transaction[];
  loading?: boolean;
  onEdit?: (transaction: Transaction) => void;
  onDelete?: (transactionId: string) => void;
}
