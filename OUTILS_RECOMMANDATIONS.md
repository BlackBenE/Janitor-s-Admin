# 🛠️ OUTILS ET RECOMMANDATIONS - Architecture 2025

**Date**: 24 octobre 2025  
**Complément aux documents**: Audit + Architecture Cible + Plan de Migration

---

## 📦 OUTILS RECOMMANDÉS

### 1. 🧪 Testing

#### Vitest (déjà dans le plan)

```bash
npm install -D vitest @vitest/ui @vitest/coverage-v8 jsdom
```

**Configuration complète**

```typescript
// vitest.config.ts
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
      reporter: ['text', 'html', 'json', 'lcov'],
      exclude: [
        'node_modules/',
        'src/test/',
        '**/*.test.{ts,tsx}',
        '**/*.stories.{ts,tsx}',
        '**/index.ts',
      ],
      thresholds: {
        lines: 60,
        functions: 60,
        branches: 60,
        statements: 60,
      },
    },
  },
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src'),
    },
  },
});
```

#### Testing Library (déjà installé)

Déjà présent dans votre projet ✅

#### Mock Service Worker (MSW) - Recommandé

```bash
npm install -D msw
```

**src/test/mocks/handlers.ts**

```typescript
import { http, HttpResponse } from 'msw';
import { env } from '@/core/config/env';

const API_URL = `${env.VITE_SUPABASE_URL}/rest/v1`;

export const handlers = [
  // Mock GET users
  http.get(`${API_URL}/profiles`, () => {
    return HttpResponse.json([
      { id: '1', full_name: 'John Doe', email: 'john@example.com' },
      { id: '2', full_name: 'Jane Smith', email: 'jane@example.com' },
    ]);
  }),

  // Mock POST user
  http.post(`${API_URL}/profiles`, async ({ request }) => {
    const body = await request.json();
    return HttpResponse.json({ id: '3', ...body }, { status: 201 });
  }),
];
```

**src/test/mocks/server.ts**

```typescript
import { setupServer } from 'msw/node';
import { handlers } from './handlers';

export const server = setupServer(...handlers);
```

**src/test/setup.ts** (mise à jour)

```typescript
import '@testing-library/jest-dom';
import { expect, afterEach, beforeAll, afterAll, vi } from 'vitest';
import { cleanup } from '@testing-library/react';
import { server } from './mocks/server';

// Setup MSW
beforeAll(() => server.listen({ onUnhandledRequest: 'error' }));
afterEach(() => {
  cleanup();
  server.resetHandlers();
});
afterAll(() => server.close());

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

### 2. 📚 Documentation

#### Storybook - Hautement recommandé

```bash
npx storybook@latest init
```

**Configuration**

```typescript
// .storybook/main.ts
import type { StorybookConfig } from '@storybook/react-vite';
import path from 'path';

const config: StorybookConfig = {
  stories: ['../src/**/*.stories.@(js|jsx|ts|tsx)'],
  addons: [
    '@storybook/addon-links',
    '@storybook/addon-essentials',
    '@storybook/addon-interactions',
    '@storybook/addon-a11y',
  ],
  framework: {
    name: '@storybook/react-vite',
    options: {},
  },
  viteFinal: async (config) => {
    config.resolve = config.resolve || {};
    config.resolve.alias = {
      ...config.resolve.alias,
      '@': path.resolve(__dirname, '../src'),
    };
    return config;
  },
};

export default config;
```

**Exemple de story**

```typescript
// src/shared/components/ui/Button/Button.stories.tsx
import type { Meta, StoryObj } from '@storybook/react';
import { Button } from './Button';

const meta = {
  title: 'Shared/UI/Button',
  component: Button,
  parameters: {
    layout: 'centered',
  },
  tags: ['autodocs'],
  argTypes: {
    variant: {
      control: 'select',
      options: ['contained', 'outlined', 'text'],
    },
    color: {
      control: 'select',
      options: ['primary', 'secondary', 'error'],
    },
  },
} satisfies Meta<typeof Button>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Primary: Story = {
  args: {
    children: 'Button',
    variant: 'contained',
    color: 'primary',
  },
};

