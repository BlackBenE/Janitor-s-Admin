/**
 * PageHeader Component
 *
 * Header générique pour les pages avec titre, description et actions.
 * Utilisé en haut des pages pour fournir un contexte et des actions rapides.
 *
 * @example
 * ```tsx
 * <PageHeader
 *   title="Gestion des utilisateurs"
 *   description="Gérez tous les types d'utilisateurs sur la plateforme."
 *   actions={
 *     <>
 *       <Tooltip title="Créer">
 *         <IconButton onClick={onCreate}>
 *           <AddIcon />
 *         </IconButton>
 *       </Tooltip>
 *       <Tooltip title="Exporter">
 *         <IconButton onClick={onExport}>
 *           <DownloadIcon />
 *         </IconButton>
 *       </Tooltip>
 *     </>
 *   }
 * />
 * ```
 */

import React from 'react';
import { Box, Typography } from '@mui/material';

export interface PageHeaderProps {
  /** Titre principal de la page */
  title: string;
  /** Description/sous-titre de la page */
  description?: string;
  /** Actions (boutons, icônes) à afficher à droite */
  actions?: React.ReactNode;
  /** Niveau de titre HTML (h1-h6) */
  titleLevel?: 'h1' | 'h2' | 'h3' | 'h4' | 'h5' | 'h6';
  /** Variant MUI Typography pour le titre */
  titleVariant?: 'h1' | 'h2' | 'h3' | 'h4' | 'h5' | 'h6';
  /** Styles personnalisés */
  sx?: any;
  /** Classes CSS personnalisées */
  className?: string;
}

export const PageHeader: React.FC<PageHeaderProps> = ({
  title,
  description,
  actions,
  titleLevel = 'h1',
  titleVariant = 'h4',
  sx,
  className,
}) => {
  return (
    <Box
      className={className}
      sx={{
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        mb: 3,
        ...sx,
      }}
    >
      {/* Title and Description */}
      <Box sx={{ flex: 1 }}>
        <Typography variant={titleVariant} component={titleLevel} gutterBottom>
          {title}
        </Typography>
        {description && (
          <Typography variant="body1" color="text.secondary">
            {description}
          </Typography>
        )}
      </Box>

      {/* Actions */}
      {actions && <Box sx={{ display: 'flex', gap: 1, flexShrink: 0, ml: 2 }}>{actions}</Box>}
    </Box>
  );
};
