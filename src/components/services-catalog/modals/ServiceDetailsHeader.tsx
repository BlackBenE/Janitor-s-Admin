import React from "react";
import {
  DialogTitle,
  Typography,
  IconButton,
  Box,
  Chip,
  Tooltip,
} from "@mui/material";
import {
  Close as CloseIcon,
  Build as ServiceIcon,
  CheckCircle as ActiveIcon,
  Cancel as InactiveIcon,
  Star as VipIcon,
} from "@mui/icons-material";
import { ServiceWithDetails } from "../../../types/services";

interface ServiceDetailsHeaderProps {
  service: ServiceWithDetails;
  onClose: () => void;
}

const getStatusColor = (
  isActive: boolean | null
):
  | "default"
  | "primary"
  | "secondary"
  | "error"
  | "info"
  | "success"
  | "warning" => {
  return isActive ? "success" : "error";
};

const getStatusIcon = (isActive: boolean | null) => {
  return isActive ? (
    <ActiveIcon fontSize="small" />
  ) : (
    <InactiveIcon fontSize="small" />
  );
};

const getStatusLabel = (isActive: boolean | null): string => {
  return isActive ? "Actif" : "Inactif";
};

const formatCurrency = (amount: number): string => {
  return new Intl.NumberFormat("fr-FR", {
    style: "currency",
    currency: "EUR",
  }).format(amount);
};

export const ServiceDetailsHeader: React.FC<ServiceDetailsHeaderProps> = ({
  service,
  onClose,
}) => {
  const statusColor = getStatusColor(service.is_active);
  const statusIcon = getStatusIcon(service.is_active);
  const statusLabel = getStatusLabel(service.is_active);

  return (
    <DialogTitle
      sx={{
        m: 0,
        p: 2,
        display: "flex",
        alignItems: "center",
        justifyContent: "space-between",
        borderBottom: "1px solid",
        borderColor: "divider",
        backgroundColor: "grey.50",
      }}
    >
      <Box sx={{ display: "flex", alignItems: "center", gap: 2, flex: 1 }}>
        {/* Icône et informations principales */}
        <Box sx={{ display: "flex", alignItems: "center", gap: 2 }}>
          <Box
            sx={{
              p: 1,
              borderRadius: 1,
              backgroundColor: "primary.main",
              color: "primary.contrastText",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
            }}
          >
            <ServiceIcon />
          </Box>

          <Box>
            <Typography variant="h6" component="div" sx={{ fontWeight: 600 }}>
              {service.name}
            </Typography>
            <Typography variant="body2" color="text.secondary">
              Service #{service.id.slice(-8)} • {service.category}
            </Typography>
          </Box>
        </Box>

        {/* Badges de statut */}
        <Box sx={{ display: "flex", gap: 1, ml: "auto", mr: 2 }}>
          {/* Statut principal */}
          <Tooltip title={`Service ${statusLabel.toLowerCase()}`}>
            <Chip
              icon={statusIcon}
              label={statusLabel}
              color={statusColor}
              size="small"
              variant="filled"
            />
          </Tooltip>

          {/* Badge VIP */}
          {service.is_vip_only && (
            <Tooltip title="Service VIP exclusif">
              <Chip
                icon={<VipIcon fontSize="small" />}
                label="VIP"
                color="warning"
                size="small"
                variant="filled"
              />
            </Tooltip>
          )}

          {/* Prix */}
          <Tooltip title="Prix de base">
            <Chip
              label={formatCurrency(service.base_price)}
              color="info"
              size="small"
              variant="outlined"
            />
          </Tooltip>
        </Box>
      </Box>

      {/* Bouton de fermeture */}
      <IconButton
        aria-label="close"
        onClick={onClose}
        sx={{
          color: "text.secondary",
          "&:hover": {
            backgroundColor: "action.hover",
          },
        }}
      >
        <CloseIcon />
      </IconButton>
    </DialogTitle>
  );
};
