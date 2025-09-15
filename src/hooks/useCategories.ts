import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { dataProvider } from "../providers/dataProvider";
import type { Database } from "../types/database.types";

type Service = Database["public"]["Tables"]["services"]["Row"];

// Category interface for extracted categories
export interface ServiceCategory {
  name: string;
  count: number;
  activeServices: number;
  totalRevenue: number;
  averagePrice: number;
  popularityRank: number;
}

// Category statistics for analytics
export interface CategoryStats {
  totalCategories: number;
  mostPopular: string;
  leastPopular: string;
  averageServicesPerCategory: number;
  revenueDistribution: Record<string, number>;
}

// Category management data
export interface CategoryManagement {
  category: string;
  services: Service[];
  providers: number;
  activeServices: number;
  revenue: number;
  bookingRate: number;
}

// Query keys for cache management
const CATEGORIES_QUERY_KEYS = {
  all: ["categories"] as const,
  list: () => [...CATEGORIES_QUERY_KEYS.all, "list"] as const,
  stats: () => [...CATEGORIES_QUERY_KEYS.all, "stats"] as const,
  management: () => [...CATEGORIES_QUERY_KEYS.all, "management"] as const,
  analytics: (category: string) =>
    [...CATEGORIES_QUERY_KEYS.all, "analytics", category] as const,
  services: (category: string) =>
    [...CATEGORIES_QUERY_KEYS.all, "services", category] as const,
  trending: () => [...CATEGORIES_QUERY_KEYS.all, "trending"] as const,
};

