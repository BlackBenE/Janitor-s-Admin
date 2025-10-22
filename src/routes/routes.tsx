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
// Test components moved to _obsolete
// import TestCompatibleHooks from "../components/userManagement/hooks/TestCompatibleHooks";
// import TestNewStatsSection from "../components/userManagement/hooks/TestNewStatsSection";
// Test components moved to _obsolete after migration
// import TestExportButton from "../components/userManagement/TestExportButton";
// import TestFiltersAndSearch from "../components/userManagement/TestFiltersAndSearch";
// import TestIntegrationFilters from "../components/userManagement/TestIntegrationFilters";
// import TestTabsWithNewHooks from "../components/userManagement/TestTabsWithNewHooks";
// import TestTableWithNewHooks from "../components/userManagement/TestTableWithNewHooks";
// import TestTableActionsSimple from "../components/userManagement/TestTableActionsSimple";
// import TestUseUsersHook from "../components/userManagement/TestUseUsersHook";
// import { TestUserMigrationMinimal } from "../components/userManagement/TestUserMigrationMinimal";
import AnalyticsPage from "../components/analytics/AnalyticsPage";
import ProtectedRoute from "../components/ProtectedRoute";
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

  // 🧪 ROUTES DE TEST - Désactivées après migration (composants dans _obsolete)
  /*
  {
    path: "/test-compatible-hooks",
    element: (
      <ProtectedRoute>
        <TestCompatibleHooks />
      </ProtectedRoute>
    ),
    protected: true,
  },
  {
    path: "/test-new-stats",
    element: (
      <ProtectedRoute>
        <TestNewStatsSection />
      </ProtectedRoute>
    ),
    protected: true,
  },
  {
    path: "/test-export-button",
    element: (
      <ProtectedRoute>
        <TestExportButton />
      </ProtectedRoute>
    ),
    protected: true,
  },
  {
    path: "/test-filters-search",
    element: (
      <ProtectedRoute>
        <TestFiltersAndSearch />
      </ProtectedRoute>
    ),
    protected: true,
  },
  {
    path: "/test-integration-filters",
    element: (
      <ProtectedRoute>
        <TestIntegrationFilters />
      </ProtectedRoute>
    ),
    protected: true,
  },
  {
    path: "/test-tabs-hooks",
    element: (
      <ProtectedRoute>
        <TestTabsWithNewHooks />
      </ProtectedRoute>
    ),
    protected: true,
  },
  {
    path: "/test-table-hooks",
    element: (
      <ProtectedRoute>
        <TestTableWithNewHooks />
      </ProtectedRoute>
    ),
    protected: true,
  },
  {
    path: "/test-table-actions",
    element: (
      <ProtectedRoute>
        <TestTableActionsSimple />
      </ProtectedRoute>
    ),
    protected: true,
  },
  {
    path: "/test-useusers-hook",
    element: (
      <ProtectedRoute>
        <TestUseUsersHook />
      </ProtectedRoute>
    ),
    protected: true,
  },
  {
    path: "/test-users-migration",
    element: (
      <ProtectedRoute>
        <TestUserMigrationMinimal />
      </ProtectedRoute>
    ),
    protected: true,
  },
  */

  // Public routes
  { path: "/auth", element: <RefactoredAuthPage /> },
  { path: "/reset-password", element: <ResetPasswordPage /> },
];

// Export only protected routes for sidebar navigation
export const protectedRoutes = routes.filter(
  (route) => route.protected && route.icon
);
