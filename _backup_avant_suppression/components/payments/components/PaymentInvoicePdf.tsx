import React from "react";
import { Box, Typography, Divider, Paper, Chip } from "@mui/material";
import { PaymentWithDetails } from "../../../types/payments";
import { PaymentPdfService } from "../services/pdfService";
import {
  getPaymentStatusLabel,
  getPaymentStatusColor,
} from "../../../utils/statusHelpers";

interface PaymentInvoicePdfProps {
  payment: PaymentWithDetails;
  isVisible?: boolean;
}

/**
 * Composant de facture/devis pour génération PDF
 * Design aligné sur les PDFs de référence du client
 */
export const PaymentInvoicePdf: React.FC<PaymentInvoicePdfProps> = ({
  payment,
  isVisible = false,
}) => {
  const tax = PaymentPdfService.calculateTax(payment.amount);
  const dueDate = payment.created_at
    ? new Date(
        new Date(payment.created_at).getTime() + 30 * 24 * 60 * 60 * 1000
      )
    : new Date();

  return (
    <Paper
      id={`invoice-${payment.id}`}
      sx={{
        position: isVisible ? "relative" : "fixed",
        top: isVisible ? 0 : "-100vh",
        left: isVisible ? 0 : "0",
        width: "210mm",
        minHeight: "297mm",
        p: 4,
        backgroundColor: "#ffffff",
        color: "#000000",
        fontFamily: '"Arial", sans-serif',
        zIndex: isVisible ? "auto" : -9999,
        visibility: isVisible ? "visible" : "hidden",
        "& *": {
          fontFamily: '"Arial", sans-serif !important',
        },
      }}
      elevation={isVisible ? 2 : 0}
    >
      {/* En-tête de la facture */}
      <Box sx={{ mb: 4, display: "flex", justifyContent: "space-between" }}>
        <Box sx={{ flex: 1 }}>
          <Typography
            variant="h4"
            sx={{
              fontWeight: "bold",
              color: "#1976d2",
              mb: 1,
            }}
          >
            FACTURE
          </Typography>
          <Typography variant="body2" color="text.secondary">
            N°{" "}
            {payment.stripe_payment_intent_id || `INV-${payment.id.slice(-8)}`}
          </Typography>
          <Typography variant="body2" color="text.secondary">
            Date:{" "}
            {PaymentPdfService.formatDateForPdf(
              payment.created_at || new Date().toISOString()
            )}
          </Typography>
          <Typography variant="body2" color="text.secondary">
            Échéance:{" "}
            {PaymentPdfService.formatDateForPdf(dueDate.toISOString())}
          </Typography>
        </Box>
        <Box sx={{ flex: 1, textAlign: "right" }}>
          <Typography variant="h6" sx={{ fontWeight: "bold", mb: 2 }}>
            Plateforme Aide
          </Typography>
          <Typography variant="body2">123 Avenue des Services</Typography>
          <Typography variant="body2">75001 Paris, France</Typography>
          <Typography variant="body2">Tél: +33 1 23 45 67 89</Typography>
          <Typography variant="body2">
            Email: contact@plateforme-aide.fr
          </Typography>
          <Typography variant="body2" sx={{ mt: 1 }}>
            SIRET: 123 456 789 00012
          </Typography>
        </Box>
      </Box>

      <Divider sx={{ mb: 4 }} />

      {/* Informations client et prestataire */}
      <Box sx={{ mb: 4, display: "flex", gap: 4 }}>
        <Box
          sx={{
            flex: 1,
            p: 2,
            border: "1px solid #e0e0e0",
            borderRadius: 1,
            backgroundColor: "#fafafa",
          }}
        >
          <Typography
            variant="h6"
            sx={{ fontWeight: "bold", mb: 2, color: "#1976d2" }}
          >
            Facturé à:
          </Typography>
          <Typography variant="body1" sx={{ fontWeight: "medium" }}>
            {payment.payer
              ? `${payment.payer.first_name} ${payment.payer.last_name}`
              : "Client"}
          </Typography>
          <Typography variant="body2" color="text.secondary">
            {payment.payer?.email}
          </Typography>
        </Box>
        <Box
          sx={{
            flex: 1,
            p: 2,
            border: "1px solid #e0e0e0",
            borderRadius: 1,
            backgroundColor: "#fafafa",
          }}
        >
          <Typography
            variant="h6"
            sx={{ fontWeight: "bold", mb: 2, color: "#1976d2" }}
          >
            Prestataire:
          </Typography>
          <Typography variant="body1" sx={{ fontWeight: "medium" }}>
            {payment.payee
              ? `${payment.payee.first_name} ${payment.payee.last_name}`
              : "Prestataire"}
          </Typography>
          <Typography variant="body2" color="text.secondary">
            {payment.payee?.email}
          </Typography>
        </Box>
      </Box>

      {/* Détails du service */}
      <Box sx={{ mb: 4 }}>
        <Typography
          variant="h6"
          sx={{ fontWeight: "bold", mb: 2, color: "#1976d2" }}
        >
          Détails du service
        </Typography>
        <Box
          sx={{
            border: "1px solid #e0e0e0",
            borderRadius: 1,
          }}
        >
          <Box sx={{ p: 2, backgroundColor: "#f5f5f5", display: "flex" }}>
            <Box sx={{ flex: 3 }}>
              <Typography variant="body2" sx={{ fontWeight: "bold" }}>
                Description
              </Typography>
            </Box>
            <Box sx={{ flex: 1, textAlign: "right" }}>
              <Typography variant="body2" sx={{ fontWeight: "bold" }}>
                Quantité
              </Typography>
            </Box>
            <Box sx={{ flex: 1, textAlign: "right" }}>
              <Typography variant="body2" sx={{ fontWeight: "bold" }}>
                Prix unitaire
              </Typography>
            </Box>
            <Box sx={{ flex: 1, textAlign: "right" }}>
              <Typography variant="body2" sx={{ fontWeight: "bold" }}>
                Total
              </Typography>
            </Box>
          </Box>
          <Divider />
          <Box sx={{ p: 2, display: "flex" }}>
            <Box sx={{ flex: 3 }}>
              <Typography variant="body2">
                {payment.service_request?.service?.title || "Service général"}
              </Typography>
              <Typography variant="caption" color="text.secondary">
                Service effectué via la plateforme
              </Typography>
            </Box>
            <Box sx={{ flex: 1, textAlign: "right" }}>
              <Typography variant="body2">1</Typography>
            </Box>
            <Box sx={{ flex: 1, textAlign: "right" }}>
              <Typography variant="body2">
                {PaymentPdfService.formatAmountForPdf(tax.amountExclTax)}
              </Typography>
            </Box>
            <Box sx={{ flex: 1, textAlign: "right" }}>
              <Typography variant="body2" sx={{ fontWeight: "medium" }}>
                {PaymentPdfService.formatAmountForPdf(tax.amountExclTax)}
              </Typography>
            </Box>
          </Box>
        </Box>
      </Box>

      {/* Récapitulatif des montants */}
      <Box sx={{ display: "flex", justifyContent: "flex-end", mb: 4 }}>
        <Box
          sx={{
            width: "33%",
            border: "1px solid #e0e0e0",
            borderRadius: 1,
            p: 2,
          }}
        >
          <Box sx={{ display: "flex", justifyContent: "space-between", mb: 1 }}>
            <Typography variant="body2">Sous-total HT:</Typography>
            <Typography variant="body2">
              {PaymentPdfService.formatAmountForPdf(tax.amountExclTax)}
            </Typography>
          </Box>
          <Box sx={{ display: "flex", justifyContent: "space-between", mb: 1 }}>
            <Typography variant="body2">TVA (20%):</Typography>
            <Typography variant="body2">
              {PaymentPdfService.formatAmountForPdf(tax.taxAmount)}
            </Typography>
          </Box>
          <Divider sx={{ my: 1 }} />
          <Box sx={{ display: "flex", justifyContent: "space-between" }}>
            <Typography variant="body1" sx={{ fontWeight: "bold" }}>
              Total TTC:
            </Typography>
            <Typography
              variant="body1"
              sx={{
                fontWeight: "bold",
                color: "#1976d2",
                fontSize: "1.1rem",
              }}
            >
              {PaymentPdfService.formatAmountForPdf(payment.amount)}
            </Typography>
          </Box>
        </Box>
      </Box>

      {/* Statut du paiement */}
      <Box sx={{ mb: 4 }}>
        <Typography
          variant="h6"
          sx={{ fontWeight: "bold", mb: 2, color: "#1976d2" }}
        >
          Statut du paiement
        </Typography>
        <Chip
          label={getPaymentStatusLabel(payment.status)}
          color={getPaymentStatusColor(payment.status)}
          sx={{ fontSize: "1rem", padding: "12px 24px", fontWeight: "bold" }}
        />
      </Box>

      {/* Mentions légales */}
      <Box
        sx={{
          mt: 6,
          pt: 3,
          borderTop: "1px solid #e0e0e0",
          backgroundColor: "#fafafa",
          p: 2,
          borderRadius: 1,
        }}
      >
        <Typography
          variant="caption"
          color="text.secondary"
          sx={{ mb: 1, display: "block" }}
        >
          <strong>Conditions de paiement:</strong> Paiement à 30 jours à compter
          de la date de facturation.
        </Typography>
        <Typography
          variant="caption"
          color="text.secondary"
          sx={{ mb: 1, display: "block" }}
        >
          <strong>Pénalités de retard:</strong> En cas de retard de paiement,
          des pénalités de 3 fois le taux légal seront appliquées.
        </Typography>
        <Typography variant="caption" color="text.secondary">
          <strong>TVA:</strong> TVA non applicable - art. 293 B du CGI (si
          micro-entreprise) ou TVA à 20% selon le statut du prestataire.
        </Typography>
      </Box>

      {/* Pied de page */}
      <Box
        sx={{
          mt: 4,
          textAlign: "center",
          borderTop: "1px solid #e0e0e0",
          pt: 2,
        }}
      >
        <Typography variant="caption" color="text.secondary">
          Plateforme Aide - Mise en relation entre particuliers et prestataires
          de services
        </Typography>
        <br />
        <Typography variant="caption" color="text.secondary">
          www.plateforme-aide.fr - contact@plateforme-aide.fr
        </Typography>
      </Box>
    </Paper>
  );
};
