# Feature: Users

**Domaine** : Gestion des utilisateurs du back-office  
**Status** : 🟡 Structure créée - Migration en attente

---

## 📋 Description

Cette feature gère tout ce qui concerne les utilisateurs :
- Liste et recherche d'utilisateurs
- Détails et édition de profils
- Actions de modération (lock, unlock, delete)
- Audit et historique
- RGPD (anonymisation, suppression intelligente)

---

## 📁 Structure

```
src/features/users/
├── components/       # Composants UI
│   ├── UserList.tsx
│   ├── UserDetails.tsx
│   ├── UserEditForm.tsx
│   └── index.ts
├── hooks/           # Hooks métier
│   ├── useUsers.ts
│   ├── useUserMutations.ts
│   ├── useUserActions.ts
│   └── index.ts
├── api/             # Appels API
│   └── users.api.ts
├── types/           # Types TypeScript
│   └── user.types.ts
├── index.ts         # Public API
└── README.md        # Ce fichier
```

---

## 🔄 Migration

### Fichiers actuels à migrer

Les fichiers actuels se trouvent dans :
```
src/components/userManagement/
├── components/
├── hooks/
├── modals/
└── utils/
```

### Plan de migration

**Phase 1** : Structure (✅ Fait)
- [x] Créer dossiers `components/`, `hooks/`, `api/`, `types/`
- [x] Créer `index.ts` et `README.md`

**Phase 2** : Migration progressive (⏳ À faire)
- [ ] Migrer les types → `types/user.types.ts`
- [ ] Migrer les hooks → `hooks/`
- [ ] Migrer les composants → `components/`
- [ ] Migrer les modals → `components/modals/`
- [ ] Migrer les utils → vers `shared/utils/` si réutilisables

**Phase 3** : Cleanup (⏳ À faire)
- [ ] Supprimer l'ancien dossier `userManagement/`
- [ ] Mettre à jour tous les imports
- [ ] Tester que tout fonctionne

---

## 🎯 Public API

Une fois la migration terminée, l'import sera simple :

```typescript
// Avant (structure actuelle)
import { UserList } from '@/components/userManagement/components/UserList';
import { useUsers } from '@/components/userManagement/hooks/useUsers';
import { User } from '@/types/userManagement';

// Après (structure cible)
import { UserList, useUsers, User } from '@/features/users';
// Ou plus spécifique :
import { UserList } from '@/features/users/components';
import { useUsers } from '@/features/users/hooks';
import type { User } from '@/features/users/types';
```

---

## 🧪 Tests (futur)

```
src/features/users/
├── hooks/
│   ├── useUsers.ts
│   └── useUsers.test.ts
└── utils/
    ├── userValidation.ts
    └── userValidation.test.ts
```

---

## 📚 Dépendances

### Dépendances internes
- `@/shared/components` - Composants réutilisables (Table, Modal, etc.)
- `@/shared/hooks` - Hooks réutilisables (useDataTable, useFilters)
- `@/core/api` - Client Supabase

### Dépendances externes
- `@tanstack/react-query` - Gestion cache et mutations
- `react-hook-form` - Gestion des formulaires
- `@mui/material` - Composants UI

---

## 🚀 Utilisation future

```typescript
// Dans une page
import { UserManagementPage } from '@/features/users';

export default function UsersRoute() {
  return <UserManagementPage />;
}

// Dans un autre composant
import { useUsers } from '@/features/users/hooks';

function MyComponent() {
  const { users, isLoading } = useUsers();
  // ...
}
```

---

**Créé le** : 24 octobre 2025  
**Dernière mise à jour** : 24 octobre 2025
