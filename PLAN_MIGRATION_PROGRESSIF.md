# 🚀 PLAN DE MIGRATION PROGRESSIF - Architecture Feature-First

**Date**: 24 octobre 2025  
**Durée estimée**: 4-6 semaines  
**Approche**: Incrémentale, sans casser l'existant  
**Risque**: ⚠️ Faible (migration progressive)

---

## 🎯 OBJECTIFS DE LA MIGRATION

### Primaires

1. ✅ Passer à une architecture **feature-first** cohérente
2. ✅ Éliminer les imports relatifs (`../../../`)
3. ✅ Réduire la taille des fichiers (<300 lignes)
4. ✅ Améliorer la testabilité (objectif: 60% couverture)

### Secondaires

5. ✅ Standardiser l'organisation des composants
6. ✅ Implémenter un state management cohérent
7. ✅ Ajouter des tests unitaires
8. ✅ Documenter les conventions

---

## 📅 PLANNING GLOBAL

```
┌─────────────────────────────────────────────────────────┐
│  PHASE 1: Fondations (Semaine 1)                        │
│  ✓ Configuration path aliases                           │
│  ✓ Setup tests et tooling                               │
│  ✓ Création structure cible                             │
└─────────────────────────────────────────────────────────┘
                          ↓
┌─────────────────────────────────────────────────────────┐
│  PHASE 2: Shared (Semaine 2)                            │
│  ✓ Migration composants partagés                        │
│  ✓ Migration hooks partagés                             │
│  ✓ Migration utils                                      │
└─────────────────────────────────────────────────────────┘
                          ↓
┌─────────────────────────────────────────────────────────┐
│  PHASE 3: Core (Semaine 3)                              │
│  ✓ Restructuration API clients                          │
│  ✓ Configuration centralisée                            │
│  ✓ Services transversaux                                │
└─────────────────────────────────────────────────────────┘
                          ↓
┌─────────────────────────────────────────────────────────┐
│  PHASE 4: Features (Semaines 4-5)                       │
│  ✓ Migration domaine par domaine                        │
│  ✓ Tests par domaine                                    │
│  ✓ Documentation par domaine                            │
└─────────────────────────────────────────────────────────┘
                          ↓
┌─────────────────────────────────────────────────────────┐
│  PHASE 5: Finalisation (Semaine 6)                      │
│  ✓ Nettoyage ancien code                                │
│  ✓ Tests E2E                                            │
│  ✓ Documentation finale                                 │
└─────────────────────────────────────────────────────────┘
```

---

## 📦 PHASE 1: FONDATIONS (Semaine 1)

### 🎯 Objectif

Préparer l'infrastructure sans toucher au code existant.

### ✅ Tâches

#### 1.1 Configuration Path Aliases (2h)

**tsconfig.json**

```json
{
  "compilerOptions": {
    "baseUrl": ".",
    "paths": {
      "@/*": ["src/*"],
      "@/app/*": ["src/app/*"],
      "@/features/*": ["src/features/*"],
      "@/shared/*": ["src/shared/*"],
      "@/core/*": ["src/core/*"],
      "@/test/*": ["src/test/*"]
    }
  }
}
```

**vite.config.ts**

```typescript
import path from 'path';

export default defineConfig({
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src'),
      '@/app': path.resolve(__dirname, './src/app'),
      '@/features': path.resolve(__dirname, './src/features'),
      '@/shared': path.resolve(__dirname, './src/shared'),
      '@/core': path.resolve(__dirname, './src/core'),
      '@/test': path.resolve(__dirname, './src/test'),
    },
  },
});
```

**Vérification**

```bash
# Créer un fichier test
echo "export const test = 'hello';" > src/test-alias.ts

# Dans un autre fichier
import { test } from '@/test-alias';

# Si ça compile → ✅ aliases fonctionnent
```

#### 1.2 Setup Tests (3h)

**vitest.config.ts** (créer)

```typescript
import { defineConfig } from 'vitest/config';
import react from '@vitejs/plugin-react';
import path from 'path';

export default defineConfig({
  plugins: [react()],
  test: {
    globals: true,
    environment: 'jsdom',
    setupFiles: ['./src/test/setup.ts'],
    coverage: {
      provider: 'v8',
      reporter: ['text', 'html', 'json'],
      exclude: ['node_modules/', 'src/test/', '**/*.test.{ts,tsx}', '**/*.stories.{ts,tsx}'],
    },
  },
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src'),
      '@/test': path.resolve(__dirname, './src/test'),
    },
  },
});
```

**src/test/setup.ts** (créer)

