import { Database, Tables, TablesInsert, TablesUpdate } from "./database.types";
import React from "react";
import {
  Group as GroupIcon,
  HomeWork as PropertyIcon,
  HandymanOutlined as ServiceIcon,
  AdminPanelSettings as AdminIcon,
} from "@mui/icons-material";

// =====================================================
// BASE TYPES FROM DATABASE
// =====================================================
export type UserProfile = Database["public"]["Tables"]["profiles"]["Row"];
// UserSession supprimé - plus d'utilisation de user_sessions

// =====================================================
// USER ROLES & CONFIGURATION
// =====================================================
export enum UserRole {
  TRAVELER = "traveler",
  PROPERTY_OWNER = "property_owner",
  SERVICE_PROVIDER = "service_provider",
  ADMIN = "admin",
}

export interface UserTab {
  role: UserRole | null;
  label: string;
  icon: React.ComponentType;
  description: string;
}

// Configuration des onglets
export const USER_TABS: UserTab[] = [
  {
    role: null, // Pour afficher tous les utilisateurs
    label: "All Users",
    icon: GroupIcon,
    description: "Vue d'ensemble de tous les utilisateurs",
  },
  {
    role: UserRole.TRAVELER,
    label: "Travelers",
    icon: GroupIcon,
    description: "Gestion des comptes voyageurs et leurs réservations",
  },
  {
    role: UserRole.PROPERTY_OWNER,
    label: "Property Owners",
    icon: PropertyIcon,
    description: "Gestion des propriétaires et leurs abonnements (100€/an)",
  },
  {
    role: UserRole.SERVICE_PROVIDER,
    label: "Service Providers",
    icon: ServiceIcon,
    description: "Modération des prestataires de services et vérifications",
  },
  {
    role: UserRole.ADMIN,
    label: "Admins",
    icon: AdminIcon,
    description: "Gestion des comptes administrateurs et permissions",
  },
];

// =====================================================
// DATA TYPES FOR BUSINESS ENTITIES
// =====================================================
export type Subscription = Tables<"subscriptions">;
export type SubscriptionInsert = TablesInsert<"subscriptions">;
export type SubscriptionUpdate = TablesUpdate<"subscriptions">;

export type Booking = Tables<"bookings">;
export type BookingInsert = TablesInsert<"bookings">;
export type BookingUpdate = TablesUpdate<"bookings">;

export type Service = Tables<"services">;
export type ServiceInsert = TablesInsert<"services">;
export type ServiceUpdate = TablesUpdate<"services">;
export type ServiceRequest = Tables<"service_requests">;
export type Intervention = Tables<"interventions">;

export type Payment = Tables<"payments">;
export type Review = Tables<"reviews">;

// =====================================================
// COMPONENT PROPS INTERFACES
// =====================================================

// UserTableColumns Props
export interface UserTableColumnsProps {
  selectedUsers: string[];
  activityData: Record<string, UserActivityData> | undefined;
  currentUserRole: UserRole | null;
  currentTabRole: UserRole | null;
  onToggleUserSelection: (userId: string) => void;
  onShowUser: (user: UserProfile) => void;
  onShowAudit: (userId: string) => void;
  onPasswordReset: (userId: string) => void;
  onLockAccount: (userId: string) => void;
  onUnlockAccount: (userId: string) => void;
  onViewBookings: (userId: string, userName: string) => void;
  onManageSubscription: (userId: string, userName: string) => void;
  onManageServices: (userId: string, userName: string) => void;
  onToggleVIP: (userId: string, isVIP: boolean) => void;
  onValidateProvider: (userId: string, approved: boolean) => void;
}

// UserFilters Props
export interface UserFiltersProps {
  filters: UserFilters;
  activityData: Record<string, UserActivityData> | undefined;
  currentUserRole: UserRole | null;
  onFilterChange: (key: keyof UserFilters, value: string) => void;
  onExport: () => void;
}

