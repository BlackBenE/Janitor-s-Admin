# 🎯 ARCHITECTURE CIBLE - Back-Office React/TypeScript 2025

**Date**: 24 octobre 2025  
**Approche**: **Feature-First Architecture** (Domain-Driven)  
**Objectif**: Architecture évolutive, maintenable et testable

---

## 📐 PRINCIPES DIRECTEURS

### 1. 🎯 Feature-First (Domain-Driven)

Chaque domaine métier est **autonome** et contient tout ce dont il a besoin :

- Composants UI
- Hooks métier
- Types spécifiques
- Services API
- Tests
- Stories (Storybook)

### 2. 🔄 Colocation

Le code qui change ensemble doit rester ensemble :

```
features/users/
├── components/     # UI du domaine
├── hooks/          # Logique métier
├── api/            # Appels API
├── types/          # Types spécifiques
├── utils/          # Helpers du domaine
└── __tests__/      # Tests colocalisés
```

### 3. 📦 Dependency Rule

Les dépendances vont **toujours vers l'intérieur** :

```
Features → Shared → Core
  ❌ ←      ❌ ←     ✅
```

### 4. 🎨 Component Composition

Préférer la composition à l'héritage :

```typescript
<UserCard>
  <UserCard.Avatar />
  <UserCard.Info />
  <UserCard.Actions />
</UserCard>
```

---

## 📂 STRUCTURE CIBLE COMPLÈTE

