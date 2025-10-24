/**
 * Utilitaires de formatage centralisés
 * Remplace toutes les fonctions formatCurrency et formatDate dupliquées
 */

/**
 * Formate un montant en euros
 */
export const formatCurrency = (amount: number): string => {
  return new Intl.NumberFormat("fr-FR", {
    style: "currency",
    currency: "EUR",
  }).format(amount);
};

/**
 * Formate une date en français
 */
export const formatDate = (
  dateString: string | null,
  options?: Intl.DateTimeFormatOptions
): string => {
  if (!dateString) return "N/A";

  const defaultOptions: Intl.DateTimeFormatOptions = {
    year: "numeric",
    month: "short",
    day: "numeric",
    ...options,
  };

  return new Date(dateString).toLocaleDateString("fr-FR", defaultOptions);
};

/**
 * Formate une date pour PDF (format spécifique)
 */
export const formatDateForPdf = (dateString: string): string => {
  return formatDate(dateString, {
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
  });
};

/**
 * Formate un montant financier avec signe (+ pour earnings, - pour dépenses)
 */
export const formatFinancialAmount = (
  amount: number,
  isEarnings: boolean = false
): string => {
  const prefix = isEarnings ? "+" : "";
  return `${prefix}${formatCurrency(amount)}`;
};

/**
 * Formate un numéro de téléphone français
 */
export const formatPhoneNumber = (phone: string | null): string => {
  if (!phone) return "N/A";
  // Format français basique : 01.23.45.67.89
  return phone.replace(/(\d{2})(\d{2})(\d{2})(\d{2})(\d{2})/, "$1.$2.$3.$4.$5");
};

/**
 * Formate un email (masquage partiel pour la confidentialité)
 */
export const formatEmailForDisplay = (
  email: string,
  mask: boolean = false
): string => {
  if (!mask) return email;

  const [localPart, domain] = email.split("@");
  const maskedLocal =
    localPart.length > 2
      ? `${localPart[0]}***${localPart[localPart.length - 1]}`
      : localPart;

  return `${maskedLocal}@${domain}`;
};

/**
 * Formate une durée en texte lisible
 */
export const formatDuration = (minutes: number): string => {
  if (minutes < 60) return `${minutes}min`;

  const hours = Math.floor(minutes / 60);
  const remainingMinutes = minutes % 60;

  if (remainingMinutes === 0) return `${hours}h`;
  return `${hours}h${remainingMinutes}min`;
};

/**
 * Formate un statut avec couleur et libellé
 */
export const formatStatus = (
  status: string,
  statusMap: Record<string, { label: string; color: string }>
) => {
  return statusMap[status] || { label: status, color: "default" };
};

/**
 * Formate un nombre avec séparateurs de milliers
 */
export const formatNumber = (num: number, decimals: number = 0): string => {
  return new Intl.NumberFormat("fr-FR", {
    minimumFractionDigits: decimals,
    maximumFractionDigits: decimals,
  }).format(num);
};

/**
 * Formate un pourcentage
 */
export const formatPercentage = (
  value: number,
  decimals: number = 1
): string => {
  return new Intl.NumberFormat("fr-FR", {
    style: "percent",
    minimumFractionDigits: decimals,
    maximumFractionDigits: decimals,
  }).format(value / 100);
};
