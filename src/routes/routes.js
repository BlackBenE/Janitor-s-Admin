import DashboardPage from "../pages/dashboardPage";
import FinancialOverviewPage from "../pages/financialOverviewPage";
import InvoicesPage from "../pages/InvoicesPage";
import Login from "../pages/loginPage";
import ProfilePage from "../pages/profilePage";
import PropertyApprovalsPage from "../pages/propertyApprovalsPage";
import ProvidersModerationPage from "../pages/providersModerationPage";
import QuoteRequestsPage from "../pages/quoteRequestsPage";
import ServicesCatalogPage from "../pages/servicesCatalogPage";
import SettingsPage from "../pages/settingsPage";
import UserManagementPage from "../pages/userManagementPage";
import AppsOutlinedIcon from "@mui/icons-material/AppsOutlined";
import ApartmentOutlinedIcon from "@mui/icons-material/ApartmentOutlined";
import HowToRegOutlinedIcon from "@mui/icons-material/HowToRegOutlined";
import GroupOutlinedIcon from "@mui/icons-material/GroupOutlined";
import EuroOutlinedIcon from "@mui/icons-material/EuroOutlined";
import MedicalInformationOutlinedIcon from "@mui/icons-material/MedicalInformationOutlined";
import SettingsOutlinedIcon from "@mui/icons-material/SettingsOutlined";
import ChatBubbleOutlineOutlinedIcon from "@mui/icons-material/ChatBubbleOutlineOutlined";
import DescriptionOutlinedIcon from "@mui/icons-material/DescriptionOutlined";

export const routes = [
  { path: "/", element: <DashboardPage />, icon: AppsOutlinedIcon },
  {
    path: "/property-approvals",
    element: <PropertyApprovalsPage />,
    icon: ApartmentOutlinedIcon,
  },
  {
    path: "/providers-moderation",
    element: <ProvidersModerationPage />,
    icon: HowToRegOutlinedIcon,
  },
  {
    path: "/user-management",
    element: <UserManagementPage />,
    icon: GroupOutlinedIcon,
  },

  {
    path: "/financial-overview",
    element: <FinancialOverviewPage />,
    icon: EuroOutlinedIcon,
  },
  {
    path: "/services-catalog",
    element: <ServicesCatalogPage />,
    icon: MedicalInformationOutlinedIcon,
  },
  {
    path: "/invoices",
    element: <InvoicesPage />,
    icon: DescriptionOutlinedIcon,
  },
  { path: "/login", element: <Login /> },
  { path: "/profile", element: <ProfilePage /> },

  {
    path: "/quote-requests",
    element: <QuoteRequestsPage />,
    icon: ChatBubbleOutlineOutlinedIcon,
  },

  { path: "/settings", element: <SettingsPage />, icon: SettingsOutlinedIcon },
];
