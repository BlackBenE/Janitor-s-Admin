# 🗺️ DIAGRAMMES ARCHITECTURE - Vue d'ensemble visuelle

**Date**: 24 octobre 2025  
**Type**: Schémas ASCII pour documentation

---

## 📊 VUE D'ENSEMBLE - ARCHITECTURE ACTUELLE VS CIBLE

```
┌─────────────────────────────────────────────────────────────────────────┐
│                        ARCHITECTURE ACTUELLE                             │
│                          ⚠️  Score: 6.8/10                              │
└─────────────────────────────────────────────────────────────────────────┘

src/
├── components/                    ⚠️  PROBLÈME: Mix incohérent
│   ├── dashboard/                 ✅  Feature-based
│   ├── userManagement/            ✅  Feature-based
│   ├── property-approvals/        ✅  Feature-based
│   ├── Table.tsx                  ❌  Composant racine (mal placé)
│   ├── AdminLayout.tsx            ❌  Composant racine (mal placé)
│   └── Modal.tsx                  ❌  Composant racine (mal placé)
│
├── hooks/                         ⚠️  PROBLÈME: Séparation incohérente
│   ├── shared/                    ✅  Bien
│   ├── profile/                   ❌  Devrait être dans components/profile/
│   └── providers-moderation/      ❌  Devrait être dans feature
│
├── providers/                     ✅  OK
├── services/                      ✅  OK
├── types/                         ✅  OK
├── utils/                         ✅  OK
└── routes/                        ✅  OK

❌ Imports relatifs complexes: import { X } from '../../../types'
❌ Fichiers volumineux: >500 lignes
❌ Tests absents
❌ Pas de convention claire

┌─────────────────────────────────────────────────────────────────────────┐
│                        ARCHITECTURE CIBLE                                │
│                          ✅  Score: 8.5-9/10                            │
└─────────────────────────────────────────────────────────────────────────┘

src/
├── app/                           🆕  Configuration application
│   ├── App.tsx
│   ├── main.tsx
│   ├── router.tsx
│   └── providers/
│       └── AppProviders.tsx
│
├── features/                      🆕  Domaines métier autonomes
│   ├── users/
│   │   ├── components/
│   │   ├── hooks/
│   │   ├── api/
│   │   ├── types/
│   │   ├── routes.tsx
│   │   ├── __tests__/
│   │   └── index.ts
│   ├── properties/
│   ├── analytics/
│   └── [autres domaines...]
│
├── shared/                        🆕  Code partagé réutilisable
│   ├── components/
│   │   ├── ui/
│   │   ├── forms/
│   │   ├── data-display/
│   │   ├── feedback/
│   │   └── layout/
│   ├── hooks/
│   ├── utils/
│   └── types/
│
├── core/                          🆕  Infrastructure
│   ├── api/
│   ├── config/
│   ├── services/
│   └── types/
│
└── test/                          🆕  Configuration tests
    ├── setup.ts
    ├── mocks/
    └── utils/

✅ Imports clairs: import { X } from '@/features/users'
✅ Fichiers courts: <300 lignes
✅ Tests colocalisés
✅ Convention claire et cohérente
```

---

## 🔄 FLUX DE DÉPENDANCES

```
┌─────────────────────────────────────────────────────────────────────┐
│                     RÈGLE DES DÉPENDANCES                            │
│                                                                      │
│   Les dépendances vont toujours vers l'intérieur (→)               │
│   Jamais dans l'autre sens (←)                                      │
└─────────────────────────────────────────────────────────────────────┘

┌──────────────┐
│  Features    │  (Domaines métier)
│              │
│  ├─ users    │
│  ├─ products │
│  └─ orders   │
└──────┬───────┘
       │ import { Table } from '@/shared'
       │ import { api } from '@/core'
       ↓
┌──────────────┐
│   Shared     │  (Composants/Hooks/Utils partagés)
│              │
│  ├─ Button   │
│  ├─ Table    │
│  └─ useDebou │
└──────┬───────┘
       │ import { supabase } from '@/core'
       │ import { theme } from '@/core'
       ↓
┌──────────────┐
│    Core      │  (Infrastructure)
│              │
│  ├─ api      │
│  ├─ config   │
│  └─ services │
└──────────────┘

✅ AUTORISÉ:
   features → shared → core

❌ INTERDIT:
   core → shared ❌
   shared → features ❌
   core → features ❌
```

