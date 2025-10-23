// Export quote requests queries
export {
  useQuoteRequests,
  useQuoteRequest,
  useQuoteRequestsByStatus,
  usePendingQuoteRequests,
  useRecentQuoteRequests,
  QUOTE_REQUEST_QUERY_KEYS,
} from "./useQuoteRequestQueries";

// Export quote requests mutations (CRUD)
export {
  useQuoteRequestMutations,
  QUOTE_REQUESTS_QUERY_KEYS,
} from "./useQuoteRequestMutations";

// Export quote requests statistics
export {
  useQuoteRequestStats,
  useCalculatedQuoteRequestStats,
  useQuoteRequestStatsByStatus,
  useQuoteRequestRevenueStats,
  QUOTE_REQUEST_STATS_QUERY_KEYS,
} from "./useQuoteRequestStats";

// Export quote requests management
export { useQuoteRequestManagement } from "./useQuoteRequestManagement";

// Export types
export type {
  QuoteRequestWithDetails,
  QuoteRequestFilters,
  QuoteRequestStats,
} from "../../../types/quoteRequests";
