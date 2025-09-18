import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { dataProvider } from "../providers/dataProvider";
import { Database } from "../types/database.types";

type UserProfile = Database["public"]["Tables"]["profiles"]["Row"];
type UserInsert = Database["public"]["Tables"]["profiles"]["Insert"];
type UserUpdate = Database["public"]["Tables"]["profiles"]["Update"];

// Query keys for cache management
const USERS_QUERY_KEYS = {
  all: ["users"] as const,
  lists: () => [...USERS_QUERY_KEYS.all, "list"] as const,
  list: (filters?: Partial<UserProfile>) =>
    [...USERS_QUERY_KEYS.lists(), { filters }] as const,
  details: () => [...USERS_QUERY_KEYS.all, "detail"] as const,
  detail: (id: string) => [...USERS_QUERY_KEYS.details(), id] as const,
};

export const useUsers = (options?: {
  filters?: Partial<UserProfile>;
  limit?: number;
  orderBy?: keyof UserProfile;
  // New optimization options
  enabled?: boolean;
  refetchOnWindowFocus?: boolean;
  refetchInterval?: number;
}) => {
  const queryClient = useQueryClient();

  // Get all users with optional filtering
  const {
    data: users,
    isLoading,
    error,
    refetch,
    isStale,
    isFetching,
  } = useQuery({
    queryKey: USERS_QUERY_KEYS.list(options?.filters),
    queryFn: async () => {
      const response = await dataProvider.getList(
        "profiles",
        {
          limit: options?.limit,
          orderBy: options?.orderBy as keyof UserProfile,
        },
        options?.filters
      );

      if (!response.success) {
        throw response.error;
      }

      return response.data;
    },
    staleTime: 10 * 60 * 1000,
    gcTime: 15 * 60 * 1000,
    enabled: options?.enabled !== false, // Allow disabling
    refetchOnWindowFocus: options?.refetchOnWindowFocus ?? false, // Disable by default
    refetchInterval: options?.refetchInterval, // Optional polling
    retry: 2, // Limit retries
  });

  // Get single user
  const useUser = (id: string) => {
    return useQuery({
      queryKey: USERS_QUERY_KEYS.detail(id),
      queryFn: async () => {
        const response = await dataProvider.getOne("profiles", id);

        if (!response.success) {
          throw response.error;
        }

        return response.data;
      },
      enabled: !!id, // Only run if ID is provided
      staleTime: 5 * 60 * 1000,
    });
  };

  // Create user mutation with optimistic updates
  const createUser = useMutation({
    mutationFn: async (payload: UserInsert) => {
      const response = await dataProvider.create("profiles", payload);

      if (!response.success) {
        throw response.error;
      }

      return response.data;
    },
    onMutate: async (newUser) => {
      // Cancel outgoing refetches (so they don't overwrite our optimistic update)
      await queryClient.cancelQueries({ queryKey: USERS_QUERY_KEYS.lists() });

      // Snapshot the previous value
      const previousUsers = queryClient.getQueryData(
        USERS_QUERY_KEYS.list(options?.filters)
      );

      // Optimistically update to the new value
      if (previousUsers) {
        const optimisticUser = {
          ...newUser,
          id: `temp-${Date.now()}`, // Temporary ID
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString(),
        } as UserProfile;

        queryClient.setQueryData(
          USERS_QUERY_KEYS.list(options?.filters),
          (old: UserProfile[] | undefined) =>
            old ? [optimisticUser, ...old] : [optimisticUser]
        );
      }

      // Return a context object with the snapshotted value
      return { previousUsers };
    },
    onError: (err, newUser, context) => {
      // If the mutation fails, use the context returned from onMutate to roll back
      if (context?.previousUsers) {
        queryClient.setQueryData(
          USERS_QUERY_KEYS.list(options?.filters),
          context.previousUsers
        );
      }
    },
    onSettled: (newUser) => {
      // Always refetch after error or success to ensure we have the latest data
      queryClient.invalidateQueries({
        queryKey: USERS_QUERY_KEYS.lists(),
        // Only refetch if not already fresh
        refetchType: "none", // Don't force refetch, just mark as stale
      });

      // Add the real user to cache if successful
      if (newUser) {
        queryClient.setQueryData(USERS_QUERY_KEYS.detail(newUser.id), newUser);
      }
    },
  });

  // Update user mutation
  const updateUser = useMutation({
    mutationFn: async ({
      id,
      payload,
    }: {
      id: string;
      payload: UserUpdate;
    }) => {
      const response = await dataProvider.update("profiles", id, payload);

      if (!response.success) {
        throw response.error;
      }

      return response.data;
    },
    onSuccess: (updatedUser, { id }) => {
      // Update specific user in cache
      queryClient.setQueryData(USERS_QUERY_KEYS.detail(id), updatedUser);

      // Invalidate users list to reflect changes
      queryClient.invalidateQueries({ queryKey: USERS_QUERY_KEYS.lists() });
    },
  });

  // Delete user mutation
  const deleteUser = useMutation({
    mutationFn: async (id: string) => {
      const response = await dataProvider.delete("profiles", id);

      if (!response.success) {
        throw response.error;
      }

      return response.data;
    },
    onSuccess: (_, deletedId) => {
      // Remove user from cache
      queryClient.removeQueries({
        queryKey: USERS_QUERY_KEYS.detail(deletedId),
      });

      // Invalidate users list
      queryClient.invalidateQueries({ queryKey: USERS_QUERY_KEYS.lists() });
    },
  });

  // Bulk operations
  const createManyUsers = useMutation({
    mutationFn: async (payloads: UserInsert[]) => {
      const response = await dataProvider.createMany("profiles", payloads);

      if (!response.success) {
        throw response.error;
      }

      return response.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: USERS_QUERY_KEYS.lists() });
    },
  });

  const deleteManyUsers = useMutation({
    mutationFn: async (ids: string[]) => {
      const response = await dataProvider.deleteMany("profiles", ids);

      if (!response.success) {
        throw response.error;
      }

      return response.data;
    },
    onSuccess: (_, deletedIds) => {
      // Remove all deleted users from cache
      deletedIds.forEach((id) => {
        queryClient.removeQueries({ queryKey: USERS_QUERY_KEYS.detail(id) });
      });

      // Invalidate users list
      queryClient.invalidateQueries({ queryKey: USERS_QUERY_KEYS.lists() });
    },
  });

  return {
    // Query data
    users: users || [],
    isLoading,
    isFetching, // Background loading state
    isStale, // Whether data needs refresh
    error,
    refetch,

    // Single user hook
    useUser,

    // Mutations with detailed states
    createUser: {
      mutate: createUser.mutate,
      mutateAsync: createUser.mutateAsync,
      isPending: createUser.isPending,
      error: createUser.error,
      isSuccess: createUser.isSuccess,
    },

    updateUser: {
      mutate: updateUser.mutate,
      mutateAsync: updateUser.mutateAsync,
      isPending: updateUser.isPending,
      error: updateUser.error,
      isSuccess: updateUser.isSuccess,
    },

    deleteUser: {
      mutate: deleteUser.mutate,
      mutateAsync: deleteUser.mutateAsync,
      isPending: deleteUser.isPending,
      error: deleteUser.error,
      isSuccess: deleteUser.isSuccess,
    },

    // Bulk operations
    createManyUsers: {
      mutate: createManyUsers.mutate,
      mutateAsync: createManyUsers.mutateAsync,
      isPending: createManyUsers.isPending,
      error: createManyUsers.error,
      isSuccess: createManyUsers.isSuccess,
    },

    deleteManyUsers: {
      mutate: deleteManyUsers.mutate,
      mutateAsync: deleteManyUsers.mutateAsync,
      isPending: deleteManyUsers.isPending,
      error: deleteManyUsers.error,
      isSuccess: deleteManyUsers.isSuccess,
    },

    // Smart cache utilities
    invalidateUsers: (forceRefetch = false) =>
      queryClient.invalidateQueries({
        queryKey: USERS_QUERY_KEYS.lists(),
        refetchType: forceRefetch ? "active" : "none",
      }),

    // Manual refresh only when needed
    refreshUsers: () => refetch(),

    // Query keys for external use
    queryKeys: USERS_QUERY_KEYS,
  };
};
