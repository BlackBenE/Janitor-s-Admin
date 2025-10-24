/**
 * Utilitaires centralisés pour la gestion des statuts, couleurs et icônes
 * Remplace toutes les fonctions getStatusColor dupliquées dans l'app
 */

// Type pour les couleurs de chip Material-UI
export type ChipColor =
  | "default"
  | "primary"
  | "secondary"
  | "error"
  | "info"
  | "success"
  | "warning";

// ======================== MAPPINGS DE STATUTS ========================

/**
 * Mappings des statuts vers couleurs pour chaque type d'entité
 */
export const STATUS_COLOR_MAPS = {
  payment: {
    paid: "success" as ChipColor,
    success: "success" as ChipColor,
    succeeded: "success" as ChipColor,
    pending: "warning" as ChipColor,
    processing: "warning" as ChipColor,
    refunded: "info" as ChipColor,
    refund: "info" as ChipColor,
    failed: "error" as ChipColor,
    error: "error" as ChipColor,
    cancelled: "error" as ChipColor,
  },

  booking: {
    confirmed: "success" as ChipColor,
    completed: "success" as ChipColor,
    pending: "warning" as ChipColor,
    cancelled: "error" as ChipColor,
    rejected: "error" as ChipColor,
  },

  service: {
    active: "success" as ChipColor,
    completed: "success" as ChipColor,
    pending: "warning" as ChipColor,
    in_progress: "warning" as ChipColor,
    cancelled: "error" as ChipColor,
    inactive: "default" as ChipColor,
  },

  subscription: {
    active: "success" as ChipColor,
    expired: "error" as ChipColor,
    pending: "warning" as ChipColor,
    cancelled: "error" as ChipColor,
  },

  property: {
    approved: "success" as ChipColor,
    pending: "warning" as ChipColor,
    rejected: "error" as ChipColor,
  },

  quote_request: {
    accepted: "success" as ChipColor,
    completed: "success" as ChipColor,
    pending: "warning" as ChipColor,
    in_progress: "info" as ChipColor,
    rejected: "error" as ChipColor,
    cancelled: "error" as ChipColor,
  },

  user_account: {
    active: "success" as ChipColor,
    locked: "error" as ChipColor,
    unverified: "warning" as ChipColor,
    deleted: "default" as ChipColor,
  },
} as const;

/**
 * Mappings des statuts vers labels lisibles en français
 */
export const STATUS_LABEL_MAPS = {
  payment: {
    paid: "Payé",
    success: "Réussi",
    succeeded: "Réussi",
    pending: "En attente",
    processing: "En cours",
    refunded: "Remboursé",
    refund: "Remboursé",
    failed: "Échoué",
    error: "Erreur",
    cancelled: "Annulé",
  },

  booking: {
    confirmed: "Confirmée",
    completed: "Terminée",
    pending: "En attente",
    cancelled: "Annulée",
    rejected: "Rejetée",
  },

  service: {
    active: "Actif",
    completed: "Terminé",
    pending: "En attente",
    in_progress: "En cours",
    cancelled: "Annulé",
    inactive: "Inactif",
  },

  subscription: {
    active: "Active",
    expired: "Expirée",
    pending: "En attente",
    cancelled: "Annulée",
  },

  property: {
    approved: "Approuvée",
    pending: "En attente",
    rejected: "Rejetée",
  },

  quote_request: {
    accepted: "Acceptée",
    completed: "Terminée",
    pending: "En attente",
    in_progress: "En cours",
    rejected: "Rejetée",
    cancelled: "Annulée",
  },

  user_account: {
    active: "Actif",
    locked: "Verrouillé",
    unverified: "Non vérifié",
    deleted: "Supprimé",
  },
} as const;

// ======================== FONCTIONS PRINCIPALES ========================

/**
 * Récupère la couleur appropriée pour un statut donné
 * @param status - Le statut à analyser
 * @param type - Le type d'entité (payment, booking, service, etc.)
 * @returns La couleur du chip Material-UI
 */
