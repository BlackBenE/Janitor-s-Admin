# PageHeader Component

## 📋 Description

Composant générique pour afficher un header de page avec titre, description et actions.

## 🎯 Utilisation

### Import

```tsx
import { PageHeader } from '@/shared/components';
```

### Exemple basique

```tsx
<PageHeader
  title="Gestion des utilisateurs"
  description="Gérez tous les types d'utilisateurs sur la plateforme."
/>
```

### Exemple avec actions

```tsx
import { IconButton, Tooltip } from '@mui/material';
import { Add as AddIcon, Download as DownloadIcon } from '@mui/icons-material';

<PageHeader
  title="Gestion des utilisateurs"
  description="Gérez tous les types d'utilisateurs sur la plateforme."
  actions={
    <>
      <Tooltip title="Créer">
        <IconButton onClick={handleCreate}>
          <AddIcon />
        </IconButton>
      </Tooltip>
      <Tooltip title="Exporter">
        <IconButton onClick={handleExport}>
          <DownloadIcon />
        </IconButton>
      </Tooltip>
    </>
  }
/>;
```

### Exemple avec personnalisation

```tsx
<PageHeader
  title="Dashboard"
  description="Vue d'ensemble de votre activité"
  titleLevel="h2"
  titleVariant="h3"
  sx={{ mb: 4 }}
  actions={<Button variant="contained">Action</Button>}
/>
```

## 📦 Props

| Prop           | Type                                           | Default      | Description                                   |
| -------------- | ---------------------------------------------- | ------------ | --------------------------------------------- |
| `title`        | `string`                                       | **Required** | Titre principal de la page                    |
| `description`  | `string`                                       | `undefined`  | Description/sous-titre de la page             |
| `actions`      | `ReactNode`                                    | `undefined`  | Actions (boutons, icônes) à afficher à droite |
| `titleLevel`   | `'h1' \| 'h2' \| 'h3' \| 'h4' \| 'h5' \| 'h6'` | `'h1'`       | Niveau de titre HTML sémantique               |
| `titleVariant` | `'h1' \| 'h2' \| 'h3' \| 'h4' \| 'h5' \| 'h6'` | `'h4'`       | Variant MUI Typography pour le style visuel   |
| `sx`           | `SxProps`                                      | `undefined`  | Styles MUI personnalisés                      |
| `className`    | `string`                                       | `undefined`  | Classes CSS personnalisées                    |

## 🎨 Anatomie

```
┌─────────────────────────────────────────────────────────┐
│ Title                                    [Actions]       │
│ Description text here...                                 │
└─────────────────────────────────────────────────────────┘
```

## 💡 Cas d'usage

### 1. **Page de gestion simple**

```tsx
<PageHeader title="Gestion des paiements" description="Consultez et gérez les paiements." />
```

### 2. **Page avec actions multiples**

```tsx
<PageHeader
  title="Gestion des utilisateurs"
  description="Liste complète des utilisateurs."
  actions={
    <>
      <IconButton onClick={onCreate}>
        <AddIcon />
      </IconButton>
      <IconButton onClick={onExport}>
        <DownloadIcon />
      </IconButton>
      <IconButton onClick={onRefresh}>
        <RefreshIcon />
      </IconButton>
    </>
  }
/>
```

### 3. **Page avec état de chargement**

```tsx
<PageHeader
  title="Dashboard"
  description="Statistiques en temps réel"
  actions={
    <IconButton disabled={isLoading}>
      {isLoading ? <CircularProgress size={24} /> : <RefreshIcon />}
    </IconButton>
  }
/>
```

## 🔄 Migration

### Avant (code spécifique)

```tsx
<Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 3 }}>
  <Box>
    <Typography variant="h4" component="h1">
      Titre
    </Typography>
    <Typography color="text.secondary">Description</Typography>
  </Box>
  <Box sx={{ display: 'flex', gap: 1 }}>{/* Actions */}</Box>
</Box>
```

### Après (composant PageHeader)

```tsx
<PageHeader title="Titre" description="Description" actions={/* Actions */} />
```

## ✅ Avantages

1. **Cohérence** : Design uniforme sur toutes les pages
2. **Maintenabilité** : Un seul endroit pour modifier le style
3. **Réutilisabilité** : Utilisable sur n'importe quelle page
4. **Accessibilité** : Niveaux de titres sémantiques (h1-h6)
5. **Flexibilité** : Props pour personnalisation complète

## 🔗 Composants liés

- `DataTableContainer` - Container pour tableaux de données
- `AdminLayout` - Layout principal de l'application
