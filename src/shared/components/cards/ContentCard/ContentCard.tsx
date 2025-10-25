import React from 'react';
import { Card, CardContent, CardHeader, CardActions } from '@mui/material';
import { ContentCardProps } from './ContentCard.types';

/**
 * ContentCard - Composant de carte générique pour du contenu
 *
 * @description
 * Carte flexible pour afficher du contenu avec header et footer optionnels
 *
 * @example
 * ```tsx
 * <ContentCard
 *   title="User Information"
 *   subtitle="Personal details"
 *   headerActions={<Button>Edit</Button>}
 * >
 *   <Typography>Content here...</Typography>
 * </ContentCard>
 * ```
 */
export const ContentCard: React.FC<ContentCardProps> = ({
  title,
  subtitle,
  children,
  footer,
  headerIcon,
  headerActions,
  padding,
  disablePadding = false,
  variant = 'elevation',
  sx,
  className,
  id,
  'aria-label': ariaLabel,
}) => {
  const hasHeader = Boolean(title || subtitle || headerIcon || headerActions);
  const hasFooter = Boolean(footer);

  return (
    <Card
      id={id}
      className={className}
      aria-label={ariaLabel}
      variant={variant}
      sx={{
        borderRadius: 2,
        ...sx,
      }}
    >
      {hasHeader && (
        <CardHeader avatar={headerIcon} title={title} subheader={subtitle} action={headerActions} />
      )}

      <CardContent
        sx={{
          p: disablePadding ? 0 : padding !== undefined ? padding : 2,
        }}
      >
        {children}
      </CardContent>

      {hasFooter && <CardActions sx={{ px: 2, pb: 2 }}>{footer}</CardActions>}
    </Card>
  );
};

export default ContentCard;