---

## 🏗️ STRUCTURE D'UNE FEATURE

```
┌─────────────────────────────────────────────────────────────────────┐
│                 ANATOMIE D'UNE FEATURE MODULE                        │
│                    (Example: users)                                  │
└─────────────────────────────────────────────────────────────────────┘

features/users/
│
├── index.ts                      📄 Public API (Point d'entrée unique)
│   export * from './components'
│   export * from './hooks'
│   export * from './types'
│   export { usersRoutes } from './routes'
│
├── routes.tsx                    🛣️  Routes du domaine
│   const UserList = lazy(...)
│   export const usersRoutes = [...]
│
├── components/                   🎨 UI Components
│   ├── UserList/
│   │   ├── UserList.tsx
│   │   ├── UserListItem.tsx
│   │   ├── UserListFilters.tsx
│   │   └── index.ts
│   ├── UserDetails/
│   ├── UserForm/
│   └── modals/
│
├── hooks/                        🪝 Logique métier
│   ├── useUsers.ts              (Queries - lecture)
│   ├── useUserMutations.ts      (Mutations - écriture)
│   ├── useUserFilters.ts        (Filtres)
│   └── index.ts
│
├── api/                          🌐 Appels API
│   ├── users.api.ts             (Endpoints)
│   ├── users.queries.ts         (TanStack Query keys)
│   └── index.ts
│
├── types/                        📝 Types TypeScript
│   ├── user.types.ts
│   ├── user-filters.types.ts
│   └── index.ts
│
├── utils/                        🔧 Helpers spécifiques
│   ├── user-formatters.ts
│   └── index.ts
│
├── stores/                       💾 État UI (Zustand)
│   ├── useUserStore.ts
│   └── index.ts
│
└── __tests__/                    🧪 Tests colocalisés
    ├── UserList.test.tsx
    ├── useUsers.test.ts
    └── users.api.test.ts

┌─────────────────────────────────────────────────────────┐
│  PRINCIPE: Tout ce dont la feature a besoin est dedans │
│  ✅ Auto-suffisant                                      │
│  ✅ Facile à trouver                                    │
│  ✅ Facile à tester                                     │
│  ✅ Facile à supprimer si nécessaire                    │
└─────────────────────────────────────────────────────────┘
```

---

## 🎯 IMPORTS - AVANT VS APRÈS

```
┌─────────────────────────────────────────────────────────────────────┐
│                    ❌ AVANT (Problématique)                         │
└─────────────────────────────────────────────────────────────────────┘

// components/property-approvals/PropertyApprovalsPage.tsx

import { useAuth } from "../../providers/authProvider";
import { Property } from "../../types";
import { LABELS } from "../../constants/labels";
import { getStatusLabel } from "../../utils/statusHelpers";
import DataTable from "../Table";
import ActivityItem from "../ActivityItem";
import { useProperties } from "../../hooks/properties";

// 😱 Problèmes:
// 1. Imports relatifs difficiles à maintenir
// 2. Difficulté à refactorer (beaucoup de chemins à changer)
// 3. Pas clair d'où viennent les modules
// 4. IDE moins performant (pas d'autocomplétion optimale)


┌─────────────────────────────────────────────────────────────────────┐
│                     ✅ APRÈS (Solution)                             │
└─────────────────────────────────────────────────────────────────────┘

// features/properties/components/PropertyList.tsx

import { useAuth } from '@/app/providers/AuthProvider';
import { Property } from '@/features/properties/types';
import { LABELS } from '@/core/constants';
import { getStatusLabel } from '@/shared/utils';
import { Table, ActivityItem } from '@/shared/components';
import { useProperties } from '@/features/properties/hooks';

// ✨ Avantages:
// 1. Imports absolus clairs et maintenables
// 2. Facile à refactorer (chemins stables)
// 3. Clair d'où vient chaque module
// 4. IDE performant (autocomplétion parfaite)
// 5. Recherche globale plus efficace


┌─────────────────────────────────────────────────────────────────────┐
│                  CONVENTION D'IMPORTS                                │
└─────────────────────────────────────────────────────────────────────┘

Ordre recommandé:

// 1. React et bibliothèques externes
import { useState } from 'react';
import { useQuery } from '@tanstack/react-query';

// 2. App/Core
import { useAuth } from '@/app/providers';
import { supabase } from '@/core/api';

// 3. Features (autres domaines)
import { User } from '@/features/users';

// 4. Feature actuelle (imports relatifs OK dans la feature)
import { PropertyCard } from './PropertyCard';
import { useProperties } from '../hooks';

// 5. Shared
import { Button, Table } from '@/shared/components';
import { formatDate } from '@/shared/utils';

// 6. Styles
import './styles.css';
```

