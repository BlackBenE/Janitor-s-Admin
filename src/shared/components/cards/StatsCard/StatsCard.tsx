import React from 'react';
import { Card, CardContent, Box, Typography, Skeleton, SvgIconProps } from '@mui/material';
import {
  TrendingUp as TrendingUpIcon,
  TrendingDown as TrendingDownIcon,
  TrendingFlat as TrendingFlatIcon,
} from '@mui/icons-material';
import { StatsCardProps } from './StatsCard.types';

/**
 * StatsCard - Composant de carte pour afficher des statistiques
 *
 * @description
 * Carte réutilisable pour afficher des métriques et statistiques avec support pour:
 * - Icône personnalisable
 * - Indicateurs de tendance (up/down/neutral)
 * - État de chargement (skeleton)
 * - Texte de progression
 * - Styles personnalisables
 *
 * @example
 * ```tsx
 * <StatsCard
 *   title="Total Revenue"
 *   value="€12,345"
 *   icon={EuroIcon}
 *   progressText="+20% from last month"
 *   showTrending={true}
 *   trendingType="up"
 * />
 * ```
 */
export const StatsCard: React.FC<StatsCardProps> = ({
  title,
  value,
  icon: Icon,
  iconColor = 'primary',
  description,
  progressText,
  bottomLeft, // Alias pour progressText (compatibilité avec InfoCard)
  showTrending = false,
  trendingType = 'neutral',
  progressTextColor = 'text.primary',
  size = 'medium',
  disabled = false,
  onClick,
  loading = false,
  variant = 'elevation',
  sx,
  className,
  id,
  'aria-label': ariaLabel,
}) => {
  // Utiliser bottomLeft si progressText n'est pas défini (compatibilité InfoCard)
  const displayProgressText = progressText || bottomLeft;

  // Déterminer l'icône de tendance
  const TrendingIcon =
    trendingType === 'up'
      ? TrendingUpIcon
      : trendingType === 'down'
        ? TrendingDownIcon
        : TrendingFlatIcon;

  // Couleur de la tendance
  const trendingColor =
    trendingType === 'up' ? 'success' : trendingType === 'down' ? 'error' : 'info';

  // Tailles des éléments selon la prop size
  const valueFontSize = size === 'small' ? 'h6' : size === 'large' ? 'h4' : 'h5';
  const titleFontSize = size === 'small' ? 'body2' : 'subtitle2';

  return (
    <Card
      id={id}
      className={className}
      aria-label={ariaLabel || title}
      onClick={disabled ? undefined : onClick}
      variant={variant}
      sx={{
        width: '100%',
        color: 'text.primary',
        background: variant === 'outlined' ? 'none' : undefined,
        borderRadius: 2,
        border: variant === 'outlined' ? 1 : undefined,
        borderColor: variant === 'outlined' ? 'divider' : undefined,
        opacity: disabled ? 0.6 : 1,
        cursor: onClick && !disabled ? 'pointer' : 'default',
        transition: 'all 0.2s ease-in-out',
        '&:hover':
          onClick && !disabled
            ? {
                boxShadow: (theme) => theme.shadows[4],
                transform: 'translateY(-2px)',
              }
            : undefined,
        ...sx,
      }}
    >
      <CardContent>
        {/* Header: Title + Icon */}
        <Box
          sx={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            mb: 1,
          }}
        >
          {loading ? (
            <Skeleton variant="text" width="60%" height={24} />
          ) : (
            <Typography variant={titleFontSize} fontWeight="bold" color="text.secondary">
              {title}
            </Typography>
          )}
          {loading ? (
            <Skeleton variant="circular" width={24} height={24} />
          ) : (
            Icon && <Icon fontSize="small" color={iconColor} />
          )}
        </Box>

        {/* Value */}
        <Box sx={{ mb: 1 }}>
          {loading ? (
            <Skeleton variant="text" width="40%" height={40} />
          ) : (
            <Typography variant={valueFontSize} fontWeight="bold">
              {value}
            </Typography>
          )}
        </Box>

        {/* Description (optional) */}
        {description && (
          <Box sx={{ mb: 1 }}>
            {loading ? (
              <Skeleton variant="text" width="80%" />
            ) : (
              <Typography variant="body2" color="text.secondary">
                {description}
              </Typography>
            )}
          </Box>
        )}

        {/* Progress Text + Trending Indicator */}
        {(displayProgressText || showTrending) && (
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
            {showTrending && !loading && (
              <TrendingIcon color={trendingColor} sx={{ fontSize: 18 }} />
            )}
            {displayProgressText &&
              (loading ? (
                <Skeleton variant="text" width="50%" />
              ) : (
                <Typography
                  variant="body2"
                  color={progressTextColor}
                  sx={{ fontSize: size === 'small' ? '0.75rem' : '0.875rem' }}
                >
                  {displayProgressText}
                </Typography>
              ))}
          </Box>
        )}
      </CardContent>
    </Card>
  );
};

export default StatsCard;