```
src/
│
├── 📱 app/                          # Configuration de l'application
│   ├── App.tsx                      # Composant racine
│   ├── main.tsx                     # Point d'entrée
│   ├── router.tsx                   # Configuration des routes
│   └── providers/                   # Providers globaux
│       ├── AppProviders.tsx         # Composition de tous les providers
│       ├── AuthProvider.tsx         # Authentification
│       ├── ThemeProvider.tsx        # Thème MUI
│       └── QueryProvider.tsx        # TanStack Query
│
├── 🎯 features/                     # ⭐ DOMAINES MÉTIER (Feature-First)
│   │
│   ├── users/                       # 👥 Gestion des utilisateurs
│   │   ├── index.ts                 # Public API du domaine
│   │   ├── routes.tsx               # Routes du domaine
│   │   │
│   │   ├── components/              # Composants UI
│   │   │   ├── UserList/
│   │   │   │   ├── UserList.tsx
│   │   │   │   ├── UserListItem.tsx
│   │   │   │   ├── UserListFilters.tsx
│   │   │   │   ├── UserList.styles.ts
│   │   │   │   └── index.ts
│   │   │   │
│   │   │   ├── UserDetails/
│   │   │   │   ├── UserDetails.tsx
│   │   │   │   ├── UserDetailsHeader.tsx
│   │   │   │   ├── UserDetailsInfo.tsx
│   │   │   │   └── index.ts
│   │   │   │
│   │   │   ├── UserForm/
│   │   │   │   ├── UserForm.tsx
│   │   │   │   ├── UserFormSchema.ts    # Validation Zod
│   │   │   │   └── index.ts
│   │   │   │
│   │   │   └── modals/
│   │   │       ├── CreateUserModal.tsx
│   │   │       ├── DeleteUserModal.tsx
│   │   │       └── index.ts
│   │   │
│   │   ├── hooks/                   # Logique métier
│   │   │   ├── useUsers.ts          # Hook principal (lecture)
│   │   │   ├── useUserMutations.ts  # Mutations (écriture)
│   │   │   ├── useUserFilters.ts    # Logique de filtrage
│   │   │   ├── useUserExport.ts     # Export CSV/PDF
│   │   │   └── index.ts
│   │   │
│   │   ├── api/                     # Appels API spécifiques
│   │   │   ├── users.api.ts         # Endpoints users
│   │   │   ├── users.queries.ts     # TanStack Query keys
│   │   │   └── index.ts
│   │   │
│   │   ├── types/                   # Types du domaine
│   │   │   ├── user.types.ts
│   │   │   ├── user-filters.types.ts
│   │   │   └── index.ts
│   │   │
│   │   ├── utils/                   # Helpers du domaine
│   │   │   ├── user-formatters.ts
│   │   │   ├── user-validators.ts
│   │   │   └── index.ts
│   │   │
│   │   ├── constants/               # Constantes du domaine
│   │   │   ├── user-roles.const.ts
│   │   │   ├── user-statuses.const.ts
│   │   │   └── index.ts
│   │   │
│   │   ├── stores/                  # État local du domaine (Zustand)
│   │   │   ├── useUserStore.ts
│   │   │   └── index.ts
│   │   │
│   │   └── __tests__/               # Tests du domaine
│   │       ├── UserList.test.tsx
│   │       ├── useUsers.test.ts
│   │       └── users.api.test.ts
│   │
│   ├── properties/                  # 🏠 Gestion des propriétés
│   │   ├── index.ts
│   │   ├── routes.tsx
│   │   ├── components/
│   │   │   ├── PropertyList/
│   │   │   ├── PropertyDetails/
│   │   │   ├── PropertyApproval/
│   │   │   └── modals/
│   │   ├── hooks/
│   │   │   ├── useProperties.ts
│   │   │   ├── usePropertyApprovals.ts
│   │   │   └── index.ts
│   │   ├── api/
│   │   ├── types/
│   │   ├── utils/
│   │   ├── stores/
│   │   └── __tests__/
│   │
│   ├── analytics/                   # 📊 Analytics et statistiques
│   │   ├── index.ts
│   │   ├── routes.tsx
│   │   ├── components/
│   │   │   ├── AnalyticsDashboard/
│   │   │   ├── ChartsSection/
│   │   │   └── StatsCards/
│   │   ├── hooks/
│   │   ├── api/
│   │   ├── types/
│   │   └── __tests__/
│   │
│   ├── quotes/                      # 💬 Devis
│   │   └── ... (même structure)
│   │
│   ├── payments/                    # 💰 Paiements
│   │   └── ... (même structure)
│   │
│   ├── services/                    # 🔧 Catalogue de services
│   │   └── ... (même structure)
│   │
│   ├── auth/                        # 🔐 Authentification
│   │   ├── components/
│   │   │   ├── LoginForm/
│   │   │   ├── RegisterForm/
│   │   │   ├── ResetPasswordForm/
│   │   │   └── index.ts
│   │   ├── hooks/
│   │   │   ├── useAuth.ts
│   │   │   ├── useLogin.ts
│   │   │   └── index.ts
│   │   ├── api/
│   │   ├── types/
│   │   └── __tests__/
│   │
│   └── profile/                     # 👤 Profil utilisateur
│       └── ... (même structure)
│
├── 🧩 shared/                       # ⭐ COMPOSANTS PARTAGÉS
│   │
│   ├── components/                  # Composants UI réutilisables
│   │   │
│   │   ├── ui/                      # Composants UI basiques
│   │   │   ├── Button/
│   │   │   │   ├── Button.tsx
│   │   │   │   ├── Button.test.tsx
│   │   │   │   ├── Button.stories.tsx
│   │   │   │   └── index.ts
│   │   │   ├── Input/
│   │   │   ├── Select/
│   │   │   ├── Modal/
│   │   │   ├── Card/
│   │   │   ├── Badge/
│   │   │   ├── Tooltip/
│   │   │   └── index.ts
│   │   │
│   │   ├── forms/                   # Composants de formulaires
│   │   │   ├── FormField/
│   │   │   ├── FormSelect/
│   │   │   ├── FormDatePicker/
│   │   │   └── index.ts
│   │   │
│   │   ├── data-display/            # Affichage de données
│   │   │   ├── Table/
│   │   │   │   ├── Table.tsx
│   │   │   │   ├── TableHeader.tsx
│   │   │   │   ├── TableBody.tsx
│   │   │   │   ├── TableRow.tsx
│   │   │   │   ├── TableCell.tsx
│   │   │   │   ├── TablePagination.tsx
│   │   │   │   └── index.ts
│   │   │   ├── DataGrid/
│   │   │   ├── Chart/
│   │   │   ├── StatsCard/
│   │   │   └── index.ts
│   │   │
│   │   ├── feedback/                # Feedback utilisateur
│   │   │   ├── LoadingSpinner/
│   │   │   ├── ErrorBoundary/
│   │   │   ├── Toast/
│   │   │   ├── Alert/
│   │   │   └── index.ts
│   │   │
│   │   ├── layout/                  # Composants de layout
│   │   │   ├── AdminLayout/
│   │   │   │   ├── AdminLayout.tsx
│   │   │   │   ├── Sidebar.tsx
│   │   │   │   ├── Header.tsx
│   │   │   │   ├── Footer.tsx
│   │   │   │   └── index.ts
│   │   │   ├── PageHeader/
│   │   │   ├── PageContainer/
│   │   │   ├── Section/
│   │   │   └── index.ts
│   │   │
│   │   └── navigation/              # Navigation
│   │       ├── Breadcrumbs/
│   │       ├── Tabs/
│   │       ├── Menu/
│   │       └── index.ts
│   │
│   ├── hooks/                       # Hooks utilitaires réutilisables
│   │   ├── useDebounce.ts
│   │   ├── useLocalStorage.ts
│   │   ├── useMediaQuery.ts
│   │   ├── usePagination.ts
│   │   ├── useFilters.ts
│   │   ├── useExport.ts
│   │   ├── useNotification.ts
│   │   └── index.ts
│   │
│   ├── utils/                       # Utilitaires génériques
│   │   ├── date/
│   │   │   ├── formatDate.ts
│   │   │   ├── parseDate.ts
│   │   │   └── index.ts
│   │   ├── string/
│   │   │   ├── capitalize.ts
│   │   │   ├── truncate.ts
│   │   │   └── index.ts
│   │   ├── number/
│   │   │   ├── formatCurrency.ts
│   │   │   ├── formatPercent.ts
│   │   │   └── index.ts
│   │   ├── array/
│   │   │   ├── groupBy.ts
│   │   │   ├── sortBy.ts
│   │   │   └── index.ts
│   │   └── index.ts
│   │
│   ├── types/                       # Types partagés
│   │   ├── common.types.ts
│   │   ├── api.types.ts
│   │   ├── pagination.types.ts
│   │   └── index.ts
│   │
│   └── constants/                   # Constantes partagées
│       ├── routes.const.ts
│       ├── api-endpoints.const.ts
│       └── index.ts
│
├── 🏗️ core/                         # ⭐ INFRASTRUCTURE
│   │
│   ├── api/                         # Configuration API
│   │   ├── client.ts                # Client HTTP (fetch/axios)
│   │   ├── supabase.ts              # Client Supabase
│   │   ├── interceptors.ts          # Intercepteurs globaux
│   │   └── index.ts
│   │
│   ├── config/                      # Configuration
│   │   ├── env.ts                   # Variables d'environnement
│   │   ├── theme.ts                 # Thème MUI
│   │   ├── query-client.ts          # TanStack Query config
│   │   └── index.ts
│   │
│   ├── services/                    # Services transversaux
│   │   ├── analytics.service.ts     # Analytics (GA, etc.)
│   │   ├── logger.service.ts        # Logging
│   │   ├── storage.service.ts       # LocalStorage/SessionStorage
│   │   └── index.ts
│   │
│   ├── types/                       # Types générés/globaux
│   │   ├── database.types.ts        # Types Supabase auto-générés
│   │   ├── supabase.types.ts
│   │   └── index.ts
│   │
│   └── utils/                       # Utilitaires core
│       ├── error-handler.ts
│       ├── validation.ts
│       └── index.ts
│
├── 🌍 locales/                      # ⭐ INTERNATIONALISATION
│   ├── fr/
│   │   ├── common.json              # Traductions communes
│   │   ├── users.json               # Traductions domaine users
│   │   ├── properties.json          # Traductions domaine properties
│   │   └── index.ts
│   ├── en/
│   │   └── ... (même structure)
│   └── i18n.config.ts               # Configuration i18n
│
├── 📦 assets/                       # Assets statiques
│   ├── images/
│   ├── icons/
│   ├── fonts/
│   └── styles/
│       ├── global.css
│       └── theme/
│
└── 🧪 test/                         # Configuration des tests
    ├── setup.ts                     # Setup global des tests
    ├── mocks/                       # Mocks partagés
    │   ├── handlers.ts              # MSW handlers
    │   └── data.ts
    └── utils/                       # Helpers de tests
        ├── render.tsx               # Custom render
        └── factories.ts             # Data factories
```

