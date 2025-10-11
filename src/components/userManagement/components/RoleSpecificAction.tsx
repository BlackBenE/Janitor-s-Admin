import React from "react";
import { IconButton, Tooltip } from "@mui/material";
import {
  CalendarToday as CalendarTodayIcon,
  Build as BuildIcon,
  Payment as PaymentIcon,
  History as HistoryIcon,
} from "@mui/icons-material";
import { GridRenderCellParams } from "@mui/x-data-grid";
import { UserProfile, UserRole } from "../../../types/userManagement";

interface RoleSpecificActionProps {
  currentTabRole: UserRole | string;
  params: GridRenderCellParams<UserProfile>;
  onViewBookings: (userId: string, userName: string) => void;
  onManageSubscription: (userId: string, userName: string) => void;
  onManageServices: (userId: string, userName: string) => void;
  onShowAudit: (userId: string, userName: string) => void;
}

/**
 * Composant pour les actions spécifiques selon le rôle/onglet actuel
 */
export const RoleSpecificAction: React.FC<RoleSpecificActionProps> = ({
  currentTabRole,
  params,
  onViewBookings,
  onManageSubscription,
  onManageServices,
  onShowAudit,
}) => {
  const userName = params.row.full_name || "Unnamed User";

  // Pas d'action spécifique pour "All Users"
  if (currentTabRole === "all") return null;

  const getActionByRole = () => {
    switch (currentTabRole) {
      case "property_owner":
        return {
          icon: CalendarTodayIcon,
          tooltip: "View Bookings & Disputes",
          onClick: () => onViewBookings(params.row.id, userName),
        };

      case "tenant":
        return {
          icon: PaymentIcon,
          tooltip: "Manage Subscription",
          onClick: () => onManageSubscription(params.row.id, userName),
        };

      case "service_provider":
        return {
          icon: BuildIcon,
          tooltip: "Manage Services",
          onClick: () => onManageServices(params.row.id, userName),
        };

      case "admin":
        return {
          icon: HistoryIcon,
          tooltip: "View Audit History",
          onClick: () => onShowAudit(params.row.id, userName),
        };

      default:
        return null;
    }
  };

  const action = getActionByRole();

  if (!action) return null;

  const IconComponent = action.icon;

  return (
    <Tooltip title={action.tooltip}>
      <IconButton
        size="small"
        onClick={action.onClick}
        sx={{
          color: "text.secondary",
          "&:hover": { color: "primary.main" },
        }}
      >
        <IconComponent fontSize="small" />
      </IconButton>
    </Tooltip>
  );
};
