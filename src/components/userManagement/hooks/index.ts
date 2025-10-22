// 🎯 HOOKS PRINCIPAUX - Architecture consolidée post-migration
// Tous les composants userManagement utilisent EXCLUSIVEMENT ces hooks

// Hook orchestrateur principal (remplace 21+ hooks individuels)
export { useUsers } from "./useUsers";

// Hooks de données spécialisés (queries React Query)
export {
  useUser,
  useUsers as useUsersQuery,
  useUserStats,
  useUserStatsIndividual,
  useUserActivity,
  useUserBookings,
  useUserAuditLog,
  useUserClientServices,
  useUserProviderServices,
  useUserServiceRequests,
  useUserInterventions,
  useUserSubscriptions,
  useUserSearch,
  USER_QUERY_KEYS,
} from "./useUserQueries";

// Hooks de mutations (actions CRUD)
export { useUserMutations } from "./useUserMutations";

// Hooks d'actions spécialisées
export { useSecurityActions } from "./useSecurityActions";
export { useBulkActions } from "./useBulkActions";
export { useAnonymization } from "./useAnonymization";

// Types principaux
export type { UseUsersOptions, UseUsersReturn } from "./useUsers";

// 🚫 NOTA BENE: Tous les anciens hooks ont été déplacés vers _obsolete/
// La migration est terminée, seuls ces hooks doivent être utilisés