```typescript
import '@testing-library/jest-dom';
import { expect, afterEach, vi } from 'vitest';
import { cleanup } from '@testing-library/react';

// Cleanup after each test
afterEach(() => {
  cleanup();
});

// Mock window.matchMedia
Object.defineProperty(window, 'matchMedia', {
  writable: true,
  value: vi.fn().mockImplementation((query) => ({
    matches: false,
    media: query,
    onchange: null,
    addListener: vi.fn(),
    removeListener: vi.fn(),
    addEventListener: vi.fn(),
    removeEventListener: vi.fn(),
    dispatchEvent: vi.fn(),
  })),
});
```

**src/test/utils/render.tsx** (créer)

```typescript
import { ReactElement } from 'react';
import { render, RenderOptions } from '@testing-library/react';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { ThemeProvider } from '@mui/material/styles';
import { theme } from '@/core/config/theme';

const createTestQueryClient = () =>
  new QueryClient({
    defaultOptions: {
      queries: { retry: false },
      mutations: { retry: false },
    },
  });

interface CustomRenderOptions extends Omit<RenderOptions, 'wrapper'> {
  queryClient?: QueryClient;
}

export const renderWithProviders = (
  ui: ReactElement,
  {
    queryClient = createTestQueryClient(),
    ...renderOptions
  }: CustomRenderOptions = {}
) => {
  const Wrapper = ({ children }: { children: React.ReactNode }) => (
    <QueryClientProvider client={queryClient}>
      <ThemeProvider theme={theme}>
        {children}
      </ThemeProvider>
    </QueryClientProvider>
  );

  return {
    ...render(ui, { wrapper: Wrapper, ...renderOptions }),
    queryClient,
  };
};

export * from '@testing-library/react';
export { renderWithProviders as render };
```

**package.json** (mise à jour)

```json
{
  "scripts": {
    "test": "vitest",
    "test:ui": "vitest --ui",
    "test:coverage": "vitest --coverage"
  },
  "devDependencies": {
    "vitest": "^1.0.0",
    "@vitest/ui": "^1.0.0",
    "@vitest/coverage-v8": "^1.0.0",
    "jsdom": "^23.0.0"
  }
}
```

**Installation**

```bash
npm install -D vitest @vitest/ui @vitest/coverage-v8 jsdom
```

#### 1.3 Création Structure Cible (2h)

```bash
# Créer les dossiers de base (ne pas toucher à src/components encore)
mkdir -p src/features
mkdir -p src/shared/{components,hooks,utils,types,constants}
mkdir -p src/core/{api,config,services,types,utils}
mkdir -p src/app/{providers}
mkdir -p src/test/{mocks,utils}

# Créer les fichiers index.ts dans shared/
touch src/shared/components/index.ts
touch src/shared/hooks/index.ts
touch src/shared/utils/index.ts
touch src/shared/types/index.ts
touch src/shared/constants/index.ts
```

#### 1.4 Prettier + ESLint (2h)

**.prettierrc**

```json
{
  "semi": true,
  "trailingComma": "es5",
  "singleQuote": true,
  "printWidth": 100,
  "tabWidth": 2,
  "useTabs": false,
  "arrowParens": "always",
  "endOfLine": "lf"
}
```

**.prettierignore**

```
node_modules
dist
build
.next
coverage
*.min.js
```

**package.json**

```json
{
  "scripts": {
    "format": "prettier --write \"src/**/*.{ts,tsx,js,jsx,json,css,md}\"",
    "format:check": "prettier --check \"src/**/*.{ts,tsx,js,jsx,json,css,md}\""
  },
  "devDependencies": {
    "prettier": "^3.0.0"
  }
}
```

**Installation**

```bash
npm install -D prettier
npm run format
```

### 📊 Résultat Phase 1

- ✅ Path aliases configurés et testés
- ✅ Infrastructure de tests prête
- ✅ Structure cible créée (vide)
- ✅ Formatting automatique
- ⏱️ Durée: ~9h

**Commit**: `chore: setup phase 1 - infrastructure and tooling`

---

## 📦 PHASE 2: MIGRATION SHARED (Semaine 2)

### 🎯 Objectif

Migrer les composants/hooks/utils partagés vers la nouvelle structure.

### ✅ Tâches

#### 2.1 Migration des Composants Partagés (1 jour)

**Étape 1**: Identifier les composants à migrer

```bash
# Composants actuellement à la racine de components/
ActivityItem.tsx         → shared/components/ui/ActivityItem/
AdminLayout.tsx          → shared/components/layout/AdminLayout/
Table.tsx                → shared/components/data-display/Table/
Modal.tsx                → shared/components/feedback/Modal/
SearchBar.tsx            → shared/components/forms/SearchBar/
```

**Étape 2**: Migrer un composant pilote (Table)

