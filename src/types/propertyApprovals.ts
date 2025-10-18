import React from "react";
import {
  Pending as PendingIcon,
  CheckCircle as ApprovedIcon,
  Cancel as RejectedIcon,
  Visibility as ReviewIcon,
  Home as AllIcon,
} from "@mui/icons-material";
import { Property } from "./supabase";

// =====================================================
// PROPERTY STATUS & CONFIGURATION
// =====================================================
export enum PropertyStatus {
  ALL = "all",
  PENDING = "pending",
  APPROVED = "approved",
  REJECTED = "rejected",
}

export interface PropertyTab {
  status: PropertyStatus;
  label: string;
  icon: React.ComponentType;
  description: string;
}

// Configuration des onglets pour les propriétés
export const PROPERTY_TABS: PropertyTab[] = [
  {
    status: PropertyStatus.ALL,
    label: "All Properties",
    icon: AllIcon,
    description: "Vue d'ensemble de toutes les propriétés",
  },
  {
    status: PropertyStatus.PENDING,
    label: "Pending",
    icon: PendingIcon,
    description: "Propriétés en attente d'approbation",
  },
  {
    status: PropertyStatus.APPROVED,
    label: "Approved",
    icon: ApprovedIcon,
    description: "Propriétés approuvées et publiées",
  },
  {
    status: PropertyStatus.REJECTED,
    label: "Rejected",
    icon: RejectedIcon,
    description: "Propriétés rejetées",
  },
];

// =====================================================
// PROPERTY TYPES - Directement depuis Supabase
// =====================================================

// Utilisation directe des types Supabase
export type { Property } from "./supabase";

// Type de validation basé sur le champ validation_status de Supabase (string | null)
export type ValidationStatus = string | null;

export interface PropertyWithOwner extends Property {
  profiles?: {
    id: string;
    full_name: string | null;
    email: string;
    phone?: string | null;
  };
  owner?: {
    id: string;
    first_name: string | null;
    last_name: string | null;
    email: string;
    phone: string | null;
  };
  validator?: {
    id: string;
    first_name: string | null;
    last_name: string | null;
    email: string;
  };
}

// =====================================================
// ADMIN ACTIONS
// =====================================================
export interface PropertyAdminAction {
  id: string;
  validatedBy: string;
  moderationNotes?: string;
}

export interface PropertyModerationData {
  validation_status: string | null; // Basé sur le schéma Supabase
  validated_at: string;
  validated_by: string;
  updated_at: string;
  moderation_notes?: string;
}

// =====================================================
// FILTERS
// =====================================================
export interface PropertyFilters {
  search: string;
  status: string;
  city: string;
  country: string;
  minPrice: string;
  maxPrice: string;
}

// =====================================================
// STATS
// =====================================================
export interface PropertyStats {
  total: number;
  pending: number;
  approved: number;
  rejected: number;
  underReview: number;
  averageProcessingTime: number; // en jours
  monthlySubmissions: number;
}

// =====================================================
// NOTIFICATIONS
// =====================================================
export interface PropertyNotificationState {
  open: boolean;
  message: string;
  severity: "success" | "error" | "warning" | "info";
}
