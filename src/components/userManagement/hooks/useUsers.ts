import { useState, useCallback, useMemo } from "react";
import { useQueryClient } from "@tanstack/react-query";

// Hooks migration - Utilisons les hooks consolidés
import {
  useUsers as useUsersQuery,
  useUserStats,
  useUserSearch,
  USER_QUERY_KEYS,
} from "./useUserQueries";
import { useUserActivity } from "./useUserQueries";
import { useUserMutations } from "./useUserMutations";
import { useSecurityActions } from "./useSecurityActions";
import { useAnonymization } from "./useAnonymization";
import { useModals } from "./useUserModals";
import { useExport } from "../../../hooks/shared/useExport";

// Types
import type {
  UserProfile,
  UserFilters,
  NotificationState,
} from "../../../types/userManagement";
import { USER_TABS } from "../../../types/userManagement";
import type { UserRole } from "../../../types/supabase";

// ========================================
// ÉTAT UI INITIAL
// ========================================
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

// ========================================
// OPTIONS DU HOOK
// ========================================
export interface UseUsersOptions {
  // Options de base
  enabled?: boolean;
  includeStats?: boolean;

  // Filtres par défaut
  defaultFilters?: Partial<UserFilters>;
}

/**
 * 🎯 Hook Principal - useUsers (MIGRATION)
 *
 * Hook orchestrateur unique qui remplace TOUS les hooks de UserManagementPage :
 * - useUserManagement ✅
 * - useUserModals, useRoleModals, useAnonymizationModals ✅
 * - useActiveUsersNew, useDeletedUsersNew, useAllUsersNew, useAdminUsersNew ✅
 * - useSecurityActions ✅
 * - useBulkActions ✅
 * - useUserActivity ✅
 *
 * OBJECTIF: Un seul hook pour remplacer 10+ hooks actuels
 */
