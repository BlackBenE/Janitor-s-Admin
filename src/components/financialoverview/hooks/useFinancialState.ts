import { useState, useCallback } from "react";
import { FinancialOverviewState } from "../../../types/financialoverview";

/**
 * Hook pour gérer l'état de la page financial overview
 */
export const useFinancialState = () => {
  const [state, setState] = useState<FinancialOverviewState>({
    selectedPeriod: "30d",
    viewMode: "overview",
    filters: {
      search: "",
      dateRange: {
        from: new Date(new Date().setMonth(new Date().getMonth() - 1)),
        to: new Date(),
      },
    },
  });

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Actions pour modifier l'état
  const updatePeriod = useCallback((period: "7d" | "30d" | "90d" | "1y") => {
    setState((prev) => ({ ...prev, selectedPeriod: period }));
  }, []);

  const updateViewMode = useCallback(
    (mode: "overview" | "transactions" | "analytics") => {
      setState((prev) => ({ ...prev, viewMode: mode }));
    },
    []
  );

  const updateFilters = useCallback(
    (filters: Partial<FinancialOverviewState["filters"]>) => {
      setState((prev) => ({
        ...prev,
        filters: { ...prev.filters, ...filters },
      }));
    },
    []
  );

  const updateSearch = useCallback((search: string) => {
    setState((prev) => ({
      ...prev,
      filters: { ...prev.filters, search },
    }));
  }, []);

  const updateDateRange = useCallback((dateRange: { from: Date; to: Date }) => {
    setState((prev) => ({
      ...prev,
      filters: { ...prev.filters, dateRange },
    }));
  }, []);

  const resetFilters = useCallback(() => {
    setState((prev) => ({
      ...prev,
      filters: {
        search: "",
        dateRange: {
          from: new Date(new Date().setMonth(new Date().getMonth() - 1)),
          to: new Date(),
        },
      },
    }));
  }, []);

  return {
    // État
    state,
    loading,
    error,

    // Actions
    updatePeriod,
    updateViewMode,
    updateFilters,
    updateSearch,
    updateDateRange,
    resetFilters,
    setLoading,
    setError,
  };
};
