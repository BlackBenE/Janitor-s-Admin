import React from 'react';
import { Box, CircularProgress, Typography } from '@mui/material';

export interface LoadingScreenProps {
  /**
   * Message à afficher sous le spinner
   */
  message?: string;

  /**
   * Taille du spinner (small, medium, large ou nombre de pixels)
   */
  size?: 'small' | 'medium' | 'large' | number;

  /**
   * Couleur du spinner
   */
  spinnerColor?: string;

  /**
   * Background du loading screen (gradient, couleur unie, etc.)
   */
  background?: string;

  /**
   * Hauteur minimale (100vh par défaut pour full-screen)
   */
  minHeight?: string;

  /**
   * Afficher en mode full-screen (avec position fixed)
   */
  fullScreen?: boolean;
}

const SPINNER_SIZES = {
  small: 40,
  medium: 60,
  large: 80,
};

/**
 * 🔄 Composant LoadingScreen générique full-page
 *
 * Utilisé pour afficher un état de chargement global sur toute la page.
 * Peut être personnalisé avec différents backgrounds, tailles, couleurs.
 *
 * @example
 * // Loading Auth avec gradient violet
 * <LoadingScreen
 *   message="Vérification de la session..."
 *   background="linear-gradient(135deg, #667eea 0%, #764ba2 100%)"
 *   spinnerColor="white"
 * />
 *
 * @example
 * // Loading simple blanc
 * <LoadingScreen message="Chargement..." />
 */
export const LoadingScreen: React.FC<LoadingScreenProps> = ({
  message,
  size = 'medium',
  spinnerColor = 'primary',
  background = 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
  minHeight = '100vh',
  fullScreen = false,
}) => {
  const spinnerSize = typeof size === 'number' ? size : SPINNER_SIZES[size];

  const containerStyles = {
    minHeight,
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    background,
    ...(fullScreen && {
      position: 'fixed' as const,
      top: 0,
      left: 0,
      right: 0,
      bottom: 0,
      zIndex: 9999,
    }),
  };

  return (
    <Box sx={containerStyles}>
      <Box sx={{ textAlign: 'center' }}>
        <CircularProgress
          size={spinnerSize}
          sx={{
            color: spinnerColor === 'primary' ? undefined : spinnerColor,
          }}
          {...(spinnerColor === 'primary' ? {} : { style: { color: spinnerColor } })}
        />
        {message && (
          <Typography
            variant="body1"
            sx={{
              mt: 2,
              color: spinnerColor === 'white' ? 'white' : 'text.primary',
              fontWeight: 500,
            }}
          >
            {message}
          </Typography>
        )}
      </Box>
    </Box>
  );
};

export default LoadingScreen;
