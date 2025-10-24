# 📋 SUIVI MIGRATION SHARED - Phase Composants Partagés

**Date de début** : 24 octobre 2025  
**Durée estimée** : 45-60 min  
**Statut** : 🟡 EN COURS

---

## 🎯 OBJECTIF

Migrer tous les composants, hooks et utils partagés vers `src/shared/` pour établir une bibliothèque de composants réutilisables.

---

## 📦 ÉTAPE SHARED : MIGRATION COMPOSANTS PARTAGÉS (60 MIN)

**Status** : 🟡 EN COURS

### Vue d'ensemble

```
src/
├── components/              → src/shared/components/
│   ├── Table.tsx           → ui/Table/
│   ├── Modal.tsx           → feedback/Modal/
│   ├── SearchBar.tsx       → forms/SearchBar/
│   ├── AdminLayout.tsx     → layout/AdminLayout/
│   ├── Sidebar.tsx         → layout/Sidebar/
│   ├── CustomAppBar.tsx    → layout/CustomAppBar/
│   └── shared/             → shared/components/
│
├── hooks/shared/            → src/shared/hooks/
├── utils/                   → src/shared/utils/
└── types/ (partiels)        → src/shared/types/
```

---

### Sous-étape 1 : Identifier les composants partagés (5 min)

**Status** : ⏸️ EN ATTENTE

#### 1.1 Lister les composants à la racine de components/
- [ ] Identifier tous les fichiers .tsx/.ts à la racine de `src/components/`
- [ ] Classifier par catégorie (ui, layout, forms, feedback, data-display)

#### 1.2 Analyser le dossier components/shared/
- [ ] Lister les composants dans `src/components/shared/`
- [ ] Vérifier les dépendances

---

### Sous-étape 2 : Migration Layout (15 min)

**Status** : ⏸️ EN ATTENTE

#### 2.1 Créer la structure layout
- [ ] Créer `src/shared/components/layout/`

#### 2.2 Migrer les composants layout
- [ ] `AdminLayout.tsx` → `layout/AdminLayout/AdminLayout.tsx`
- [ ] `Sidebar.tsx` → `layout/Sidebar/Sidebar.tsx`
- [ ] `CustomAppBar.tsx` → `layout/CustomAppBar/CustomAppBar.tsx`
- [ ] `ProfileMenu.tsx` → `layout/ProfileMenu/ProfileMenu.tsx`
- [ ] `profileButton.tsx` → `layout/ProfileButton/ProfileButton.tsx`

#### 2.3 Créer les fichiers index
- [ ] Créer `layout/AdminLayout/index.ts`
- [ ] Créer `layout/Sidebar/index.ts`
- [ ] Créer `layout/CustomAppBar/index.ts`
- [ ] Créer `layout/index.ts` (exports globaux)

---

### Sous-étape 3 : Migration Data Display (10 min)

**Status** : ⏸️ EN ATTENTE

#### 3.1 Créer la structure data-display
- [ ] Créer `src/shared/components/data-display/`

#### 3.2 Migrer les composants
- [ ] `Table.tsx` → `data-display/Table/Table.tsx`
- [ ] `InfoCard.tsx` → `data-display/InfoCard/InfoCard.tsx`
- [ ] `DashboardItem.tsx` → `data-display/DashboardItem/DashboardItem.tsx`
- [ ] `ActivityItem.tsx` → `data-display/ActivityItem/ActivityItem.tsx`
- [ ] `MetricsSummary.tsx` → `data-display/MetricsSummary/MetricsSummary.tsx`
- [ ] `MetricsSummarySimplified.tsx` → `data-display/MetricsSummarySimplified/MetricsSummarySimplified.tsx`
- [ ] `AnalyticsChart.tsx` → `data-display/AnalyticsChart/AnalyticsChart.tsx`
- [ ] `BarCharts.tsx` → `data-display/BarCharts/BarCharts.tsx`

