import { ReactNode } from 'react';
import { BaseCardProps, TitledCardProps, LoadableCardProps } from '../cards.types';

/**
 * Types pour le composant FormCard
 */

/** Props pour le composant FormCard */
export interface FormCardProps extends TitledCardProps, LoadableCardProps {
  /** Contenu du formulaire */
  children: ReactNode;

  /** Actions dans le header (boutons, etc.) */
  headerActions?: ReactNode;

  /** Avatar/icône dans le header */
  headerIcon?: ReactNode;

  /** Footer avec boutons submit/cancel */
  footer?: ReactNode;

  /** Fonction callback pour la soumission du formulaire */
  onSubmit?: () => void | Promise<void>;

  /** Désactiver le formulaire */
  disabled?: boolean;
}
