import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { dataProvider } from "../../../providers/dataProvider";
import { anonymizationService } from "../../../services/anonymizationService";
import { Database } from "../../../types/database.types";

type UserProfile = Database["public"]["Tables"]["profiles"]["Row"];
type UserInsert = Database["public"]["Tables"]["profiles"]["Insert"];
type UserUpdate = Database["public"]["Tables"]["profiles"]["Update"];

// Query keys for cache management
const USERS_QUERY_KEYS = {
  all: ["users"] as const,
  active: () => [...USERS_QUERY_KEYS.all, "active"] as const,
  deleted: () => [...USERS_QUERY_KEYS.all, "deleted"] as const,
  admins: () => [...USERS_QUERY_KEYS.all, "admins"] as const,
  complete: () => [...USERS_QUERY_KEYS.all, "complete"] as const,
  lists: () => [...USERS_QUERY_KEYS.all, "list"] as const,
  list: (filters?: Partial<UserProfile>, includeDeleted?: boolean) =>
    [...USERS_QUERY_KEYS.lists(), { filters, includeDeleted }] as const,
  details: () => [...USERS_QUERY_KEYS.all, "detail"] as const,
  detail: (id: string) => [...USERS_QUERY_KEYS.details(), id] as const,
};

/**
 * Hook pour gérer les utilisateurs ACTIFS uniquement (deleted_at IS NULL)
 * Exclut les admins par défaut
 * À utiliser par défaut dans l'application
 */
export const useActiveUsers = (options?: {
  filters?: Partial<UserProfile>;
  limit?: number;
  orderBy?: keyof UserProfile;
  enabled?: boolean;
  refetchOnWindowFocus?: boolean;
  refetchInterval?: number;
  includeAdmins?: boolean; // Nouvelle option pour inclure les admins si nécessaire
}) => {
  const queryClient = useQueryClient();

  // Get active users only (non-deleted)
  const {
    data: users,
    isLoading,
    error,
    refetch,
    isStale,
    isFetching,
  } = useQuery({
    queryKey: USERS_QUERY_KEYS.list(options?.filters, false),
    queryFn: async () => {
      const response = await dataProvider.getList(
        "profiles",
        {
          limit: options?.limit,
          orderBy: options?.orderBy as keyof UserProfile,
          includeDeleted: false, // Exclure les utilisateurs supprimés
        },
        options?.filters
      );

      if (!response.success) {
        throw new Error(
          response.error?.message || "Failed to fetch active users"
        );
      }

      // Filtrer les admins par défaut (sauf si explicitement demandé)
      let filteredUsers = response.data || [];
      if (!options?.includeAdmins) {
        filteredUsers = filteredUsers.filter((user) => user.role !== "admin");
      }

      return filteredUsers;
    },
    enabled: options?.enabled ?? true,
    refetchOnWindowFocus: options?.refetchOnWindowFocus ?? false,
    refetchInterval: options?.refetchInterval,
    staleTime: 5 * 60 * 1000, // 5 minutes
  });

  // Soft delete user (set deleted_at)
  const softDeleteUser = useMutation({
    mutationFn: async ({
      userId,
      reason,
    }: {
      userId: string;
      reason?: string;
    }) => {
      const response = await dataProvider.update("profiles", userId, {
        deleted_at: new Date().toISOString(),
        deletion_reason: reason || "Supprimé par l'administrateur",
      });

      if (!response.success) {
        throw new Error(response.error?.message || "Failed to delete user");
      }

      return response.data;
    },
    onSuccess: () => {
      // Invalidate all user-related queries
      queryClient.invalidateQueries({ queryKey: USERS_QUERY_KEYS.all });
    },
  });

  // Update user
  const updateUser = useMutation({
    mutationFn: async ({
      userId,
      updates,
    }: {
      userId: string;
      updates: UserUpdate;
    }) => {
      const response = await dataProvider.update("profiles", userId, updates);

      if (!response.success) {
        throw new Error(response.error?.message || "Failed to update user");
      }

      return response.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: USERS_QUERY_KEYS.all });
    },
  });

  return {
    users,
    isLoading,
    error,
    refetch,
    isStale,
    isFetching,
    softDeleteUser,
    updateUser,
  };
};