```bash
# 1. Créer la structure
mkdir -p src/shared/components/data-display/Table

# 2. Copier le composant (ne pas supprimer l'ancien encore)
cp src/components/Table.tsx src/shared/components/data-display/Table/Table.tsx

# 3. Créer l'index.ts
cat > src/shared/components/data-display/Table/index.ts << 'EOF'
export { default as Table } from './Table';
export type { TableProps } from './Table';
EOF

# 4. Mettre à jour les imports dans Table.tsx
# Remplacer les imports relatifs par des path aliases
```

**Table.tsx** (mise à jour)

```typescript
// ❌ AVANT
import { Something } from '../../utils/something';

// ✅ APRÈS
import { Something } from '@/shared/utils';
```

**Étape 3**: Créer des tests

```typescript
// src/shared/components/data-display/Table/Table.test.tsx
import { describe, it, expect } from 'vitest';
import { render, screen } from '@/test/utils/render';
import { Table } from './Table';

describe('Table', () => {
  it('renders correctly', () => {
    render(
      <Table
        data={[{ id: '1', name: 'Test' }]}
        columns={[{ id: 'name', header: 'Name', accessor: 'name' }]}
      />
    );

    expect(screen.getByText('Name')).toBeInTheDocument();
  });
});
```

**Étape 4**: Mettre à jour l'export central

```typescript
// src/shared/components/data-display/index.ts
export * from './Table';

// src/shared/components/index.ts
export * from './data-display';
export * from './layout';
export * from './forms';
export * from './feedback';
export * from './ui';
```

**Étape 5**: Migrer les usages (un par un)

```bash
# Rechercher tous les usages
grep -r "from.*components/Table" src/

# Remplacer
# ❌ import DataTable from "../Table";
# ✅ import { Table as DataTable } from '@/shared/components';
```

**Étape 6**: Vérifier que tout fonctionne

```bash
npm run dev
npm run build
npm run test
```

**Étape 7**: Supprimer l'ancien fichier

```bash
# Seulement quand TOUS les usages sont migrés
git rm src/components/Table.tsx
```

**Répéter pour chaque composant partagé**

#### 2.2 Migration des Hooks Partagés (1 jour)

```bash
# Structure actuelle
src/hooks/shared/
  useAudit.ts
  useDataTable.ts
  useExport.ts
  useFilters.ts
  useUINotifications.ts

# → Déjà bien placés! Juste renommer le dossier
mv src/hooks/shared src/shared/hooks/

# Mettre à jour tous les imports
# ❌ from '../../hooks/shared/useExport'
# ✅ from '@/shared/hooks'
```

**Créer l'index.ts central**

```typescript
// src/shared/hooks/index.ts
export * from './useAudit';
export * from './useDataTable';
export * from './useExport';
export * from './useFilters';
export * from './useUINotifications';
export * from './useDebounce';
export * from './useLocalStorage';
```

**Ajouter des tests**

```typescript
// src/shared/hooks/useDebounce.test.ts
import { renderHook, act, waitFor } from '@testing-library/react';
import { useDebounce } from './useDebounce';

describe('useDebounce', () => {
  it('debounces value changes', async () => {
    const { result, rerender } = renderHook(({ value, delay }) => useDebounce(value, delay), {
      initialProps: { value: 'initial', delay: 500 },
    });

    expect(result.current).toBe('initial');

    rerender({ value: 'updated', delay: 500 });
    expect(result.current).toBe('initial'); // Still old value

    await waitFor(() => expect(result.current).toBe('updated'), {
      timeout: 600,
    });
  });
});
```

#### 2.3 Migration des Utils (0.5 jour)

```bash
# Déplacer et organiser par catégorie
mkdir -p src/shared/utils/{date,string,number,array}

# Date utils
mv src/utils/formatting.ts src/shared/utils/date/
mv src/utils/dataHelpers.ts src/shared/utils/array/

# Créer les index.ts
```

**Exemple: date utils**

```typescript
// src/shared/utils/date/formatDate.ts
export const formatDate = (date: Date, format: string): string => {
  // Implementation
};

export const parseDate = (dateString: string): Date => {
  // Implementation
};

// src/shared/utils/date/index.ts
export * from './formatDate';

// src/shared/utils/index.ts
export * from './date';
export * from './string';
export * from './number';
export * from './array';
```

#### 2.4 Migration des Types Partagés (0.5 jour)

```typescript
// src/shared/types/common.types.ts
export interface SelectOption {
  value: string;
  label: string;
  disabled?: boolean;
}

export interface PaginationConfig {
  page: number;
  size: number;
  total: number;
}

// src/shared/types/api.types.ts
export interface ApiResponse<T> {
  success: boolean;
  data?: T;
  error?: string;
  message?: string;
}

// src/shared/types/index.ts
export * from './common.types';
export * from './api.types';
export * from './pagination.types';
```

