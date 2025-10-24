# 🚀 QUICK START - Démarrer la Migration en 30 Minutes

**Pour**: Développeur qui veut démarrer la Phase 1 maintenant  
**Durée**: 30 minutes pour setup initial  
**Prérequis**: Node.js, Git, VS Code

---

## ⚡ PHASE 1 : PREMIERS PAS (30 MIN)

### Étape 1 : Path Aliases (10 min)

```bash
# 1. Backup du tsconfig actuel
cp tsconfig.json tsconfig.json.backup

# 2. Mettre à jour tsconfig.json
```

Ouvrir `tsconfig.json` et **ajouter** dans `compilerOptions` :

```json
{
  "compilerOptions": {
    // ... config existante ...
    "baseUrl": ".",
    "paths": {
      "@/*": ["src/*"],
      "@/app/*": ["src/app/*"],
      "@/features/*": ["src/features/*"],
      "@/shared/*": ["src/shared/*"],
      "@/core/*": ["src/core/*"]
    }
  }
}
```

```bash
# 3. Mettre à jour vite.config.ts
```

Ouvrir `vite.config.ts` et **modifier** la section `resolve.alias` :

```typescript
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
    },
  },
  // ... reste de la config ...
});
```

```bash
# 4. Tester que ça fonctionne
npm run dev
# Si le serveur démarre → ✅ OK!
```

**Commit** :

```bash
git add tsconfig.json vite.config.ts
git commit -m "chore: configure path aliases"
```

### Étape 2 : Setup Tests (10 min)

```bash
# 1. Installer les dépendances
npm install -D vitest @vitest/ui @vitest/coverage-v8 jsdom
```

```bash
# 2. Créer vitest.config.ts
cat > vitest.config.ts << 'EOF'
import { defineConfig } from 'vitest/config';
import react from '@vitejs/plugin-react';
import path from 'path';

export default defineConfig({
  plugins: [react()],
  test: {
    globals: true,
    environment: 'jsdom',
    setupFiles: ['./src/test/setup.ts'],
  },
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src'),
    },
  },
});
EOF
```

```bash
# 3. Créer le setup des tests
mkdir -p src/test
cat > src/test/setup.ts << 'EOF'
import '@testing-library/jest-dom';
import { expect, afterEach } from 'vitest';
import { cleanup } from '@testing-library/react';

afterEach(() => {
  cleanup();
});
EOF
```

```bash
# 4. Ajouter les scripts dans package.json
```

Ouvrir `package.json` et **ajouter** dans `scripts` :

```json
{
  "scripts": {
    "test": "vitest",
    "test:ui": "vitest --ui",
    "test:coverage": "vitest --coverage"
  }
}
```

```bash
# 5. Tester
npm run test
# Devrait démarrer même sans tests → ✅ OK!
```

**Commit** :

```bash
git add vitest.config.ts src/test package.json package-lock.json
git commit -m "chore: setup vitest testing infrastructure"
```

### Étape 3 : Créer Structure Cible (5 min)

```bash
# Créer les dossiers principaux
mkdir -p src/features
mkdir -p src/shared/{components,hooks,utils,types,constants}
mkdir -p src/core/{api,config,services,types}
mkdir -p src/app/providers

# Créer les fichiers index.ts
touch src/shared/components/index.ts
touch src/shared/hooks/index.ts
touch src/shared/utils/index.ts
touch src/shared/types/index.ts
touch src/core/api/index.ts
touch src/core/config/index.ts

# Vérifier la structure
tree -L 3 src/ -I 'node_modules|components|hooks'
```

**Commit** :

```bash
git add src/
git commit -m "chore: create target folder structure"
```

### Étape 4 : Prettier Setup (5 min)

```bash
# 1. Installer Prettier
npm install -D prettier
```

```bash
# 2. Créer .prettierrc
cat > .prettierrc << 'EOF'
{
  "semi": true,
  "trailingComma": "es5",
  "singleQuote": true,
  "printWidth": 100,
  "tabWidth": 2,
  "useTabs": false,
  "arrowParens": "always"
}
EOF
```

