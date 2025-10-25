import React from 'react';
import { Alert, AlertTitle, AlertColor, SxProps, Theme } from '@mui/material';
import type { SvgIconComponent } from '@mui/icons-material';

export interface AlertMessageProps {
  /**
   * Type/Sévérité de l'alerte (success, error, warning, info)
   */
  severity: AlertColor;

  /**
   * Message principal de l'alerte
   */
  message: string;

  /**
   * Titre optionnel de l'alerte
   */
  title?: string;

  /**
   * Code d'erreur optionnel (ex: "ERR_AUTH_001")
   */
  code?: string;

  /**
   * Icône personnalisée (composant Material-UI Icon)
   */
  icon?: SvgIconComponent;

  /**
   * Callback appelé quand l'utilisateur ferme l'alerte
   */
  onClose?: () => void;

  /**
   * Styles personnalisés
   */
  sx?: SxProps<Theme>;

  /**
   * Variant de l'alerte (standard, filled, outlined)
   */
  variant?: 'standard' | 'filled' | 'outlined';

  /**
   * Afficher l'icône par défaut
   */
  showIcon?: boolean;
}

/**
 * 🔔 Composant AlertMessage générique
 *
 * Utilisé pour afficher des messages d'information, succès, avertissement ou erreur
 * dans toute l'application. Hautement personnalisable.
 *
 * @example
 * // Message d'erreur simple
 * <AlertMessage
 *   severity="error"
 *   message="Email ou mot de passe incorrect"
 *   onClose={handleClose}
 * />
 *
 * @example
 * // Message de succès avec titre et code
 * <AlertMessage
 *   severity="success"
 *   title="Connexion réussie"
 *   message="Vous allez être redirigé..."
 *   code="AUTH_SUCCESS"
 * />
 *
 * @example
 * // Alerte warning avec icône personnalisée
 * <AlertMessage
 *   severity="warning"
 *   message="Votre session expire dans 5 minutes"
 *   icon={WarningIcon}
 *   variant="filled"
 * />
 */
export const AlertMessage: React.FC<AlertMessageProps> = ({
  severity,
  message,
  title,
  code,
  icon: CustomIcon,
  onClose,
  sx,
  variant = 'standard',
  showIcon = true,
}) => {
  // Construire le message complet avec le code si présent
  const fullMessage = code ? `[${code}] ${message}` : message;

  return (
    <Alert
      severity={severity}
      onClose={onClose}
      variant={variant}
      icon={CustomIcon ? <CustomIcon /> : showIcon ? undefined : false}
      sx={{
        ...sx,
      }}
    >
      {title && <AlertTitle>{title}</AlertTitle>}
      {fullMessage}
    </Alert>
  );
};

export default AlertMessage;
