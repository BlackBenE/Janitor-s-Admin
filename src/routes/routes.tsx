import React from "react";
import { SvgIconTypeMap } from "@mui/material";
import { OverridableComponent } from "@mui/material/OverridableComponent";
import DashboardPage from "../components/dashboard/DashboardPage";
import { AuthPage as RefactoredAuthPage } from "../components/auth/AuthPage";
import { ProfilePage as RefactoredProfilePage } from "../components/profile/ProfilePage";
import PropertyApprovalsPage from "../components/property-approvals/PropertyApprovalsPage";
import QuoteRequestsPage from "../components/quote-requests/QuoteRequestsPage";
import ServicesCatalogPage from "../components/services-catalog/ServicesCatalogPage";
import { UserManagementPage } from "../components/userManagement";
import AnalyticsPage from "../components/analytics/AnalyticsPage";
import { ProtectedRoute } from "@/shared/components/routing";
import { ResetPasswordPage } from "../components/auth/ResetPasswordPage";
import AppsOutlinedIcon from "@mui/icons-material/AppsOutlined";
import ApartmentOutlinedIcon from "@mui/icons-material/ApartmentOutlined";
import GroupOutlinedIcon from "@mui/icons-material/GroupOutlined";
import EuroOutlinedIcon from "@mui/icons-material/EuroOutlined";
import MedicalInformationOutlinedIcon from "@mui/icons-material/MedicalInformationOutlined";
import ChatBubbleOutlineOutlinedIcon from "@mui/icons-material/ChatBubbleOutlineOutlined";
import DescriptionOutlinedIcon from "@mui/icons-material/DescriptionOutlined";
import AnalyticsOutlinedIcon from "@mui/icons-material/AnalyticsOutlined";
import { PaymentsPage } from "../components/payments/PaymentsPage";

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
    path: "/payments",
    element: (
      <ProtectedRoute>
        <PaymentsPage />
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
  { path: "/reset-password", element: <ResetPasswordPage /> },
];

// Export only protected routes for sidebar navigation
export const protectedRoutes = routes.filter(
  (route) => route.protected && route.icon
);