```bash
# 3. Créer .prettierignore
cat > .prettierignore << 'EOF'
node_modules
dist
build
coverage
*.min.js
package-lock.json
EOF
```

```bash
# 4. Ajouter scripts dans package.json
```

Ajouter dans `package.json` :

```json
{
  "scripts": {
    "format": "prettier --write \"src/**/*.{ts,tsx,json,css,md}\"",
    "format:check": "prettier --check \"src/**/*.{ts,tsx,json,css,md}\""
  }
}
```

```bash
# 5. Formater tout le code
npm run format
```

**Commit** :

```bash
git add .prettierrc .prettierignore package.json
git commit -m "chore: setup prettier code formatting"
```

---

## ✅ VÉRIFICATION PHASE 1

Après ces 30 minutes, vous devriez avoir :

```bash
# 1. Path aliases fonctionnent
grep "baseUrl" tsconfig.json
# → Devrait afficher la config

# 2. Tests configurés
npm run test
# → Devrait démarrer

# 3. Structure créée
ls -la src/
# → Devrait voir shared/, core/, features/

# 4. Prettier installé
npm run format:check
# → Devrait vérifier sans erreur
```

**Statut** : ✅ Phase 1 - Infrastructure READY!

**Commit final** :

```bash
git add .
git commit -m "chore(phase1): complete infrastructure setup"
git push
```

---

## 🎯 PROCHAINES ÉTAPES (Semaine 1)

### Jour 1 (après quick start)

**Matin** :

- [ ] Présenter les changements à l'équipe (30 min)
- [ ] Créer branche `refactor/architecture-migration`
- [ ] Configurer VS Code (extensions recommandées)

**Après-midi** :

- [ ] Premier test simple (voir ci-dessous)
- [ ] Documentation interne équipe

### Premier Test Simple (30 min)

Créer un premier test pour valider le setup :

```bash
# 1. Créer un helper simple
cat > src/shared/utils/formatDate.ts << 'EOF'
export const formatDate = (date: Date): string => {
  return date.toLocaleDateString('fr-FR');
};
EOF
```

```bash
# 2. Créer le test
cat > src/shared/utils/formatDate.test.ts << 'EOF'
import { describe, it, expect } from 'vitest';
import { formatDate } from './formatDate';

describe('formatDate', () => {
  it('formats date correctly', () => {
    const date = new Date('2025-10-24');
    const result = formatDate(date);
    expect(result).toMatch(/24\/10\/2025/);
  });
});
EOF
```

```bash
# 3. Créer l'export
cat > src/shared/utils/index.ts << 'EOF'
export * from './formatDate';
EOF
```

```bash
# 4. Lancer le test
npm run test formatDate
# → Devrait passer ✅
```

```bash
# 5. Utiliser le helper avec path alias
# Dans n'importe quel composant :
```

```typescript
import { formatDate } from '@/shared/utils';

const date = formatDate(new Date());
```

**Commit** :

```bash
git add src/shared/utils/
git commit -m "feat(shared): add formatDate utility with tests"
```

### Jour 2-3 : Premier composant partagé

Migrer un composant simple comme exemple :

```bash
# 1. Choisir Table.tsx ou Modal.tsx
# 2. Suivre le processus du plan de migration (Phase 2)
# 3. Créer les tests
# 4. Mettre à jour un usage
# 5. Commit
```

### Jour 4-5 : Core API

```bash
# 1. Créer src/core/config/env.ts
# 2. Créer src/core/api/supabase.ts
# 3. Mettre à jour les imports
# 4. Tester
# 5. Commit
```

---

## 📝 AIDE-MÉMOIRE COMMANDES

### Développement

```bash
# Démarrer le serveur
npm run dev

# Build
npm run build

# Tests
npm run test              # Run all tests
npm run test:ui           # UI interactive
npm run test:coverage     # Coverage report

# Format
npm run format            # Format all files
npm run format:check      # Check formatting

# Lint
npm run lint              # Lint and fix
```

### Git Workflow

```bash
# Créer une branche
git checkout -b refactor/shared-components

# Status
git status

# Add & Commit
git add .
git commit -m "type(scope): message"

# Types de commit :
# feat: nouvelle feature
# fix: bug fix
# refactor: refactoring
# test: ajout de tests
# chore: tâches diverses
# docs: documentation

# Push
git push origin refactor/shared-components
```

