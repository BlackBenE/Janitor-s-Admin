# Architecture du projet

**Date de création** : 24 octobre 2025  
**Status** : 🟢 Structure active - Migration progressive en cours

---

## 📁 Structure

```
src/
├── app/              # Configuration application
│   ├── providers/    # Providers globaux (Auth, Query, Theme)
│   └── router/       # Configuration routing
│
├── features/         # Domaines métier (Feature-first)
│   ├── users/        # Gestion utilisateurs
│   ├── properties/   # Gestion propriétés
│   ├── analytics/    # Analytiques
│   ├── payments/     # Paiements
│   └── ...
│
├── shared/           # Code partagé entre features
│   ├── components/   # Composants réutilisables (Button, Modal, Table)
│   ├── hooks/        # Hooks réutilisables (useDebounce, useLocalStorage)
│   ├── utils/        # Fonctions utilitaires (formatDate, validation)
│   ├── types/        # Types partagés
│   └── constants/    # Constantes globales
│
└── core/             # Infrastructure
    ├── api/          # Client API (Supabase, Axios config)
    ├── config/       # Configuration (env, settings)
    ├── services/     # Services infrastructure (storage, cache)
    └── types/        # Types infrastructure
```

---

## 🎯 Conventions

### Imports avec Path Aliases

Utiliser les path aliases configurés :

```typescript
// ✅ Bon
import { UserList } from '@components/users/UserList';
import { useAuth } from '@hooks/useAuth';
import { formatDate } from '@utils/formatting';
import { User } from '@types/user';

// ❌ Éviter
import { UserList } from '../../../components/users/UserList';
```

### Placement des nouveaux fichiers

**Composant partagé** (utilisé par plusieurs domaines) :

```
→ src/shared/components/
```

**Composant spécifique** (un seul domaine) :

```
→ src/features/{domain}/components/
```

**Hook partagé** :

```
→ src/shared/hooks/
```

**Hook métier** :

```
→ src/features/{domain}/hooks/
```

**Utilitaire partagé** :

```
→ src/shared/utils/
```

**Service infrastructure** :

```
→ src/core/services/
```

---

## 🔄 Migration Progressive

Cette structure est le **target**. On y migre progressivement selon la règle :

### Règle d'or

> **"Laisse le code un peu mieux que tu l'as trouvé"**

### Stratégie

1. ✅ **Nouveaux fichiers** → Directement dans la bonne structure
2. ⏳ **Fichiers existants** → On migre quand on les modifie
3. 🎯 **Pas de Big Bang** → Migration feature par feature

### Exemple de migration

```typescript
// Avant (structure actuelle)
src / components / userManagement / UserList.tsx;
src / components / userManagement / hooks / useUsers.ts;

// Après (structure cible)
src / features / users / components / UserList.tsx;
src / features / users / hooks / useUsers.ts;
src / features / users / index.ts; // Public API
```

---

## 📦 Structure d'une Feature

Chaque feature suit cette structure :

```
src/features/{domain}/
├── components/       # Composants UI de la feature
├── hooks/           # Hooks métier
├── api/             # Appels API spécifiques
├── types/           # Types TypeScript
├── utils/           # Utilitaires spécifiques (optionnel)
├── index.ts         # Public API (exports)
└── README.md        # Documentation
```

### Exemple : Feature Users

```typescript
// src/features/users/index.ts
export * from './components';
export * from './hooks';
export * from './types';

// Usage ailleurs dans l'app
import { UserList, useUsers, User } from '@/features/users';
```

---

## 🚀 Avantages de cette architecture

### 1. **Scalabilité**

- Ajout de features sans toucher aux autres
- Croissance horizontale du projet

### 2. **Maintenance**

- Code regroupé par domaine métier
- Facile de trouver et modifier

### 3. **Réutilisabilité**

- `shared/` contient le code réutilisable
- Évite la duplication

### 4. **Testabilité**

- Tests proches du code
- Isolation des domaines

### 5. **Collaboration**

- Équipe peut travailler sur différentes features
- Moins de conflits Git

---

## 📚 Ressources

- **QUICK_WINS_3H.md** - Guide de mise en place rapide
- **PLAN_MIGRATION_PROGRESSIF.md** - Plan complet de migration
- **ARCHITECTURE_CIBLE_2025.md** - Architecture détaillée
- **SUIVI_MIGRATION.md** - Checklist interactive

---

## 🔧 Maintenance

### Quand ajouter un nouveau fichier

**Question** : Est-ce utilisé par plusieurs features ?

- ✅ **Oui** → `src/shared/`
- ❌ **Non** → `src/features/{domain}/`

**Question** : Est-ce de l'infrastructure (API, config, cache) ?

- ✅ **Oui** → `src/core/`
- ❌ **Non** → Voir ci-dessus

### Refactoring progressif

Quand tu modifies un fichier existant :

1. Déplace-le vers la bonne structure
2. Mets à jour les imports
3. Commit avec message clair
4. Continue ton travail

---

## ⚠️ À éviter

- ❌ Pas de dossier `common/` fourre-tout
- ❌ Pas de fichiers avec +500 lignes
- ❌ Pas d'imports circulaires
- ❌ Pas de couplage fort entre features

---

**Dernière mise à jour** : 24 octobre 2025
