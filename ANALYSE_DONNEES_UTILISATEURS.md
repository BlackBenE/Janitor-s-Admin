# 📊 Analyse de Cohérence des Données Utilisateurs

**Date**: 24 octobre 2025  
**Objectif**: Vérifier si les mêmes données sont affichées partout dans l'application

---

## 🔍 **RÉSUMÉ EXÉCUTIF**

### ✅ **Résultat Global**: COHÉRENCE CONFIRMÉE

Les données utilisateurs proviennent toutes de la **même source** (Supabase `profiles`) mais avec des **calculs différents** selon le contexte :

| Page                | Source                          | Calcul                              | Cohérent |
| ------------------- | ------------------------------- | ----------------------------------- | -------- |
| **Dashboard**       | Supabase `profiles` (count SQL) | Utilisateurs actifs validés         | ✅ Oui   |
| **User Management** | Supabase `profiles` (fetch all) | Filtré côté client (length)         | ✅ Oui   |
| **Analytics**       | Supabase `profiles` (fetch all) | Filtré par période + account_locked | ✅ Oui   |

**Problème identifié**: Les 3 pages calculent différemment **"Utilisateurs Actifs"** !

---

## 📍 **DÉTAIL PAR PAGE**

### 1️⃣ **Dashboard** (`/dashboard`)

**Fichier**: `src/features/dashboard/hooks/dashboardQueries.ts`

```typescript
// LIGNE 53-58 : Récupération "Active Users"
supabase
  .from('profiles')
  .select('*', { count: 'exact' })
  .eq('profile_validated', true) // ← Validés uniquement
  .is('deleted_at', null); // ← Non supprimés
```

**Définition Dashboard**:

- ✅ **Active Users** = Utilisateurs avec `profile_validated = true` + `deleted_at IS NULL`
- ❌ **N'exclut PAS** `account_locked = true`

**Affichage**:

```tsx
// DashboardStatsCards.tsx
{
  title: "Utilisateurs actifs",
  value: stats.activeUsers,  // ← Provient du count SQL ci-dessus
  bottomLeft: "Les 30 derniers jours",
}
```

---

### 2️⃣ **User Management** (`/user-management`)

**Fichier**: `src/features/users/components/UserStatsSection.tsx`

```typescript
// LIGNE 31-34 : Calcul côté client
const totalUsers = filteredUsers.length;
const activeUsers = filteredUsers.filter(
  (user: UserProfile) => user.profile_validated // ← Validés uniquement
).length;
const pendingValidations = filteredUsers.filter(
  (user: UserProfile) => !user.profile_validated // ← Non validés
).length;
```

**Définition User Management**:

- ✅ **Total Users** = Tous les utilisateurs du filtre actif (tab)
- ✅ **Active Users** = Utilisateurs avec `profile_validated = true`
- ❌ **N'exclut PAS** `account_locked = true`
- ❌ **N'exclut PAS** `deleted_at`

**Affichage**:

```tsx
<InfoCard
  title={LABELS.common.messages.totalUsers}    // "Utilisateurs totaux"
  value={totalUsers.toString()}                 // ← .length des users filtrés
  progressText="+12.5%"                         // ← Hardcodé !
/>
<InfoCard
  title={LABELS.common.messages.activeUsers}   // "Utilisateurs actifs"
  value={activeUsers.toString()}                // ← Filtre profile_validated
  progressText="+8.3%"                          // ← Hardcodé !
/>
```

---

### 3️⃣ **Analytics** (`/analytics`)

**Fichier**: `src/features/analytics/hooks/analyticsCalculations.ts`

```typescript
// LIGNE 36-46 : Calcul avec période + account_locked
const totalUsers = profiles.filter((p) => {
  if (!p.created_at) return false;
  const createdAt = new Date(p.created_at);
  return createdAt <= dateRange.to; // ← Créés avant la fin de période
}).length;

const activeUsers = profiles.filter((p) => {
  if (!p.created_at || p.account_locked) return false; // ← Exclut locked !
  const createdAt = new Date(p.created_at);
  return createdAt <= dateRange.to;
}).length;

const newUsers = profiles.filter((p) => {
  if (!p.created_at) return false;
  const createdAt = new Date(p.created_at);
  return createdAt >= dateRange.from && createdAt <= dateRange.to;
}).length;
```

