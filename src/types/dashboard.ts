export interface DashboardStats {
  pendingValidations: number;
  pendingDiff: string;
  moderationCases: number;
  moderationDiff: string;
  activeUsers: number;
  monthlyRevenue: number;
}

export interface ChartDataPoint extends Record<string, string | number> {
  month: string;
  sales: number;
}

export interface ChartSeries {
  name: string;
  data: number[];
}

export interface DashboardState {
  stats: DashboardStats;
  recentActivityData: ChartDataPoint[];
  userGrowthData: ChartDataPoint[];
}

export interface DashboardData {
  stats: DashboardStats;
  recentActivityData: ChartDataPoint[];
  userGrowthData: ChartDataPoint[];
  recentActivities: RecentActivity[];
}

import {
  PropertyValidationStatus,
  ServiceRequestStatus,
  Tables,
} from "./supabase";

export interface RecentActivity {
  id: string;
  status:
    | PropertyValidationStatus
    | ServiceRequestStatus
    | "pending"
    | "review_required"
    | "failed";
  title: string;
  description: string;
  actionLabel?: string;
  timestamp: string;
  type:
    | "property"
    | "provider"
    | "quote"
    | "service"
    | "payment"
    | "chat_report"
    | "failed_payment"
    | "overdue_payment"
    | "pending_refund"
    | "pending_user"
    | "locked_account";
}

export type Profile = Tables<"profiles">;
export type Property = Tables<"properties">;
export type Payment = Tables<"payments">;
