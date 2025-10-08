import { useState } from "react";

import { Property } from "../../../types";

export interface PropertyManagementState {
  selectedProperty: Property | null;
  selectedProperties: string[];
  isModalOpen: boolean;
}

const initialState: PropertyManagementState = {
  selectedProperty: null,
  selectedProperties: [],
  isModalOpen: false,
};

/**
 * Hook pour la gestion de l'état de la page Property Approvals
 */
export const usePropertyManagement = () => {
  // États principaux
  const [selectedProperty, setSelectedProperty] = useState<Property | null>(
    null
  );
  const [selectedProperties, setSelectedProperties] = useState<string[]>([]);
  const [isModalOpen, setIsModalOpen] = useState(false);

  // Gestion des propriétés sélectionnées
  const togglePropertySelection = (propertyId: string) => {
    setSelectedProperties((prev) =>
      prev.includes(propertyId)
        ? prev.filter((id) => id !== propertyId)
        : [...prev, propertyId]
    );
  };

  const clearPropertySelection = () => setSelectedProperties([]);

  const selectAllProperties = (propertyIds: string[]) => {
    setSelectedProperties(propertyIds);
  };

  // Gestion de la modal
  const openModal = (property: Property) => {
    setSelectedProperty(property);
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setSelectedProperty(null);
    setIsModalOpen(false);
  };

  return {
    // État
    selectedProperty,
    selectedProperties,
    isModalOpen,

    // Actions
    togglePropertySelection,
    clearPropertySelection,
    selectAllProperties,
    openModal,
    closeModal,
    setSelectedProperty,
    setIsModalOpen,
  };
};