export const Secondary: Story = {
  args: {
    children: 'Button',
    variant: 'outlined',
    color: 'secondary',
  },
};
```

#### TypeDoc - Pour documentation API

```bash
npm install -D typedoc
```

**typedoc.json**

```json
{
  "entryPoints": ["src"],
  "out": "docs",
  "exclude": ["**/*.test.ts", "**/*.stories.tsx"],
  "excludePrivate": true,
  "excludeProtected": true,
  "readme": "README.md"
}
```

**package.json**

```json
{
  "scripts": {
    "docs": "typedoc"
  }
}
```

### 3. 🎨 Code Quality

#### ESLint (déjà configuré) - Amélioration

**eslint.config.js** (mise à jour recommandée)

```javascript
import js from '@eslint/js';
import globals from 'globals';
import reactHooks from 'eslint-plugin-react-hooks';
import reactRefresh from 'eslint-plugin-react-refresh';
import tseslint from 'typescript-eslint';
import react from 'eslint-plugin-react';

export default tseslint.config(
  { ignores: ['dist', 'coverage', 'node_modules'] },
  {
    extends: [js.configs.recommended, ...tseslint.configs.recommendedTypeChecked],
    files: ['**/*.{ts,tsx}'],
    languageOptions: {
      ecmaVersion: 2020,
      globals: globals.browser,
      parserOptions: {
        project: ['./tsconfig.json'],
      },
    },
    plugins: {
      'react-hooks': reactHooks,
      'react-refresh': reactRefresh,
      react,
    },
    rules: {
      ...reactHooks.configs.recommended.rules,
      'react-refresh/only-export-components': ['warn', { allowConstantExport: true }],
      // Règles supplémentaires recommandées
      '@typescript-eslint/no-unused-vars': [
        'error',
        { argsIgnorePattern: '^_', varsIgnorePattern: '^_' },
      ],
      '@typescript-eslint/no-explicit-any': 'warn',
      '@typescript-eslint/explicit-function-return-type': 'off',
      '@typescript-eslint/explicit-module-boundary-types': 'off',
      'react/prop-types': 'off',
      'react/react-in-jsx-scope': 'off',
    },
    settings: {
      react: {
        version: 'detect',
      },
    },
  }
);
```

#### Prettier (dans le plan de migration)

Déjà couvert ✅

#### Husky + lint-staged - Git hooks

```bash
npm install -D husky lint-staged
npx husky init
```

**package.json**

```json
{
  "scripts": {
    "prepare": "husky"
  },
  "lint-staged": {
    "*.{ts,tsx}": ["eslint --fix", "prettier --write"],
    "*.{json,css,md}": ["prettier --write"]
  }
}
```

**.husky/pre-commit**

```bash
#!/usr/bin/env sh
. "$(dirname -- "$0")/_/husky.sh"

npx lint-staged
```

**.husky/pre-push**

```bash
#!/usr/bin/env sh
. "$(dirname -- "$0")/_/husky.sh"

npm run test
npm run build
```

#### Commitlint - Convention de commits

```bash
npm install -D @commitlint/cli @commitlint/config-conventional
```

**commitlint.config.js**

```javascript
export default {
  extends: ['@commitlint/config-conventional'],
  rules: {
    'type-enum': [
      2,
      'always',
      [
        'feat', // Nouvelle fonctionnalité
        'fix', // Correction de bug
        'docs', // Documentation
        'style', // Formatage
        'refactor', // Refactoring
        'test', // Tests
        'chore', // Tâches diverses
        'perf', // Performance
        'ci', // CI/CD
        'build', // Build
        'revert', // Revert
      ],
    ],
    'scope-enum': [
      2,
      'always',
      ['users', 'properties', 'analytics', 'auth', 'shared', 'core', 'config'],
    ],
  },
};
```

**.husky/commit-msg**

```bash
#!/usr/bin/env sh
. "$(dirname -- "$0")/_/husky.sh"

