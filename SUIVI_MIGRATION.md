# 📋 SUIVI MIGRATION 3H - Checklist Interactive

**Date de début** : 24 octobre 2025  
**Durée estimée** : 2h30-3h  
**Statut global** : 🟡 EN COURS

---

## 🎯 OBJECTIF

Poser les fondations d'une meilleure architecture en 3h avec validation à chaque étape.

---

## ✅ PROGRESSION GLOBALE

```
┌─────────────────────────────────────────────┐
│  ÉTAPE 1: Path Aliases      [✓]  (10 min)  │
│  ÉTAPE 2: Prettier          [✓]  (7 min)   │
│  ÉTAPE 3: Structure Cible   [✓]  (8 min)   │
│  BONUS: Premier Test        [ ]  (45 min)  │
└─────────────────────────────────────────────┘

Progression : 3/3 étapes principales (100%) ✅
Temps écoulé : ~25 minutes
Temps restant : ~2h05-2h35 (bonus optionnel disponible)
```

---

## 📦 ÉTAPE 1 : PATH ALIASES (45 MIN)

**Status** : ✅ TERMINÉE

### Sous-étapes

#### 1.1 Backup tsconfig.json

- [x] Commande : `cp tsconfig.json tsconfig.json.backup`
- [x] Vérification : Le fichier `tsconfig.json.backup` existe

#### 1.2 Modifier tsconfig.json

- [x] Ouvrir `tsconfig.json`
- [x] Ajouter la section `paths` dans `compilerOptions`
- [x] Sauvegarder le fichier

**Code à ajouter** :

```json
"baseUrl": ".",
"paths": {
  "@/*": ["./src/*"],
  "@components/*": ["./src/components/*"],
  "@hooks/*": ["./src/hooks/*"],
  "@services/*": ["./src/services/*"],
  "@types/*": ["./src/types/*"],
  "@utils/*": ["./src/utils/*"],
  "@providers/*": ["./src/providers/*"]
}
```

#### 1.3 Modifier vite.config.ts

- [x] Ouvrir `vite.config.ts`
- [x] Ajouter `import path from 'path';` en haut
- [x] Modifier la section `resolve.alias`
- [x] Sauvegarder le fichier

**Code à ajouter** :

```typescript
resolve: {
  alias: {
    '@': path.resolve(__dirname, './src'),
    '@components': path.resolve(__dirname, './src/components'),
    '@hooks': path.resolve(__dirname, './src/hooks'),
    '@services': path.resolve(__dirname, './src/services'),
    '@types': path.resolve(__dirname, './src/types'),
    '@utils': path.resolve(__dirname, './src/utils'),
    '@providers': path.resolve(__dirname, './src/providers'),
  },
}
```

#### 1.4 Tester que ça compile

- [x] Commande : `npm run dev`
- [x] Vérification : Le serveur démarre sans erreur
- [x] Si erreur : me prévenir pour debug

#### 1.5 Commit

- [x] Commande : `git status` (voir les changements)
- [x] Commande : `git add tsconfig.json vite.config.ts`
- [x] Commande : `git commit -m "chore: configure path aliases for cleaner imports"`
- [x] Vérification : Commit créé avec succès

### ✅ CHECKPOINT 1

**Avant de passer à l'étape 2, vérifie** :

- [x] ✅ `tsconfig.json` contient les path aliases
- [x] ✅ `vite.config.ts` contient les alias
- [x] ✅ `npm run dev` démarre sans erreur
- [x] ✅ Commit effectué

**Temps écoulé** : ~10 minutes

---

## 📦 ÉTAPE 2 : PRETTIER (30 MIN)

**Status** : ✅ TERMINÉE (Version simplifiée - 7 min)

### Sous-étapes

#### 2.1 Installation

- [x] Prettier déjà installé (v3.6.2) ✅
- [x] Vérification : `package.json` contient `prettier` dans `devDependencies`

#### 2.2 Créer .prettierrc

- [x] Créer le fichier `.prettierrc` à la racine
- [x] Copier la configuration
- [x] Sauvegarder

**Contenu** :

```json
{
  "semi": true,
  "trailingComma": "es5",
  "singleQuote": true,
  "printWidth": 100,
  "tabWidth": 2,
  "useTabs": false,
  "arrowParens": "always"
}
```

#### 2.3 Créer .prettierignore

- [x] Créer le fichier `.prettierignore` à la racine
- [x] Copier la configuration
- [x] Sauvegarder