### 📊 Résultat Phase 2

- ✅ Tous les composants partagés dans `shared/components/`
- ✅ Tous les hooks partagés dans `shared/hooks/`
- ✅ Utils organisés par catégorie
- ✅ Types partagés centralisés
- ✅ Tests pour les éléments critiques
- ⏱️ Durée: ~3 jours

**Commit**: `refactor(shared): migrate shared components, hooks and utils`

---

## 📦 PHASE 3: MIGRATION CORE (Semaine 3)

### 🎯 Objectif

Centraliser l'infrastructure (API, config, services).

### ✅ Tâches

#### 3.1 Migration Configuration (1 jour)

```bash
# Créer la structure core
mkdir -p src/core/{api,config,services,types}
```

**src/core/config/env.ts**

```typescript
import { z } from 'zod';

const envSchema = z.object({
  VITE_SUPABASE_URL: z.string().url(),
  VITE_SUPABASE_ANON_KEY: z.string().min(1),
  MODE: z.enum(['development', 'production', 'test']),
});

const parseEnv = () => {
  const env = {
    VITE_SUPABASE_URL: import.meta.env.VITE_SUPABASE_URL,
    VITE_SUPABASE_ANON_KEY: import.meta.env.VITE_SUPABASE_ANON_KEY,
    MODE: import.meta.env.MODE,
  };

  const result = envSchema.safeParse(env);

  if (!result.success) {
    console.error('❌ Invalid environment variables:', result.error.flatten());
    throw new Error('Invalid environment variables');
  }

  return result.data;
};

export const env = parseEnv();
```

**src/core/config/theme.ts**

```typescript
import { createTheme } from '@mui/material/styles';

export const theme = createTheme({
  palette: {
    mode: 'light',
    primary: {
      main: '#1976d2',
    },
    secondary: {
      main: '#dc004e',
    },
  },
  typography: {
    fontFamily: '"Roboto", "Helvetica", "Arial", sans-serif',
  },
});
```

**src/core/config/query-client.ts**

```typescript
import { QueryClient } from '@tanstack/react-query';

export const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      retry: 2,
      staleTime: 5 * 60 * 1000,
      gcTime: 10 * 60 * 1000,
      refetchOnWindowFocus: false,
    },
  },
});
```

#### 3.2 Migration API (1 jour)

**src/core/api/supabase.ts**

```typescript
import { createClient } from '@supabase/supabase-js';
import { env } from '@/core/config/env';
import type { Database } from '@/core/types/database.types';

export const supabase = createClient<Database>(env.VITE_SUPABASE_URL, env.VITE_SUPABASE_ANON_KEY);
```

**src/core/api/base.api.ts**

```typescript
import { supabase } from './supabase';
import type { Database } from '@/core/types/database.types';

type TableName = keyof Database['public']['Tables'];
type Row<T extends TableName> = Database['public']['Tables'][T]['Row'];
type Insert<T extends TableName> = Database['public']['Tables'][T]['Insert'];
type Update<T extends TableName> = Database['public']['Tables'][T]['Update'];

export class BaseApi<T extends TableName> {
  constructor(protected tableName: T) {}

  async getAll() {
    const { data, error } = await supabase.from(this.tableName).select('*');

    if (error) throw error;
    return data as Row<T>[];
  }

  async getById(id: string) {
    const { data, error } = await supabase.from(this.tableName).select('*').eq('id', id).single();

    if (error) throw error;
    return data as Row<T>;
  }

  async create(record: Insert<T>) {
    const { data, error } = await supabase.from(this.tableName).insert(record).select().single();

    if (error) throw error;
    return data as Row<T>;
  }

  async update(id: string, updates: Update<T>) {
    const { data, error } = await supabase
      .from(this.tableName)
      .update(updates)
      .eq('id', id)
      .select()
      .single();

    if (error) throw error;
    return data as Row<T>;
  }

  async delete(id: string) {
    const { error } = await supabase.from(this.tableName).delete().eq('id', id);

    if (error) throw error;
  }
}
```

#### 3.3 Migration Types Database (0.5 jour)

```bash
# Déplacer les types générés
mv src/types/database.types.ts src/core/types/
mv src/types/supabase.ts src/core/types/

# Créer l'index
cat > src/core/types/index.ts << 'EOF'
export * from './database.types';
export * from './supabase';
EOF
```

#### 3.4 Migration Providers (1 jour)

```bash
mkdir -p src/app/providers
```

**src/app/providers/AuthProvider.tsx**

```typescript
// Copier depuis src/providers/authProvider.tsx
// Mettre à jour les imports avec path aliases

import { supabase } from '@/core/api/supabase';
import type { Database } from '@/core/types';
// ...
```

