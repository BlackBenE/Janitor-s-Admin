import React from "react";
import {
  Box,
  Typography,
  Card,
  CardContent,
  Divider,
  Chip,
} from "@mui/material";
import {
  Payment as PaymentIcon,
  Person as PersonIcon,
  Business as BusinessIcon,
  CalendarToday as CalendarIcon,
  CreditCard as CreditCardIcon,
  Receipt as ReceiptIcon,
} from "@mui/icons-material";
import { PaymentWithDetails } from "../../../types/payments";
import { formatCurrency, formatDate } from "../../../utils";

interface PaymentInfoSectionsProps {
  payment: PaymentWithDetails;
  layoutMode: "main" | "sidebar";
}

export const PaymentInfoSections: React.FC<PaymentInfoSectionsProps> = ({
  payment,
  layoutMode,
}) => {
  if (layoutMode === "sidebar") {
    return (
      <Box sx={{ display: "flex", flexDirection: "column", gap: 3 }}>
        {/* Informations du paiement */}
        <Card>
          <CardContent>
            <Box sx={{ display: "flex", alignItems: "center", gap: 1, mb: 2 }}>
              <PaymentIcon color="primary" />
              <Typography variant="h6">Informations de paiement</Typography>
            </Box>

            <Box sx={{ display: "flex", flexDirection: "column", gap: 2 }}>
              <Box>
                <Typography variant="body2" color="text.secondary" gutterBottom>
                  Montant
                </Typography>
                <Typography variant="h6" color="primary">
                  {formatCurrency(payment.amount)}
                </Typography>
              </Box>

              <Box>
                <Typography variant="body2" color="text.secondary" gutterBottom>
                  Statut
                </Typography>
                <Chip
                  label={
                    payment.status === "paid"
                      ? "Payé"
                      : payment.status === "pending"
                      ? "En attente"
                      : payment.status === "refunded"
                      ? "Remboursé"
                      : payment.status || "Statut inconnu"
                  }
                  color={
                    payment.status === "paid"
                      ? "success"
                      : payment.status === "pending"
                      ? "warning"
                      : "error"
                  }
                  size="small"
                />
              </Box>

              <Box>
                <Typography variant="body2" color="text.secondary" gutterBottom>
                  Date de création
                </Typography>
                <Typography variant="body2">
                  {formatDate(payment.created_at)}
                </Typography>
              </Box>

              {payment.processed_at && (
                <Box>
                  <Typography
                    variant="body2"
                    color="text.secondary"
                    gutterBottom
                  >
                    Date de traitement
                  </Typography>
                  <Typography variant="body2">
                    {formatDate(payment.processed_at)}
                  </Typography>
                </Box>
              )}
            </Box>
          </CardContent>
        </Card>

        {/* Informations client */}
        <Card>
          <CardContent>
            <Box sx={{ display: "flex", alignItems: "center", gap: 1, mb: 2 }}>
              <PersonIcon color="primary" />
              <Typography variant="h6">Client</Typography>
            </Box>

            <Box sx={{ display: "flex", flexDirection: "column", gap: 1 }}>
              <Typography variant="body1" fontWeight="medium">
                {payment.payer
                  ? `${payment.payer.first_name || ""} ${
                      payment.payer.last_name || ""
                    }`.trim()
                  : "Client inconnu"}
              </Typography>
              {payment.payer?.email && (
                <Typography variant="body2" color="text.secondary">
                  {payment.payer.email}
                </Typography>
              )}
            </Box>
          </CardContent>
        </Card>

        {/* Informations prestataire */}
        <Card>
          <CardContent>
            <Box sx={{ display: "flex", alignItems: "center", gap: 1, mb: 2 }}>
              <BusinessIcon color="primary" />
              <Typography variant="h6">Prestataire</Typography>
            </Box>

            <Box sx={{ display: "flex", flexDirection: "column", gap: 1 }}>
              <Typography variant="body1" fontWeight="medium">
                {payment.payment_type === "subscription"
                  ? "Paris Janitor"
                  : payment.payee
                  ? `${payment.payee.first_name || ""} ${
                      payment.payee.last_name || ""
                    }`.trim()
                  : "Prestataire inconnu"}
              </Typography>
              {payment.payee?.email && (
                <Typography variant="body2" color="text.secondary">
                  {payment.payee.email}
                </Typography>
              )}

              {payment.payment_type === "booking" && (
                <Box
                  sx={{
                    mt: 1,
                    p: 1,
                    bgcolor: "success.light",
                    borderRadius: 1,
                  }}
                >
                  <Typography variant="body2" color="success.dark">
                    Commission PJ: {formatCurrency(payment.amount * 0.2)}
                  </Typography>
                </Box>
              )}
            </Box>
          </CardContent>
        </Card>
      </Box>
    );
  }

  // Layout principal
  return (
    <Box sx={{ display: "flex", flexDirection: "column", gap: 3 }}>
      <Typography variant="h5" gutterBottom>
        Détails du paiement
      </Typography>

      <Box sx={{ display: "flex", flexDirection: "column", gap: 3 }}>
        {/* Informations générales */}
        <Card>
          <CardContent>
            <Box sx={{ display: "flex", alignItems: "center", gap: 1, mb: 2 }}>
              <ReceiptIcon color="primary" />
              <Typography variant="h6">Informations générales</Typography>
            </Box>

            <Box
              sx={{
                display: "flex",
                flexDirection: { xs: "column", sm: "row" },
                gap: 3,
              }}
            >
              <Box sx={{ flex: 1 }}>
                <Typography variant="body2" color="text.secondary" gutterBottom>
                  ID de transaction
                </Typography>
                <Typography variant="body1" fontFamily="monospace">
                  {payment.stripe_payment_intent_id || payment.id}
                </Typography>
              </Box>

              <Box sx={{ flex: 1 }}>
                <Typography variant="body2" color="text.secondary" gutterBottom>
                  Type de paiement
                </Typography>
                <Chip
                  label={payment.payment_type || "Standard"}
                  color={
                    payment.payment_type === "booking"
                      ? "primary"
                      : payment.payment_type === "subscription"
                      ? "success"
                      : payment.payment_type === "service"
                      ? "info"
                      : "default"
                  }
                  size="small"
                />
              </Box>

              <Box sx={{ flex: 1 }}>
                <Typography variant="body2" color="text.secondary" gutterBottom>
                  Devise
                </Typography>
                <Typography variant="body1">
                  {(payment.currency || "EUR").toUpperCase()}
                </Typography>
              </Box>
            </Box>
          </CardContent>
        </Card>

        {/* Informations de booking */}
        {payment.booking && (
          <Card>
            <CardContent>
              <Box
                sx={{ display: "flex", alignItems: "center", gap: 1, mb: 2 }}
              >
                <CalendarIcon color="primary" />
                <Typography variant="h6">Réservation</Typography>
              </Box>

              <Box
                sx={{
                  display: "flex",
                  flexDirection: { xs: "column", sm: "row" },
                  gap: 2,
                }}
              >
                <Box sx={{ flex: 1 }}>
                  <Typography variant="body2" color="text.secondary">
                    Propriété
                  </Typography>
                  <Typography variant="body1" fontWeight="medium">
                    {payment.booking.property?.title || "Propriété inconnue"}
                  </Typography>
                  {payment.booking.property?.address && (
                    <Typography variant="body2" color="text.secondary">
                      {payment.booking.property.address},{" "}
                      {payment.booking.property.city}
                    </Typography>
                  )}
                </Box>

                <Box sx={{ flex: 1 }}>
                  <Typography variant="body2" color="text.secondary">
                    Check-in
                  </Typography>
                  <Typography variant="body1">
                    {formatDate(payment.booking.check_in)}
                  </Typography>
                </Box>

                <Box sx={{ flex: 1 }}>
                  <Typography variant="body2" color="text.secondary">
                    Check-out
                  </Typography>
                  <Typography variant="body1">
                    {formatDate(payment.booking.check_out)}
                  </Typography>
                </Box>

                <Box sx={{ flex: 1 }}>
                  <Typography variant="body2" color="text.secondary">
                    Montant total
                  </Typography>
                  <Typography variant="body1" color="primary">
                    {formatCurrency(payment.booking.total_amount)}
                  </Typography>
                </Box>
              </Box>
            </CardContent>
          </Card>
        )}

        {/* Informations techniques - Seulement si nécessaire */}
        {(payment.stripe_charge_id || payment.failure_reason) && (
          <Card>
            <CardContent>
              <Box
                sx={{ display: "flex", alignItems: "center", gap: 1, mb: 2 }}
              >
                <CreditCardIcon color="primary" />
                <Typography variant="h6">Informations techniques</Typography>
              </Box>

              <Box
                sx={{
                  display: "flex",
                  flexDirection: { xs: "column", sm: "row" },
                  gap: 2,
                }}
              >
                {payment.stripe_charge_id && (
                  <Box sx={{ flex: 1 }}>
                    <Typography variant="body2" color="text.secondary">
                      Stripe Charge ID
                    </Typography>
                    <Typography variant="body2" fontFamily="monospace">
                      {payment.stripe_charge_id}
                    </Typography>
                  </Box>
                )}

                {payment.failure_reason && (
                  <Box sx={{ flex: 1 }}>
                    <Typography variant="body2" color="text.secondary">
                      Raison d'échec
                    </Typography>
                    <Typography variant="body2" color="error">
                      {payment.failure_reason}
                    </Typography>
                  </Box>
                )}
              </Box>
            </CardContent>
          </Card>
        )}

        {/* Informations de remboursement */}
        {payment.status === "refunded" && (
          <Card>
            <CardContent>
              <Box
                sx={{ display: "flex", alignItems: "center", gap: 1, mb: 2 }}
              >
                <CreditCardIcon color="error" />
                <Typography variant="h6" color="error">
                  Informations de remboursement
                </Typography>
              </Box>

              <Box
                sx={{
                  display: "flex",
                  flexDirection: { xs: "column", sm: "row" },
                  gap: 2,
                }}
              >
                <Box sx={{ flex: 1 }}>
                  <Typography variant="body2" color="text.secondary">
                    Montant remboursé
                  </Typography>
                  <Typography variant="body1" color="error">
                    {formatCurrency(payment.refund_amount || 0)}
                  </Typography>
                </Box>

                <Box sx={{ flex: 1 }}>
                  <Typography variant="body2" color="text.secondary">
                    Date de remboursement
                  </Typography>
                  <Typography variant="body1">
                    {formatDate(payment.refunded_at)}
                  </Typography>
                </Box>

                <Box sx={{ flex: 1 }}>
                  <Typography variant="body2" color="text.secondary">
                    Statut du remboursement
                  </Typography>
                  <Chip
                    label={payment.refund_status || "En cours"}
                    color={
                      payment.refund_status === "completed"
                        ? "success"
                        : "warning"
                    }
                    size="small"
                  />
                </Box>
              </Box>
            </CardContent>
          </Card>
        )}
      </Box>
    </Box>
  );
};
