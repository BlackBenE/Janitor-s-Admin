import { useState } from "react";
import { UserProfile } from "../../../types/userManagement";
import {
  DeletionReason,
  AnonymizationLevel,
} from "../../../types/dataRetention";
import { useSmartDeletion } from "./useSmartDeletion";
import { useAllUsers } from "./useUsersExtended";

/**
 * Hook pour gérer les modals d'anonymisation et de restauration
 */
export const useAnonymizationModals = () => {
  // États des modals
  const [smartDeleteModalOpen, setSmartDeleteModalOpen] = useState(false);
  const [restoreModalOpen, setRestoreModalOpen] = useState(false);
  const [bulkSmartDeleteModalOpen, setBulkSmartDeleteModalOpen] =
    useState(false);
  const [selectedUser, setSelectedUser] = useState<UserProfile | null>(null);
  const [selectedUserIds, setSelectedUserIds] = useState<string[]>([]);

  // Hooks pour les actions
  const smartDeletion = useSmartDeletion();
  const { restoreUser } = useAllUsers();

  // Actions pour la modal de suppression intelligente
  const openSmartDeleteModal = (user: UserProfile) => {
    setSelectedUser(user);
    setSmartDeleteModalOpen(true);
  };

  const closeSmartDeleteModal = () => {
    setSmartDeleteModalOpen(false);
    setSelectedUser(null);
  };

  // Actions pour la modal de suppression en lot
  const openBulkSmartDeleteModal = (userIds: string[]) => {
    setSelectedUserIds(userIds);
    setBulkSmartDeleteModalOpen(true);
  };

  const closeBulkSmartDeleteModal = () => {
    setBulkSmartDeleteModalOpen(false);
    setSelectedUserIds([]);
  };

  const handleSmartDelete = async (
    userId: string,
    reason: DeletionReason,
    level: AnonymizationLevel,
    customReason?: string
  ) => {
    await smartDeletion.softDeleteWithAnonymization({
      userId,
      reason,
      anonymizationLevel: level,
      customReason,
    });
  };

  // Actions pour la modal de restauration
  const openRestoreModal = (user: UserProfile) => {
    setSelectedUser(user);
    setRestoreModalOpen(true);
  };

  const closeRestoreModal = () => {
    setRestoreModalOpen(false);
    setSelectedUser(null);
  };

  const handleRestore = async (userId: string) => {
    await restoreUser.mutateAsync(userId);
  };

  // Actions en lot pour la suppression intelligente
  const handleBulkSmartDelete = async (
    reason: DeletionReason,
    level: AnonymizationLevel = AnonymizationLevel.PARTIAL,
    customReason?: string
  ) => {
    await smartDeletion.bulkSmartDeletion({
      userIds: selectedUserIds,
      reason,
      anonymizationLevel: level,
      customReason,
    });
  };

  // Stratégies prédéfinies pour les actions en lot
  const bulkStrategies = {
    gdprCompliance: (customReason?: string) =>
      handleBulkSmartDelete(
        DeletionReason.GDPR_COMPLIANCE,
        AnonymizationLevel.PARTIAL,
        customReason || "Suppression RGPD en lot"
      ),

    userRequests: (customReason?: string) =>
      handleBulkSmartDelete(
        DeletionReason.USER_REQUEST,
        AnonymizationLevel.PARTIAL,
        customReason || "Demandes de suppression utilisateur en lot"
      ),

    adminAction: (customReason?: string) =>
      handleBulkSmartDelete(
        DeletionReason.ADMIN_ACTION,
        AnonymizationLevel.PARTIAL,
        customReason || "Action administrative en lot"
      ),

    policyViolation: (customReason?: string) =>
      handleBulkSmartDelete(
        DeletionReason.POLICY_VIOLATION,
        AnonymizationLevel.FULL,
        customReason || "Violation de politique en lot"
      ),
  };

  return {
    // États des modals
    smartDeleteModalOpen,
    restoreModalOpen,
    bulkSmartDeleteModalOpen,
    selectedUser,
    selectedUserIds,

    // Actions pour modal de suppression individuelle
    openSmartDeleteModal,
    closeSmartDeleteModal,
    handleSmartDelete,
    isSmartDeleting: smartDeletion.isDeleting,
    smartDeleteError: smartDeletion.deletionError,

    // Actions pour modal de suppression en lot
    openBulkSmartDeleteModal,
    closeBulkSmartDeleteModal,
    handleBulkSmartDelete,
    isBulkDeleting: smartDeletion.isBulkDeleting,
    bulkDeleteError: smartDeletion.bulkDeletionError,

    // Actions pour modal de restauration
    openRestoreModal,
    closeRestoreModal,
    handleRestore,
    isRestoring: restoreUser.isPending,
    restoreError: restoreUser.error,

    // Stratégies prédéfinies
    bulkStrategies,
    strategies: smartDeletion.strategies,
  };
};