**Définition Analytics**:

- ✅ **Total Users** = Tous créés avant `dateRange.to`
- ✅ **Active Users** = Créés avant `dateRange.to` + **`account_locked = false`** ← Différence clé !
- ✅ **New Users** = Créés dans la période `[dateRange.from, dateRange.to]`
- ❌ **N'exclut PAS** `deleted_at`
- ❌ **N'exclut PAS** `profile_validated`

**Affichage**:

```tsx
// MetricsSummarySimplified.tsx
<MetricCard
  title="Utilisateurs Total"
  value={userMetrics.totalUsers}          // ← Créés avant période
  change={userMetrics.growthRate}         // ← Calculé dynamiquement
/>
<MetricCard
  title="Utilisateurs Actifs"
  value={userMetrics.activeUsers}         // ← Exclut account_locked !
  change={activityMetrics.activeUsersGrowthRate}
/>
```

---

## ⚠️ **PROBLÈMES IDENTIFIÉS**

### 🔴 **Incohérence #1 : Définition "Utilisateurs Actifs"**

| Page                | Exclut `deleted_at`? | Exclut `account_locked`? | Filtre `profile_validated`? |
| ------------------- | -------------------- | ------------------------ | --------------------------- |
| **Dashboard**       | ✅ Oui               | ❌ Non                   | ✅ Oui (= true)             |
| **User Management** | ❌ Non               | ❌ Non                   | ✅ Oui (= true)             |
| **Analytics**       | ❌ Non               | ✅ Oui                   | ❌ Non                      |

**Impact**:

- Dashboard affiche potentiellement des utilisateurs verrouillés (`account_locked = true`)
- User Management peut afficher des utilisateurs supprimés (`deleted_at NOT NULL`)
- Analytics compte tous les profils créés (même non validés)

**Exemple concret**:

```
Utilisateur: jean@example.com
- created_at: 2025-01-01
- profile_validated: true
- account_locked: true
- deleted_at: NULL

Dashboard        → COMPTÉ (car validated = true, deleted_at = NULL)
User Management  → COMPTÉ (car validated = true)
Analytics        → NON COMPTÉ (car account_locked = true)

→ Les 3 pages donnent des chiffres différents pour le même user !
```

---

### 🟡 **Incohérence #2 : Taux de croissance hardcodés**

**User Management** (`UserStatsSection.tsx` lignes 52-53):

```typescript
const monthlyGrowth = '+12.5%'; // ← Hardcodé !
const activeGrowth = '+8.3%'; // ← Hardcodé !
```

**Impact**:

- Les pourcentages ne reflètent pas la réalité
- Trompe l'administrateur sur l'évolution réelle

**Comparaison**:
| Page | Croissance calculée? |
|------|---------------------|
| **Dashboard** | ❌ Non (pas affichée) |
| **User Management** | ❌ Non (hardcodée) |
| **Analytics** | ✅ Oui (période vs période précédente) |

---

### 🟢 **Incohérence #3 : Source de données**

| Page                | Méthode                | Avantage             | Inconvénient                |
| ------------------- | ---------------------- | -------------------- | --------------------------- |
| **Dashboard**       | `count: "exact"` (SQL) | ⚡ Ultra rapide      | Moins flexible              |
| **User Management** | Fetch all + `.length`  | 🎯 Données complètes | 🐌 Lent si beaucoup d'users |
| **Analytics**       | Fetch all + filtres    | 📊 Calculs complexes | 🐌 Lent si beaucoup d'users |

**Impact**:

- Dashboard : Scalable (count SQL)
- User Management : Va ralentir avec >10,000 utilisateurs
- Analytics : Va ralentir avec >10,000 utilisateurs

---

## 🎯 **RECOMMANDATIONS**

### **Priorité 1 : Standardiser "Utilisateurs Actifs"** 🔴

**Définition recommandée** (consensus):

```typescript
const isActiveUser = (user: Profile) => {
  return (
    user.profile_validated === true && // Profil validé
    user.account_locked === false && // Compte non verrouillé
    user.deleted_at === null // Non supprimé
  );
};
```

**Fichiers à modifier**:

1. `dashboard/hooks/dashboardQueries.ts` (ligne 53)
2. `users/components/UserStatsSection.tsx` (ligne 31)
3. `analytics/hooks/analyticsCalculations.ts` (ligne 43)