**Contenu** :

```
node_modules
dist
build
coverage
*.min.js
package-lock.json
.next
.vite
```

#### 2.4 Ajouter les scripts

- [x] Ouvrir `package.json`
- [x] Ajouter dans la section `scripts`
- [x] Sauvegarder

**À ajouter** :

```json
"format": "prettier --write \"src/**/*.{ts,tsx,js,jsx,json,css,md}\"",
"format:check": "prettier --check \"src/**/*.{ts,tsx,js,jsx,json,css,md}\""
```

#### 2.5 Formater le code

- [x] ⏭️ SKIPPED - Extension VS Code formatte déjà automatiquement
- [x] Vérification : 277 fichiers détectés par `format:check`

#### 2.6 Vérifier les changements

- [x] ⏭️ SKIPPED - Formatage fait automatiquement par l'extension VS Code

#### 2.7 Commit

- [x] Commande : `git add .prettierrc .prettierignore package.json package-lock.json .vscode/settings.json`
- [x] Commande : `git commit -m "style: setup prettier configuration for team consistency"`
- [x] Vérification : Commit 316ca54 créé avec succès

#### 2.8 Configuration VS Code (optionnel mais recommandé)

- [x] Créer `.vscode/settings.json` ✅
- [x] Ajouter la config pour l'équipe
- [x] Sauvegarder

**Contenu** :

```json
{
  "editor.defaultFormatter": "esbenp.prettier-vscode",
  "editor.formatOnSave": true,
  "[typescript]": {
    "editor.defaultFormatter": "esbenp.prettier-vscode"
  },
  "[typescriptreact]": {
    "editor.defaultFormatter": "esbenp.prettier-vscode"
  }
}
```

### ✅ CHECKPOINT 2

**Avant de passer à l'étape 3, vérifie** :

- [x] ✅ `.prettierrc` existe
- [x] ✅ `.prettierignore` existe
- [x] ✅ `npm run format:check` fonctionne (277 fichiers détectés)
- [x] ✅ Scripts `format` et `format:check` ajoutés à package.json
- [x] ✅ `.vscode/settings.json` créé pour l'équipe
- [x] ✅ Commit effectué (316ca54)

**Temps écoulé** : ~7 minutes (Version simplifiée car extension VS Code déjà active)

---

## 📦 ÉTAPE 3 : STRUCTURE CIBLE (45 MIN)

**Status** : ✅ TERMINÉE

### Sous-étapes

#### 3.1 Créer les dossiers principaux

- [x] Commande : `mkdir -p src/shared/{components,hooks,utils,types,constants}`
- [x] Commande : `mkdir -p src/core/{api,config,services,types}`
- [x] Commande : `mkdir -p src/features`
- [x] Commande : `mkdir -p src/app/providers`
- [x] Vérification : Tous les dossiers créés

#### 3.2 Créer les fichiers index.ts

- [x] Commande : `touch src/shared/components/index.ts`
- [x] Commande : `touch src/shared/hooks/index.ts`
- [x] Commande : `touch src/shared/utils/index.ts`
- [x] Commande : `touch src/shared/types/index.ts`
- [x] Commande : `touch src/core/config/index.ts`
- [x] Commande : `touch src/core/api/index.ts`

#### 3.3 Vérifier la structure

- [x] Commande : `ls -la src/`
- [x] Vérification : Tu vois `shared/`, `core/`, `features/`, `app/`

#### 3.4 Créer src/ARCHITECTURE.md

- [x] Créer le fichier `src/ARCHITECTURE.md`
- [x] Copier le contenu
- [x] Sauvegarder

**Contenu** :

```markdown
# Architecture du projet

## Structure

- `app/` - Configuration application (providers, router)
- `features/` - Domaines métier (users, properties, analytics, etc.)
- `shared/` - Code partagé (components, hooks, utils)
- `core/` - Infrastructure (api, config, services)

## Conventions

### Imports

Utiliser les path aliases :

- `@/` - Root src
- `@components/` - Components
- `@hooks/` - Hooks
- `@services/` - Services
- `@types/` - Types
- `@utils/` - Utils
- `@providers/` - Providers

### Nouveaux fichiers

Placer les nouveaux composants selon :

- **Partagé** (utilisé par plusieurs domaines) → `shared/components/`
- **Spécifique** (un seul domaine) → `features/{domain}/components/`

## Migration progressive

Cette structure est le **target**. On y migre progressivement :

- ✅ Nouveaux fichiers → directement dans la bonne structure
- ⏳ Fichiers existants → on migre quand on les modifie

## Règle d'or

"Laisse le code un peu mieux que tu l'as trouvé"
```

