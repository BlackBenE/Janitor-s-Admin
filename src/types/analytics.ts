// Types pour la page Analytics
import { FilterState } from '@/shared/hooks';

// eslint-disable-next-line @typescript-eslint/no-empty-object-type
export interface AnalyticsFilters extends FilterState {
  // Pas de filtres traditionnels, mais plutôt des contrôles de date et type
}

// Types pour les contrôles d'analytics
export interface DateRange {
  from: Date;
  to: Date;
}

export type ReportType = 'overview' | 'users' | 'revenue' | 'activity';
export type ExportFormat = 'csv' | 'pdf' | 'excel';
export type ChartType = 'area' | 'line' | 'bar' | 'pie';

// État de la page Analytics
export interface AnalyticsState {
  tabValue: number;
  dateRange: DateRange;
  reportType: ReportType;
}

// Types de données pour les métriques
export interface UserMetrics {
  totalUsers: number;
  activeUsers: number;
  newUsers: number;
  userGrowthRate: number;
}

export interface RevenueMetrics {
  totalRevenue: number;
  monthlyRevenue: number;
  averageOrderValue: number;
  revenueGrowthRate: number;
}

export interface ActivityMetrics {
  totalBookings: number;
  completedBookings: number;
  cancelledBookings: number;
  activeServices: number;
  activeUsersGrowthRate?: number;
  bookingsGrowthRate?: number;
  cancellationRateChange?: number;
  currentCancellationRate?: number;
}

// Types pour les données de graphiques
export interface ChartDataPoint {
  [key: string]: string | number;
}

export interface UserGrowthData extends ChartDataPoint {
  month: string;
  users: number;
  revenue: number;
}

export interface BookingTrend extends ChartDataPoint {
  date: string;
  bookings: number;
}

export interface TopService extends ChartDataPoint {
  name: string;
  bookings: number;
  revenue: number;
}

export interface BookingsByStatus extends ChartDataPoint {
  status: string;
  count: number;
}

// Structure complète des données d'analytics
export interface AnalyticsData {
  userMetrics: UserMetrics;
  revenueMetrics: RevenueMetrics;
  activityMetrics: ActivityMetrics;
  userGrowthData: UserGrowthData[];
  bookingTrends: BookingTrend[];
  topServices: TopService[];
  usersByStatus: BookingsByStatus[];
}

// Props pour les composants de graphiques
export interface AnalyticsChartProps {
  title: string;
  subtitle: string;
  data: ChartDataPoint[];
  type: ChartType;
  dataKey: string;
  xAxisKey: string;
  height: number;
  loading: boolean;
}
