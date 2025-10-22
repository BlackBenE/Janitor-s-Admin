import React from "react";
import {
  Card,
  CardContent,
  Typography,
  Box,
  Chip,
  Alert,
  LinearProgress,
} from "@mui/material";
import {
  Person as PersonIcon,
  Email as EmailIcon,
  Phone as PhoneIcon,
  CalendarToday as CalendarIcon,
  AccountCircle as AccountIcon,
  Security as SecurityIcon,
  Star as VipIcon,
  Shield as ShieldIcon,
  Warning as WarningIcon,
  CheckCircle as CheckIcon,
  Delete as DeleteIcon,
  Schedule as ScheduleIcon,
} from "@mui/icons-material";
import { UserProfileWithAnonymization } from "../../../types/userManagement";
import {
  AnonymizationLevel,
  DeletionReason,
} from "../../../types/dataRetention";

interface UserInfoSectionsProps {
  user: UserProfileWithAnonymization;
}

// Composant d'item d'information réutilisable
interface InfoItemProps {
  icon: React.ReactNode;
  label: string;
  value: string | React.ReactNode;
}

const InfoItem: React.FC<InfoItemProps> = ({ icon, label, value }) => (
  <Box sx={{ display: "flex", alignItems: "center", gap: 1, mb: 1 }}>
    {icon}
    <Typography variant="body2" color="text.secondary" sx={{ minWidth: 80 }}>
      {label}:
    </Typography>
    <Typography variant="body2">{value}</Typography>
  </Box>
);

