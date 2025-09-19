import { useState } from "react";

export interface FilterState {
  search: string;
  [key: string]: string | number | boolean;
}

export interface UseFiltersProps<T extends FilterState> {
  initialFilters: T;
}

/**
 * Hook universel pour la gestion des filtres
 * Réutilisable pour toutes les pages avec filtrage
 */
export const useFilters = <T extends FilterState>({
  initialFilters,
}: UseFiltersProps<T>) => {
  const [filters, setFilters] = useState<T>(initialFilters);

  const updateFilter = <K extends keyof T>(key: K, value: T[K]) => {
    setFilters((prev) => ({ ...prev, [key]: value }));
  };

  const resetFilters = () => setFilters(initialFilters);

  const clearSearch = () => updateFilter("search" as keyof T, "" as T[keyof T]);

  // Fonction générique de filtrage
  const filterData = <D extends Record<string, unknown>>(
    data: D[],
    filterConfig: {
      searchFields: (keyof D)[];
      customFilters?: {
        [K in keyof T]?: (item: D, value: T[K]) => boolean;
      };
    }
  ): D[] => {
    return data.filter((item) => {
      // Filtrage par recherche textuelle
      const matchesSearch =
        !filters.search ||
        filterConfig.searchFields.some((field) =>
          item[field]
            ?.toString()
            .toLowerCase()
            .includes(filters.search.toLowerCase())
        );

      // Filtres customisés
      const matchesCustomFilters = filterConfig.customFilters
        ? Object.entries(filterConfig.customFilters).every(
            ([key, filterFn]) => {
              const filterValue = filters[key as keyof T];
              if (!filterValue || filterValue === "") return true;
              return filterFn!(item, filterValue);
            }
          )
        : true;

      return matchesSearch && matchesCustomFilters;
    });
  };

  const hasActiveFilters = (): boolean => {
    return Object.entries(filters).some(([key, value]) => {
      if (key === "search") return value !== "";
      return value !== initialFilters[key as keyof T];
    });
  };

  const getActiveFiltersCount = (): number => {
    return Object.entries(filters).filter(([key, value]) => {
      if (key === "search") return value !== "";
      return value !== initialFilters[key as keyof T];
    }).length;
  };

  return {
    filters,
    updateFilter,
    resetFilters,
    clearSearch,
    filterData,
    hasActiveFilters,
    getActiveFiltersCount,
  };
};

export default useFilters;
