# 🔄 Plan de Refactoring : Traduction des Statuts

**Date**: 24 octobre 2025  
**Objectif**: Remplacer tous les affichages de statuts bruts (en anglais) par l'utilisation de `getStatusLabel()` de `statusHelpers.ts`

## 📋 Résumé

Le projet contient déjà un utilitaire centralisé `src/utils/statusHelpers.ts` qui gère la traduction des statuts en français, mais il n'est **pas utilisé partout**. Ce document liste tous les fichiers qui affichent encore des statuts bruts et doivent être refactorisés.

## ✅ Fichiers Déjà Refactorisés

### Property Approvals (3/4 fichiers - 75%)

1. ✅ `src/components/property-approvals/modals/PropertyBasicInfo.tsx`

   - Utilise maintenant `getStatusLabel(property?.validation_status, "property")`
   - Date: 24 oct 2025

2. ✅ `src/components/property-approvals/modals/sections/PropertyGeneralInfo.tsx`

   - Utilise maintenant `getStatusLabel(property?.validation_status, "property")`
   - Date: 24 oct 2025

3. ✅ `src/components/property-approvals/PropertyTableConfig.tsx`
   - Simplifié de 35 lignes à 10 lignes
   - Utilise `getStatusLabel()` et `getStatusColor()`
   - Date: 24 oct 2025

### Payments (3/4 fichiers - 75%)

1. ✅ `src/components/payments/modals/PaymentInfoSections.tsx`

   - Remplacé 15 lignes de ternaires par `getPaymentStatusLabel()`
   - Date: 24 oct 2025

2. ✅ `src/components/payments/modals/PaymentDetailsHeader.tsx`

   - Remplacé 11 lignes de ternaires par `getPaymentStatusLabel()`
   - Date: 24 oct 2025

3. ✅ `src/components/payments/components/PaymentInvoicePdf.tsx`
   - Remplacé 17 lignes de ternaires par `getPaymentStatusLabel()` et `getPaymentStatusColor()`
   - Date: 24 oct 2025

**Total refactorisé: 6/15 fichiers (40%)**

## 🔴 Fichiers à Refactoriser

### 1. Property Approvals (1 fichier restant)

#### ~~`src/components/property-approvals/PropertyTableConfig.tsx`~~ ✅ FAIT

**Ligne 183**: ~~`const status = params.value || "pending";`~~

```typescript
// ✅ REFACTORISÉ - Utilise getStatusLabel() et getStatusColor()
```

### 2. Quote Requests

#### `src/components/quote-requests/QuoteRequestsPage.tsx`

**Ligne 205**: Affichage conditionnel basé sur `status === "pending"`

```typescript
// Vérifier si le statut est affiché directement
// Si oui, utiliser getStatusLabel(quoteRequest.status, "quote_request")
```

### 3. Services Catalog

#### `src/components/services-catalog/modals/ServiceInfoSections.tsx`

**Lignes 257, 261, 270**: Comparaisons avec `request.status`

```typescript
// Vérifier si le statut est affiché
// Si oui, utiliser getStatusLabel(request.status, "service")
```

#### `src/components/services-catalog/components/ServiceRequestsSection.tsx`

**Ligne 281**: `request.status === "pending"`

```typescript
// Vérifier l'affichage du statut
```

### 4. User Management

#### `src/components/userManagement/modals/sections/AuditTables.tsx`

**Ligne 132**: `action.status === "pending"`

```typescript
// Vérifier l'affichage
```

#### `src/components/userManagement/modals/sections/BookingsSection.tsx`

**Lignes 342-343**: `booking.payment_status`

```typescript
// AVANT
label={booking.payment_status || "N/A"}
color={getPaymentStatusColor(booking.payment_status)}

// APRÈS (déjà a getPaymentStatusColor, ajouter le label)
import { getPaymentStatusLabel } from "../../../../utils/statusHelpers";
label={getPaymentStatusLabel(booking.payment_status)}
color={getPaymentStatusColor(booking.payment_status)}
```

### 5. Payments (1 fichier restant)

#### ~~`src/components/payments/modals/PaymentInfoSections.tsx`~~ ✅ FAIT

**Lignes 57-68**: ~~Affichage conditionnel du statut~~

