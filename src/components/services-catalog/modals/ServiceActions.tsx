import React from "react";
import { DialogActions, Button, Box, Divider } from "@mui/material";
import {
  Edit as EditIcon,
  Save as SaveIcon,
  Close as CancelIcon,
  CheckCircle as ApproveIcon,
  Cancel as RejectIcon,
  Delete as DeleteIcon,
} from "@mui/icons-material";
import { ServiceWithDetails } from "../../../types/services";

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
  return (
    <DialogActions
      sx={{
        p: 2,
        borderTop: "1px solid",
        borderColor: "divider",
        backgroundColor: "grey.50",
        justifyContent: "space-between",
      }}
    >
      {/* Actions de gauche - Actions sur le service */}
      <Box sx={{ display: "flex", gap: 1 }}>
        {!isEditMode && (
          <>
            {/* Approuver/Activer le service */}
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

            {/* Rejeter/Désactiver le service */}
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
          </>
        )}
      </Box>

      <Divider orientation="vertical" flexItem sx={{ mx: 1 }} />

      {/* Actions de droite - Actions de modal */}
      <Box sx={{ display: "flex", gap: 1 }}>
        {isEditMode ? (
          <>
            {/* Mode édition - Sauvegarder et annuler */}
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
          </>
        ) : (
          <>
            {/* Mode visualisation - Éditer et fermer */}
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

            {/* Supprimer (dangereux) */}
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

            <Button onClick={onClose} variant="contained" disabled={isLoading}>
              Fermer
            </Button>
          </>
        )}
      </Box>
    </DialogActions>
  );
};
