import { useState, useCallback } from "react";
import { PaymentWithDetails } from "../../../types/payments";

interface PaymentModalState {
  open: boolean;
}

interface PaymentDetailsModalState extends PaymentModalState {
  payment: PaymentWithDetails | null;
}

/**
 * Hook pour gérer l'état des modales de paiements
 */
export const usePaymentModals = () => {
  // ========================================
  // MODALES DE PAIEMENTS
  // ========================================

  const [paymentDetailsModal, setPaymentDetailsModal] =
    useState<PaymentDetailsModalState>({
      open: false,
      payment: null,
    });

  // ========================================
  // PAYMENT DETAILS MODAL
  // ========================================

  const openPaymentDetailsModal = useCallback((payment: PaymentWithDetails) => {
    setPaymentDetailsModal({ open: true, payment });
  }, []);

  const closePaymentDetailsModal = useCallback(() => {
    setPaymentDetailsModal({ open: false, payment: null });
  }, []);

  // ========================================
  // ACTIONS GLOBALES
  // ========================================

  const closeAllModals = useCallback(() => {
    closePaymentDetailsModal();
  }, [closePaymentDetailsModal]);

  const getOpenModalsCount = useCallback(() => {
    let count = 0;
    if (paymentDetailsModal.open) count++;
    return count;
  }, [paymentDetailsModal.open]);

  return {
    // Payment Details Modal
    showPaymentDetailsModal: paymentDetailsModal.open,
    selectedPayment: paymentDetailsModal.payment,
    openPaymentDetailsModal,
    closePaymentDetailsModal,

    // Actions globales
    closeAllModals,
    getOpenModalsCount,
  };
};
