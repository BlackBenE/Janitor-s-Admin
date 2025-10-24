# 🔍 Plan de Migration Détaillé - Français 100%

## 📋 État Actuel (24 octobre 2025)

### ✅ Modules Déjà Migrés

1. **Form.tsx** - Validation de formulaires ✅
2. **profileButton.tsx** - Menu profil utilisateur ✅
3. **Sidebar.tsx** - Navigation latérale ✅
4. **UserManagement** - Module complet ✅
5. **Payments** - Colonnes de table ✅
6. **Auth** - Authentification ✅
7. **Dashboard** - Graphiques, stats, activités ✅
   - DashboardChartsSection.tsx ✅
   - DashboardActivitiesSection.tsx ✅
   - DashboardStatsCards.tsx ✅
8. **Quote Requests** - Module complet ✅
   - QuoteRequestsPage.tsx ✅
   - QuoteRequestHeader.tsx ✅
   - QuoteRequestStatsSection.tsx ✅
9. **Property Approvals** - Composants principaux ✅
   - PropertyHeader.tsx ✅
   - PropertyTableConfig.tsx (headers) ✅

### 🔴 Modules Avec Textes Anglais Détectés

#### 1. **Dashboard** (Priorité HAUTE)

**Fichiers concernés:**

- `DashboardChartsSection.tsx`

  - "Monthly Revenue" → "Revenu mensuel"
  - "Revenue trends over the last 6 months" → "Tendances du revenu sur les 6 derniers mois"
  - "Revenue (€)" → "Revenu (€)"
  - "User Growth" → "Croissance des utilisateurs"
  - "Active user growth over time" → "Croissance des utilisateurs actifs"
  - "Active Users" → "Utilisateurs actifs"

- `DashboardActivitiesSection.tsx`

  - "Pending" → "En attente"
  - "Review Required" → "Révision requise"
  - "Completed" → "Terminé"

- `DashboardStatsCards.tsx`
  - À vérifier (déjà partiellement en français)

**Labels à ajouter:**

```typescript
dashboard: {
  charts: {
    monthlyRevenue: "Revenu mensuel",
    revenueSubtitle: "Tendances du revenu sur les 6 derniers mois",
    revenueLabel: "Revenu (€)",
    userGrowth: "Croissance des utilisateurs",
    userGrowthSubtitle: "Croissance des utilisateurs actifs",
    activeUsersLabel: "Utilisateurs actifs",
  },
  activities: {
    pending: "En attente",
    reviewRequired: "Révision requise",
    completed: "Terminé",
  },
}
```

#### 2. **Quote Requests** (Priorité HAUTE)

**Fichiers à explorer:**

- `QuoteRequestsPage.tsx`
- `QuoteRequestHeader.tsx`
- `QuoteRequestStatsSection.tsx`
- Composants dans `components/`
- Modales dans `modals/`

**Labels probables:**

```typescript
quoteRequests: {
  title: "Demandes de devis",
  headers: {
    id: "ID",
    service: "Service",
    client: "Client",
    status: "Statut",
    date: "Date",
    actions: "Actions",
  },
  status: {
    pending: "En attente",
    approved: "Approuvé",
    rejected: "Rejeté",
  },
  actions: {
    view: "Voir détails",
    approve: "Approuver",
    reject: "Rejeter",
  },
}
```

#### 3. **Property Approvals** (Priorité HAUTE)

**Fichiers concernés:**

- `PropertyApprovalsPage.tsx`
- `PropertyTableConfig.tsx`
- Composants dans `components/`
- Modales dans `modals/`

**Labels probables:**

```typescript
propertyApprovals: {
  title: "Approbations de propriétés",
  headers: {
    name: "Nom",
    owner: "Propriétaire",
    location: "Localisation",
    status: "Statut",
    submittedDate: "Date de soumission",
    actions: "Actions",
  },
  status: {
    pending: "En attente",
    approved: "Approuvé",
    rejected: "Rejeté",
  },
  actions: {
    view: "Voir détails",
    approve: "Approuver",
    reject: "Rejeter",
    setPending: "Mettre en attente",
    delete: "Supprimer",
  },
}
```

#### 4. **Composants Génériques** (Priorité MOYENNE)

- `Table.tsx` - Actions génériques
- `SearchBar.tsx` - Placeholder de recherche
- `Modal.tsx` - Boutons et messages
- `NotificationCenter.tsx` - Notifications
- `NotificationDrawer.tsx` - Tiroir de notifications
- `CommunicationDrawer.tsx` - Communications

#### 5. **Autres Composants** (Priorité BASSE)

- `AdminLayout.tsx`
- `CustomAppBar.tsx`
- `ProtectedRoute.tsx`
- `SearchResults.tsx`
- `AnalyticsChart.tsx`
- `BarCharts.tsx`
- `DashboardItem.tsx`
- `InfoCard.tsx`
- `MetricsSummary.tsx`
- `ActivityItem.tsx`

---

## 🎯 Plan d'Action

### Phase 6: Dashboard (30 min)

1. Ajouter labels dashboard dans `constants/labels.ts`
2. Migrer `DashboardChartsSection.tsx`
3. Migrer `DashboardActivitiesSection.tsx`
4. Migrer `DashboardStatsCards.tsx`
5. Valider avec `get_errors`

### Phase 7: Quote Requests (45 min)

1. Explorer tous les fichiers du module
2. Ajouter labels dans `constants/labels.ts`
3. Migrer page principale
4. Migrer composants
5. Migrer modales
6. Valider avec `get_errors`

### Phase 8: Property Approvals (45 min)

1. Explorer tous les fichiers du module
2. Ajouter labels dans `constants/labels.ts`
3. Migrer page principale
4. Migrer `PropertyTableConfig.tsx`
5. Migrer composants et modales
6. Valider avec `get_errors`

### Phase 9: Composants Génériques (30 min)

1. Table.tsx
2. SearchBar.tsx
3. Modal.tsx
4. Drawers (Notification, Communication)

### Phase 10: Validation Finale (15 min)

1. Grep search exhaustif pour détecter textes anglais restants
2. Vérifier tous les modules un par un
3. Tester visuellement l'application
4. Mettre à jour MIGRATION_FRANCAIS.md

---

## 📊 Temps Estimé Total

- **Phase 6-10**: ~2h45
- **Total depuis début**: ~4h05

---

## ✅ Checklist de Validation

Pour chaque module:

- [ ] Labels ajoutés dans `constants/labels.ts`
- [ ] Imports ajoutés dans les fichiers
- [ ] Tous les textes anglais remplacés
- [ ] `get_errors` retourne 0 erreurs
- [ ] Grep search ne trouve plus de texte anglais
- [ ] Test visuel de l'interface

---

## 🔍 Commandes de Validation

```bash
# Chercher textes anglais restants
grep -r "User\|Status\|Action\|Delete\|Edit\|View" src/components --include="*.tsx"

# Vérifier erreurs TypeScript
tsc --noEmit

# Lancer l'app pour test visuel
npm run dev
```

---

**Note**: Ce document sera mis à jour au fur et à mesure de l'avancement.
