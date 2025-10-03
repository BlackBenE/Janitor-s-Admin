import { useState } from "react";
import {
  UserProfile,
  NotificationState,
  UserFilters,
} from "../../../types/userManagement";

const initialFilters: UserFilters = {
  role: "",
  status: "",
  subscription: "",
  search: "",
};

const initialNotification: NotificationState = {
  open: false,
  message: "",
  severity: "success",
};

/**
 * Hook principal pour la gestion de l'état de la page User Management
 */
export const useUserManagement = () => {
  // États principaux
  const [selectedUser, setSelectedUser] = useState<UserProfile | null>(null);
  const [selectedUsers, setSelectedUsers] = useState<string[]>([]);
  const [editForm, setEditForm] = useState<Partial<UserProfile>>({});

  // Filtres
  const [filters, setFilters] = useState<UserFilters>(initialFilters);

  // Notifications
  const [notification, setNotification] =
    useState<NotificationState>(initialNotification);

  // Gestion des utilisateurs sélectionnés
  const toggleUserSelection = (userId: string) => {
    setSelectedUsers((prev) =>
      prev.includes(userId)
        ? prev.filter((id) => id !== userId)
        : [...prev, userId]
    );
  };

  const clearUserSelection = () => setSelectedUsers([]);

  // Gestion du formulaire d'édition
  const updateEditForm = (
    field: keyof UserProfile,
    value: string | boolean | null
  ) => {
    setEditForm((prev) => ({ ...prev, [field]: value }));
  };

  const resetEditForm = () => setEditForm({});

  const setUserForEdit = (user: UserProfile) => {
    setSelectedUser(user);
    setEditForm({
      full_name: user.full_name,
      email: user.email,
      phone: user.phone,
      role: user.role,
      profile_validated: user.profile_validated,
      vip_subscription: user.vip_subscription,
    });
  };

  // Gestion des notifications
  const showNotification = (
    message: string,
    severity: "success" | "error" | "warning" | "info"
  ) => {
    setNotification({ open: true, message, severity });
  };

  const hideNotification = () => {
    setNotification((prev) => ({ ...prev, open: false }));
  };

  // Gestion des filtres
  const updateFilter = (key: keyof UserFilters, value: string) => {
    setFilters((prev) => ({ ...prev, [key]: value }));
  };

  const resetFilters = () => setFilters(initialFilters);

  // Filtrage des utilisateurs
  const filterUsers = (users: UserProfile[]): UserProfile[] => {
    return users.filter((user: UserProfile) => {
      const matchesSearch =
        !filters.search ||
        user.full_name?.toLowerCase().includes(filters.search.toLowerCase()) ||
        user.email.toLowerCase().includes(filters.search.toLowerCase()) ||
        user.phone?.toLowerCase().includes(filters.search.toLowerCase());

      const matchesRole = !filters.role || user.role === filters.role;

      const matchesStatus =
        !filters.status ||
        (filters.status === "validated" &&
          user.profile_validated &&
          !user.account_locked) ||
        (filters.status === "pending" &&
          !user.profile_validated &&
          !user.account_locked) ||
        (filters.status === "locked" && user.account_locked);

      const matchesSubscription =
        !filters.subscription ||
        (filters.subscription === "vip" && user.vip_subscription) ||
        (filters.subscription === "standard" && !user.vip_subscription);

      return (
        matchesSearch && matchesRole && matchesStatus && matchesSubscription
      );
    });
  };

  return {
    // État
    selectedUser,
    selectedUsers,
    editForm,
    filters,
    notification,

    // Actions utilisateur
    setSelectedUser,
    setUserForEdit,
    resetEditForm,
    updateEditForm,

    // Actions sélection
    toggleUserSelection,
    clearUserSelection,

    // Actions filtres
    updateFilter,
    resetFilters,
    filterUsers,

    // Actions notifications
    showNotification,
    hideNotification,
  };
};
