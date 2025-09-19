#!/bin/bash

# Script de génération d'une nouvelle page refactorisée
# Usage: ./generate-page.sh [pageName]

if [ $# -eq 0 ]; then
    echo "Usage: $0 <pageName>"
    echo "Example: $0 Profile"
    exit 1
fi

PAGE_NAME=$1
LOWER_NAME=$(echo "$PAGE_NAME" | tr '[:upper:]' '[:lower:]')
COMPONENT_DIR="src/components/$LOWER_NAME"
HOOKS_DIR="src/hooks/$LOWER_NAME"
TYPES_FILE="src/types/$LOWER_NAME.ts"

echo "🚀 Génération de la page $PAGE_NAME..."

# Créer les dossiers
mkdir -p "$COMPONENT_DIR/modals"
mkdir -p "$COMPONENT_DIR/hooks"
mkdir -p "$HOOKS_DIR"

echo "📁 Structure créée:"
echo "  - $COMPONENT_DIR/"
echo "  - $HOOKS_DIR/"

# Template du composant principal
cat > "$COMPONENT_DIR/${PAGE_NAME}Page.tsx" << 'EOF'
import React from "react";
import { Box, Typography } from "@mui/material";

import AdminLayout from "../AdminLayout";
import { StatsCardGrid, FilterPanel, ActionToolbar } from "../shared";

// Hooks
import { use{{PAGE_NAME}} } from "../../hooks/{{LOWER_NAME}}/use{{PAGE_NAME}}";
import { use{{PAGE_NAME}}Modals } from "../../hooks/{{LOWER_NAME}}/use{{PAGE_NAME}}Modals";
import { useNotifications, useFilters, useExport } from "../../hooks/shared";

// Types
import { {{PAGE_NAME}}Filters } from "../../types/{{LOWER_NAME}}";

const initial{{PAGE_NAME}}Filters: {{PAGE_NAME}}Filters = {
  search: "",
  // Ajouter d'autres filtres selon les besoins
};

export const {{PAGE_NAME}}Page: React.FC = () => {
  // Hooks principaux
  const {{LOWER_NAME}} = use{{PAGE_NAME}}();
  const modals = use{{PAGE_NAME}}Modals();
  const notifications = useNotifications();
  const filters = useFilters({ initialFilters: initial{{PAGE_NAME}}Filters });
  const exportUtil = useExport();

  // Configuration des filtres
  const filterConfigs = [
    {
      key: "search",
      label: "Rechercher",
      type: "text" as const,
      placeholder: "Rechercher...",
    },
    // Ajouter d'autres configurations de filtres
  ];

  // Configuration des cartes de statistiques
  const statsCards = [
    {
      id: "total",
      title: "Total",
      value: 0, // Remplacer par les vraies données
      color: "primary" as const,
    },
    // Ajouter d'autres cartes
  ];

  return (
    <AdminLayout>
      <Box>
        <Typography variant="h4" component="h1" gutterBottom>
          {{PAGE_NAME}} Management
        </Typography>
        <Typography variant="body1" color="text.secondary">
          Gérer les {{LOWER_NAME}}s de l'application.
        </Typography>
      </Box>

      {/* Cartes de statistiques */}
      <StatsCardGrid cards={statsCards} />

      {/* Section principale */}
      <Box sx={{ mt: 2, border: "1px solid #ddd", borderRadius: 4, p: 2 }}>
        <Box sx={{ mb: 2 }}>
          <Typography variant="h6" gutterBottom>
            Liste des {{PAGE_NAME}}s
          </Typography>
        </Box>

        {/* Filtres */}
        <FilterPanel
          filters={filters.filters}
          filterConfigs={filterConfigs}
          onUpdateFilter={filters.updateFilter}
          onResetFilters={filters.resetFilters}
          onClearSearch={filters.clearSearch}
          hasActiveFilters={filters.hasActiveFilters()}
          activeFiltersCount={filters.getActiveFiltersCount()}
        />

        {/* Barre d'actions */}
        <ActionToolbar
          selectedCount={0} // Remplacer par la sélection réelle
          totalCount={0} // Remplacer par le total réel
          onExport={(format) => {
            // Implémenter l'export
          }}
        />

        {/* Tableau principal - À implémenter */}
        <Box sx={{ mt: 2 }}>
          <Typography>Tableau à implémenter</Typography>
        </Box>
      </Box>

      {/* Notifications */}
      {/* Implémenter les notifications */}
    </AdminLayout>
  );
};

export default {{PAGE_NAME}}Page;
EOF

# Template du hook principal
cat > "$HOOKS_DIR/use${PAGE_NAME}.ts" << 'EOF'
import { useState } from "react";
import { {{PAGE_NAME}}State } from "../../types/{{LOWER_NAME}}";

/**
 * Hook principal pour la gestion de l'état de la page {{PAGE_NAME}}
 */
export const use{{PAGE_NAME}} = () => {
  const [state, setState] = useState<{{PAGE_NAME}}State>({
    // État initial
  });

  // Actions principales
  const updateState = (updates: Partial<{{PAGE_NAME}}State>) => {
    setState(prev => ({ ...prev, ...updates }));
  };

  return {
    // État
    ...state,
    
    // Actions
    updateState,
  };
};

export default use{{PAGE_NAME}};
EOF

# Template du hook des modales
cat > "$HOOKS_DIR/use${PAGE_NAME}Modals.ts" << 'EOF'
import { useState } from "react";

/**
 * Hook pour la gestion des modales de la page {{PAGE_NAME}}
 */
export const use{{PAGE_NAME}}Modals = () => {
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

export default use{{PAGE_NAME}}Modals;
EOF

# Template des types
cat > "$TYPES_FILE" << 'EOF'
// Types pour la page {{PAGE_NAME}}
import { FilterState } from "../hooks/shared";

export interface {{PAGE_NAME}}Filters extends FilterState {
  // Ajouter des filtres spécifiques
}

export interface {{PAGE_NAME}}State {
  // Définir l'état de la page
}

// Autres types spécifiques à {{PAGE_NAME}}
EOF

# Template index des modales
cat > "$COMPONENT_DIR/modals/index.ts" << 'EOF'
// Export centralisé des modales {{PAGE_NAME}}
// export { Example{{PAGE_NAME}}Modal } from "./Example{{PAGE_NAME}}Modal";
EOF

# Remplacer les placeholders
sed -i '' "s/{{PAGE_NAME}}/$PAGE_NAME/g" "$COMPONENT_DIR/${PAGE_NAME}Page.tsx"
sed -i '' "s/{{LOWER_NAME}}/$LOWER_NAME/g" "$COMPONENT_DIR/${PAGE_NAME}Page.tsx"
sed -i '' "s/{{PAGE_NAME}}/$PAGE_NAME/g" "$HOOKS_DIR/use${PAGE_NAME}.ts"
sed -i '' "s/{{LOWER_NAME}}/$LOWER_NAME/g" "$HOOKS_DIR/use${PAGE_NAME}.ts"
sed -i '' "s/{{PAGE_NAME}}/$PAGE_NAME/g" "$HOOKS_DIR/use${PAGE_NAME}Modals.ts"
sed -i '' "s/{{PAGE_NAME}}/$PAGE_NAME/g" "$TYPES_FILE"

echo "✅ Page $PAGE_NAME générée avec succès!"
echo ""
echo "📋 Prochaines étapes:"
echo "  1. Implémenter la logique métier dans use${PAGE_NAME}.ts"
echo "  2. Ajouter les types spécifiques dans $TYPES_FILE"
echo "  3. Créer les modales nécessaires dans $COMPONENT_DIR/modals/"
echo "  4. Implémenter le tableau principal"
echo "  5. Ajouter les hooks de données (useQuery, etc.)"
echo "  6. Mettre à jour le routing dans src/routes/routes.tsx"
echo ""
echo "📖 Documentation: Consulter GLOBAL_REFACTORING_PLAN.md"
