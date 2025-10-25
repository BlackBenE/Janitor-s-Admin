import React from 'react';
import { Box, Typography, Chip, Avatar, IconButton, Tooltip } from '@mui/material';
import {
  Close as CloseIcon,
  Verified as VerifiedIcon,
  Lock as LockIcon,
  Star as VipIcon,
} from '@mui/icons-material';
import { UserProfile } from '@/types/userManagement';
import { USERS_LABELS } from '@/features/users/constants';
import { COMMON_LABELS } from '@/shared/constants';

interface UserDetailsHeaderProps {
  user: UserProfile;
  onClose: () => void;
}

export const UserDetailsHeader: React.FC<UserDetailsHeaderProps> = ({ user, onClose }) => {
  const getRoleColor = (role: string) => {
    switch (role) {
      case 'admin':
        return 'error';
      case 'property_owner':
        return 'primary';
      case 'service_provider':
        return 'secondary';
      case 'traveler':
        return 'info';
      default:
        return 'default';
    }
  };

  const getRoleLabel = (role: string) => {
    switch (role) {
      case 'admin':
        return USERS_LABELS.roles.admin;
      case 'property_owner':
        return USERS_LABELS.roles.property_owner;
      case 'service_provider':
        return USERS_LABELS.roles.service_provider;
      case 'traveler':
        return USERS_LABELS.roles.traveler;
      default:
        return role;
    }
  };

  return (
    <Box
      sx={{
        position: 'relative',
        background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
        color: 'white',
        p: 3,
      }}
    >
      <IconButton
        onClick={onClose}
        sx={{
          position: 'absolute',
          right: 8,
          top: 8,
          color: 'white',
          backgroundColor: 'rgba(255, 255, 255, 0.1)',
          '&:hover': {
            backgroundColor: 'rgba(255, 255, 255, 0.2)',
          },
        }}
      >
        <CloseIcon />
      </IconButton>

      <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mb: 2 }}>
        <Avatar
          src={user.avatar_url || undefined}
          sx={{
            width: 64,
            height: 64,
            bgcolor: 'rgba(255, 255, 255, 0.2)',
            fontSize: '24px',
          }}
        >
          {!user.avatar_url && (user.full_name || user.email || 'U').charAt(0).toUpperCase()}
        </Avatar>
        <Box sx={{ flex: 1 }}>
          <Typography variant="h5" component="h2" gutterBottom>
            {user.full_name || USERS_LABELS.unnamedUser}
          </Typography>
          <Typography variant="body2" sx={{ opacity: 0.9, mb: 1 }}>
            {user.email}
          </Typography>
          <Box sx={{ display: 'flex', gap: 1, flexWrap: 'wrap' }}>
            <Chip
              label={getRoleLabel(user.role)}
              color={getRoleColor(user.role)}
              size="small"
              sx={{ color: 'white', fontWeight: 500 }}
            />
            {user.profile_validated && (
              <Tooltip title={USERS_LABELS.tooltips.validatedProfile}>
                <Chip
                  icon={<VerifiedIcon />}
                  label={USERS_LABELS.chips.verified}
                  color="success"
                  size="small"
                  sx={{ color: 'white' }}
                />
              </Tooltip>
            )}
            {user.vip_subscription && (
              <Tooltip title={USERS_LABELS.tooltips.vipSubscription}>
                <Chip
                  icon={<VipIcon />}
                  label="VIP"
                  color="warning"
                  size="small"
                  sx={{ color: 'white' }}
                />
              </Tooltip>
            )}
            {user.account_locked && (
              <Tooltip title={USERS_LABELS.tooltips.accountLocked}>
                <Chip
                  icon={<LockIcon />}
                  label={COMMON_LABELS.status.locked}
                  color="error"
                  size="small"
                  sx={{ color: 'white' }}
                />
              </Tooltip>
            )}
          </Box>
        </Box>
      </Box>

      <Box
        sx={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          fontSize: '0.875rem',
          opacity: 0.8,
        }}
      >
        <Typography variant="caption">
          {USERS_LABELS.details.userId}: {user.id.substring(0, 8)}...
        </Typography>
        <Typography variant="caption">
          {USERS_LABELS.details.joined}:{' '}
          {user.created_at
            ? new Date(user.created_at).toLocaleDateString('fr-FR')
            : USERS_LABELS.details.unknown}
        </Typography>
      </Box>
    </Box>
  );
};
