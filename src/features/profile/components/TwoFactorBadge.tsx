import React from 'react';
import { Chip, Tooltip } from '@mui/material';
import { VerifiedUser as VerifiedIcon } from '@mui/icons-material';

interface TwoFactorBadgeProps {
  enabled: boolean;
}

export const TwoFactorBadge: React.FC<TwoFactorBadgeProps> = ({ enabled }) => {
  if (!enabled) return null;

  return (
    <Tooltip title="Authentification à deux facteurs activée">
      <Chip
        icon={<VerifiedIcon />}
        label="2FA Activée"
        color="success"
        size="small"
        variant="outlined"
        sx={{ mt: 1 }}
      />
    </Tooltip>
  );
};
