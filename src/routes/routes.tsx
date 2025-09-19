import React from "react";
import { SvgIconTypeMap } from "@mui/material";
import { OverridableComponent } from "@mui/material/OverridableComponent";
import DashboardPage from "../components/dashboard/DashboardPage";
import FinancialOverviewPage from "../components/financialoverview/FinancialOverviewPage";
import InvoicesPage from "../components/invoices/InvoicesPage";
import { AuthPage as RefactoredAuthPage } from "../components/auth/AuthPage";
import { ProfilePage as RefactoredProfilePage } from "../components/profile/ProfilePage";
import PropertyApprovalsPage from "../components/property-approvals/PropertyApprovalsPage";
import ProvidersModerationPage from "../components/providers-moderation/ProvidersModerationPage";
import QuoteRequestsPage from "../components/quote-requests/QuoteRequestsPage";
import ServicesCatalogPage from "../components/services-catalog/ServicesCatalogPage";
import UserManagementPage from "../components/userManagement/UserManagementPage";
import AnalyticsPage from "../components/analytics/AnalyticsPage";
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
import AnalyticsOutlinedIcon from "@mui/icons-material/AnalyticsOutlined";

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
    path: "/analytics",
    element: (
      <ProtectedRoute>
        <AnalyticsPage />
      </ProtectedRoute>
    ),
    icon: AnalyticsOutlinedIcon,
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
        <RefactoredProfilePage />
      </ProtectedRoute>
    ),
    protected: true,
  },
  // Public routes
  { path: "/auth", element: <RefactoredAuthPage /> },
];

// Export only protected routes for sidebar navigation
export const protectedRoutes = routes.filter(
  (route) => route.protected && route.icon
);
