import React, { useState, useEffect } from 'react';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  Typography,
  TextField,
  Alert,
  Box,
  CircularProgress,
} from '@mui/material';
import { Security as SecurityIcon } from '@mui/icons-material';

interface TwoFactorVerifyModalProps {
  open: boolean;
  isVerifying: boolean;
  error: string | null;
  onVerify: (code: string) => Promise<void>;
  onCancel: () => void;
}

export const TwoFactorVerifyModal: React.FC<TwoFactorVerifyModalProps> = ({
  open,
  isVerifying,
  error,
  onVerify,
  onCancel,
}) => {
  const [code, setCode] = useState('');

  // Reset code when modal opens
  useEffect(() => {
    if (open) {
      setCode('');
    }
  }, [open]);

  const handleVerify = async () => {
    if (code.length === 6) {
      await onVerify(code);
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && code.length === 6 && !isVerifying) {
      handleVerify();
    }
  };

  return (
    <Dialog open={open} onClose={onCancel} maxWidth="sm" fullWidth>
      <DialogTitle>
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
          <SecurityIcon color="primary" />
          <Typography variant="h6">Authentification à deux facteurs</Typography>
        </Box>
      </DialogTitle>

      <DialogContent>
        <Box sx={{ mt: 2 }}>
          <Typography variant="body1" gutterBottom>
            Entrez le code à 6 chiffres de votre application d'authentification :
          </Typography>

          <TextField
            fullWidth
            label="Code de vérification"
            value={code}
            onChange={(e) => setCode(e.target.value.replace(/\D/g, '').slice(0, 6))}
            onKeyPress={handleKeyPress}
            placeholder="123456"
            disabled={isVerifying}
            autoFocus
            sx={{ mt: 2 }}
            inputProps={{
              style: {
                textAlign: 'center',
                fontSize: '1.5rem',
                letterSpacing: '0.5rem',
              },
            }}
          />

          {error && (
            <Alert severity="error" sx={{ mt: 2 }}>
              {error}
            </Alert>
          )}

          <Alert severity="info" sx={{ mt: 2 }}>
            Le code se rafraîchit toutes les 30 secondes. Assurez-vous d'entrer le code actuel.
          </Alert>
        </Box>
      </DialogContent>

      <DialogActions>
        <Button onClick={onCancel} disabled={isVerifying} variant="outlined">
          Annuler
        </Button>
        <Button
          onClick={handleVerify}
          disabled={code.length !== 6 || isVerifying}
          variant="contained"
          startIcon={isVerifying && <CircularProgress size={20} />}
        >
          {isVerifying ? 'Vérification...' : 'Vérifier'}
        </Button>
      </DialogActions>
    </Dialog>
  );
};
