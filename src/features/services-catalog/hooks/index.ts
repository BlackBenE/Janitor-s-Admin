// Export all service hooks
// Hook principal de la feature (orchestrateur)
export { useServiceCatalog, useService, useServiceStats } from './useServiceCatalog';

// Hooks de queries
export {
  useServices as useServicesQuery,
  useService as useServiceQuery,
  useServiceStats as useServiceStatsQuery,
  SERVICE_QUERY_KEYS,
} from './useServiceQueries';

export { useServiceManagement } from './useServiceManagement';

// Export provider hooks
export { useProviders, useProvider, PROVIDERS_QUERY_KEYS } from './useProviders';

// Export provider stats hooks
export { useProviderStats, useProviderServices } from './useProviderStats';

// Export service history hooks
export { useServiceHistory } from './useServiceHistory';

// Export service requests hooks
export {
  useServiceRequestsFeature,
  useServiceRequest,
  useServiceRequestStats,
  useServiceRequestsByService,
  useServiceRequestsByProvider,
  useServiceRequestsByRequester,
  useServiceRequestMutations,
  SERVICE_REQUESTS_QUERY_KEYS,
} from './useServiceRequestsFeature';

// Export types
export type {
  ServiceRequestWithDetails,
  ServiceRequestFilters,
  ServiceRequestStats,
} from './useServiceRequestsFeature';