---

## 🔄 FLUX DE DONNÉES (TanStack Query)

```
┌─────────────────────────────────────────────────────────────────────┐
│           ARCHITECTURE DATA FETCHING (TanStack Query)                │
└─────────────────────────────────────────────────────────────────────┘

┌──────────────────┐
│   UI Component   │  (features/users/components/UserList.tsx)
│                  │
│  const { data,   │
│    isLoading,    │
│    error }       │
│  = useUsers()    │
└────────┬─────────┘
         │
         │ Hook appelle
         ↓
┌──────────────────┐
│   Custom Hook    │  (features/users/hooks/useUsers.ts)
│                  │
│  return useQuery(│
│    userQueries.  │
│    all(filters)  │
│  )               │
└────────┬─────────┘
         │
         │ Configuration
         ↓
┌──────────────────┐
│  Query Options   │  (features/users/api/users.queries.ts)
│                  │
│  queryOptions({  │
│    queryKey,     │
│    queryFn       │
│  })              │
└────────┬─────────┘
         │
         │ Appelle
         ↓
┌──────────────────┐
│    API Layer     │  (features/users/api/users.api.ts)
│                  │
│  async getAll()  │
│  → supabase      │
│    .from()       │
│    .select()     │
└────────┬─────────┘
         │
         │ Appelle
         ↓
┌──────────────────┐
│  Supabase Client │  (core/api/supabase.ts)
│                  │
│  createClient()  │
└────────┬─────────┘
         │
         │ HTTP Request
         ↓
┌──────────────────┐
│    Supabase      │
│    Backend       │
└──────────────────┘

┌─────────────────────────────────────────────────────────────────────┐
│  AVANTAGES DE CETTE ARCHITECTURE:                                   │
│                                                                      │
│  ✅ Cache automatique (TanStack Query)                              │
│  ✅ Invalidation ciblée (par query key)                             │
│  ✅ Loading/Error states gérés                                      │
│  ✅ Retry automatique                                               │
│  ✅ Background refetch                                              │
│  ✅ Facile à tester (mock à chaque niveau)                          │
│  ✅ Type-safe (TypeScript end-to-end)                               │
└─────────────────────────────────────────────────────────────────────┘
```

---

## 🧪 STRATÉGIE DE TESTS

```
┌─────────────────────────────────────────────────────────────────────┐
│                      PYRAMIDE DES TESTS                              │
└─────────────────────────────────────────────────────────────────────┘

                    ▲
                   ╱ ╲
                  ╱   ╲              🔵 E2E Tests
                 ╱     ╲             Playwright
                ╱  🔵   ╲            (Quelques flows critiques)
               ╱         ╲           5% des tests
              ╱───────────╲
             ╱             ╲
            ╱      🟢       ╲        🟢 Integration Tests
           ╱                 ╲       Vitest + Testing Library
          ╱    Integration    ╲      (Composants + Hooks)
         ╱                     ╲     25% des tests
        ╱───────────────────────╲
       ╱                         ╲
      ╱          🟡               ╲  🟡 Unit Tests
     ╱                             ╲ Vitest
    ╱          Unit Tests           ╲ (Utils, Helpers, Pure functions)
   ╱                                 ╲ 70% des tests
  ╱───────────────────────────────────╲

┌─────────────────────────────────────────────────────────────────────┐
│  COUVERTURE RECOMMANDÉE PAR TYPE                                    │
├─────────────────────────────────────────────────────────────────────┤
│  Unit Tests (70%)        → utils, helpers, pure functions           │
│  Integration (25%)       → components, hooks, API                   │
│  E2E (5%)                → flows critiques utilisateur              │
│                                                                      │
│  OBJECTIF GLOBAL: 60%+ coverage                                     │
└─────────────────────────────────────────────────────────────────────┘

┌─────────────────────────────────────────────────────────────────────┐
│  EXEMPLE: Feature "users"                                           │
├─────────────────────────────────────────────────────────────────────┤
│                                                                      │
│  __tests__/                                                         │
│  ├── UserList.test.tsx          🟢 Integration                      │
│  │   → Render + interactions                                        │
│  │                                                                   │
│  ├── useUsers.test.ts            🟢 Integration                      │
│  │   → Hook avec mock API                                           │
│  │                                                                   │
│  ├── users.api.test.ts           🟢 Integration                      │
│  │   → API avec MSW                                                 │
│  │                                                                   │
│  └── user-formatters.test.ts    🟡 Unit                             │
│      → Pure functions                                               │
│                                                                      │
│  e2e/                                                               │
│  └── users-flow.spec.ts          🔵 E2E                             │
│      → Login → Liste → Détails → Modification                       │
└─────────────────────────────────────────────────────────────────────┘
```