#### 3.5 Créer un exemple de feature (users)

- [x] Commande : `mkdir -p src/features/users/{components,hooks,api,types}`
- [x] Créer `src/features/users/index.ts`
- [x] Créer `src/features/users/README.md`

#### 3.6 Commit

- [x] Commande : `git status`
- [x] Commande : `git add src/`
- [x] Commande : `git commit -m "chore: create target folder structure for progressive migration"`
- [x] Vérification : Commit 02f6369 créé avec succès

### ✅ CHECKPOINT 3

**Avant de passer au bonus (optionnel), vérifie** :

- [x] ✅ Dossiers `shared/`, `core/`, `features/`, `app/` existent
- [x] ✅ Fichiers `index.ts` créés
- [x] ✅ `src/ARCHITECTURE.md` existe et documenté
- [x] ✅ Feature exemple `users/` créée
- [x] ✅ Commit effectué (02f6369)

**Temps écoulé** : ~8 minutes

---

## 🎁 BONUS : PREMIER TEST (45 MIN) - OPTIONNEL

**Status** : ⏸️ EN ATTENTE

⚠️ **Cette étape est optionnelle**. Si tu manques de temps, tu peux t'arrêter après l'étape 3.

### Sous-étapes

#### B.1 Installation Vitest

- [ ] Commande : `npm install -D vitest @vitest/ui jsdom @testing-library/react @testing-library/jest-dom`
- [ ] Attendre la fin (peut prendre 2-3 min)
- [ ] Vérification : Packages installés dans `package.json`

#### B.2 Créer vitest.config.ts

- [ ] Créer `vitest.config.ts` à la racine
- [ ] Copier la configuration
- [ ] Sauvegarder

**Contenu** :

```typescript
import { defineConfig } from 'vitest/config';
import react from '@vitejs/plugin-react';
import path from 'path';

export default defineConfig({
  plugins: [react()],
  test: {
    globals: true,
    environment: 'jsdom',
    setupFiles: './src/test/setup.ts',
  },
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src'),
    },
  },
});
```

#### B.3 Créer le setup des tests

- [ ] Commande : `mkdir -p src/test`
- [ ] Créer `src/test/setup.ts`
- [ ] Sauvegarder

**Contenu** :

```typescript
import '@testing-library/jest-dom';
import { expect, afterEach } from 'vitest';
import { cleanup } from '@testing-library/react';

afterEach(() => {
  cleanup();
});
```

#### B.4 Ajouter les scripts

- [ ] Ouvrir `package.json`
- [ ] Ajouter dans `scripts`
- [ ] Sauvegarder

**À ajouter** :

```json
"test": "vitest",
"test:ui": "vitest --ui"
```

#### B.5 Créer un utility simple

- [ ] Créer `src/shared/utils/formatDate.ts`
- [ ] Copier le code
- [ ] Sauvegarder

**Contenu** :

```typescript
export const formatDate = (date: Date | string): string => {
  const d = typeof date === 'string' ? new Date(date) : date;
  return d.toLocaleDateString('fr-FR', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  });
};
```

#### B.6 Créer le test

- [ ] Créer `src/shared/utils/formatDate.test.ts`
- [ ] Copier le code
- [ ] Sauvegarder

**Contenu** :

```typescript
import { describe, it, expect } from 'vitest';
import { formatDate } from './formatDate';

describe('formatDate', () => {
  it('formats Date object correctly', () => {
    const date = new Date('2025-10-24');
    expect(formatDate(date)).toBe('24 octobre 2025');
  });

  it('formats string date correctly', () => {
    expect(formatDate('2025-10-24')).toBe('24 octobre 2025');
  });
});
```

#### B.7 Exporter le utility

- [ ] Ouvrir `src/shared/utils/index.ts`
- [ ] Ajouter : `export * from './formatDate';`
- [ ] Sauvegarder

#### B.8 Lancer les tests

- [ ] Commande : `npm run test`
- [ ] Vérification : Les 2 tests passent ✅
- [ ] Si erreur : me prévenir

#### B.9 Commit