#### 3.3 Créer les fichiers index
- [ ] Créer index.ts pour chaque composant
- [ ] Créer `data-display/index.ts` (exports globaux)

---

### Sous-étape 4 : Migration Forms (5 min)

**Status** : ⏸️ EN ATTENTE

#### 4.1 Créer la structure forms
- [ ] Créer `src/shared/components/forms/`

#### 4.2 Migrer les composants
- [ ] `Form.tsx` → `forms/Form/Form.tsx`
- [ ] `SearchBar.tsx` → `forms/SearchBar/SearchBar.tsx`

#### 4.3 Créer les fichiers index
- [ ] Créer index.ts pour chaque composant
- [ ] Créer `forms/index.ts` (exports globaux)

---

### Sous-étape 5 : Migration Feedback (5 min)

**Status** : ⏸️ EN ATTENTE

#### 5.1 Créer la structure feedback
- [ ] Créer `src/shared/components/feedback/`

#### 5.2 Migrer les composants
- [ ] `Modal.tsx` → `feedback/Modal/Modal.tsx`
- [ ] `IconButtonWithBadge.tsx` → `feedback/IconButtonWithBadge/IconButtonWithBadge.tsx`

#### 5.3 Créer les fichiers index
- [ ] Créer index.ts pour chaque composant
- [ ] Créer `feedback/index.ts` (exports globaux)

---

### Sous-étape 6 : Migration components/shared/ (10 min)

**Status** : ⏸️ EN ATTENTE

#### 6.1 Migrer les composants du dossier shared
- [ ] `FilterPanel.tsx` → `shared/components/filters/FilterPanel/`
- [ ] `GenericFilters.tsx` → `shared/components/filters/GenericFilters/`
- [ ] `GenericTabs.tsx` → `shared/components/navigation/GenericTabs/`
- [ ] `StatsCardGrid.tsx` → `shared/components/data-display/StatsCardGrid/`
- [ ] `LoadingIndicator.tsx` → `shared/components/feedback/LoadingIndicator/`
- [ ] `CacheStatusIndicator.tsx` → `shared/components/feedback/CacheStatusIndicator/`
- [ ] `ActionToolbar.tsx` → `shared/components/ui/ActionToolbar/`
- [ ] `GenericTableColumns.tsx` → `shared/components/data-display/GenericTableColumns/`

#### 6.2 Migrer les configs
- [ ] `filterConfigs.ts` + `filterConfigs.examples.ts` → `shared/components/filters/configs/`
- [ ] `tabConfigs.ts` + `tabConfigs.examples.ts` → `shared/components/navigation/configs/`

#### 6.3 Créer les fichiers index
- [ ] Créer index.ts pour chaque sous-catégorie
- [ ] Mettre à jour `shared/components/index.ts`

---

### Sous-étape 7 : Migration autres composants (5 min)

**Status** : ⏸️ EN ATTENTE

#### 7.1 Composants restants
- [ ] `ProtectedRoute.tsx` → `shared/components/routing/ProtectedRoute/`
- [ ] `SearchResults.tsx` → `shared/components/search/SearchResults/`
- [ ] `ClickMenu.tsx` → `shared/components/ui/ClickMenu/`
- [ ] `CommunicationDrawer.tsx` → `shared/components/communication/CommunicationDrawer/`

---

### Sous-étape 8 : Migration hooks/shared/ (10 min)

**Status** : ⏸️ EN ATTENTE

#### 8.1 Migrer les hooks partagés
- [ ] `hooks/shared/useAudit.ts` → `shared/hooks/useAudit.ts`
- [ ] `hooks/shared/useAuditMutations.ts` → `shared/hooks/useAuditMutations.ts`
- [ ] `hooks/shared/useAuditQueries.ts` → `shared/hooks/useAuditQueries.ts`
- [ ] `hooks/shared/useDataTable.ts` → `shared/hooks/useDataTable.ts`
- [ ] `hooks/shared/useExport.ts` → `shared/hooks/useExport.ts`
- [ ] `hooks/shared/useFilters.ts` → `shared/hooks/useFilters.ts`
- [ ] `hooks/shared/useHighlightFromUrl.ts` → `shared/hooks/useHighlightFromUrl.ts`
- [ ] `hooks/shared/useUINotifications.ts` → `shared/hooks/useUINotifications.ts`

