export { useUserManagement } from "./useUserManagement";
export { useUserModals } from "./useUserModals";
export { useUserActivity } from "./useUserActivity";
export { useAuditLog } from "./useAuditLog";
export { useSecurityActions } from "./useSecurityActions";
export { useBulkActions } from "./useBulkActions";
export { useRoleModals } from "./useRoleModals";

// Nouveaux hooks pour la gestion des utilisateurs supprimés
export {
  useActiveUsers,
  useAllUsers,
  useDeletedUsers,
  useAdminUsers,
} from "./useUsersExtended";

// Hooks pour l'anonymisation et suppression intelligente
export {
  useAnonymization,
  useAnonymizationStrategies,
} from "./useAnonymization";
export { useSmartDeletion } from "./useSmartDeletion";
export { useAnonymizationModals } from "./useAnonymizationModals";