// UserStatsCards Props
export interface UserStatsCardsProps {
  users: UserProfile[];
  activityData: Record<string, UserActivityData> | undefined;
  currentUserRole: UserRole | null;
  isLoading?: boolean;
}

// UserTabs Props
export interface UserTabsProps {
  currentRole: UserRole | null;
  onRoleChange: (role: UserRole | null) => void;
}

// UserActions Props
export interface UserActionsProps {
  selectedUsers: string[];
  onCreateUser: () => void;
  onBulkAction: (actionType: "delete" | "role" | "vip") => void;
}

// =====================================================
// MODAL PROPS INTERFACES
// =====================================================

// UserDetailsModal Props
export interface UserDetailsModalProps {
  open: boolean;
  onClose: () => void;
  user: UserProfile;
  editForm: Partial<UserProfile>;
  onUpdate: (field: keyof UserProfile, value: string | boolean | null) => void;
  onSave: () => void;
  onCancel: () => void;
  isEditing: boolean;
  onStartEdit: () => void;
}

// AuditModal Props
export interface AuditModalProps {
  open: boolean;
  onClose: () => void;
  userId: string | null;
  tabValue: number;
  onTabChange: (event: React.SyntheticEvent, newValue: number) => void;
}

export interface TabPanelProps {
  children?: React.ReactNode;
  index: number;
  value: number;
}

// BulkActionModal Props
export interface BulkActionModalProps {
  open: boolean;
  onClose: () => void;
  selectedUsers: string[];
  bulkAction: BulkActionState;
  onExecute: () => void;
  onRoleChange: (role: string) => void;
  onVipChange: (vip: boolean) => void;
}

// LockAccountModal Props
export interface LockAccountModalProps {
  open: boolean;
  onClose: () => void;
  userId: string | null;
  lockState: LockAccountState;
  onDurationChange: (duration: number) => void;
  onReasonChange: (reason: string) => void;
  onLock: () => void;
}

// BookingsModal Props
export interface BookingsModalProps {
  open: boolean;
  onClose: () => void;
  userId: string;
  userName: string;
}

// SubscriptionModal Props
export interface SubscriptionModalProps {
  open: boolean;
  onClose: () => void;
  userId: string;
  userName: string;
}

// ServicesModal Props
export interface ServicesModalProps {
  open: boolean;
  onClose: () => void;
  userId: string;
  userName: string;
}

// =====================================================
// HOOK INTERFACES
// =====================================================

// UseUserActions Props
export interface UseUserActionsProps {
  userManagement: UserManagementHook;
  updateUser: UpdateUserMutation;
  logAction: LogActionFunction;
  auditActions: AuditActions;
  securityActions: SecurityActions;
  getEmail: () => string | null;
  refetch?: () => void;
}

// =====================================================
// STATE & DATA INTERFACES
// =====================================================

export interface UserFilters {
  role: string;
  status: string;
  subscription: string;
  search: string;
}

export interface NotificationState {
  open: boolean;
  message: string;
  severity: "success" | "error" | "warning" | "info";
}

export interface BulkActionState {
  type: "delete" | "role" | "vip";
  roleChange: string;
  vipChange: boolean;
}

export interface LockAccountState {
  userId: string | null;
  duration: number;
  reason: string;
}

export interface AuditModalState {
  show: boolean;
  userId: string | null;
  tabValue: number;
}

export interface UserManagementModals {
  userDetails: boolean;
  createUser: boolean;
  audit: boolean;
  passwordReset: boolean;
  lockAccount: boolean;
  bulkAction: boolean;
}

export interface UserActivityData {
  totalBookings: number;
  totalSpent: number;
  lastBookingDate: string | null;
  averageRating?: number;
  totalReviews?: number;
  // Nouvelles propriétés pour les rôles spécifiques
  totalProperties?: number;
  totalEarned?: number;
  totalServices?: number;
  totalInterventions?: number;
}