export const useCategories = () => {
  const queryClient = useQueryClient();

  // Get all unique categories from services
  const useCategoriesList = () => {
    return useQuery({
      queryKey: CATEGORIES_QUERY_KEYS.list(),
      queryFn: async (): Promise<ServiceCategory[]> => {
        // Get all services
        const servicesResponse = await dataProvider.getList("services", {});

        if (!servicesResponse.success || !servicesResponse.data) {
          return [];
        }

        const services = servicesResponse.data;

        // Get all service requests for revenue calculation
        const serviceRequestsResponse = await dataProvider.getList(
          "service_requests",
          {}
        );
        const serviceRequests =
          serviceRequestsResponse.success && serviceRequestsResponse.data
            ? serviceRequestsResponse.data
            : [];

        // Group services by category
        const categoriesMap = new Map<string, Service[]>();

        services.forEach((service) => {
          const category = service.category;
          if (!categoriesMap.has(category)) {
            categoriesMap.set(category, []);
          }
          categoriesMap.get(category)?.push(service);
        });

        // Calculate statistics for each category
        const categories: ServiceCategory[] = [];

        categoriesMap.forEach((categoryServices, categoryName) => {
          const activeServices = categoryServices.filter(
            (s) => s.is_active
          ).length;

          // Calculate revenue for this category
          const categoryServiceIds = new Set(categoryServices.map((s) => s.id));
          const categoryRequests = serviceRequests.filter((sr) =>
            categoryServiceIds.has(sr.service_id)
          );
          const totalRevenue = categoryRequests.reduce(
            (sum, sr) => sum + sr.total_amount,
            0
          );

          // Calculate average price
          const averagePrice =
            categoryServices.length > 0
              ? categoryServices.reduce((sum, s) => sum + s.base_price, 0) /
                categoryServices.length
              : 0;

          categories.push({
            name: categoryName,
            count: categoryServices.length,
            activeServices,
            totalRevenue: Math.round(totalRevenue * 100) / 100,
            averagePrice: Math.round(averagePrice * 100) / 100,
            popularityRank: 0, // Will be calculated after sorting
          });
        });

        // Sort by total revenue and assign popularity ranks
        categories.sort((a, b) => b.totalRevenue - a.totalRevenue);
        categories.forEach((category, index) => {
          category.popularityRank = index + 1;
        });

        return categories;
      },
      staleTime: 10 * 60 * 1000, // 10 minutes
      refetchInterval: 15 * 60 * 1000, // Refresh every 15 minutes
    });
  };

  // Get category statistics
  const useCategoryStats = () => {
    return useQuery({
      queryKey: CATEGORIES_QUERY_KEYS.stats(),
      queryFn: async (): Promise<CategoryStats> => {
        // Get services data
        const servicesResponse = await dataProvider.getList("services", {});

        if (!servicesResponse.success || !servicesResponse.data) {
          return {
            totalCategories: 0,
            mostPopular: "",
            leastPopular: "",
            averageServicesPerCategory: 0,
            revenueDistribution: {},
          };
        }

        const services = servicesResponse.data;

        // Get service requests for revenue calculation
        const serviceRequestsResponse = await dataProvider.getList(
          "service_requests",
          {}
        );
        const serviceRequests =
          serviceRequestsResponse.success && serviceRequestsResponse.data
            ? serviceRequestsResponse.data
            : [];

        // Group services by category and calculate stats
        const categoriesMap = new Map<string, Service[]>();
        services.forEach((service) => {
          const category = service.category;
          if (!categoriesMap.has(category)) {
            categoriesMap.set(category, []);
          }
          categoriesMap.get(category)?.push(service);
        });

        // Calculate revenue by category
        const categoryRevenue = new Map<string, number>();
        services.forEach((service) => {
          const categoryRequests = serviceRequests.filter(
            (sr) => sr.service_id === service.id
          );
          const revenue = categoryRequests.reduce(
            (sum: number, sr) => sum + sr.total_amount,
            0
          );
          const currentRevenue = categoryRevenue.get(service.category) || 0;
          categoryRevenue.set(service.category, currentRevenue + revenue);
        });

        // Sort categories by revenue
        const sortedCategories = Array.from(categoriesMap.entries()).sort(
          ([, aServices], [, bServices]) => {
            const aRevenue =
              categoryRevenue.get(aServices[0]?.category || "") || 0;
            const bRevenue =
              categoryRevenue.get(bServices[0]?.category || "") || 0;
            return bRevenue - aRevenue;
          }
        );

        const totalServices = services.length;
        const totalRevenue = Array.from(categoryRevenue.values()).reduce(
          (sum: number, revenue) => sum + revenue,
          0
        );

        // Calculate revenue distribution
        const revenueDistribution: Record<string, number> = {};
        categoryRevenue.forEach((revenue, category) => {
          const percentage =
            totalRevenue > 0
              ? Math.round((revenue / totalRevenue) * 100 * 100) / 100
              : 0;
          revenueDistribution[category] = percentage;
        });

        return {
          totalCategories: categoriesMap.size,
          mostPopular: sortedCategories[0]?.[0] || "",
          leastPopular:
            sortedCategories[sortedCategories.length - 1]?.[0] || "",
          averageServicesPerCategory:
            categoriesMap.size > 0
              ? Math.round((totalServices / categoriesMap.size) * 100) / 100
              : 0,
          revenueDistribution,
        };
      },
      staleTime: 10 * 60 * 1000, // 10 minutes
    });
  };

  // Get services by category
  const useServicesByCategory = (category: string) => {
    return useQuery({
      queryKey: CATEGORIES_QUERY_KEYS.services(category),
      queryFn: async (): Promise<Service[]> => {
        const response = await dataProvider.getList(
          "services",
          {},
          {
            category: `eq.${category}`,
          }
        );

        return response.success && response.data ? response.data : [];
      },
      enabled: !!category,
      staleTime: 5 * 60 * 1000, // 5 minutes
    });
  };

  // Get category management data
  const useCategoryManagement = () => {
    return useQuery({
      queryKey: CATEGORIES_QUERY_KEYS.management(),
      queryFn: async (): Promise<CategoryManagement[]> => {
        const [servicesResponse, serviceRequestsResponse] = await Promise.all([
          dataProvider.getList("services", {}),
          dataProvider.getList("service_requests", {}),
        ]);

        const services =
          servicesResponse.success && servicesResponse.data
            ? servicesResponse.data
            : [];
        const serviceRequests =
          serviceRequestsResponse.success && serviceRequestsResponse.data
            ? serviceRequestsResponse.data
            : [];

        // Group by category
        const categoriesMap = new Map<string, Service[]>();
        services.forEach((service) => {
          const category = service.category;
          if (!categoriesMap.has(category)) {
            categoriesMap.set(category, []);
          }
          categoriesMap.get(category)?.push(service);
        });

        const managementData: CategoryManagement[] = [];

        categoriesMap.forEach((categoryServices, categoryName) => {
          const activeServices = categoryServices.filter(
            (s) => s.is_active
          ).length;
          const uniqueProviders = new Set(
            categoryServices.map((s) => s.provider_id)
          ).size;

          // Calculate revenue and booking rate
          const categoryServiceIds = new Set(categoryServices.map((s) => s.id));
          const categoryRequests = serviceRequests.filter((sr) =>
            categoryServiceIds.has(sr.service_id)
          );
          const completedRequests = categoryRequests.filter(
            (sr) => sr.status === "completed"
          );

          const revenue = categoryRequests.reduce(
            (sum, sr) => sum + sr.total_amount,
            0
          );
          const bookingRate =
            categoryServices.length > 0
              ? (completedRequests.length / categoryServices.length) * 100
              : 0;

          managementData.push({
            category: categoryName,
            services: categoryServices,
            providers: uniqueProviders,
            activeServices,
            revenue: Math.round(revenue * 100) / 100,
            bookingRate: Math.round(bookingRate * 100) / 100,
          });
        });

        // Sort by revenue
        managementData.sort((a, b) => b.revenue - a.revenue);

        return managementData;
      },
      staleTime: 10 * 60 * 1000, // 10 minutes
    });
  };

  // Get trending categories (based on recent activity)
  const useTrendingCategories = () => {
    return useQuery({
      queryKey: CATEGORIES_QUERY_KEYS.trending(),
      queryFn: async (): Promise<ServiceCategory[]> => {
        const thirtyDaysAgo = new Date();
        thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);

        // Get recent service requests
        const recentRequestsResponse = await dataProvider.getList(
          "service_requests",
          {},
          {
            created_at: `gte.${thirtyDaysAgo.toISOString()}`,
          }
        );

        const recentRequests =
          recentRequestsResponse.success && recentRequestsResponse.data
            ? recentRequestsResponse.data
            : [];

        if (recentRequests.length === 0) {
          return [];
        }

        // Get services to map to categories
        const servicesResponse = await dataProvider.getList("services", {});
        const services =
          servicesResponse.success && servicesResponse.data
            ? servicesResponse.data
            : [];

        // Create service ID to category mapping
        const serviceToCategory = new Map<string, string>();
        services.forEach((service) => {
          serviceToCategory.set(service.id, service.category);
        });

        // Count requests by category
        const categoryActivity = new Map<string, number>();
        const categoryRevenue = new Map<string, number>();

        recentRequests.forEach((request) => {
          const category = serviceToCategory.get(request.service_id);
          if (category) {
            categoryActivity.set(
              category,
              (categoryActivity.get(category) || 0) + 1
            );
            categoryRevenue.set(
              category,
              (categoryRevenue.get(category) || 0) + request.total_amount
            );
          }
        });

        // Convert to ServiceCategory format
        const trendingCategories: ServiceCategory[] = [];

        categoryActivity.forEach((activityCount, categoryName) => {
          const revenue = categoryRevenue.get(categoryName) || 0;
          const categoryServices = services.filter(
            (s) => s.category === categoryName
          );

          trendingCategories.push({
            name: categoryName,
            count: categoryServices.length,
            activeServices: categoryServices.filter((s) => s.is_active).length,
            totalRevenue: Math.round(revenue * 100) / 100,
            averagePrice:
              categoryServices.length > 0
                ? Math.round(
                    (categoryServices.reduce(
                      (sum, s) => sum + s.base_price,
                      0
                    ) /
                      categoryServices.length) *
                      100
                  ) / 100
                : 0,
            popularityRank: 0, // Will be set after sorting
          });
        });

        // Sort by activity (number of recent requests) and assign ranks
        trendingCategories.sort((a, b) => {
          const aActivity = categoryActivity.get(a.name) || 0;
          const bActivity = categoryActivity.get(b.name) || 0;
          return bActivity - aActivity;
        });

        trendingCategories.forEach((category, index) => {
          category.popularityRank = index + 1;
        });

        return trendingCategories.slice(0, 10); // Top 10 trending
      },
      staleTime: 30 * 60 * 1000, // 30 minutes
    });
  };

  // Update service category (mutation)
  const useUpdateServiceCategory = () => {
    return useMutation({
      mutationFn: async ({
        serviceId,
        newCategory,
      }: {
        serviceId: string;
        newCategory: string;
      }) => {
        const response = await dataProvider.update("services", serviceId, {
          category: newCategory,
        });

        if (!response.success) {
          const errorMessage =
            typeof response.error === "string"
              ? response.error
              : "Failed to update service category";
          throw new Error(errorMessage);
        }

        return response.data;
      },
      onSuccess: () => {
        // Invalidate all category-related queries
        queryClient.invalidateQueries({ queryKey: CATEGORIES_QUERY_KEYS.all });
      },
    });
  };

  // Bulk update categories (mutation)
  const useBulkUpdateCategories = () => {
    return useMutation({
      mutationFn: async (
        updates: Array<{ serviceId: string; newCategory: string }>
      ) => {
        const updatePromises = updates.map(({ serviceId, newCategory }) =>
          dataProvider.update("services", serviceId, { category: newCategory })
        );

        const results = await Promise.all(updatePromises);
        const failedUpdates = results.filter((result) => !result.success);

        if (failedUpdates.length > 0) {
          throw new Error(
            `Failed to update ${failedUpdates.length} service categories`
          );
        }

        return results
          .filter((result) => result.success)
          .map((result) => result.data);
      },
      onSuccess: () => {
        queryClient.invalidateQueries({ queryKey: CATEGORIES_QUERY_KEYS.all });
      },
    });
  };

  // Utility functions
  const invalidateCategories = () => {
    queryClient.invalidateQueries({ queryKey: CATEGORIES_QUERY_KEYS.all });
  };

  const refreshCategories = () => {
    return Promise.all([
      queryClient.refetchQueries({ queryKey: CATEGORIES_QUERY_KEYS.list() }),
      queryClient.refetchQueries({ queryKey: CATEGORIES_QUERY_KEYS.stats() }),
      queryClient.refetchQueries({
        queryKey: CATEGORIES_QUERY_KEYS.management(),
      }),
    ]);
  };

  return {
    // Query hooks
    useCategoriesList,
    useCategoryStats,
    useServicesByCategory,
    useCategoryManagement,
    useTrendingCategories,

    // Mutation hooks
    useUpdateServiceCategory,
    useBulkUpdateCategories,

    // Utilities
    invalidateCategories,
    refreshCategories,

    // Query keys for external use
    queryKeys: CATEGORIES_QUERY_KEYS,
  };
};
