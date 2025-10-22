import React from "react";
import { Box } from "@mui/material";

import AdminLayout from "../AdminLayout";

// Hooks
import {
  usePayments,
  usePaymentManagement,
  usePaymentModals,
  usePaymentPdf,
} from "./hooks";

// Components
import {
  PaymentHeader,
  PaymentStatsSection,
  PaymentTableSection,
  PaymentModalsManager,
  createPaymentTableColumns,
  PaymentInvoicePdf,
} from "./components";
import { LoadingIndicator } from "../shared";

// Configuration
import { paymentTabConfigs } from "../shared";

// Types
import { PaymentWithDetails, PaymentStatusFilter } from "../../types/payments";

export const PaymentsPage: React.FC = () => {
  const [activeTab, setActiveTab] = React.useState(0);

  const {
    payments: paymentsData = [],
    stats,
    isLoading,
    isFetching,
    error,
    refetch,
    updatePayment,
  } = usePayments();

  const paymentManagement = usePaymentManagement();
  const modals = usePaymentModals();
  const { generatePaymentPdf, isGenerating } = usePaymentPdf();

  // Utilisation des données
  const payments = paymentsData || [];

  // Filtrage des données par onglet actuel
  const currentTabConfig = paymentTabConfigs[activeTab];
  let filteredPayments = payments;

  // Appliquer les filtres de recherche et statut
  if (paymentManagement.filters.search) {
    const searchLower = paymentManagement.filters.search.toLowerCase();
    filteredPayments = filteredPayments.filter(
      (payment) =>
        payment.id?.toLowerCase().includes(searchLower) ||
        payment.stripe_payment_intent_id?.toLowerCase().includes(searchLower) ||
        payment.payer?.first_name?.toLowerCase().includes(searchLower) ||
        payment.payer?.last_name?.toLowerCase().includes(searchLower) ||
        payment.payee?.first_name?.toLowerCase().includes(searchLower) ||
        payment.payee?.last_name?.toLowerCase().includes(searchLower) ||
        payment.service_request?.service?.title
          ?.toLowerCase()
          .includes(searchLower)
    );
  }

  if (
    paymentManagement.filters.status &&
    paymentManagement.filters.status !== "all"
  ) {
    filteredPayments = filteredPayments.filter(
      (payment) => payment.status === paymentManagement.filters.status
    );
  }

  // Filtre par montant minimum
  if (paymentManagement.filters.minAmount) {
    const minAmount = parseFloat(paymentManagement.filters.minAmount);
    if (!isNaN(minAmount)) {
      filteredPayments = filteredPayments.filter(
        (payment) => payment.amount >= minAmount
      );
    }
  }

  // Filtre par montant maximum
  if (paymentManagement.filters.maxAmount) {
    const maxAmount = parseFloat(paymentManagement.filters.maxAmount);
    if (!isNaN(maxAmount)) {
      filteredPayments = filteredPayments.filter(
        (payment) => payment.amount <= maxAmount
      );
    }
  }

  // Filtre par date de début
  if (paymentManagement.filters.dateFrom) {
    const dateFrom = new Date(paymentManagement.filters.dateFrom);
    filteredPayments = filteredPayments.filter((payment) => {
      const paymentDate = payment.created_at
        ? new Date(payment.created_at)
        : null;
      return paymentDate && paymentDate >= dateFrom;
    });
  }

  // Filtre par date de fin
  if (paymentManagement.filters.dateTo) {
    const dateTo = new Date(paymentManagement.filters.dateTo);
    filteredPayments = filteredPayments.filter((payment) => {
      const paymentDate = payment.created_at
        ? new Date(payment.created_at)
        : null;
      return paymentDate && paymentDate <= dateTo;
    });
  }

  // Filtrer par onglet actuel (si différent des filtres de statut)
  if (
    currentTabConfig &&
    currentTabConfig.key !== "all" &&
    !paymentManagement.filters.status
  ) {
    filteredPayments = filteredPayments.filter(
      (p) => p.status === currentTabConfig.key
    );
  }

  // Configuration des colonnes du tableau (comme UserManagement)
  const columns = createPaymentTableColumns({
    selectedPayments: paymentManagement.selectedPayments || [],
    onTogglePaymentSelection:
      paymentManagement.togglePaymentSelection || (() => {}),
    onViewDetails: (payment: PaymentWithDetails) => {
      console.log("🔍 View Details clicked for payment:", payment);
      modals.openPaymentDetailsModal(payment);
    },
    onDownloadPdf: async (paymentId: string) => {
      console.log("📄 Download PDF for payment:", paymentId);
      try {
        const payment = payments.find((p) => p.id === paymentId);
        if (payment) {
          await generatePaymentPdf(payment);
        } else {
          console.error("Payment not found:", paymentId);
        }
      } catch (error) {
        console.error("Error generating PDF:", error);
      }
    },
    onMarkPaid: async (paymentId: string) => {
      console.log("✅ Mark as paid:", paymentId);
      await updatePayment(paymentId, { status: "paid" });
    },
    onRefund: async (paymentId: string) => {
      console.log("🔄 Refund payment:", paymentId);
      await updatePayment(paymentId, { status: "refunded" });
    },
    onRetry: async (paymentId: string) => {
      console.log("🔄 Retry payment:", paymentId);
      // TODO: Implémenter la relance de paiement
      await updatePayment(paymentId, { status: "pending" });
    },
  });

  // =====================================================
  // GESTION DES ÉVÉNEMENTS
  // =====================================================

  const handleRefresh = () => {
    refetch();
  };

  const handleExportPayments = async () => {
    // Export les paiements sélectionnés s'il y en a, sinon tous les paiements filtrés
    if (
      paymentManagement.selectedPayments &&
      paymentManagement.selectedPayments.length > 0
    ) {
      paymentManagement.exportSelectedToCSV(filteredPayments);
    } else {
      paymentManagement.exportAllToCSV(filteredPayments);
    }
  };

  const handleTabChange = (
    event: React.MouseEvent<HTMLElement>,
    newValue: number | null
  ) => {
    if (newValue !== null) {
      setActiveTab(newValue);
    }
  };

  // Format currency helper
  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat("fr-FR", {
      style: "currency",
      currency: "EUR",
    }).format(amount);
  };

  // =====================================================
  // GESTION DES ERREURS
  // =====================================================

  if (error) {
    return (
      <LoadingIndicator
        error={error}
        onRefresh={handleRefresh}
        errorTitle="Erreur lors du chargement des paiements"
        withLayout={true}
      />
    );
  }

  // =====================================================
  // RENDU
  // =====================================================

  return (
    <AdminLayout>
      <Box sx={{ height: "100%", display: "flex", flexDirection: "column" }}>
        {/* En-tête de la page */}
        <PaymentHeader
          onRefresh={handleRefresh}
          onExport={handleExportPayments}
          isLoading={isLoading}
        />

        {/* Cartes de statistiques */}
        <PaymentStatsSection stats={stats} error={error} />

        {/* Section tableau avec filtres et onglets */}
        <PaymentTableSection
          payments={payments}
          activeTab={activeTab}
          paymentManagement={paymentManagement}
          onTabChange={handleTabChange}
          columns={columns}
          transformedData={filteredPayments}
          isLoading={isLoading}
        />

        {/* Modales Manager */}
        <PaymentModalsManager
          showPaymentDetailsModal={modals.showPaymentDetailsModal}
          selectedPayment={modals.selectedPayment}
          editForm={paymentManagement.editForm}
          onClosePaymentDetailsModal={modals.closePaymentDetailsModal}
          onSavePayment={async () => {
            // TODO: Implémenter la sauvegarde
            console.log("Save payment:", paymentManagement.editForm);
            modals.closePaymentDetailsModal();
          }}
          onMarkPaid={async (paymentId: string) => {
            await updatePayment(paymentId, { status: "paid" });
          }}
          onRefund={async (paymentId: string) => {
            await updatePayment(paymentId, { status: "refunded" });
          }}
          onDownloadPdf={async (paymentId: string) => {
            console.log("Download PDF for payment:", paymentId);
            try {
              const payment = payments.find((p) => p.id === paymentId);
              if (payment) {
                await generatePaymentPdf(payment);
              } else {
                console.error("Payment not found:", paymentId);
              }
            } catch (error) {
              console.error("Error generating PDF:", error);
            }
          }}
          onInputChange={paymentManagement.updateEditForm}
          isLoading={isLoading}
        />

        {/* Composants PDF invisibles pour la génération */}
        {payments.map((payment) => (
          <PaymentInvoicePdf
            key={`pdf-${payment.id}`}
            payment={payment}
            isVisible={false}
          />
        ))}
      </Box>
    </AdminLayout>
  );
};
