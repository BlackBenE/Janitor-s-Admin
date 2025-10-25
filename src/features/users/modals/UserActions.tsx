import React from 'react';
import { Box, Button, Divider } from '@mui/material';
import {
  Edit as EditIcon,
  Block as BlockIcon,
  Delete as DeleteIcon,
  LockReset as LockResetIcon,
  Shield as ShieldIcon,
  Restore as RestoreIcon,
} from '@mui/icons-material';
import { UserProfile, UserProfileWithAnonymization } from '@/types/userManagement';

interface UserActionsProps {
  user: UserProfileWithAnonymization;
  onClose: () => void;
  onEditUser?: () => void;
  onSuspend?: () => void;
  onDelete?: () => void;
  onSmartDelete?: () => void; // Nouvelle action pour suppression intelligente
  onRestore?: () => void; // Nouvelle action pour restauration
  onSecurityActions?: () => void;
  onSaveEdit?: () => void;
  onCancelEdit?: () => void;
  isEditMode?: boolean;
  isLoading?: boolean;
}

export const UserActions: React.FC<UserActionsProps> = ({
  user,
  onClose,
  onEditUser,
  onSuspend,
  onDelete,
  onSmartDelete,
  onRestore,
  onSecurityActions,
  onSaveEdit,
  onCancelEdit,
  isEditMode = false,
  isLoading = false,
}) => {
  if (isEditMode) {
    return (
      <Box
        sx={{
          display: 'flex',
          justifyContent: 'flex-end',
          alignItems: 'center',
          gap: 1,
          p: 2,
          borderTop: 1,
          borderColor: 'divider',
          bgcolor: 'grey.50',
        }}
      >
        <Button onClick={onCancelEdit} disabled={isLoading}>
          Annuler
        </Button>
        <Button onClick={onSaveEdit} variant="contained" disabled={isLoading}>
          {isLoading ? 'Enregistrement...' : 'Enregistrer'}
        </Button>
      </Box>
    );
  }

  return (
    <Box
      sx={{
        display: 'flex',
        justifyContent: 'flex-end',
        alignItems: 'center',
        gap: 1,
        p: 2,
        borderTop: 1,
        borderColor: 'divider',
        bgcolor: 'grey.50',
      }}
    >
      <Button onClick={onClose}>Fermer</Button>

      {/* Actions pour utilisateur supprimé */}
      {user.deleted_at && onRestore && (
        <Button
          startIcon={<RestoreIcon />}
          onClick={onRestore}
          color="success"
          variant="contained"
          size="small"
        >
          Restaurer
        </Button>
      )}

      {/* Actions pour utilisateur actif uniquement */}
      {!user.deleted_at && (
        <>
          {onSecurityActions && (
            <Button
              startIcon={<LockResetIcon />}
              onClick={onSecurityActions}
              color="primary"
              variant="outlined"
              size="small"
            >
              Réinitialiser mot de passe
            </Button>
          )}

          {onEditUser && (
            <Button
              startIcon={<EditIcon />}
              onClick={onEditUser}
              color="primary"
              variant="outlined"
              size="small"
            >
              Modifier
            </Button>
          )}

          {onSuspend && (
            <Button
              startIcon={<BlockIcon />}
              onClick={onSuspend}
              color="warning"
              variant="outlined"
              size="small"
            >
              {user.account_locked ? 'Débloquer' : 'Bloquer'}
            </Button>
          )}

          {/* Suppression intelligente avec anonymisation RGPD */}
          {onSmartDelete && (
            <Button
              startIcon={<ShieldIcon />}
              onClick={onSmartDelete}
              color="warning"
              variant="outlined"
              size="small"
            >
              Suppression RGPD
            </Button>
          )}

          {onDelete && (
            <Button
              startIcon={<DeleteIcon />}
              onClick={onDelete}
              color="error"
              variant="outlined"
              size="small"
            >
              Supprimer
            </Button>
          )}
        </>
      )}
    </Box>
  );
};
