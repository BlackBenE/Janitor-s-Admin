import { TabConfig } from "../shared/GenericTabs";
import { PaymentWithDetails } from "../../types/payments";
import {
  Receipt as AllIcon,
  Schedule as PendingIcon,
  CheckCircle as PaidIcon,
  Replay as RefundedIcon,
} from "@mui/icons-material";

// Types pour les statuts de paiement
export type PaymentStatus = "all" | "pending" | "paid" | "refunded";

// Configuration des tabs pour les paiements
export const paymentTabConfigs: TabConfig<PaymentStatus>[] = [
  {
    key: "all",
    label: "Tous les paiements",
    icon: AllIcon,
    color: "default" as const,
    description: "Tous les paiements",
  },
  {
    key: "pending",
    label: "En attente",
    icon: PendingIcon,
    color: "warning" as const,
    description: "Paiements en attente",
  },
  {
    key: "paid",
    label: "Payés",
    icon: PaidIcon,
    color: "success" as const,
    description: "Paiements terminés",
  },
  {
    key: "refunded",
    label: "Remboursés",
    icon: RefundedIcon,
    color: "error" as const,
    description: "Paiements remboursés",
  },
];

// Fonction de comptage pour les paiements
export const getPaymentCount = (
  tabKey: PaymentStatus,
  payments: PaymentWithDetails[]
): number => {
  if (tabKey === "all") {
    return payments.length;
  }
  return payments.filter((payment) => payment.status === tabKey).length;
};
