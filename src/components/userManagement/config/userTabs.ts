import {
  Group as GroupIcon,
  HomeWork as PropertyIcon,
  HandymanOutlined as ServiceIcon,
  AdminPanelSettings as AdminIcon,
} from "@mui/icons-material";
import React from "react";

// Types d'utilisateurs
export enum UserRole {
  TRAVELER = "traveler",
  PROPERTY_OWNER = "property_owner",
  SERVICE_PROVIDER = "service_provider",
  ADMIN = "admin",
}

// Interface pour la configuration des onglets
export interface UserTab {
  role: UserRole | null;
  label: string;
  icon: React.ComponentType;
  description: string;
}

// Configuration des onglets
export const USER_TABS: UserTab[] = [
  {
    role: null, // Pour afficher tous les utilisateurs
    label: "All Users",
    icon: GroupIcon,
    description: "Vue d'ensemble de tous les utilisateurs",
  },
  {
    role: UserRole.TRAVELER,
    label: "Travelers",
    icon: GroupIcon,
    description: "Gestion des comptes voyageurs et leurs réservations",
  },
  {
    role: UserRole.PROPERTY_OWNER,
    label: "Property Owners",
    icon: PropertyIcon,
    description: "Gestion des propriétaires et leurs abonnements (100€/an)",
  },
  {
    role: UserRole.SERVICE_PROVIDER,
    label: "Service Providers",
    icon: ServiceIcon,
    description: "Modération des prestataires de services et vérifications",
  },
  {
    role: UserRole.ADMIN,
    label: "Admins",
    icon: AdminIcon,
    description: "Gestion des comptes administrateurs et permissions",
  },
];