#### 8.2 Créer les fichiers index
- [ ] Créer `shared/hooks/index.ts` avec tous les exports

---

### Sous-étape 9 : Migration utils/ (5 min)

**Status** : ⏸️ EN ATTENTE

#### 9.1 Migrer les utils
- [ ] `utils/constants.ts` → `shared/utils/constants.ts`
- [ ] `utils/dataHelpers.ts` → `shared/utils/dataHelpers.ts`
- [ ] `utils/formatting.ts` → `shared/utils/formatting.ts`
- [ ] `utils/statusHelpers.ts` → `shared/utils/statusHelpers.ts`
- [ ] `utils/validation.ts` → `shared/utils/validation.ts`

#### 9.2 Créer les fichiers index
- [ ] Créer `shared/utils/index.ts` avec tous les exports

---

### Sous-étape 10 : Mise à jour des imports (5 min)

**Status** : ⏸️ EN ATTENTE

#### 10.1 Mettre à jour les imports internes
- [ ] Mettre à jour les imports dans les composants migrés
- [ ] Utiliser les path aliases `@/shared/components/...`

#### 10.2 Note sur les imports externes
Les autres fichiers (features) utiliseront encore les anciens chemins.
On créera des fichiers de transition plus tard.

---

### Sous-étape 11 : Tests et validation (3 min)

**Status** : ⏸️ EN ATTENTE

#### 11.1 Vérifications
- [ ] Commande : `npm run build`
- [ ] Vérification : Build réussit sans erreur
- [ ] Pas d'erreurs TypeScript

---

### Sous-étape 12 : Commit (2 min)

**Status** : ⏸️ EN ATTENTE

#### 12.1 Git
- [ ] Commande : `git status`
- [ ] Commande : `git add src/shared/`
- [ ] Commande : `git commit -m "feat(shared): migrate shared components, hooks and utils"`
- [ ] Vérification : Commit créé avec succès

---

## ✅ CHECKPOINT SHARED

**Avant de passer à FEATURES, vérifie** :
- [ ] ✅ `src/shared/components/` contient tous les composants partagés
- [ ] ✅ `src/shared/hooks/` contient tous les hooks partagés
- [ ] ✅ `src/shared/utils/` contient tous les utils
- [ ] ✅ Structure organisée par catégories
- [ ] ✅ Fichiers index.ts créés partout
- [ ] ✅ `npm run build` réussit sans erreur
- [ ] ✅ Commit effectué

**Temps écoulé** : _____ minutes

---

## 📝 STRATÉGIE

### Organisation des composants

```
shared/components/
├── layout/          # Layouts (AdminLayout, Sidebar, etc.)
├── forms/           # Form components (Form, SearchBar, etc.)
├── feedback/        # Feedback (Modal, Loading, etc.)
├── data-display/    # Data display (Table, Cards, etc.)
├── navigation/      # Navigation (Tabs, Menu, etc.)
├── routing/         # Routing (ProtectedRoute, etc.)
├── filters/         # Filters (FilterPanel, etc.)
├── search/          # Search (SearchResults, etc.)
├── ui/              # Generic UI (Button, etc.)
└── communication/   # Communication (Drawer, etc.)
```

### Convention de nommage

Chaque composant aura sa propre structure :
```
ComponentName/
├── ComponentName.tsx
├── ComponentName.styles.ts (si styles custom)
├── ComponentName.test.tsx (si tests)
└── index.ts (export)
```

---

**Dernière mise à jour** : 24 octobre 2025