**src/app/providers/AppProviders.tsx**

```typescript
import { ReactNode } from 'react';
import { QueryClientProvider } from '@tanstack/react-query';
import { ReactQueryDevtools } from '@tanstack/react-query-devtools';
import { ThemeProvider } from '@mui/material/styles';
import { CssBaseline } from '@mui/material';
import { AuthProvider } from './AuthProvider';
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
```

**src/app/App.tsx**

```typescript
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
```

### 📊 Résultat Phase 3

- ✅ Configuration centralisée dans `core/config/`
- ✅ API abstraite dans `core/api/`
- ✅ Types database dans `core/types/`
- ✅ Providers dans `app/providers/`
- ⏱️ Durée: ~3.5 jours

**Commit**: `refactor(core): centralize infrastructure and configuration`

---

## 📦 PHASE 4: MIGRATION FEATURES (Semaines 4-5)

### 🎯 Objectif

Migrer chaque domaine vers `features/` un par un.

### 🗺️ Ordre de migration recommandé

1. **auth** (simple, peu de dépendances) - 0.5 jour
2. **profile** (simple, peu de dépendances) - 0.5 jour
3. **analytics** (moyenne complexité) - 1 jour
4. **services** (moyenne complexité) - 1 jour
5. **quotes** (moyenne complexité) - 1 jour
6. **payments** (moyenne complexité) - 1 jour
7. **properties** (complexe) - 2 jours
8. **users** (très complexe) - 3 jours

### ✅ Processus de Migration (par domaine)

#### Exemple: Migration "users"

**Étape 1: Créer la structure** (30 min)

```bash
# Créer la structure complète
mkdir -p src/features/users/{components,hooks,api,types,utils,stores,__tests__}
mkdir -p src/features/users/components/{UserList,UserDetails,UserForm,modals}

# Créer les fichiers index.ts
touch src/features/users/index.ts
touch src/features/users/routes.tsx
touch src/features/users/components/index.ts
touch src/features/users/hooks/index.ts
touch src/features/users/api/index.ts
touch src/features/users/types/index.ts
```

**Étape 2: Migrer les types** (1h)

```typescript
// src/features/users/types/user.types.ts
import { z } from 'zod';
import type { Tables } from '@/core/types';

export type UserProfile = Tables<'profiles'>;

export const UserRoleSchema = z.enum(['admin', 'traveler', 'provider']);
export type UserRole = z.infer<typeof UserRoleSchema>;

export const UserStatusSchema = z.enum(['active', 'pending', 'suspended']);
export type UserStatus = z.infer<typeof UserStatusSchema>;

// src/features/users/types/user-filters.types.ts
export interface UserFilters {
  role?: UserRole;
  status?: UserStatus;
  search?: string;
  subscription?: 'vip' | 'free';
}

// src/features/users/types/index.ts
export * from './user.types';
export * from './user-filters.types';
```

**Étape 3: Migrer l'API** (2h)

```typescript
// src/features/users/api/users.api.ts
import { BaseApi } from '@/core/api/base.api';
import type { UserProfile, UserFilters } from '../types';

class UsersApi extends BaseApi<'profiles'> {
  constructor() {
    super('profiles');
  }

  async getAllWithFilters(filters?: UserFilters): Promise<UserProfile[]> {
    // Implementation avec filtres
    // ...
  }

  // Méthodes spécifiques au domaine
  async validateUser(userId: string): Promise<UserProfile> {
    // ...
  }

  async toggleVIP(userId: string): Promise<UserProfile> {
    // ...
  }
}

export const usersApi = new UsersApi();

// src/features/users/api/users.queries.ts
import { queryOptions } from '@tanstack/react-query';
import { usersApi } from './users.api';
import type { UserFilters } from '../types';

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
      queryFn: () => usersApi.getAllWithFilters(filters),
    }),

  detail: (id: string) =>
    queryOptions({
      queryKey: userKeys.detail(id),
      queryFn: () => usersApi.getById(id),
    }),
};
```

**Étape 4: Migrer les hooks** (3h)

```typescript
// src/features/users/hooks/useUsers.ts
import { useQuery } from '@tanstack/react-query';
import { userQueries } from '../api/users.queries';
import type { UserFilters } from '../types';

export const useUsers = (filters?: UserFilters) => {
  return useQuery(userQueries.all(filters));
};

// src/features/users/hooks/useUserMutations.ts
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { usersApi } from '../api/users.api';
import { userKeys } from '../api/users.queries';
import type { UserProfile } from '../types';

export const useUserMutations = () => {
  const queryClient = useQueryClient();

  const updateUser = useMutation({
    mutationFn: ({ id, updates }: { id: string; updates: Partial<UserProfile> }) =>
      usersApi.update(id, updates),
    onSuccess: (_, { id }) => {
      queryClient.invalidateQueries({ queryKey: userKeys.detail(id) });
      queryClient.invalidateQueries({ queryKey: userKeys.lists() });
    },
  });

  // ... autres mutations

  return {
    updateUser,
    // ...
  };
};

// src/features/users/hooks/index.ts
export * from './useUsers';
export * from './useUserMutations';
export * from './useUserFilters';
```

