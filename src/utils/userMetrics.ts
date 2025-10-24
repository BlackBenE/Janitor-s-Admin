/**
 * Utilitaires pour calculer les métriques utilisateurs de manière cohérente
 * à travers toute l'application (Dashboard, User Management, Analytics)
 */

import { Database } from '@/types';

type Profile = Database['public']['Tables']['profiles']['Row'];

/**
 * Définition standardisée d'un utilisateur actif
 * UTILISÉE PARTOUT : Dashboard, User Management, Analytics
 *
 * Un utilisateur est considéré comme actif si :
 * - Son profil est validé (profile_validated = true)
 * - Son compte n'est pas verrouillé (account_locked = false)
 * - Il n'est pas supprimé (deleted_at IS NULL)
 * - Il n'est PAS admin (role != 'admin') - Les admins sont comptés séparément
 */
export const isActiveUser = (user: Profile): boolean => {
  return (
    user.profile_validated === true &&
    user.account_locked === false &&
    user.deleted_at === null &&
    user.role !== 'admin' // Exclure les admins
  );
};

/**
 * Vérifie si un utilisateur est supprimé
 */
export const isDeletedUser = (user: Profile): boolean => {
  return user.deleted_at !== null;
};

/**
 * Vérifie si un utilisateur est en attente de validation
 */
export const isPendingUser = (user: Profile): boolean => {
  return user.profile_validated === false && user.deleted_at === null;
};

/**
 * Vérifie si un utilisateur est verrouillé
 */
export const isLockedUser = (user: Profile): boolean => {
  return user.account_locked === true && user.deleted_at === null;
};

/**
 * Filtre pour les requêtes Supabase - Utilisateurs actifs
 * À utiliser avec .select() pour optimiser les performances
 */
export const ACTIVE_USER_FILTERS = {
  profile_validated: true,
  account_locked: false,
  deleted_at: null,
} as const;

/**
 * Calcule le taux de croissance entre deux périodes
 */
export const calculateGrowthRate = (current: number, previous: number): number => {
  if (previous === 0) {
    return current > 0 ? 100 : 0;
  }
  return ((current - previous) / previous) * 100;
};

/**
 * Formate le taux de croissance pour l'affichage
 */
export const formatGrowthRate = (rate: number): string => {
  const sign = rate > 0 ? '+' : '';
  return `${sign}${rate.toFixed(1)}%`;
};