npx --no -- commitlint --edit $1
```

### 4. 🔍 Type Safety

#### Zod (pour validation runtime)

```bash
npm install zod
```

Déjà mentionné dans l'architecture cible ✅

#### ts-reset - Améliore les types TypeScript

```bash
npm install -D @total-typescript/ts-reset
```

**src/reset.d.ts**

```typescript
import '@total-typescript/ts-reset';
```

**tsconfig.json** (mise à jour)

```json
{
  "include": ["src", "src/reset.d.ts"]
}
```

### 5. 📊 Monitoring & Analytics

#### Sentry - Error tracking

```bash
npm install @sentry/react
```

**src/core/services/sentry.service.ts**

```typescript
import * as Sentry from '@sentry/react';

export const initSentry = () => {
  if (import.meta.env.PROD) {
    Sentry.init({
      dsn: import.meta.env.VITE_SENTRY_DSN,
      environment: import.meta.env.MODE,
      integrations: [Sentry.browserTracingIntegration(), Sentry.replayIntegration()],
      tracesSampleRate: 1.0,
      replaysSessionSampleRate: 0.1,
      replaysOnErrorSampleRate: 1.0,
    });
  }
};
```

**src/app/main.tsx** (mise à jour)

```typescript
import { initSentry } from '@/core/services/sentry.service';

initSentry();

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);
```

#### Bundle Analyzer

```bash
npm install -D rollup-plugin-visualizer
```

**vite.config.ts** (mise à jour)

```typescript
import { visualizer } from 'rollup-plugin-visualizer';

export default defineConfig({
  plugins: [
    react(),
    visualizer({
      open: true,
      gzipSize: true,
      brotliSize: true,
    }),
  ],
});
```

### 6. 🚀 Performance

#### React Virtualized / TanStack Virtual

```bash
npm install @tanstack/react-virtual
```

**Exemple d'utilisation**

```typescript
// Pour les grandes listes
import { useVirtualizer } from '@tanstack/react-virtual';

export const VirtualizedList = ({ items }) => {
  const parentRef = useRef<HTMLDivElement>(null);

  const virtualizer = useVirtualizer({
    count: items.length,
    getScrollElement: () => parentRef.current,
    estimateSize: () => 50,
  });

  return (
    <div ref={parentRef} style={{ height: '400px', overflow: 'auto' }}>
      <div
        style={{
          height: `${virtualizer.getTotalSize()}px`,
          position: 'relative',
        }}
      >
        {virtualizer.getVirtualItems().map((virtualItem) => (
          <div
            key={virtualItem.key}
            style={{
              position: 'absolute',
              top: 0,
              left: 0,
              width: '100%',
              height: `${virtualItem.size}px`,
              transform: `translateY(${virtualItem.start}px)`,
            }}
          >
            {items[virtualItem.index]}
          </div>
        ))}
      </div>
    </div>
  );
};
```

#### Web Vitals monitoring

```bash
npm install web-vitals
```

**src/core/services/web-vitals.service.ts**

```typescript
import { onCLS, onFID, onFCP, onLCP, onTTFB } from 'web-vitals';

export const reportWebVitals = (onPerfEntry?: (metric: any) => void) => {
  if (onPerfEntry && onPerfEntry instanceof Function) {
    onCLS(onPerfEntry);
    onFID(onPerfEntry);
    onFCP(onPerfEntry);
    onLCP(onPerfEntry);
    onTTFB(onPerfEntry);
  }
};
```

### 7. 🔐 Sécurité

#### DOMPurify - Sanitization

```bash
npm install dompurify
npm install -D @types/dompurify
```

**src/shared/utils/sanitize.ts**

```typescript
import DOMPurify from 'dompurify';