---

## 🔑 CONVENTIONS DE NOMMAGE

### Fichiers et dossiers

```typescript
// ✅ COMPOSANTS
UserList.tsx; // PascalCase
UserListItem.tsx;
user - list.styles.ts; // kebab-case pour styles

// ✅ HOOKS
useUsers.ts; // camelCase avec préfixe 'use'
useUserMutations.ts;

// ✅ SERVICES
users.api.ts; // kebab-case + suffix
auth.service.ts;

// ✅ TYPES
user.types.ts; // kebab-case + suffix
user - filters.types.ts;

// ✅ UTILS
formatDate.ts; // camelCase
user - formatters.ts; // kebab-case pour groupes

// ✅ CONSTANTES
user - roles.const.ts; // kebab-case + suffix
API_ENDPOINTS.const.ts; // UPPERCASE pour exports

// ✅ TESTS
UserList.test.tsx; // PascalCase + suffix
useUsers.test.ts;
```

### Exports

```typescript
// ✅ CHAQUE DOSSIER A UN index.ts
// features/users/components/UserList/index.ts
export { UserList } from './UserList';
export { UserListItem } from './UserListItem';
export type { UserListProps } from './UserList';

// features/users/index.ts (Public API)
export * from './components';
export * from './hooks';
export * from './types';
```

