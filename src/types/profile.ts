// Types pour la page Profile
import { FilterState } from '@/shared/hooks';

// eslint-disable-next-line @typescript-eslint/no-empty-object-type
export interface ProfileFilters extends FilterState {
  // Pas de filtres nécessaires pour la page profil
}

export interface ProfileFormData {
  full_name: string;
  phone: string;
}

export interface ProfileState {
  formData: ProfileFormData;
  isLoading: boolean;
  isEditMode: boolean;
}

export interface SecuritySettings {
  passwordLastUpdated: string | null;
  twoFactorEnabled: boolean;
  lastLoginDate: string | null;
}

export interface ProfileStats {
  accountAge: string;
  lastUpdated: string | null;
  loginCount?: number;
  createdAt: string;
  updatedAt: string;
  lastSignInAt: string;
  emailConfirmed: boolean;
  profileValidated: boolean;
}

// Types pour les modales
export interface ChangePasswordData {
  currentPassword: string;
  newPassword: string;
  confirmPassword: string;
}

export interface AvatarUploadData {
  file: File | null;
  preview: string | null;
}
