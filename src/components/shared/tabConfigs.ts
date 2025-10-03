import { TabConfig } from "../shared/GenericTabs";
import { USER_TABS, UserRole } from "../../types/userManagement";
import { PROPERTY_TABS, PropertyStatus } from "../../types/propertyApprovals";
import { UserProfile } from "../../types/userManagement";

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

// Configuration des tabs pour les factures - désormais dans InvoiceTabsConfig.ts