---

## 🎨 EXEMPLES D'IMPLÉMENTATION

### 1. Feature Module Complet

```typescript
// ============================================================
// features/users/index.ts (Public API du domaine)
// ============================================================
export { UserList, UserDetails, UserForm } from './components';
export { useUsers, useUserMutations, useUserFilters } from './hooks';
export type { User, UserFilters, UserStatus } from './types';

// ============================================================
// features/users/routes.tsx
// ============================================================
import { lazy } from 'react';
import { RouteObject } from 'react-router-dom';

const UserList = lazy(() => import('./components/UserList'));
const UserDetails = lazy(() => import('./components/UserDetails'));

export const usersRoutes: RouteObject[] = [
  {
    path: 'users',
    children: [
      { index: true, element: <UserList /> },
      { path: ':id', element: <UserDetails /> },
    ],
  },
];

// ============================================================
// features/users/types/user.types.ts
// ============================================================
import { z } from 'zod';

export const UserRoleSchema = z.enum(['admin', 'traveler', 'provider']);
export type UserRole = z.infer<typeof UserRoleSchema>;

export const UserStatusSchema = z.enum(['active', 'pending', 'suspended']);
export type UserStatus = z.infer<typeof UserStatusSchema>;

export const UserSchema = z.object({
  id: z.string().uuid(),
  email: z.string().email(),
  fullName: z.string().min(2),
  role: UserRoleSchema,
  status: UserStatusSchema,
  createdAt: z.date(),
  updatedAt: z.date(),
});

export type User = z.infer<typeof UserSchema>;

// ============================================================
// features/users/api/users.api.ts
// ============================================================
import { supabase } from '@/core/api/supabase';
import { User, UserFilters } from '../types';

export const usersApi = {
  async getAll(filters?: UserFilters): Promise<User[]> {
    let query = supabase.from('profiles').select('*');

    if (filters?.role) {
      query = query.eq('role', filters.role);
    }
    if (filters?.status) {
      query = query.eq('status', filters.status);
    }

    const { data, error } = await query;
    if (error) throw error;
    return data || [];
  },

  async getById(id: string): Promise<User> {
    const { data, error } = await supabase
      .from('profiles')
      .select('*')
      .eq('id', id)
      .single();

    if (error) throw error;
    return data;
  },

  async create(user: Omit<User, 'id' | 'createdAt' | 'updatedAt'>): Promise<User> {
    const { data, error } = await supabase
      .from('profiles')
      .insert(user)
      .select()
      .single();

    if (error) throw error;
    return data;
  },

  async update(id: string, updates: Partial<User>): Promise<User> {
    const { data, error } = await supabase
      .from('profiles')
      .update(updates)
      .eq('id', id)
      .select()
      .single();

    if (error) throw error;
    return data;
  },

  async delete(id: string): Promise<void> {
    const { error } = await supabase
      .from('profiles')
      .delete()
      .eq('id', id);

    if (error) throw error;
  },
};

// ============================================================
// features/users/api/users.queries.ts (TanStack Query)
// ============================================================
import { queryOptions, useMutation, useQueryClient } from '@tanstack/react-query';
import { usersApi } from './users.api';
import { UserFilters } from '../types';

export const userKeys = {
  all: ['users'] as const,
  lists: () => [...userKeys.all, 'list'] as const,
  list: (filters: UserFilters) => [...userKeys.lists(), filters] as const,
  details: () => [...userKeys.all, 'detail'] as const,
  detail: (id: string) => [...userKeys.details(), id] as const,
};

export const userQueries = {
  all: (filters?: UserFilters) =>
    queryOptions({
      queryKey: userKeys.list(filters || {}),
      queryFn: () => usersApi.getAll(filters),
    }),

  detail: (id: string) =>
    queryOptions({
      queryKey: userKeys.detail(id),
      queryFn: () => usersApi.getById(id),
    }),
};

// ============================================================
// features/users/hooks/useUsers.ts
// ============================================================
import { useQuery } from '@tanstack/react-query';
import { userQueries } from '../api/users.queries';
import { UserFilters } from '../types';

export const useUsers = (filters?: UserFilters) => {
  return useQuery(userQueries.all(filters));
};

// ============================================================
// features/users/hooks/useUserMutations.ts
// ============================================================
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { usersApi } from '../api/users.api';
import { userKeys } from '../api/users.queries';
import { User } from '../types';

export const useUserMutations = () => {
  const queryClient = useQueryClient();

  const createUser = useMutation({
    mutationFn: usersApi.create,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: userKeys.lists() });
    },
  });

  const updateUser = useMutation({
    mutationFn: ({ id, updates }: { id: string; updates: Partial<User> }) =>
      usersApi.update(id, updates),
    onSuccess: (_, { id }) => {
      queryClient.invalidateQueries({ queryKey: userKeys.detail(id) });
      queryClient.invalidateQueries({ queryKey: userKeys.lists() });
    },
  });

  const deleteUser = useMutation({
    mutationFn: usersApi.delete,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: userKeys.lists() });
    },
  });

  return {
    createUser,
    updateUser,
    deleteUser,
  };
};

// ============================================================
// features/users/components/UserList/UserList.tsx
// ============================================================
import { useState } from 'react';
import { Box, Typography } from '@mui/material';
import { useUsers } from '../../hooks/useUsers';
import { useUserFilters } from '../../hooks/useUserFilters';
import { UserListItem } from './UserListItem';
import { UserListFilters } from './UserListFilters';
import { LoadingSpinner } from '@/shared/components/feedback';
import { ErrorAlert } from '@/shared/components/feedback';

export const UserList = () => {
  const { filters, updateFilter, resetFilters } = useUserFilters();
  const { data: users, isLoading, error } = useUsers(filters);

  if (isLoading) return <LoadingSpinner />;
  if (error) return <ErrorAlert error={error} />;

  return (
    <Box>
      <Typography variant="h4" gutterBottom>
        Gestion des utilisateurs
      </Typography>

      <UserListFilters
        filters={filters}
        onFilterChange={updateFilter}
        onReset={resetFilters}
      />

      <Box sx={{ mt: 3 }}>
        {users?.map((user) => (
          <UserListItem key={user.id} user={user} />
        ))}
      </Box>
    </Box>
  );
};

// ============================================================
// features/users/stores/useUserStore.ts (Zustand pour état UI)
// ============================================================
import { create } from 'zustand';
import { devtools } from 'zustand/middleware';
import { User } from '../types';

interface UserStore {
  // État
  selectedUser: User | null;
  selectedUserIds: string[];

  // Actions
  setSelectedUser: (user: User | null) => void;
  toggleUserSelection: (userId: string) => void;
  clearSelection: () => void;
}

export const useUserStore = create<UserStore>()(
  devtools(
    (set) => ({
      selectedUser: null,
      selectedUserIds: [],

      setSelectedUser: (user) => set({ selectedUser: user }),

      toggleUserSelection: (userId) =>
        set((state) => ({
          selectedUserIds: state.selectedUserIds.includes(userId)
            ? state.selectedUserIds.filter((id) => id !== userId)
            : [...state.selectedUserIds, userId],
        })),

      clearSelection: () => set({ selectedUserIds: [] }),
    }),
    { name: 'UserStore' }
  )
);
```