---

## 📦 DÉPLOIEMENT ET CI/CD

```
┌─────────────────────────────────────────────────────────────────────┐
│                      PIPELINE CI/CD                                  │
└─────────────────────────────────────────────────────────────────────┘

┌─────────────┐
│   Git Push  │
└──────┬──────┘
       │
       ↓
┌──────────────────────────────────────────────────────────────────┐
│                      GitHub Actions                               │
├──────────────────────────────────────────────────────────────────┤
│                                                                   │
│  ┌──────────────┐  ┌──────────────┐  ┌──────────────┐          │
│  │   Install    │→ │     Lint     │→ │  Type Check  │          │
│  │ Dependencies │  │   (ESLint)   │  │      (tsc)   │          │
│  └──────────────┘  └──────────────┘  └──────────────┘          │
│                                                                   │
│                     ┌──────────────┐                             │
│                  →  │  Unit Tests  │                             │
│                     │   (Vitest)   │                             │
│                     └──────┬───────┘                             │
│                            │                                      │
│                            ↓                                      │
│                     ┌──────────────┐                             │
│                     │   Coverage   │                             │
│                     │   Report     │                             │
│                     └──────┬───────┘                             │
│                            │                                      │
│                            ↓                                      │
│                     ┌──────────────┐                             │
│                     │    Build     │                             │
│                     │    (Vite)    │                             │
│                     └──────┬───────┘                             │
│                            │                                      │
│         ┌──────────────────┴──────────────────┐                 │
│         ↓                                      ↓                  │
│  ┌──────────────┐                      ┌──────────────┐         │
│  │   E2E Tests  │                      │   Deploy     │         │
│  │ (Playwright) │                      │   Preview    │         │
│  └──────────────┘                      └──────┬───────┘         │
│                                               │                  │
└───────────────────────────────────────────────┼──────────────────┘
                                                │
                  ┌─────────────────────────────┴─────────────────┐
                  ↓                                               ↓
         ┌─────────────────┐                           ┌─────────────────┐
         │   Production    │                           │    Staging      │
         │   (if main)     │                           │  (if develop)   │
         └─────────────────┘                           └─────────────────┘

┌─────────────────────────────────────────────────────────────────────┐
│  ÉTAPES CRITIQUES:                                                   │
│                                                                      │
│  ✅ Lint         → Code quality                                     │
│  ✅ Type Check   → TypeScript validation                            │
│  ✅ Tests        → Functional validation                            │
│  ✅ Coverage     → Quality metrics                                  │
│  ✅ Build        → Production readiness                             │
│  ✅ E2E          → User flows validation                            │
│  ✅ Deploy       → Automated deployment                             │
└─────────────────────────────────────────────────────────────────────┘
```

---

## 🎯 TIMELINE DE MIGRATION

