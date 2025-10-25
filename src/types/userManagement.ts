import React from 'react';
import {
  Group as GroupIcon,
  HomeWork as PropertyIcon,
  HandymanOutlined as ServiceIcon,
  AdminPanelSettings as AdminIcon,
  DeleteOutlined as DeleteIcon,
} from '@mui/icons-material';
import { Database } from './database.types';
import { USERS_LABELS } from '@/features/users/constants';

// Types helpers pour Supabase
type Tables<T extends keyof Database['public']['Tables']> = Database['public']['Tables'][T]['Row'];
type TablesInsert<T extends keyof Database['public']['Tables']> =
  Database['public']['Tables'][T]['Insert'];
type TablesUpdate<T extends keyof Database['public']['Tables']> =
  Database['public']['Tables'][T]['Update'];

// =====================================================
// BASE TYPES FROM DATABASE
// =====================================================
export type UserProfile = Database['public']['Tables']['profiles']['Row'];
// UserSession supprimé - plus d'utilisation de user_sessions

// Type étendu avec les champs d'anonymisation (pour les interfaces)
// Note: Tous ces champs existent déjà dans UserProfile, cette interface sert juste pour la clarté sémantique
export interface UserProfileWithAnonymization extends UserProfile {
  // Tous les champs d'anonymisation sont déjà définis dans UserProfile
}

// =====================================================
// USER ROLES & CONFIGURATION
// =====================================================
export enum UserRole {
  TRAVELER = 'traveler',
  PROPERTY_OWNER = 'property_owner',
  SERVICE_PROVIDER = 'service_provider',
  ADMIN = 'admin',
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
    label: USERS_LABELS.tabs.all,
    icon: GroupIcon,
    description: USERS_LABELS.tabs.allDescription,
  },
  {
    role: UserRole.TRAVELER,
    label: USERS_LABELS.tabs.travelers,
    icon: GroupIcon,
    description: USERS_LABELS.tabs.travelersDescription,
  },
  {
    role: UserRole.PROPERTY_OWNER,
    label: USERS_LABELS.tabs.propertyOwners,
    icon: PropertyIcon,
    description: USERS_LABELS.tabs.propertyOwnersDescription,
  },
  {
    role: UserRole.SERVICE_PROVIDER,
    label: USERS_LABELS.tabs.serviceProviders,
    icon: ServiceIcon,
    description: USERS_LABELS.tabs.serviceProvidersDescription,
  },
  {
    role: UserRole.ADMIN,
    label: USERS_LABELS.tabs.admins,
    icon: AdminIcon,
    description: USERS_LABELS.tabs.adminsDescription,
  },
  {
    role: 'deleted' as any, // Type spécial pour les utilisateurs supprimés
    label: USERS_LABELS.tabs.deleted,
    icon: DeleteIcon,
    description: USERS_LABELS.tabs.deletedDescription,
  },
];

// =====================================================
// DATA TYPES FOR BUSINESS ENTITIES
// =====================================================
export type Subscription = Tables<'subscriptions'>;
export type SubscriptionInsert = TablesInsert<'subscriptions'>;
export type SubscriptionUpdate = TablesUpdate<'subscriptions'>;

export type Booking = Tables<'bookings'>;
export type BookingInsert = TablesInsert<'bookings'>;
export type BookingUpdate = TablesUpdate<'bookings'>;

export type Service = Tables<'services'>;
export type ServiceInsert = TablesInsert<'services'>;
export type ServiceUpdate = TablesUpdate<'services'>;
export type ServiceRequest = Tables<'service_requests'>;
export type Intervention = Tables<'interventions'>;

export type Payment = Tables<'payments'>;
export type Review = Tables<'reviews'>;

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
  onBulkAction: (actionType: 'delete' | 'role' | 'vip') => void;
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
  severity: 'success' | 'error' | 'warning' | 'info';
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
  lockAccount: LockAccountState;
  audit: AuditModalState;
  showNotification: (message: string, severity: NotificationState['severity']) => void;
  clearUserSelection: () => void;
}

// Interface plus flexible pour les hooks
export interface UserManagementHook {
  selectedUser: UserProfile | null;
  selectedUsers: string[];
  editForm: Partial<UserProfile>;
  filters: UserFilters;
  notification: NotificationState;
  showNotification: (message: string, severity: NotificationState['severity']) => void;
  clearUserSelection: () => void;
  toggleUserSelection: (userId: string) => void;
  setUserForEdit: (user: UserProfile) => void;
  updateEditForm: (field: keyof UserProfile, value: string | boolean | null) => void;
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

// =====================================================
// ADDITIONAL MODAL INTERFACES FOR UNIFIED HOOKS
// =====================================================

/**
 * Interface générique pour les données d'une modal
 */
export interface ModalData<T = any> {
  open: boolean;
  data: T;
}

/**
 * Interface pour les données utilisateur dans les modals
 */
export interface ModalUserData {
  userId: string;
  userName?: string;
  userData?: UserProfile;
}