### 2. Composant Partagé Réutilisable

```typescript
// ============================================================
// shared/components/data-display/Table/Table.tsx
// ============================================================
import { ReactNode } from 'react';
import { Table as MuiTable, TableContainer, Paper } from '@mui/material';

export interface TableProps<T> {
  data: T[];
  columns: ColumnDef<T>[];
  onRowClick?: (row: T) => void;
  isLoading?: boolean;
  emptyMessage?: string;
}

export interface ColumnDef<T> {
  id: string;
  header: string;
  accessor: keyof T | ((row: T) => ReactNode);
  width?: string;
  align?: 'left' | 'center' | 'right';
}

export const Table = <T extends { id: string }>({
  data,
  columns,
  onRowClick,
  isLoading,
  emptyMessage = 'Aucune donnée',
}: TableProps<T>) => {
  // Implementation...
  return (
    <TableContainer component={Paper}>
      <MuiTable>
        {/* ... */}
      </MuiTable>
    </TableContainer>
  );
};

// ============================================================
// shared/components/data-display/Table/index.ts
// ============================================================
export { Table } from './Table';
export type { TableProps, ColumnDef } from './Table';
```

### 3. Configuration des Providers

```typescript
// ============================================================
// app/providers/AppProviders.tsx
// ============================================================
import { ReactNode } from 'react';
import { QueryClientProvider } from '@tanstack/react-query';
import { ReactQueryDevtools } from '@tanstack/react-query-devtools';
import { ThemeProvider } from '@mui/material/styles';
import { CssBaseline } from '@mui/material';
import { AuthProvider } from '@/features/auth';
import { queryClient } from '@/core/config/query-client';
import { theme } from '@/core/config/theme';

interface AppProvidersProps {
  children: ReactNode;
}

export const AppProviders = ({ children }: AppProvidersProps) => {
  return (
    <QueryClientProvider client={queryClient}>
      <ThemeProvider theme={theme}>
        <CssBaseline />
        <AuthProvider>
          {children}
        </AuthProvider>
      </ThemeProvider>
      {import.meta.env.DEV && <ReactQueryDevtools />}
    </QueryClientProvider>
  );
};

// ============================================================
// app/App.tsx
// ============================================================
import { RouterProvider } from 'react-router-dom';
import { AppProviders } from './providers/AppProviders';
import { router } from './router';

export const App = () => {
  return (
    <AppProviders>
      <RouterProvider router={router} />
    </AppProviders>
  );
};

// ============================================================
// app/router.tsx
// ============================================================
import { createBrowserRouter } from 'react-router-dom';
import { AdminLayout } from '@/shared/components/layout';
import { ProtectedRoute } from '@/shared/components/navigation';
import { usersRoutes } from '@/features/users/routes';
import { propertiesRoutes } from '@/features/properties/routes';
import { analyticsRoutes } from '@/features/analytics/routes';
import { authRoutes } from '@/features/auth/routes';

export const router = createBrowserRouter([
  // Routes publiques
  ...authRoutes,

  // Routes protégées
  {
    element: <ProtectedRoute><AdminLayout /></ProtectedRoute>,
    children: [
      ...usersRoutes,
      ...propertiesRoutes,
      ...analyticsRoutes,
    ],
  },
]);
```

