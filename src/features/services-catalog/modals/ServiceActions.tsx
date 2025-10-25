import React from "react";
import { Button, Box } from "@mui/material";
import {
  Edit as EditIcon,
  Save as SaveIcon,
  Close as CancelIcon,
  CheckCircle as ApproveIcon,
  Cancel as RejectIcon,
  Delete as DeleteIcon,
} from "@mui/icons-material";
import { ServiceWithDetails } from "@/types/services";

interface ServiceActionsProps {
  service: ServiceWithDetails;
  onClose: () => void;
  onEditService?: () => void;
  onApproveService?: (serviceId: string) => void;
  onRejectService?: (serviceId: string) => void;
  onDeleteService?: (serviceId: string) => void;
  onSaveEdit?: () => void;
  onCancelEdit?: () => void;
  isEditMode?: boolean;
  isLoading?: boolean;
}

export const ServiceActions: React.FC<ServiceActionsProps> = ({
  service,
  onClose,
  onEditService,
  onApproveService,
  onRejectService,
  onDeleteService,
  onSaveEdit,
  onCancelEdit,
  isEditMode = false,
  isLoading = false,
}) => {
  // Mode édition - Boutons Annuler et Sauvegarder
  if (isEditMode) {
    return (
      <Box
        sx={{
          display: "flex",
          justifyContent: "flex-end",
          alignItems: "center",
          gap: 1,
          p: 2,
          borderTop: 1,
          borderColor: "divider",
          bgcolor: "grey.50",
        }}
      >
        <Button
          onClick={onCancelEdit}
          startIcon={<CancelIcon />}
          disabled={isLoading}
          color="inherit"
        >
          Annuler
        </Button>
        <Button
          onClick={onSaveEdit}
          variant="contained"
          startIcon={<SaveIcon />}
          disabled={isLoading}
        >
          Sauvegarder
        </Button>
      </Box>
    );
  }

  // Mode visualisation - Tous les boutons alignés à droite
  return (
    <Box
      sx={{
        display: "flex",
        justifyContent: "flex-end",
        alignItems: "center",
        gap: 1,
        p: 2,
        borderTop: 1,
        borderColor: "divider",
        bgcolor: "grey.50",
      }}
    >
      {/* Supprimer (action dangereuse - en premier) */}
      {onDeleteService && (
        <Button
          onClick={() => onDeleteService(service.id)}
          startIcon={<DeleteIcon />}
          variant="outlined"
          color="error"
          disabled={isLoading}
          size="small"
        >
          Supprimer
        </Button>
      )}

      {/* Désactiver le service */}
      {onRejectService && (
        <Button
          variant="outlined"
          color="error"
          startIcon={<RejectIcon />}
          onClick={() => onRejectService(service.id)}
          disabled={isLoading}
          size="small"
        >
          Désactiver
        </Button>
      )}

      {/* Activer le service (si inactif) */}
      {!service.is_active && onApproveService && (
        <Button
          variant="contained"
          color="success"
          startIcon={<ApproveIcon />}
          onClick={() => onApproveService(service.id)}
          disabled={isLoading}
          size="small"
        >
          Activer
        </Button>
      )}

      {/* Éditer */}
      {onEditService && (
        <Button
          onClick={onEditService}
          startIcon={<EditIcon />}
          variant="outlined"
          disabled={isLoading}
        >
          Éditer
        </Button>
      )}

      {/* Fermer (action standard - en dernier) */}
      <Button onClick={onClose} variant="contained" disabled={isLoading}>
        Fermer
      </Button>
    </Box>
  );
};
