import React from "react";
import {
  Box,
  Tooltip,
  Snackbar,
  Alert,
  Typography,
  IconButton,
  CircularProgress,
  Grid,
} from "@mui/material";
import {
  Download as DownloadIcon,
  Refresh as RefreshIcon,
} from "@mui/icons-material";

import AdminLayout from "../AdminLayout";
import { PaymentActions } from "./PaymentActions";
import InfoCard from "../InfoCard";
import DashboardItem from "../DashboardItem";

// Hooks
import {
  usePayments,
  usePaymentManagement,
  usePaymentStats,
} from "../../hooks/payments";

// Configuration
import {
  paymentTabConfigs,
  getPaymentCount,
  PaymentStatus,
} from "./PaymentTabsConfig";

// Types
import { PaymentWithDetails } from "../../types/payments";
import {
  createPaymentTableConfig,
  transformPaymentsForTable,
} from "./PaymentTableConfig";
import { PaymentFiltersComponent } from "./PaymentFilters";
import { PaymentTabs } from "./PaymentTabs";
import DataTable from "../Table";

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
    return (
      <AdminLayout>
        <Box
          display="flex"
          justifyContent="center"
          alignItems="center"
          minHeight="400px"
          flexDirection="column"
          gap={2}
        >
          <Typography variant="h6" color="error">
            Erreur lors du chargement des paiements
          </Typography>
          <Typography variant="body2" color="text.secondary">
            {error.message}
          </Typography>
          <IconButton onClick={handleRefresh} color="primary">
            <RefreshIcon />
          </IconButton>
        </Box>
      </AdminLayout>
    );
  }

  // =====================================================
  // RENDU
  // =====================================================

  return (
    <AdminLayout>
      <Box sx={{ height: "100%", display: "flex", flexDirection: "column" }}>
        {/* En-tête de la page */}
        <Box
          sx={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            mb: 3,
          }}
        >
          <Typography variant="h4" component="h1" fontWeight="bold">
            Gestion des Paiements
          </Typography>

          <Box display="flex" gap={1}>
            <Tooltip title="Exporter CSV">
              <IconButton onClick={handleExportPayments} disabled={isLoading}>
                <DownloadIcon />
              </IconButton>
            </Tooltip>
            <Tooltip title="Actualiser">
              <IconButton onClick={handleRefresh} disabled={isLoading}>
                {isLoading ? <CircularProgress size={24} /> : <RefreshIcon />}
              </IconButton>
            </Tooltip>
          </Box>
        </Box>

        {/* Cartes de statistiques */}
        <Grid
          container
          spacing={3}
          sx={{ width: "100%", display: "flex", mb: 3 }}
        >
          <Grid size={{ xs: 12, sm: 6, md: 3 }}>
            <DashboardItem>
              <InfoCard
                title="Total des paiements"
                value={stats.totalPayments}
                progressText="Tous paiements"
                showTrending={false}
              />
            </DashboardItem>
          </Grid>
          <Grid size={{ xs: 12, sm: 6, md: 3 }}>
            <DashboardItem>
              <InfoCard
                title="Paiements payés"
                value={stats.paidPayments}
                progressText={`${Math.round(
                  (stats.paidPayments / stats.totalPayments) * 100
                )}% payés`}
                showTrending={false}
              />
            </DashboardItem>
          </Grid>
          <Grid size={{ xs: 12, sm: 6, md: 3 }}>
            <DashboardItem>
              <InfoCard
                title="En attente"
                value={stats.pendingPayments}
                progressText={`${Math.round(
                  (stats.pendingPayments / stats.totalPayments) * 100
                )}% en attente`}
                showTrending={false}
              />
            </DashboardItem>
          </Grid>
          <Grid size={{ xs: 12, sm: 6, md: 3 }}>
            <DashboardItem>
              <InfoCard
                title="Revenus mensuels"
                value={formatCurrency(stats.monthlyRevenue)}
                progressText="Ce mois"
                showTrending={false}
              />
            </DashboardItem>
          </Grid>
        </Grid>

        <Box sx={{ mt: 2, border: "1px solid #ddd", borderRadius: 4, p: 2 }}>
          {/* Filtres */}
          <h3>Tous les paiements</h3>
          <p>
            Gérez les paiements et leurs statuts grâce à des vues spécialisées
            par catégorie.
          </p>
          <Box sx={{ mb: 3 }}>
            <PaymentFiltersComponent
              filters={paymentManagement.filters}
              onUpdateFilter={paymentManagement.updateFilter}
              simplified={true}
            />
          </Box>

          {/* Onglets */}
          <Box sx={{ mb: 3 }}>
            <PaymentTabs
              activeTab={activeTab}
              payments={payments}
              onTabChange={handleTabChange}
            />
          </Box>

          {/* Actions et contrôles */}
          <Box
            sx={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
              mb: 3,
            }}
          >
            {/* Actions en lot pour les paiements sélectionnés */}
            {paymentManagement.hasSelection && (
              <PaymentActions
                selectedPayments={paymentManagement.selectedPayments || []}
                onBulkMarkPaid={
                  paymentManagement.markSelectedAsPaid || (() => {})
                }
                onBulkSendReminders={() =>
                  console.log("Bulk send payment reminders")
                }
                onBulkCancel={
                  paymentManagement.refundSelectedPayments || (() => {})
                }
                onBulkExport={
                  paymentManagement.exportSelectedToCSV || (() => {})
                }
              />
            )}
          </Box>

          {/* Table des paiements */}
          <DataTable columns={columns} data={transformedData} />

          {isLoading && (
            <Box sx={{ textAlign: "center", py: 2 }}>Loading...</Box>
          )}

          {transformedData.length === 0 && !isLoading && (
            <Box
              sx={{
                textAlign: "center",
                py: 4,
                color: "text.secondary",
                backgroundColor: "grey.50",
                borderRadius: 2,
                border: "1px dashed",
                borderColor: "grey.300",
              }}
            >
              <Typography variant="h6" color="text.secondary">
                Aucun paiement trouvé
              </Typography>
              <Typography variant="body2" sx={{ mt: 1 }}>
                {paymentManagement.filters.search ||
                paymentManagement.filters.status
                  ? "Aucun paiement ne correspond à vos critères de recherche."
                  : "Il n'y a pas encore de paiements dans le système."}
              </Typography>
            </Box>
          )}

          {/* Notifications */}
          {paymentManagement.notification && (
            <Snackbar
              open={paymentManagement.notification.open}
              autoHideDuration={6000}
              onClose={paymentManagement.hideNotification}
              anchorOrigin={{ vertical: "bottom", horizontal: "right" }}
            >
              <Alert
                onClose={paymentManagement.hideNotification}
                severity={paymentManagement.notification.severity}
                variant="filled"
              >
                {paymentManagement.notification.message}
              </Alert>
            </Snackbar>
          )}
        </Box>
      </Box>
    </AdminLayout>
  );
};
