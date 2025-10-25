/**
 * DataTableContainer Component
 *
 * Wrapper visuel pour les sections de tableau de données.
 * Fournit un container avec bordure, titre et description.
 *
 * @example
 * ```tsx
 * <DataTableContainer
 *   title="Tous les utilisateurs"
 *   description="Gérez les utilisateurs de toutes les catégories grâce à des vues spécialisées."
 * >
 *   <DataTableSearch ... />
 *   <DataTableTabs ... />
 *   <DataTableView ... />
 * </DataTableContainer>
 * ```
 */

import React from 'react';
import { Box, Typography } from '@mui/material';
import { DataTableContainerProps } from '../data-table.types';

export const DataTableContainer: React.FC<DataTableContainerProps> = ({
  title,
  description,
  children,
  titleLevel = 'h3',
  headerActions,
  sx,
  className,
}) => {
  const TitleComponent = titleLevel;

  return (
    <Box
      className={className}
      sx={{
        mt: 2,
        border: '1px solid',
        borderColor: 'divider',
        borderRadius: 4,
        p: 2,
        ...sx,
      }}
    >
      {/* Header Section */}
      <Box
        sx={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'flex-start',
          mb: description || headerActions ? 2 : 3,
        }}
      >
        {/* Title and Description */}
        <Box sx={{ flex: 1 }}>
          <TitleComponent
            style={{
              margin: 0,
              fontSize: titleLevel === 'h2' ? '1.5rem' : '1.25rem',
              fontWeight: 600,
              color: '#333',
            }}
          >
            {title}
          </TitleComponent>
          {description && (
            <Typography
              variant="body2"
              sx={{
                mt: 0.5,
                color: 'text.secondary',
                maxWidth: headerActions ? '70%' : '100%',
              }}
            >
              {description}
            </Typography>
          )}
        </Box>

        {/* Optional Header Actions */}
        {headerActions && <Box sx={{ ml: 2, flexShrink: 0 }}>{headerActions}</Box>}
      </Box>

      {/* Content (Search, Tabs, Table, etc.) */}
      {children}
    </Box>
  );
};
