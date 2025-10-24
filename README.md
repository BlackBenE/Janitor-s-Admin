# 🏢 Back Office Admin - Janitor's Admin

Back-office administratif moderne construit avec React, TypeScript, et Material-UI.

## 🚀 Quick Start

```bash
# Installation
npm install

# Développement
npm run dev

# Build production
npm run build

# Lancer en production
npm run preview
```

## 📋 Documentation

- **[STATUS_PROJET.md](./STATUS_PROJET.md)** - État complet du projet, métriques, TODO
- **[src/ARCHITECTURE.md](./src/ARCHITECTURE.md)** - Guide d'architecture interne

## 🏗️ Architecture

### Structure Feature-First

```
src/
├── features/         # 9 modules métier autonomes
├── shared/           # Composants réutilisables
├── core/             # Infrastructure (API, config, services)
├── types/            # Types TypeScript
├── utils/            # Utilitaires
└── routes/           # Configuration routing
```

### Features Disponibles

- **Users** - Gestion utilisateurs
- **Property Approvals** - Validation propriétés
- **Payments** - Gestion paiements
- **Analytics** - Statistiques
- **Auth** - Authentification
- **Quote Requests** - Demandes de devis
- **Services Catalog** - Catalogue services
- **Dashboard** - Tableau de bord
- **Profile** - Profil utilisateur

## 🛠️ Stack Technique

- **React 19** - UI Library
- **TypeScript 5.9** - Type Safety
- **Vite 7** - Build Tool
- **Material-UI 7** - Component Library
- **TanStack Query 5** - Data Fetching
- **Supabase** - Backend & Auth
- **React Router 7** - Routing

## 📊 Métriques

- ✅ **0 erreur** TypeScript
- ✅ **0 erreur** ESLint
- ✅ **Build**: 13.46s
- ✅ **311 imports** avec path aliases
- ✅ **99%** interface en français
- ✅ **9 modules** features

## 🎯 Commandes Utiles

```bash
# Développement
npm run dev              # Démarrer le serveur dev (port 3000)

# Build
npm run build            # Build production
npm run preview          # Preview du build

# Code Quality
npm run lint             # Lint avec ESLint
npm run type-check       # Vérification TypeScript

# Nettoyage
npm run clean            # Nettoyer dist/ et cache
```

## 📂 Path Aliases

Le projet utilise des path aliases pour simplifier les imports :

```typescript
import { AdminLayout } from '@/shared/components/layout';
import { useAuth } from '@/core/providers/auth.provider';
import { LABELS } from '@/core/config/labels';
import { User } from '@/types/userManagement';
import { formatDate } from '@/utils';
```

## 🌍 Internationalisation

Interface 100% en français avec labels centralisés dans `src/constants/labels.ts` :

```typescript
import { LABELS } from '@/core/config/labels';

<Button>{LABELS.common.actions.save}</Button>
```

## 🔐 Authentification

Utilise Supabase pour l'authentification et la gestion des sessions.

```typescript
import { useAuth } from '@/core/providers/auth.provider';

const { user, signIn, signOut } = useAuth();
```

## 📝 Conventions

### Nouveau Composant Shared

```bash
# Créer
mkdir -p src/shared/components/ui/MonComposant
touch src/shared/components/ui/MonComposant/MonComposant.tsx
touch src/shared/components/ui/MonComposant/index.ts

# Exporter
echo "export * from './MonComposant';" > src/shared/components/ui/MonComposant/index.ts
```

### Nouvelle Feature

```bash
# Créer la structure
mkdir -p src/features/ma-feature/{components,hooks,modals}
touch src/features/ma-feature/MaFeaturePage.tsx
touch src/features/ma-feature/index.ts
```

## 🤝 Contribution

1. Créer une branche feature
2. Faire vos changements
3. Tester (build + lint)
4. Créer une Pull Request

## 📄 License

Propriétaire - Tous droits réservés

---

**Made with ❤️ by the Janitor's Team**