```
┌─────────────────────────────────────────────────────────────────────┐
│                    PLANNING 6 SEMAINES                               │
└─────────────────────────────────────────────────────────────────────┘

SEMAINE 1: Fondations
├─ Lundi        │████████│ Path aliases + Tests setup
├─ Mardi        │████████│ Structure cible + Prettier
├─ Mercredi     │████████│ Premier test + validation
└─ Jeudi-Vend   │████████│ Buffer + documentation
                          └─ ✅ CHECKPOINT 1: Infra prête

SEMAINE 2: Shared
├─ Lundi-Mardi  │████████│ Migration composants partagés
├─ Mercredi     │████████│ Migration hooks partagés
└─ Jeudi-Vend   │████████│ Migration utils + types
                          └─ ✅ CHECKPOINT 2: Shared migré

SEMAINE 3: Core
├─ Lundi        │████████│ Configuration (env, theme, query)
├─ Mardi        │████████│ API (supabase, base api)
├─ Mercredi     │████████│ Types database
└─ Jeudi-Vend   │████████│ Providers + validation
                          └─ ✅ CHECKPOINT 3: Core centralisé

SEMAINE 4: Features (Part 1)
├─ Lundi        │████████│ auth + profile
├─ Mardi        │████████│ analytics
├─ Mercredi     │████████│ services
└─ Jeudi-Vend   │████████│ quotes
                          └─ ✅ CHECKPOINT 4: 4 features migrées

SEMAINE 5: Features (Part 2)
├─ Lundi-Mardi  │████████│ payments
├─ Mercredi-Jeu │████████│ properties (complexe)
└─ Vendredi     │████████│ users (très complexe - début)


SEMAINE 5-6: users (suite) + Finalisation
├─ Lundi-Mardi  │████████│ users (fin + tests)
├─ Mercredi     │████████│ Nettoyage code
├─ Jeudi        │████████│ Tests E2E + CI/CD
└─ Vendredi     │████████│ Documentation + review
                          └─ ✅ CHECKPOINT FINAL: Migration complète

┌─────────────────────────────────────────────────────────────────────┐
│  JALONS IMPORTANTS:                                                  │
│                                                                      │
│  ✅ Fin Semaine 1  → Infrastructure prête                           │
│  ✅ Fin Semaine 3  → Shared + Core migrés                           │
│  ✅ Fin Semaine 5  → Tous domaines migrés                           │
│  ✅ Fin Semaine 6  → Projet finalisé et documenté                   │
└─────────────────────────────────────────────────────────────────────┘
```

---

## 📊 MÉTRIQUES DE SUCCÈS

```
┌─────────────────────────────────────────────────────────────────────┐
│                  INDICATEURS DE PERFORMANCE                          │
└─────────────────────────────────────────────────────────────────────┘

┌──────────────────────────────────────────────────────────────────┐
│  AVANT                                                            │
├──────────────────────────────────────────────────────────────────┤
│                                                                   │
│  📊 Architecture Score:     6.8/10                               │
│  📁 Imports relatifs:       100% (../../../)                     │
│  📝 Taille fichiers moy:    400 lignes                           │
│  🧪 Couverture tests:       0%                                   │
│  ⏱️  Temps ajout feature:    2-3 jours                           │
│  👥 Temps onboarding:       2 semaines                           │
│  💡 Dette technique:        Élevée                               │
└──────────────────────────────────────────────────────────────────┘

                            ↓ MIGRATION ↓
                              6 semaines

┌──────────────────────────────────────────────────────────────────┐
│  APRÈS (OBJECTIF)                                                 │
├──────────────────────────────────────────────────────────────────┤
│                                                                   │
│  📊 Architecture Score:     8.5-9/10  ⬆️ +28%                   │
│  📁 Imports relatifs:       0%        ⬆️ -100%                   │
│  📝 Taille fichiers moy:    150 lignes ⬆️ -62%                   │
│  🧪 Couverture tests:       60%+      ⬆️ +60%                   │
│  ⏱️  Temps ajout feature:    1 jour     ⬆️ -50%                   │
│  👥 Temps onboarding:       3 jours    ⬆️ -75%                   │
│  💡 Dette technique:        Faible    ⬆️ -80%                   │
└──────────────────────────────────────────────────────────────────┘

┌─────────────────────────────────────────────────────────────────────┐
│  GAINS MESURABLES:                                                   │
│                                                                      │
│  💰 ROI:                Break-even en 3-4 mois                      │
│  📈 Productivité:       +30% vélocité équipe                        │
│  🐛 Qualité:            -40% bugs en production                     │
│  ⚡ Performance:        -20% taille bundle                          │
│  😊 Satisfaction:       Équipe plus motivée                         │
└─────────────────────────────────────────────────────────────────────┘
```

---

**Ces diagrammes sont des outils visuels pour comprendre et expliquer l'architecture.**

**Utilisez-les dans vos présentations et documentation interne ! 📊**