```typescript
// ✅ REFACTORISÉ - Utilise getPaymentStatusLabel()
```

#### ~~`src/components/payments/components/PaymentInvoicePdf.tsx`~~ ✅ FAIT

**Lignes 259-272**: ~~Même problème d'affichage conditionnel~~

```typescript
// ✅ REFACTORISÉ - Utilise getPaymentStatusLabel() et getPaymentStatusColor()
```

#### ~~`src/components/payments/modals/PaymentDetailsHeader.tsx`~~ ✅ FAIT

**Lignes 79-81**: ~~Affichage conditionnel du statut~~

```typescript
// ✅ REFACTORISÉ - Utilise getPaymentStatusLabel()
```

#### Autres fichiers Payments (actions conditionnelles uniquement)

Ces fichiers comparent les statuts pour afficher des boutons, pas le statut lui-même :

- `PaymentTableColumns.tsx` (ligne 178, 202) - ✅ OK (logique conditionnelle)
- `PaymentTableActions.tsx` (ligne 84, 99) - ✅ OK (logique conditionnelle)
- `PaymentActions.tsx` (ligne 74, 89) - ✅ OK (logique conditionnelle)

### 6. Activity Item

#### `src/components/ActivityItem.tsx`

**Ligne 13**: `type Status = "Pending" | "Review Required" | "Completed";`

```typescript
// Ce composant semble utiliser des statuts en anglais hardcodés
// À vérifier et refactoriser si nécessaire
```

## 📊 Statistiques

- **Fichiers refactorisés**: 6/15 (40%)
- **Fichiers à refactoriser**: ~9
- **Modules concernés**:
  - ✅ Property Approvals: 3/4 refactorisés (75%) 🎉
  - ✅ Payments: 3/4 refactorisés (75%) 🎉
  - 🔴 Quote Requests: 0/1
  - 🔴 Services Catalog: 0/2
  - 🔴 User Management: 0/2
  - 🔴 Shared Components: 0/1

**Progrès aujourd'hui (24 oct 2025)**: +4 fichiers refactorisés 🚀

## 🛠️ Guide de Refactoring

### Étapes pour chaque fichier :

1. **Ajouter l'import**

   ```typescript
   import { getStatusLabel } from "../../utils/statusHelpers";
   // ou getPaymentStatusLabel si c'est un paiement
   ```

2. **Identifier le type de statut**

   - `payment` → paiements
   - `booking` → réservations
   - `service` → services
   - `property` → propriétés
   - `quote_request` → demandes de devis
   - `user_account` → comptes utilisateurs

3. **Remplacer l'affichage**

   ```typescript
   // AVANT
   {
     status;
   }
   {
     status || "N/A";
   }
   {
     status === "paid" ? "Payé" : "En attente";
   }

   // APRÈS
   {
     getStatusLabel(status, "payment");
   }
   ```

4. **Garder la logique conditionnelle**
   ```typescript
   // ✅ OK - Ne pas toucher (c'est de la logique, pas de l'affichage)
   {
     status === "pending" && <Button>Approuver</Button>;
   }
   ```

## 🎯 Bénéfices Attendus

1. **Centralisation** : Un seul endroit pour gérer les traductions
2. **Cohérence** : Tous les statuts traduits de la même manière
3. **Maintenabilité** : Ajout facile de nouveaux statuts
4. **Type-safe** : TypeScript garantit l'utilisation correcte
5. **Réutilisabilité** : Fonctionne pour tous les types de statuts

## 📝 Notes

- Le fichier `statusHelpers.ts` contient déjà tous les mappings nécessaires
- Les fonctions `getStatusColor()` et `getStatusLabel()` sont prêtes à l'emploi
- Alias disponibles : `getPaymentStatusColor()` et `getPaymentStatusLabel()`
- Pas besoin de toucher aux comparaisons de statuts (logique conditionnelle)

## 🚀 Prochaines Étapes

1. Commencer par le module **Payments** (4 fichiers)
2. Puis **Services Catalog** (2 fichiers)
3. Puis **User Management** (2 fichiers)
4. Finir avec les modules restants

---

**Maintenu par**: Back-Office Team  
**Dernière mise à jour**: 24 octobre 2025
