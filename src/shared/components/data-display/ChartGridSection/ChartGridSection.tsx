/**
 * ChartGridSection Component
 *
 * Composant générique pour afficher 2 graphiques côte à côte de manière responsive.
 * Utilisé dans Dashboard, Analytics et Financial Overview.
 *
 * @example
 * ```tsx
 * <ChartGridSection
 *   charts={[
 *     {
 *       title: "Revenus mensuels",
 *       subtitle: "Évolution sur 12 mois",
 *       content: <AnalyticsChart ... />,
 *     },
 *     {
 *       title: "Croissance utilisateurs",
 *       subtitle: "Nouveaux utilisateurs par mois",
 *       content: <BarCharts ... />,
 *     },
 *   ]}
 * />
 * ```
 */

import React from 'react';
import { Box, Paper, Typography } from '@mui/material';

export interface ChartConfig {
  /** Titre du graphique */
  title: string;
  /** Sous-titre / description du graphique */
  subtitle?: string;
  /** Contenu du graphique (composant React) */
  content: React.ReactNode;
  /** Utiliser Paper wrapper (default: true) */
  usePaper?: boolean;
  /** Elevation du Paper (default: 1) */
  elevation?: number;
}

export interface ChartGridSectionProps {
  /** Configuration des graphiques (max 2 recommandé) */
  charts: ChartConfig[];
  /** Espacement entre les graphiques (default: 3) */
  gap?: number;
  /** Marge bottom de la section (default: 4) */
  marginBottom?: number;
  /** Breakpoint pour passer en 2 colonnes (default: 'lg') */
  breakpoint?: 'sm' | 'md' | 'lg' | 'xl';
}

export const ChartGridSection: React.FC<ChartGridSectionProps> = ({
  charts,
  gap = 3,
  marginBottom = 4,
  breakpoint = 'lg',
}) => {
  return (
    <Box sx={{ mb: marginBottom }}>
      <Box
        sx={{
          display: 'grid',
          gridTemplateColumns: { xs: '1fr', [breakpoint]: '1fr 1fr' },
          gap,
        }}
      >
        {charts.map((chart, index) => {
          const chartContent = (
            <Box>
              {/* Titre et sous-titre */}
              {(chart.title || chart.subtitle) && (
                <Box sx={{ mb: 2 }}>
                  {chart.title && (
                    <Typography variant="h6" gutterBottom>
                      {chart.title}
                    </Typography>
                  )}
                  {chart.subtitle && (
                    <Typography variant="body2" color="text.secondary">
                      {chart.subtitle}
                    </Typography>
                  )}
                </Box>
              )}

              {/* Contenu du graphique */}
              <Box sx={{ width: '100%' }}>{chart.content}</Box>
            </Box>
          );

          // Wrapper avec Paper si demandé (par défaut)
          if (chart.usePaper !== false) {
            return (
              <Paper key={index} elevation={chart.elevation ?? 1} sx={{ p: 3 }}>
                {chartContent}
              </Paper>
            );
          }

          // Sans Paper wrapper
          return (
            <Box key={index} sx={{ p: 3 }}>
              {chartContent}
            </Box>
          );
        })}
      </Box>
    </Box>
  );
};
