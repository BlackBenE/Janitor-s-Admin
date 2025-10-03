import { TabConfig } from "../shared/GenericTabs";
import { USER_TABS, UserRole } from "../../types/userManagement";
import { PROPERTY_TABS, PropertyStatus } from "../../types/propertyApprovals";
import { UserProfile } from "../../types/userManagement";
import { PaymentWithDetails } from "../../types/payments";
import {
  Receipt as AllIcon,
  Schedule as PendingIcon,
  CheckCircle as PaidIcon,
  Replay as RefundedIcon,
} from "@mui/icons-material";

// Configuration des tabs pour les utilisateurs
export const userTabConfigs: TabConfig<UserRole | null>[] = USER_TABS.map(
  (tab) => ({
    key: tab.role,
    label: tab.label,
    icon: tab.icon,
    color: "default" as const,
    description: tab.description,
  })
);

// Configuration des tabs pour les propriétés
export const propertyTabConfigs: TabConfig<PropertyStatus>[] =
  PROPERTY_TABS.map((tab) => ({
    key: tab.status,
    label: tab.label,
    icon: tab.icon,
    color: "default" as const,
    description: tab.description,
  }));

// Fonctions de comptage pour les utilisateurs
export const getUserCount = (
  tabKey: UserRole | null,
  users: UserProfile[]
): number => {
  if (tabKey === null) {
    return users.length; // "All Users"
  }
  return users.filter((user) => user.role === tabKey).length;
};

// Fonctions de comptage pour les propriétés
export const getPropertyCount = (
  tabKey: PropertyStatus,
  properties: any[]
): number => {
  if (tabKey === PropertyStatus.ALL) {
    return properties.length;
  }

  // Mapping des statuts
  const statusMapping: Record<PropertyStatus, string> = {
    [PropertyStatus.ALL]: "",
    [PropertyStatus.PENDING]: "pending",
    [PropertyStatus.APPROVED]: "approved",
    [PropertyStatus.REJECTED]: "rejected",
  };

  return properties.filter(
    (property) => property.validation_status === statusMapping[tabKey]
  ).length;
};

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
