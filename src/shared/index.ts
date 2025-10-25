/**
 * Point d'entrée principal pour la couche SHARED
 * Exporte tous les composants, hooks et utilitaires partagés
 */

// Composants partagés (layout, forms, feedback, etc.)
export * from './components';

// Hooks partagés
export * from './hooks';

// Constants partagés
export * from './constants';

// Utilitaires partagés
// NOTE: Commenté temporairement à cause d'un conflit de noms (FilterConfig)
// Utilisez les imports directs: import { ... } from '@/shared/utils';
// export * from './utils';
