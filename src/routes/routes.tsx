import React from "react";
import { SvgIconTypeMap } from "@mui/material";
import { OverridableComponent } from "@mui/material/OverridableComponent";
import DashboardPage from "../pages/dashboardPage";
import FinancialOverviewPage from "../pages/financialOverviewPage";
import InvoicesPage from "../pages/InvoicesPage";
import AuthPage from "../pages/authPage";
import ProfilePage from "../pages/profilePage";
import PropertyApprovalsPage from "../pages/propertyApprovalsPage";
import ProvidersModerationPage from "../pages/providersModerationPage";
import QuoteRequestsPage from "../pages/quoteRequestsPage";
import ServicesCatalogPage from "../pages/servicesCatalogPage";
import SettingsPage from "../pages/settingsPage";
import UserManagementPage from "../pages/userManagementPage";
import ProtectedRoute from "../components/ProtectedRoute";
import AppsOutlinedIcon from "@mui/icons-material/AppsOutlined";
import ApartmentOutlinedIcon from "@mui/icons-material/ApartmentOutlined";
import HowToRegOutlinedIcon from "@mui/icons-material/HowToRegOutlined";
import GroupOutlinedIcon from "@mui/icons-material/GroupOutlined";
import EuroOutlinedIcon from "@mui/icons-material/EuroOutlined";
import MedicalInformationOutlinedIcon from "@mui/icons-material/MedicalInformationOutlined";
import SettingsOutlinedIcon from "@mui/icons-material/SettingsOutlined";
import ChatBubbleOutlineOutlinedIcon from "@mui/icons-material/ChatBubbleOutlineOutlined";
import DescriptionOutlinedIcon from "@mui/icons-material/DescriptionOutlined";

interface Route {
  path: string;
  element: React.ReactElement;
  icon?: OverridableComponent<SvgIconTypeMap<object, "svg">> & {
    muiName: string;
  };
  protected?: boolean;
}

export const routes: Route[] = [
  {
    path: "/dashboard",
    element: (
      <ProtectedRoute>
        <DashboardPage />
      </ProtectedRoute>
    ),
    icon: AppsOutlinedIcon,
    protected: true,
  },
  {
    path: "/property-approvals",
    element: (
      <ProtectedRoute>
        <PropertyApprovalsPage />
      </ProtectedRoute>
    ),
    icon: ApartmentOutlinedIcon,
    protected: true,
  },
  {
    path: "/providers-moderation",
    element: (
      <ProtectedRoute>
        <ProvidersModerationPage />
      </ProtectedRoute>
    ),
    icon: HowToRegOutlinedIcon,
    protected: true,
  },
  {
    path: "/user-management",
    element: (
      <ProtectedRoute>
        <UserManagementPage />
      </ProtectedRoute>
    ),
    icon: GroupOutlinedIcon,
    protected: true,
  },
  {
    path: "/financial-overview",
    element: (
      <ProtectedRoute>
        <FinancialOverviewPage />
      </ProtectedRoute>
    ),
    icon: EuroOutlinedIcon,
    protected: true,
  },
  {
    path: "/services-catalog",
    element: (
      <ProtectedRoute>
        <ServicesCatalogPage />
      </ProtectedRoute>
    ),
    icon: MedicalInformationOutlinedIcon,
    protected: true,
  },
  {
    path: "/invoices",
    element: (
      <ProtectedRoute>
        <InvoicesPage />
      </ProtectedRoute>
    ),
    icon: DescriptionOutlinedIcon,
    protected: true,
  },
  {
    path: "/quote-requests",
    element: (
      <ProtectedRoute>
        <QuoteRequestsPage />
      </ProtectedRoute>
    ),
    icon: ChatBubbleOutlineOutlinedIcon,
    protected: true,
  },
  {
    path: "/profile",
    element: (
      <ProtectedRoute>
        <ProfilePage />
      </ProtectedRoute>
    ),
    protected: true,
  },
  {
    path: "/settings",
    element: (
      <ProtectedRoute>
        <SettingsPage />
      </ProtectedRoute>
    ),
    icon: SettingsOutlinedIcon,
    protected: true,
  },
  // Public routes
  { path: "/auth", element: <AuthPage /> },
];

// Export only protected routes for sidebar navigation
export const protectedRoutes = routes.filter(
  (route) => route.protected && route.icon
);
