import React from "react";
import { Box } from "@mui/material";

import AdminLayout from "../AdminLayout";

// Hooks
import { usePayments, usePaymentManagement, usePaymentStats } from "./hooks";

// Components
import {
  PaymentHeader,
  PaymentStatsSection,
  PaymentTableSection,
  PaymentLoadingIndicator,
} from "./components";

// Configuration
import { paymentTabConfigs, PaymentStatus } from "../shared";

// Types
import { PaymentWithDetails } from "../../types/payments";
import {
  createPaymentTableConfig,
  transformPaymentsForTable,
} from "./components/PaymentTableConfig";

export const PaymentsPage: React.FC = () => {
  const [activeTab, setActiveTab] = React.useState(0);

  const {
    payments: paymentsData = [],
    isLoading,
    isFetching,
    error,
    refetch,
    updatePayment,
  } = usePayments();

  const paymentManagement = usePaymentManagement();

  // Calcul des statistiques
  const payments = paymentsData || [];
  const stats = usePaymentStats(payments);

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

  // Transform pour le tableau
  const transformedData = transformPaymentsForTable(filteredPayments);

  // Configuration du tableau
  const tableConfig = createPaymentTableConfig({
    selectedInvoices: paymentManagement.selectedPayments || [],
    onToggleInvoiceSelection:
      paymentManagement.togglePaymentSelection || (() => {}),
    onViewDetails: (payment: any) => {
      console.log("View payment details:", payment);
    },
    onDownloadPdf: (paymentId: string) => {
      console.log("Download PDF for payment:", paymentId);
      // TODO: Implémenter le téléchargement PDF
    },
    onMarkPaid: async (paymentId: string) => {
      await updatePayment(paymentId, { status: "paid" });
    },
    onRefund: async (paymentId: string) => {
      await updatePayment(paymentId, { status: "refunded" });
    },
  });

  // Colonnes du tableau
  const columns = tableConfig.columns;

  // =====================================================
  // GESTION DES ÉVÉNEMENTS
  // =====================================================

  const handleRefresh = () => {
    refetch();
  };

  const handleExportPayments = async () => {
    if (paymentManagement.exportSelectedToCSV) {
      await paymentManagement.exportSelectedToCSV();
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
    return <PaymentLoadingIndicator error={error} onRefresh={handleRefresh} />;
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
        <PaymentStatsSection allPayments={payments} error={null} />

        {/* Section tableau avec filtres et onglets */}
        <PaymentTableSection
          payments={payments}
          activeTab={activeTab}
          paymentManagement={paymentManagement}
          onTabChange={handleTabChange}
          columns={columns}
          transformedData={transformedData}
          isLoading={isLoading}
        />
      </Box>
    </AdminLayout>
  );
};
