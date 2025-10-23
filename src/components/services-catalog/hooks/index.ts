// Export all service hooks
export { useServices, useService, useServiceStats } from "./useServices";
export {
  useServices as useServicesQuery,
  useService as useServiceQuery,
  useServiceStats as useServiceStatsQuery,
  SERVICE_QUERY_KEYS,
} from "./useServiceQueries";
export { useServiceManagement } from "./useServiceManagement";

// Export provider hooks
export {
  useProviders,
  useProvider,
  PROVIDERS_QUERY_KEYS,
} from "./useProviders";

// Export provider stats hooks
export { useProviderStats, useProviderServices } from "./useProviderStats";

// Export service history hooks
export { useServiceHistory, useServicePerformance } from "./useServiceHistory";

// Export service requests hooks
export {
  useServiceRequests,
  useServiceRequest,
  useServiceRequestStats,
  useServiceRequestsByService,
  useServiceRequestsByProvider,
  useServiceRequestsByRequester,
  useServiceRequestMutations,
  SERVICE_REQUESTS_QUERY_KEYS,
} from "./useServiceRequests";

// Export types
export type {
  ServiceRequestWithDetails,
  ServiceRequestFilters,
  ServiceRequestStats,
} from "./useServiceRequests";
