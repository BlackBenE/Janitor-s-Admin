import { ReactNode } from 'react';
import { SvgIconProps } from '@mui/material';
import { BaseCardProps } from '../cards.types';
import { ComponentType } from 'react';

/**
 * Types pour le composant AvatarCard
 */

/** Badge à afficher sur la carte avatar */
export interface AvatarCardBadge {
  /** Label du badge */
  label: string;
  /** Icône du badge */
  icon?: ComponentType<SvgIconProps>;
  /** Couleur du badge */
  color?: 'default' | 'primary' | 'secondary' | 'error' | 'info' | 'success' | 'warning';
  /** Variante du badge */
  variant?: 'filled' | 'outlined';
}

/** Props pour le composant AvatarCard */
export interface AvatarCardProps extends BaseCardProps {
  /** URL de l'avatar */
  avatarUrl?: string | null;

  /** Initiales à afficher si pas d'URL */
  avatarInitials?: string;

  /** Nom complet de l'utilisateur */
  fullName?: string;

  /** Email de l'utilisateur */
  email?: string;

  /** Description additionnelle */
  description?: ReactNode;

  /** Badges de statut à afficher */
  badges?: AvatarCardBadge[];

  /** Taille de l'avatar */
  avatarSize?: number;

  /** Afficher le bouton d'upload */
  showUploadButton?: boolean;

  /** Callback lors du clic sur upload */
  onAvatarUpload?: () => void;

  /** Texte du bouton upload */
  uploadButtonText?: string;

  /** Actions additionnelles à afficher */
  actions?: ReactNode;
}
