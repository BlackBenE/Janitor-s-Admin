import { useState } from "react";

/**
 * Hook pour la gestion des modales de la page Analytics
 */
export const useAnalyticsModals = () => {
  const [showModal, setShowModal] = useState(false);

  // Actions
  const openModal = () => setShowModal(true);
  const closeModal = () => setShowModal(false);

  return {
    // État des modales
    showModal,

    // Actions
    openModal,
    closeModal,
  };
};

export default useAnalyticsModals;
