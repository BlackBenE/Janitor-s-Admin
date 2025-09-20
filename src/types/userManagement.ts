import { Database } from "./database.types";

export type UserProfile = Database["public"]["Tables"]["profiles"]["Row"];
export type UserSession = Database["public"]["Tables"]["user_sessions"]["Row"];

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
  FORCE_LOGOUT: string;
  USER_REACTIVATED: string;
  EXPORT_DATA: string;
  USER_UPDATED: string;
  USER_SUSPENDED: string;
  USER_CREATED: string;
  PASSWORD_RESET: string;
}

export interface SecurityActions {
  forceLogout: (
    userId: string,
    reason?: string
  ) => Promise<{
    success: boolean;
    message: string;
    userId: string;
    timestamp: string;
  }>;
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
  getUserSessions: (userId: string) => Promise<UserSession[]>;
  terminateSession: (
    sessionId: string,
    userId: string
  ) => Promise<{
    success: boolean;
    message: string;
    sessionId: string;
    userId: string;
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
