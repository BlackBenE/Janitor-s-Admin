import { useState } from 'react';
import {
  PaymentWithDetails,
  PaymentFilters,
  PaymentNotificationState,
} from '../../../types/payments';
import { useExport } from '@/shared/hooks';

const initialFilters: PaymentFilters = {
  search: '',
  status: '',
  dateFrom: '',
  dateTo: '',
  minAmount: '',
  maxAmount: '',
  paymentType: '',
};

const initialNotification: PaymentNotificationState = {
  open: false,
  message: '',
  severity: 'success',
};

/**
 * Hook principal pour la gestion de l'état de la page Payments Management
 */
export const usePaymentManagement = () => {
  // Hook d'export
  const { exportToCSV, commonColumns, formatters } = useExport();

  // États principaux
  const [selectedPayment, setSelectedPayment] = useState<PaymentWithDetails | null>(null);
  const [selectedPayments, setSelectedPayments] = useState<string[]>([]);
  const [editForm, setEditForm] = useState<Partial<PaymentWithDetails>>({});

  // États de l'interface
  const [filters, setFilters] = useState<PaymentFilters>(initialFilters);
  const [notification, setNotification] = useState<PaymentNotificationState>(initialNotification);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);

  // =====================================================
  // GESTION DES PAIEMENTS SÉLECTIONNÉS
  // =====================================================

  const togglePaymentSelection = (paymentId: string) => {
    setSelectedPayments((prev) =>
      prev.includes(paymentId) ? prev.filter((id) => id !== paymentId) : [...prev, paymentId]
    );
  };

  const selectAllPayments = (paymentIds: string[]) => {
    setSelectedPayments(paymentIds);
  };

  const clearSelection = () => setSelectedPayments([]);

  // =====================================================
  // GESTION DES FILTRES
  // =====================================================

  const updateFilters = (newFilters: Partial<PaymentFilters>) => {
    setFilters((prev) => ({ ...prev, ...newFilters }));
  };

  const updateFilter = (key: keyof PaymentFilters, value: string) => {
    setFilters((prev) => ({
      ...prev,
      [key]: value,
    }));
  };

  const resetFilters = () => {
    setFilters(initialFilters);
  };

  const applyStatusFilter = (status: string) => {
    setFilters((prev) => ({ ...prev, status }));
  };

  // Fonction de filtrage
  const filterPayments = (payments: PaymentWithDetails[]) => {
    return payments.filter((payment) => {
      const matchesSearch =
        !filters.search ||
        payment.id.toLowerCase().includes(filters.search.toLowerCase()) ||
        payment.payer?.email?.toLowerCase().includes(filters.search.toLowerCase()) ||
        payment.payee?.email?.toLowerCase().includes(filters.search.toLowerCase()) ||
        payment.booking?.property?.title?.toLowerCase().includes(filters.search.toLowerCase());

      const matchesStatus = !filters.status || payment.status === filters.status;

      const matchesPaymentType =
        !filters.paymentType || payment.payment_type === filters.paymentType;

      const matchesAmount =
        (!filters.minAmount || payment.amount >= parseFloat(filters.minAmount)) &&
        (!filters.maxAmount || payment.amount <= parseFloat(filters.maxAmount));

      const matchesDateRange =
        (!filters.dateFrom || new Date(payment.created_at!) >= new Date(filters.dateFrom)) &&
        (!filters.dateTo || new Date(payment.created_at!) <= new Date(filters.dateTo));

      return (
        matchesSearch && matchesStatus && matchesPaymentType && matchesAmount && matchesDateRange
      );
    });
  };

  // =====================================================
  // GESTION DES MODALS
  // =====================================================

  const openModal = (payment?: PaymentWithDetails) => {
    if (payment) setSelectedPayment(payment);
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setSelectedPayment(null);
    setIsModalOpen(false);
  };

  const openEditModal = (payment: PaymentWithDetails) => {
    setSelectedPayment(payment);
    setEditForm(payment);
    setIsEditModalOpen(true);
  };

  const closeEditModal = () => {
    setSelectedPayment(null);
    setEditForm({});
    setIsEditModalOpen(false);
  };

  const openCreateModal = () => {
    setEditForm({});
    setIsCreateModalOpen(true);
  };

  const closeCreateModal = () => {
    setEditForm({});
    setIsCreateModalOpen(false);
  };

  // =====================================================
  // GESTION DES NOTIFICATIONS
  // =====================================================

  const showNotification = (
    message: string,
    severity: 'success' | 'error' | 'warning' | 'info' = 'success'
  ) => {
    setNotification({ open: true, message, severity });
  };

  const hideNotification = () => {
    setNotification((prev) => ({ ...prev, open: false }));
  };

  // =====================================================
  // GESTION DU FORMULAIRE
  // =====================================================

  const updateEditForm = (field: string, value: any) => {
    setEditForm((prev) => ({
      ...prev,
      [field]: value,
    }));
  };

  const resetEditForm = () => {
    setEditForm({});
  };

  // =====================================================
  // ACTIONS GROUPÉES
  // =====================================================

  const exportSelectedToCSV = (allPayments: PaymentWithDetails[]) => {
    const selectedPaymentDetails = allPayments.filter((payment) =>
      selectedPayments.includes(payment.id)
    );

    if (selectedPaymentDetails.length === 0) {
      showNotification('Aucun paiement sélectionné à exporter', 'warning');
      return;
    }

    // Transformer les données pour inclure les propriétés calculées
    const transformedData = selectedPaymentDetails.map((payment) => ({
      ...payment,
      payer_name: payment.payer
        ? `${payment.payer.first_name || ''} ${payment.payer.last_name || ''}`.trim()
        : 'N/A',
      payee_name: payment.payee
        ? `${payment.payee.first_name || ''} ${payment.payee.last_name || ''}`.trim()
        : 'N/A',
      service_name: payment.service_request?.service?.title || 'Service général',
      stripe_id: payment.stripe_payment_intent_id || 'N/A',
    }));

    const columns = [
      { key: 'id', label: 'ID' },
      { key: 'stripe_id', label: 'Stripe ID' },
      { key: 'payer_name', label: 'Client' },
      { key: 'payee_name', label: 'Prestataire' },
      commonColumns.currency('amount', 'Montant'),
      { key: 'status', label: 'Statut' },
      { key: 'service_name', label: 'Service' },
      commonColumns.date('created_at', 'Date de création'),
    ];

    exportToCSV(transformedData, columns, {
      filename: `paiements_selection_${new Date().toISOString().split('T')[0]}.csv`,
    });

    showNotification(`${selectedPaymentDetails.length} paiements exportés`, 'success');
  };

  const exportAllToCSV = (allPayments: PaymentWithDetails[]) => {
    if (!allPayments || allPayments.length === 0) {
      showNotification('Aucun paiement à exporter', 'warning');
      return;
    }

    // Transformer les données pour inclure les propriétés calculées
    const transformedData = allPayments.map((payment) => ({
      ...payment,
      payer_name: payment.payer
        ? `${payment.payer.first_name || ''} ${payment.payer.last_name || ''}`.trim()
        : 'N/A',
      payee_name: payment.payee
        ? `${payment.payee.first_name || ''} ${payment.payee.last_name || ''}`.trim()
        : 'N/A',
      service_name: payment.service_request?.service?.title || 'Service général',
      stripe_id: payment.stripe_payment_intent_id || 'N/A',
    }));

    const columns = [
      { key: 'id', label: 'ID' },
      { key: 'stripe_id', label: 'Stripe ID' },
      { key: 'payer_name', label: 'Client' },
      { key: 'payee_name', label: 'Prestataire' },
      commonColumns.currency('amount', 'Montant'),
      { key: 'status', label: 'Statut' },
      { key: 'service_name', label: 'Service' },
      commonColumns.date('created_at', 'Date de création'),
    ];

    exportToCSV(transformedData, columns, {
      filename: `tous_paiements_${new Date().toISOString().split('T')[0]}.csv`,
    });

    showNotification(`${allPayments.length} paiements exportés`, 'success');
  };

  const markSelectedAsPaid = () => {
    showNotification(`${selectedPayments.length} paiements marqués comme payés`, 'success');
    clearSelection();
  };

  const refundSelectedPayments = () => {
    showNotification(`${selectedPayments.length} paiements remboursés`, 'success');
    clearSelection();
  };

  // =====================================================
  // PROPRIÉTÉS CALCULÉES
  // =====================================================

  const hasSelection = selectedPayments.length > 0;
  const hasActiveFilters = Object.entries(filters).some(
    ([key, value]) => value !== initialFilters[key as keyof PaymentFilters]
  );

  return {
    // États principaux
    selectedPayment,
    selectedPayments,
    editForm,
    filters,
    notification,
    isModalOpen,
    isEditModalOpen,
    isCreateModalOpen,

    // Actions de sélection
    togglePaymentSelection,
    selectAllPayments,
    clearSelection,

    // Actions de filtrage
    updateFilters,
    updateFilter,
    resetFilters,
    applyStatusFilter,
    filterPayments,

    // Actions de modal
    openModal,
    closeModal,
    openEditModal,
    closeEditModal,
    openCreateModal,
    closeCreateModal,

    // Actions de notification
    showNotification,
    hideNotification,

    // Actions de formulaire
    updateEditForm,
    resetEditForm,

    // Actions d'export et actions groupées
    exportSelectedToCSV,
    exportAllToCSV,
    markSelectedAsPaid,
    refundSelectedPayments,

    // Propriétés calculées
    hasSelection,
    hasActiveFilters,
  };
};