export const UserInfoSections: React.FC<UserInfoSectionsProps> = ({ user }) => {
  // Fonctions utilitaires pour les rôles
  const getRoleColor = (role: string) => {
    switch (role) {
      case "admin":
        return "error";
      case "property_owner":
        return "primary";
      case "service_provider":
        return "secondary";
      case "traveler":
        return "info";
      default:
        return "default";
    }
  };

  const getRoleLabel = (role: string) => {
    switch (role) {
      case "admin":
        return "Administrator";
      case "property_owner":
        return "Property Owner";
      case "service_provider":
        return "Service Provider";
      case "traveler":
        return "Traveler";
      default:
        return role;
    }
  };

  // Fonctions utilitaires pour l'anonymisation
  const getAnonymizationColor = (level: string | null | undefined) => {
    switch (level) {
      case AnonymizationLevel.NONE:
        return "success";
      case AnonymizationLevel.PARTIAL:
        return "warning";
      case AnonymizationLevel.FULL:
        return "error";
      case AnonymizationLevel.PURGED:
        return "default";
      default:
        return "default";
    }
  };

  const getAnonymizationIcon = (level: string | null | undefined) => {
    switch (level) {
      case AnonymizationLevel.NONE:
        return <CheckIcon />;
      case AnonymizationLevel.PARTIAL:
        return <ShieldIcon />;
      case AnonymizationLevel.FULL:
        return <DeleteIcon />;
      case AnonymizationLevel.PURGED:
        return <DeleteIcon />;
      default:
        return <ShieldIcon />;
    }
  };

  const getAnonymizationDescription = (level: string | null | undefined) => {
    switch (level) {
      case AnonymizationLevel.NONE:
        return "Aucune anonymisation appliquée";
      case AnonymizationLevel.PARTIAL:
        return "Données personnelles anonymisées, données métier préservées";
      case AnonymizationLevel.FULL:
        return "Anonymisation complète, seuls les identifiants techniques restent";
      case AnonymizationLevel.PURGED:
        return "Données purgées définitivement";
      default:
        return "Niveau d'anonymisation inconnu";
    }
  };

  const getDeletionReasonLabel = (reason: string | null) => {
    switch (reason) {
      case DeletionReason.GDPR_COMPLIANCE:
      case "gdpr_compliance":
        return "Suppression RGPD";
      case DeletionReason.USER_REQUEST:
      case "user_request":
        return "Demande utilisateur";
      case DeletionReason.ADMIN_ACTION:
      case "admin_action":
        return "Suppression administrative";
      case DeletionReason.POLICY_VIOLATION:
      case "policy_violation":
        return "Suppression disciplinaire";
      case "Supprimé par l'administrateur":
        return "Suppression administrative";
      default:
        return reason || "Raison non spécifiée";
    }
  };

  const getRetentionProgress = () => {
    if (!user.anonymized_at) {
      return null;
    }

    const startDate = new Date(user.anonymized_at);
    const endDate = new Date(startDate.getTime() + 90 * 24 * 60 * 60 * 1000);
    const now = new Date();

    const totalDuration = endDate.getTime() - startDate.getTime();
    const elapsed = now.getTime() - startDate.getTime();
    const progress = Math.min(
      Math.max((elapsed / totalDuration) * 100, 0),
      100
    );

    return {
      progress,
      daysRemaining: Math.max(
        0,
        Math.ceil((endDate.getTime() - now.getTime()) / (1000 * 60 * 60 * 24))
      ),
      isExpired: now > endDate,
    };
  };

  const retentionInfo = getRetentionProgress();
  const isDeleted = user.deleted_at || user.anonymization_level;

  return (
    <Box sx={{ display: "flex", flexDirection: "column", gap: 2 }}>
      {/* Section 1: Informations de base */}
      <Card>
        <CardContent>
          <Typography variant="h6" gutterBottom>
            Basic Information
          </Typography>
          <InfoItem
            icon={<PersonIcon color="action" fontSize="small" />}
            label="Name"
            value={user.full_name || "Not specified"}
          />
          <InfoItem
            icon={<EmailIcon color="action" fontSize="small" />}
            label="Email"
            value={user.email}
          />
          <InfoItem
            icon={<PhoneIcon color="action" fontSize="small" />}
            label="Phone"
            value={user.phone || "Not specified"}
          />
          <InfoItem
            icon={<CalendarIcon color="action" fontSize="small" />}
            label="Created"
            value={
              user.created_at
                ? new Date(user.created_at).toLocaleDateString()
                : "Unknown"
            }
          />
        </CardContent>
      </Card>

      {/* Section 2: Informations de compte */}
      <Card>
        <CardContent>
          <Typography variant="h6" gutterBottom>
            Account Information
          </Typography>

          <Box sx={{ display: "flex", flexDirection: "column", gap: 2 }}>
            <Box>
              <Typography
                variant="caption"
                color="text.secondary"
                display="block"
                gutterBottom
              >
                Role & Permissions
              </Typography>
              <Chip
                icon={<AccountIcon />}
                label={getRoleLabel(user.role)}
                color={getRoleColor(user.role)}
                sx={{ mb: 1 }}
              />
            </Box>

            <Box>
              <Typography
                variant="caption"
                color="text.secondary"
                display="block"
                gutterBottom
              >
                Account Status
              </Typography>
              <Box sx={{ display: "flex", gap: 1, flexWrap: "wrap" }}>
                <Chip
                  label={user.account_locked ? "Locked" : "Active"}
                  color={user.account_locked ? "error" : "success"}
                  size="small"
                />
                <Chip
                  label={user.profile_validated ? "Verified" : "Unverified"}
                  color={user.profile_validated ? "success" : "warning"}
                  size="small"
                />
                {user.vip_subscription && (
                  <Chip
                    icon={<VipIcon />}
                    label="VIP Member"
                    color="primary"
                    size="small"
                  />
                )}
              </Box>
            </Box>

            <Box>
              <Typography
                variant="caption"
                color="text.secondary"
                display="block"
                gutterBottom
              >
                Security Information
              </Typography>
              <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                <SecurityIcon color="action" fontSize="small" />
                <Typography variant="body2">
                  Last updated:{" "}
                  {user.updated_at
                    ? new Date(user.updated_at).toLocaleDateString()
                    : "Unknown"}
                </Typography>
              </Box>
            </Box>
          </Box>
        </CardContent>
      </Card>

      {/* Section 3: Informations d'anonymisation (seulement si applicable) */}
      {isDeleted && (
        <Card sx={{ border: 1, borderColor: "warning.main" }}>
          <CardContent>
            {/* Alerte principale pour utilisateur supprimé */}
            {user.deleted_at && (
              <Alert severity="warning" sx={{ mb: 2 }}>
                <Typography variant="body2" fontWeight="medium">
                  🗑️ Utilisateur supprimé le{" "}
                  {new Date(user.deleted_at).toLocaleDateString()}
                </Typography>
              </Alert>
            )}

            <Box sx={{ display: "flex", alignItems: "center", gap: 1, mb: 2 }}>
              {getAnonymizationIcon(user.anonymization_level)}
              <Typography variant="h6" color="text.primary">
                Statut d'anonymisation
              </Typography>
            </Box>

            {/* Niveau d'anonymisation */}
            <Box sx={{ mb: 2 }}>
              <Box
                sx={{ display: "flex", alignItems: "center", gap: 1, mb: 1 }}
              >
                <Typography variant="body2" color="text.secondary">
                  Niveau:
                </Typography>
                <Chip
                  label={user.anonymization_level}
                  color={getAnonymizationColor(user.anonymization_level)}
                  size="small"
                  icon={getAnonymizationIcon(user.anonymization_level)}
                />
              </Box>
              <Typography variant="body2" color="text.secondary">
                {getAnonymizationDescription(user.anonymization_level)}
              </Typography>
            </Box>

            {/* Raison de la suppression/anonymisation */}
            {user.deletion_reason && (
              <Box sx={{ mb: 2 }}>
                <Typography variant="body2" color="text.secondary" gutterBottom>
                  Raison: {getDeletionReasonLabel(user.deletion_reason)}
                </Typography>
              </Box>
            )}

            {/* Dates importantes */}
            <Box sx={{ mb: 2 }}>
              {user.deleted_at && (
                <Typography variant="body2" color="text.secondary" gutterBottom>
                  Supprimé le: {new Date(user.deleted_at).toLocaleDateString()}
                </Typography>
              )}
              {user.anonymized_at && (
                <Typography variant="body2" color="text.secondary" gutterBottom>
                  Anonymisé le:{" "}
                  {new Date(user.anonymized_at).toLocaleDateString()}
                </Typography>
              )}
            </Box>

            {/* Progression de la rétention des données */}
            {retentionInfo &&
              user.anonymization_level !== AnonymizationLevel.PURGED && (
                <Box sx={{ mb: 2 }}>
                  <Box
                    sx={{
                      display: "flex",
                      alignItems: "center",
                      gap: 1,
                      mb: 1,
                    }}
                  >
                    <ScheduleIcon fontSize="small" color="action" />
                    <Typography variant="body2" color="text.secondary">
                      Rétention des données
                    </Typography>
                  </Box>

                  <LinearProgress
                    variant="determinate"
                    value={retentionInfo.progress}
                    sx={{ mb: 1 }}
                    color={
                      retentionInfo.isExpired
                        ? "error"
                        : retentionInfo.progress > 80
                        ? "warning"
                        : "primary"
                    }
                  />

                  <Typography variant="caption" color="text.secondary">
                    {retentionInfo.isExpired
                      ? "Période de rétention expirée - Purge programmée"
                      : `${retentionInfo.daysRemaining} jours restants`}
                  </Typography>
                </Box>
              )}

            {/* Alertes spécifiques */}
            {user.anonymization_level === AnonymizationLevel.PURGED && (
              <Alert severity="error" sx={{ mt: 1 }}>
                <Typography variant="body2">
                  Toutes les données de cet utilisateur ont été définitivement
                  supprimées.
                </Typography>
              </Alert>
            )}

            {retentionInfo?.isExpired &&
              user.anonymization_level !== AnonymizationLevel.PURGED && (
                <Alert severity="warning" sx={{ mt: 1 }}>
                  <Typography variant="body2">
                    La période de rétention légale est expirée. La purge
                    définitive est programmée.
                  </Typography>
                </Alert>
              )}

            {user.anonymization_level === AnonymizationLevel.FULL && (
              <Alert severity="info" sx={{ mt: 1 }}>
                <Typography variant="body2">
                  Cet utilisateur a été complètement anonymisé. Seules les
                  données techniques sont conservées.
                </Typography>
              </Alert>
            )}
          </CardContent>
        </Card>
      )}
    </Box>
  );
};
