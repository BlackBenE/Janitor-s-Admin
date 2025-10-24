import React, { useState } from "react";
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  Typography,
  Box,
  Alert,
  CircularProgress,
  Divider,
} from "@mui/material";
import {
  Restore as RestoreIcon,
  Warning as WarningIcon,
  Info as InfoIcon,
} from "@mui/icons-material";
import { UserProfile } from "@/types/userManagement";
import {
  AnonymizationStatus,
  AnonymizationDetails,
} from "../components/AnonymizationStatus";
import { AnonymizationLevel } from "@/types/dataRetention";

interface RestoreUserModalProps {
  open: boolean;
  user: UserProfile | null;
  onClose: () => void;
  onConfirm: (userId: string) => Promise<void>;
  isRestoring: boolean;
}

export const RestoreUserModal: React.FC<RestoreUserModalProps> = ({
  open,
  user,
  onClose,
  onConfirm,
  isRestoring,
}) => {
  const [error, setError] = useState<string>("");

  const handleConfirm = async () => {
    if (!user) return;

    try {
      setError("");
      await onConfirm(user.id);
      onClose();
    } catch (err) {
      setError(
        err instanceof Error ? err.message : "Erreur lors de la restauration"
      );
    }
  };

  const handleClose = () => {
    if (!isRestoring) {
      onClose();
      setError("");
    }
  };

  const getRestorabilityStatus = () => {
    if (!user) return null;

    const anonymizationLevel = (user as any).anonymization_level;
    const anonymizedAt = (user as any).anonymized_at;
    const scheduledPurgeAt = (user as any).scheduled_purge_at;

    // Vérifier si la purge est déjà passée
    if (scheduledPurgeAt && new Date(scheduledPurgeAt) < new Date()) {
      return {
        canRestore: false,
        severity: "error" as const,
        title: "Restauration impossible",
        message:
          "Les données ont été définitivement purgées et ne peuvent plus être restaurées.",
        details: [],
      };
    }

    // Vérifier le niveau d'anonymisation
    switch (anonymizationLevel) {
      case AnonymizationLevel.FULL:
        return {
          canRestore: false,
          severity: "error" as const,
          title: "Restauration impossible",
          message:
            "L'utilisateur a été complètement anonymisé. Les données personnelles ne peuvent pas être restaurées.",
          details: [
            "Les données personnelles ont été définitivement anonymisées",
            "Seules les données métier anonymisées subsistent",
            "La restauration nécessiterait une re-création manuelle du compte",
          ],
        };

      case AnonymizationLevel.PARTIAL:
        return {
          canRestore: true,
          severity: "warning" as const,
          title: "Restauration possible avec limitations",
          message:
            "L'utilisateur peut être restauré, mais certaines données personnelles ont été anonymisées.",
          details: [
            "✅ Le compte utilisateur sera réactivé",
            "❌ Les données personnelles anonymisées ne seront pas restaurées",
            "✅ Les données métier et l'historique seront conservés",
            "⚠️ L'utilisateur devra mettre à jour ses informations personnelles",
          ],
        };

      case AnonymizationLevel.PURGED:
        return {
          canRestore: false,
          severity: "error" as const,
          title: "Utilisateur purgé",
          message:
            "Cet utilisateur a été programmé pour purge définitive et ne peut plus être restauré.",
          details: [],
        };

      default:
        // Soft delete simple sans anonymisation
        return {
          canRestore: true,
          severity: "info" as const,
          title: "Restauration complète possible",
          message:
            "L'utilisateur peut être entièrement restauré avec toutes ses données.",
          details: [
            "✅ Toutes les données personnelles seront restaurées",
            "✅ Tous les historiques et données métier seront conservés",
            "✅ Le compte sera immédiatement fonctionnel",
          ],
        };
    }
  };

  const restorabilityStatus = getRestorabilityStatus();

  return (
    <Dialog open={open} onClose={handleClose} maxWidth="md" fullWidth>
      <DialogTitle sx={{ display: "flex", alignItems: "center", gap: 1 }}>
        <RestoreIcon color="primary" />
        Restauration d'utilisateur
      </DialogTitle>

      <DialogContent>
        {user && (
          <>
            <Alert severity="info" sx={{ mb: 3 }}>
              <Typography variant="body2">
                Vous êtes sur le point de restaurer l'utilisateur{" "}
                <strong>{user.full_name || user.email}</strong>.
              </Typography>
            </Alert>

            {/* Informations sur le nettoyage des champs d'anonymisation */}
            <Alert severity="success" sx={{ mb: 3 }}>
              <Typography variant="subtitle2" gutterBottom>
                🔄 Nettoyage automatique lors de la restauration
              </Typography>
              <Typography variant="body2" sx={{ mb: 1 }}>
                Les champs suivants seront automatiquement remis à zéro :
              </Typography>
              <Box component="ul" sx={{ margin: 0, paddingLeft: 2 }}>
                <Typography component="li" variant="caption">
                  • deleted_at → null (utilisateur redevient actif)
                </Typography>
                <Typography component="li" variant="caption">
                  • deletion_reason → null
                </Typography>
                <Typography component="li" variant="caption">
                  • anonymization_level → null
                </Typography>
                <Typography component="li" variant="caption">
                  • anonymized_at → null
                </Typography>
                <Typography component="li" variant="caption">
                  • preserved_data_until → null
                </Typography>
                <Typography component="li" variant="caption">
                  • scheduled_purge_at → null (annulation des purges
                  programmées)
                </Typography>
              </Box>
            </Alert>

            {/* Informations utilisateur */}
            <Box sx={{ mb: 3 }}>
              <Typography variant="h6" gutterBottom>
                Informations utilisateur
              </Typography>

              <Box
                sx={{
                  p: 2,
                  bgcolor: "background.paper",
                  borderRadius: 1,
                  border: 1,
                  borderColor: "divider",
                }}
              >
                <Typography variant="body2">
                  <strong>Email :</strong> {user.email}
                </Typography>
                <Typography variant="body2">
                  <strong>Rôle :</strong> {user.role}
                </Typography>
                <Typography variant="body2">
                  <strong>Supprimé le :</strong>{" "}
                  {user.deleted_at
                    ? new Date(user.deleted_at).toLocaleString("fr-FR")
                    : "Non défini"}
                </Typography>
                <Typography variant="body2">
                  <strong>Raison :</strong>{" "}
                  {user.deletion_reason || "Non spécifiée"}
                </Typography>

                <Box sx={{ mt: 2 }}>
                  <AnonymizationStatus user={user} showDetails />
                </Box>
              </Box>

              <AnonymizationDetails user={user} />
            </Box>

            <Divider sx={{ my: 3 }} />

            {/* Statut de restaurabilité */}
            {restorabilityStatus && (
              <Box sx={{ mb: 3 }}>
                <Alert severity={restorabilityStatus.severity} sx={{ mb: 2 }}>
                  <Typography variant="subtitle2" gutterBottom>
                    {restorabilityStatus.title}
                  </Typography>
                  <Typography variant="body2">
                    {restorabilityStatus.message}
                  </Typography>
                </Alert>

                {restorabilityStatus.details.length > 0 && (
                  <Box sx={{ ml: 2 }}>
                    <Typography variant="body2" gutterBottom fontWeight="bold">
                      Détails de la restauration :
                    </Typography>
                    {restorabilityStatus.details.map((detail, index) => (
                      <Typography key={index} variant="body2" sx={{ mb: 0.5 }}>
                        {detail}
                      </Typography>
                    ))}
                  </Box>
                )}
              </Box>
            )}

            {error && (
              <Alert severity="error" sx={{ mb: 2 }}>
                {error}
              </Alert>
            )}

            {restorabilityStatus?.canRestore && (
              <Alert severity="warning" sx={{ mb: 2 }}>
                <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                  <WarningIcon />
                  <Typography variant="body2">
                    <strong>Important :</strong> La restauration réactivera
                    immédiatement le compte utilisateur. Assurez-vous que cette
                    action est justifiée et documentée.
                  </Typography>
                </Box>
              </Alert>
            )}
          </>
        )}
      </DialogContent>

      <DialogActions>
        <Button onClick={handleClose} disabled={isRestoring}>
          Annuler
        </Button>
        {restorabilityStatus?.canRestore && (
          <Button
            variant="contained"
            color="primary"
            onClick={handleConfirm}
            disabled={isRestoring || !user}
            startIcon={
              isRestoring ? <CircularProgress size={16} /> : <RestoreIcon />
            }
          >
            {isRestoring ? "Restauration..." : "Confirmer la restauration"}
          </Button>
        )}
      </DialogActions>
    </Dialog>
  );
};