### 4. Configuration TypeScript avec Path Aliases

```json
// ============================================================
// tsconfig.json
// ============================================================
{
  "compilerOptions": {
    "target": "ES2020",
    "lib": ["ES2020", "DOM", "DOM.Iterable"],
    "module": "ESNext",
    "moduleResolution": "bundler",
    "resolveJsonModule": true,
    "allowImportingTsExtensions": true,
    "isolatedModules": true,
    "noEmit": true,
    "jsx": "react-jsx",

    // Strict mode
    "strict": true,
    "noUnusedLocals": true,
    "noUnusedParameters": true,
    "noFallthroughCasesInSwitch": true,

    // Path aliases ⭐
    "baseUrl": ".",
    "paths": {
      "@/*": ["src/*"],
      "@/app/*": ["src/app/*"],
      "@/features/*": ["src/features/*"],
      "@/shared/*": ["src/shared/*"],
      "@/core/*": ["src/core/*"],
      "@/locales/*": ["src/locales/*"],
      "@/test/*": ["src/test/*"]
    }
  },
  "include": ["src"],
  "exclude": ["node_modules", "dist"]
}
```

```typescript
// ============================================================
// vite.config.ts
// ============================================================
import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import path from 'path';

export default defineConfig({
  plugins: [react()],
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src'),
      '@/app': path.resolve(__dirname, './src/app'),
      '@/features': path.resolve(__dirname, './src/features'),
      '@/shared': path.resolve(__dirname, './src/shared'),
      '@/core': path.resolve(__dirname, './src/core'),
      '@/locales': path.resolve(__dirname, './src/locales'),
      '@/test': path.resolve(__dirname, './src/test'),
    },
  },
  server: {
    port: 3000,
  },
  build: {
    rollupOptions: {
      output: {
        manualChunks: {
          'react-vendor': ['react', 'react-dom', 'react-router-dom'],
          'mui-vendor': ['@mui/material', '@mui/icons-material'],
          'query-vendor': ['@tanstack/react-query'],
        },
      },
    },
  },
});
```

