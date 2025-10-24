import React from "react";
import { Chip, Tooltip, Box, Typography } from "@mui/material";
import {
  Security as AnonymizedIcon,
  Delete as DeletedIcon,
  Schedule as ScheduledIcon,
  Warning as PurgedIcon,
  PersonOff as FullAnonymizedIcon,
} from "@mui/icons-material";
import { AnonymizationLevel } from "../../../types/dataRetention";
import { UserProfile } from "../../../types/userManagement";
import { formatDate } from "../../../utils";

interface AnonymizationStatusProps {
  user: UserProfile;
  showDetails?: boolean;
}

export const AnonymizationStatus: React.FC<AnonymizationStatusProps> = ({
  user,
  showDetails = false,
}) => {
  // Déterminer le statut d'anonymisation
  const getAnonymizationStatus = () => {
    if (!user.deleted_at) {
      return {
        level: "active" as const,
        label: "Actif",
        color: "success" as const,
        icon: null,
        description: "Utilisateur actif",
      };
    }

    // Vérifier si des colonnes d'anonymisation existent
    const anonymizationLevel = (user as any).anonymization_level;
    const anonymizedAt = (user as any).anonymized_at;

    if (!anonymizationLevel) {
      return {
        level: "deleted" as const,
        label: "Supprimé",
        color: "error" as const,
        icon: <DeletedIcon />,
        description: "Utilisateur supprimé (soft delete simple)",
      };
    }

    switch (anonymizationLevel) {
      case AnonymizationLevel.PARTIAL:
        return {
          level: "partial" as const,
          label: "Partiellement anonymisé",
          color: "warning" as const,
          icon: <AnonymizedIcon />,
          description:
            "Données personnelles anonymisées, données métier conservées",
        };

      case AnonymizationLevel.FULL:
        return {
          level: "full" as const,
          label: "Complètement anonymisé",
          color: "error" as const,
          icon: <FullAnonymizedIcon />,
          description: "Toutes les données anonymisées, conservation minimale",
        };

      case AnonymizationLevel.PURGED:
        return {
          level: "purged" as const,
          label: "Programmé pour purge",
          color: "error" as const,
          icon: <PurgedIcon />,
          description: "Suppression définitive programmée",
        };

      default:
        return {
          level: "unknown" as const,
          label: "Statut inconnu",
          color: "default" as const,
          icon: <ScheduledIcon />,
          description: "Statut d'anonymisation inconnu",
        };
    }
  };

  const status = getAnonymizationStatus();

  const getTooltipContent = () => {
    const anonymizedAt = (user as any).anonymized_at;
    const scheduledPurgeAt = (user as any).scheduled_purge_at;
    const deletionReason = user.deletion_reason;

    return (
      <Box>
        <Typography variant="body2" fontWeight="bold">
          {status.description}
        </Typography>
        <Box sx={{ mt: 1 }}>
          <Typography variant="caption" display="block">
            Supprimé le : {formatDate(user.deleted_at)}
          </Typography>
          {anonymizedAt && (
            <Typography variant="caption" display="block">
              Anonymisé le : {formatDate(anonymizedAt)}
            </Typography>
          )}
          {scheduledPurgeAt && (
            <Typography variant="caption" display="block">
              Purge prévue le : {formatDate(scheduledPurgeAt)}
            </Typography>
          )}
          {deletionReason && (
            <Typography variant="caption" display="block" sx={{ mt: 0.5 }}>
              Raison : {deletionReason}
            </Typography>
          )}
        </Box>
      </Box>
    );
  };

  if (!showDetails && status.level === "active") {
    return null; // Ne rien afficher pour les utilisateurs actifs
  }

  const chip = (
    <Chip
      size="small"
      label={status.label}
      color={status.color}
      {...(status.icon && { icon: status.icon })}
      variant={status.level === "active" ? "outlined" : "filled"}
    />
  );

  if (showDetails || status.level !== "active") {
    return (
      <Tooltip title={getTooltipContent()} arrow>
        {chip}
      </Tooltip>
    );
  }

  return chip;
};

interface AnonymizationDetailsProps {
  user: UserProfile;
}

export const AnonymizationDetails: React.FC<AnonymizationDetailsProps> = ({
  user,
}) => {
  const anonymizationLevel = (user as any).anonymization_level;
  const anonymizedAt = (user as any).anonymized_at;
  const anonymousId = (user as any).anonymous_id;

  if (!user.deleted_at || !anonymizationLevel) {
    return null;
  }

  return (
    <Box
      sx={{
        mt: 1,
        p: 1,
        bgcolor: "background.paper",
        borderRadius: 1,
        border: 1,
        borderColor: "divider",
      }}
    >
      <Typography
        variant="caption"
        display="block"
        fontWeight="bold"
        gutterBottom
      >
        Détails de l'anonymisation :
      </Typography>

      <Box sx={{ display: "flex", flexWrap: "wrap", gap: 1, mb: 1 }}>
        <AnonymizationStatus user={user} showDetails={false} />
      </Box>

      <Typography variant="caption" display="block" color="text.secondary">
        ID anonyme : {anonymousId || "Non défini"}
      </Typography>

      <Typography variant="caption" display="block" color="text.secondary">
        Anonymisé le :{" "}
        {anonymizedAt
          ? new Date(anonymizedAt).toLocaleString("fr-FR")
          : "Non défini"}
      </Typography>

      {user.deletion_reason && (
        <Typography variant="caption" display="block" color="text.secondary">
          Raison : {user.deletion_reason}
        </Typography>
      )}
    </Box>
  );
};
