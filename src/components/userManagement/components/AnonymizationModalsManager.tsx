import React from "react";
import { SmartDeleteModal } from "./SmartDeleteModal";
import { RestoreUserModal } from "./RestoreUserModal";
import { BulkSmartDeleteModal } from "../modals/BulkSmartDeleteModal";
import { UserProfile } from "../../../types/userManagement";
import {
  DeletionReason,
  AnonymizationLevel,
} from "../../../types/dataRetention";

interface AnonymizationModalsManagerProps {
  // Smart Delete Modal (single user)
  smartDeleteModalOpen: boolean;
  restoreModalOpen: boolean;
  selectedUser: UserProfile | null;

  // Bulk Smart Delete Modal
  bulkSmartDeleteModalOpen: boolean;
  selectedUserIds: string[];

  // Handlers
  onCloseSmartDeleteModal: () => void;
  onCloseRestoreModal: () => void;
  onCloseBulkSmartDeleteModal: () => void;
  onSmartDelete: (
    userId: string,
    reason: DeletionReason,
    level: AnonymizationLevel,
    customReason?: string
  ) => Promise<void>;
  onBulkSmartDelete: (
    reason: DeletionReason,
    level: AnonymizationLevel,
    customReason?: string
  ) => Promise<void>;
  onRestore: (userId: string) => Promise<void>;

  // Loading states
  isSmartDeleting: boolean;
  isRestoring: boolean;
  isBulkDeleting: boolean;
}

export const AnonymizationModalsManager: React.FC<
  AnonymizationModalsManagerProps
> = ({
  smartDeleteModalOpen,
  restoreModalOpen,
  bulkSmartDeleteModalOpen,
  selectedUser,
  selectedUserIds,
  onCloseSmartDeleteModal,
  onCloseRestoreModal,
  onCloseBulkSmartDeleteModal,
  onSmartDelete,
  onBulkSmartDelete,
  onRestore,
  isSmartDeleting,
  isRestoring,
  isBulkDeleting,
}) => {
  return (
    <>
      {/* Smart Delete Modal */}
      <SmartDeleteModal
        open={smartDeleteModalOpen}
        user={selectedUser}
        onClose={onCloseSmartDeleteModal}
        onConfirm={onSmartDelete}
        isDeleting={isSmartDeleting}
      />

      {/* Restore User Modal */}
      <RestoreUserModal
        open={restoreModalOpen}
        user={selectedUser}
        onClose={onCloseRestoreModal}
        onConfirm={onRestore}
        isRestoring={isRestoring}
      />

      {/* Bulk Smart Delete Modal */}
      <BulkSmartDeleteModal
        open={bulkSmartDeleteModalOpen}
        selectedUserIds={selectedUserIds}
        onClose={onCloseBulkSmartDeleteModal}
        onConfirm={onBulkSmartDelete}
        isDeleting={isBulkDeleting}
      />
    </>
  );
};
