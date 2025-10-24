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

// 🎯 FUSION 1: Hook unifié d'actions business
export { useUserActions } from "./useUserActions";
export type { UseUserActionsReturn } from "./useUserActions";

// 🎯 FUSION 2: Hook unifié d'interface utilisateur
export { useUserInterface } from "./useUserInterface";
export { useUserInterface as useModals } from "./useUserInterface"; // Backward compatibility
export type { UseUserInterfaceReturn } from "./useUserInterface";

// Hooks d'actions spécialisées (conservés séparément)
export { useSecurityActions } from "./useSecurityActions";

// 🎯 NETTOYAGE TERMINÉ - Hooks fusionnés supprimés avec succès
// Les fonctionnalités sont maintenant disponibles via useUserActions et useUserInterface

// Types principaux
export type { UseUsersOptions, UseUsersReturn } from "./useUsers";

// 🚫 NOTA BENE: Tous les anciens hooks ont été déplacés vers _obsolete/
// La migration est terminée, seuls ces hooks doivent être utilisés