export interface UserManagementState {
  selectedUser: UserProfile | null;
  selectedUsers: string[];
  editForm: Partial<UserProfile>;
  filters: UserFilters;
  modals: UserManagementModals;
  notification: NotificationState;
  bulkAction: BulkActionState;
  lockAccount: LockAccountState;
  audit: AuditModalState;
  showNotification: (
    message: string,
    severity: NotificationState["severity"]
  ) => void;
  clearUserSelection: () => void;
}

// Interface plus flexible pour les hooks
export interface UserManagementHook {
  selectedUser: UserProfile | null;
  selectedUsers: string[];
  editForm: Partial<UserProfile>;
  filters: UserFilters;
  notification: NotificationState;
  showNotification: (
    message: string,
    severity: NotificationState["severity"]
  ) => void;
  clearUserSelection: () => void;
  toggleUserSelection: (userId: string) => void;
  setUserForEdit: (user: UserProfile) => void;
  updateEditForm: (
    field: keyof UserProfile,
    value: string | boolean | null
  ) => void;
  resetEditForm: () => void;
  updateFilter: (key: keyof UserFilters, value: string) => void;
  filterUsers: (users: UserProfile[]) => UserProfile[];
  hideNotification: () => void;
}

// Types pour les hooks/mutations
export interface UpdateUserMutation {
  mutate: (
    params: {
      id: string;
      payload: Partial<UserProfile>;
    },
    options?: {
      onSuccess?: (data: UserProfile | null) => void | Promise<void>;
      onError?: (error: Error) => void;
    }
  ) => void;
  mutateAsync: (params: {
    id: string;
    payload: Partial<UserProfile>;
  }) => Promise<UserProfile | null>;
}

export interface DeleteManyUsersMutation {
  mutateAsync: (userIds: string[]) => Promise<void>;
}

export interface LogActionFunction {
  (
    actionType: string,
    userId: string,
    description: string,
    adminEmail: string,
    metadata?: Record<string, unknown>
  ): Promise<void>;
}

export interface AuditActions {
  BULK_ACTION: string;
  USER_REACTIVATED: string;
  EXPORT_DATA: string;
  USER_UPDATED: string;
  USER_SUSPENDED: string;
  USER_CREATED: string;
  PASSWORD_RESET: string;
}

export interface SecurityActions {
  unlockAccount: (
    userId: string,
    reason?: string
  ) => Promise<{
    success: boolean;
    message: string;
    userId: string;
    reason?: string;
    timestamp: string;
  }>;
  lockAccount: (
    userId: string,
    duration: number,
    reason?: string
  ) => Promise<{
    success: boolean;
    message: string;
    userId: string;
    lockedUntil: string;
    reason?: string;
    timestamp: string;
  }>;
  resetPassword: (
    userId: string,
    reason?: string
  ) => Promise<{
    success: boolean;
    message: string;
    userId: string;
    email: string;
    timestamp: string;
  }>;
  createUserWithAuth: (userData: {
    email: string;
    role: string;
    full_name?: string | null;
    phone?: string | null;
    profile_validated?: boolean;
    vip_subscription?: boolean;
  }) => Promise<{
    success: boolean;
    profile?: UserProfile;
    message?: string;
  }>;
}

// =====================================================
// USER ADDITIONAL DATA & STATISTICS
// =====================================================
export interface UserPreferences {
  notifications: boolean;
  language: string;
  timezone: string;
}

export interface UserActivity {
  lastLogin: string | null;
  totalBookings: number;
  favoriteServices: string[];
}

export interface UserStats {
  totalBookings: number;
  completedBookings: number;
  cancelledBookings: number;
  totalSpent: number;
  favoriteServices: string[];
  lastActivity: string | null;
}

export interface UserAdditionalData {
  preferences: UserPreferences;
  activity: UserActivity;
}
