import { Database } from "./database.types";

export type UserProfile = Database["public"]["Tables"]["profiles"]["Row"];

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
}
