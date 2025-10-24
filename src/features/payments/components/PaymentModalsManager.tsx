import React from "react";
import { PaymentDetailsModal } from "../modals";
import { PaymentWithDetails } from "../../../types/payments";

interface PaymentModalsManagerProps {
  // Payment Details Modal
  showPaymentDetailsModal: boolean;
  selectedPayment: PaymentWithDetails | null;
  editForm: Partial<PaymentWithDetails>;
  onClosePaymentDetailsModal: () => void;

  // Handlers
  onSavePayment: () => void;
  onMarkPaid?: (paymentId: string) => void;
  onRefund?: (paymentId: string) => void;
  onDownloadPdf?: (paymentId: string) => void;
  onInputChange: (
    field: keyof PaymentWithDetails,
    value: string | number | boolean | null
  ) => void;

  // Loading states
  isLoading?: boolean;
}

export const PaymentModalsManager: React.FC<PaymentModalsManagerProps> = ({
  // Payment Details Modal
  showPaymentDetailsModal,
  selectedPayment,
  editForm,
  onClosePaymentDetailsModal,

  // Handlers
  onSavePayment,
  onMarkPaid,
  onRefund,
  onDownloadPdf,
  onInputChange,

  // Loading states
  isLoading = false,
}) => {
  return (
    <>
      {/* Payment Details Modal */}
      <PaymentDetailsModal
        open={showPaymentDetailsModal}
        payment={selectedPayment}
        editForm={editForm}
        onClose={onClosePaymentDetailsModal}
        onSave={onSavePayment}
        onMarkPaid={onMarkPaid}
        onRefund={onRefund}
        onDownloadPdf={onDownloadPdf}
        onInputChange={onInputChange}
        isLoading={isLoading}
      />
    </>
  );
};
