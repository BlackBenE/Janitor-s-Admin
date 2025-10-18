/**
 * Utilitaires de formatage pour les tableaux utilisateur
 * Fonctions réutilisables pour le formatage des données
 */

import { UserRole } from "../types/userManagement";

/**
 * Obtient la couleur Material-UI correspondant à un rôle utilisateur
 */
export const getRoleColor = (
  role: string
):
  | "default"
  | "primary"
  | "secondary"
  | "error"
  | "info"
  | "success"
  | "warning" => {
  switch (role.toLowerCase()) {
    case "admin":
      return "error";
    case "property_owner":
      return "primary";
    case "service_provider":
      return "info";
    case "traveler":
      return "default";
    default:
      return "default";
  }
};

/**
 * Formate une date pour l'affichage dans le tableau
 */
export const formatDate = (dateString: string | null): string => {
  if (!dateString) return "Never";
  return new Date(dateString).toLocaleDateString();
};

/**
 * Formate un montant en devise pour l'affichage
 */
export const formatCurrency = (amount: number): string => {
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
  }).format(amount);
};

/**
 * Obtient le label formaté d'un rôle utilisateur
 */
export const getRoleLabel = (role: string): string => {
  switch (role.toLowerCase()) {
    case "admin":
      return "Admin";
    case "property_owner":
      return "Property Owner";
    case "service_provider":
      return "Service Provider";
    case "traveler":
      return "Traveler";
    default:
      return role.replace("_", " ");
  }
};

/**
 * Obtient le nom de l'en-tête d'activité selon le rôle
 */
export const getActivityHeaderName = (
  currentUserRole: UserRole | null
): string => {
  if (currentUserRole === UserRole.TRAVELER) return "Bookings";
  if (currentUserRole === UserRole.PROPERTY_OWNER) return "Properties";
  if (currentUserRole === UserRole.SERVICE_PROVIDER) return "Services";
  return "Activity";
};

/**
 * Calcule le temps restant avant le déverrouillage d'un compte
 */
export const calculateLockTimeRemaining = (
  lockedUntil: string | null
): string => {
  if (!lockedUntil) return "Permanent";

  const now = new Date();
  const unlockDate = new Date(lockedUntil);
  const diffMs = unlockDate.getTime() - now.getTime();

  if (diffMs <= 0) {
    return "Expiré";
  }

  const diffHours = Math.floor(diffMs / (1000 * 60 * 60));
  const diffMinutes = Math.floor((diffMs % (1000 * 60 * 60)) / (1000 * 60));

  if (diffHours > 0) {
    return `${diffHours}h ${diffMinutes}m`;
  } else {
    return `${diffMinutes}m`;
  }
};
