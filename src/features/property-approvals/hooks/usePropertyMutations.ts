import { useMutation, useQueryClient } from "@tanstack/react-query";
import { dataProvider } from "../../../providers/dataProvider";
import { Database } from "@/types";

type Property = Database["public"]["Tables"]["properties"]["Row"];
type PropertyInsert = Database["public"]["Tables"]["properties"]["Insert"];
type PropertyUpdate = Database["public"]["Tables"]["properties"]["Update"];

// Query keys for cache management
const PROPERTIES_QUERY_KEYS = {
  all: ["properties"] as const,
  lists: () => [...PROPERTIES_QUERY_KEYS.all, "list"] as const,
  list: (filters?: Record<string, unknown>) =>
    [...PROPERTIES_QUERY_KEYS.lists(), { filters }] as const,
  details: () => [...PROPERTIES_QUERY_KEYS.all, "detail"] as const,
  detail: (id: string) => [...PROPERTIES_QUERY_KEYS.details(), id] as const,
  stats: () => [...PROPERTIES_QUERY_KEYS.all, "stats"] as const,
};

/**
 * Hooks pour les opérations CRUD des propriétés
 */
export const usePropertyCrudMutations = (options?: {
  filters?: Partial<Property>;
}) => {
  const queryClient = useQueryClient();

  // Create property mutation
  const createProperty = useMutation({
    mutationFn: async (payload: PropertyInsert) => {
      const response = await dataProvider.create("properties", payload);

      if (!response.success) {
        throw response.error;
      }

      return response.data;
    },
    onMutate: async (newProperty) => {
      await queryClient.cancelQueries({
        queryKey: PROPERTIES_QUERY_KEYS.lists(),
      });

      const previousProperties = queryClient.getQueryData(
        PROPERTIES_QUERY_KEYS.list(options?.filters)
      );

      if (previousProperties) {
        const optimisticProperty = {
          ...newProperty,
          id: `temp-${Date.now()}`,
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString(),
          validation_status: "pending",
        } as Property;

        queryClient.setQueryData(
          PROPERTIES_QUERY_KEYS.list(options?.filters),
          (old: Property[] | undefined) =>
            old ? [optimisticProperty, ...old] : [optimisticProperty]
        );
      }

      return { previousProperties };
    },
    onError: (err, newProperty, context) => {
      if (context?.previousProperties) {
        queryClient.setQueryData(
          PROPERTIES_QUERY_KEYS.list(options?.filters),
          context.previousProperties
        );
      }
    },
    onSettled: (newProperty) => {
      queryClient.invalidateQueries({
        queryKey: PROPERTIES_QUERY_KEYS.lists(),
        refetchType: "none",
      });
      queryClient.invalidateQueries({
        queryKey: PROPERTIES_QUERY_KEYS.stats(),
      });

      if (newProperty) {
        queryClient.setQueryData(
          PROPERTIES_QUERY_KEYS.detail(newProperty.id),
          newProperty
        );
      }
    },
  });

  // Update property mutation
  const updateProperty = useMutation({
    mutationFn: async ({
      id,
      payload,
    }: {
      id: string;
      payload: PropertyUpdate;
    }) => {
      const response = await dataProvider.update("properties", id, {
        ...payload,
        updated_at: new Date().toISOString(),
      });

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
        queryKey: PROPERTIES_QUERY_KEYS.stats(),
      });
    },
  });

  // Delete property mutation
  const deleteProperty = useMutation({
    mutationFn: async (id: string) => {
      const response = await dataProvider.delete("properties", id);

      if (!response.success) {
        throw response.error;
      }

      return response.data;
    },
    onSuccess: (_, deletedId) => {
      queryClient.removeQueries({
        queryKey: PROPERTIES_QUERY_KEYS.detail(deletedId),
      });
      queryClient.invalidateQueries({
        queryKey: PROPERTIES_QUERY_KEYS.lists(),
      });
      queryClient.invalidateQueries({
        queryKey: PROPERTIES_QUERY_KEYS.stats(),
      });
    },
  });

  // Delete many properties mutation
  const deleteManyProperties = useMutation({
    mutationFn: async (ids: string[]) => {
      const response = await dataProvider.deleteMany("properties", ids);

      if (!response.success) {
        throw response.error;
      }

      return response.data;
    },
    onSuccess: (_, deletedIds) => {
      deletedIds.forEach((id) => {
        queryClient.removeQueries({
          queryKey: PROPERTIES_QUERY_KEYS.detail(id),
        });
      });
      queryClient.invalidateQueries({
        queryKey: PROPERTIES_QUERY_KEYS.lists(),
      });
      queryClient.invalidateQueries({
        queryKey: PROPERTIES_QUERY_KEYS.stats(),
      });
    },
  });

  return {
    createProperty: {
      mutate: createProperty.mutate,
      mutateAsync: createProperty.mutateAsync,
      isPending: createProperty.isPending,
      error: createProperty.error,
      isSuccess: createProperty.isSuccess,
    },

    updateProperty: {
      mutate: updateProperty.mutate,
      mutateAsync: updateProperty.mutateAsync,
      isPending: updateProperty.isPending,
      error: updateProperty.error,
      isSuccess: updateProperty.isSuccess,
    },

    deleteProperty: {
      mutate: deleteProperty.mutate,
      mutateAsync: deleteProperty.mutateAsync,
      isPending: deleteProperty.isPending,
      error: deleteProperty.error,
      isSuccess: deleteProperty.isSuccess,
    },

    deleteManyProperties: {
      mutate: deleteManyProperties.mutate,
      mutateAsync: deleteManyProperties.mutateAsync,
      isPending: deleteManyProperties.isPending,
      error: deleteManyProperties.error,
      isSuccess: deleteManyProperties.isSuccess,
    },
  };
};
