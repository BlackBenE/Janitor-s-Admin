# 📋 SUIVI MIGRATION CORE - Phase Infrastructure

**Date de début** : 24 octobre 2025  
**Durée estimée** : 30-45 min  
**Statut** : 🟡 EN COURS

---

## 🎯 OBJECTIF

Migrer l'infrastructure (providers, config, services) vers `src/core/` pour établir des fondations solides.

---

## 📦 ÉTAPE CORE : MIGRATION INFRASTRUCTURE (45 MIN)

**Status** : 🟡 EN COURS

### Vue d'ensemble

```
src/
├── providers/           → src/core/providers/
├── lib/                 → src/core/config/
├── services/            → src/core/services/
├── constants/           → src/core/config/
└── types/ (partiel)     → src/core/types/
```

---

### Sous-étape 1 : Providers (15 min)

**Status** : ⏸️ EN ATTENTE

#### 1.1 Migrer authProvider.tsx
- [ ] Copier `src/providers/authProvider.tsx` → `src/core/providers/auth.provider.tsx`
- [ ] Vérifier les imports dans le nouveau fichier
- [ ] Tester la compilation

#### 1.2 Migrer dataProvider.ts
- [ ] Copier `src/providers/dataProvider.ts` → `src/core/api/data.provider.ts`
- [ ] Vérifier les imports dans le nouveau fichier
- [ ] Tester la compilation

#### 1.3 Créer index.ts
- [ ] Créer `src/core/providers/index.ts` avec exports
- [ ] Créer `src/core/api/index.ts` avec exports

---

### Sous-étape 2 : Configuration (10 min)

**Status** : ⏸️ EN ATTENTE

#### 2.1 Migrer supabaseClient
- [ ] Copier `src/lib/supabaseClient.ts` → `src/core/config/supabase.ts`
- [ ] Mettre à jour les imports
- [ ] Tester la compilation

#### 2.2 Migrer constants
- [ ] Copier `src/constants/index.ts` → `src/core/config/constants.ts`
- [ ] Copier `src/constants/labels.ts` → `src/core/config/labels.ts`
- [ ] Créer `src/core/config/index.ts` avec exports
- [ ] Tester la compilation

---

### Sous-étape 3 : Services (10 min)

**Status** : ⏸️ EN ATTENTE

#### 3.1 Migrer les services
- [ ] Copier `src/services/profileService.ts` → `src/core/services/profile.service.ts`
- [ ] Copier `src/services/avatarService.ts` → `src/core/services/avatar.service.ts`
- [ ] Copier `src/services/anonymizationService.ts` → `src/core/services/anonymization.service.ts`
- [ ] Copier `src/services/gdprTestService.ts` → `src/core/services/gdpr.service.ts`
- [ ] Copier `src/services/searchService.ts` → `src/core/services/search.service.ts`

#### 3.2 Créer index.ts
- [ ] Créer `src/core/services/index.ts` avec exports
- [ ] Tester la compilation

---

### Sous-étape 4 : Types infrastructure (5 min)

**Status** : ⏸️ EN ATTENTE

#### 4.1 Migrer les types core
- [ ] Copier `src/types/database.types.ts` → `src/core/types/database.types.ts`
- [ ] Copier `src/types/supabase.ts` → `src/core/types/supabase.types.ts`
- [ ] Créer `src/core/types/index.ts` avec exports
- [ ] Tester la compilation

---

### Sous-étape 5 : Mise à jour des imports (10 min)

**Status** : ⏸️ EN ATTENTE

#### 5.1 Identifier les fichiers utilisant les anciens chemins
- [ ] Rechercher les imports de `providers/`
- [ ] Rechercher les imports de `lib/supabaseClient`
- [ ] Rechercher les imports de `services/`
- [ ] Rechercher les imports de `constants/`

#### 5.2 Mettre à jour les imports critiques
- [ ] Mettre à jour `src/main.tsx`
- [ ] Mettre à jour `src/App.tsx`
- [ ] Mettre à jour les fichiers qui utilisent le plus ces imports

**Note** : On ne va pas tout mettre à jour d'un coup ! On va :
1. Garder les anciens fichiers
2. Créer des fichiers de transition (re-export)
3. Migrer progressivement les imports

---

### Sous-étape 6 : Tests et validation (5 min)

**Status** : ⏸️ EN ATTENTE

#### 6.1 Vérifications
- [ ] Commande : `npm run build`
- [ ] Vérification : Build réussit sans erreur
- [ ] Commande : `npm run dev`
- [ ] Vérification : Application démarre correctement

#### 6.2 Tests manuels
- [ ] Tester la connexion (authProvider)
- [ ] Tester une requête de données
- [ ] Vérifier qu'aucune erreur console

---

### Sous-étape 7 : Commit (2 min)

**Status** : ⏸️ EN ATTENTE

#### 7.1 Git
- [ ] Commande : `git status`
- [ ] Commande : `git add src/core/`
- [ ] Commande : `git commit -m "feat(core): migrate infrastructure to core layer"`
- [ ] Vérification : Commit créé avec succès

---

## ✅ CHECKPOINT CORE

**Avant de passer à SHARED, vérifie** :
- [ ] ✅ Dossier `src/core/providers/` contient authProvider
- [ ] ✅ Dossier `src/core/config/` contient supabase + constants
- [ ] ✅ Dossier `src/core/services/` contient tous les services
- [ ] ✅ Dossier `src/core/api/` contient dataProvider
- [ ] ✅ Dossier `src/core/types/` contient database + supabase types
- [ ] ✅ `npm run dev` démarre sans erreur
- [ ] ✅ Application fonctionne normalement
- [ ] ✅ Commit effectué

**Temps écoulé** : _____ minutes

---

## 📝 NOTES

### Stratégie de migration

On utilise une **approche progressive** :

1. ✅ **Copier** les fichiers vers `src/core/`
2. ✅ **Créer des fichiers de transition** dans les anciens emplacements
3. ⏳ **Migrer progressivement** les imports (pas tout d'un coup)
4. ⏳ **Supprimer les anciens** fichiers plus tard

**Exemple de fichier de transition** :

```typescript
// src/providers/authProvider.tsx (fichier de transition)
// @deprecated - Use @/core/providers/auth.provider instead
export * from '@/core/providers/auth.provider';
```

Cela permet de :
- ✅ Ne pas casser l'application
- ✅ Migrer progressivement
- ✅ Garder l'historique Git
- ✅ Faciliter les code reviews

---

**Dernière mise à jour** : 24 octobre 2025