export const sanitizeHtml = (dirty: string): string => {
  return DOMPurify.sanitize(dirty, {
    ALLOWED_TAGS: ['b', 'i', 'em', 'strong', 'a', 'p', 'br'],
    ALLOWED_ATTR: ['href', 'target'],
  });
};
```

#### Helmet - Security headers (si SSR)

Si vous passez à SSR plus tard :

```bash
npm install react-helmet-async
```

---

## 🎯 CHECKLIST QUALITÉ

### Avant chaque commit

```bash
# 1. Linting
npm run lint

# 2. Type check
tsc --noEmit

# 3. Tests
npm run test

# 4. Format
npm run format

# 5. Build
npm run build
```

### Avant chaque PR

```bash
# 1. Tests avec coverage
npm run test:coverage

# 2. E2E tests
npm run test:e2e

# 3. Build production
npm run build

# 4. Analyse bundle
npm run analyze

# 5. Lighthouse audit (manuel)
```

### Avant chaque release

```bash
# 1. Full test suite
npm run test:all

# 2. Security audit
npm audit

# 3. Dependency check
npm outdated

# 4. Bundle size check
npm run analyze

# 5. Performance profiling
```

---

## 📊 MÉTRIQUES À SUIVRE

### Code Quality

| Métrique              | Outil      | Objectif       |
| --------------------- | ---------- | -------------- |
| **Test Coverage**     | Vitest     | ≥60%           |
| **Type Coverage**     | TypeScript | ≥95%           |
| **Linting Errors**    | ESLint     | 0              |
| **Security Vulns**    | npm audit  | 0 critical     |
| **Bundle Size**       | Visualizer | <500KB initial |
| **Performance Score** | Lighthouse | ≥90            |

### Performance

| Métrique                     | Outil      | Objectif |
| ---------------------------- | ---------- | -------- |
| **First Contentful Paint**   | Web Vitals | <1.8s    |
| **Largest Contentful Paint** | Web Vitals | <2.5s    |
| **Time to Interactive**      | Lighthouse | <3.8s    |
| **Cumulative Layout Shift**  | Web Vitals | <0.1     |
| **First Input Delay**        | Web Vitals | <100ms   |

### Maintenabilité

| Métrique            | Outil     | Objectif    |
| ------------------- | --------- | ----------- |
| **Avg File Size**   | Manuel    | <300 lignes |
| **Max Complexity**  | ESLint    | <15         |
| **Duplicate Code**  | SonarQube | <3%         |
| **Tech Debt Ratio** | SonarQube | <5%         |

---

## 🔧 CONFIGURATION VS CODE

### Extensions recommandées

**.vscode/extensions.json**

```json
{
  "recommendations": [
    "dbaeumer.vscode-eslint",
    "esbenp.prettier-vscode",
    "bradlc.vscode-tailwindcss",
    "ms-playwright.playwright",
    "vitest.explorer",
    "streetsidesoftware.code-spell-checker",
    "usernamehw.errorlens",
    "christian-kohler.path-intellisense",
    "chakrounanas.turbo-console-log"
  ]
}
```

### Settings recommandées

**.vscode/settings.json**

```json
{
  "editor.formatOnSave": true,
  "editor.defaultFormatter": "esbenp.prettier-vscode",
  "editor.codeActionsOnSave": {
    "source.fixAll.eslint": "explicit",
    "source.organizeImports": "explicit"
  },
  "typescript.tsdk": "node_modules/typescript/lib",
  "typescript.enablePromptUseWorkspaceTsdk": true,
  "files.associations": {
    "*.css": "tailwindcss"
  },
  "tailwindCSS.experimental.classRegex": [["cva\\(([^)]*)\\)", "[\"'`]([^\"'`]*).*?[\"'`]"]],
  "vitest.enable": true
}
```

---

## 📚 RESSOURCES RECOMMANDÉES

### Documentation

- **React**: https://react.dev/
- **TypeScript**: https://www.typescriptlang.org/docs/
- **Vite**: https://vitejs.dev/
- **TanStack Query**: https://tanstack.com/query/latest
- **Material-UI**: https://mui.com/
- **Vitest**: https://vitest.dev/

### Best Practices

- **React Patterns**: https://reactpatterns.com/
- **TypeScript Best Practices**: https://typescript-eslint.io/
- **Clean Code**: https://github.com/ryanmcdermott/clean-code-javascript
- **Testing Best Practices**: https://kentcdodds.com/blog/common-mistakes-with-react-testing-library

### Blogs à suivre

- **Kent C. Dodds**: https://kentcdodds.com/blog
- **Josh Comeau**: https://www.joshwcomeau.com/
- **Dan Abramov**: https://overreacted.io/
- **TkDodo (TanStack)**: https://tkdodo.eu/blog/

---

## 🎓 FORMATION ÉQUIPE

### Onboarding nouveau développeur

**Jour 1: Setup**

- Cloner le repo
- Installer les dépendances
- Lire ARCHITECTURE.md
- Lire CONTRIBUTING.md

**Jour 2-3: Découverte**

- Explorer la structure des features
- Lire le code de 2-3 domaines
- Exécuter les tests
- Lancer Storybook

**Jour 4-5: Première contribution**

- Corriger un bug simple
- Ajouter un test
- Créer une PR

**Semaine 2: Feature complète**

- Implémenter une petite feature
- Tests + documentation
- Code review

### Code Review Checklist

```markdown
## PR Checklist

