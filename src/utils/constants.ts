/**
 * Constantes et configurations centralisées
 */

// Couleurs de statut standardisées
export const STATUS_COLORS = {
  success: "#4caf50",
  error: "#f44336",
  warning: "#ff9800",
  info: "#2196f3",
  pending: "#ff9800",
  approved: "#4caf50",
  rejected: "#f44336",
  active: "#4caf50",
  inactive: "#9e9e9e",
  completed: "#4caf50",
  cancelled: "#f44336",
  paid: "#4caf50",
  failed: "#f44336",
  refunded: "#2196f3",
} as const;

// Devises supportées
export const CURRENCIES = {
  EUR: "€",
  USD: "$",
  GBP: "£",
} as const;

// Configuration de pagination par défaut
export const PAGINATION_CONFIG = {
  DEFAULT_PAGE_SIZE: 25,
  PAGE_SIZE_OPTIONS: [10, 25, 50, 100],
  MAX_PAGES_DISPLAYED: 5,
} as const;

// Délais pour les interactions
export const TIMING = {
  DEBOUNCE_DELAY: 300,
  THROTTLE_DELAY: 100,
  AUTO_SAVE_DELAY: 2000,
  NOTIFICATION_DURATION: 5000,
} as const;

// Limites de validation
export const VALIDATION_LIMITS = {
  MIN_PASSWORD_LENGTH: 8,
  MAX_FILE_SIZE_MB: 10,
  MAX_DESCRIPTION_LENGTH: 1000,
  MAX_TITLE_LENGTH: 100,
} as const;

// Formats de date communs
export const DATE_FORMATS = {
  SHORT: {
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
  } as Intl.DateTimeFormatOptions,
  MEDIUM: {
    day: "numeric",
    month: "short",
    year: "numeric",
  } as Intl.DateTimeFormatOptions,
  LONG: {
    weekday: "long",
    day: "numeric",
    month: "long",
    year: "numeric",
  } as Intl.DateTimeFormatOptions,
  TIME: { hour: "2-digit", minute: "2-digit" } as Intl.DateTimeFormatOptions,
  DATETIME: {
    day: "numeric",
    month: "short",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  } as Intl.DateTimeFormatOptions,
} as const;

// Rôles utilisateurs
export const USER_ROLES = {
  ADMIN: "admin",
  PROPERTY_OWNER: "property_owner",
  TRAVELER: "traveler",
  SERVICE_PROVIDER: "service_provider",
} as const;

// Statuts de validation
export const VALIDATION_STATUSES = {
  PENDING: "pending",
  APPROVED: "approved",
  REJECTED: "rejected",
} as const;

// Statuts de paiement
export const PAYMENT_STATUSES = {
  PENDING: "pending",
  PAID: "paid",
  FAILED: "failed",
  REFUNDED: "refunded",
  PROCESSING: "processing",
} as const;

// Priorités
export const PRIORITIES = {
  LOW: "low",
  MEDIUM: "medium",
  HIGH: "high",
  URGENT: "urgent",
} as const;

// Messages d'erreur standardisés
export const ERROR_MESSAGES = {
  NETWORK_ERROR: "Erreur de connexion. Veuillez réessayer.",
  UNAUTHORIZED: "Accès non autorisé.",
  NOT_FOUND: "Élément non trouvé.",
  VALIDATION_ERROR: "Données invalides.",
  SERVER_ERROR: "Erreur serveur. Veuillez contacter le support.",
  TIMEOUT: "La requête a expiré. Veuillez réessayer.",
} as const;

// Messages de succès standardisés
export const SUCCESS_MESSAGES = {
  CREATED: "Élément créé avec succès",
  UPDATED: "Élément mis à jour avec succès",
  DELETED: "Élément supprimé avec succès",
  SENT: "Envoyé avec succès",
  SAVED: "Sauvegardé avec succès",
} as const;
