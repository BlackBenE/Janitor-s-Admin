/**
 * Utilities pour la logique role-aware des données financières
 */

import { UserProfile, UserActivityData } from "@/types/userManagement";

/**
 * Détermine si un utilisateur doit afficher ses gains plutôt que ses dépenses
 */
export const shouldShowEarnings = (userRole: string): boolean => {
  return (
    userRole === "service_provider" ||
    userRole === "provider" ||
    userRole === "property_owner"
  );
};

/**
 * Récupère le montant financier approprié selon le rôle
 */
export const getFinancialAmount = (
  user: UserProfile,
  activity: UserActivityData | undefined
): number => {
  if (!activity) return 0;

  return shouldShowEarnings(user.role)
    ? activity.totalEarned || 0
    : activity.totalSpent || 0;
};

/**
 * Formate le montant avec le préfixe approprié
 */
export const formatFinancialAmount = (
  user: UserProfile,
  activity: UserActivityData | undefined,
  formatCurrency: (amount: number) => string
): string => {
  const amount = getFinancialAmount(user, activity);
  const isEarnings = shouldShowEarnings(user.role) && amount > 0;

  return `${isEarnings ? "+" : ""}${formatCurrency(amount)}`;
};

/**
 * Retourne la couleur appropriée pour l'affichage financier
 */
export const getFinancialColor = (
  user: UserProfile,
  activity: UserActivityData | undefined
): string => {
  const amount = getFinancialAmount(user, activity);
  const isEarnings = shouldShowEarnings(user.role) && amount > 0;

  return isEarnings ? "success.main" : "text.primary";
};
