import React from "react";
import { PaymentWithDetails } from "../../../types/payments";
import { GenericTabs } from "../../shared";
import {
  getPaymentCount,
  PaymentStatus,
  paymentTabConfigs,
} from "./PaymentTabsConfig";

interface PaymentTabsProps {
  activeTab: number;
  payments: PaymentWithDetails[];
  onTabChange: (
    event: React.MouseEvent<HTMLElement>,
    newValue: number | null
  ) => void;
}

export const PaymentTabs: React.FC<PaymentTabsProps> = ({
  activeTab,
  payments,
  onTabChange,
}) => {
  return (
    <GenericTabs<PaymentWithDetails, PaymentStatus>
      activeTab={activeTab}
      items={payments}
      tabConfigs={paymentTabConfigs}
      onTabChange={onTabChange}
      getItemCount={getPaymentCount}
      ariaLabel="payment status filter"
    />
  );
};