### Code Quality

- [ ] Code suit les conventions de nommage
- [ ] Pas de code dupliqué
- [ ] Fonctions < 50 lignes
- [ ] Fichiers < 300 lignes
- [ ] Pas de `any` TypeScript

### Tests

- [ ] Tests unitaires ajoutés
- [ ] Tests passent tous
- [ ] Coverage maintenu ou amélioré

### Documentation

- [ ] JSDoc pour fonctions publiques
- [ ] README mis à jour si nécessaire
- [ ] Storybook stories si composant UI

### Performance

- [ ] Pas de re-renders inutiles
- [ ] Lazy loading si approprié
- [ ] Images optimisées

### Sécurité

- [ ] Validation des inputs
- [ ] Pas de données sensibles loguées
- [ ] Sanitization si HTML

### Accessibilité

- [ ] Labels ARIA si nécessaire
- [ ] Keyboard navigation OK
- [ ] Contraste couleurs OK
```

---

## 🚨 TROUBLESHOOTING COURANT

### Problème: Imports alias ne fonctionnent pas

**Solution**:

```bash
# 1. Vérifier tsconfig.json
cat tsconfig.json | grep "paths"

# 2. Vérifier vite.config.ts
cat vite.config.ts | grep "alias"

# 3. Redémarrer le serveur
npm run dev

# 4. Redémarrer VS Code
# Cmd+Shift+P > "Reload Window"
```

### Problème: Tests échouent après migration

**Solution**:

```bash
# 1. Clear cache
rm -rf node_modules/.vite
rm -rf coverage

# 2. Réinstaller
npm install

# 3. Vérifier les mocks
cat src/test/setup.ts

# 4. Run tests en mode watch
npm run test -- --watch
```

### Problème: Build échoue

**Solution**:

```bash
# 1. Type check
tsc --noEmit

# 2. Vérifier les imports circulaires
npm run build -- --logLevel info