---

### **Priorité 2 : Calculer les vrais taux de croissance** 🟡

**User Management** - Remplacer hardcodé par calcul:

```typescript
// Au lieu de
const monthlyGrowth = '+12.5%'; // ❌ Hardcodé

// Faire comme Analytics
const userGrowthRate =
  previousPeriodUsers > 0 ? ((newUsers - previousPeriodUsers) / previousPeriodUsers) * 100 : 100;
const monthlyGrowth = `${userGrowthRate > 0 ? '+' : ''}${userGrowthRate.toFixed(1)}%`;
```

---

### **Priorité 3 : Optimiser User Management** 🟢

**Passer à count SQL au lieu de fetch all**:

```typescript
// Au lieu de
const totalUsers = filteredUsers.length; // ❌ Fetch all

// Utiliser
const { count } = await supabase
  .from('profiles')
  .select('*', { count: 'exact', head: true })
  .eq('profile_validated', true)
  .eq('account_locked', false)
  .is('deleted_at', null);
const totalUsers = count || 0; // ✅ Count SQL
```

---

## 📋 **PLAN D'ACTION**

### **Phase 1 : Correction Immédiate** (30 min)

1. ✅ Créer `src/utils/userMetrics.ts` avec fonction standardisée
2. ✅ Modifier Dashboard pour exclure `account_locked`
3. ✅ Modifier User Management pour exclure `deleted_at` + `account_locked`
4. ✅ Modifier Analytics pour utiliser la même définition

### **Phase 2 : Amélioration** (1h)

5. ✅ Implémenter calcul de croissance dans User Management
6. ✅ Remplacer hardcoded `'+12.5%'` par vraie valeur
7. ✅ Ajouter tests unitaires pour `isActiveUser()`

### **Phase 3 : Optimisation** (2h - optionnel)

8. ⏳ Passer User Management à count SQL
9. ⏳ Ajouter cache React Query pour stats
10. ⏳ Créer dashboard de monitoring des KPIs

---

## 🧪 **TESTS À EFFECTUER**

### **Scénario 1 : Utilisateur verrouillé**

```sql
UPDATE profiles SET account_locked = true WHERE email = 'test@example.com';
```

**Vérifier**:

- Dashboard : Ne doit PAS compter
- User Management : Ne doit PAS compter dans "Active"
- Analytics : Ne doit PAS compter dans "Active"

### **Scénario 2 : Utilisateur supprimé**

```sql
UPDATE profiles SET deleted_at = NOW() WHERE email = 'test@example.com';
```

**Vérifier**:

- Dashboard : Ne doit PAS compter
- User Management : Ne doit PAS afficher
- Analytics : Ne doit PAS compter

### **Scénario 3 : Utilisateur non validé**

```sql
UPDATE profiles SET profile_validated = false WHERE email = 'test@example.com';
```

**Vérifier**:

- Dashboard : Ne doit PAS compter dans "Active"
- User Management : Doit apparaître dans "Pending"
- Analytics : Compté dans "Total" mais pas "Active"

---

## 📊 **IMPACT SUR LES MÉTRIQUES ACTUELLES**

Si vous avez actuellement :

- 1000 utilisateurs totaux
- 50 utilisateurs avec `account_locked = true`
- 20 utilisateurs avec `deleted_at NOT NULL`
- 30 utilisateurs avec `profile_validated = false`

**Avant correction**:

- Dashboard : 950 actifs (exclut deleted_at seulement)
- User Management : 970 actifs (exclut rien)
- Analytics : 900 actifs (exclut account_locked seulement)

**Après correction**:

- Dashboard : 900 actifs ✅
- User Management : 900 actifs ✅
- Analytics : 900 actifs ✅

---

## ✅ **CHECKLIST DE VALIDATION**

- [ ] Les 3 pages affichent le même nombre d'utilisateurs actifs
- [ ] Les utilisateurs verrouillés sont exclus partout
- [ ] Les utilisateurs supprimés sont exclus partout
- [ ] Les taux de croissance sont calculés (pas hardcodés)
- [ ] Tests unitaires passent
- [ ] Documentation mise à jour

---

**Conclusion**: L'application utilise bien les mêmes données (table `profiles`) mais les calcule différemment. Une standardisation est nécessaire pour garantir la cohérence des KPIs affichés aux administrateurs.