export const useUsers = (options: UseUsersOptions = {}) => {
  const queryClient = useQueryClient();

  // Stabiliser les options avec useMemo pour éviter les re-renders
  const stableOptions = useMemo(
    () => ({
      enabled: options.enabled ?? true,
      includeStats: options.includeStats ?? false,
      defaultFilters: options.defaultFilters || {},
    }),
    [
      options.enabled,
      options.includeStats,
      JSON.stringify(options.defaultFilters || {}),
    ]
  );

  // ========================================
  // ÉTAT UI DE LA PAGE (ex-useUserManagement)
  // ========================================
  const [selectedUser, setSelectedUser] = useState<UserProfile | null>(null);
  const [selectedUsers, setSelectedUsers] = useState<string[]>([]);
  const [editForm, setEditForm] = useState<Partial<UserProfile>>({});
  const [filters, setFilters] = useState<UserFilters>(() => ({
    ...initialFilters,
    ...stableOptions.defaultFilters,
  }));
  const [notification, setNotification] =
    useState<NotificationState>(initialNotification);

  // État de la page (tabs, etc.)
  const [activeTab, setActiveTab] = useState(0);

  // Calculé à partir de activeTab - plus besoin de state séparé
  const currentTabRole = USER_TABS[activeTab]?.role || null;
  const isDeletedTab = (currentTabRole as any) === "deleted";
  const isAdminTab = currentTabRole === "admin";

  // ========================================
  // ACTIONS UI - SÉLECTION
  // ========================================
  const toggleUserSelection = useCallback((userId: string) => {
    setSelectedUsers((prev) =>
      prev.includes(userId)
        ? prev.filter((id) => id !== userId)
        : [...prev, userId]
    );
  }, []);

  const clearUserSelection = useCallback(() => setSelectedUsers([]), []);

  const setUserForEdit = useCallback((user: UserProfile) => {
    setSelectedUser(user);
    setEditForm({
      id: user.id,
      full_name: user.full_name,
      email: user.email,
      phone: user.phone,
      role: user.role,
      profile_validated: user.profile_validated,
      vip_subscription: user.vip_subscription,
      account_locked: user.account_locked,
    });
  }, []);

  const resetEditForm = useCallback(() => setEditForm({}), []);

  const updateEditForm = useCallback((field: keyof UserProfile, value: any) => {
    setEditForm((prev) => ({ ...prev, [field]: value }));
  }, []);

  // ========================================
  // ACTIONS UI - NOTIFICATIONS
  // ========================================
  const showNotification = useCallback(
    (
      message: string,
      severity: "success" | "error" | "warning" | "info" = "success"
    ) => {
      setNotification({ open: true, message, severity });
    },
    []
  );

  const hideNotification = useCallback(() => {
    setNotification(initialNotification);
  }, []);

  // ========================================
  // ACTIONS UI - FILTRES
  // ========================================
  const updateFilter = useCallback((key: keyof UserFilters, value: string) => {
    setFilters((prev) => ({ ...prev, [key]: value }));
  }, []);

  const resetFilters = useCallback(() => setFilters(initialFilters), []);

  // ========================================
  // HOOKS DATA - QUERIES AVEC FILTRES STABILISÉS
  // ========================================

  // Conversion des filtres UI vers filtres de base de données
  const dbFilters = useMemo(() => {
    const dbFilter: Partial<UserProfile> = {};

    // Convertir le role si spécifié
    if (filters.role && filters.role !== "") {
      dbFilter.role = filters.role;
    }

    // Convertir le status
    if (filters.status === "validated") {
      dbFilter.profile_validated = true;
    } else if (filters.status === "pending") {
      dbFilter.profile_validated = false;
    } else if (filters.status === "locked") {
      dbFilter.account_locked = true;
    }

    // Convertir le subscription
    if (filters.subscription === "vip") {
      dbFilter.vip_subscription = true;
    } else if (filters.subscription === "standard") {
      dbFilter.vip_subscription = false;
    }

    return dbFilter;
  }, [filters]);

  // 1. Utilisateurs actifs (ex-useActiveUsersNew)
  const activeUsersQuery = useUsersQuery({
    limit: 1000,
    filters: { ...dbFilters, deleted_at: null },
    enabled: stableOptions.enabled,
  });

  // 2. Utilisateurs supprimés - Filtrer avec deleted_at non-null
  const deletedUsersQuery = useUsersQuery({
    limit: 1000,
    filters: { ...dbFilters },
    enabled: stableOptions.enabled,
  });

  // 3. Tous les utilisateurs (ex-useAllUsersNew)
  const allUsersQuery = useUsersQuery({
    limit: 1000,
    filters: dbFilters,
    enabled: stableOptions.enabled,
  });

  // 4. Utilisateurs admin (ex-useAdminUsersNew)
  const adminUsersQuery = useUsersQuery({
    limit: 1000,
    filters: { role: "admin" },
    enabled: stableOptions.enabled,
  });

  // 5. Recherche textuelle
  const searchQuery = useUserSearch(filters.search || "", {
    enabled:
      stableOptions.enabled &&
      !!filters.search &&
      filters.search.trim().length > 0,
  });

  // 6. Stats globales
  const statsQuery = useUserStats();

  // 7. Filtrer les données côté client pour chaque type
  const activeUsers = useMemo(() => {
    let users = activeUsersQuery.data || [];

    // Si on a une recherche, utiliser les résultats de recherche
    if (filters.search && filters.search.trim().length > 0) {
      users = searchQuery.data || [];
    }

    // Filtrer par utilisateurs actifs (non supprimés)
    users = users.filter((user) => user.deleted_at === null);

    // Filtrer par role de l'onglet actuel
    if (currentTabRole && !isDeletedTab) {
      // Filtrer par rôle spécifique (admin, traveler, etc.)
      users = users.filter((user) => user.role === currentTabRole);
    } else if (!isDeletedTab && !currentTabRole) {
      // Onglet "All Users" - exclure les admins par défaut
      users = users.filter((user) => user.role !== "admin");
    }

    return users;
  }, [
    activeUsersQuery.data,
    currentTabRole,
    isDeletedTab,
    searchQuery.data,
    filters.search,
  ]);

  const deletedUsers = useMemo(() => {
    let users = deletedUsersQuery.data || [];

    // Si on a une recherche, utiliser les résultats de recherche
    if (filters.search && filters.search.trim().length > 0) {
      users = searchQuery.data || [];
    }

    // Filtrer côté client les utilisateurs supprimés
    return users.filter((user) => user.deleted_at !== null);
  }, [deletedUsersQuery.data, searchQuery.data, filters.search]);

  const allUsers = useMemo(() => {
    let users = allUsersQuery.data || [];

    // Si on a une recherche, utiliser les résultats de recherche
    if (filters.search && filters.search.trim().length > 0) {
      users = searchQuery.data || [];
    }

    return users;
  }, [allUsersQuery.data, searchQuery.data, filters.search]);

  const adminUsers = useMemo(() => {
    let users = adminUsersQuery.data || [];

    // Si on a une recherche, utiliser les résultats de recherche
    if (filters.search && filters.search.trim().length > 0) {
      users = (searchQuery.data || []).filter((user) => user.role === "admin");
    }

    return users;
  }, [adminUsersQuery.data, searchQuery.data, filters.search]);

  // Calculer les utilisateurs actuellement affichés pour les activités
  const currentDisplayUsers = useMemo(() => {
    // Par défaut, on prend les utilisateurs actifs
    return activeUsers;
  }, [activeUsers]);

  const userIds = useMemo(
    () => currentDisplayUsers.map((user: UserProfile) => user.id),
    [currentDisplayUsers]
  );

  // Activité utilisateurs - maintenant correctement implémenté
  const activityQuery = useUserActivity(userIds, {
    enabled: stableOptions.enabled && userIds.length > 0,
  });

  // ========================================
  // HOOKS BUSINESS - MUTATIONS & ACTIONS
  // ========================================

  // 1. Mutations CRUD de base
  const mutations = useUserMutations();

  // 2. Actions de sécurité
  const securityActions = useSecurityActions();

  // 3. Actions d'anonymisation
  const anonymization = useAnonymization();

  // 4. Gestion des modals
  const modals = useModals();

  // 5. Export functionality
  const { exportUsers } = useExport();

  // ========================================
  // BULK ACTIONS (ex-useBulkActions intégré)
  // ========================================
  const handleBulkValidate = useCallback(async () => {
    try {
      const selectedUsersList = currentDisplayUsers.filter((u: UserProfile) =>
        selectedUsers.includes(u.id)
      );

      for (const user of selectedUsersList) {
        await mutations.updateUser.mutateAsync({
          userId: user.id,
          updates: { profile_validated: true },
        });
      }

      showNotification("Utilisateurs validés en masse", "success");
      clearUserSelection();
    } catch (error) {
      showNotification("Erreur lors de la validation en masse", "error");
    }
  }, [
    currentDisplayUsers,
    selectedUsers,
    mutations.updateUser,
    showNotification,
    clearUserSelection,
  ]);

  const handleBulkSetPending = useCallback(async () => {
    try {
      const selectedUsersList = currentDisplayUsers.filter((u: UserProfile) =>
        selectedUsers.includes(u.id)
      );

      for (const user of selectedUsersList) {
        await mutations.updateUser.mutateAsync({
          userId: user.id,
          updates: { profile_validated: false },
        });
      }

      showNotification("Utilisateurs mis en attente en masse", "success");
      clearUserSelection();
    } catch (error) {
      showNotification("Erreur lors de la mise en attente en masse", "error");
    }
  }, [
    currentDisplayUsers,
    selectedUsers,
    mutations.updateUser,
    showNotification,
    clearUserSelection,
  ]);

  const handleBulkAddVip = useCallback(async () => {
    try {
      const selectedUsersList = currentDisplayUsers.filter((u: UserProfile) =>
        selectedUsers.includes(u.id)
      );

      for (const user of selectedUsersList) {
        await mutations.updateUser.mutateAsync({
          userId: user.id,
          updates: { vip_subscription: true },
        });
      }

      showNotification("Statut VIP ajouté en masse", "success");
      clearUserSelection();
    } catch (error) {
      showNotification("Erreur lors de l'ajout VIP en masse", "error");
    }
  }, [
    currentDisplayUsers,
    selectedUsers,
    mutations.updateUser,
    showNotification,
    clearUserSelection,
  ]);

  const handleBulkRemoveVip = useCallback(async () => {
    try {
      const selectedUsersList = currentDisplayUsers.filter((u: UserProfile) =>
        selectedUsers.includes(u.id)
      );

      for (const user of selectedUsersList) {
        await mutations.updateUser.mutateAsync({
          userId: user.id,
          updates: { vip_subscription: false },
        });
      }

      showNotification("Statut VIP retiré en masse", "success");
      clearUserSelection();
    } catch (error) {
      showNotification("Erreur lors du retrait VIP en masse", "error");
    }
  }, [
    currentDisplayUsers,
    selectedUsers,
    mutations.updateUser,
    showNotification,
    clearUserSelection,
  ]);

  const handleBulkActionConfirm = useCallback(async () => {
    try {
      const bulkState = modals.bulkActionData;

      if (bulkState.type === "delete") {
        // Soft delete en lot
        await Promise.all(
          selectedUsers.map((userId) =>
            mutations.deleteUser.mutateAsync(userId)
          )
        );
        showNotification("Utilisateurs supprimés", "success");
      } else if (bulkState.type === "role") {
        for (const userId of selectedUsers) {
          await mutations.updateUser.mutateAsync({
            userId: userId,
            updates: { role: bulkState.roleChange as any },
          });
        }
        showNotification("Rôles mis à jour", "success");
      } else if (bulkState.type === "vip") {
        for (const userId of selectedUsers) {
          await mutations.updateUser.mutateAsync({
            userId: userId,
            updates: { vip_subscription: bulkState.vipChange },
          });
        }
        showNotification("Statuts VIP mis à jour", "success");
      }

      clearUserSelection();
      modals.closeBulkActionModal();
    } catch (error) {
      showNotification("Erreur lors de l'action en masse", "error");
    }
  }, [
    modals,
    selectedUsers,
    mutations.updateUser,
    mutations.deleteUser,
    showNotification,
    clearUserSelection,
  ]);

  // ========================================
  // ACTIONS TAB MANAGEMENT
  // ========================================
  const handleTabChange = useCallback(
    (event: React.MouseEvent<HTMLElement>, newValue: number | null) => {
      if (newValue !== null) {
        setActiveTab(newValue);
        // Le rôle est automatiquement calculé via currentTabRole = USER_TABS[activeTab]?.role
      }
    },
    []
  ); // ========================================
  // GETTERS ET DATA CALCULÉES
  // ========================================
  const hasSelectedUsers = selectedUsers.length > 0;
  const selectedUsersCount = selectedUsers.length;

  // Données selon l'onglet actif
  const users = currentDisplayUsers;
  const isLoading = isDeletedTab
    ? deletedUsersQuery.isLoading
    : isAdminTab
    ? adminUsersQuery.isLoading
    : activeUsersQuery.isLoading;

  const isFetching = isDeletedTab
    ? deletedUsersQuery.isFetching
    : isAdminTab
    ? adminUsersQuery.isFetching
    : activeUsersQuery.isFetching;

  const error = isDeletedTab
    ? deletedUsersQuery.error
    : isAdminTab
    ? adminUsersQuery.error
    : activeUsersQuery.error;

  // ========================================
  // ACTIONS DE RAFRAICHISSEMENT
  // ========================================
  const refreshUsers = useCallback(() => {
    queryClient.invalidateQueries({ queryKey: USER_QUERY_KEYS.all });
  }, [queryClient]);

  const refetch = useCallback(() => {
    if (isDeletedTab) return deletedUsersQuery.refetch();
    if (isAdminTab) return adminUsersQuery.refetch();
    return activeUsersQuery.refetch();
  }, [
    isDeletedTab,
    isAdminTab,
    activeUsersQuery,
    deletedUsersQuery,
    adminUsersQuery,
  ]);

  // ========================================
  // INTERFACE DE RETOUR UNIFIÉE
  // ========================================
  return {
    // ========================================
    // 📊 DONNÉES (remplace useActiveUsersNew, useDeletedUsersNew, etc.)
    // ========================================
    users,
    activeUsers, // Version filtrée créée avec useMemo
    deletedUsers, // Version filtrée créée avec useMemo
    allUsers, // Version filtrée créée avec useMemo
    adminUsers, // Version filtrée créée avec useMemo

    // ========================================
    // 📊 DONNÉES BRUTES (pour stats - non filtrées par onglet)
    // ========================================
    rawActiveUsers: activeUsersQuery.data || [], // Tous les utilisateurs actifs (avec admins)
    rawDeletedUsers:
      deletedUsersQuery.data?.filter((u) => u.deleted_at !== null) || [],
    rawAllUsers: allUsersQuery.data || [],
    rawAdminUsers: adminUsersQuery.data || [],

    // ========================================
    // 📊 DONNÉES POUR STATS (comme avant - actifs SANS admins)
    // ========================================
    statsUsers: (activeUsersQuery.data || []).filter(
      (u) => u.deleted_at === null && u.role !== "admin"
    ),

    // États de chargement
    isLoading,
    isFetching,
    isLoadingActive: activeUsersQuery.isLoading,
    isLoadingDeleted: deletedUsersQuery.isLoading,
    isLoadingAll: allUsersQuery.isLoading,
    isLoadingAdmins: adminUsersQuery.isLoading,

    // Erreurs
    error,
    errorActive: activeUsersQuery.error,
    errorDeleted: deletedUsersQuery.error,
    errorAll: allUsersQuery.error,
    errorAdmins: adminUsersQuery.error,

    // Stats et activité
    stats: statsQuery.data,
    activityData: activityQuery.data || {},
    isLoadingActivity: activityQuery.isLoading,
    activityError: activityQuery.error,

    // Recherche
    searchResults: searchQuery.data || [],
    isSearching: searchQuery.isLoading,
    searchError: searchQuery.error,

    // ========================================
    // 🎯 ÉTAT UI (remplace useUserManagement)
    // ========================================
    selectedUser,
    selectedUsers,
    editForm,
    filters,
    notification,
    activeTab,
    currentTabRole,
    isDeletedTab,
    isAdminTab,

    // Getters
    hasSelectedUsers,
    selectedUsersCount,

    // ========================================
    // 🔄 ACTIONS UI
    // ========================================
    toggleUserSelection,
    clearUserSelection,
    setUserForEdit,
    setSelectedUser,
    resetEditForm,
    updateEditForm,
    showNotification,
    hideNotification,
    updateFilter,
    resetFilters,
    setFilters,
    handleTabChange,
    setActiveTab,

    // ========================================
    // 🛠️ MUTATIONS CRUD (remplace mutations individuelles)
    // ========================================
    updateUser: mutations.updateUser,
    softDeleteUser: mutations.deleteUser,
    restoreUser: mutations.restoreUser,
    mutations, // Accès complet aux mutations

    // ========================================
    // 🔒 ACTIONS MÉTIER (remplace useSecurityActions)
    // ========================================
    securityActions,

    // ========================================
    // 🗑️ ANONYMISATION (remplace useAnonymizationModals + actions)
    // ========================================
    anonymization,

    // ========================================
    // 🎭 MODALS (remplace useUserModals, useRoleModals, useAnonymizationModals)
    // ========================================
    modals,

    // ========================================
    // 🔄 BULK ACTIONS (remplace useBulkActions)
    // ========================================
    bulkActions: {
      handleBulkValidate,
      handleBulkSetPending,
      handleBulkAddVip,
      handleBulkRemoveVip,
      handleBulkActionConfirm,
    },

    // ========================================
    // 📊 EXPORT FUNCTIONALITY
    // ========================================
    exportUsers,

    // ========================================
    // ⚡ REFRESH & CACHE
    // ========================================
    refreshUsers,
    refetch,
    refetchActive: activeUsersQuery.refetch,
    refetchDeleted: deletedUsersQuery.refetch,
    refetchAdmins: adminUsersQuery.refetch,
  };
};

export type UseUsersReturn = ReturnType<typeof useUsers>;