export const getStatusColor = (
  status: string | null | undefined,
  type: keyof typeof STATUS_COLOR_MAPS = "service"
): ChipColor => {
  if (!status) return "default";

  const normalizedStatus = status.toLowerCase();
  const colorMap = STATUS_COLOR_MAPS[type];

  if (colorMap && normalizedStatus in colorMap) {
    return colorMap[normalizedStatus as keyof typeof colorMap];
  }

  // Fallback sur des patterns génériques
  if (
    normalizedStatus.includes("success") ||
    normalizedStatus.includes("complete") ||
    normalizedStatus.includes("approved") ||
    normalizedStatus.includes("confirmed") ||
    normalizedStatus.includes("active") ||
    normalizedStatus.includes("paid")
  ) {
    return "success";
  }

  if (
    normalizedStatus.includes("pending") ||
    normalizedStatus.includes("processing") ||
    normalizedStatus.includes("progress")
  ) {
    return "warning";
  }

  if (
    normalizedStatus.includes("fail") ||
    normalizedStatus.includes("error") ||
    normalizedStatus.includes("cancel") ||
    normalizedStatus.includes("reject") ||
    normalizedStatus.includes("expired") ||
    normalizedStatus.includes("locked")
  ) {
    return "error";
  }

  if (
    normalizedStatus.includes("refund") ||
    normalizedStatus.includes("info")
  ) {
    return "info";
  }

  return "default";
};

/**
 * Récupère le label français pour un statut donné
 * @param status - Le statut à analyser
 * @param type - Le type d'entité
 * @returns Le label en français
 */
export const getStatusLabel = (
  status: string | null | undefined,
  type: keyof typeof STATUS_LABEL_MAPS = "service"
): string => {
  if (!status) return "Non défini";

  const normalizedStatus = status.toLowerCase();
  const labelMap = STATUS_LABEL_MAPS[type];

  if (labelMap && normalizedStatus in labelMap) {
    return labelMap[normalizedStatus as keyof typeof labelMap];
  }

  // Fallback : capitaliser la première lettre et remplacer les underscores
  return status
    .split("_")
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase())
    .join(" ");
};

/**
 * Fonction helper pour les services actifs/inactifs (boolean)
 * @param isActive - Boolean indiquant si le service est actif
 * @returns La couleur appropriée
 */
export const getActiveStatusColor = (isActive: boolean | null): ChipColor => {
  return isActive ? "success" : "error";
};

/**
 * Fonction helper pour les services actifs/inactifs (label)
 * @param isActive - Boolean indiquant si le service est actif
 * @returns Le label approprié
 */
export const getActiveStatusLabel = (isActive: boolean | null): string => {
  return isActive ? "Actif" : "Inactif";
};

// ======================== CATÉGORIES DE SERVICES ========================

/**
 * Récupère la couleur appropriée pour une catégorie de service
 * @param category - La catégorie du service
 * @returns La couleur du chip Material-UI
 */
export const getCategoryColor = (category: string | null): ChipColor => {
  if (!category) return "default";

  const normalizedCategory = category.toLowerCase();

  switch (normalizedCategory) {
    case "nettoyage":
    case "ménage":
    case "cleaning":
      return "primary";

    case "maintenance":
    case "plomberie":
    case "électricité":
    case "plumbing":
    case "electricity":
      return "info";

    case "jardinage":
    case "gardening":
      return "success";

    case "peinture":
    case "painting":
      return "warning";

    case "conciergerie":
    case "sécurité":
    case "concierge":
    case "security":
      return "secondary";

    default:
      return "default";
  }
};

// ======================== TYPES DE PAIEMENT ========================

/**
 * Récupère la couleur appropriée pour un type de paiement
 * @param paymentType - Le type de paiement
 * @returns La couleur du chip Material-UI
 */
export const getPaymentTypeColor = (paymentType: string | null): ChipColor => {
  if (!paymentType) return "default";

  const normalizedType = paymentType.toLowerCase();

  switch (normalizedType) {
    case "booking":
    case "reservation":
      return "primary";

    case "subscription":
    case "vip":
      return "secondary";

    case "service":
    case "quote":
      return "info";

    default:
      return "default";
  }
};

/**
 * Récupère le label français pour un type de paiement
 * @param paymentType - Le type de paiement
 * @returns Le label en français
 */
export const getPaymentTypeLabel = (paymentType: string | null): string => {
  if (!paymentType) return "Non défini";

  const normalizedType = paymentType.toLowerCase();

  switch (normalizedType) {
    case "booking":
      return "Réservation";
    case "subscription":
      return "Abonnement";
    case "service":
      return "Service";
    case "quote":
      return "Devis";
    default:
      return paymentType
        .split("_")
        .map(
          (word) => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase()
        )
        .join(" ");
  }
};

// ======================== HELPER POUR LE STATUT DE PAIEMENT ========================

/**
 * Alias pour getStatusColor avec type payment
 * @param status - Le statut du paiement
 * @returns La couleur appropriée
 */
export const getPaymentStatusColor = (
  status: string | null | undefined
): ChipColor => {
  return getStatusColor(status, "payment");
};

/**
 * Alias pour getStatusLabel avec type payment
 * @param status - Le statut du paiement
 * @returns Le label en français
 */
export const getPaymentStatusLabel = (
  status: string | null | undefined
): string => {
  return getStatusLabel(status, "payment");
};
