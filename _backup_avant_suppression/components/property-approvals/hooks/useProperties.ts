import { useQuery, useQueryClient } from "@tanstack/react-query";
import { dataProvider } from "../../../providers/dataProvider";
import { supabase } from "../../../lib/supabaseClient";
import { usePropertyAdminActions } from "./usePropertyAdminActions";
import { usePropertyCrudMutations } from "./usePropertyMutations";
import {
  useProperty,
  usePendingProperties,
  usePropertyStats,
  PROPERTIES_QUERY_KEYS,
} from "./usePropertyQueries";
import { Database } from "../../../types";

type Property = Database["public"]["Tables"]["properties"]["Row"];

// Enhanced property type with owner info for admin views
export type PropertyWithOwner = Property & {
  owner?: {
    id: string;
    full_name: string | null;
    email: string;
    phone: string | null;
  };
  validator?: {
    id: string;
    full_name: string | null;
    email: string;
  };
};

// Property status types for admin management
export type PropertyStatus = "pending" | "approved" | "rejected";

export const useProperties = (options?: {
  filters?: Partial<Property>;
  limit?: number;
  orderBy?: keyof Property;
  includePending?: boolean;
  includeOwnerInfo?: boolean;
  // Optimization options
  enabled?: boolean;
  refetchOnWindowFocus?: boolean;
  refetchInterval?: number;
}) => {
  const queryClient = useQueryClient();

  // Get all properties with optional filtering
  const {
    data: properties,
    isLoading,
    error,
    refetch,
    isStale,
    isFetching,
  } = useQuery({
    queryKey: PROPERTIES_QUERY_KEYS.list(options?.filters),
    queryFn: async () => {
      if (options?.includeOwnerInfo) {
        // Use direct Supabase query with JOIN for owner info
        let query = supabase.from("properties").select(`
            *,
            profiles:owner_id (
              id,
              full_name,
              email,
              phone
            )
          `);

        // Apply filters
        if (options?.filters) {
          Object.entries(options.filters).forEach(([key, value]) => {
            if (value !== undefined) {
              query = query.eq(key, value);
            }
          });
        }

        // Apply ordering and limits
        if (options?.orderBy) query = query.order(options.orderBy as string);
        if (options?.limit) query = query.limit(options.limit);

        const { data, error } = await query;

        if (error) {
          throw new Error(error.message);
        }

        return data || [];
      } else {
        // Fallback to dataProvider for simple queries
        const response = await dataProvider.getList(
          "properties",
          {
            limit: options?.limit,
            orderBy: options?.orderBy,
          },
          options?.filters
        );

        if (!response.success) {
          throw response.error;
        }

        return response.data;
      }
    },
    staleTime: 5 * 60 * 1000, // 5 minutes
    gcTime: 10 * 60 * 1000, // 10 minutes garbage collection
    enabled: options?.enabled !== false,
    refetchOnWindowFocus: options?.refetchOnWindowFocus ?? false,
    refetchInterval: options?.refetchInterval,
    retry: 2,
  });

  // Import hooks from separated files
  const adminActions = usePropertyAdminActions();
  const crudMutations = usePropertyCrudMutations(options);

  return {
    // Query data
    properties: properties || [],
    isLoading,
    isFetching,
    isStale,
    error,
    refetch,

    // Specialized hooks
    useProperty,
    usePendingProperties,
    usePropertyStats,

    // CRUD mutations (from usePropertyMutations)
    createProperty: crudMutations.createProperty,
    updateProperty: crudMutations.updateProperty,
    deleteProperty: crudMutations.deleteProperty,
    deleteManyProperties: crudMutations.deleteManyProperties,

    // Admin-specific mutations (from usePropertyAdminActions)
    approveProperty: adminActions.approveProperty,
    rejectProperty: adminActions.rejectProperty,
    setPendingProperty: adminActions.setPendingProperty,
    approveManyProperties: adminActions.approveManyProperties,

    // Utilities
    invalidateProperties: (forceRefetch = false) =>
      queryClient.invalidateQueries({
        queryKey: PROPERTIES_QUERY_KEYS.lists(),
        refetchType: forceRefetch ? "active" : "none",
      }),

    refreshProperties: () => refetch(),

    // Query keys for external use
    queryKeys: PROPERTIES_QUERY_KEYS,
  };
};
