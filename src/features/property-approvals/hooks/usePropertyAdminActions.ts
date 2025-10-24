import { useMutation, useQueryClient } from "@tanstack/react-query";
import { dataProvider } from "../../../providers/dataProvider";
import { TablesUpdate } from "@/types/database.types";

// Query keys for cache management
const PROPERTIES_QUERY_KEYS = {
  all: ["properties"] as const,
  lists: () => [...PROPERTIES_QUERY_KEYS.all, "list"] as const,
  list: (filters?: Record<string, unknown>) =>
    [...PROPERTIES_QUERY_KEYS.lists(), { filters }] as const,
  details: () => [...PROPERTIES_QUERY_KEYS.all, "detail"] as const,
  detail: (id: string) => [...PROPERTIES_QUERY_KEYS.details(), id] as const,
  stats: () => [...PROPERTIES_QUERY_KEYS.all, "stats"] as const,
  pending: () => [...PROPERTIES_QUERY_KEYS.all, "pending"] as const,
};

/**
 * Hooks pour les actions d'administration des propriétés
 */
export const usePropertyAdminActions = () => {
  const queryClient = useQueryClient();

  // Approve property mutation (admin only)
  const approveProperty = useMutation({
    mutationFn: async ({
      id,
      validatedBy,
      moderationNotes,
    }: {
      id: string;
      validatedBy: string;
      moderationNotes?: string;
    }) => {
      const updateData: TablesUpdate<"properties"> = {
        validation_status: "approved",
        validated_at: new Date().toISOString(),
        validated_by: validatedBy,
        updated_at: new Date().toISOString(),
      };

      // Add moderation notes if provided
      if (moderationNotes) {
        updateData.moderation_notes = moderationNotes;
      }

      const response = await dataProvider.update("properties", id, updateData);

      if (!response.success) {
        throw response.error;
      }

      return response.data;
    },
    onSuccess: (updatedProperty, { id }) => {
      queryClient.setQueryData(
        PROPERTIES_QUERY_KEYS.detail(id),
        updatedProperty
      );
      queryClient.invalidateQueries({
        queryKey: PROPERTIES_QUERY_KEYS.lists(),
      });
      queryClient.invalidateQueries({
        queryKey: PROPERTIES_QUERY_KEYS.pending(),
      });
      queryClient.invalidateQueries({
        queryKey: PROPERTIES_QUERY_KEYS.stats(),
      });
    },
  });

  // Reject property mutation (admin only)
  const rejectProperty = useMutation({
    mutationFn: async ({
      id,
      validatedBy,
      moderationNotes,
    }: {
      id: string;
      validatedBy: string;
      moderationNotes?: string;
    }) => {
      const updateData: TablesUpdate<"properties"> = {
        validation_status: "rejected",
        validated_at: new Date().toISOString(),
        validated_by: validatedBy,
        updated_at: new Date().toISOString(),
      };

      // Add moderation notes if provided
      if (moderationNotes) {
        updateData.moderation_notes = moderationNotes;
      }

      const response = await dataProvider.update("properties", id, updateData);

      if (!response.success) {
        throw response.error;
      }

      return response.data;
    },
    onSuccess: (updatedProperty, { id }) => {
      queryClient.setQueryData(
        PROPERTIES_QUERY_KEYS.detail(id),
        updatedProperty
      );
      queryClient.invalidateQueries({
        queryKey: PROPERTIES_QUERY_KEYS.lists(),
      });
      queryClient.invalidateQueries({
        queryKey: PROPERTIES_QUERY_KEYS.pending(),
      });
      queryClient.invalidateQueries({
        queryKey: PROPERTIES_QUERY_KEYS.stats(),
      });
    },
  });

  // Set property to pending mutation (admin only)
  const setPendingProperty = useMutation({
    mutationFn: async ({
      id,
      validatedBy,
      moderationNotes,
    }: {
      id: string;
      validatedBy: string;
      moderationNotes?: string;
    }) => {
      const updateData: TablesUpdate<"properties"> = {
        validation_status: "pending",
        validated_at: null,
        validated_by: null,
        updated_at: new Date().toISOString(),
      };

      // Add moderation notes if provided
      if (moderationNotes) {
        updateData.moderation_notes = moderationNotes;
      }

      const response = await dataProvider.update("properties", id, updateData);

      if (!response.success) {
        throw response.error;
      }

      return response.data;
    },
    onSuccess: (updatedProperty, { id }) => {
      queryClient.setQueryData(
        PROPERTIES_QUERY_KEYS.detail(id),
        updatedProperty
      );
      queryClient.invalidateQueries({
        queryKey: PROPERTIES_QUERY_KEYS.lists(),
      });
      queryClient.invalidateQueries({
        queryKey: PROPERTIES_QUERY_KEYS.pending(),
      });
      queryClient.invalidateQueries({
        queryKey: PROPERTIES_QUERY_KEYS.stats(),
      });
    },
  });

  // Bulk operations
  const approveManyProperties = useMutation({
    mutationFn: async ({
      ids,
      validatedBy,
    }: {
      ids: string[];
      validatedBy: string;
    }) => {
      const updates = ids.map((id) =>
        dataProvider.update("properties", id, {
          validation_status: "approved",
          validated_at: new Date().toISOString(),
          validated_by: validatedBy,
          updated_at: new Date().toISOString(),
        })
      );

      const responses = await Promise.all(updates);
      const failed = responses.filter((r) => !r.success);

      if (failed.length > 0) {
        throw new Error(`Failed to approve ${failed.length} properties`);
      }

      return responses.map((r) => r.data);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: PROPERTIES_QUERY_KEYS.lists(),
      });
      queryClient.invalidateQueries({
        queryKey: PROPERTIES_QUERY_KEYS.pending(),
      });
      queryClient.invalidateQueries({
        queryKey: PROPERTIES_QUERY_KEYS.stats(),
      });
    },
  });

  return {
    approveProperty: {
      mutate: approveProperty.mutate,
      mutateAsync: approveProperty.mutateAsync,
      isPending: approveProperty.isPending,
      error: approveProperty.error,
      isSuccess: approveProperty.isSuccess,
    },

    rejectProperty: {
      mutate: rejectProperty.mutate,
      mutateAsync: rejectProperty.mutateAsync,
      isPending: rejectProperty.isPending,
      error: rejectProperty.error,
      isSuccess: rejectProperty.isSuccess,
    },

    setPendingProperty: {
      mutate: setPendingProperty.mutate,
      mutateAsync: setPendingProperty.mutateAsync,
      isPending: setPendingProperty.isPending,
      error: setPendingProperty.error,
      isSuccess: setPendingProperty.isSuccess,
    },

    approveManyProperties: {
      mutate: approveManyProperties.mutate,
      mutateAsync: approveManyProperties.mutateAsync,
      isPending: approveManyProperties.isPending,
      error: approveManyProperties.error,
      isSuccess: approveManyProperties.isSuccess,
    },
  };
};