# 3. Analyzer le bundle
npm run analyze
```

---

## 📦 PACKAGE.JSON COMPLET RECOMMANDÉ

```json
{
  "name": "back-office",
  "version": "1.0.0",
  "private": true,
  "type": "module",
  "scripts": {
    "dev": "vite",
    "build": "tsc -b && vite build",
    "preview": "vite preview",
    "lint": "eslint src --ext .ts,.tsx --fix",
    "lint:check": "eslint src --ext .ts,.tsx",
    "format": "prettier --write \"src/**/*.{ts,tsx,js,jsx,json,css,md}\"",
    "format:check": "prettier --check \"src/**/*.{ts,tsx,js,jsx,json,css,md}\"",
    "test": "vitest",
    "test:ui": "vitest --ui",
    "test:coverage": "vitest --coverage",
    "test:e2e": "playwright test",
    "type-check": "tsc --noEmit",
    "analyze": "vite build && vite-bundle-visualizer",
    "storybook": "storybook dev -p 6006",
    "build-storybook": "storybook build",
    "docs": "typedoc",
    "prepare": "husky"
  },
  "dependencies": {
    "@emotion/react": "^11.14.0",
    "@emotion/styled": "^11.14.1",
    "@hookform/resolvers": "^5.2.1",
    "@mui/icons-material": "^7.3.1",
    "@mui/material": "^7.3.1",
    "@mui/x-charts": "^8.11.0",
    "@mui/x-data-grid": "^8.11.0",
    "@mui/x-date-pickers": "^8.11.3",
    "@supabase/supabase-js": "^2.57.2",
    "@tanstack/react-query": "^5.87.1",
    "@tanstack/react-query-devtools": "^5.87.3",
    "@tanstack/react-virtual": "^3.0.0",
    "date-fns": "^4.1.0",
    "dompurify": "^3.0.0",
    "react": "^19.1.1",
    "react-dom": "^19.1.1",
    "react-helmet-async": "^2.0.0",
    "react-hook-form": "^7.62.0",
    "react-router-dom": "^7.8.2",
    "recharts": "^3.2.1",
    "web-vitals": "^4.0.0",
    "zod": "^4.1.5",
    "zustand": "^5.0.8"
  },
  "devDependencies": {
    "@commitlint/cli": "^18.0.0",
    "@commitlint/config-conventional": "^18.0.0",
    "@eslint/js": "^9.35.0",
    "@playwright/test": "^1.40.0",
    "@storybook/addon-essentials": "^7.6.0",
    "@storybook/addon-interactions": "^7.6.0",
    "@storybook/addon-links": "^7.6.0",
    "@storybook/addon-a11y": "^7.6.0",
    "@storybook/react": "^7.6.0",
    "@storybook/react-vite": "^7.6.0",
    "@testing-library/jest-dom": "^6.7.0",
    "@testing-library/react": "^16.3.0",
    "@testing-library/user-event": "^14.5.0",
    "@total-typescript/ts-reset": "^0.5.0",
    "@types/dompurify": "^3.0.0",
    "@types/node": "^24.3.0",
    "@types/react": "^19.1.12",
    "@types/react-dom": "^19.1.9",
    "@typescript-eslint/eslint-plugin": "^8.43.0",
    "@typescript-eslint/parser": "^8.43.0",
    "@vitejs/plugin-react": "^4.7.0",
    "@vitest/coverage-v8": "^1.0.0",
    "@vitest/ui": "^1.0.0",
    "eslint": "^9.35.0",
    "eslint-plugin-react": "^7.37.5",
    "eslint-plugin-react-hooks": "^5.2.0",
    "eslint-plugin-react-refresh": "^0.4.20",
    "globals": "^16.4.0",
    "husky": "^9.0.0",
    "jsdom": "^23.0.0",
    "lint-staged": "^15.0.0",
    "msw": "^2.0.0",
    "prettier": "^3.0.0",
    "rollup-plugin-visualizer": "^5.12.0",
    "storybook": "^7.6.0",
    "typedoc": "^0.25.0",
    "typescript": "^5.9.2",
    "vite": "^7.1.5",
    "vite-bundle-visualizer": "^1.0.0",
    "vitest": "^1.0.0"
  },
  "lint-staged": {
    "*.{ts,tsx}": ["eslint --fix", "prettier --write"],
    "*.{json,css,md}": ["prettier --write"]
  }
}
```

---

## ✅ RÉSUMÉ

Cette architecture vous permet de :

1. ✅ **Scaler** facilement (ajout de features prévisible)
2. ✅ **Maintenir** efficacement (structure claire, tests)
3. ✅ **Collaborer** sereinement (conventions partagées)
4. ✅ **Déployer** en confiance (tests, CI/CD, monitoring)
5. ✅ **Onboarder** rapidement (documentation, exemples)

**Prochaine étape**: Commencer la Phase 1 de la migration ! 🚀