**Étape 5: Migrer les composants** (4h)

```typescript
// src/features/users/components/UserList/UserList.tsx
import { Box, Typography } from '@mui/material';
import { useUsers } from '../../hooks/useUsers';
import { useUserFilters } from '../../hooks/useUserFilters';
import { UserListItem } from './UserListItem';
import { UserListFilters } from './UserListFilters';
import { Table, LoadingSpinner, ErrorAlert } from '@/shared/components';

export const UserList = () => {
  const { filters, updateFilter } = useUserFilters();
  const { data: users, isLoading, error } = useUsers(filters);

  if (isLoading) return <LoadingSpinner />;
  if (error) return <ErrorAlert error={error} />;

  return (
    <Box>
      <Typography variant="h4">Gestion des utilisateurs</Typography>
      <UserListFilters filters={filters} onChange={updateFilter} />
      <Table
        data={users || []}
        columns={userColumns}
        renderRow={(user) => <UserListItem user={user} />}
      />
    </Box>
  );
};

// src/features/users/components/UserList/index.ts
export { UserList } from './UserList';
export { UserListItem } from './UserListItem';
export { UserListFilters } from './UserListFilters';
```

**Étape 6: Migrer la page** (1h)

```typescript
// src/features/users/components/UserManagementPage.tsx
import { AdminLayout } from '@/shared/components/layout';
import { UserList } from './UserList';

export const UserManagementPage = () => {
  return (
    <AdminLayout>
      <UserList />
    </AdminLayout>
  );
};
```

**Étape 7: Créer les routes** (30 min)

```typescript
// src/features/users/routes.tsx
import { lazy } from 'react';
import { RouteObject } from 'react-router-dom';

const UserManagementPage = lazy(() =>
  import('./components/UserManagementPage').then((m) => ({
    default: m.UserManagementPage,
  }))
);

const UserDetailsPage = lazy(() =>
  import('./components/UserDetails').then((m) => ({
    default: m.UserDetails,
  }))
);

export const usersRoutes: RouteObject[] = [
  {
    path: 'users',
    children: [
      { index: true, element: <UserManagementPage /> },
      { path: ':id', element: <UserDetailsPage /> },
    ],
  },
];
```

**Étape 8: Public API** (15 min)

```typescript
// src/features/users/index.ts
// ⭐ Point d'entrée unique du domaine
export * from './components';
export * from './hooks';
export * from './types';
export { usersRoutes } from './routes';
```

**Étape 9: Tests** (2h)

```typescript
// src/features/users/__tests__/UserList.test.tsx
import { describe, it, expect, vi } from 'vitest';
import { render, screen, waitFor } from '@/test/utils/render';
import { UserList } from '../components/UserList';
import * as useUsersHook from '../hooks/useUsers';

vi.mock('../hooks/useUsers');

describe('UserList', () => {
  it('displays loading state', () => {
    vi.spyOn(useUsersHook, 'useUsers').mockReturnValue({
      data: undefined,
      isLoading: true,
      error: null,
    } as any);

    render(<UserList />);
    expect(screen.getByText(/loading/i)).toBeInTheDocument();
  });

  it('displays users when loaded', async () => {
    const mockUsers = [
      { id: '1', fullName: 'John Doe', email: 'john@example.com' },
    ];

    vi.spyOn(useUsersHook, 'useUsers').mockReturnValue({
      data: mockUsers,
      isLoading: false,
      error: null,
    } as any);

    render(<UserList />);

    await waitFor(() => {
      expect(screen.getByText('John Doe')).toBeInTheDocument();
    });
  });
});

// src/features/users/__tests__/useUsers.test.ts
import { describe, it, expect } from 'vitest';
import { renderHook, waitFor } from '@testing-library/react';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { useUsers } from '../hooks/useUsers';

const createWrapper = () => {
  const queryClient = new QueryClient({
    defaultOptions: { queries: { retry: false } },
  });

  return ({ children }: { children: React.ReactNode }) => (
    <QueryClientProvider client={queryClient}>
      {children}
    </QueryClientProvider>
  );
};

describe('useUsers', () => {
  it('fetches users successfully', async () => {
    const { result } = renderHook(() => useUsers(), {
      wrapper: createWrapper(),
    });

    await waitFor(() => expect(result.current.isSuccess).toBe(true));
    expect(result.current.data).toBeDefined();
  });
});
```

