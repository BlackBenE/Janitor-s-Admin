import { SxProps, Theme } from '@mui/material';
import { ReactNode } from 'react';

/**
 * Types communs pour tous les composants Card
 */

/** Variantes de style pour les cartes */
export type CardVariant = 'elevation' | 'outlined';

/** Props de base partagées par toutes les cartes */
export interface BaseCardProps {
  /** Styles personnalisés Material-UI */
  sx?: SxProps<Theme>;
  /** Classe CSS personnalisée */
  className?: string;
  /** Variante visuelle de la carte */
  variant?: CardVariant;
  /** ID pour les tests et l'accessibilité */
  id?: string;
  /** Attributs ARIA pour l'accessibilité */
  'aria-label'?: string;
}

/** Props pour les cartes avec un titre */
export interface TitledCardProps extends BaseCardProps {
  /** Titre de la carte */
  title?: ReactNode;
  /** Sous-titre optionnel */
  subtitle?: ReactNode;
}

/** Props pour les cartes avec des actions */
export interface ActionableCardProps extends BaseCardProps {
  /** Actions à afficher (boutons, etc.) */
  actions?: ReactNode;
  /** Position des actions */
  actionsPosition?: 'header' | 'footer';
}

/** Props pour les cartes avec état de chargement */
export interface LoadableCardProps extends BaseCardProps {
  /** Indicateur de chargement */
  loading?: boolean;
  /** Texte à afficher pendant le chargement */
  loadingText?: string;
}

/** Props pour les cartes avec contenu enfant */
export interface ContainerCardProps extends BaseCardProps {
  /** Contenu de la carte */
  children: ReactNode;
}
