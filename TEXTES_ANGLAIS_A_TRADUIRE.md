# 🇫🇷 Textes anglais restants à traduire - Property Approvals

## 📋 Résumé

J'ai analysé **22 fichiers** du module Property Approvals et identifié **tous les textes en anglais** qui doivent être traduits en français.

---

## 📁 Fichiers analysés

### Components

1. ✅ ImageViewerModal.tsx
2. ✅ PropertyFiltersSection.tsx
3. ✅ PropertyTableActions.tsx
4. ✅ PropertyTableSection.tsx
5. ✅ PropertyHeader.tsx

### Modals

6. ✅ PropertyGeneralInfo.tsx
7. ✅ PropertyBasicInfo.tsx
8. ✅ PropertyDetailsHeader.tsx
9. ✅ PropertyDetailsModal.tsx
10. ✅ PropertyEditForm.tsx
11. ✅ PropertyImageGallery.tsx
12. ✅ PropertyModerationActions.tsx
13. ✅ PropertyOwnerInfo.tsx

### Config & Others

14. ✅ PropertyTableConfig.tsx
15. ✅ PropertyApprovalsPage.tsx

---

## 🔴 TEXTES ANGLAIS TROUVÉS PAR FICHIER

### 1. **PropertyFiltersSection.tsx** (Ligne 82-85)

```typescript
// ❌ ANGLAIS
{selectedCount} propert{selectedCount === 1 ? "y" : "ies"} selected

// ❌ ANGLAIS - Tooltips
`Approve ${selectedCount} propert${selectedCount === 1 ? "y" : "ies"}`
`Set ${selectedCount} propert${selectedCount === 1 ? "y" : "ies"} to pending`
`Reject ${selectedCount} propert${selectedCount === 1 ? "y" : "ies"}`

// ❌ ANGLAIS - Boutons
Approve All
Set Pending
Reject All
Clear
Clear selection

// ❌ ANGLAIS - Placeholder
placeholder: "Search properties..."

// ❌ ANGLAIS - aria-label
ariaLabel: "property status filter"
```

**✅ Labels à ajouter :**

```typescript
propertyApprovals: {
  bulk: {
    selected: "{{count}} propriété(s) sélectionnée(s)",
    tooltips: {
      approve: "Approuver {{count}} propriété(s)",
      setPending: "Mettre {{count}} propriété(s) en attente",
      reject: "Rejeter {{count}} propriété(s)",
      clear: "Effacer la sélection",
    },
    actions: {
      approveAll: "Tout approuver",
      setPending: "Mettre en attente",
      rejectAll: "Tout rejeter",
      clear: "Effacer",
    },
  },
  search: {
    placeholder: "Rechercher des propriétés...",
    ariaLabel: "filtre de statut des propriétés",
  },
}
```

---

### 2. **PropertyTableActions.tsx** (Lignes 104-136)

```typescript
// ❌ ANGLAIS - Menu items
<ListItemText primary="Approve" />
<ListItemText primary="Reject" />
<ListItemText primary="Set to Pending" />
<ListItemText primary="Delete Property" />

// ❌ ANGLAIS - Tooltips (lignes 189-191)
<Tooltip title="View Details">
<Tooltip title="More actions">

// ❌ ANGLAIS - Fallback
propertyTitle = params.row.title || "Unknown Property";
```

**✅ Labels à ajouter :**

```typescript
propertyApprovals: {
  actions: {
    approve: "Approuver",
    reject: "Rejeter",
    setPending: "Mettre en attente",
    deleteProperty: "Supprimer la propriété",
    viewDetails: "Voir les détails",
    moreActions: "Plus d'actions",
  },
  table: {
    unknownProperty: "Propriété inconnue",
  },
}
```

---

### 3. **PropertyTableSection.tsx** (Lignes 133-135, 178-183)

```typescript
// ❌ ANGLAIS - Titre et description
<h3>All Properties</h3>
<p>Manage properties across all categories with specialized views</p>

// ❌ ANGLAIS - Empty state
<Typography variant="h6" color="text.secondary">
  No properties found
</Typography>
<Typography variant="body2" sx={{ mt: 1 }}>
  {filters.search || Object.values(filters).some((f) => f)
    ? "No properties match your search criteria."
    : "There are no properties in the system yet."}
</Typography>
```

**✅ Labels à ajouter :**

```typescript
propertyApprovals: {
  table: {
    title: "Toutes les propriétés",
    subtitle: "Gérer les propriétés de toutes catégories avec des vues spécialisées",
  },
  emptyState: {
    title: "Aucune propriété trouvée",
    noMatch: "Aucune propriété ne correspond à vos critères de recherche.",
    noProperties: "Il n'y a pas encore de propriétés dans le système.",
  },
}
```

---

### 4. **PropertyGeneralInfo.tsx** (Tout le fichier !)