**Étape 10: Mise à jour du router** (15 min)

```typescript
// src/app/router.tsx
import { createBrowserRouter } from 'react-router-dom';
import { usersRoutes } from '@/features/users';
import { propertiesRoutes } from '@/features/properties';
// ...

export const router = createBrowserRouter([
  {
    path: '/',
    element: <AdminLayout />,
    children: [
      ...usersRoutes,
      ...propertiesRoutes,
      // ...
    ],
  },
]);
```

**Étape 11: Vérification** (30 min)

```bash
# Tests
npm run test features/users

# Build
npm run build

# Run
npm run dev

# Vérifier que tout fonctionne
```

**Étape 12: Nettoyage** (30 min)

```bash
# Supprimer l'ancienne structure SEULEMENT si tout fonctionne
git rm -r src/components/userManagement
git rm -r src/hooks/user-management

# Commit
git add src/features/users
git commit -m "feat(users): migrate to feature-first architecture"
```

### 📊 Répéter pour chaque domaine

**Ordre recommandé**:

1. ✅ auth (0.5j)
2. ✅ profile (0.5j)
3. ✅ analytics (1j)
4. ✅ services (1j)
5. ✅ quotes (1j)
6. ✅ payments (1j)
7. ✅ properties (2j)
8. ✅ users (3j)

**Total Phase 4**: ~10 jours

**Commits**: Un commit par domaine migré

---

## 📦 PHASE 5: FINALISATION (Semaine 6)

### 🎯 Objectif

Nettoyer, documenter et optimiser.

### ✅ Tâches

#### 5.1 Nettoyage Final (1 jour)

```bash
# Supprimer les anciens dossiers
rm -rf src/components  # (si vide)
rm -rf src/hooks       # (si vide)
rm -rf src/providers   # (si vide)

# Vérifier qu'il ne reste pas de fichiers obsolètes
find src -name "*.tsx" -o -name "*.ts" | xargs grep -l "from.*\.\./"
# → Si résultats, corriger les imports restants
```

#### 5.2 Documentation (1 jour)

**ARCHITECTURE.md**

```markdown
# Architecture du Projet

## Structure

Ce projet suit une architecture **feature-first** (domain-driven).

### Dossiers principaux

- `src/app/`: Configuration de l'application
- `src/features/`: Domaines métier (autonomes)
- `src/shared/`: Composants/hooks/utils réutilisables
- `src/core/`: Infrastructure (API, config, services)

### Ajouter une nouvelle feature

1. Créer le dossier: `src/features/ma-feature/`
2. Suivre la structure standard:
```

ma-feature/
├── components/
├── hooks/
├── api/
├── types/
├── routes.tsx
└── index.ts

```
3. Créer le public API dans `index.ts`
4. Ajouter les routes dans `app/router.tsx`

### Conventions

- Imports: Toujours utiliser les path aliases (`@/...`)
- Nommage: PascalCase pour composants, camelCase pour hooks
- Tests: Colocalisés avec le code (`*.test.ts`)
```

**CONTRIBUTING.md**

````markdown
# Guide de Contribution

## Getting Started

```bash
npm install
npm run dev
```
````

## Structure des features

Chaque feature doit être autonome et suivre cette structure:

```
features/ma-feature/
├── index.ts              # Public API
├── routes.tsx            # Routes
├── components/           # UI
├── hooks/                # Logique métier
├── api/                  # Appels API
├── types/                # Types TypeScript
└── __tests__/            # Tests
```

## Workflow

1. Créer une branche: `feature/ma-feature`
2. Développer avec TDD (tests first)
3. Vérifier: `npm run test && npm run build`
4. Commit: `feat(domain): description`
5. Pull Request

## Tests

```bash
npm run test              # Run tests
npm run test:coverage     # Coverage report
npm run test:ui           # UI interactive
```

## Conventions de commits

- `feat(domain): description` - Nouvelle fonctionnalité
- `fix(domain): description` - Correction de bug
- `refactor(domain): description` - Refactoring
- `test(domain): description` - Ajout de tests
- `docs: description` - Documentation
- `chore: description` - Tâches diverses

````

#### 5.3 Optimisation (1 jour)

**Lazy loading**
```typescript
// Vérifier que toutes les routes utilisent lazy()
import { lazy } from 'react';

const UserManagementPage = lazy(() => import('@/features/users'));
````

**Bundle analysis**

```bash
npm install -D rollup-plugin-visualizer

# vite.config.ts
import { visualizer } from 'rollup-plugin-visualizer';

export default defineConfig({
  plugins: [
    react(),
    visualizer({ open: true }),
  ],
});

