// UserManagement modular components
export { UserHeader } from './UserHeader';
export { UserStatsSection } from './UserStatsSection';
// UserStatsSectionNew moved to _obsolete (used obsolete hooks)
export { UserTableSection } from './UserTableSection';

export { ModalsManager } from './ModalsManager';
export { UserTableActionsHub } from './UserTableActionsHub';

// Anonymization and Smart Deletion components
export { SmartDeleteModal } from '../modals/SmartDeleteModal';
export { RestoreUserModal } from '../modals/RestoreUserModal';
export { AnonymizationStatus, AnonymizationDetails } from './AnonymizationStatus';

// Utils
export * from '../utils/userManagementUtils';
