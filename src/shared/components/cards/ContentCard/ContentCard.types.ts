import { ReactNode } from 'react';
import { BaseCardProps, TitledCardProps } from '../cards.types';

/**
 * Types pour le composant ContentCard
 */

/** Props pour le composant ContentCard */
export interface ContentCardProps extends TitledCardProps {
  /** Contenu principal de la carte */
  children: ReactNode;

  /** Footer optionnel */
  footer?: ReactNode;

  /** Avatar/icône dans le header */
  headerIcon?: ReactNode;

  /** Actions dans le header */
  headerActions?: ReactNode;

  /** Padding personnalisé */
  padding?: number;

  /** Désactiver le padding par défaut */
  disablePadding?: boolean;
}