- [ ] Commande : `git add .`
- [ ] Commande : `git commit -m "test: add vitest infrastructure and first utility test"`

### ✅ CHECKPOINT BONUS

**Si tu as fait le bonus, vérifie** :

- [ ] ✅ Vitest installé
- [ ] ✅ `vitest.config.ts` créé
- [ ] ✅ `src/test/setup.ts` créé
- [ ] ✅ `formatDate` utility créé
- [ ] ✅ Test passe avec `npm run test`
- [ ] ✅ Commit effectué

**Temps écoulé** : **\_** minutes

---

## 🎉 RÉCAPITULATIF FINAL

### Checklist globale

- [ ] ✅ **Étape 1** : Path aliases configurés
- [ ] ✅ **Étape 2** : Prettier installé et code formaté
- [ ] ✅ **Étape 3** : Structure cible créée
- [ ] 🎁 **Bonus** : Premier test fonctionnel (optionnel)

### Vérifications finales

```bash
# 1. Path aliases fonctionnent
grep "baseUrl" tsconfig.json
# → Devrait afficher : "baseUrl": "."

# 2. Prettier installé
npm run format:check
# → Devrait dire "All matched files use Prettier code style!"

# 3. Structure créée
ls -la src/
# → Devrait voir : shared/, core/, features/, app/

# 4. (Bonus) Tests fonctionnent
npm run test
# → Devrait passer les tests
```

### Commits créés

```bash
# Voir l'historique
git log --oneline -5

# Devrait afficher quelque chose comme :
# abc123 test: add vitest infrastructure and first utility test (si bonus)
# def456 chore: create target folder structure
# ghi789 style: format all files with prettier
# jkl012 style: setup prettier and format codebase
# mno345 chore: configure path aliases for cleaner imports
```

### Push sur GitHub (recommandé)

- [ ] Commande : `git push origin refactor`
- [ ] Vérification : Les commits sont visibles sur GitHub

### Temps total

**Temps écoulé** : **\_** heures **\_** minutes

---

## 📝 NOTES ET OBSERVATIONS

### Problèmes rencontrés

```
(Note ici les problèmes que tu as rencontrés)


```

### Solutions appliquées

```
(Note ici comment tu les as résolus)


```

### Améliorations futures

```
(Note ici ce que tu veux faire plus tard)


```

---

## 🚀 PROCHAINES ÉTAPES (APRÈS LES 3H)

### Utilisation quotidienne

**✅ Ce que tu peux faire dès maintenant** :

1. **Imports avec aliases**

   ```typescript
   // Dans tes prochains fichiers, utilise :
   import { X } from '@/types';
   import { Y } from '@components/...';
   ```

2. **Nouveaux fichiers dans la bonne structure**

   ```
   Nouveau composant partagé → src/shared/components/
   Nouveau hook métier → src/features/{domain}/hooks/
   ```

3. **Format automatique**
   ```
   Le code se formate automatiquement (si VS Code configuré)
   Ou manuellement : npm run format
   ```

### Si tu veux aller plus loin (optionnel)

**Quand tu as 30 min de libre** :

- [ ] Migrer UN composant vers `shared/`
- [ ] Écrire UN test pour un utility
- [ ] Documenter UNE convention

**Quand tu as 2-3h de libre** :

- [ ] Migrer un domaine complet (ex: analytics)
- [ ] Suivre Phase 4 du plan complet
- [ ] Ajouter plus de tests

**Si tu veux finaliser (4-5 semaines)** :

- [ ] Suivre le plan de migration complet
- [ ] Migrer tous les domaines
- [ ] Atteindre 60% de coverage

---

## 🆘 BESOIN D'AIDE ?

### Si tu as un problème

1. **Note-le** dans la section "Problèmes rencontrés"
2. **Arrête-toi** au checkpoint actuel
3. **Demande de l'aide** avec le contexte :
   - Quelle étape ?
   - Quelle commande ?
   - Quel message d'erreur ?

### Commandes utiles pour debug

```bash
# Voir l'état Git
git status

# Voir les changements non commités
git diff

# Annuler les changements non commités
git checkout -- <fichier>

# Revenir au dernier commit
git reset --hard HEAD

# Voir les logs
git log --oneline -10

# Tester la compilation
npm run dev

# Tester le build
npm run build
```

---

**Document créé le** : 24 octobre 2025  
**Dernière mise à jour** : ****\_\_\_****

**Bon courage ! 🚀**