### Debugging

```bash
# Si path aliases ne marchent pas
rm -rf node_modules/.vite
npm run dev

# Si tests échouent
rm -rf coverage
npm run test -- --watch

# Si build échoue
npm run build -- --logLevel info
```

---

## 🆘 PROBLÈMES COURANTS (QUICK FIX)

### Erreur : Cannot find module '@/...'

**Solution** :

```bash
# 1. Vérifier tsconfig.json
cat tsconfig.json | grep "@/"

# 2. Redémarrer TS Server dans VS Code
# Cmd+Shift+P → "TypeScript: Restart TS Server"

# 3. Redémarrer le serveur
npm run dev
```

### Erreur : Tests ne trouvent pas les modules

**Solution** :

```bash
# Vérifier vitest.config.ts
cat vitest.config.ts | grep "alias"

# S'assurer que l'alias @ est défini
```

### Erreur : Prettier ne formate pas

**Solution** :

```bash
# 1. Vérifier installation
npm list prettier

# 2. Formater manuellement
npx prettier --write "src/**/*.{ts,tsx}"

# 3. Configurer VS Code
# Settings → Default Formatter → Prettier
```

---

## 📚 RESSOURCES RAPIDES

### Documentation essentielle

- **Plan complet** : `PLAN_MIGRATION_PROGRESSIF.md`
- **Architecture cible** : `ARCHITECTURE_CIBLE_2025.md`
- **Audit détaillé** : `AUDIT_ARCHITECTURE_2025.md`

### Patterns à copier

```typescript
// Import avec path alias
import { Component } from '@/shared/components';
import { useHook } from '@/shared/hooks';
import { supabase } from '@/core/api/supabase';
import { UserList } from '@/features/users';

// Structure composant
export const MyComponent = () => {
  // Hooks
  const { data, isLoading } = useQuery(...);

  // Early returns
  if (isLoading) return <Loading />;

  // Render
  return <div>...</div>;
};

// Test
describe('MyComponent', () => {
  it('renders correctly', () => {
    render(<MyComponent />);
    expect(...).toBeInTheDocument();
  });
});
```

### Checklist avant commit

```bash
# 1. Tout compile
npm run build

# 2. Tests passent
npm run test

# 3. Code formaté
npm run format

# 4. Lint OK
npm run lint

# 5. Commit avec bon message
git commit -m "feat(users): add user list component"
```

---

## 🎯 OBJECTIF FIN SEMAINE 1

À la fin de la semaine 1, vous devriez avoir :

- [x] ✅ Infrastructure configurée (path aliases, tests, prettier)
- [x] ✅ Structure cible créée
- [x] ✅ Premier test qui passe
- [x] ✅ Premier composant migré (exemple)
- [x] ✅ Équipe familiarisée avec les outils
- [x] ✅ Documentation de base

**Résultat attendu** : Base solide pour continuer Phase 2 🚀

---

## 💡 CONSEILS

### Pour réussir la migration

1. **Petit à petit** : Ne migrez pas tout d'un coup
2. **Testez souvent** : npm run test après chaque changement
3. **Commitez fréquemment** : Commits atomiques
4. **Documentez** : Ajoutez des commentaires si besoin
5. **Demandez de l'aide** : N'hésitez pas à reviewer

### Pour l'équipe

1. **Communication** : Tenez l'équipe informée
2. **Code review** : Reviewez les PRs rapidement
3. **Pair programming** : Coder ensemble sur parties complexes
4. **Célébrez** : Fêtez les jalons (fin de chaque phase)

---

## ✅ C'EST PARTI !

Vous avez maintenant tout pour démarrer.

**Prochaine action** : Exécuter les commandes de l'Étape 1 (10 min)

**Bon courage ! 🚀**

---

**Questions ?** Consultez :

- `PLAN_MIGRATION_PROGRESSIF.md` pour le détail
- `ARCHITECTURE_CIBLE_2025.md` pour les exemples
- `OUTILS_RECOMMANDATIONS.md` pour le tooling