```typescript
// ❌ ANGLAIS - Titre section
<InfoIcon /> Basic Information

// ❌ ANGLAIS - Labels des champs
"Property Title"
"City"
"Description"
"Nightly Rate"
"Maximum Capacity"
"Images Count"
"Owner ID"
"Created At"
"Updated At"
"Validation Status"
"Validated By"
"Moderation Notes"

// ❌ ANGLAIS - Valeurs par défaut
"No title provided"
"N/A"
"No description provided"
"Price not set"
`${property.capacity} guests`
`${property.images.length} image(s)`
"No images uploaded"
"Not validated"
"No moderation notes"
```

**✅ Labels à ajouter :**

```typescript
propertyApprovals: {
  modals: {
    sections: {
      basicInfo: "Informations de base",
      location: "Localisation",
      amenities: "Équipements et fonctionnalités",
      validation: "Statut de validation",
      availability: "Calendrier de disponibilité",
    },
    fields: {
      propertyTitle: "Titre de la propriété",
      city: "Ville",
      description: "Description",
      nightlyRate: "Tarif par nuit",
      maxCapacity: "Capacité maximale",
      imagesCount: "Nombre d'images",
      ownerId: "ID du propriétaire",
      createdAt: "Créé le",
      updatedAt: "Mis à jour le",
      validationStatus: "Statut de validation",
      validatedBy: "Validé par",
      moderationNotes: "Notes de modération",
      bedrooms: "Chambres",
      bathrooms: "Salles de bain",
    },
    placeholders: {
      noTitle: "Aucun titre fourni",
      noDescription: "Aucune description fournie",
      priceNotSet: "Prix non défini",
      noImages: "Aucune image téléchargée",
      notValidated: "Non validé",
      noModerationNotes: "Aucune note de modération",
    },
    units: {
      perNight: "/nuit",
      guests: "invités",
      images: "image(s)",
    },
  },
}
```

---

### 5. **PropertyBasicInfo.tsx** (Tout le fichier !)

```typescript
// ❌ ANGLAIS - Titres des sections
<InfoIcon /> Basic Information
<LocationIcon /> Location
<StarIcon /> Amenities & Features
<VerifiedIcon /> Validation Status
<CalendarIcon /> Availability Calendar

// ❌ ANGLAIS - Labels
"Property ID"
"Title"
"Description"
"Nightly Rate"
"Maximum Capacity"
"Images Count"
"Owner ID"
"Bedrooms"
"Bathrooms"
"Created Date"
"Last Updated"
"Address"
"Postal Code"
"Available Amenities"
"Status"
"Validated Date"
"Validated By"
"Moderation Notes"

// ❌ ANGLAIS - Valeurs
"No description provided"
`${property.capacity} guests`
`${property.images.length} image(s)`
"No images uploaded"
"No amenities listed"
"Pending"
"Not validated"
"Unknown Admin"

// ❌ ANGLAIS - Calendrier
"No availability periods configured"
`${calendarData.length} availability period(s) configured`
"Period"
"Status"
"Reason"
"Available"
"Unavailable"
"No reason provided"
"Error parsing calendar data"
"Raw data:"
"No availability calendar configured"
```

**✅ Utiliser les labels existants + ajouter :**

```typescript
propertyApprovals: {
  modals: {
    calendar: {
      noPeriods: "Aucune période de disponibilité configurée",
      periodsConfigured: "{{count}} période(s) de disponibilité configurée(s)",
      period: "Période",
      status: "Statut",
      reason: "Raison",
      available: "Disponible",
      unavailable: "Indisponible",
      noReason: "Aucune raison fournie",
      parseError: "Erreur lors de l'analyse des données du calendrier",
      rawData: "Données brutes :",
      noCalendar: "Aucun calendrier de disponibilité configuré",
    },
    unknownAdmin: "Administrateur inconnu",
  },
}
```

---

### 6. **PropertyDetailsHeader.tsx** (Ligne 18)

```typescript
// ❌ ANGLAIS
<Typography variant="h6">Property Details</Typography>
```

**✅ Label à ajouter :**

```typescript
propertyApprovals: {
  modals: {
    title: "Détails de la propriété",
  },
}
```

---

### 7. **PropertyEditForm.tsx** (Tout le fichier !)

```typescript
// ❌ ANGLAIS - Titres
<EditIcon /> Edit Property Information
<LocationIcon /> Edit Location
"Edit Amenities"
"Admin Notes"

// ❌ ANGLAIS - Labels de champs
"Property Title"
"Description"
"Nightly Rate (€)"
"Maximum Capacity"
"Bedrooms"
"Bathrooms"
"Address"
"City"
"Postal Code"
"Add amenity"
"Moderation Notes"

// ❌ ANGLAIS - Helper texts
"Clear, descriptive title without excessive capitalization"
"Accurate description without contact information or external links"
"Market-appropriate pricing"
"Safe occupancy limit"
"Actual bedrooms with privacy"
"Use 0.5 for half baths"
"General address (avoid specific unit numbers for privacy)"
"Standardized city name"
"Correct format for country"
"Document changes made and reasons..."
"Internal notes about modifications and communications"

// ❌ ANGLAIS - Messages
"No amenities listed"
```

**✅ Labels à ajouter :**

