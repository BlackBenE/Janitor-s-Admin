import React from 'react';
import { Card, CardContent, Avatar, Typography, Button, Box, Chip, Stack } from '@mui/material';
import { CameraAlt as CameraAltIcon } from '@mui/icons-material';
import { AvatarCardProps } from './AvatarCard.types';

/**
 * AvatarCard - Composant de carte pour afficher un profil utilisateur
 *
 * @description
 * Carte spécialisée pour afficher un avatar utilisateur avec badges et actions
 *
 * @example
 * ```tsx
 * <AvatarCard
 *   avatarUrl="/images/user.jpg"
 *   avatarInitials="JD"
 *   fullName="John Doe"
 *   email="john@example.com"
 *   badges={[
 *     { label: 'Admin', icon: AdminIcon, color: 'error' },
 *     { label: 'Verified', icon: VerifiedIcon, color: 'success' }
 *   ]}
 *   showUploadButton={true}
 *   onAvatarUpload={handleUpload}
 * />
 * ```
 */
export const AvatarCard: React.FC<AvatarCardProps> = ({
  avatarUrl,
  avatarInitials = '??',
  fullName,
  email,
  description,
  badges = [],
  avatarSize = 120,
  showUploadButton = false,
  onAvatarUpload,
  uploadButtonText,
  actions,
  variant = 'elevation',
  sx,
  className,
  id,
  'aria-label': ariaLabel,
}) => {
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
      <CardContent sx={{ textAlign: 'center', p: 3 }}>
        {/* Avatar avec bouton upload optionnel */}
        <Box sx={{ position: 'relative', display: 'inline-block', mb: 2 }}>
          <Avatar
            src={avatarUrl || undefined}
            alt={fullName || 'User avatar'}
            sx={{
              width: avatarSize,
              height: avatarSize,
              fontSize: `${avatarSize / 3}px`,
              bgcolor: 'primary.main',
            }}
          >
            {!avatarUrl && avatarInitials}
          </Avatar>

          {showUploadButton && onAvatarUpload && (
            <Button
              variant="contained"
              size="small"
              aria-label={uploadButtonText || 'Upload avatar'}
              sx={{
                position: 'absolute',
                bottom: -8,
                right: -8,
                minWidth: 'auto',
                width: 40,
                height: 40,
                borderRadius: '50%',
                p: 0,
              }}
              onClick={onAvatarUpload}
            >
              <CameraAltIcon fontSize="small" />
            </Button>
          )}
        </Box>

        {/* Nom */}
        {fullName && (
          <Typography variant="h5" component="h2" gutterBottom>
            {fullName}
          </Typography>
        )}

        {/* Email */}
        {email && (
          <Typography variant="body2" color="text.secondary" gutterBottom>
            {email}
          </Typography>
        )}

        {/* Description */}
        {description && (
          <Typography variant="body2" color="text.secondary" sx={{ mt: 1, mb: 2 }}>
            {description}
          </Typography>
        )}

        {/* Badges */}
        {badges.length > 0 && (
          <Stack
            direction="row"
            spacing={1}
            justifyContent="center"
            flexWrap="wrap"
            sx={{ mt: 2, gap: 1 }}
          >
            {badges.map((badge, index) => (
              <Chip
                key={index}
                icon={badge.icon ? <badge.icon /> : undefined}
                label={badge.label}
                color={badge.color || 'default'}
                size="small"
                variant={badge.variant || 'outlined'}
              />
            ))}
          </Stack>
        )}

        {/* Actions additionnelles */}
        {actions && <Box sx={{ mt: 2 }}>{actions}</Box>}
      </CardContent>
    </Card>
  );
};

export default AvatarCard;
