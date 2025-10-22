/**
 * Utilitaires complets pour la gestion des utilisateurs
 * Fonctions réutilisables pour le formatage des données, validations et helpers
 */

import { UserRole } from "../../../types/userManagement";

// ======================== FORMATAGE DES DONNÉES ========================

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
  return new Intl.NumberFormat("fr-FR", {
    style: "currency",
    currency: "EUR",
  }).format(amount);
};

/**
 * Formate un nom d'utilisateur pour l'affichage
 */
export const formatUserName = (
  fullName: string | null,
  email: string
): string => {
  return fullName || email.split("@")[0] || "Unnamed User";
};

/**
 * Formate un numéro de téléphone pour l'affichage
 */
export const formatPhoneNumber = (phone: string | null): string => {
  if (!phone) return "Not provided";

  // Format simple pour les numéros US/internationaux
  const cleaned = phone.replace(/\D/g, "");
  if (cleaned.length === 10) {
    return `(${cleaned.slice(0, 3)}) ${cleaned.slice(3, 6)}-${cleaned.slice(
      6
    )}`;
  }
  return phone;
};

// ======================== HELPERS MÉTIER ========================

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
    return "Expired";
  }

  const diffHours = Math.floor(diffMs / (1000 * 60 * 60));
  const diffMinutes = Math.floor((diffMs % (1000 * 60 * 60)) / (1000 * 60));

  if (diffHours > 0) {
    return `${diffHours}h ${diffMinutes}m`;
  } else {
    return `${diffMinutes}m`;
  }
};

/**
 * Vérifie si un utilisateur peut être promu VIP selon son rôle
 */
export const canBeVip = (role: string): boolean => {
  const vipEligibleRoles = ["property_owner", "tenant", "traveler"];
  return vipEligibleRoles.includes(role.toLowerCase());
};

/**
 * Vérifie si un utilisateur peut avoir des réservations
 */
export const canHaveBookings = (role: string): boolean => {
  const bookingRoles = ["property_owner", "tenant", "traveler"];
  return bookingRoles.includes(role.toLowerCase());
};

/**
 * Vérifie si un utilisateur peut être validé en tant que prestataire
 */
export const canBeValidatedAsProvider = (role: string): boolean => {
  return role.toLowerCase() === "service_provider";
};

// ======================== VALIDATIONS ========================

/**
 * Valide un email
 */
export const isValidEmail = (email: string): boolean => {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
};

/**
 * Valide un numéro de téléphone
 */
export const isValidPhoneNumber = (phone: string): boolean => {
  const phoneRegex = /^[\+]?[1-9][\d]{0,15}$/;
  return phoneRegex.test(phone.replace(/\D/g, ""));
};

/**
 * Valide qu'un nom n'est pas vide et fait au moins 2 caractères
 */
export const isValidName = (name: string): boolean => {
  return name.trim().length >= 2;
};

// ======================== FILTRAGE ET TRI ========================

/**
 * Filtre les utilisateurs par terme de recherche (nom, email)
 */
export const filterUsersBySearch = <
  T extends { full_name?: string; email: string }
>(
  users: T[],
  searchTerm: string
): T[] => {
  if (!searchTerm.trim()) return users;

  const term = searchTerm.toLowerCase();
  return users.filter(
    (user) =>
      user.full_name?.toLowerCase().includes(term) ||
      user.email.toLowerCase().includes(term)
  );
};

/**
 * Filtre les utilisateurs par rôle
 */
export const filterUsersByRole = <T extends { role: string }>(
  users: T[],
  role: string | null
): T[] => {
  if (!role || role === "all") return users;
  return users.filter((user) => user.role.toLowerCase() === role.toLowerCase());
};

/**
 * Trie les utilisateurs par critère
 */
export const sortUsers = <
  T extends { created_at?: string; full_name?: string; email: string }
>(
  users: T[],
  sortBy: "name" | "email" | "date",
  sortOrder: "asc" | "desc" = "asc"
): T[] => {
  return [...users].sort((a, b) => {
    let comparison = 0;

    switch (sortBy) {
      case "name":
        const nameA = a.full_name || a.email;
        const nameB = b.full_name || b.email;
        comparison = nameA.localeCompare(nameB);
        break;
      case "email":
        comparison = a.email.localeCompare(b.email);
        break;
      case "date":
        const dateA = new Date(a.created_at || 0);
        const dateB = new Date(b.created_at || 0);
        comparison = dateA.getTime() - dateB.getTime();
        break;
    }

    return sortOrder === "desc" ? -comparison : comparison;
  });
};

// ======================== STATUTS ET BADGES ========================

/**
 * Obtient le statut affiché d'un compte
 */
export const getAccountStatus = (user: {
  account_locked?: boolean;
  profile_validated?: boolean;
  deleted_at?: string;
}): {
  status: "active" | "locked" | "unverified" | "deleted";
  label: string;
  color: "success" | "error" | "warning" | "default";
} => {
  if (user.deleted_at) {
    return { status: "deleted", label: "Deleted", color: "default" };
  }

  if (user.account_locked) {
    return { status: "locked", label: "Locked", color: "error" };
  }

  if (!user.profile_validated) {
    return { status: "unverified", label: "Unverified", color: "warning" };
  }

  return { status: "active", label: "Active", color: "success" };
};

/**
 * Obtient les badges d'un utilisateur
 */
export const getUserBadges = (user: {
  vip_subscription?: boolean;
  profile_validated?: boolean;
  account_locked?: boolean;
}): Array<{
  label: string;
  color: "primary" | "success" | "warning" | "error";
  icon?: string;
}> => {
  const badges = [];

  if (user.vip_subscription) {
    badges.push({ label: "VIP", color: "primary" as const, icon: "star" });
  }

  if (user.profile_validated) {
    badges.push({
      label: "Verified",
      color: "success" as const,
      icon: "check",
    });
  }

  if (user.account_locked) {
    badges.push({ label: "Locked", color: "error" as const, icon: "lock" });
  }

  return badges;
};