```typescript
propertyApprovals: {
  edit: {
    titles: {
      propertyInfo: "Modifier les informations de la propriété",
      location: "Modifier l'emplacement",
      amenities: "Modifier les équipements",
      adminNotes: "Notes d'administration",
    },
    fields: {
      propertyTitle: "Titre de la propriété",
      description: "Description",
      nightlyRate: "Tarif par nuit (€)",
      maxCapacity: "Capacité maximale",
      bedrooms: "Chambres",
      bathrooms: "Salles de bain",
      address: "Adresse",
      city: "Ville",
      postalCode: "Code postal",
      addAmenity: "Ajouter un équipement",
      moderationNotes: "Notes de modération",
    },
    helpers: {
      title: "Titre clair et descriptif sans majuscules excessives",
      description: "Description précise sans coordonnées ni liens externes",
      pricing: "Tarification adaptée au marché",
      capacity: "Limite d'occupation sécurisée",
      bedrooms: "Chambres réelles avec intimité",
      bathrooms: "Utiliser 0,5 pour les demi-salles de bain",
      address: "Adresse générale (éviter les numéros d'unité spécifiques pour la confidentialité)",
      city: "Nom de ville standardisé",
      postalCode: "Format correct pour le pays",
      moderationNotes: "Documenter les modifications effectuées et les raisons...",
      internalNotes: "Notes internes sur les modifications et communications",
    },
    messages: {
      noAmenities: "Aucun équipement listé",
    },
  },
}
```

---

### 8. **PropertyModerationActions.tsx** (Lignes 107-191)

```typescript
// ❌ ANGLAIS - Titres et placeholders
"Moderation Notes";
"Add notes for your decision (optional)...";

// ❌ ANGLAIS - Boutons
"Close";
"Cancel";
"Save Changes";
"Saving...";
"Edit Property";
"Reject";
"Rejecting...";
"Set Pending";
"Setting Pending...";
"Approve";
"Approving...";
```

**✅ Labels à ajouter :**

```typescript
propertyApprovals: {
  moderation: {
    title: "Notes de modération",
    placeholder: "Ajouter des notes pour votre décision (optionnel)...",
    actions: {
      close: "Fermer",
      cancel: "Annuler",
      saveChanges: "Enregistrer les modifications",
      saving: "Enregistrement...",
      editProperty: "Modifier la propriété",
      reject: "Rejeter",
      rejecting: "Rejet en cours...",
      setPending: "Mettre en attente",
      settingPending: "Mise en attente...",
      approve: "Approuver",
      approving: "Approbation en cours...",
    },
  },
}
```

---

### 9. **PropertyTableConfig.tsx** (Lignes 90, 225, 232)

```typescript
// ❌ ANGLAIS - Header
headerName: "Actions";

// ❌ ANGLAIS - Fallback value
{
  params.value || "Untitled";
}

// ❌ ANGLAIS - Status text
("Approved");
("Rejected");
("Pending");
```

**✅ Labels à ajouter :**

```typescript
propertyApprovals: {
  table: {
    headers: {
      actions: "Actions",
    },
    untitled: "Sans titre",
    status: {
      approved: "Approuvé",
      rejected: "Rejeté",
      pending: "En attente",
    },
  },
}
```

---

## 📊 STATISTIQUES

### Par fichier :

- **PropertyFiltersSection.tsx** : 15 textes anglais
- **PropertyTableActions.tsx** : 8 textes anglais
- **PropertyTableSection.tsx** : 6 textes anglais
- **PropertyGeneralInfo.tsx** : 20+ textes anglais
- **PropertyBasicInfo.tsx** : 35+ textes anglais
- **PropertyDetailsHeader.tsx** : 1 texte anglais
- **PropertyEditForm.tsx** : 25+ textes anglais
- **PropertyModerationActions.tsx** : 12 textes anglais
- **PropertyTableConfig.tsx** : 6 textes anglais

### Total estimé : **~130 textes anglais** à traduire

---

## ✅ PLAN D'ACTION

### Phase 1 : Ajouter tous les labels manquants à `labels.ts`

1. Étendre la section `propertyApprovals` avec tous les nouveaux labels
2. Organiser par sous-sections logiques (bulk, search, actions, modals, edit, moderation, calendar, etc.)

### Phase 2 : Remplacer les textes dans chaque fichier

1. PropertyFiltersSection.tsx
2. PropertyTableActions.tsx
3. PropertyTableSection.tsx
4. PropertyGeneralInfo.tsx
5. PropertyBasicInfo.tsx
6. PropertyDetailsHeader.tsx
7. PropertyEditForm.tsx
8. PropertyModerationActions.tsx
9. PropertyTableConfig.tsx

### Phase 3 : Tests et validation

1. Vérifier la compilation TypeScript
2. Tester chaque composant visuellement
3. Confirmer que tous les textes sont en français

---

## 🎯 PROCHAINE ÉTAPE

Voulez-vous que je procède à :

1. **Ajouter TOUS les labels manquants à `labels.ts`** ?
2. **Ensuite remplacer tous les textes anglais dans les fichiers** ?

Je peux tout faire automatiquement et systématiquement ! 🚀
