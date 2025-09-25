import { Tables } from "./database.types";

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
}

export type Profile = Tables<"profiles">;
export type Property = Tables<"properties">;
export type Payment = Tables<"payments">;
