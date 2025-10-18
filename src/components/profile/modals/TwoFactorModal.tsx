import React, { useState } from "react";
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
} from "@mui/material";
import { Security as SecurityIcon } from "@mui/icons-material";

interface TwoFactorModalProps {
  open: boolean;
  onClose: () => void;
}

export const TwoFactorModal: React.FC<TwoFactorModalProps> = ({
  open,
  onClose,
}) => {
  const [activeStep, setActiveStep] = useState(0);
  const [verificationCode, setVerificationCode] = useState("");

  const steps = ["Setup Instructions", "Scan QR Code", "Verify Setup"];

  const handleNext = () => {
    if (activeStep === steps.length - 1) {
      // Final step - enable 2FA
      console.log("Enabling 2FA...");
      handleClose();
    } else {
      setActiveStep((prev) => prev + 1);
    }
  };

  const handleBack = () => {
    setActiveStep((prev) => prev - 1);
  };

  const handleClose = () => {
    setActiveStep(0);
    setVerificationCode("");
    onClose();
  };

  const renderStepContent = (step: number) => {
    switch (step) {
      case 0:
        return (
          <Stack spacing={2}>
            <Alert severity="info">
              Two-factor authentication adds an extra layer of security to your
              account.
            </Alert>
            <Typography variant="body1">
              To set up 2FA, you&apos;ll need an authenticator app on your
              mobile device such as:
            </Typography>
            <Box sx={{ display: "flex", gap: 1, flexWrap: "wrap" }}>
              <Chip label="Google Authenticator" variant="outlined" />
              <Chip label="Authy" variant="outlined" />
              <Chip label="Microsoft Authenticator" variant="outlined" />
            </Box>
            <Typography variant="body2" color="text.secondary">
              Once you have an authenticator app installed, click
              &quot;Next&quot; to continue.
            </Typography>
          </Stack>
        );

      case 1:
        return (
          <Stack spacing={2} alignItems="center">
            <Typography variant="body1" textAlign="center">
              Scan this QR code with your authenticator app:
            </Typography>

            {/* Placeholder for QR Code */}
            <Box
              sx={{
                width: 200,
                height: 200,
                border: "2px dashed",
                borderColor: "grey.400",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                borderRadius: 2,
              }}
            >
              <Typography variant="body2" color="text.secondary">
                QR Code Here
              </Typography>
            </Box>

            <Alert severity="warning">
              Can&apos;t scan the QR code? Use this setup key instead:
              <Box sx={{ fontFamily: "monospace", fontSize: "0.9rem", mt: 1 }}>
                ABCD EFGH IJKL MNOP QRST UVWX YZ12 3456
              </Box>
            </Alert>
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
              onChange={(e) =>
                setVerificationCode(
                  e.target.value.replace(/\D/g, "").slice(0, 6)
                )
              }
              placeholder="123456"
              inputProps={{
                style: {
                  textAlign: "center",
                  fontSize: "1.5rem",
                  letterSpacing: "0.5rem",
                },
              }}
            />

            <Alert severity="info">
              The code refreshes every 30 seconds. Make sure to enter the
              current code.
            </Alert>
          </Stack>
        );

      default:
        return null;
    }
  };

  return (
    <Dialog open={open} onClose={handleClose} maxWidth="md" fullWidth>
      <DialogTitle>
        <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
          <SecurityIcon color="primary" />
          <Typography variant="h6">Enable Two-Factor Authentication</Typography>
        </Box>
      </DialogTitle>

      <DialogContent>
        <Box sx={{ mt: 2 }}>
          <Stepper activeStep={activeStep} sx={{ mb: 4 }}>
            {steps.map((label) => (
              <Step key={label}>
                <StepLabel>{label}</StepLabel>
              </Step>
            ))}
          </Stepper>

          {renderStepContent(activeStep)}
        </Box>
      </DialogContent>

      <DialogActions>
        <Button onClick={handleClose} variant="outlined">
          Cancel
        </Button>
        {activeStep > 0 && (
          <Button onClick={handleBack} variant="outlined">
            Back
          </Button>
        )}
        <Button
          onClick={handleNext}
          variant="contained"
          disabled={activeStep === 2 && verificationCode.length !== 6}
        >
          {activeStep === steps.length - 1 ? "Enable 2FA" : "Next"}
        </Button>
      </DialogActions>
    </Dialog>
  );
};
