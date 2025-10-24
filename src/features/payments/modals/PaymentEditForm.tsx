import React from "react";
import {
  Box,
  Typography,
  TextField,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Card,
  CardContent,
} from "@mui/material";
import { PaymentWithDetails } from "../../../types/payments";

interface PaymentEditFormProps {
  payment: PaymentWithDetails;
  editForm: Partial<PaymentWithDetails>;
  onInputChange: (
    field: keyof PaymentWithDetails,
    value: string | number | boolean | null
  ) => void;
}

export const PaymentEditForm: React.FC<PaymentEditFormProps> = ({
  payment,
  editForm,
  onInputChange,
}) => {
  return (
    <Box sx={{ display: "flex", flexDirection: "column", gap: 3 }}>
      <Typography variant="h5" gutterBottom>
        Éditer le paiement
      </Typography>

      <Card>
        <CardContent>
          <Typography variant="h6" gutterBottom>
            Informations de base
          </Typography>

          <Box sx={{ display: "flex", flexDirection: "column", gap: 3 }}>
            {/* Montant */}
            <TextField
              label="Montant"
              type="number"
              value={editForm.amount ?? payment.amount}
              onChange={(e) =>
                onInputChange("amount", parseFloat(e.target.value) || 0)
              }
              fullWidth
              InputProps={{
                startAdornment: <Typography sx={{ mr: 1 }}>€</Typography>,
              }}
            />

            {/* Statut */}
            <FormControl fullWidth>
              <InputLabel>Statut</InputLabel>
              <Select
                value={editForm.status ?? payment.status ?? "pending"}
                onChange={(e) => onInputChange("status", e.target.value)}
                label="Statut"
              >
                <MenuItem value="pending">En attente</MenuItem>
                <MenuItem value="paid">Payé</MenuItem>
                <MenuItem value="refunded">Remboursé</MenuItem>
                <MenuItem value="failed">Échoué</MenuItem>
              </Select>
            </FormControl>

            {/* Type de paiement */}
            <FormControl fullWidth>
              <InputLabel>Type de paiement</InputLabel>
              <Select
                value={
                  editForm.payment_type ?? payment.payment_type ?? "standard"
                }
                onChange={(e) => onInputChange("payment_type", e.target.value)}
                label="Type de paiement"
              >
                <MenuItem value="standard">Standard</MenuItem>
                <MenuItem value="refund">Remboursement</MenuItem>
                <MenuItem value="adjustment">Ajustement</MenuItem>
              </Select>
            </FormControl>

            {/* Devise */}
            <FormControl fullWidth>
              <InputLabel>Devise</InputLabel>
              <Select
                value={editForm.currency ?? payment.currency ?? "EUR"}
                onChange={(e) => onInputChange("currency", e.target.value)}
                label="Devise"
              >
                <MenuItem value="EUR">EUR</MenuItem>
                <MenuItem value="USD">USD</MenuItem>
                <MenuItem value="GBP">GBP</MenuItem>
              </Select>
            </FormControl>

            {/* Raison d'échec (si applicable) */}
            {(editForm.status === "failed" || payment.status === "failed") && (
              <TextField
                label="Raison de l'échec"
                multiline
                rows={3}
                value={editForm.failure_reason ?? payment.failure_reason ?? ""}
                onChange={(e) =>
                  onInputChange("failure_reason", e.target.value)
                }
                fullWidth
              />
            )}

            {/* Informations de remboursement (si applicable) */}
            {(editForm.status === "refunded" ||
              payment.status === "refunded") && (
              <>
                <TextField
                  label="Montant du remboursement"
                  type="number"
                  value={editForm.refund_amount ?? payment.refund_amount ?? 0}
                  onChange={(e) =>
                    onInputChange(
                      "refund_amount",
                      parseFloat(e.target.value) || 0
                    )
                  }
                  fullWidth
                  InputProps={{
                    startAdornment: <Typography sx={{ mr: 1 }}>€</Typography>,
                  }}
                />

                <FormControl fullWidth>
                  <InputLabel>Statut du remboursement</InputLabel>
                  <Select
                    value={
                      editForm.refund_status ??
                      payment.refund_status ??
                      "pending"
                    }
                    onChange={(e) =>
                      onInputChange("refund_status", e.target.value)
                    }
                    label="Statut du remboursement"
                  >
                    <MenuItem value="pending">En cours</MenuItem>
                    <MenuItem value="completed">Terminé</MenuItem>
                    <MenuItem value="failed">Échoué</MenuItem>
                  </Select>
                </FormControl>
              </>
            )}
          </Box>
        </CardContent>
      </Card>
    </Box>
  );
};
