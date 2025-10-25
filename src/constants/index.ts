/**
 * Export centralisé des constantes de l'application
 *
 */

// Nouveaux exports par domaine (recommandé)
export { COMMON_LABELS, formatMessage as formatCommonMessage } from '@/shared/constants';
export {
  AUTH_LABELS,
  AUTH_MESSAGES,
  AUTH_ROUTES,
  SIGNIN_FORM_FIELDS,
  TWO_FACTOR_CONFIG,
} from '@/features/auth/constants';
export { USERS_LABELS } from '@/features/users/constants';
export { ANALYTICS_LABELS } from '@/features/analytics/constants';
export { FINANCIAL_LABELS } from '@/features/financial-overview/constants';
