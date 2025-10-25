import React, { useState, useEffect } from 'react';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  Typography,
  Box,
  Stepper,
  Step,
  StepLabel,
  Alert,
  Stack,
  TextField,
  Chip,
  CircularProgress,
} from '@mui/material';
import { Security as SecurityIcon, CheckCircle as CheckCircleIcon } from '@mui/icons-material';
import { AUTH_LABELS } from '@/features/auth/constants';
import { useTwoFactor } from '../hooks/useTwoFactor';

interface TwoFactorModalProps {
  open: boolean;
  onClose: () => void;
  isEnabled?: boolean;
}

export const TwoFactorModal: React.FC<TwoFactorModalProps> = ({
  open,
  onClose,
  isEnabled = false,
}) => {
  const [activeStep, setActiveStep] = useState(0);
  const [verificationCode, setVerificationCode] = useState('');
  const [isVerifying, setIsVerifying] = useState(false);

  const twoFactor = useTwoFactor();

  const steps = [
    AUTH_LABELS.twoFactor.steps.setup,
    AUTH_LABELS.twoFactor.steps.verify,
    AUTH_LABELS.twoFactor.steps.complete,
  ];

  // Démarrer l'enrollment quand on passe à l'étape 1
  useEffect(() => {
    if (open && activeStep === 1 && !twoFactor.enrollment && !isEnabled) {
      twoFactor.startEnrollment();
    }
  }, [activeStep, open, isEnabled]);

  const handleNext = async () => {
    if (activeStep === 2) {
      // Étape finale - vérifier le code
      if (verificationCode.length !== 6) {
        return;
      }

      setIsVerifying(true);
      try {
        const success = await twoFactor.verifyAndEnable(verificationCode);
        if (success) {
          handleClose();
        }
      } finally {
        setIsVerifying(false);
      }
    } else {
      setActiveStep((prev) => prev + 1);
    }
  };

  const handleBack = () => {
    setActiveStep((prev) => prev - 1);
  };

  const handleClose = () => {
    setActiveStep(0);
    setVerificationCode('');
    onClose();
  };

  const handleDisable = async () => {
    if (twoFactor.factors.length > 0) {
      try {
        await twoFactor.disable(twoFactor.factors[0].id);
        handleClose();
      } catch (error) {
        console.error('Erreur lors de la désactivation:', error);
      }
    }
  };

  const renderStepContent = (step: number) => {
    // Mode désactivation - afficher confirmation
    if (isEnabled) {
      return (
        <Stack spacing={2}>
          <Alert severity="warning">
            Vous êtes sur le point de désactiver l&apos;authentification à deux facteurs. Votre
            compte sera moins sécurisé.
          </Alert>
          <Typography variant="body1">Êtes-vous sûr de vouloir désactiver la 2FA ?</Typography>
        </Stack>
      );
    }

    switch (step) {
      case 0:
        return (
          <Stack spacing={2}>
            <Alert severity="info">
              Two-factor authentication adds an extra layer of security to your account.
            </Alert>
            <Typography variant="body1">
              To set up 2FA, you&apos;ll need an authenticator app on your mobile device such as:
            </Typography>
            <Box sx={{ display: 'flex', gap: 1, flexWrap: 'wrap' }}>
              <Chip label="Google Authenticator" variant="outlined" />
              <Chip label="Authy" variant="outlined" />
              <Chip label="Microsoft Authenticator" variant="outlined" />
            </Box>
            <Typography variant="body2" color="text.secondary">
              Once you have an authenticator app installed, click &quot;Next&quot; to continue.
            </Typography>
          </Stack>
        );

      case 1:
        return (
          <Stack spacing={2} alignItems="center">
            <Typography variant="body1" textAlign="center">
              Scan this QR code with your authenticator app:
            </Typography>

            {/* QR Code */}
            {twoFactor.isEnrolling ? (
              <Box sx={{ display: 'flex', justifyContent: 'center', p: 4 }}>
                <CircularProgress />
              </Box>
            ) : twoFactor.enrollment ? (
              <Box
                sx={{
                  p: 2,
                  bgcolor: 'white',
                  borderRadius: 2,
                  boxShadow: 2,
                }}
              >
                <img
                  src={twoFactor.enrollment.totp.qr_code}
                  alt="QR Code for 2FA"
                  style={{ width: 200, height: 200, display: 'block' }}
                />
              </Box>
            ) : (
              <Alert severity="error">Erreur lors de la génération du QR code</Alert>
            )}

            {twoFactor.enrollment && (
              <Alert severity="warning">
                Can&apos;t scan the QR code? Use this setup key instead:
                <Box
                  sx={{
                    fontFamily: 'monospace',
                    fontSize: '0.9rem',
                    mt: 1,
                    wordBreak: 'break-all',
                  }}
                >
                  {twoFactor.enrollment.totp.secret}
                </Box>
              </Alert>
            )}
          </Stack>
        );

      case 2:
        return (
          <Stack spacing={3}>
            <Typography variant="body1">
              Enter the 6-digit verification code from your authenticator app:
            </Typography>

            <TextField
              fullWidth
              label="Verification Code"
              value={verificationCode}
              onChange={(e) => setVerificationCode(e.target.value.replace(/\D/g, '').slice(0, 6))}
              placeholder="123456"
              disabled={isVerifying}
              inputProps={{
                style: {
                  textAlign: 'center',
                  fontSize: '1.5rem',
                  letterSpacing: '0.5rem',
                },
              }}
            />

            <Alert severity="info">
              The code refreshes every 30 seconds. Make sure to enter the current code.
            </Alert>

            {isVerifying && (
              <Box sx={{ display: 'flex', justifyContent: 'center' }}>
                <CircularProgress size={24} />
              </Box>
            )}
          </Stack>
        );

      default:
        return null;
    }
  };

  return (
    <Dialog open={open} onClose={handleClose} maxWidth="md" fullWidth>
      <DialogTitle>
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
          {isEnabled ? <SecurityIcon color="error" /> : <SecurityIcon color="primary" />}
          <Typography variant="h6">
            {isEnabled
              ? "Désactiver l'authentification à deux facteurs"
              : AUTH_LABELS.twoFactor.title}
          </Typography>
        </Box>
      </DialogTitle>

      <DialogContent>
        <Box sx={{ mt: 2 }}>
          {!isEnabled && (
            <Stepper activeStep={activeStep} sx={{ mb: 4 }}>
              {steps.map((label) => (
                <Step key={label}>
                  <StepLabel>{label}</StepLabel>
                </Step>
              ))}
            </Stepper>
          )}

          {renderStepContent(activeStep)}
        </Box>
      </DialogContent>

      <DialogActions>
        <Button onClick={handleClose} variant="outlined">
          {AUTH_LABELS.twoFactor.cancel}
        </Button>

        {isEnabled ? (
          <Button
            onClick={handleDisable}
            variant="contained"
            color="error"
            disabled={twoFactor.isLoading}
          >
            Désactiver la 2FA
          </Button>
        ) : (
          <>
            {activeStep > 0 && (
              <Button onClick={handleBack} variant="outlined">
                {AUTH_LABELS.twoFactor.back}
              </Button>
            )}
            <Button
              onClick={handleNext}
              variant="contained"
              disabled={
                (activeStep === 2 && verificationCode.length !== 6) ||
                isVerifying ||
                (activeStep === 1 && !twoFactor.enrollment)
              }
            >
              {activeStep === steps.length - 1
                ? AUTH_LABELS.twoFactor.complete
                : AUTH_LABELS.twoFactor.next}
            </Button>
          </>
        )}
      </DialogActions>
    </Dialog>
  );
};
