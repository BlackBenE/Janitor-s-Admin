import React from 'react';
import { Card, CardContent, CardHeader, CardActions, CircularProgress, Box } from '@mui/material';
import { FormCardProps } from './FormCard.types';

/**
 * FormCard - Composant de carte pour les formulaires
 *
 * @description
 * Carte optimisée pour contenir des formulaires avec header, body et footer
 *
 * @example
 * ```tsx
 * <FormCard
 *   title="Edit Profile"
 *   headerActions={<Button>Save</Button>}
 *   loading={isLoading}
 *   onSubmit={handleSubmit}
 * >
 *   <TextField label="Name" />
 *   <TextField label="Email" />
 * </FormCard>
 * ```
 */
export const FormCard: React.FC<FormCardProps> = ({
  title,
  subtitle,
  children,
  headerActions,
  headerIcon,
  footer,
  loading = false,
  loadingText = 'Loading...',
  onSubmit,
  disabled = false,
  variant = 'elevation',
  sx,
  className,
  id,
  'aria-label': ariaLabel,
}) => {
  const handleSubmit = async (e?: React.FormEvent) => {
    if (e) {
      e.preventDefault();
    }
    if (onSubmit && !loading && !disabled) {
      await onSubmit();
    }
  };

  const hasHeader = Boolean(title || subtitle || headerIcon || headerActions);
  const hasFooter = Boolean(footer);

  return (
    <Card
      id={id}
      className={className}
      aria-label={ariaLabel}
      variant={variant}
      component={onSubmit ? 'form' : 'div'}
      onSubmit={onSubmit ? handleSubmit : undefined}
      sx={{
        borderRadius: 2,
        position: 'relative',
        ...sx,
      }}
    >
      {/* Loading overlay */}
      {loading && (
        <Box
          sx={{
            position: 'absolute',
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            bgcolor: 'rgba(255, 255, 255, 0.8)',
            zIndex: 1,
            borderRadius: 2,
          }}
        >
          <CircularProgress />
        </Box>
      )}

      {hasHeader && (
        <CardHeader avatar={headerIcon} title={title} subheader={subtitle} action={headerActions} />
      )}

      <CardContent
        sx={{
          opacity: loading ? 0.5 : 1,
        }}
      >
        <fieldset disabled={disabled || loading} style={{ border: 'none', padding: 0, margin: 0 }}>
          {children}
        </fieldset>
      </CardContent>

      {hasFooter && <CardActions sx={{ px: 2, pb: 2 }}>{footer}</CardActions>}
    </Card>
  );
};

export default FormCard;
