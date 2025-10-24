import { TabConfig } from "../shared/GenericTabs";
import { USER_TABS, UserRole } from "../../types/userManagement";
import { PROPERTY_TABS, PropertyStatus } from "../../types/propertyApprovals";
import { UserProfile } from "../../types/userManagement";
import { PaymentWithDetails, PaymentStatusFilter } from "../../types/payments";
import { ServiceWithDetails, ServiceStatusFilter } from "../../types/services";
import {
  Receipt as AllIcon,
  Schedule as PendingIcon,
  CheckCircle as PaidIcon,
  Replay as RefundedIcon,
  Build as ServiceIcon,
  CheckCircle as ActiveIcon,
  Block as InactiveIcon,
  Archive as ArchivedIcon,
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

// Configuration des tabs pour les paiements
export const paymentTabConfigs: TabConfig<PaymentStatusFilter>[] = [
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
    key: "succeeded",
    label: "Réussis",
    icon: PaidIcon,
    color: "success" as const,
    description: "Paiements réussis",
  },
  {
    key: "refunded",
    label: "Remboursés",
    icon: RefundedIcon,
    color: "info" as const,
    description: "Paiements remboursés",
  },
  {
    key: "failed",
    label: "Échoués",
    icon: RefundedIcon, // On peut changer l'icône si besoin
    color: "error" as const,
    description: "Paiements échoués",
  },
];

// Configuration des tabs pour les services
export const serviceTabConfigs: TabConfig<ServiceStatusFilter>[] = [
  {
    key: "all",
    label: "Tous les services",
    icon: AllIcon,
    color: "default" as const,
    description: "Tous les services",
  },
  {
    key: "active",
    label: "Actifs",
    icon: ActiveIcon,
    color: "success" as const,
    description: "Services actifs",
  },
  {
    key: "inactive",
    label: "Inactifs",
    icon: InactiveIcon,
    color: "warning" as const,
    description: "Services inactifs",
  },
  {
    key: "pending",
    label: "En attente",
    icon: PendingIcon,
    color: "warning" as const,
    description: "Services en attente de validation",
  },
  {
    key: "archived",
    label: "Archivés",
    icon: ArchivedIcon,
    color: "error" as const,
    description: "Services archivés",
  },
];

// Fonction de comptage pour les paiements
export const getPaymentCount = (
  tabKey: PaymentStatusFilter,
  payments: PaymentWithDetails[]
): number => {
  if (tabKey === "all") {
    return payments.length;
  }
  return payments.filter((payment) => payment.status === tabKey).length;
};

// Fonction de comptage pour les services
export const getServiceCount = (
  tabKey: ServiceStatusFilter,
  services: ServiceWithDetails[]
): number => {
  if (tabKey === "all") {
    return services.length;
  }

  return services.filter((service) => {
    switch (tabKey) {
      case "active":
        return service.is_active === true;
      case "inactive":
        return service.is_active === false;
      case "pending":
        // TODO: Implémenter la logique pour services en attente
        return false;
      case "archived":
        // TODO: Implémenter la logique pour services archivés
        return false;
      default:
        return false;
    }
  }).length;
};
