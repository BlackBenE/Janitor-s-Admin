import React from 'react';
import {
  Box,
  IconButton,
  Tooltip,
  Menu,
  MenuItem,
  ListItemIcon,
  ListItemText,
} from '@mui/material';
import {
  RemoveRedEyeOutlined as ViewIcon,
  PictureAsPdf as PdfIcon,
  CheckCircle as CheckCircleIcon,
  Replay as RefundIcon,
  Refresh as RetryIcon,
  MoreVert as MoreVertIcon,
} from '@mui/icons-material';
import { GridRenderCellParams } from '@mui/x-data-grid';
import { PaymentWithDetails } from '../../../types/payments';
import { PAYMENTS_LABELS } from '../constants';

interface PaymentTableActionsProps {
  params: GridRenderCellParams;
  onViewDetails: (payment: PaymentWithDetails) => void;
  onDownloadPdf: (paymentId: string) => void;
  onMarkPaid: (paymentId: string) => void;
  onRefund: (paymentId: string) => void;
  onRetry: (paymentId: string) => void;
}

export const PaymentTableActions: React.FC<PaymentTableActionsProps> = ({
  params,
  onViewDetails,
  onDownloadPdf,
  onMarkPaid,
  onRefund,
  onRetry,
}) => {
  const [anchorEl, setAnchorEl] = React.useState<null | HTMLElement>(null);

  const handleMenuClick = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorEl(event.currentTarget);
  };

  const handleMenuClose = () => {
    setAnchorEl(null);
  };

  const payment = params.row as PaymentWithDetails;
  const invoiceId = payment.stripe_payment_intent_id || `INV-${payment.id.slice(-8)}`;

  const ActionsMenu = () => (
    <Menu
      anchorEl={anchorEl}
      open={Boolean(anchorEl)}
      onClose={handleMenuClose}
      transformOrigin={{ horizontal: 'right', vertical: 'top' }}
      anchorOrigin={{ horizontal: 'right', vertical: 'bottom' }}
      slotProps={{
        paper: {
          sx: {
            maxHeight: 400,
            width: '220px',
          },
        },
      }}
    >
      {/* Télécharger PDF - Disponible pour tous */}
      <MenuItem
        onClick={() => {
          onDownloadPdf(payment.id);
          handleMenuClose();
        }}
      >
        <ListItemIcon>
          <PdfIcon fontSize="small" />
        </ListItemIcon>
        <ListItemText primary={PAYMENTS_LABELS.actions.downloadPdf} />
      </MenuItem>

      {/* Marquer comme payé - Uniquement pour les paiements en attente */}
      {payment.status === 'pending' && (
        <MenuItem
          onClick={() => {
            onMarkPaid(payment.id);
            handleMenuClose();
          }}
        >
          <ListItemIcon>
            <CheckCircleIcon fontSize="small" />
          </ListItemIcon>
          <ListItemText primary={PAYMENTS_LABELS.actions.markAsPaid} />
        </MenuItem>
      )}

      {/* Rembourser - Uniquement pour les paiements payés */}
      {payment.status === 'paid' && (
        <MenuItem
          onClick={() => {
            onRefund(payment.id);
            handleMenuClose();
          }}
        >
          <ListItemIcon>
            <RefundIcon fontSize="small" />
          </ListItemIcon>
          <ListItemText primary={PAYMENTS_LABELS.actions.refundPayment} />
        </MenuItem>
      )}

      {/* Relancer - Uniquement pour les paiements échoués */}
      {payment.status === 'failed' && (
        <MenuItem
          onClick={() => {
            onRetry(payment.id);
            handleMenuClose();
          }}
        >
          <ListItemIcon>
            <RetryIcon fontSize="small" />
          </ListItemIcon>
          <ListItemText primary={PAYMENTS_LABELS.actions.retryPayment} />
        </MenuItem>
      )}
    </Menu>
  );

  return (
    <Box sx={{ display: 'flex', gap: 0.5, alignItems: 'center' }}>
      <Tooltip title={PAYMENTS_LABELS.actions.viewDetails}>
        <IconButton
          size="small"
          onClick={() => onViewDetails(payment)}
          sx={{ color: 'text.secondary', '&:hover': { color: 'primary.main' } }}
        >
          <ViewIcon fontSize="small" />
        </IconButton>
      </Tooltip>

      <Tooltip title={PAYMENTS_LABELS.actions.moreActions}>
        <IconButton
          size="small"
          onClick={handleMenuClick}
          sx={{ color: 'text.secondary', '&:hover': { color: 'primary.main' } }}
        >
          <MoreVertIcon fontSize="small" />
        </IconButton>
      </Tooltip>

      <ActionsMenu />
    </Box>
  );
};