---

## 🎯 EXEMPLES D'UTILISATION (Avant/Après)

### ❌ AVANT (Architecture actuelle)

```typescript
// components/property-approvals/PropertyApprovalsPage.tsx
import { useAuth } from '../../providers/authProvider';
import { Property } from '../../types';
import { LABELS } from '../../constants/labels';
import { getStatusLabel } from '../../utils/statusHelpers';
import DataTable from '../Table';
import ActivityItem from '../ActivityItem';

// 600 lignes de code...
// Logique mélangée avec l'UI
// Imports relatifs complexes
```

### ✅ APRÈS (Architecture cible)

```typescript
// features/properties/components/PropertyList/PropertyList.tsx
import { useProperties } from '@/features/properties/hooks';
import { PropertyListItem } from './PropertyListItem';
import { PropertyFilters } from './PropertyFilters';
import { Table, LoadingSpinner } from '@/shared/components';
import { useAuth } from '@/app/providers';

export const PropertyList = () => {
  const { user } = useAuth();
  const { properties, isLoading } = useProperties();

  if (isLoading) return <LoadingSpinner />;

  return (
    <Table
      data={properties}
      columns={propertyColumns}
      renderRow={(property) => <PropertyListItem property={property} />}
    />
  );
};

// ✅ 50 lignes max
// ✅ Logique isolée dans hooks
// ✅ Imports simples et clairs
// ✅ Composant testable
```

---

## 📝 RÈGLES D'OR

### 1. **Un fichier = Une responsabilité**

```typescript
// ❌ MAL
// UserManagement.tsx (600 lignes avec tout dedans)

// ✅ BIEN
// UserList.tsx (affichage)
// useUsers.ts (logique)
// users.api.ts (API)
// user.types.ts (types)
```

### 2. **Imports clairs**

```typescript
// ❌ MAL
import { Something } from '../../../shared/components/Something';

// ✅ BIEN
import { Something } from '@/shared/components';
```

### 3. **Public API par domaine**

```typescript
// ❌ MAL
import { UserList } from '@/features/users/components/UserList/UserList';

// ✅ BIEN
import { UserList } from '@/features/users';
```

### 4. **Composition > Duplication**

```typescript
// ❌ MAL: Dupliquer le composant
<UserTable />
<PropertyTable />

// ✅ BIEN: Composer
<Table data={users} columns={userColumns} />
<Table data={properties} columns={propertyColumns} />
```

### 5. **Tests colocalisés**

```typescript
// ✅ Structure
features / users / components / UserList.tsx;
UserList.test.tsx; // ← À côté du composant
hooks / useUsers.ts;
useUsers.test.ts; // ← À côté du hook
```

---

## 🚀 BÉNÉFICES ATTENDUS

### 📊 Métriques d'amélioration

| Métrique                    | Avant       | Après      | Amélioration |
| --------------------------- | ----------- | ---------- | ------------ |
| **Temps d'ajout feature**   | 2-3 jours   | 1 jour     | -50%         |
| **Imports relatifs moyens** | 3-5 niveaux | 0          | -100%        |
| **Taille moyenne fichier**  | 400 lignes  | 150 lignes | -62%         |
| **Couverture tests**        | 0%          | 60%+       | +60%         |
| **Temps onboarding**        | 2 semaines  | 3 jours    | -75%         |
| **Dette technique**         | Élevée      | Faible     | -80%         |

### ✅ Avantages principaux

1. **🎯 Prévisibilité**: Structure identique pour chaque domaine
2. **🔍 Découvrabilité**: Facile de trouver où est quoi
3. **🧪 Testabilité**: Tests faciles à écrire et maintenir
4. **📦 Modularité**: Features indépendantes
5. **👥 Scalabilité équipe**: Plusieurs devs peuvent travailler en parallèle
6. **🚀 Performance**: Code splitting natif par feature
7. **📚 Documentation**: Structure auto-documentée
8. **🔧 Maintenabilité**: Modifications localisées

---

## 📋 PROCHAINE ÉTAPE

→ **Plan de migration progressif** détaillé étape par étape

Ce document établit la **vision cible**. Le plan de migration vous guidera pour y arriver **sans tout casser** ! 🎯