/**
 * Hook pour gérer TOUS les utilisateurs (actifs + supprimés)
 * À utiliser uniquement par les administrateurs
 */
export const useAllUsers = (options?: {
  filters?: Partial<UserProfile>;
  limit?: number;
  orderBy?: keyof UserProfile;
  enabled?: boolean;
}) => {
  const queryClient = useQueryClient();

  const {
    data: users,
    isLoading,
    error,
    refetch,
  } = useQuery({
    queryKey: USERS_QUERY_KEYS.list(options?.filters, true),
    queryFn: async () => {
      const response = await dataProvider.getList(
        "profiles",
        {
          limit: options?.limit,
          orderBy: options?.orderBy as keyof UserProfile,
          includeDeleted: true, // Inclure tous les utilisateurs
        },
        options?.filters
      );

      if (!response.success) {
        throw new Error(response.error?.message || "Failed to fetch all users");
      }

      return response.data || [];
    },
    enabled: options?.enabled ?? true,
    staleTime: 5 * 60 * 1000,
  });

  // Restore user (unset deleted_at and anonymization fields)
  const restoreUser = useMutation({
    mutationFn: async (userId: string) => {
      // Utiliser le service d'anonymisation pour une restauration complète
      const result = await anonymizationService.restoreUser(userId);

      if (!result.success) {
        throw new Error(result.error || "Failed to restore user");
      }

      return result;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: USERS_QUERY_KEYS.all });
    },
  });

  return {
    users,
    isLoading,
    error,
    refetch,
    restoreUser,
  };
};

/**
 * Hook pour gérer les utilisateurs SUPPRIMÉS uniquement (deleted_at IS NOT NULL)
 * Pour une page dédiée à la gestion des suppressions
 */
export const useDeletedUsers = (options?: {
  limit?: number;
  orderBy?: keyof UserProfile;
  enabled?: boolean;
}) => {
  const {
    data: users,
    isLoading,
    error,
    refetch,
  } = useQuery({
    queryKey: USERS_QUERY_KEYS.deleted(),
    queryFn: async () => {
      const response = await dataProvider.getList(
        "profiles",
        {
          limit: options?.limit,
          orderBy: options?.orderBy as keyof UserProfile,
          includeDeleted: true, // Inclure tous pour pouvoir filtrer
        },
        {
          // Pas de filtre ici, on va filtrer côté client car on veut deleted_at NOT NULL
        }
      );

      if (!response.success) {
        throw new Error(
          response.error?.message || "Failed to fetch deleted users"
        );
      }

      // Filtrer côté client pour ne garder que les utilisateurs supprimés
      const deletedUsers = (response.data || []).filter(
        (user) => user.deleted_at !== null
      );

      return deletedUsers;
    },
    enabled: options?.enabled ?? true,
    staleTime: 5 * 60 * 1000,
  });

  return {
    users,
    isLoading,
    error,
    refetch,
  };
};

/**
 * Hook pour gérer les ADMINISTRATEURS uniquement
 * Pour la gestion et validation des comptes admin
 */
export const useAdminUsers = (options?: {
  limit?: number;
  orderBy?: keyof UserProfile;
  enabled?: boolean;
}) => {
  const {
    data: users,
    isLoading,
    error,
    refetch,
  } = useQuery({
    queryKey: USERS_QUERY_KEYS.admins(),
    queryFn: async () => {
      const response = await dataProvider.getList(
        "profiles",
        {
          limit: options?.limit,
          orderBy: options?.orderBy as keyof UserProfile,
          includeDeleted: false, // Exclure les utilisateurs supprimés
        },
        {
          role: "admin", // Filtrer seulement les admins
        }
      );

      if (!response.success) {
        throw new Error(
          response.error?.message || "Failed to fetch admin users"
        );
      }

      return response.data || [];
    },
    enabled: options?.enabled ?? true,
    staleTime: 5 * 60 * 1000,
  });

  return {
    users,
    isLoading,
    error,
    refetch,
  };
};