# Générer le rapport
npm run build
```

**Code splitting optimisé**

```typescript
// vite.config.ts
export default defineConfig({
  build: {
    rollupOptions: {
      output: {
        manualChunks: {
          'react-vendor': ['react', 'react-dom', 'react-router-dom'],
          'mui-vendor': ['@mui/material', '@mui/icons-material'],
          'query-vendor': ['@tanstack/react-query'],
          // Par domaine
          'users-feature': ['./src/features/users'],
          'properties-feature': ['./src/features/properties'],
        },
      },
    },
  },
});
```

#### 5.4 Tests E2E (1 jour)

```bash
npm install -D playwright @playwright/test
npx playwright install
```

**playwright.config.ts**

```typescript
import { defineConfig } from '@playwright/test';

export default defineConfig({
  testDir: './e2e',
  use: {
    baseURL: 'http://localhost:3000',
  },
  webServer: {
    command: 'npm run dev',
    port: 3000,
  },
});
```

**e2e/users.spec.ts**

```typescript
import { test, expect } from '@playwright/test';

test('user can login and see dashboard', async ({ page }) => {
  await page.goto('/auth');
  await page.fill('[name="email"]', 'admin@example.com');
  await page.fill('[name="password"]', 'password');
  await page.click('button[type="submit"]');

  await expect(page).toHaveURL('/dashboard');
  await expect(page.locator('h1')).toContainText('Dashboard');
});
```

#### 5.5 CI/CD (0.5 jour)

**.github/workflows/ci.yml**

```yaml
name: CI

on:
  push:
    branches: [main, develop]
  pull_request:
    branches: [main, develop]

jobs:
  test:
    runs-on: ubuntu-latest

    steps:
      - uses: actions/checkout@v3

      - name: Setup Node
        uses: actions/setup-node@v3
        with:
          node-version: '20'
          cache: 'npm'

      - name: Install dependencies
        run: npm ci

      - name: Run linter
        run: npm run lint

      - name: Run tests
        run: npm run test:coverage

      - name: Build
        run: npm run build

      - name: Upload coverage
        uses: codecov/codecov-action@v3
        with:
          files: ./coverage/coverage-final.json
```

### 📊 Résultat Phase 5

- ✅ Code nettoyé et optimisé
- ✅ Documentation complète
- ✅ Tests E2E en place
- ✅ CI/CD configuré
- ✅ Bundle optimisé
- ⏱️ Durée: ~4.5 jours

**Commit**: `chore: finalize migration and add documentation`

---

## 📊 RÉSUMÉ FINAL

### Timeline complète

| Phase                 | Durée          | Résultat                   |
| --------------------- | -------------- | -------------------------- |
| Phase 1: Fondations   | 1 semaine      | Infrastructure prête       |
| Phase 2: Shared       | 1 semaine      | Composants partagés migrés |
| Phase 3: Core         | 1 semaine      | Infrastructure centralisée |
| Phase 4: Features     | 2 semaines     | Tous les domaines migrés   |
| Phase 5: Finalisation | 1 semaine      | Projet finalisé            |
| **TOTAL**             | **6 semaines** | **Migration complète**     |

### Métriques d'amélioration attendues

| Métrique               | Avant      | Après      | Amélioration |
| ---------------------- | ---------- | ---------- | ------------ |
| Imports relatifs       | 100%       | 0%         | -100%        |
| Taille moyenne fichier | 400 lignes | 150 lignes | -62%         |
| Couverture tests       | 0%         | 60%+       | +60%         |
| Temps build            | Baseline   | -20%       | Optimisé     |
| Temps onboarding       | 2 semaines | 3 jours    | -75%         |

### Checklist finale

- [ ] Tous les path aliases fonctionnent
- [ ] Tous les tests passent
- [ ] Build production OK
- [ ] Aucun import relatif (`../`)
- [ ] Documentation à jour
- [ ] CI/CD configuré
- [ ] Coverage >60%
- [ ] Bundle size optimisé

---

## 🎯 NEXT STEPS

Après la migration:

1. **Continuous improvement**
   - Ajouter des tests au fur et à mesure
   - Améliorer la couverture de tests
   - Optimiser les performances

2. **Documentation vivante**
   - Maintenir ARCHITECTURE.md à jour
   - Documenter les nouvelles conventions
   - Créer des guides pour les patterns courants

3. **Monitoring**
   - Surveiller la taille des bundles
   - Tracker la dette technique
   - Mesurer les performances

4. **Évolution**
   - Ajouter Storybook pour les composants
   - Implémenter i18n si nécessaire
   - Améliorer l'accessibilité

---

**Prêt à démarrer la migration ?** 🚀

Commencez par la **Phase 1** et suivez le plan étape par étape !
