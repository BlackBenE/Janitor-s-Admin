/**
 * DataTableTabs Component
 *
 * Onglets avec badges de comptage pour filtrer les données.
 * Utilise ToggleButtonGroup pour un affichage moderne.
 *
 * @example
 * ```tsx
 * <DataTableTabs
 *   tabs={[
 *     {
 *       key: 'all',
 *       label: 'Tous',
 *       badge: (data) => data.length,
 *       badgeColor: 'primary'
 *     },
 *     {
 *       key: 'active',
 *       label: 'Actifs',
 *       filterFn: (item) => item.status === 'active',
 *       badge: (data) => data.filter(item => item.status === 'active').length,
 *       badgeColor: 'success'
 *     },
 *   ]}
 *   activeTab={0}
 *   onTabChange={(e, value) => setActiveTab(value)}
 *   data={users}
 * />
 * ```
 */

import React from 'react';
import { Box, ToggleButtonGroup, ToggleButton, Chip } from '@mui/material';
import { DataTableTabsProps } from '../data-table.types';

export const DataTableTabs: React.FC<DataTableTabsProps> = ({
  tabs,
  activeTab,
  onTabChange,
  data = [],
  variant = 'outlined',
  size = 'medium',
  sx,
  className,
}) => {
  /**
   * Calcule la valeur du badge pour un onglet
   */
  const getBadgeValue = (tab: (typeof tabs)[0]): number => {
    if (typeof tab.badge === 'number') {
      return tab.badge;
    }
    if (typeof tab.badge === 'function') {
      return tab.badge(data);
    }
    // Si pas de badge défini mais filterFn existe, calculer automatiquement
    if (tab.filterFn && data.length > 0) {
      return data.filter(tab.filterFn).length;
    }
    return 0;
  };

  return (
    <Box className={className} sx={{ mb: 2, ...sx }}>
      <ToggleButtonGroup
        value={activeTab}
        exclusive
        onChange={onTabChange}
        size={size}
        sx={{
          display: 'flex',
          flexWrap: 'wrap',
          gap: 1,
          '& .MuiToggleButton-root': {
            border: variant === 'outlined' ? '1px solid' : 'none',
            borderColor: 'divider',
            borderRadius: 2,
            textTransform: 'none',
            px: 2,
            py: 1,
            '&.Mui-selected': {
              backgroundColor: 'primary.main',
              color: 'white',
              '&:hover': {
                backgroundColor: 'primary.dark',
              },
            },
          },
        }}
      >
        {tabs.map((tab, index) => {
          const badgeValue = getBadgeValue(tab);
          const showBadge = tab.badge !== undefined || tab.filterFn !== undefined;

          return (
            <ToggleButton
              key={tab.key}
              value={index}
              sx={{
                display: 'flex',
                alignItems: 'center',
                gap: 1,
              }}
            >
              {/* Icon (if any) */}
              {tab.icon && <Box sx={{ display: 'flex', alignItems: 'center' }}>{tab.icon}</Box>}

              {/* Label */}
              <span>{tab.label}</span>

              {/* Badge */}
              {showBadge && (
                <Chip
                  label={badgeValue}
                  size="small"
                  color={tab.badgeColor || 'default'}
                  sx={{
                    height: 20,
                    fontSize: '0.75rem',
                    fontWeight: 600,
                    ml: 0.5,
                    // Override background for selected state
                    ...(activeTab === index && {
                      backgroundColor: 'rgba(255, 255, 255, 0.3)',
                      color: 'white',
                    }),
                  }}
                />
              )}
            </ToggleButton>
          );
        })}
      </ToggleButtonGroup>
    </Box>
  );
};
