import React from 'react';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  Box,
  Typography,
  Alert,
} from '@mui/material';
import { LockReset as LockResetIcon } from '@mui/icons-material';

interface PasswordResetModalProps {
  open: boolean;
  userId: string | null;
  userEmail?: string;
  userRole?: string;
  onClose: () => void;
  onConfirm: () => void;
}

export const PasswordResetModal: React.FC<PasswordResetModalProps> = ({
  open,
  userId,
  userEmail,
  userRole,
  onClose,
  onConfirm,
}) => {
  const getDestinationInfo = () => {
    if (userRole?.toLowerCase() === 'admin') {
      return 'Le lien redirigera vers le back-office administrateur.';
    } else {
      return "Le lien redirigera vers l'application client.";
    }
  };
  return (
    <Dialog open={open} onClose={onClose} maxWidth="sm" fullWidth>
      <DialogTitle sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
        <LockResetIcon />
        Réinitialiser le mot de passe
      </DialogTitle>
      <DialogContent>
        <Box sx={{ pt: 2 }}>
          <Alert severity="warning" sx={{ mb: 2 }}>
            Cette action enverra un email de réinitialisation à l'utilisateur.
          </Alert>

          <Typography variant="body1" sx={{ mb: 2 }}>
            Êtes-vous sûr de vouloir envoyer un email de réinitialisation à :
          </Typography>

          <Typography
            variant="body2"
            sx={{
              fontWeight: 'bold',
              mb: 2,
              p: 2,
              bgcolor: 'grey.100',
              borderRadius: 1,
            }}
          >
            {userEmail || `ID utilisateur : ${userId}`}
          </Typography>

          <Typography variant="body2" color="text.secondary">
            L'utilisateur recevra un email avec les instructions pour réinitialiser son mot de
            passe. Cette action sera enregistrée dans l'historique d'audit.
          </Typography>

          <Alert severity="info" sx={{ mt: 2, mb: 1 }}>
            <strong>Destination :</strong> {getDestinationInfo()}
          </Alert>

          <Typography variant="body2" color="text.secondary" sx={{ mt: 1, fontSize: '0.75rem' }}>
            <strong>Note :</strong> Si l'email n'arrive pas, vérifiez :
            <br />• Le dossier spam/indésirables
            <br />• La configuration du serveur email
            <br />• Le statut de vérification de l'email de l'utilisateur
          </Typography>
        </Box>
      </DialogContent>
      <DialogActions sx={{ p: 3, justifyContent: 'flex-end' }}>
        <Button onClick={onClose}>Annuler</Button>
        <Button onClick={onConfirm} variant="contained" color="warning">
          Envoyer l'email
        </Button>
      </DialogActions>
    </Dialog>
  );
};
