import { ComponentType } from 'react';
import { SvgIconProps } from '@mui/material';
import { BaseCardProps } from '../cards.types';

/**
 * Types pour le composant StatsCard
 */

/** Type de tendance pour les statistiques */
export type TrendingType = 'up' | 'down' | 'neutral';

/** Variante de taille pour la carte de stats */
export type StatsCardSize = 'small' | 'medium' | 'large';

/** Props pour le composant StatsCard */
export interface StatsCardProps extends BaseCardProps {
  /** Titre/label de la statistique */
  title?: string;

  /** Valeur principale de la statistique */
  value?: string | number;

  /** Icône à afficher à côté du titre */
  icon?: ComponentType<SvgIconProps>;

  /** Couleur de l'icône */
  iconColor?: 'primary' | 'secondary' | 'success' | 'error' | 'warning' | 'info';

  /** Texte descriptif en bas de la carte */
  description?: string;

  /** Texte de progression/métrique secondaire */
  progressText?: string;

  /** Texte alternatif pour la progression (alias de progressText) */
  bottomLeft?: string;

  /** Afficher l'indicateur de tendance */
  showTrending?: boolean;

  /** Type de tendance à afficher */
  trendingType?: TrendingType;

  /** Couleur personnalisée pour le texte de progression */
  progressTextColor?: string;

  /** Taille de la carte */
  size?: StatsCardSize;

  /** Désactiver les interactions */
  disabled?: boolean;

  /** Fonction callback au clic sur la carte */
  onClick?: () => void;

  /** Afficher un skeleton loader */
  loading?: boolean;
}
